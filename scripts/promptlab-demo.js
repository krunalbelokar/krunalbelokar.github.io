/**
 * PromptLab-AI Multi-Model Evaluation Workbench
 * Simulates prompt optimization, latency analysis, and schema validation across LLMs.
 */

(function () {
  const promptTemplates = {
    extraction: {
      title: "Structured Schema Extraction",
      promptText: `SYSTEM: You are a strict schema enforcement engine. Extract all compliance obligations, effective dates, and financial liabilities into Pydantic JSON. Output ONLY valid JSON without markdown wrapping.
USER: "Parse SLA section: Vendor must maintain 99.95% uptime. Failure results in 10% monthly service credit up to max $25,000 USD."`,
      models: {
        gemini: {
          name: "Gemini 1.5 Pro",
          latencyBase: 245,
          tokens: 184,
          validity: "100%",
          hallucination: "0.0%",
          output: `{"sla_target": 0.9995, "penalty_percent": 10, "max_liability_usd": 25000, "status": "deterministic_match"}`
        },
        gpt4o: {
          name: "OpenAI GPT-4o",
          latencyBase: 380,
          tokens: 192,
          validity: "100%",
          hallucination: "0.0%",
          output: `{"sla_target": 0.9995, "penalty_rate": "10%", "cap_usd": 25000, "compliance_verified": true}`
        },
        claude: {
          name: "Claude 3.5 Sonnet",
          latencyBase: 395,
          tokens: 188,
          validity: "100%",
          hallucination: "0.0%",
          output: `{"uptime_sla": 0.9995, "credit_pct": 10.0, "maximum_liability_usd": 25000.0, "schema_conformant": true}`
        }
      }
    },
    cot: {
      title: "Chain-of-Thought Verification",
      promptText: `SYSTEM: Think step-by-step before asserting compliance. List each reasoning clause, verify numerical ranges, and emit a final verdict.
USER: "Validate if contract clause §9.4 with $450,000 indemnity complies with board policy max $500,000."`,
      models: {
        gemini: {
          name: "Gemini 1.5 Pro",
          latencyBase: 290,
          tokens: 240,
          validity: "100%",
          hallucination: "0.0%",
          output: `Thought 1: Policy maximum is $500,000.\nThought 2: Clause §9.4 indemnity is $450,000.\nThought 3: 450,000 <= 500,000 is TRUE.\nVerdict: COMPLIANT.`
        },
        gpt4o: {
          name: "OpenAI GPT-4o",
          latencyBase: 410,
          tokens: 252,
          validity: "100%",
          hallucination: "0.0%",
          output: `Step 1: Extracted threshold = $500k.\nStep 2: Candidate value = $450k.\nStep 3: Evaluation: Satisfies bounded ceiling.\nResult: APPROVED.`
        },
        claude: {
          name: "Claude 3.5 Sonnet",
          latencyBase: 425,
          tokens: 248,
          validity: "100%",
          hallucination: "0.0%",
          output: `Analysis:\n- Board constraint ceiling: $500,000\n- Contract clause value: $450,000\n- Delta: -$50,000 margin\nConclusion: Valid & within tolerance.`
        }
      }
    },
    rag: {
      title: "RAG Semantic Synthesis",
      promptText: `SYSTEM: Synthesize response using ONLY the provided retrieved context chunks. If unknown, output 'INSUFFICIENT_CONTEXT'.
CONTEXT: Chunk #14: "Zero-retention policy applies to all customer vectors in region us-east-1."
USER: "What is the retention rule for us-east-1 embeddings?"`,
      models: {
        gemini: {
          name: "Gemini 1.5 Pro",
          latencyBase: 230,
          tokens: 160,
          validity: "100%",
          hallucination: "0.0%",
          output: `Grounded Answer: In us-east-1, all customer vectors are subject to a strict zero-retention policy [Source: Chunk #14].`
        },
        gpt4o: {
          name: "OpenAI GPT-4o",
          latencyBase: 360,
          tokens: 168,
          validity: "100%",
          hallucination: "0.0%",
          output: `Grounded Answer: Customer vector data in region us-east-1 is governed by a strict zero-retention policy.`
        },
        claude: {
          name: "Claude 3.5 Sonnet",
          latencyBase: 375,
          tokens: 164,
          validity: "100%",
          hallucination: "0.0%",
          output: `Grounded Answer: Vectors in the us-east-1 region follow a guaranteed zero-retention protocol (verified against Chunk #14).`
        }
      }
    }
  };

  function initPromptLab() {
    const tabs = document.querySelectorAll(".prompt-tab");
    const previewEl = document.getElementById("promptlab-preview");
    const tempSlider = document.getElementById("temp-slider");
    const tempVal = document.getElementById("temp-val");
    const topPSlider = document.getElementById("topp-slider");
    const topPVal = document.getElementById("topp-val");

    if (!previewEl) return;

    let currentKey = "extraction";

    function updateWorkbench() {
      const template = promptTemplates[currentKey] || promptTemplates.extraction;
      previewEl.textContent = template.promptText;

      const temp = parseFloat(tempSlider ? tempSlider.value : 0.2);
      const topP = parseFloat(topPSlider ? topPSlider.value : 0.9);

      if (tempVal) tempVal.textContent = temp.toFixed(1);
      if (topPVal) topPVal.textContent = topP.toFixed(1);

      // Update model column metrics & text
      Object.keys(template.models).forEach(modelKey => {
        const data = template.models[modelKey];
        const col = document.getElementById(`eval-${modelKey}`);
        if (!col) return;

        // Calculate dynamic latency variance based on temperature
        const computedLatency = Math.round(data.latencyBase + (temp * 40));
        
        const latencyEl = col.querySelector(".metric-latency");
        const tokensEl = col.querySelector(".metric-tokens");
        const validityEl = col.querySelector(".metric-validity");
        const outputEl = col.querySelector(".model-output-snippet");

        if (latencyEl) latencyEl.textContent = `${computedLatency}ms`;
        if (tokensEl) tokensEl.textContent = `${data.tokens}`;
        if (validityEl) validityEl.textContent = data.validity;
        if (outputEl) outputEl.textContent = data.output;
      });
    }

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        currentKey = tab.getAttribute("data-template");
        updateWorkbench();
      });
    });

    if (tempSlider) tempSlider.addEventListener("input", updateWorkbench);
    if (topPSlider) topPSlider.addEventListener("input", updateWorkbench);

    updateWorkbench();
  }

  document.addEventListener("DOMContentLoaded", initPromptLab);
})();
