(function () {
  // ----- DOM refs -----
  const form = document.getElementById("shortenForm");
  const urlInput = document.getElementById("urlInput");
  const shortenBtn = document.getElementById("shortenBtn");
  const btnText = document.getElementById("btnText");
  const errorDiv = document.getElementById("errorMessage");
  const resultBox = document.getElementById("resultBox");
  const resultUrl = document.getElementById("resultUrl");
  const copyBtn = document.getElementById("copyBtn");

  // ----- UI helpers -----
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

  function showResult(shortUrl) {
    resultUrl.innerHTML = `<a href="${shortUrl}" target="_blank">${shortUrl}</a>`;
    resultBox.style.display = "flex";
    resultBox.dataset.url = shortUrl;
  }

  // ----- Copy to clipboard -----
  copyBtn.addEventListener("click", async function () {
    const url = resultBox.dataset.url;
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      copyBtn.textContent = "✅ Copied!";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = "📋 Copy";
        copyBtn.classList.remove("copied");
      }, 2000);
    } catch (_) {
      // fallback
      const range = document.createRange();
      range.selectNode(resultUrl);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand("copy");
      window.getSelection().removeAllRanges();
      copyBtn.textContent = "✅ Copied!";
      setTimeout(() => {
        copyBtn.textContent = "📋 Copy";
      }, 2000);
    }
  });

  // ----- Form submit -----
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const longUrl = urlInput.value.trim();

    if (!longUrl) {
      setError("Please enter a URL.");
      return;
    }
    try {
      new URL(longUrl);
    } catch (_) {
      setError("Invalid URL. Include http:// or https://");
      return;
    }

    setError("");
    resultBox.style.display = "none";
    setLoading(true);

    try {
      // ✅ Use the correct API endpoint (matches your server)
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl }),
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

      showResult(data.shortUrl);
    } catch (err) {
      console.error("❌", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  });
})();
