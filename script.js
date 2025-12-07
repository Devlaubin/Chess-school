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
