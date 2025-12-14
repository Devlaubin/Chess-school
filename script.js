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

	// Filtrage par catégorie
	categoryBtns.forEach(btn => {
		btn.addEventListener('click', () => {
			// Update active button
			categoryBtns.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');

			currentCategory = btn.dataset.category;
			filterFAQ();
		});
	});

	// Recherche
	searchInput.addEventListener('input', function () {
		filterFAQ();
	});

	function filterFAQ() {
		const searchTerm = searchInput.value.toLowerCase();
		let visibleCount = 0;

		// Filtrer les sections
		document.querySelectorAll('.faq-section').forEach(section => {
			const sectionCategory = section.dataset.category;
			let sectionHasVisible = false;

			if (currentCategory === 'all' || currentCategory === sectionCategory) {
				section.style.display = 'block';

				// Filtrer les items dans la section
				section.querySelectorAll('.faq-item').forEach(item => {
					const questionText = item.querySelector('.faq-question-text').textContent.toLowerCase();
					const answerText = item.querySelector('.faq-answer-content').textContent.toLowerCase();
					const keywords = item.dataset.keywords || '';

					const matchesSearch = questionText.includes(searchTerm) ||
						answerText.includes(searchTerm) ||
						keywords.includes(searchTerm);

					if (matchesSearch) {
						item.style.display = 'block';
						visibleCount++;
						sectionHasVisible = true;
					} else {
						item.style.display = 'none';
					}
				});

				// Cacher la section si aucun item visible
				if (!sectionHasVisible) {
					section.style.display = 'none';
				}
			} else {
				section.style.display = 'none';
			}
		});

		// Afficher message si aucun résultat
		if (visibleCount === 0) {
			noResults.classList.add('show');
		} else {
			noResults.classList.remove('show');
		}
	}
});
