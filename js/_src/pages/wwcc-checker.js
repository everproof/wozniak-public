/**
 * Created by bohdan on 18/04/17.
 */

/**
 * @typedef {Object} Provider
 * @property {String} name
 * @property {String} key
 * @property {Object.<String, String>} fields
 */

/**
 * @typedef {Object} VerificationResponse
 * @property {String} FirstName
 * @property {String} InstitutionName
 * @property {String} MiddleName
 * @property {String} LastName
 * @property {[]} Qualifications
 * @property {String} VerificationMessage
 * @property {String} VerifiedDateTime - Time string like 2017-04-19 10:42:11.116675
 * @property {Number} VerifiedStatus - Verified: 1, NotFound: 2, Error: 3, Expired: 4, Revoked: 5, Pending: 6
 */

/**
 * @type {Provider[]}
 */
var VERIFICATION_PROVIDERS = [
    {
        name: 'Victoria',
        courseProvider: 'Department of Justice & Regulation (VIC)',
        qualificationTitle: 'Working with Children Check (VIC)',
        fields: {
            'FirstName': 'First Name',
            'LastName': 'Last Name',
            'StudentNumber': 'Card Number',
        },
    },
    {
        name: 'WA',
        courseProvider: 'Department for Child Protection and Family Support (WA)',
        qualificationTitle: 'Working with Children Check (WA)',
        fields: {
            'FirstName': 'First Name',
            'LastName': 'Last Name',
            'StudentNumber': 'Card Number',
        },
    },
    {
        name: 'Blue Card',
        courseProvider: 'Department of Justice (QLD) - Blue Card',
        qualificationTitle: 'Working with Children Check - Blue Card (QLD)',
        fields: {
            'FirstName': 'First Name',
            'MiddleName': 'Middle Name',
            'LastName': 'Last Name',
            'StudentNumber': 'Card Number',
            'date:ExpiryDate': 'Expiry Date',
        },
    },
    {
        name: 'Exemption Card',
        courseProvider: 'Department of Justice (QLD) - Exemption Card',
        qualificationTitle: 'Working with Children Check - Exemption Card (QLD)',
        fields: {
            'FirstName': 'First Name',
            'MiddleName': 'Middle Name',
            'LastName': 'Last Name',
            'StudentNumber': 'Card Number',
        },
    },
    {
        name: 'Tasmania',
        courseProvider: 'Department of Justice (TAS)',
        qualificationTitle: 'Working with Children Registration (TAS)',
        fields: {
            'FirstName': 'First Name',
            'LastName': 'Last Name',
            'StudentNumber': 'Card Number',
        },
    },
];

/**
 * @type {Object.<String, {id: number, label: string, className: string}>}
 */
var VERIFY_STATUS = {
    VERIFIED: {
        id: 1,
        label: 'Verified',
        className: 'verified',
    },
    NOT_FOUND: {
        id: 2,
        label: 'The card details provided cannot be validated.',
        className: 'invalid',
    },
    ERROR: {
        id: 3,
        label: 'There was an error submitting the verification request. Please try again later.',
        className: 'warning',
    },
    EXPIRED:  {
        id: 4,
        label: 'Expired',
        className: 'invalid',
    },
    REVOKED:  {
        id: 5,
        label: 'Revoked',
        className: 'invalid',
    },
    PENDING:  {
        id: 6,
        label: 'Pending',
        className: 'warning',
    },
};

route('/wwcc-checker/', function () {
    var detailsCaptured = false;
    var $wrapper = $('#wwcc-verification');
    var $providers = $wrapper.find('.providers');
    var $tableWrapper = $wrapper.find('.fields');

    $providers.on('change', 'input', function () {
        var $input = $(this);
        var providerName = $input.val();
        var selectedProvider = VERIFICATION_PROVIDERS.find(function (provider) {
            return provider.name === providerName;
        });

        var $oldTable = $tableWrapper.find('table');
        var tableState = getCurrentTableState($oldTable);

        var $table = generateInputs(selectedProvider);
        $tableWrapper.html($table);

        fillTableFromState($table, tableState);
    });

    $wrapper.find('.fields').on('change', 'input', function () {
        var $input = $(this);
        $input.closest('tr').removeClass();
    });

    $.each(VERIFICATION_PROVIDERS, function (index, provider) {
        var isChecked = index === 0;
        $providers.append(buildProviderListItem(provider, isChecked));
    });

    // Manually trigger a change to get the inputs to render
    $providers.children().first().find('input').trigger('change');

    $wrapper.find('form').on('submit', function (event) {
        var $form = $(this);
        event.preventDefault();

        if (!detailsCaptured) {
            Dialog.captureWwccCheckerDetails().then(function() {
                detailsCaptured = true;
                submitVerification($form);
            });
        } else {
            submitVerification($form);
        }
    });
});

/**
 * @param {jQuery} $table
 * @return {Object.<String, String>[]|null}
 */
function getCurrentTableState($table) {
    var $rows = $table.find('tr').not('.header');

    return $.map($rows, function (item) {
        var $row = $(item);
        var $inputs = $row.find('input');

        return $inputs.toArray().reduce(function (carry, input) {
            var $input = $(input);
            carry[$input.prop('name')] = $input.val();
            return carry;
        }, {});
    });
}

/**
 * @param {jQuery} $table
 * @param {Object.<String, String>[]} state
 */
function fillTableFromState($table, state) {
    var $rows = $table.find('tr').not('.header');

    $rows.each(function (index, item) {
        var $row = $(item);
        var stateRow = state[index] || {};

        $.each(Object.keys(stateRow), function (index, key) {
            var value = stateRow[key];
            $row.find('input[name=' + key + ']').val(value);
        });
    });
}

/**
 * @param {Provider} provider
 * @return {jQuery}
 */
function generateInputs(provider) {
    var $table = $('<table></table>');

    var fields = getObjectValues(provider.fields);
    var $headings = makeHeadings(fields);
    $headings.appendTo($table);

    for (var i = 0; i < 5; i++) {
        var $row = $('<tr></tr>');

        for (var key in provider.fields) {
            if (provider.fields.hasOwnProperty(key)) {
                var $tableCell = $('<td></td>');
                $tableCell.appendTo($row);

                var label = provider.fields[key];
                var split = key.split(':');
                // Type is the bit before the ':'. Defaults to text.
                var type = split.length === 2 ? split[0] : 'text';
                var id = split.length === 2 ? split[1] : split[0];

                var $input = makeInput(id, label, type);
                $input.appendTo($tableCell);
            }
        }

        var $statusCell = $('<td></td>');
        $statusCell.addClass('status');
        $statusCell.appendTo($row);

        $row.appendTo($table);
    }

    return $table;
}

/**
 * @param {String[]} headings
 * @returns {*|jQuery|HTMLElement}
 */
function makeHeadings(headings) {
    var $headerRow = headings.reduce(function ($header, headingTitle) {
        var $tableCell = $('<th></th>');
        $tableCell.text(headingTitle);

        $header.append($tableCell);
        return $header;
    }, $('<tr></tr>'));

    $headerRow.addClass('header');

    var $statusCell = $('<th></th>');
    $statusCell.addClass('status');
    $statusCell.text('Status');
    $statusCell.appendTo($headerRow);

    return $headerRow;
}

function makeInput(id, label, type) {
    var $input = $('<input />');
    $input.prop('id', id);
    $input.prop('name', id);
    $input.prop('type', type);
    $input.prop('placeholder', label);

    return $input;
}

/**
 * @param {Provider} provider
 * @param {Boolean} isChecked
 * @returns {jQuery}
 */
function buildProviderListItem(provider, isChecked) {
    var inputID = 'provider-' + provider.name;
    var $listItem = $('<li></li>');

    var $radio = $('<input />');
    $radio.prop('id', inputID);
    $radio.prop('type', 'radio');
    $radio.prop('name', 'provider-name');
    $radio.prop('required', true);
    $radio.val(provider.name);
    $radio.prop('checked', isChecked);
    $radio.appendTo($listItem);

    var $label = $('<label></label>');
    $label.prop('for', inputID);
    $label.text(provider.name);
    $label.appendTo($listItem);

    return $listItem;
}

function submitVerification($form) {
    var $timeSaved = $form.find('#time-saved-value');
    $timeSaved.text('');
    $timeSaved.parent().addClass('hidden');

    var $disableItems = $form.find('button, input');
    $disableItems.prop('disabled', true);

    var $rows = $form.find('tr').not('.header');
    // NOTE: jQuery.map will filter out undefined
    var deferreds = $.map($rows, function (item) {
        var $row = $(item);
        $row.removeClass();

        var $inputs = $row.find('input');
        var data = $inputs.toArray().reduce(function (carry, input) {
            var $input = $(input);

            if ($input.prop('type') === 'date') {
                carry[$input.prop('name')] = $input.val() ? moment($input.val()).format('DD/MM/YYYY') : '';
            } else {
                carry[$input.prop('name')] = $input.val();
            }

            return carry;
        }, {});

        if (hasValues(data)) {
            $row.addClass('loading');

            var providerName = $('input[name=provider-name]:checked').val();
            var providerInfo = VERIFICATION_PROVIDERS.find(function (provider) {
                return provider.name === providerName;
            });

            data['QualificationTitle'] = providerInfo.qualificationTitle;
            data['QualificationProvider'] = providerInfo.courseProvider;
            data['QualificationGid'] = '00000000-0000-0000-0000-000000000000';

            return $.ajax({
                url: 'https://blueq-verification.com/api/',
                method: 'post',
                data: data,
                dataType: 'json',
                success: function (data) {
                    displayVerificationStatus(data, $row);
                },
                error: function () {
                    // Fake an error response
                    var response = {
                        FirstName: '',
                        InstitutionName: '',
                        MiddleName: '',
                        LastName: '',
                        Qualifications: [],
                        VerificationMessage: '',
                        VerifiedDateTime: '',
                        VerifiedStatus: 3
                    };
                    displayVerificationStatus(response, $row);
                }
            });
        }
    });

    $.when.apply(null, deferreds).then(function () {
        if (deferreds.length) {
            // 2 minutes saving per card
            $timeSaved.text(deferreds.length * 2);
            $timeSaved.parent().removeClass('hidden');
        } else {
            $timeSaved.parent().addClass('hidden');
        }

        $disableItems.prop('disabled', false);
    }).fail(function () {
        $disableItems.prop('disabled', false);
        Rollbar.error(
            '500 HTTP Code when accessing Verification API',
            {
                'formData': $form.serialize()
            }
        );
    });
}

/**
 *
 * @param {VerificationResponse} data
 * @param {jQuery} $row
 */
function displayVerificationStatus(data, $row) {
    $row.removeClass();

    var status = getObjectValues(VERIFY_STATUS).find(function (item) {
        return item.id === data.VerifiedStatus;
    });

    if (!status) {
        console.error('Unknown verify status ' + data.VerifiedStatus);
        status = VERIFY_STATUS.ERROR;
    }

    $row.addClass(status.className);
    $row.attr('title', data.VerificationMessage || status.label);
}

/**
 * @param {Object.<String, *>} obj
 * @return {[]}
 */
function getObjectValues(obj) {
    return Object.keys(obj)
        .map(function (key) {
            return obj[key];
        });
}

/**
 * @param {{}} obj
 * @return {bool}
 */
function hasValues(obj) {
    return Object.keys(obj)
        .map(function (key) {
            return obj[key];
        })
        .reduce(function (carry, value) {
            return Boolean(carry) || value;
        }, false);
}
