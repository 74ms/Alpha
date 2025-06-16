// client.js

console.log("client.js: Script is running");

if (!window.__clientInitialized) {
  window.__clientInitialized = true;

  (function initClient() {

    function ensureUIElements() {
      // If our custom UI container isn't already present, create it.
      if (!document.getElementById("customContainer")) {
        console.warn("client.js: Custom UI not found, creating it");
        const container = document.createElement("div");
        container.id = "customContainer";
        container.innerHTML = `
          <button id="openSettings">Open Settings</button>
          <div id="settingsPanel" style="display:none;">
            <h3>KB + AP Settings</h3>
            <div class="input-group">
              <label>Combined Key:</label>
              <div id="combinedContainer"></div>
              <button id="addCombined">Add</button>
              <button id="removeCombined">Remove</button>
            </div>
            <button id="saveSettings">Save</button>
            <button id="closeSettings">Close</button>
          </div>
        `;
        document.body.appendChild(container);
      }
    }

    // Call ensureUIElements as soon as the DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", ensureUIElements);
    } else {
      ensureUIElements();
    }

    // (Optional) Remove the fallback timeout if not needed
    /* 
    const fallbackTimeout = setTimeout(() => {
      if (document.readyState === "loading") {
        console.warn("client.js: DOMContentLoaded not fired");
        ensureUIElements();
      }
    }, 10000);
    */

  })();
}
