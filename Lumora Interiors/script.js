// =================================
// MOBILE NAVIGATION
// =================================

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    // Close menu after clicking a navigation link
    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });
    });
}


// =================================
// HERO SLIDER
// =================================

const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".dot");
const nextButton = document.querySelector(".slider-arrow.next");
const prevButton = document.querySelector(".slider-arrow.prev");

let currentSlide = 0;
let sliderInterval;


function showSlide(index) {

    slides.forEach((slide) => {
        slide.classList.remove("active");
    });

    dots.forEach((dot) => {
        dot.classList.remove("active");
    });

    slides[index].classList.add("active");
    dots[index].classList.add("active");

    currentSlide = index;
}


function nextSlide() {

    let nextIndex = currentSlide + 1;

    if (nextIndex >= slides.length) {
        nextIndex = 0;
    }

    showSlide(nextIndex);
}


function previousSlide() {

    let previousIndex = currentSlide - 1;

    if (previousIndex < 0) {
        previousIndex = slides.length - 1;
    }

    showSlide(previousIndex);
}


// Only run slider code on the homepage
if (slides.length > 0 && nextButton && prevButton) {

    nextButton.addEventListener("click", () => {

        previousTimer();
        nextSlide();
        startTimer();

    });

    prevButton.addEventListener("click", () => {

        previousTimer();
        previousSlide();
        startTimer();

    });


    dots.forEach((dot, index) => {

        dot.addEventListener("click", () => {

            previousTimer();
            showSlide(index);
            startTimer();

        });

    });


    function startTimer() {

        sliderInterval = setInterval(nextSlide, 4000);

    }


    function previousTimer() {

        clearInterval(sliderInterval);

    }


    startTimer();
}


// =================================
// SCROLL REVEAL
// =================================

const revealSections = document.querySelectorAll(
    ".about-section, .services-section, .projects-section, .why-section, .testimonials-section, .cta-section"
);

const revealObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("reveal");

                revealObserver.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.1
    }
);


revealSections.forEach((section) => {

    revealObserver.observe(section);

});