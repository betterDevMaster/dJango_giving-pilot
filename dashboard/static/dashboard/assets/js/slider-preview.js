window.addEventListener("DOMContentLoaded", (event) => {
  const sliderPreviewSecondary = document.querySelector(
    "#sliderPreviewSecondary"
  );
  const sliderPreviewPrimary = document.querySelector("#sliderPreviewPrimary");

  if (sliderPreviewSecondary && sliderPreviewPrimary) {
    const secondarySlider = new Splide("#sliderPreviewSecondary", {
      fixedWidth: 260,
      height: 187,
      gap: 14,
      cover: true,
      isNavigation: true,
      pagination: false,
      focus: "center",
      breakpoints: {
        600: {
          fixedWidth: 66,
          height: 40,
        },
      },
    }).mount();

    const primarySlider = new Splide("#sliderPreviewPrimary", {
      type: "fade",
      heightRatio: 0.5,
      pagination: false,
      arrows: false,
      cover: true,
      video: {
        autoplay: true,
        mute: false,
      },
    });

    primarySlider.sync(secondarySlider).mount(window.splide.Extensions);
  }
});