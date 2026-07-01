document.addEventListener('DOMContentLoaded', function () {
    function loadFragment(selector, url) {
        const container = document.querySelector(selector);
        if (!container) return;

        return fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Impossible de charger ' + url);
                return response.text();
            })
            .then(html => {
                container.innerHTML = html;
            })
            .catch(error => {
                console.error(error);
            });
    }

    Promise.all([
        loadFragment('div[data-include="nav"]', 'nav.html'),
        loadFragment('div[data-include="footer"]', 'footer.html')
    ]).then(() => {
        document.dispatchEvent(new CustomEvent('fragmentsLoaded'));
    });
});
