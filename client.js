// client.js

console.log("client.js: Script is loading...");

document.addEventListener("DOMContentLoaded", function () {
  console.log("client.js: DOM fully loaded");

  // Get UI Elements
  const openSettingsButton = document.getElementById("openSettings");
  const closeSettingsButton = document.getElementById("closeSettings");
  const saveSettingsButton = document.getElementById("saveSettings");
  const settingsPanel = document.getElementById("settingsPanel");
  const combinedContainer = document.getElementById("combinedContainer");
  const addCombinedButton = document.getElementById("addCombined");
  const removeCombinedButton = document.getElementById("removeCombined");

  // Check if all the required elements exist
  if (!openSettingsButton || !closeSettingsButton || !saveSettingsButton || !settingsPanel || !combinedContainer || !addCombinedButton || !removeCombinedButton) {
    console.error("client.js: One or more UI elements are missing. Please check your HTML.");
    return;
  }
  
  console.log("client.js: UI elements found.");

  // Open the settings panel
  openSettingsButton.addEventListener("click", () => {
    console.log("client.js: Opening settings panel");
    settingsPanel.style.display = "block";
  });

  // Close the settings panel
  closeSettingsButton.addEventListener("click", () => {
    console.log("client.js: Closing settings panel");
    settingsPanel.style.display = "none";
  });

  // Load previously saved combined keybinds if available
  if (localStorage.getItem("combinedKeybinds")) {
    try {
      const combinedKeybinds = JSON.parse(localStorage.getItem("combinedKeybinds"));
      console.log("client.js: Loaded saved combined keybinds", combinedKeybinds);
      combinedKeybinds.forEach(entry => addCombinedRow(entry.attack, entry.keybind));
    } catch (e) {
      console.error("client.js: Error parsing combined keybinds", e);
    }
  } else {
    console.log("client.js: No saved combined keybinds found");
  }

  // Save settings when the Save button is clicked
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

  // Add a combined keybind row (limit to 10 rows)
  addCombinedButton.addEventListener("click", () => {
    const currentCount = document.querySelectorAll(".combined-item").length;
    if (currentCount >= 10) {
      alert("Maximum of 10 keybinds reached.");
      console.warn("client.js: Maximum combined keybinds count reached");
      return;
    }
    console.log("client.js: Adding a new combined keybind row");
    addCombinedRow();
  });

  // Remove the last combined keybind row
  removeCombinedButton.addEventListener("click", () => {
    const items = document.querySelectorAll(".combined-item");
    if (items.length > 0) {
      console.log("client.js: Removing the last combined keybind row");
      combinedContainer.removeChild(items[items.length - 1]);
    } else {
      alert("No keybinds to remove.");
      console.warn("client.js: No combined keybind rows found to remove");
    }
  });

  // Helper function to create and append a new row (optionally with existing values)
  function addCombinedRow(existingAttack = "", existingKeybind = "") {
    console.log("client.js: Creating a new combined row", { existingAttack, existingKeybind });
    const row = document.createElement("div");
    row.className = "combined-item";

    // Attack Percentage Input (AP)
    const attackInput = document.createElement("input");
    attackInput.type = "number";
    attackInput.step = "0.01";
    attackInput.className = "combined-attack";
    attackInput.placeholder = "Enter AP";
    if (existingAttack !== "") {
      attackInput.value = existingAttack;
    }

    // Keybind Input (KB)
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
});
