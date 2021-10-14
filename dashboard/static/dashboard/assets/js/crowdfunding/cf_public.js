let $largeMediaTypeTag = $('#cf-public .hidden-field .large-media-type');

function onClickSubAdItem(type, src, itemId) {
    let smallHtml, largeHtml;
    if (type === 'video') {
        smallHtml = `<video src="${src}" class="ad-item"" controls autoplay muted></video>`
    } else if (type === 'image') {
        smallHtml = `<img src="${src}" class="ad-item" alt="main-ad-img">`
    } else {
        smallHtml = `<iframe src="${src}" alt="video" class="ad-iframe"" frameBorder="0" allowFullScreen></iframe>`
    }
    let largeMediaType = $largeMediaTypeTag.val();
    let largeMediaSrc = ''
    if (largeMediaType === 'video') {
        largeMediaSrc = $('.main-ad-container video').attr('src');
        largeHtml = `<video src="${largeMediaSrc}" class="ad-item""></video>`
    } else if (largeMediaType === 'image') {
        largeMediaSrc = $('.main-ad-container img').attr('src');
        largeHtml = `<img src="${largeMediaSrc}" class="ad-item" alt="main-ad-img">`
    } else {
        largeMediaSrc = $('.main-ad-container iframe').attr('src');
        largeHtml = `<iframe src="${largeMediaSrc}" alt="video" class="ad-item"" frameBorder="0" allowFullScreen></iframe><div class="cover"></div>`
    }
    $('#small-medias-slider .sub-ads .sub-ad-' + itemId).html(largeHtml);
    $('#cf-public .main-ad-container').html(smallHtml);
    $largeMediaTypeTag.val(type)
    if (type === 'url') {
        jqUpdateSize();
    }
}

// edit item event (preview page)
$('.edit-item').click(function () {
    const backToUpdateURL = $('.go-to-update-campaign-url').val() + $(this).attr('data-nav-link')
    window.open(backToUpdateURL, name = '_self');
})