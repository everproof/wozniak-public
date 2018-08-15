route('/refer/', function () {
    $(function ($) {
        $('#contact-form').on('custom.submit.before', function(){
            // Get the REFERRALCODE value from the querystring
            var queryString = window.location.href.split('?')[1] || "";
            var rawParams = queryString.split('&');
            var params = rawParams.reduce(function (carry, current) {
                var split = current.split('=');
                var key = split[0] || "";
                var value = split[1] || "";
                carry[key] = value;
                return carry;
            }, {});

            // Inject REFERRALCODE into hidden field, so it's serialized in the email
            $('#referrer').val(params['REFERRALCODE']);
        })
    });
});
