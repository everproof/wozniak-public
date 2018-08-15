(function () {
    window.Utils = {
        hasScrollbar: function () {
            return getScrollbarWidth() > 0;
        },
        getScrollbarWidth: function () {
            return window.innerWidth - document.body.offsetWidth;
        }
    };
})();