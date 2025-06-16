// client.js

console.log("client.js: Script is loading...");

if (!window.__clientInitialized) {
  window.__clientInitialized = true;

  (function initClient() {
    // Fallback in case DOMContentLoaded never fires
    const fallbackTimeout = setTimeout(() => {
      if (document.readyState === "loading") {
        console.warn("client.js: Fallback triggered. Initializing after delay.");
        init();
      }
    }, 10000);

    function ensureUIElements() {
      // Our custom UI exists in index.html.
      // If it isn’t found (which should not be the case in our controlled HTML), we can inject it.
      if (!document.getElementById("openSettings")) {
        console.warn("client.js: Custom UI not found; injecting it now.");
        const container = document.createElement("div");
        container.id = "customOverlay";
        container.innerHTML = `
          <button id="openSettings">Settings</button>
          <div id="settingsPanel" style="display:none;">
            <h3>KB + AP Settings</h3>
            <div class="input-group">
              <label>Combined Keybinds &amp; Attack Percentage</label>
              <div id="combinedContainer"></div>
              <button id="addCombined">Add</button>
              <button id="removeCombined">Remove</button>
            </div>
            <button id="saveSettings">Save</button>
            <button id="closeSettings">Close</button>
          </div>`;
        document.body.appendChild(container);
        console.log("client.js: Custom UI container injected.");
      }
    }

    function init() {
      clearTimeout(fallbackTimeout);
      console.log("client.js: Running initialization code");

      ensureUIElements();

      // Get UI elements
      const openSettingsButton = document.getElementById("openSettings");
      const closeSettingsButton = document.getElementById("closeSettings");
      const saveSettingsButton = document.getElementById("saveSettings");
      const settingsPanel = document.getElementById("settingsPanel");
      const combinedContainer = document.getElementById("combinedContainer");
      const addCombinedButton = document.getElementById("addCombined");
      const removeCombinedButton = document.getElementById("removeCombined");

      // Verify all elements are found
      if (!openSettingsButton || !closeSettingsButton || !saveSettingsButton || !settingsPanel ||
          !combinedContainer || !addCombinedButton || !removeCombinedButton) {
        console.error("client.js: One or more UI elements are missing after injection.");
        return;
      }
      console.log("client.js: UI elements found.");

      // Open settings panel
      openSettingsButton.addEventListener("click", () => {
        console.log("client.js: Opening settings panel");
        settingsPanel.style.display = "block";
      });

      // Close settings panel
      closeSettingsButton.addEventListener("click", () => {
        console.log("client.js: Closing settings panel");
        settingsPanel.style.display = "none";
      });

      // Load any saved settings (KB + AP)
      if (localStorage.getItem("combinedKeybinds")) {
        try {
          const combinedKeybinds = JSON.parse(localStorage.getItem("combinedKeybinds"));
          console.log("client.js: Loaded saved keybind settings", combinedKeybinds);
          combinedKeybinds.forEach(entry => addCombinedRow(entry.attack, entry.keybind));
        } catch (e) {
          console.error("client.js: Error parsing saved keybind settings", e);
        }
      } else {
        console.log("client.js: No saved keybind settings found");
      }

      // Save settings button
      saveSettingsButton.addEventListener("click", () => {
        console.log("client.js: Saving settings");
        const combinedItems = [];
        document.querySelectorAll(".combined-item").forEach(item => {
          const attackInput = item.querySelector(".combined-attack");
          const keybindInput = item.querySelector(".combined-keybind");
          const attackValue = parseFloat(attackInput.value);
          const keyValue = keybindInput.value.trim();
          if (!isNaN(attackValue) && keyValue !== "") {
            combinedItems.push({ attack: attackValue, keybind: keyValue });
          }
        });
        localStorage.setItem("combinedKeybinds", JSON.stringify(combinedItems));
        alert("Settings Saved!");
        settingsPanel.style.display = "none";
        console.log("client.js: Settings saved", combinedItems);
      });

      // Add a new combined keybind row
      addCombinedButton.addEventListener("click", () => {
        const currentCount = document.querySelectorAll(".combined-item").length;
        if (currentCount >= 10) {
          alert("Maximum of 10 keybinds reached.");
          return;
        }
        console.log("client.js: Adding a new combined keybind row");
        addCombinedRow();
      });

      // Remove the last row
      removeCombinedButton.addEventListener("click", () => {
        const items = document.querySelectorAll(".combined-item");
        if (items.length > 0) {
          console.log("client.js: Removing the last combined keybind row");
          combinedContainer.removeChild(items[items.length - 1]);
        } else {
          alert("No keybinds to remove.");
        }
      });

      // Helper to create and append a row
      function addCombinedRow(existingAttack = "", existingKeybind = "") {
        console.log("client.js: Creating a new combined row", { existingAttack, existingKeybind });
        const row = document.createElement("div");
        row.className = "combined-item";

        const attackInput = document.createElement("input");
        attackInput.type = "number";
        attackInput.step = "0.01";
        attackInput.className = "combined-attack";
        attackInput.placeholder = "Enter AP";
        if (existingAttack !== "") {
          attackInput.value = existingAttack;
        }

        const keybindInput = document.createElement("input");
        keybindInput.type = "text";
        keybindInput.className = "combined-keybind";
        keybindInput.placeholder = "Enter KB";
        if (existingKeybind !== "") {
          keybindInput.value = existingKeybind;
        }

        row.appendChild(attackInput);
        row.appendChild(keybindInput);
        combinedContainer.appendChild(row);
        console.log("client.js: New combined row added");
      }
    }

    if (document.readyState === "loading") {
      console.log("client.js: Waiting for DOMContentLoaded...");
      document.addEventListener("DOMContentLoaded", init);
    } else {
      console.log("client.js: DOM is already ready, initializing immediately.");
      init();
    }
  })();
} else {
  console.log("client.js: Already initialized. Skipping re-run.");
}
