function goToCreateNewCampaign() {
    const url = $('#content-top-bar .go-to-create-new-campaign').val();
    window.open(url, name = '_self');
}

function goToCFPublic(url) {
    window.open(url, name = '_self');
}

$('.ms-control-icon').click(function () {
    let scrollId = $(this).attr('data-scroll-id');
    let direction = $(this).attr('data-scroll-direction');
    if (direction === 'right') {
        MagicScroll.forward(scrollId, 1);
    } else {
        MagicScroll.backward(scrollId, 1);
    }
})

function onActiveHomeSubpage($selectedTab, marginPosition){
    let tabLink = $selectedTab.attr('data-tab-link');
    let tagLink = $selectedTab.attr('data-tag-link');
    $('.home-page .campaigns-view').removeClass('active-tab');
    $('.home-page .'+tabLink).addClass('active-tab');
    if (tagLink) {
        $("html, body").animate({scrollTop: $('#'+tagLink).offset().top - marginPosition}, '100');
    } else {
        $("html, body").animate({scrollTop: 0}, '100');
    }
}

$('#content-top-bar .group-item').click(function (){
    $('.group-item').removeClass('active');
    $(this).addClass('active');
    onActiveHomeSubpage($(this), 100);
})

// on mobile dropdown tab
$("#content-top-bar .drop-down-icon").click(function () {
    $('#content-top-bar .drop-down-icon').toggleClass('d-none');
    let dropDownMenu;
    dropDownMenu = $('#content-top-bar .drop-down');
    dropDownMenu.toggleClass('d-none');
});

$('#content-top-bar .drop-down-item').click(function () {
    const text = $(this).text();
    $('#content-top-bar .selected-item span').text(text);
    $('#content-top-bar .drop-down').toggleClass('d-none');
    $('#content-top-bar .drop-down-icon').toggleClass('d-none');
    $('.tab-item-group .drop-down-item').removeClass('active');
    $(this).addClass('active');
    onActiveHomeSubpage($(this), 150);
})