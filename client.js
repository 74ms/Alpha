// client.js

console.log("CTC: Script is running");

if (!window.__ctcInitialized) {
  window.__ctcInitialized = true;

  (function initCTC() {
    function injectCTCUI() {
      if (!document.getElementById("ctc-container")) {
        console.warn("CTC: UI not found, injecting now");
        let container = document.createElement("div");
        container.id = "ctc-container";
        container.style.cssText =
          "position: fixed; bottom: 10px; left: 10px; z-index: 10000;" +
          "background: rgba(0, 0, 0, 0.7); padding: 10px; border-radius: 5px;" +
          "font-family: Arial, sans-serif; color: #fff; font-size: 14px;";
        container.innerHTML = `
          <button id="ctc-button" style="padding: 5px 10px;">CTC - Click me</button>
          <div id="ctc-settingsPanel" style="display:none; margin-top:8px;">
            <h3 style="margin:0 0 5px 0;">KB + AP Settings</h3>
            <div class="ctc-inputGroup" style="margin-bottom:5px;">
              <label style="margin-right:5px;">Combined Key:</label>
              <div id="ctc-combinedContainer" style="display:inline-block;"></div>
              <button id="ctc-addCombined" style="padding: 3px 6px; margin-left:5px;">Add</button>
              <button id="ctc-removeCombined" style="padding: 3px 6px; margin-left:5px;">Remove</button>
            </div>
            <button id="ctc-saveSettings" style="padding: 3px 6px; margin-right:5px;">Save</button>
            <button id="ctc-closeSettings" style="padding: 3px 6px;">Close</button>
          </div>
        `;
        document.body.appendChild(container);

        // Attach listener to toggle settings
        const btn = document.getElementById("ctc-button");
        btn.addEventListener("click", function () {
          const panel = document.getElementById("ctc-settingsPanel");
          panel.style.display = (panel.style.display === "none" ? "block" : "none");
        });
      }
    }

    // Wait until the entire page is fully loaded, plus an extra delay.
    if (document.readyState === "complete") {
      setTimeout(injectCTCUI, 4000);
    } else {
      window.addEventListener("load", () => {
        setTimeout(injectCTCUI, 4000);
      });
    }

    // Use MutationObserver to watch and re-inject if removed.
    const observer = new MutationObserver(() => {
      if (!document.getElementById("ctc-container")) {
        console.warn("CTC: Container removed; reinjecting");
        injectCTCUI();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Also check every 2 seconds.
    setInterval(() => {
      if (!document.getElementById("ctc-container")) {
        console.warn("CTC: Interval check—container missing; reinjecting");
        injectCTCUI();
      }
    }, 2000);
  })();
}
