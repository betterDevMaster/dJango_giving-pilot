$('.get-started-with-email div').on('click touchstart', function () {
    const email = $(this).siblings('input').val();
    let url = $('.sign-up-url').val();
    url += email !== undefined ? `?email=${email}` : ``;
    window.open(url, name = '_self');
})