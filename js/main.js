/**
 * ====================================================================
 * PORTFOLIO JAVASCRIPT (main.js)
 * Clean, Simple, Lightweight (Mobile Menu & Contact Form Handler)
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById("mobile-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener("click", () => {
      mobileToggle.classList.toggle("active");
      mobileDrawer.classList.toggle("open");
    });

    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        mobileToggle.classList.remove("active");
        mobileDrawer.classList.remove("open");
      });
    });
  }

  // 2. Contact Form Mailto Handler
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      // Read recipient email from contact link in page, or fallback
      const emailEl = document.querySelector('a[href^="mailto:"]');
      const recipient = emailEl ? emailEl.getAttribute("href").replace("mailto:", "") : "your.email@example.com";

      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    });
  }
});
