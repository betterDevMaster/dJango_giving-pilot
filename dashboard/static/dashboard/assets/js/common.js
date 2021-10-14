hostname = location.hostname;
portNum = location.port;
protocol = location.protocol;

function get_absolute_url(currentURL) {
    return `${protocol}//${hostname}:${portNum}/${currentURL}`;
}

function isEmptyString(string) {
    return string === '';
}

function isValidateEmail(mail) {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail);
}

function isValidPhoneNumber(phoneNumber) {
    console.log(phoneNumber.replaceAll(' ', ''))
    return /^\(?[+]?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phoneNumber.replace(' ', ''))
}

function isImageValidation(filename) {
    filename = filename.toLowerCase();
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.bmp|\.gif|\.txt|\.svg|\.pjpeg|\.pjp|\.webp)$/i;
    return allowedExtensions.test(filename)
}

function isVideoValidation(filename) {
    filename = filename.toLowerCase();
    const allowedExtensions = /(\.mp4|\.webm|\.ogg|\.swf|\.flv)$/i;
    return allowedExtensions.test(filename)
}

function makeId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function jqUpdateSize() {

    if ($('#frame-right-bar-on-pc').css('display') === 'block') {
        // $('#top-bar').addClass('has-right-bar-top');
        $('#top-bar').addClass('has-right-bar');
        $('.center-page').addClass('has-right-bar');
    } else {
        // $('#top-bar').removeClass('has-right-bar-top');
        $('#top-bar').removeClass('has-right-bar');
        $('.center-page').removeClass('has-right-bar');
    }

    // Get the dimensions of the viewport
    const width = $(window).width();
    // let height = $(window).height();

    const iframe = $('#cf-public .main-ad-container iframe');
    if (iframe.length > 0) {
        let iframeAspectRatio = iframe[0].offsetHeight / iframe[0].offsetWidth;
        const widthForRightPadding = 992;
        const widthForLeftPadding = 576;
        const rightPaddingWidth = 400;
        const leftPaddingWidth = 82
        iframeAspectRatio = iframeAspectRatio > 0.57 ? 3 / 4 : 9 / 16;
        let availableWidth, availableHeight;
        if (width > widthForRightPadding) {
            availableWidth = width - rightPaddingWidth - leftPaddingWidth;
        } else if (width > widthForLeftPadding) {
            availableWidth = width - leftPaddingWidth;
        } else {
            availableWidth = width
        }
        availableHeight = availableWidth * iframeAspectRatio;
        iframe[0].height = availableHeight;
        iframe[0].width = availableWidth;
    }

    // overflowing check
    // let campaignGroupDivs = $('.home-page .campaign-group');
    // if (campaignGroupDivs.length > 0) {
    //     campaignGroupDivs.each(function(i, campaignGroupDiv) {
    //         let divOverflow = campaignGroupDiv.style.overflow;
    //         if (!divOverflow || divOverflow === "visible") {
    //             campaignGroupDiv.style.overflow = 'hidden'
    //         }
    //         let isDivOverflowing = campaignGroupDiv.clientWidth < campaignGroupDiv.scrollWidth
    //             || campaignGroupDiv.clientHeight < campaignGroupDiv.scrollHeight;
    //         campaignGroupDiv.style.overflow = divOverflow;
    //     })
    // }
    //
}

$(document).ready(jqUpdateSize);    // When the page first loads
$(window).resize(jqUpdateSize);     // When the browser changes size


sidebarTabInfo = $('.side-bar-tab-info').attr('data-tab-link');
sidebarTabs = $('#sidebar .tab-item');
sidebarTabs.find('a').find('i').removeClass('active');
$.each(sidebarTabs, function (i, sidebarTab) {
    if (sidebarTab.getAttribute('data-tab-link') === sidebarTabInfo) {
        sidebarTab.getElementsByTagName('a')[0].getElementsByTagName('i')[0].classList.add('active')
    }
})

// sidebar-tab click event
sidebarTabs.click(function () {
    const linkInfo = $(this).attr('data-tab-link');
    $.each($('#sidebar .hidden-field .link-info'), function (i, linkInfoTag) {
        if (linkInfoTag.getAttribute('data-tab-link') === linkInfo) {
             window.open(linkInfoTag.value, name = '_self')
        }
    })
})

// profile-photo click event
$(document).ready(function () {
    $('#sidebar .profile-photo').click(function () {
        let $subMenu = $('#sidebar .profile-photo .sub-menu');
        $subMenu.fadeToggle();
    })
})

