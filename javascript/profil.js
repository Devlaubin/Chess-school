// Menu burger
document.addEventListener('DOMContentLoaded', function () {
    const nav = document.getElementById('main-nav');
    const toggle = document.getElementById('nav-toggle');
    const navList = document.getElementById('main-nav-list');
    const sideFrame = document.getElementById('side-frame');
    const backdrop = document.getElementById('frame-backdrop');

    if (!nav || !toggle || !navList) return;

    function setOpen(open) {
        if (open) {
            nav.classList.add('open');
            if (sideFrame) sideFrame.classList.add('open');
            if (backdrop) backdrop.classList.add('open');
            toggle.setAttribute('aria-expanded', 'true');
            if (sideFrame) sideFrame.setAttribute('aria-hidden', 'false');
            if (backdrop) backdrop.setAttribute('aria-hidden', 'false');
        } else {
            nav.classList.remove('open');
            if (sideFrame) sideFrame.classList.remove('open');
            if (backdrop) backdrop.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            if (sideFrame) sideFrame.setAttribute('aria-hidden', 'true');
            if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
        }
    }

    toggle.addEventListener('click', function (e) {
        const isOpen = nav.classList.contains('open');
        setOpen(!isOpen);
        e.stopPropagation();
    });

    if (backdrop) {
        backdrop.addEventListener('click', function () {
            setOpen(false);
        });
    }

    document.addEventListener('click', function (e) {
        if (!nav.contains(e.target) && !sideFrame?.contains(e.target)) {
            setOpen(false);
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setOpen(false);
    });
});

// Animation des cartes de trophées
document.querySelectorAll('.achievement-card').forEach(card => {
    card.addEventListener('click', function () {
        if (!this.classList.contains('locked')) {
            this.style.transform = 'scale(1.05) rotate(5deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    console.log('🍔 Initialisation du menu burger...');

    const nav = document.getElementById('main-nav');
    const toggle = document.getElementById('nav-toggle');
    const navList = document.getElementById('main-nav-list');
    const sideFrame = document.getElementById('side-frame');
    const backdrop = document.getElementById('frame-backdrop');

    // Vérifier que tous les éléments existent
    if (!nav || !toggle || !navList || !sideFrame || !backdrop) {
        console.warn('⚠️ Éléments du menu introuvables');
        return;
    }

    console.log('✅ Tous les éléments du menu trouvés');

    // Fonction pour ouvrir/fermer le menu
    function toggleMenu() {
        console.log('🔄 Toggle menu');
        const isOpen = nav.classList.contains('open');

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function openMenu() {
        console.log('📂 Ouverture du menu');
        nav.classList.add('open');
        sideFrame.classList.add('open');
        backdrop.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        sideFrame.setAttribute('aria-hidden', 'false');
        backdrop.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
        console.log('📁 Fermeture du menu');
        nav.classList.remove('open');
        sideFrame.classList.remove('open');
        backdrop.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        sideFrame.setAttribute('aria-hidden', 'true');
        backdrop.setAttribute('aria-hidden', 'true');
    }

    // Clic sur le bouton burger
    toggle.addEventListener('click', function (e) {
        console.log('🖱️ Clic sur burger');
        e.stopPropagation();
        toggleMenu();
    });

    // Clic sur le backdrop (fond sombre)
    if (backdrop) {
        backdrop.addEventListener('click', function () {
            console.log('🖱️ Clic sur backdrop');
            closeMenu();
        });
    }

    // Clic sur les liens du menu (fermer après clic)
    const navLinks = document.querySelectorAll('.frame-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            console.log('🖱️ Clic sur lien du menu');
            closeMenu();
        });
    });

    // Fermer avec la touche Échap
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            console.log('⌨️ Touche Échap pressée');
            closeMenu();
        }
    });

    // Fermer si on clique en dehors du menu
    document.addEventListener('click', function (e) {
        const isClickInNav = nav.contains(e.target);
        const isClickInFrame = sideFrame.contains(e.target);
        const isClickOnToggle = toggle.contains(e.target);

        if (!isClickInNav && !isClickInFrame && !isClickOnToggle) {
            if (nav.classList.contains('open')) {
                console.log('🖱️ Clic en dehors du menu');
                closeMenu();
            }
        }
    });

    console.log('✅ Menu burger initialisé avec succès');
});