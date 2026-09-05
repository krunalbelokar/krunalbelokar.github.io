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
    const submitBtn = document.getElementById("contact-submit-btn");
    if (!form || !feedback) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("contact-name")?.value.trim();
      const email = document.getElementById("contact-email")?.value.trim();
      const message = document.getElementById("contact-message")?.value.trim();

      if (!name || !email || !message) {
        alert("Please fill in all required fields.");
        return;
      }

      // Set Loading State on Submit Button
      const originalBtnText = submitBtn ? submitBtn.innerHTML : "Send Message →";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 0.8s linear infinite;">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
          <span>Sending to Krunal's Inbox...</span>
        `;
      }

      try {
        const formData = new FormData(form);
        const response = await fetch("https://formspree.io/f/mwlkqjga", {
          method: "POST",
          body: formData,
          headers: {
            "Accept": "application/json"
          }
        });

        if (response.ok) {
          feedback.innerHTML = `<strong>✓ Message Sent Successfully!</strong><br>Thank you, ${name}. Your message was delivered straight to Krunal's inbox (krunalbelokar@gmail.com). I will respond to you at <strong>${email}</strong> shortly.`;
          feedback.className = "form-feedback success";
          feedback.style.display = "block";
          form.reset();

          if (window.showPortfolioToast) {
            window.showPortfolioToast("Message delivered to Krunal Belokar!");
          }
        } else {
          const data = await response.json();
          if (data && data.errors) {
            const errorMsg = data.errors.map(err => err.message).join(", ");
            feedback.innerHTML = `<span>⚠️</span> ${errorMsg}`;
          } else {
            feedback.innerHTML = `<span>⚠️</span> Oops! There was an issue submitting the message. Please email directly to <a href="mailto:krunalbelokar@gmail.com" style="color: var(--accent-primary); text-decoration: underline;">krunalbelokar@gmail.com</a>.`;
          }
          feedback.className = "form-feedback error";
          feedback.style.display = "block";
        }
      } catch (err) {
        console.error("Formspree submission error:", err);
        feedback.innerHTML = `<span>⚠️</span> Network error. Please send an email directly to <a href="mailto:krunalbelokar@gmail.com" style="color: var(--accent-primary); text-decoration: underline;">krunalbelokar@gmail.com</a> or WhatsApp (+91 7219680894).`;
        feedback.className = "form-feedback error";
        feedback.style.display = "block";
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
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
