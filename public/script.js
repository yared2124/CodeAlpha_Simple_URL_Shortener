(function () {
  // ============================================================
  // DOM REFS
  // ============================================================
  const form = document.getElementById("shortenForm");
  const urlInput = document.getElementById("urlInput");
  const shortenBtn = document.getElementById("shortenBtn");
  const btnText = document.getElementById("btnText");
  const errorDiv = document.getElementById("errorMessage");
  const resultBox = document.getElementById("resultBox");
  const resultUrl = document.getElementById("resultUrl");
  const copyBtn = document.getElementById("copyBtn");
  const historyContainer = document.getElementById("historyContainer");
  const historyToggle = document.getElementById("historyToggle");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");
  const charCount = document.getElementById("charCount");
  const themeToggle = document.getElementById("themeToggle");

  // ============================================================
  // THEME MANAGEMENT
  // ============================================================
  function getPreferredTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return "dark"; // default to dark
  }

  function applyTheme(theme) {
    if (theme === "light") {
      document.body.classList.add("light-mode");
      if (themeToggle) themeToggle.textContent = "🌙";
    } else {
      document.body.classList.remove("light-mode");
      if (themeToggle) themeToggle.textContent = "☀️";
    }
    localStorage.setItem("theme", theme);
  }

  function toggleTheme() {
    const current = document.body.classList.contains("light-mode")
      ? "light"
      : "dark";
    applyTheme(current === "light" ? "dark" : "light");
  }

  // Init theme
  if (themeToggle) {
    applyTheme(getPreferredTheme());
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Listen for system changes only if user hasn't manually saved a preference
  window
    .matchMedia("(prefers-color-scheme: light)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        applyTheme(e.matches ? "light" : "dark");
      }
    });

  // ============================================================
  // STATE
  // ============================================================
  let history = JSON.parse(localStorage.getItem("shortenHistory") || "[]");
  let isHistoryVisible = false;

  // ============================================================
  // UI HELPERS
  // ============================================================
  function setLoading(loading) {
    if (loading) {
      btnText.innerHTML = '<span class="spinner"></span> Shortening…';
      shortenBtn.disabled = true;
    } else {
      btnText.textContent = "Shorten";
      shortenBtn.disabled = false;
    }
  }

  function setError(msg) {
    errorDiv.textContent = msg || "";
  }

  function showResult(shortUrl, shortCode) {
    resultUrl.innerHTML = `<a href="${shortUrl}" target="_blank">${shortUrl}</a>`;
    resultBox.style.display = "flex";
    resultBox.dataset.url = shortUrl;
    resultBox.dataset.code = shortCode;

    // Auto‑copy (optional – user can toggle this in settings)
    if (localStorage.getItem("autoCopy") !== "false") {
      copyToClipboard(shortUrl);
    }

    // Update URL input with the short URL for quick access
    urlInput.value = shortUrl;
    updateCharCount();
  }

  // ----- Char counter -----
  function updateCharCount() {
    const len = urlInput.value.length;
    if (charCount) {
      charCount.textContent = len > 0 ? `${len} chars` : "";
    }
  }

  // ----- Copy to clipboard (centralized) -----
  async function copyToClipboard(text) {
    if (!text) return false;
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = "✅ Copied!";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = "📋 Copy";
        copyBtn.classList.remove("copied");
      }, 2000);
      return true;
    } catch (_) {
      // fallback
      try {
        const range = document.createRange();
        const tempDiv = document.createElement("div");
        tempDiv.textContent = text;
        document.body.appendChild(tempDiv);
        range.selectNode(tempDiv);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        document.body.removeChild(tempDiv);
        copyBtn.textContent = "✅ Copied!";
        copyBtn.classList.add("copied");
        setTimeout(() => {
          copyBtn.textContent = "📋 Copy";
          copyBtn.classList.remove("copied");
        }, 2000);
        return true;
      } catch (__) {
        return false;
      }
    }
  }

  // ============================================================
  // HISTORY MANAGEMENT
  // ============================================================
  function renderHistory() {
    if (!historyContainer) return;
    if (history.length === 0) {
      historyContainer.innerHTML = `<p class="history-empty">No URLs shortened yet.</p>`;
      return;
    }

    // Show latest first
    const items = [...history].reverse();
    historyContainer.innerHTML = items
      .map(
        (entry, index) => `
      <div class="history-item" data-index="${history.length - 1 - index}">
        <div class="history-url">
          <a href="${entry.shortUrl}" target="_blank" title="${entry.shortUrl}">
            ${entry.shortUrl}
          </a>
          <span class="history-long">→ ${truncateUrl(entry.longUrl, 40)}</span>
        </div>
        <div class="history-actions">
          <button class="history-copy" data-url="${entry.shortUrl}">📋</button>
          <button class="history-delete" data-index="${history.length - 1 - index}">✕</button>
        </div>
      </div>
    `,
      )
      .join("");

    // Attach events to history buttons
    historyContainer.querySelectorAll(".history-copy").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        copyToClipboard(btn.dataset.url);
      });
    });

    historyContainer.querySelectorAll(".history-delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        history.splice(index, 1);
        saveHistory();
        renderHistory();
        if (history.length === 0 && isHistoryVisible) {
          // Show empty state
        }
      });
    });
  }

  function saveHistory() {
    localStorage.setItem("shortenHistory", JSON.stringify(history));
  }

  function addToHistory(longUrl, shortUrl, shortCode) {
    const entry = {
      longUrl,
      shortUrl,
      shortCode,
      createdAt: new Date().toISOString(),
    };
    // Avoid duplicates (remove if same longUrl exists)
    history = history.filter((h) => h.longUrl !== longUrl);
    history.push(entry);
    // Keep max 50 entries
    if (history.length > 50) {
      history = history.slice(-50);
    }
    saveHistory();
    if (isHistoryVisible) renderHistory();
  }

  function truncateUrl(url, maxLen) {
    if (!url) return "";
    return url.length > maxLen ? url.substring(0, maxLen) + "…" : url;
  }

  // ============================================================
  // HISTORY TOGGLE
  // ============================================================
  if (historyToggle) {
    historyToggle.addEventListener("click", () => {
      isHistoryVisible = !isHistoryVisible;
      if (isHistoryVisible) {
        historyContainer.style.display = "block";
        historyToggle.textContent = "📜 Hide History";
        renderHistory();
      } else {
        historyContainer.style.display = "none";
        historyToggle.textContent = "📜 History";
      }
    });
  }

  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", () => {
      if (confirm("Clear all history?")) {
        history = [];
        saveHistory();
        renderHistory();
        if (!isHistoryVisible) {
          // If hidden, just clear data
        }
      }
    });
  }

  // ============================================================
  // KEYBOARD SHORTCUTS
  // ============================================================
  document.addEventListener("keydown", (e) => {
    // Ctrl+Enter or Cmd+Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      form.dispatchEvent(new Event("submit"));
    }
    // Escape to clear input
    if (e.key === "Escape" && document.activeElement === urlInput) {
      urlInput.value = "";
      updateCharCount();
      setError("");
    }
  });

  // ============================================================
  // INPUT VALIDATION – REAL-TIME
  // ============================================================
  urlInput.addEventListener("input", updateCharCount);

  urlInput.addEventListener("blur", () => {
    const val = urlInput.value.trim();
    if (val && !val.startsWith("http://") && !val.startsWith("https://")) {
      setError("URL should start with http:// or https://");
    } else {
      setError("");
    }
  });

  // ============================================================
  // COPY BUTTON (standalone)
  // ============================================================
  copyBtn.addEventListener("click", async function () {
    const url = resultBox.dataset.url;
    if (!url) return;
    await copyToClipboard(url);
  });

  // ============================================================
  // FORM SUBMIT
  // ============================================================
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const longUrl = urlInput.value.trim();

    // --- Validate ---
    if (!longUrl) {
      setError("Please enter a URL.");
      urlInput.focus();
      return;
    }

    let normalizedUrl = longUrl;
    // Auto-add https:// if missing
    if (
      !normalizedUrl.startsWith("http://") &&
      !normalizedUrl.startsWith("https://")
    ) {
      normalizedUrl = "https://" + normalizedUrl;
      urlInput.value = normalizedUrl;
    }

    try {
      new URL(normalizedUrl);
    } catch (_) {
      setError("Invalid URL format. Please check and try again.");
      urlInput.focus();
      return;
    }

    setError("");
    resultBox.style.display = "none";
    setLoading(true);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl: normalizedUrl }),
      });

      const rawText = await response.text();
      console.log("📦 Server raw response:", rawText);

      if (!rawText) {
        throw new Error("Empty response from server.");
      }

      const data = JSON.parse(rawText);
      if (!response.ok) {
        throw new Error(data.error || "Server error");
      }

      // --- Success ---
      const shortUrl =
        data.shortUrl || `http://localhost:3000/${data.shortCode}`;
      showResult(shortUrl, data.shortCode);

      // Add to history
      addToHistory(normalizedUrl, shortUrl, data.shortCode);

      // Auto-fill the input for quick reuse
      urlInput.select();
    } catch (err) {
      console.error("❌", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  });

  // ============================================================
  // PASTE EVENT – DETECT URL FROM CLIPBOARD
  // ============================================================
  urlInput.addEventListener("paste", () => {
    // Small delay to let the paste happen
    setTimeout(() => {
      updateCharCount();
      const val = urlInput.value.trim();
      if (val && (val.startsWith("http://") || val.startsWith("https://"))) {
        setError("");
      }
    }, 50);
  });

  // ============================================================
  // INIT
  // ============================================================
  updateCharCount();
  if (history.length > 0 && historyContainer) {
    // Pre-render if history exists
    if (isHistoryVisible) renderHistory();
  }

  console.log("🔗 ShortLink initialized!");
  console.log(`📊 ${history.length} URLs in history.`);

  // Expose some functions for debugging
  window.__shortlink = { addToHistory, copyToClipboard, history };
})();
