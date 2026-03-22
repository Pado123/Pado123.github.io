(function () {
	'use strict';

	document.body.classList.remove('is-preload');

	var nav = document.getElementById('nav');
	if (!nav) return;

	var navLinks = nav.querySelectorAll('a[href^="#"]');
	var sectionMap = [];

	navLinks.forEach(function (link) {
		var href = link.getAttribute('href');
		if (!href || href.length < 2) return;
		var el = document.querySelector(href);
		if (el) sectionMap.push({ href: href, el: el });
	});

	function setActive(href) {
		navLinks.forEach(function (a) {
			a.classList.toggle('active', a.getAttribute('href') === href);
		});
	}

	if ('IntersectionObserver' in window && sectionMap.length) {
		var observer = new IntersectionObserver(
			function (entries) {
				var visible = entries
					.filter(function (e) {
						return e.isIntersecting;
					})
					.sort(function (a, b) {
						return b.intersectionRatio - a.intersectionRatio;
					});
				if (visible.length && visible[0].target.id) {
					setActive('#' + visible[0].target.id);
				}
			},
			{ root: null, rootMargin: '-35% 0px -50% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
		);
		sectionMap.forEach(function (s) {
			observer.observe(s.el);
		});
	}

	navLinks.forEach(function (link) {
		link.addEventListener('click', function () {
			var href = link.getAttribute('href');
			if (href && href.charAt(0) === '#') setActive(href);
		});
	});

	var revealEls = document.querySelectorAll('.reveal');
	if ('IntersectionObserver' in window && revealEls.length) {
		var revealObs = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (e) {
					if (e.isIntersecting) {
						e.target.classList.add('is-visible');
						revealObs.unobserve(e.target);
					}
				});
			},
			{ rootMargin: '0px 0px -10% 0px', threshold: 0.06 }
		);
		revealEls.forEach(function (el) {
			revealObs.observe(el);
		});
	} else {
		revealEls.forEach(function (el) {
			el.classList.add('is-visible');
		});
	}
})();
