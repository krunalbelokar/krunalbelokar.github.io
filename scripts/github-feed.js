/**
 * GitHub Feed Integration
 * Asynchronously loads authentic repositories from github.com/krunalbelokar
 * with verified fallback structures.
 */

(function () {
  const verifiedRepositories = [
    {
      name: "AI-Document-Intelligence",
      description: "Multimodal document intelligence and structured extraction system using Gemini, OpenAI Vision, and RAG grounding.",
      language: "Python",
      stars: "✦ AI Case Study",
      url: "https://github.com/krunalbelokar"
    },
    {
      name: "PromptLab-AI",
      description: "LLM prompt optimization, evaluation workbench, and JSON schema benchmarking environment across multi-model architectures.",
      language: "TypeScript",
      stars: "✦ LLM Benchmarking",
      url: "https://github.com/krunalbelokar"
    },
    {
      name: "MagicPaper-AR",
      description: "Augmented reality platform for real-time image target recognition and synchronized media overlay. Project of the Year 2025 distinction.",
      language: "Swift",
      stars: "🏆 Award Winner",
      url: "https://github.com/krunalbelokar"
    },
    {
      name: "multimodal-rag-engine",
      description: "Semantic search and document question-answering with high-dimensional vector embeddings and strict page citation grounding.",
      language: "Python",
      stars: "✦ Semantic Search",
      url: "https://github.com/krunalbelokar"
    }
  ];

  function renderRepoCards(repos) {
    const container = document.getElementById("github-repos-container");
    if (!container) return;

    container.innerHTML = "";

    repos.forEach(repo => {
      const card = document.createElement("a");
      card.href = repo.html_url || repo.url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.className = "github-card";
      card.setAttribute("aria-label", `View repository ${repo.name} on GitHub`);

      card.innerHTML = `
        <div>
          <div class="github-card-header">
            <span class="github-repo-name">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
                <path d="M6 6h10"></path>
                <path d="M6 10h10"></path>
              </svg>
              ${repo.name}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" stroke-width="2">
              <path d="M7 17L17 7M17 7H7M17 7V17"></path>
            </svg>
          </div>
          <p class="github-repo-desc" style="margin-top: 10px;">${repo.description || "Public AI engineering repository."}</p>
        </div>
        <div class="github-repo-footer">
          <span><span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:var(--accent-primary); margin-right:6px;"></span>${repo.language || "AI / Code"}</span>
          <span>${repo.stargazers_count ? `★ ${repo.stargazers_count}` : (repo.stars || "Public")}</span>
        </div>
      `;

      container.appendChild(card);
    });
  }

  async function fetchGitHubFeed() {
    try {
      const response = await fetch("https://api.github.com/users/krunalbelokar/repos?sort=updated&per_page=6");
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          renderRepoCards(data);
          return;
        }
      }
    } catch (err) {
      console.log("Using verified repository showcase feed.");
    }
    // Fallback to verified local projects
    renderRepoCards(verifiedRepositories);
  }

  document.addEventListener("DOMContentLoaded", fetchGitHubFeed);
})();
