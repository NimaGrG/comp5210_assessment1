
const button = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
if (button && nav) {
  button.addEventListener('click', () => {
    nav.classList.toggle('open');
    button.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
  });
}
