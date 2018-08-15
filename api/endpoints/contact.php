<?php
/**
 * Created by PhpStorm.
 * User: bohda
 * Date: 28/11/2016
 * Time: 9:38 AM
 */

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(400);
    exit;
}

require_once "../bootstrap.php";

use App\Cache;
use App\ContactInfo;
use App\Template;
use App\Config;
use GuzzleHttp\Client;


/*
 * Send the notification email that someone has submitted the contact form
 */

$info = new ContactInfo($_POST);

if (checkRecaptcha($info)) {
    $notificationEmail = createMail();
    sendNotificationEmail($notificationEmail, $info);

    if ($info->name && $info->email) {
        $confirmEmail = createMail();
        sendConfirmationEmail($confirmEmail, $info);
    }
} else {
    http_response_code(400);
}

\App\Log::flush();


/**
 * Create a new PHPMailer object
 * @return PHPMailer
 */
function createMail() {
    $mail = new PHPMailer();

    // Enable verbose debug output
    $mail->SMTPDebug = 3;

    $mail->Debugoutput = function ($message, $level) {
        \App\Log::write($message, $level);
    };

    $mail->isSMTP();
    $mail->Host = Config::read("email.gmail.host");
    $mail->SMTPAuth = Config::read("email.gmail.use_auth");
    $mail->Username = Config::read("email.gmail.username");
    $mail->Password = Config::read("email.gmail.password");
    $mail->SMTPSecure = Config::read("email.gmail.security");
    $mail->Port = Config::read("email.gmail.port");

    $mail->setFrom(Config::read("email.from.email"), Config::read("email.from.name"));
    $mail->addReplyTo(Config::read("email.from.email"), Config::read("email.from.name"));

    $mail->isHTML(true);

    return $mail;
}

function sendNotificationEmail(PHPMailer $email, ContactInfo $info) {
    foreach (Config::read("email.notify") as $sendTo) {
        $email->addAddress($sendTo["email"], $sendTo["name"]);
    }

    $email->Subject = "Contact Form Submitted: " . $info->organisation . " (" . $info->formName . ")";
    $email->Body    = Template::render("email/notification.html", [ "{{message}}" => $info->asHtml() ]);
    $email->AltBody = Template::render("email/notification.txt", [ "{{message}}" => $info->asRawString() ]);

    if(!$email->send()) {
        App\Log::write($email->ErrorInfo);
        Rollbar::report_message("Unable to send email", "error", $email->ErrorInfo);
    }
}

function sendConfirmationEmail(PHPMailer $email, ContactInfo $info) {
    $email->addAddress($info->email);
    $email->Subject = "Thanks for contacting Everproof";
    $email->Body = Template::render("email/confirmation.html", [ "{{name}}" => $info->name ]);
    $email->AltBody = Template::render("email/confirmation.txt", [ "{{name}}" => $info->name ]);

    if(!$email->send()) {
        App\Log::write($email->ErrorInfo);
        Rollbar::report_message("Unable to send email", "error", $email->ErrorInfo);
    }
}

function checkRecaptcha(ContactInfo $info) {
    if (strpos($info->formName, "Video Capture") === 0 ||
        strpos($info->formName, "WWCC Verification") === 0) {
        $captchaKey = "capture_details_form";
    } elseif ($info->formName === "Demo Request") {
        $captchaKey = "demo_form";
    } else {
        $captchaKey = "contact_form";
    }

    $options = [
        "headers" => [
            "Content-Type" => "application/x-www-form-urlencoded",
        ],
        "body" => http_build_query([
            "secret" => Config::read("recaptcha.$captchaKey.secret_key"),
            "response" => $info->recaptchaResponse,
            "remoteip" => $_SERVER["REMOTE_ADDR"],
        ]),
    ];
    $httpClient = new Client();
    $response = $httpClient->request('POST', 'https://www.google.com/recaptcha/api/siteverify', $options);
    $responseData = json_decode($response->getBody(), true);
    return $responseData["success"];
}
