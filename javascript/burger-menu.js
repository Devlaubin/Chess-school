// Contrôler la frame avec le nouveau burger button
function initializeBurgerMenu() {
    const burgerBtn = document.getElementById('burgerBtn');
    const sideFrame = document.getElementById('side-frame');
    const frameBackdrop = document.getElementById('frame-backdrop');

    if (!burgerBtn || !sideFrame || !frameBackdrop) return;
    if (burgerBtn.dataset.burgerInitialized === 'true') return;
    burgerBtn.dataset.burgerInitialized = 'true';

    burgerBtn.addEventListener('click', function () {
        const isOpen = sideFrame.classList.toggle('open');
        frameBackdrop.classList.toggle('open', isOpen);
        burgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    frameBackdrop.addEventListener('click', function () {
        sideFrame.classList.remove('open');
        frameBackdrop.classList.remove('open');
        burgerBtn.setAttribute('aria-expanded', 'false');
    });

    sideFrame.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function () {
            sideFrame.classList.remove('open');
            frameBackdrop.classList.remove('open');
            burgerBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

document.addEventListener('DOMContentLoaded', initializeBurgerMenu);
document.addEventListener('fragmentsLoaded', initializeBurgerMenu);
