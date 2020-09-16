function toggleNav() {
  const hamburgerBtn = document.querySelector('.icon-hamburger');
  const closeBtn = document.querySelector('.icon-close');
  const popupMenu = document.querySelector('.popup-menu');

  let mobileMenuState = popupMenu.dataset.state;

  function toggleNavButton(event) {
    const currentButton = event.currentTarget;

    currentButton.classList.add('header__button--hidden');

    if (mobileMenuState === 'closed') {
      currentButton.nextElementSibling.classList.remove(
        'header__button--hidden'
      );
      mobileMenuState = 'open';
      document.body.style.overflowY = 'hidden';
      popupMenu.classList.toggle('header__mobile--active');
    } else {
      currentButton.previousElementSibling.classList.remove(
        'header__button--hidden'
      );
      mobileMenuState = 'closed';
      document.body.style.overflowY = '';
      popupMenu.classList.remove('header__mobile--active');
    }
  }

  function closePopupMenu() {
    if (mobileMenuState === 'open') {
      hamburgerBtn.classList.remove('header__button--hidden');
      closeBtn.classList.add('header__button--hidden');
      popupMenu.classList.remove('header__mobile--active');
      document.body.style.overflowY = '';
      mobileMenuState = 'closed';
    }
  }

  hamburgerBtn.addEventListener('click', (event) => {
    toggleNavButton(event);
  });

  closeBtn.addEventListener('click', (event) => {
    toggleNavButton(event);
  });

  popupMenu.addEventListener('click', (event) => {
    if (event.target === popupMenu) {
      closePopupMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (document.documentElement.clientWidth >= 780) {
      closePopupMenu();
    }
  });
}

let glideOptions = {
    type: 'carousel',
    perView: 3,
    perTouch: 1,
    autoplay: 4000,
    breakpoints: {
      780: {
        perView: 1,
      },
      990: {
        perView: 2,
      },
    },
    classes: {
      activeNav: 'testimonial-bullet__button--active',
    },
  };

document.addEventListener('DOMContentLoaded', () => {
  toggleNav();
  let glide = new Glide('.glide', glideOptions);
  glide.mount();
});
