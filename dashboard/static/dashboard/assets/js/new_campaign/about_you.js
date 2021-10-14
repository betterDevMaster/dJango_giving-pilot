function onAboutYouValidation() {
    const yourName = $('.about-you .your-name').val();
    const yourNameAlert = $('.about-you .your-name-required');
    const yourEmail = $('.about-you .your-email').val();
    const yourEmailAlert = $('.about-you .your-email-required');
    const yourPhone = $('.about-you .your-phone').val();
    const yourPhoneAlert = $('.about-you .your-phone-required');
    const yourTitle = $('.about-you .your-title').val();
    const yourTitleAlert = $('.about-you .your-title-required');

    $('.about-you .alert').addClass('d-none');

    const validationProcessNumber = 4;
    let currentProcessNumber = 0;

    if (isEmptyString(yourName)) {
        yourNameAlert.removeClass('d-none');
    } else {
        currentProcessNumber += 1;
    }

    if (isValidateEmail(yourEmail)) {
        currentProcessNumber += 1;
    } else {
        yourEmailAlert.removeClass('d-none');
    }

    if (isEmptyString(yourPhone)) {
        yourPhoneAlert.removeClass('d-none');
    } else {
        currentProcessNumber += 1;
    }

    if (isEmptyString(yourTitle)) {
        yourTitleAlert.removeClass('d-none');
    } else {
        currentProcessNumber += 1;
    }

    return currentProcessNumber === validationProcessNumber;
}

async function onSaveAboutYou() {
    const url = $('.about-you .save-url').val();
    await $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: {
            'uuid': uuid,
            'your_name': $('.about-you .your-name').val(),
            'your_email': $('.about-you .your-email').val(),
            'is_your_email_private': $('#toggle-keep-private-email').hasClass('checked'),
            'your_phone': $('.about-you .your-phone').val(),
            'is_your_phone_private': $('#toggle-keep-private-phone').hasClass('checked'),
            'your_title': $('.about-you .your-title').val(),
            'is_your_title_private': $('#toggle-keep-private-title').hasClass('checked'),
        },
        success: function (response) {
        },
        error: function (error) {
            return error
        }
    })
}

function onAboutYouNext() {
    if (onAboutYouValidation()) {
        onSaveAboutYou()
            .then(res => {
                return JSON.stringify(res)
            }).then(res => {
            onCheckedProcess('tab-about-you');
            onNextOrBack('tab-other-options');
        }).catch(error => {
            alert(error)
        });
    }
}

function onAboutYouBack() {
    onNextOrBack('tab-about-campaign')
}

$('.about-you .custom-switch input[type=checkbox]').click(function () {
    $(this).toggleClass('checked');
})
