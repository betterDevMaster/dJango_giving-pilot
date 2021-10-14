let isChangedPrevUploadFile = false;
let $imgToCrop = $('#img-to-crop');
let imgToCrop = document.getElementById('img-to-crop');
let imgCroppingContainer = document.getElementById('cropping-image-panel');

$('#cropping-image-panel .btn-crop').click(function () {
    let $campImg = $('#upload-modal .modal-body .hidden-img')
    let html = $imgToCrop.cropper('getCroppedCanvas', {maxWidth: 4096, maxHeight: 4096});
    $imgToCrop.cropper('destroy');
    $campImg.html(html).css('display', 'block');
    $('#upload-modal .hidden-field .hidden-img canvas').addClass('camp-img');
    $('#file-upload').val('');
    imgCroppingContainer.style.display = 'none';
    $('#upload-modal').modal('show');
    document.documentElement.style.overflowY = 'auto';
})

$('#cropping-image-panel .cancel-crop').click(function () {
    imgCroppingContainer.style.display = 'none';
    $imgToCrop.cropper('destroy');
    $('#file-upload').val('');
    $('#upload-modal').modal('show');
    document.documentElement.style.overflowY = 'auto';
})

window.addEventListener('load', function () {
    document.getElementById('file-upload').addEventListener('change', function () {
        const fileName = this.files[0]['name'];
        let video = document.getElementById('camp-video');
        let $image = $('#upload-modal .modal-body .hidden-img .camp-img');
        let mediaType = document.getElementById('media-type');
        video.style.display = 'none';
        $image.css('display', 'none');
        isChangedPrevUploadFile = true;

        if (isImageValidation(fileName)) {
            if (this.files && this.files[0]) {
                document.documentElement.style.overflowY = 'hidden';
                let reader = new FileReader();
                let context = $imgToCrop.get(0).getContext("2d");
                reader.onload = function (e) {
                    let img = new Image();
                    img.onload = function () {
                        context.canvas.height = img.height;
                        context.canvas.width = img.width;
                        context.drawImage(img, 0, 0);
                        let options = {
                            aspectRatio: 16 / 9,
                            // preview: '.img-preview',
                            crop: function (e) {
                            },
                            viewMode: 2
                        };
                        $imgToCrop.cropper(options);
                    }
                    img.src = e.target.result;
                }
                reader.readAsDataURL(this.files[0]);
                mediaType.value = 'image';
                imgCroppingContainer.style.display = 'block';
                $image.css('display', 'block');
                $('#upload-modal').modal('hide');
            }
        }

        if (isVideoValidation(fileName)) {
            if (this.files && this.files[0]) {
                video.onload = () => {
                    URL.revokeObjectURL(video.src);  // no longer needed, free memory
                }
                mediaType.value = 'video';
                video.src = URL.createObjectURL(this.files[0]); // set src to blob url
                video.style.display = 'block';
            }
        }
    });
});

function openFileUploadModal() {
    $('#upload-modal').modal('show');
    // $('#file-upload').val('');
}

function onInitUploadModal() {
    const video = $('#camp-video');
    const $img = $('#upload-modal .modal-body .hidden-img');
    video.css('display', 'none');
    $img.css('display', 'none');
    $('#upload-modal .modal-body .embedded-url').val('');
    $('#large-small').val('');
    $('#upload-modal').modal('hide');

}


function onClickCloseSmallMedia(smallMediaId) {
    const smallMedia = $('.small-' + smallMediaId);
    if (smallMedia.hasClass('last-small-media')) {
        smallMedia.next().addClass('last-small-media');
    }
    smallMedia.remove();
}


$('#upload-modal .media-upload').click(function () {
    $('#file-upload').click();
})
$('#upload-modal .modal-body .embedded-url').on('focusin', function () {
    $('#media-type').val('embedded')
})

function addSmallMedia() {
    const smallMediaId = makeId(5);
    const html = `<div class="small-media col-3 mb-1 small-${smallMediaId}  last-small-media light-hover">
                        <div class="close-icon" onclick="onClickCloseSmallMedia('${smallMediaId}')">&times;</div>
                        <div class="hidden-media">
                            <input type="file" hidden>
                            <video class="item video" src="" muted controls autoplay></video>
                            <canvas class="item camp-img"></canvas>
                            <iframe class="item iframe" src="" alt="video" frameborder="0" allowfullscreen></iframe>
                        </div>
                    </div>`;
    const $lastSmallMedia = $('.last-small-media');
    $lastSmallMedia.before(html);
    $lastSmallMedia.removeClass('last-small-media');
    let $smallHiddenFiled = $('.last-small-media .hidden-media');
    $smallHiddenFiled.css('display', 'block');
}

$('#upload-modal .save').click(function () {
    let $currentUploadFile = $('#file-upload');
    let filename = $currentUploadFile.prop('files')[0];
    let embeddedURL = $('#upload-modal .modal-body .embedded-url').val();
    if (embeddedURL.includes('www.youtube.com/') && !embeddedURL.includes('embed')){
        embeddedURL = embeddedURL.replace('watch?v=', 'embed/')
    }

    const largeOrSmall = $('#large-small').val();
    const mediaType = $('#media-type').val();
    let $largeHiddenField = $('.large-media .hidden-media');
    let $largeVideo = $('.large-media video');
    let largeVideo = document.getElementsByClassName('large-media')[0].getElementsByTagName('video')[0];
    let $largeImage = $('.large-media canvas');
    let $largeEmbedded = $('.about-campaign .large-media .hidden-media .iframe');
    let isVideoUploaded = $('#upload-modal .modal-body .hidden-field video').css('display') === 'block' ? true : false;
    let isImageUploaded = $('#upload-modal .modal-body .hidden-field .hidden-img').css('display') === 'block' ? true : false;
    if (!isEmptyString(embeddedURL) || isVideoUploaded || isImageUploaded) {
        if (largeOrSmall === 'large') {
            $largeVideo.css('display', 'none');
            $largeImage.css('display', 'none');
            $('.large-media .hidden-media img').css('display', 'none');
            $largeEmbedded.css('display', 'none');

            if (mediaType === 'embedded') {
                $largeEmbedded.attr('src', embeddedURL).css('display', 'block');
            } else if (mediaType === 'video') {
                largeVideo.onload = () => {
                    URL.revokeObjectURL(largeVideo.src);
                }
                largeVideo.src = URL.createObjectURL(filename);
                let $largeMediaInput = $('.large-media .hidden-media input');
                $largeMediaInput.prop('files', $currentUploadFile.prop('files'));
                largeVideo.style.display = 'block';
            } else {
                $largeImage.replaceWith($('#upload-modal .modal-body .hidden-field canvas'));
            }
            $('.large-media .default-img').addClass('d-none');
            $largeHiddenField.css('display', 'block');
            onInitUploadModal();
        } else {
            addSmallMedia();
            let $lastSmallImage = $('.last-small-media canvas');
            let lastSmallVideo = document.getElementsByClassName('last-small-media')[0].getElementsByTagName('video')[0];
            let $lastSmallIframe = $('.last-small-media iframe');
            if (mediaType === 'embedded') {
                $lastSmallIframe.attr('src', embeddedURL).css('display', 'block');
            } else if (mediaType === 'video') {
                lastSmallVideo.onload = () => {
                    URL.revokeObjectURL(lastSmallVideo.src);
                }
                lastSmallVideo.src = URL.createObjectURL(filename);
                let $lastSmallMediaInput = $('.last-small-media input');
                $lastSmallMediaInput.prop('files', $currentUploadFile.prop('files'));
                lastSmallVideo.style.display = 'block';
            } else {
                $lastSmallImage.replaceWith($('#upload-modal .modal-body .hidden-field canvas'));
            }
            onInitUploadModal();
        }
    } else {
        const alertMessage = $('#upload-modal .modal-body .alert');
        alertMessage.removeClass('d-none');
    }
})
$('#upload-modal .cancel').click(function () {
    onInitUploadModal();
})
$('.about-campaign .large-media').click(function () {
    const alertMessage = $('#upload-modal .modal-body .alert');
    alertMessage.addClass('d-none');
    $('#large-small').val('large');
});
$('.about-campaign .small-media').click(function () {
    const alertMessage = $('#upload-modal .modal-body .alert');
    alertMessage.addClass('d-none');
    $('#large-small').val('small');
});

$('.about-campaign .custom-switch input[type=checkbox]').click(function () {
    $(this).toggleClass('checked');
})

async function sendSmallMedia(formData, url) {
    await $.ajax({
        url: url,
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
        },
        error: function (error) {
            alert(error)
        }
    })
}

async function onSaveSmallMedias() {
    const smallMedias = $('.about-campaign .small-media .hidden-media');
    const url = $('.small-medias-save-url').val();
    const username = $('#username').val();
    let formData = new FormData();
    formData.append('uuid', uuid);
    formData.append('username', username);
    $.each(smallMedias, function (i, media) {
        let file = media.getElementsByTagName('input')[0];
        let image = media.getElementsByTagName('canvas')[0];
        let url = media.getElementsByTagName('iframe')[0]
        let mediaId = media.parentNode.getAttribute('data-media-id');
        if (mediaId) {
            formData.append('media_id_' + i, mediaId)
        } else {
            formData.append('is_created_' + i, 'true')
            if (file.files.length > 0) {
                console.log(file.files[0])
                formData.append('file_' + i, file.files[0]);
            } else if (!image.classList.contains('item')) {
                formData.append('canvas_' + i, image.toDataURL());
            } else {
                formData.append('url_' + i, url.getAttribute('src'));
            }
        }
    })
    await $.ajax({
        url: url,
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
        },
        error: function (error) {
            alert(error)
        }
    })
}

async function onSaveAboutCampaign() {
    const url = $('#nc-about-campaign .save-url').val();
    const largeMediaInput = $('.large-media .hidden-media input');

    // const causes = $('.about-campaign .cause');
    // let causeText = '';
    // $.each(causes, function (i, cause) {
    //     causeText += cause.textContent.replace('×', '') + ", ";
    // })
    // causeText = causeText.slice(0, -2);

    const uuid = $('#campaign_id').val();
    let formData = new FormData();
    formData.append('uuid', uuid);
    formData.append('camp_title', $('.camp-title').val());
    formData.append('camp_description', tinymce.get('nc-camp-description').getContent());
    // formData.append('camp_cause', causeText);
    formData.append('camp_start_date', $('.camp-start-date').val());
    formData.append('has_camp_end_date', $('#toggle-end-date').hasClass('checked'));
    formData.append('camp_end_date', $('.camp-end-date').val());
    formData.append('has_goal_amount', $('#toggle-goal-amount').hasClass('checked'));
    formData.append('camp_goal_amount', $('.camp-goal-amount').val());

    const $largeIframeURL = $('.large-media .hidden-media iframe');
    const $largeVideo = $('.large-media .hidden-media video');
    let $largeImg = $('.large-media .hidden-media canvas')
    let username = $('#username').val();
    let isUpdated = false;

    if (largeMediaInput[0].files.length > 0 && $largeVideo.css('display') !== 'none') {
        formData.append('file', largeMediaInput[0].files[0]);
        isUpdated = true
    }
    if ($largeImg.css('display') !== 'none') {
        formData.append('canvas', $largeImg[0].toDataURL());
        formData.append('username', username);
        isUpdated = true
    }
    if ($largeIframeURL.css('display') !== 'none') {
        formData.append('url', $largeIframeURL.attr('src'));
        isUpdated = true
    }
    formData.append('is_update', isUpdated);

    await $.ajax({
        url: url,
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            onSaveSmallMedias()
        },
        error: function (error) {
            return error
        }
    })
}
// Cause delete event
function onDeleteCause(causeId) {
    $('.about-campaign .' + causeId).remove();
}

// Cause
$(document).ready(function () {
    const addNewCause = $('.new-cause');
    $('.add-causes').click(function () {
        addNewCause.focus();
    });
    addNewCause.on('keypress', function (e) {
        const endCause = $('.end-cause');
        if (e.keyCode === 13 || e.keyCode === 44) {
            const newCause = $(this).val().replace(',', '');
            const causeId = 'cause-' + makeId(5);
            if (newCause !== '' && isNotOnlySpecialCharacter(newCause)) {
                const html = `<div class="cause end-cause ${causeId}">${newCause}<span onclick="onDeleteCause('${causeId}')">&times;</span></div>`;
                if (endCause.length !== 0) {
                    endCause.after(html);
                    endCause.removeClass('end-cause');
                } else {
                    $('.about-campaign .add-causes .form-group').before(html)
                }
                $(this).val('');
            } else {
                $(this).val('');
            }
        }

    });
    addNewCause.on('focusout', function () {
        $(this).val('');
    })
})

function onAboutCampaignValidation() {
    const campaignTitle = $('.camp-title').val();
    const campaignTitleAlert = $('.camp-title-alert');
    const campaignDescription = tinymce.get('nc-camp-description').getContent();
    const campaignDescriptionAlert = $('.camp-description-alert');
    // const campaignCausesNumber = $('.about-campaign .cause').length;
    // const campaignCauseAlert = $('.camp-cause-alert');
    const isLargeMediaUploaded = $('.large-media .default-img').css('display') === 'none' ? true : false;
    const campaignMediaAlert = $('.camp-media-required');
    const campaignStartDate = $('.camp-start-date').val();
    const campaignStartDateAlert = $('.camp-start-date-required');
    const campaignEndDateSwitch = $('#toggle-end-date');
    const campaignEndDate = $('.camp-end-date').val();
    const campaignEndDateAlert = $('.camp-end-date-required');
    const campaignGoalAmountSwitch = $('#toggle-goal-amount');
    const campaignGoalAmount = $('.camp-goal-amount').val();
    const campaignGoalAmountAlert = $('.camp-goal-amount-required');
    let validProcessNumber = 4;
    if (campaignEndDateSwitch.hasClass('checked')) {
        validProcessNumber += 1
    }
    if (campaignGoalAmountSwitch.hasClass('checked')) {
        validProcessNumber += 1
    }

    let currentProcessNumber = 0;

    // hide all alerts
    $('.about-campaign .alert').addClass('d-none');

    // forms validation
    if (isEmptyString(campaignTitle)) {
        campaignTitleAlert.removeClass('d-none');
    } else {
        currentProcessNumber += 1;
    }
    if (isEmptyString(campaignDescription)) {
        campaignDescriptionAlert.removeClass('d-none');
    } else {
        currentProcessNumber += 1;
    }
    // if (campaignCausesNumber === 0) {
    //     campaignCauseAlert.removeClass('d-none');
    // } else {
    //     currentProcessNumber += 1;
    // }
    if (isLargeMediaUploaded) {
        currentProcessNumber += 1;
    } else {
        campaignMediaAlert.removeClass('d-none');
    }
    if (isEmptyString(campaignStartDate)) {
        campaignStartDateAlert.removeClass('d-none');
    } else {
        currentProcessNumber += 1;
    }
    if (campaignEndDateSwitch.hasClass('checked')) {
        if (isEmptyString(campaignEndDate)) {
            campaignEndDateAlert.removeClass('d-none');
        } else {
            currentProcessNumber += 1;
        }
    }
    if (campaignGoalAmountSwitch.hasClass('checked')) {
        if (isEmptyString(campaignGoalAmount)) {
            campaignGoalAmountAlert.removeClass('d-none');
        } else {
            currentProcessNumber += 1;
        }
    }
    return validProcessNumber === currentProcessNumber;
}

function onAboutCampaignNext() {
    // form validation checked
    if (onAboutCampaignValidation()) {
        let loadingGIf = $('.loading-gif')
        loadingGIf.toggleClass('d-none');
        onSaveAboutCampaign().then(res => {
            return JSON.stringify(res)
        }).then(res => {
            loadingGIf.toggleClass('d-none');
            onCheckedProcess('tab-about-campaign');
            onNextOrBack('tab-about-you');
        }).catch(error => {
            loadingGIf.toggleClass('d-none');
            alert(error)
        })
    }
}

function onAboutCampaignBack() {
    onNextOrBack('tab-basic-info');
}

if (isUpdateMode) {
    const currentLargeMediaSrc = $('#from-vew-basic-info .large-media-src').val();
    const currentLargeImageSrc = $('#from-vew-basic-info .large-image-src').val();
    const currentLargeMediaURL = $('#from-vew-basic-info .large-media-url').val();
    const currentSmallMedias = $('#from-vew-basic-info .small-media-src-url');
    if (isImageValidation(currentLargeImageSrc)) {
        $('.about-campaign .large-media .hidden-media img').attr('src', get_absolute_url(currentLargeImageSrc)).css('display', 'block');
    } else if (isVideoValidation(currentLargeMediaSrc)) {
        $('.about-campaign .large-media .hidden-media .video').attr('src', currentLargeMediaSrc).css('display', 'block');
    } else {
        $('.about-campaign .large-media .hidden-media .iframe').attr('src', currentLargeMediaURL).css('display', 'block');
    }
    $.each(currentSmallMedias, function (i, smallMedia) {
        let video = smallMedia.getElementsByClassName('small-media-src')[0].value;
        let image = smallMedia.getElementsByClassName('small-image-src')[0].value;
        let embeddedURL = smallMedia.getElementsByClassName('small-media-url')[0].value;
        if (isImageValidation(image)) {
            $('.about-campaign .small-' + i + ' .hidden-media .img').attr('src', get_absolute_url(image)).css('display', 'block');
        } else if (isVideoValidation(video)) {
            $('.about-campaign .small-' + i + ' .hidden-media .video').attr('src', video).css('display', 'block');
        } else {
            $('.about-campaign .small-' + i + ' .hidden-media .iframe').attr('src', embeddedURL).css('display', 'block');
        }
    })
}