// Contrôler la frame avec le nouveau burger button
document.addEventListener('DOMContentLoaded', function () {
    const burgerBtn = document.getElementById('burgerBtn');
    const sideFrame = document.getElementById('side-frame');
    const frameBackdrop = document.getElementById('frame-backdrop');

    if (burgerBtn && sideFrame && frameBackdrop) {
        burgerBtn.addEventListener('click', function () {
            sideFrame.classList.toggle('open');
            frameBackdrop.classList.toggle('open');
            burgerBtn.setAttribute('aria-expanded',
                burgerBtn.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');
        });

        // Fermer quand on clique sur le backdrop
        frameBackdrop.addEventListener('click', function () {
            sideFrame.classList.remove('open');
            frameBackdrop.classList.remove('open');
            burgerBtn.setAttribute('aria-expanded', 'false');
        });

        // Fermer quand on clique sur un lien du menu
        sideFrame.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                sideFrame.classList.remove('open');
                frameBackdrop.classList.remove('open');
                burgerBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }
});