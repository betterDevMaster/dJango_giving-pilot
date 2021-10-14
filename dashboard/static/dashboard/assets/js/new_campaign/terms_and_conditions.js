function onAgreeTerms() {
    onNextOrBack('tab-basic-info');
    const termsIcon = $('.tab-terms-and-conditions');
    termsIcon.removeClass('unchecked');
    termsIcon.addClass('checked');
}

function onDisagreeTerms() {
    const termsIcon = $('.tab-terms-and-conditions');
    termsIcon.removeClass('checked');
    termsIcon.addClass('unchecked');
}