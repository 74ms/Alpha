// client.js

console.log("CTC: Script is running");

if (!window.__ctcInitialized) {
  window.__ctcInitialized = true;

  (function initCTC() {
    // Function to inject the UI if it's missing.
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
        attachCTCListeners();
      }
    }

    // Attach event listeners to the buttons inside your UI.
    function attachCTCListeners() {
      // Toggle settings panel when the main button is clicked.
      const btn = document.getElementById("ctc-button");
      if (btn) {
        btn.addEventListener("click", function () {
          const panel = document.getElementById("ctc-settingsPanel");
          if (panel) {
            panel.style.display = panel.style.display === "none" ? "block" : "none";
          }
        });
      }
      // "Close" button: hide the settings panel.
      const closeBtn = document.getElementById("ctc-closeSettings");
      if (closeBtn) {
        closeBtn.addEventListener("click", function () {
          const panel = document.getElementById("ctc-settingsPanel");
          if (panel) {
            panel.style.display = "none";
          }
        });
      }
      // "Add" button: append a new input element to the combined container.
      const addBtn = document.getElementById("ctc-addCombined");
      if (addBtn) {
        addBtn.addEventListener("click", function () {
          const combinedContainer = document.getElementById("ctc-combinedContainer");
          if (combinedContainer) {
            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = "New Key";
            input.style.marginRight = "5px";
            combinedContainer.appendChild(input);
          }
        });
      }
      // "Remove" button: remove the last input element from the combined container.
      const removeBtn = document.getElementById("ctc-removeCombined");
      if (removeBtn) {
        removeBtn.addEventListener("click", function () {
          const combinedContainer = document.getElementById("ctc-combinedContainer");
          if (combinedContainer && combinedContainer.lastChild) {
            combinedContainer.removeChild(combinedContainer.lastChild);
          }
        });
      }
      // "Save" button: demo function (logs a message, you can add more logic).
      const saveBtn = document.getElementById("ctc-saveSettings");
      if (saveBtn) {
        saveBtn.addEventListener("click", function () {
          console.log("CTC: Settings saved!");
          alert("Settings saved (demo).");
        });
      }
    }

    // Function to inject the UI and attach listeners.
    function initUI() {
      injectCTCUI();
    }

    // Delay injection until the page is fully loaded and let Terrirotial.io do its stuff.
    if (document.readyState === "complete") {
      setTimeout(initUI, 4000);
    } else {
      window.addEventListener("load", function () {
        setTimeout(initUI, 4000);
      });
    }

    // MutationObserver: If the container is removed, re-inject.
    const observer = new MutationObserver(() => {
      if (!document.getElementById("ctc-container")) {
        console.warn("CTC: Container removed; reinjecting");
        initUI();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Also check every 2 seconds.
    setInterval(() => {
      if (!document.getElementById("ctc-container")) {
        console.warn("CTC: Interval check—container missing; reinjecting");
        initUI();
      }
    }, 2000);
  })();
}
