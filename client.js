// client.js

document.addEventListener("DOMContentLoaded", function () {
  const openSettingsButton = document.getElementById("openSettings");
  const closeSettingsButton = document.getElementById("closeSettings");
  const saveSettingsButton = document.getElementById("saveSettings");
  const settingsPanel = document.getElementById("settingsPanel");
  const combinedContainer = document.getElementById("combinedContainer");
  const addCombinedButton = document.getElementById("addCombined");
  const removeCombinedButton = document.getElementById("removeCombined");

  // Open the settings panel
  openSettingsButton.addEventListener("click", () => {
    settingsPanel.style.display = "block";
  });

  // Close the settings panel
  closeSettingsButton.addEventListener("click", () => {
    settingsPanel.style.display = "none";
  });

  // Load previously saved combined keybinds if available
  if (localStorage.getItem("combinedKeybinds")) {
    try {
      const combinedKeybinds = JSON.parse(localStorage.getItem("combinedKeybinds"));
      combinedKeybinds.forEach(entry => addCombinedRow(entry.attack, entry.keybind));
    } catch (e) {
      console.error("Error parsing combined keybinds", e);
    }
  }

  // Save settings when the Save button is clicked
  saveSettingsButton.addEventListener("click", () => {
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
  });

  // Add a combined keybind row (limit to 10 rows)
  addCombinedButton.addEventListener("click", () => {
    const currentCount = document.querySelectorAll(".combined-item").length;
    if (currentCount >= 10) {
      alert("Maximum of 10 keybinds reached.");
      return;
    }
    addCombinedRow();
  });

  // Remove the last combined keybind row
  removeCombinedButton.addEventListener("click", () => {
    const items = document.querySelectorAll(".combined-item");
    if (items.length > 0) {
      combinedContainer.removeChild(items[items.length - 1]);
    } else {
      alert("No keybinds to remove.");
    }
  });

  // Helper function to create and append a new row (optionally with existing values)
  function addCombinedRow(existingAttack = "", existingKeybind = "") {
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
  }
});
