function isNotOnlySpecialCharacter(string) {
    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return !format.test(string)
}

async function onSaveOtherOptions() {
    const url = $('.other-options .save-url').val();
    const tags = $('.other-options .tag');
    let searchText = '';
    $.each(tags, function (i, tag) {
        searchText += tag.textContent.replace('×', '') + ", ";
    })
    searchText = searchText.slice(0, -2);
    await $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: {
            'uuid': uuid,
            'category': $('.other-options .camp-category').val(),
            'tags': searchText,
            'is_camp_private': $('#toggle-private').hasClass('checked'),
            'is_camp_searchable': $('#toggle-searchable').hasClass('checked')
        },
        success: function (response) {
        },
        error: function (error) {
            return error
        }
    })
}

function goToPreview() {
    const previewAlert = $('.other-options .checking-process');
    previewAlert.addClass('d-none');
    const previewURL = $('.other-options .preview-url').val();
    const unchecked = $('.campaign-sidebar .sidebar .process-items .unchecked');
    console.log(unchecked)
    let uncheckedItemsText = ''
    if (unchecked.length === 0) {
        window.open(previewURL, name = '_self');
    } else {
        $.each(unchecked, function (i, element) {
            uncheckedItemsText += element.getAttribute('data-info') + ', '
        });
        uncheckedItemsText = uncheckedItemsText.slice(0, -2);
        $(".other-options .checking-process .detail-process").text(uncheckedItemsText);
        previewAlert.removeClass('d-none');
    }
}

function onOtherOptionsNext() {
    onSaveOtherOptions()
        .then(res => JSON.stringify(res))
        .then(res => {
            onCheckedProcess('tab-other-options');
            goToPreview();
        }).catch(error => {
        alert(error)
    })
}

function onOtherOptionsBack() {
    onNextOrBack('tab-about-you')
}

function onDeleteTag(tagId) {
    $('.other-options .' + tagId).remove();
}

$(document).ready(function () {
    const addNewTag = $('.new-tag');
    $('.add-tags').click(function () {
        addNewTag.focus();
    });
    addNewTag.on('keypress', function (e) {
        const endTag = $('.end-tag');
        if (e.keyCode === 13 || e.keyCode === 44) {
            const newTag = $(this).val().replace(',', '');
            const tagId = 'tag-' + makeId(5);
            if (newTag !== '' && isNotOnlySpecialCharacter(newTag)) {
                const html = `<div class="tag end-tag ${tagId}">${newTag}<span onclick="onDeleteTag('${tagId}')">&times;</span></div>`;
                if (endTag.length !== 0) {
                    endTag.after(html);
                    endTag.removeClass('end-tag');
                } else {
                    $('.other-options .add-tags .form-group').before(html)
                }
                $(this).val('');
            } else {
                $(this).val('');
            }
        }

    });
    addNewTag.on('focusout', function () {
        $(this).val('');
    })
})

$('.other-options .custom-switch input[type=checkbox]').click(function () {
    $(this).toggleClass('checked');
})