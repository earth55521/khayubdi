/* KHAYUBDI OS 2.0 Component Library Behavior */

const KhayubdiComponents = (() => {
  const selectAll = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function enhanceButtons(root = document) {
    selectAll("button, .quick-action, .link-button", root).forEach((button) => {
      button.classList.add("c-button");
      if (button.classList.contains("danger")) button.classList.add("c-button--danger");
      else if (button.classList.contains("secondary")) button.classList.add("c-button--secondary");
      else if (button.classList.contains("ghost") || button.classList.contains("link-button")) button.classList.add("c-button--ghost");
      else if (button.classList.contains("icon-button")) button.classList.add("c-button--icon");
      else if (!button.classList.contains("tab")) button.classList.add("c-button--primary");
      if (!button.getAttribute("aria-label") && button.classList.contains("icon-button")) {
        button.setAttribute("aria-label", button.textContent.trim() || "Action");
      }
      if (!button.getAttribute("aria-label") && !button.textContent.trim()) {
        button.setAttribute("aria-label", button.title || "Action");
      }
      if (!button.hasAttribute("type") && button.tagName === "BUTTON") button.setAttribute("type", "button");
    });
  }

  function enhanceCards(root = document) {
    selectAll(".chart-card, .entry-form, .store-card, .session-card, .dashboard-section, .quick-list", root).forEach((card) => {
      card.classList.add("c-card");
    });
    selectAll(".workout-hero, .workout-program-content, .zero-workout-card", root).forEach((card) => card.classList.add("c-card--workout"));
    selectAll(".zero-nutrition-top, .food-form-card, .nutrition-summary-card", root).forEach((card) => card.classList.add("c-card--nutrition"));
    selectAll(".metrics-grid article, .dashboard-grid article, .zero-finish-grid article", root).forEach((card) => card.classList.add("c-card", "c-card--statistics"));
    selectAll(".ux-home-shell, .ux-floating-actions, .ux-checkin-sheet", root).forEach((card) => card.classList.add("c-card--glass"));
  }

  function enhanceForms(root = document) {
    selectAll("input, select, textarea", root).forEach((field) => {
      field.classList.add("c-field");
      if (!field.id) field.id = `field-${Math.random().toString(36).slice(2, 9)}`;
      if (field.type === "search") field.closest("label")?.classList.add("c-search");
      if (field.required) field.setAttribute("aria-required", "true");
      if (!field.getAttribute("aria-label") && !field.closest("label")) {
        field.setAttribute("aria-label", field.name || field.id || "Field");
      }
      if (field.matches("[aria-invalid='true']") && !field.getAttribute("aria-describedby")) {
        const feedback = field.closest("form, .os-card, .entry-form")?.querySelector(".form-feedback, .save-feedback, [role='status']");
        if (feedback?.id) field.setAttribute("aria-describedby", feedback.id);
      }
    });
    selectAll('input[type="checkbox"]', root).forEach((field) => field.closest("label")?.classList.add("c-checkbox"));
    selectAll('input[type="radio"]', root).forEach((field) => field.closest("label")?.classList.add("c-radio"));
    selectAll('input[type="range"]', root).forEach((field) => field.classList.add("c-range"));
  }

  function enhanceFeedback(root = document) {
    selectAll(".toast, .snackbar", root).forEach((node) => node.classList.add("c-feedback"));
    selectAll(".modal-card, .ux-checkin-sheet", root).forEach((node) => node.classList.add("c-sheet"));
    selectAll(".skeleton, .skeleton-card, .loading, .loading-placeholder, .chart-skeleton", root).forEach((node) => node.classList.add("c-skeleton"));
    selectAll(".toast, .snackbar, .form-feedback, .save-feedback", root).forEach((node) => {
      if (!node.getAttribute("aria-live")) node.setAttribute("aria-live", "polite");
      if (!node.getAttribute("role")) node.setAttribute("role", "status");
    });
    selectAll("[role='dialog'], [role='alertdialog']", root).forEach((node) => {
      node.setAttribute("aria-modal", "true");
      if (!node.getAttribute("aria-labelledby")) {
        const title = node.querySelector("h1[id], h2[id], h3[id]");
        if (title) node.setAttribute("aria-labelledby", title.id);
      }
      if (!node.getAttribute("aria-describedby")) {
        const description = node.querySelector("p[id], .os-subtitle[id]");
        if (description) node.setAttribute("aria-describedby", description.id);
      }
    });
  }

  function enhanceProgress(root = document) {
    selectAll(".ux-mini-bar", root).forEach((node) => node.classList.add("c-progress-linear"));
    selectAll(".ux-mini-ring, .score-ring, .readiness-score-ring", root).forEach((node) => node.classList.add("c-progress-ring"));
  }

  function enhanceUtilities(root = document) {
    selectAll(".ux-avatar", root).forEach((node) => node.classList.add("c-avatar"));
    selectAll(".badge, .ai-badge, .beta-status-pill", root).forEach((node) => node.classList.add("c-badge"));
    selectAll(".chip, .chips button, .persona-chip, .workout-subtab", root).forEach((node) => node.classList.add("c-chip"));
    selectAll(".empty, .food-empty, .chart-empty, .adaptive-empty, .chat-empty-state, .progress-empty-card", root).forEach((node) => node.classList.add("c-empty"));
    selectAll(".ux-floating-actions", root).forEach((node) => node.classList.add("c-fab"));
  }

  function enhanceBottomNavigation(root = document) {
    const nav = root.querySelector(".bottom-nav");
    if (!nav) return;
    nav.classList.add("c-bottom-nav");
    nav.setAttribute("aria-label", nav.getAttribute("aria-label") || "Primary");
    nav.querySelectorAll(".tab").forEach((tab) => {
      tab.setAttribute("aria-selected", tab.classList.contains("active") ? "true" : "false");
      if (tab.classList.contains("active")) tab.setAttribute("aria-current", "page");
      else tab.removeAttribute("aria-current");
      if (tab.disabled) tab.setAttribute("aria-disabled", "true");
    });
  }

  function enhanceLandmarks(root = document) {
    const app = root.querySelector("#appShell");
    if (app) app.setAttribute("role", "main");
    selectAll(".screen", root).forEach((screen) => {
      const active = screen.classList.contains("active");
      screen.setAttribute("aria-hidden", active ? "false" : "true");
    });
    selectAll(".hidden", root).forEach((node) => {
      if (!node.matches("input[type='hidden']")) node.setAttribute("aria-hidden", "true");
    });
    selectAll(".screen.active", root).forEach((node) => node.setAttribute("aria-hidden", "false"));
    if (!root.querySelector("#osRouteAnnouncer")) {
      const announcer = document.createElement("div");
      announcer.id = "osRouteAnnouncer";
      announcer.className = "sr-only";
      announcer.setAttribute("role", "status");
      announcer.setAttribute("aria-live", "polite");
      document.body.appendChild(announcer);
    }
  }

  function syncBottomNavigationState(root = document) {
    const nav = root.querySelector(".bottom-nav");
    if (!nav) return;
    nav.querySelectorAll(".tab").forEach((tab) => {
      const active = tab.classList.contains("active");
      tab.setAttribute("aria-selected", active ? "true" : "false");
      if (active) tab.setAttribute("aria-current", "page");
      else tab.removeAttribute("aria-current");
    });
  }

  function enhance(root = document) {
    enhanceButtons(root);
    enhanceCards(root);
    enhanceForms(root);
    enhanceFeedback(root);
    enhanceProgress(root);
    enhanceUtilities(root);
    enhanceBottomNavigation(root);
    enhanceLandmarks(root);
  }

  return {
    enhance,
    syncBottomNavigationState,
    enhanceButtons,
    enhanceCards,
    enhanceForms,
    enhanceFeedback,
    enhanceProgress,
    enhanceUtilities,
    enhanceBottomNavigation,
    enhanceLandmarks,
  };
})();

window.KhayubdiComponents = KhayubdiComponents;
