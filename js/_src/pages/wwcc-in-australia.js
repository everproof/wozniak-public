
$(function () {
    var $buttons = $('#state-info-toggle').find('button');
    var $details = $('.details');

    $buttons.on('click', function () {
        var $clickedButton = $(this);
        var state = $clickedButton.attr('data-state');
        $details.addClass('hidden');
        $buttons.removeClass('selected');
        $details.filter('[data-state="' + state + '"]').removeClass('hidden');
        $clickedButton.addClass('selected');
    });
});
