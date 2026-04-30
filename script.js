const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            }
        });
    },
    {
        threshold: 0.15,
    }
);

document.querySelectorAll(".reveal").forEach((element) => {
    observer.observe(element);
});

document.querySelectorAll(".category-card, .step-card").forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index, 5) * 70}ms`;
});