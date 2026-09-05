/**
 * AI Lab Interactive Terminal Simulator
 * Allows visitors to run interactive AI commands, inspect model loading, embeddings, and inference.
 */

(function () {
  const terminalCommands = {
    help: {
      output: `AVAILABLE AI COMMANDS:
  load_model        Load multimodal LLM weights (Local / Cloud)
  create_embeddings Chunk and vectorize document corpus (128 dims)
  retrieve_context  Execute cosine similarity vector search
  generate          Run grounded structured generation pipeline
  run_eval          Run regression assertions & token validation
  benchmarks        Display latency, throughput, and error reduction metrics
  sysinfo           Show AI engineering runtime & toolchain
  clear             Clear the terminal console`,
      type: "info"
    },

    load_model: {
      output: `[INIT] Loading Gemini 1.5 & Ollama runtime...
[SUCCESS] Model weights loaded into memory.
  ✦ Quantization: FP16 / Native API
  ✦ Context Window: 128,000 tokens
  ✦ Multimodal Vision: Enabled`,
      type: "success"
    },

    create_embeddings: {
      output: `[EMBED] Splitting document into semantic chunks (size: 512, overlap: 64)...
[VECTOR] Computing dense vector embeddings via text-embedding-3 / GTE...
[INDEX] 128 chunks indexed into local vector store. Dimension: 768.`,
      type: "highlight"
    },

    retrieve_context: {
      output: `[QUERY] "What are the contractual liability limitations and payment milestones?"
[SEARCH] Executing dense cosine similarity search over vector index...
  ✦ Chunk #08 (Score: 0.942): "Liability shall not exceed $500,000 USD..."
  ✦ Chunk #19 (Score: 0.918): "Net 30 payment terms upon milestone signoff..."
  ✦ Chunk #42 (Score: 0.889): "Governing law of Delaware..."
[RESULT] 3 top-k chunks retrieved and injected into prompt context.`,
      type: "info"
    },

    generate: {
      output: `[PROMPT] Constructing Chain-of-Thought reasoning template with strict JSON Schema...
[INFERENCE] Streaming tokens via Multimodal Reasoner...
{
  "contract_type": "Master Services Agreement",
  "liability_cap": "$500,000 USD",
  "payment_terms": "Net 30",
  "provenance": ["Chunk #08", "Chunk #19"],
  "schema_conformance": true
}
[STATUS] 200 OK • 312ms latency • 0 schema errors`,
      type: "success"
    },

    run_eval: {
      output: `[TEST SUITE] Running 24 prompt evaluation assertions...
  ✓ Test 01: Strict JSON Schema validity ........... PASSED (100%)
  ✓ Test 02: Hallucination rate (< 0.5%) ............ PASSED (0.0%)
  ✓ Test 03: Grounded citation recall ............... PASSED (98.6%)
  ✓ Test 04: Parsing error reduction ............... PASSED (40%+ improvement)
All assertions passed cleanly.`,
      type: "success"
    },

    benchmarks: {
      output: `AI SYSTEM BENCHMARK TELEMETRY:
  ✦ Parsing Error Reduction: 40%+ (Verified across contracts & invoices)
  ✦ Average Latency (p95):   380ms
  ✦ Token Efficiency:        -28% token consumption with structured few-shot
  ✦ Citation Accuracy:       99.2% grounded provenance`,
      type: "highlight"
    },

    sysinfo: {
      output: `AI LAB RUNTIME & ENVIRONMENT:
  ✦ Core:       Python 3.12, TypeScript, ES Modules
  ✦ LLMs:       Gemini 1.5, OpenAI GPT-4o, Anthropic Claude, Ollama (Local)
  ✦ Vector:     ChromaDB, Pinecone, Semantic Embeddings
  ✦ Systems:    REST APIs, Async Pipelines, Pydantic, JSON Schema
  ✦ Mobile:     Swift, ARKit, SceneKit (Project of the Year 2025)`,
      type: "info"
    }
  };

  function initTerminal() {
    const bodyEl = document.getElementById("terminal-output-body");
    const inputEl = document.getElementById("terminal-cli-input");
    const quickButtons = document.querySelectorAll(".terminal-quick-btn");

    if (!bodyEl || !inputEl) return;

    function appendLine(command, responseObj) {
      // User input line
      const userRow = document.createElement("div");
      userRow.className = "terminal-line";
      userRow.innerHTML = `<span class="terminal-prompt">$</span> <span>${escapeHtml(command)}</span>`;
      bodyEl.appendChild(userRow);

      // System output
      if (responseObj) {
        const outRow = document.createElement("div");
        outRow.className = `terminal-output ${responseObj.type || ""}`;
        outRow.textContent = responseObj.output;
        bodyEl.appendChild(outRow);
      }

      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    function executeCommand(cmdStr) {
      const cleanCmd = cmdStr.trim().toLowerCase();
      if (!cleanCmd) return;

      if (cleanCmd === "clear") {
        bodyEl.innerHTML = "";
        return;
      }

      const match = terminalCommands[cleanCmd];
      if (match) {
        appendLine(cleanCmd, match);
      } else {
        appendLine(cleanCmd, {
          output: `Command not recognized: '${cleanCmd}'. Type 'help' to view available AI lab commands.`,
          type: "error"
        });
      }
    }

    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const val = inputEl.value;
        inputEl.value = "";
        executeCommand(val);
      }
    });

    quickButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const cmd = btn.getAttribute("data-cmd");
        if (cmd) executeCommand(cmd);
      });
    });

    // Auto-run welcome sequence
    setTimeout(() => {
      appendLine("load_model", terminalCommands.load_model);
      setTimeout(() => {
        appendLine("create_embeddings", terminalCommands.create_embeddings);
      }, 700);
    }, 400);
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  document.addEventListener("DOMContentLoaded", initTerminal);
})();
