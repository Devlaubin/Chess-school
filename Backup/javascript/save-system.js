// ========== BARRE DE PROGRESSION DE LECTURE ==========
document.addEventListener('DOMContentLoaded', function () {
    const progressBar = document.getElementById('reading-progress');
    const progressCircle = document.getElementById('progress-circle');
    const progressPercent = document.getElementById('progress-percent');

    if (progressBar && progressCircle) {
        function updateProgress() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
            const progress = Math.min(Math.max(scrollPercent, 0), 100);

            // Barre
            progressBar.style.width = progress + '%';

            // Cercle
            if (progress > 5) {
                progressCircle.classList.add('show');
                progressCircle.style.setProperty('--progress', progress + '%');
                progressPercent.textContent = Math.round(progress) + '%';
            } else {
                progressCircle.classList.remove('show');
            }

            // Sauvegarder position
            const pageName = window.location.pathname.split('/').pop();
            window.chessSchoolSave.saveReadingPosition(pageName, scrollTop);
        }

        window.addEventListener('scroll', updateProgress);
        updateProgress();

        // Restaurer position de lecture
        const pageName = window.location.pathname.split('/').pop();
        const savedPosition = window.chessSchoolSave.loadReadingPosition(pageName);
        if (savedPosition > 100) { // Seulement si on avait bien scrollé
            setTimeout(() => {
                window.scrollTo({ top: savedPosition, behavior: 'smooth' });
            }, 300);
        }
    }

    // Enregistrer visite de page
    const pageName = document.title.replace('Chess School — ', '');
    window.chessSchoolSave.visitPage(pageName);
});