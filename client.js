// client.js

console.log("client.js: Script is running");

if (!window.__clientInitialized) {
  window.__clientInitialized = true;

  (function initClient() {
    function ensureUIElements() {
      if (!document.getElementById("customContainer")) {
        console.warn("client.js: Custom UI not found, creating it");
        const container = document.createElement("div");
        container.id = "customContainer";
        // Inline styling to position the UI at the bottom left with a controlled size.
        container.style.cssText =
          "position: fixed; bottom: 10px; left: 10px; z-index: 10000; " +
          "background: rgba(0, 0, 0, 0.7); padding: 10px; border-radius: 5px; " +
          "font-family: Arial, sans-serif; color: #fff; font-size: 14px;";
        container.innerHTML = `
          <button id="customButton" style="padding: 5px 10px; margin: 0;">Click me</button>
          <div id="settingsPanel" style="display:none; margin-top: 8px;">
            <h3 style="margin:0 0 5px 0;">KB + AP Settings</h3>
            <div class="input-group" style="margin-bottom:5px;">
              <label style="margin-right:5px;">Combined Key:</label>
              <div id="combinedContainer" style="display:inline-block;"></div>
              <button id="addCombined" style="padding: 3px 6px; margin-left:5px;">Add</button>
              <button id="removeCombined" style="padding: 3px 6px; margin-left:5px;">Remove</button>
            </div>
            <button id="saveSettings" style="padding: 3px 6px; margin-right:5px;">Save</button>
            <button id="closeSettings" style="padding: 3px 6px;">Close</button>
          </div>
        `;
        document.body.appendChild(container);
      }
    }

    // Inject UI once the DOM is ready.
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", ensureUIElements);
    } else {
      ensureUIElements();
    }

    // MutationObserver: Watch for changes in the body that might remove our UI.
    const observer = new MutationObserver(() => {
      if (!document.getElementById("customContainer")) {
        console.warn("client.js: Custom UI was removed, re-injecting");
        ensureUIElements();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Also, use setInterval to re-check periodically
    setInterval(() => {
      if (!document.getElementById("customContainer")) {
        console.warn("client.js: Custom UI missing on interval check, reinjecting");
        ensureUIElements();
      }
    }, 1000); // Check every 1 second
  })();
}
