function onBasicInfoValidationForms() {
    const orgNameForm = $('#org-name');
    const orgDescriptionForm = $('#org-description');
    const orgName = orgNameForm.val();
    const orgDescription = orgDescriptionForm.val();
    const alertOrgName = $('.org-name-required');
    const alertOrgDescription = $('.org-description-required');
    let isFormsValid = 0;
    alertOrgName.addClass('d-none');
    alertOrgDescription.addClass('d-none');
    if (isEmptyString(orgName)) {
        alertOrgName.removeClass('d-none');
    } else {
        isFormsValid += 1;
    }
    if (isEmptyString(orgDescription)) {
        alertOrgDescription.removeClass('d-none');
    } else {
        isFormsValid += 1;
    }
    return isFormsValid === 2;
}

async function onSaveBasicInfo(){
    const url = $('.basic-info .save-url').val();
    let formData = new FormData();
    formData.append('uuid', uuid);
    formData.append('org_name', $('#org-name').val());
    formData.append('org_description', $('#org-description').val());
    formData.append('file', $('#input-logo')[0].files[0]);

    await $.ajax({
        url: url,
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response){
        },
        error: function (){
            alert('error');
        }
    })
}

function onBasicInfoBack() {
    onNextOrBack('tab-terms-and-conditions');
}

function onBasicInfoNext() {
    $('.basic-info .alert').addClass('d-none');
    if (onBasicInfoValidationForms()) {
        onSaveBasicInfo()
            .then(res => JSON.stringify(res))
            .then(res => {
                onCheckedProcess('tab-basic-info');
                onNextOrBack('tab-about-campaign');
            }).catch(error => {
                alert(error)
        })
    }
}

function onClickUploadLogo() {
    document.getElementById('input-logo').click();
}

window.addEventListener('load', function () {
    document.getElementById('input-logo').addEventListener('change', function () {
        if (this.files && this.files[0]) {
            let logInput = $('.basic-info .upload-logo input');
            let img = document.getElementById('logo-img-src');
            img.onload = () => {
                URL.revokeObjectURL(img.src);  // no longer needed, free memory
            }

            img.src = URL.createObjectURL(this.files[0]); // set src to blob url

            logInput.files = this.files;
            // img.style.visibility = 'visible';
        }
    });
});