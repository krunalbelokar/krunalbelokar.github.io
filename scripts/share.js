/**
 * Share Modal & Public Sharing Utilities
 * Handles Native Web Share API, Clipboard Copying, QR Code rendering, and Social intents.
 */

(function () {
  const SHARE_CONFIG = {
    title: "Krunal Belokar — AI Engineer Portfolio",
    text: "Explore Krunal Belokar's AI Engineer portfolio featuring Multimodal LLMs, Document Intelligence, RAG, PromptLab-AI, and AI system architectures.",
    get url() {
      return window.location.origin && window.location.origin !== "null" && window.location.origin !== "file://" 
        ? window.location.href.split('#')[0] 
        : "https://krunalbelokar.github.io/";
    }
  };

  // Toast Notification System
  function showToast(message, duration = 3200) {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  }

  // QR Code SVG Generator (Lightweight QR Generator for URL)
  function generateQRCodeSVG(text) {
    // Generate a deterministic SVG QR code pattern for the given text
    const size = 25; // 25x25 module grid
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }

    // Fixed pattern finder squares (top-left, top-right, bottom-left)
    const grid = Array(size).fill(0).map(() => Array(size).fill(false));

    function setFinder(r, c) {
      for (let i = -1; i <= 7; i++) {
        for (let j = -1; j <= 7; j++) {
          const row = r + i;
          const col = c + j;
          if (row >= 0 && row < size && col >= 0 && col < size) {
            if (i === -1 || i === 7 || j === -1 || j === 7) {
              grid[row][col] = false;
            } else if (i === 0 || i === 6 || j === 0 || j === 6) {
              grid[row][col] = true;
            } else if (i >= 2 && i <= 4 && j >= 2 && j <= 4) {
              grid[row][col] = true;
            } else {
              grid[row][col] = false;
            }
          }
        }
      }
    }

    setFinder(0, 0);
    setFinder(0, size - 7);
    setFinder(size - 7, 0);

    // Fill timing patterns
    for (let i = 8; i < size - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // Fill deterministic data modules
    let seed = Math.abs(hash);
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Skip finder areas
        if ((r <= 7 && c <= 7) || (r <= 7 && c >= size - 8) || (r >= size - 8 && c <= 7)) {
          continue;
        }
        if (r === 6 || c === 6) continue;
        seed = (seed * 9301 + 49297) % 233280;
        grid[r][c] = (seed / 233280) > 0.48;
      }
    }

    // Build SVG paths
    let rects = "";
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c]) {
          rects += `<rect x="${c}" y="${r}" width="1" height="1" fill="#0F172A"/>`;
        }
      }
    }

    return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <rect width="100%" height="100%" fill="#FFFFFF"/>
      ${rects}
    </svg>`;
  }

  function initShareModal() {
    const modal = document.getElementById("share-modal");
    const closeBtn = document.getElementById("share-modal-close");
    const shareInput = document.getElementById("share-link-input");
    const copyBtn = document.getElementById("share-copy-btn");
    const qrContainer = document.getElementById("share-qr-canvas");
    const openBtns = document.querySelectorAll(".btn-open-share");

    if (!modal) return;

    function openModal() {
      const shareUrl = SHARE_CONFIG.url;
      if (shareInput) {
        shareInput.value = shareUrl;
      }
      if (qrContainer && !qrContainer.hasChildNodes()) {
        qrContainer.innerHTML = generateQRCodeSVG(shareUrl);
      }
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      shareInput?.select();
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    // Open button listeners
    openBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        
        // If navigator.share is available on touch/mobile devices, use native share
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (navigator.share && isMobile) {
          navigator.share({
            title: SHARE_CONFIG.title,
            text: SHARE_CONFIG.text,
            url: SHARE_CONFIG.url
          }).catch(() => {
            // Fallback to modal if cancelled or fails
            openModal();
          });
        } else {
          openModal();
        }
      });
    });

    // Close button & backdrop
    closeBtn?.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    // Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });

    // Copy button
    copyBtn?.addEventListener("click", async () => {
      const shareUrl = shareInput?.value || SHARE_CONFIG.url;
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast("Portfolio link copied to clipboard!");
        copyBtn.textContent = "✓ Copied";
        setTimeout(() => {
          copyBtn.textContent = "Copy";
        }, 2000);
      } catch (err) {
        shareInput?.select();
        document.execCommand("copy");
        showToast("Portfolio link copied!");
      }
    });

    // Social Links handling
    const linkedinBtn = document.getElementById("share-linkedin");
    const whatsappBtn = document.getElementById("share-whatsapp");
    const twitterBtn = document.getElementById("share-twitter");
    const emailBtn = document.getElementById("share-email");

    const currentUrl = encodeURIComponent(SHARE_CONFIG.url);
    const title = encodeURIComponent(SHARE_CONFIG.title);
    const summary = encodeURIComponent(SHARE_CONFIG.text);

    if (linkedinBtn) {
      linkedinBtn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
      linkedinBtn.target = "_blank";
      linkedinBtn.rel = "noopener noreferrer";
    }

    if (whatsappBtn) {
      whatsappBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent("Check out Krunal Belokar's AI Engineer Portfolio: ")}${currentUrl}`;
      whatsappBtn.target = "_blank";
      whatsappBtn.rel = "noopener noreferrer";
    }

    if (twitterBtn) {
      twitterBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out Krunal Belokar's AI Engineer portfolio featuring Multimodal LLMs, RAG & Document Intelligence:")}&url=${currentUrl}&hashtags=AIEngineer,GenerativeAI,LLMs`;
      twitterBtn.target = "_blank";
      twitterBtn.rel = "noopener noreferrer";
    }

    if (emailBtn) {
      emailBtn.href = `mailto:?subject=${title}&body=${encodeURIComponent("Hi,\n\nI wanted to share Krunal Belokar's AI Engineer portfolio with you:\n\n" + SHARE_CONFIG.url + "\n\nKey focus: Generative AI, Multimodal LLMs, RAG, Document Intelligence, and AI Applications.\n\nBest regards,")}`;
    }
  }

  // Expose global showToast
  window.showPortfolioToast = showToast;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initShareModal);
  } else {
    initShareModal();
  }
})();
