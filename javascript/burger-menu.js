// ========================================
// BURGER MENU - ICÔNE SVG PREMIUM
// À ajouter avant burger-menu.js
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('🎨 Création de l\'icône burger SVG...');

    const toggle = document.getElementById('nav-toggle');

    if (!toggle) {
        console.warn('⚠️ Bouton burger non trouvé');
        return;
    }

    // Vider le bouton
    toggle.innerHTML = '';

    // Créer le SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '28');
    svg.setAttribute('height', '28');
    svg.setAttribute('viewBox', '0 0 28 28');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2.5');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.classList.add('burger-icon');
    svg.style.transition = 'all 0.35s cubic-bezier(0.4, 0.0, 0.2, 1)';

    // Ligne 1
    const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line1.setAttribute('x1', '4');
    line1.setAttribute('y1', '7');
    line1.setAttribute('x2', '24');
    line1.setAttribute('y2', '7');
    line1.classList.add('burger-line-1');
    line1.style.transition = 'all 0.35s cubic-bezier(0.4, 0.0, 0.2, 1)';

    // Ligne 2
    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line2.setAttribute('x1', '4');
    line2.setAttribute('y1', '14');
    line2.setAttribute('x2', '24');
    line2.setAttribute('y2', '14');
    line2.classList.add('burger-line-2');
    line2.style.transition = 'all 0.35s cubic-bezier(0.4, 0.0, 0.2, 1)';

    // Ligne 3
    const line3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line3.setAttribute('x1', '4');
    line3.setAttribute('y1', '21');
    line3.setAttribute('x2', '24');
    line3.setAttribute('y2', '21');
    line3.classList.add('burger-line-3');
    line3.style.transition = 'all 0.35s cubic-bezier(0.4, 0.0, 0.2, 1)';

    svg.appendChild(line1);
    svg.appendChild(line2);
    svg.appendChild(line3);

    toggle.appendChild(svg);

    // Ajouter la couleur
    svg.style.color = '#599bb3';

    console.log('✅ Icône SVG créée avec succès');
});

// Ajouter le CSS pour l'animation
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        const style = document.createElement('style');
        style.textContent = `
            /* Style du bouton burger */
            .nav-toggle {
                color: #599bb3;
            }

            .nav-toggle:hover {
                color: #408c99;
            }

            .nav-toggle:hover .burger-icon {
                color: #408c99;
            }

            .main-nav.open .nav-toggle {
                color: white;
            }

            .main-nav.open .nav-toggle .burger-icon {
                color: white;
            }

            /* Animation du SVG au clic */
            .main-nav.open .burger-line-1 {
                transform: translate(4px, 10px) rotate(45deg);
                transform-origin: center;
            }

            .main-nav.open .burger-line-2 {
                opacity: 0;
                transform: scaleX(0);
            }

            .main-nav.open .burger-line-3 {
                transform: translate(4px, -10px) rotate(-45deg);
                transform-origin: center;
            }

            /* Animation smooth des lignes */
            .burger-icon line {
                transition: all 0.35s cubic-bezier(0.4, 0.0, 0.2, 1);
            }
        `;
        document.head.appendChild(style);
        console.log('✅ Styles SVG ajoutés');
    }, 100);
});