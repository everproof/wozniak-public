(function () {
    /**
     * @param {String} modalId
     * @returns {Promise}
     */
    function showModal(modalId) {
        var isFormFilled = function($form) {
            var isFilled = true;
            $form.find('[required]').each(function () {
                var $input = $(this);
                isFilled = isFilled && $input.val();
            });
            return isFilled;
        };

        return new Promise(function (resolve, reject) {
            var $modal = $('#' + modalId);
            var $form = $modal.find('form');
            var $errorMessage = $modal.find('.error');
            $modal.modal('show');
            $modal.off('hidden.bs.modal').on('hide.bs.modal', function () {
                $form.trigger('reset');
            });

            var afterSubmit = 'custom.submit.after';
            $form.off(afterSubmit).on(afterSubmit, function (event, options) {
                options.preventSuccessMessage();
                $modal.modal('hide');
                $modal.one('hidden.bs.modal', function () {
                    resolve();
                });
            });
        });
    }

    window.Dialog = {
        /**
         * @returns {Promise}
         */
        captureDetails: function () {
            return showModal('capture-details-modal');
        },
        /**
         * @return Promise
         */
        captureWwccCheckerDetails: function () {
            return showModal('wwcc-checker-capture-modal');
        },
        video: function () {
            $('#video-modal').modal('show');
        }
    };
})();