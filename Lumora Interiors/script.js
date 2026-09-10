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
// =================================
// =================================
// CONTACT FORM
// =================================

const contactForm = document.querySelector("#contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const submitButton =
            contactForm.querySelector(".form-submit");


        // =================================
        // GET FORM DATA
        // =================================

        const formData = new FormData(contactForm);

        const enquiryData = {

            name: formData.get("name").trim(),

            email: formData.get("email").trim(),

            phone: formData.get("phone").trim(),

            projectType:
                formData.get("projectType"),

            message:
                formData.get("message").trim()

        };


        // =================================
        // FRONTEND VALIDATION
        // =================================

        if (
            !enquiryData.name ||
            !enquiryData.email ||
            !enquiryData.message
        ) {

            alert(
                "Please fill in all required fields."
            );

            return;

        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(enquiryData.email)) {

            alert(
                "Please enter a valid email address."
            );

            return;

        }


        if (enquiryData.message.length < 5) {

            alert(
                "Please provide a little more information about your project."
            );

            return;

        }


        // =================================
        // SUBMITTING STATE
        // =================================

        submitButton.disabled = true;

        submitButton.textContent = "Sending...";


        try {

            const response = await fetch(
                "https://lumora-backend-ry3c.onrender.com/api/contact",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(enquiryData)
                }
            );


            const result =
                await response.json();


            // =================================
            // SUCCESS
            // =================================

            if (response.ok) {

                submitButton.textContent =
                    "Enquiry Sent ✓";

                alert(
                    "Thank you! Your enquiry has been received."
                );

                contactForm.reset();


                setTimeout(() => {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        "Send Enquiry →";

                }, 3000);

            }


            // =================================
            // SERVER ERROR
            // =================================

            else {

                throw new Error(
                    result.message ||
                    "Something went wrong."
                );

            }


        } catch (error) {

            console.error(
                "Contact form error:",
                error
            );

            submitButton.disabled = false;

            submitButton.textContent =
                "Send Enquiry →";

            alert(
                error.message ||
                "Unable to send your enquiry. Please try again."
            );

        }

    });

}
// LUMORA
