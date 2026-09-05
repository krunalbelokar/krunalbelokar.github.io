/**
 * Main Application Orchestrator
 * Navigation, scroll-spy, micro-interactions, copy handlers, and contact validation.
 */

(function () {
  function initNavbar() {
    const navbar = document.getElementById("navbar");
    const hamburger = document.getElementById("nav-hamburger");
    const mobileDrawer = document.getElementById("mobile-drawer");
    const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

    // Scroll styling
    window.addEventListener("scroll", () => {
      if (window.scrollY > 30) {
        navbar?.classList.add("scrolled");
      } else {
        navbar?.classList.remove("scrolled");
      }
    }, { passive: true });

    // Mobile hamburger toggle
    if (hamburger && mobileDrawer) {
      hamburger.addEventListener("click", () => {
        const isActive = mobileDrawer.classList.toggle("active");
        hamburger.setAttribute("aria-expanded", isActive ? "true" : "false");
      });

      // Close drawer on click outside or on link click
      document.addEventListener("click", (e) => {
        if (!navbar.contains(e.target) && !mobileDrawer.contains(e.target)) {
          mobileDrawer.classList.remove("active");
          hamburger.setAttribute("aria-expanded", "false");
        }
      });
    }

    // Scroll spy
    const sections = document.querySelectorAll("section[id]");
    function updateScrollSpy() {
      const scrollY = window.scrollY + 120;
      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop;
        const sectionId = current.getAttribute("id");

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${sectionId}`) {
              link.classList.add("active");
            }
          });
        }
      });
    }

    window.addEventListener("scroll", updateScrollSpy, { passive: true });

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        mobileDrawer?.classList.remove("active");
        hamburger?.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(el => observer.observe(el));
  }

  function initCopyButtons() {
    const copyButtons = document.querySelectorAll(".btn-copy");
    copyButtons.forEach(btn => {
      btn.addEventListener("click", async () => {
        const textToCopy = btn.getAttribute("data-copy") || btn.textContent.trim();
        try {
          await navigator.clipboard.writeText(textToCopy);
          const originalText = btn.innerHTML;
          btn.innerHTML = `<span>✓ Copied!</span>`;
          btn.style.borderColor = "var(--signal-success)";
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.borderColor = "";
          }, 2000);
        } catch (err) {
          console.error("Clipboard copy failed", err);
        }
      });
    });
  }

  function initContactForm() {
    const form = document.getElementById("contact-form");
    const feedback = document.getElementById("contact-feedback");
    if (!form || !feedback) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("contact-name")?.value.trim();
      const email = document.getElementById("contact-email")?.value.trim();
      const message = document.getElementById("contact-message")?.value.trim();

      if (!name || !email || !message) {
        alert("Please fill in all required fields.");
        return;
      }

      // Display clean success acknowledgment
      feedback.textContent = `Thank you, ${name}! Your message has been received. I will get back to you shortly at ${email}.`;
      feedback.className = "form-feedback success";
      form.reset();

      setTimeout(() => {
        feedback.style.display = "none";
      }, 6000);
    });
  }

  function initCurrentYear() {
    const yearEl = document.getElementById("current-year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
    initScrollReveal();
    initCopyButtons();
    initContactForm();
    initCurrentYear();
  });
})();
