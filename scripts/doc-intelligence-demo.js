/**
 * AI Document Intelligence Interactive Simulation
 * Showcases multimodal extraction, schema enforcement, and grounded citations.
 */

(function () {
  const sampleDocuments = {
    contract: {
      name: "contract_agreement.pdf",
      size: "2.4 MB • 4 Pages",
      type: "Master Services Agreement",
      rawPreview: `MASTER SERVICES AGREEMENT
BETWEEN:
  Client: Apex Global Enterprises LLC (Delaware Corp)
  Provider: NeuralScale AI Technologies Inc.
EFFECTIVE DATE: March 15, 2025
TERM: 24 Months, Auto-renewing.

CLAUSE 4.2 - LIABILITY & INDEMNIFICATION:
Provider aggregate liability under this agreement shall not exceed $500,000 USD or the total fees paid during preceding 12 months.

CLAUSE 8.1 - DATA PRIVACY & COMPLIANCE:
All customer telemetry processed via Multimodal LLM endpoints shall remain strictly zero-retention and SOC2 Type II compliant.`,
      jsonOutput: {
        document_type: "master_services_agreement",
        extraction_confidence: 0.994,
        parties: [
          { role: "client", entity: "Apex Global Enterprises LLC", jurisdiction: "Delaware" },
          { role: "provider", entity: "NeuralScale AI Technologies Inc." }
        ],
        effective_date: "2025-03-15",
        term_months: 24,
        clauses: [
          {
            id: "4.2",
            type: "liability_limitation",
            liability_cap_usd: 500000,
            citation: "Page 1, Paragraph 4"
          },
          {
            id: "8.1",
            type: "data_privacy",
            zero_retention_guaranteed: true,
            compliance_standard: "SOC2 Type II",
            citation: "Page 2, Paragraph 1"
          }
        ],
        schema_validation: "PASSED (0 errors, 40%+ reduction vs regex/raw OCR)"
      },
      citations: [
        { label: "Page 1 • §4.2 Liability Cap ($500k)", text: "Provider aggregate liability shall not exceed $500,000 USD." },
        { label: "Page 2 • §8.1 SOC2 Data Security", text: "Zero-retention and SOC2 Type II compliant." }
      ]
    },

    invoice: {
      name: "enterprise_invoice_8921.pdf",
      size: "1.1 MB • 1 Page",
      type: "Commercial Tax Invoice",
      rawPreview: `INVOICE #INV-2025-8921
ISSUED BY: CloudCore Compute Systems Ltd.
BILL TO: Vertex AI Labs
DATE: 2025-02-28 | DUE DATE: 2025-03-30

LINE ITEMS:
1. H100 GPU Cluster Dedicated (720 hrs) ........... $14,400.00
2. Vector Index Storage (500M vectors) ............ $1,250.00
3. Multimodal Inference Tokens (48M tokens) ....... $960.00

SUBTOTAL: $16,610.00
TAX (VAT 10%): $1,661.00
TOTAL AMOUNT DUE: $18,271.00 USD`,
      jsonOutput: {
        document_type: "tax_invoice",
        invoice_number: "INV-2025-8921",
        billing_date: "2025-02-28",
        due_date: "2025-03-30",
        vendor: "CloudCore Compute Systems Ltd.",
        customer: "Vertex AI Labs",
        currency: "USD",
        items: [
          { description: "H100 GPU Cluster Dedicated", quantity_hrs: 720, total: 14400.00 },
          { description: "Vector Index Storage", units: "500M vectors", total: 1250.00 },
          { description: "Multimodal Inference Tokens", units: "48M tokens", total: 960.00 }
        ],
        subtotal: 16610.00,
        tax_total: 1661.00,
        total_due: 18271.00,
        schema_validation: "PASSED (Calculated sums match line items exactly)"
      },
      citations: [
        { label: "Header • Tax ID Validated", text: "CloudCore Compute Systems Ltd. VAT Match" },
        { label: "Line Items • 3 Products Verified", text: "720 hrs GPU, 500M Vectors, 48M Tokens" }
      ]
    },

    scanned_form: {
      name: "noisy_scanned_contract.pdf",
      size: "3.8 MB • Scanned Form",
      type: "Skewed & Noisy Paper Document",
      rawPreview: `[SCANNED IMAGE - DESKEWED & DENOISED]
NAME: Krunal Belokar
AFFILIATION: Generative AI & Systems Research
EXPERIENCE: LLM Architectures, RAG, Prompt Pipelines
METRIC: 40%+ reduction in document parsing errors.
REMARKS: Multimodal vision applied to decode handwritten annotations and irregular table borders.`,
      jsonOutput: {
        document_type: "scanned_verification_form",
        optical_quality: "skew_corrected",
        denoising_applied: true,
        extracted_fields: {
          candidate_name: "Krunal Belokar",
          domain: "AI Engineering & LLMs",
          specializations: ["Document Intelligence", "Multimodal Reasoning", "RAG Systems"],
          benchmark_improvement: "40%+ reduction in parsing errors"
        },
        schema_validation: "PASSED (Noisy artifacts suppressed)"
      },
      citations: [
        { label: "Vision Layer • 99.2% OCR confidence", text: "Denoised and de-skewed layout" },
        { label: "Verification • Metric Grounded", text: "40%+ error reduction confirmed" }
      ]
    }
  };

  function syntaxHighlightJson(jsonObj) {
    const jsonStr = JSON.stringify(jsonObj, null, 2);
    return jsonStr.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'syntax-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'syntax-key';
        } else {
          cls = 'syntax-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'syntax-boolean';
      } else if (/null/.test(match)) {
        cls = 'syntax-comment';
      }
      return `<span style="color: var(--${cls})">${match}</span>`;
    });
  }

  function initDocDemo() {
    const selectorButtons = document.querySelectorAll(".doc-sample-btn");
    const docMetaName = document.getElementById("doc-meta-name");
    const docMetaSize = document.getElementById("doc-meta-size");
    const docPreviewText = document.getElementById("doc-raw-preview");
    const docJsonDisplay = document.getElementById("doc-json-output");
    const citationsContainer = document.getElementById("doc-citations-list");
    const stepElements = [
      document.getElementById("doc-step-1"),
      document.getElementById("doc-step-2"),
      document.getElementById("doc-step-3"),
      document.getElementById("doc-step-4")
    ];

    if (!docJsonDisplay) return;

    let isProcessing = false;

    function renderDocument(key) {
      if (isProcessing) return;
      const data = sampleDocuments[key] || sampleDocuments.contract;

      selectorButtons.forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-sample") === key);
      });

      if (docMetaName) docMetaName.textContent = data.name;
      if (docMetaSize) docMetaSize.textContent = data.size;
      if (docPreviewText) docPreviewText.textContent = data.rawPreview;

      // Animate extraction steps
      isProcessing = true;
      stepElements.forEach(el => {
        if (el) {
          el.className = "doc-step-item";
          el.querySelector(".step-status").textContent = "Pending";
        }
      });

      docJsonDisplay.innerHTML = `<span style="color: var(--text-tertiary);">/* Initializing Multimodal Reasoning Pipeline... */</span>`;

      let currentStep = 0;
      const stepInterval = setInterval(() => {
        if (currentStep < stepElements.length) {
          const el = stepElements[currentStep];
          if (el) {
            el.classList.add("active");
            el.querySelector(".step-status").textContent = "Processing...";
          }

          if (currentStep > 0 && stepElements[currentStep - 1]) {
            stepElements[currentStep - 1].classList.remove("active");
            stepElements[currentStep - 1].classList.add("done");
            stepElements[currentStep - 1].querySelector(".step-status").textContent = "✓ Complete";
          }

          currentStep++;
        } else {
          clearInterval(stepInterval);
          if (stepElements[stepElements.length - 1]) {
            stepElements[stepElements.length - 1].classList.remove("active");
            stepElements[stepElements.length - 1].classList.add("done");
            stepElements[stepElements.length - 1].querySelector(".step-status").textContent = "✓ Validated";
          }

          // Output formatted JSON
          docJsonDisplay.innerHTML = syntaxHighlightJson(data.jsonOutput);

          // Render Citations
          if (citationsContainer) {
            citationsContainer.innerHTML = "";
            data.citations.forEach(cit => {
              const chip = document.createElement("span");
              chip.className = "citation-chip";
              chip.innerHTML = `✦ ${cit.label}`;
              chip.title = cit.text;
              citationsContainer.appendChild(chip);
            });
          }

          isProcessing = false;
        }
      }, 350);
    }

    selectorButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-sample");
        renderDocument(key);
      });
    });

    // Initial render
    renderDocument("contract");
  }

  document.addEventListener("DOMContentLoaded", initDocDemo);
})();
