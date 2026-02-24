let quizStartTime = 0;
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

    // Close when clicking on the backdrop
    if (backdrop) {
        backdrop.addEventListener('click', function () {
            setOpen(false);
        });
    }

    // Close when clicking outside the nav on desktop
    document.addEventListener('click', function (e) {
        if (!nav.contains(e.target) && !sideFrame?.contains(e.target)) {
            setOpen(false);
        }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setOpen(false);
    });
});

// FAQ Interactive Script
document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');
    const searchInput = document.getElementById('faq-search');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const noResults = document.getElementById('no-results');
    let currentCategory = 'all';

    // Toggle FAQ items
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Fermer tous les autres items
            faqItems.forEach(i => i.classList.remove('active'));

            // Toggle l'item actuel
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});
// Filtrer les FAQ
// Base de données de questions
const questionsDatabase = {
    facile: [
        {
            question: "Combien de cases comporte un échiquier ?",
            answers: ["32", "48", "64", "72"],
            correct: 2,
            explanation: "Un échiquier contient 64 cases (8 rangées × 8 colonnes)."
        },
        {
            question: "Quelle couleur joue toujours en premier ?",
            answers: ["Les noirs", "Les blancs", "Celui qui gagne le tirage", "Alternativement"],
            correct: 1,
            explanation: "Les blancs jouent toujours en premier aux échecs."
        }
    ],
    // ... (rest du fichier script.js copié) ...
};
