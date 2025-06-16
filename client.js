// client.js

console.log("client.js: Script is running");

if (!window.__clientInitialized) {
  window.__clientInitialized = true;

  (function initClient() {
    // Create or re-create the custom UI container.
    function ensureUIElements() {
      if (!document.getElementById("customContainer")) {
        console.warn("client.js: Custom UI not found, creating it");
        const container = document.createElement("div");
        container.id = "customContainer";
        // Inline styles to position the container and give a controlled appearance.
        container.style.cssText =
          "position: fixed; bottom: 10px; left: 10px; z-index: 10000; " +
          "background: rgba(0, 0, 0, 0.7); padding: 10px; border-radius: 5px; " +
          "font-family: Arial, sans-serif; color: #fff; font-size: 14px;";
        // Set the button text to "Click me" and create a settings panel.
        container.innerHTML = `
          <button id="customButton" style="padding: 5px 10px; margin: 0;">Click me</button>
          <div id="settingsPanel" style="display:none; margin-top:8px;">
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

    // Attach event listeners to our UI. In this example, toggling the settings panel.
    function attachListeners() {
      const btn = document.getElementById("customButton");
      if (btn) {
        btn.addEventListener("click", function () {
          const panel = document.getElementById("settingsPanel");
          if (panel) {
            panel.style.display = panel.style.display === "none" ? "block" : "none";
          }
        });
      }
      // You can add more event listeners here as needed.
    }

    // This function injects the UI and attaches necessary event handlers.
    function injectUI() {
      ensureUIElements();
      attachListeners();
    }

    // To avoid early injection, wait for the full page load (including scripts)
    // and then wait an extra moment (2 seconds) to allow Territorial.io to finish its updates.
    if (document.readyState === "complete") {
      setTimeout(injectUI, 2000);
    } else {
      window.addEventListener("load", function () {
        setTimeout(injectUI, 2000);
      });
    }

    // Use a MutationObserver to monitor if your custom UI gets removed.
    const observer = new MutationObserver(() => {
      if (!document.getElementById("customContainer")) {
        console.warn("client.js: Custom UI was removed, re-injecting");
        injectUI();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Additionally, perform an interval check every second.
    setInterval(() => {
      if (!document.getElementById("customContainer")) {
        console.warn("client.js: Custom UI missing on interval check, reinjecting");
        injectUI();
      }
    }, 1000);
  })();
}
