//= require moment
//= require utils
//= require unslider
//= require router
//= require dialogs.js
//= require pages/all
//= require pages/index
//= require pages/individuals
//= require pages/wwcc-checker
//= require pages/wwcc-in-australia
//= require pages/refer

$(function () {
    var $hellobar = $('.hellobar');
    var lastPosition = 0;
    $(window).on('scroll', function (event) {
      var scrollPosition = $(document).scrollTop();

      if (scrollPosition <= 100) {
        $hellobar.slideDown();
      } else if (Math.abs(lastPosition - scrollPosition) > 50) {
        if (lastPosition < scrollPosition) {
          $hellobar.slideUp();
        } else {
          $hellobar.slideDown();
        }
        lastPosition = scrollPosition;
      }
    });

    $('.box .content').matchHeight();

    if($(window).width() > 768) {
        $('.package .content').matchHeight({byRow: false});
    }

    $('[data-text-change]').each(function () {
        var $element = $(this);
        var strings = $element.attr('data-text-change').split('|');

        $element.typed({
            strings: strings,
            typeSpeed: 50,
            startDelay: 0,
            backSpeed: 50,
            shuffle: false,
            backDelay: 2000,
            loop: true
        });
    });

    var $tracking = $('form input[name=formName]');
    if ($tracking.length) {
        var urlSplit = window.location.href.split('?');
        if (urlSplit.length >= 2) {
            var query = parseQueryString(urlSplit[1]);
            $tracking.val($tracking.val() + ' (' + query['r'] + ')');
        }
    }

    $('form').each(function () {
        var $form = $(this);
        var $message = $form.find('.message');

        $form.on('blur', 'input', function () {
            var $input = $(this);
            $input.removeClass('error');
            $message.removeClass('hidden success');
            $message.addClass('hidden');
            $message.text('');
        })
    });

    // Allow custom validation messages through the data-invalid-message attribute
    $('input').filter('[data-invalid-message]').each(function () {
        var $input = $(this);
        var input = $input[0];
        var invalidMessage = $input.data('invalid-message');
        $input.on('invalid', function () {
            input.setCustomValidity(invalidMessage);
        });

        $input.on('change', function () {
            input.setCustomValidity('');
        });
    });


    $(document).on('submit', '#contact-form, #capture-form', function(event) {
        event.preventDefault();
        
        var $form = $(this);
        var $message = $form.find('.message');
        var hasErrors = false;

        $form.find('input').each(function () {
            var $input = $(this);
            if ($input.attr('required') && !$input.val().trim()) {
                $input.addClass('error');
                $message.removeClass('hidden success');
                $message.addClass('error');
                $message.text('Please fill in all required fields');
                hasErrors = true;
            }
        });

        var $recaptcha = $form.find('.g-recaptcha-response');
        var formHasRecaptcha = $recaptcha.length !== 0;
        var recaptchaValue = ($recaptcha.val() || "").trim();

        if (formHasRecaptcha && !recaptchaValue) {
          $message
            .text('Please complete the recaptcha')
            .addClass('error')
            .removeClass('hidden success');
        } else if (!hasErrors) {
            $form.trigger('custom.submit.before');
            
            $.ajax({
                dataType: 'html',
                method: $form.attr('method'),
                data: $form.serialize(),
                url: $form.attr('action'),
            });

            var successOptions = {
                _preventSuccessMessage: false,
                preventSuccessMessage: function () {
                    this._preventSuccessMessage = true;
                }
            };

            $form.trigger('custom.submit.after', [successOptions]);
            $form.trigger('reset');

            if (!successOptions._preventSuccessMessage) {
                $message.text('Thanks for your interest. We\'ll be in touch shortly.');
                $message.addClass('success');
                $message.removeClass('hidden');
            }
        }
    });
});

/**
 * Takes a query string and converts it to an object
 * @param {String} queryString
 * @returns {Object.<String, String>}
 */
function parseQueryString(queryString) {
    var data = {};
    $.each(queryString.split('&'), function (index, value) {
        var split = value.split('=');
        data[split[0]] = split[1] || true;
    });
    return data;
}
