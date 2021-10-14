const uuid = document.getElementById('campaign_id').value;
const isUpdateMode = document.getElementById('is-update').value === 'True';
const currentTab = document.getElementById('current-tab').value;
const currentTag = document.getElementById('current-tag').value;

function onCheckedProcess(className) {
    const element = $('.' + className);
    element.removeClass('unchecked');
    element.addClass('checked');
}

function onProcessItemsActive() {
    const content = $('.campaign-content');
    $('.process-items .item').removeClass('active');
    $('.' + content.attr('data-navlink')).addClass('active');
}

function onNextOrBack(tabClassName) {
    const item = $('.' + tabClassName);
    item.click();
    item.addClass('active');
}

function onClickTabItem(selectedItem, toWhere, tagId) {
    let tabBodyId;
    $(".tab-item").removeClass('active');
    $('.tab-body').addClass('d-none');
    $('.tab-item-text').addClass('d-none');
    selectedItem.addClass('active');
    tabBodyId = selectedItem.attr('data-link');
    $("#" + tabBodyId).removeClass('d-none');
    $("#" + tabBodyId + '-text').removeClass('d-none');

    if (tagId !== null) {
        let $tag = $('#'+ tagId);
        $("html, body").animate({scrollTop: $tag.offset().top -115}, '100');
        $tag.focus();
    } else {
        $("html, body").animate({scrollTop: 0}, '100');
    }

}


$(document).ready(function () {
    onProcessItemsActive();

    if (currentTab) {
        let $this = $('.' + currentTab);
        if (currentTag) {
            onClickTabItem($this, 0, currentTag);
        } else {
            onClickTabItem($this, 0, null);
        }
    }

    // campaign sidebar item control & scrolling top automatically
    $(".tab-item").click(function () {
        onClickTabItem($(this), 0, null)
    })
})

// async function confirmExit() {
//     const uuid = $('#campaign_id').val();
//     await $.ajax({
//         url: '/dashboard/new-campaign-process-delete',
//         type: 'post',
//         dataType: 'json',
//         data: {
//             uuid: uuid
//         },
//         success: function (response) {
//             return "You have attempted to leave this page. " +
//                 "If you have made any changes to the fields without completing the forms, your changes will be lost. " +
//                 "Are you sure you want to exit this page?";
//         }
//     })
// }