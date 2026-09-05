/**
 * AI System Architecture Pipeline Visualizer
 * Simulates real-time telemetry and interactive node inspection.
 */

(function () {
  const pipelineData = [
    {
      id: "doc",
      name: "DOCUMENT",
      type: "Ingestion",
      metric: "PDF / TIFF / Scans",
      description: "Ingests multi-page documents, PDFs, scanned invoices, and complex layout media with high-resolution handling.",
      telemetry: "Chunking rate: 120 pages/min • Lossless prep"
    },
    {
      id: "vision",
      name: "VISION / OCR",
      type: "Perception",
      metric: "Bounding Boxes & Layout",
      description: "Extracts visual coordinates, tabular geometry, and optical character streams while preserving document spatial hierarchy.",
      telemetry: "Spatial layout confidence: 99.4% • Bounding accuracy: ±1.2px"
    },
    {
      id: "llm",
      name: "MULTIMODAL LLM",
      type: "Reasoning",
      metric: "Gemini / GPT-4o",
      description: "Processes combined visual tokens and extracted text using multimodal attention to understand contextual nuance.",
      telemetry: "Context window: 128k tokens • Multimodal tensor active"
    },
    {
      id: "retrieval",
      name: "RETRIEVAL",
      type: "Grounding",
      metric: "Dense Vector Search",
      description: "Queries high-dimensional embedding spaces (cosine similarity) to ground generation with verified source context.",
      telemetry: "Top-k: 5 chunks • Semantic threshold: >0.84"
    },
    {
      id: "prompt",
      name: "PROMPT PIPELINE",
      type: "Steering",
      metric: "Few-Shot + CoT",
      description: "Constructs dynamically validated prompt structures with Chain-of-Thought reasoning steps and strict guardrails.",
      telemetry: "Zero-shot fallback: Ready • CoT trace active"
    },
    {
      id: "structured",
      name: "STRUCTURED OUTPUT",
      type: "Validation",
      metric: "Strict JSON Schema",
      description: "Enforces deterministic Pydantic / JSON schema conformance, preventing hallucinations and formatting drift.",
      telemetry: "Schema conformity: 100% • 40%+ reduction in parsing errors"
    },
    {
      id: "app",
      name: "AI APPLICATION",
      type: "Delivery",
      metric: "REST / Production UI",
      description: "Streams structured payloads and citation-grounded answers into user interfaces and automated business workflows.",
      telemetry: "p95 Latency: 420ms • Zero schema drift"
    }
  ];

  function initHeroPipeline() {
    const container = document.getElementById("hero-pipeline-nodes");
    const telemetryDisplay = document.getElementById("hero-pipeline-telemetry");
    if (!container) return;

    container.innerHTML = "";

    pipelineData.forEach((node, idx) => {
      const nodeEl = document.createElement("div");
      nodeEl.className = `pipeline-node ${idx === 0 ? "active pulsing" : ""}`;
      nodeEl.setAttribute("data-id", node.id);
      nodeEl.setAttribute("role", "button");
      nodeEl.setAttribute("tabindex", "0");
      nodeEl.setAttribute("aria-label", `Inspect ${node.name} pipeline stage`);

      nodeEl.innerHTML = `
        <div class="node-label-group">
          <span class="node-index">0${idx + 1}</span>
          <span class="node-name">${node.name}</span>
        </div>
        <span class="node-metric">${node.metric}</span>
      `;

      nodeEl.addEventListener("click", () => selectNode(idx));
      nodeEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectNode(idx);
        }
      });

      container.appendChild(nodeEl);

      if (idx < pipelineData.length - 1) {
        const connector = document.createElement("div");
        connector.className = "node-connector";
        container.appendChild(connector);
      }
    });

    let currentActive = 0;
    function selectNode(index) {
      currentActive = index;
      const nodes = container.querySelectorAll(".pipeline-node");
      nodes.forEach((n, i) => {
        n.classList.remove("active", "pulsing");
        if (i === index) {
          n.classList.add("active", "pulsing");
        }
      });

      if (telemetryDisplay) {
        const node = pipelineData[index];
        telemetryDisplay.textContent = `[STAGE 0${index + 1} — ${node.name}] ${node.telemetry}`;
      }
    }

    // Auto-advance pulse every 3.5 seconds
    setInterval(() => {
      currentActive = (currentActive + 1) % pipelineData.length;
      selectNode(currentActive);
    }, 3500);
  }

  function initSystemsPipeline() {
    const cards = document.querySelectorAll(".system-step-card");
    const inspector = document.getElementById("system-inspector-content");
    if (!cards.length || !inspector) return;

    cards.forEach((card, index) => {
      card.addEventListener("click", () => {
        cards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        
        const data = pipelineData[index] || pipelineData[0];
        inspector.innerHTML = `
          <div class="inspector-header">
            <span class="inspector-title">STAGE 0${index + 1}: ${data.name} // ${data.type.toUpperCase()}</span>
            <span class="badge badge-tech">${data.metric}</span>
          </div>
          <p class="inspector-body">${data.description}</p>
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); margin-top: 8px;">
            ✦ Telemetry: ${data.telemetry}
          </div>
        `;
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initHeroPipeline();
    initSystemsPipeline();
  });
})();
