// index.js

console.log("index.js loaded successfully");

// Check for the existence of the required containers
const windowContainer = document.getElementById("windowContainer");
const keybindsContainer = document.getElementById("keybindsContainer");

if (windowContainer) {
  windowContainer.textContent = "Window Container Initialized";
  console.log("windowContainer exists");
} else {
  console.error("windowContainer is missing!");
}

if (keybindsContainer) {
  keybindsContainer.textContent = "Keybinds Container Initialized";
  console.log("keybindsContainer exists");
} else {
  console.error("keybindsContainer is missing!");
}

// Import your modules
import WindowManager from './territorial-proxy/windowmanager.js';
import { KeybindsInput } from './keybindsinput.js';

console.log("Modules imported");

// Create a simple settings window to test the WindowManager functionality
const settingsWindow = WindowManager.createWindow({
  name: "settings",
  classes: "settings",
  closeWithButton: true,
});

// Populate the settings window with test content
settingsWindow.innerHTML = `
  <h1>Settings</h1>
  <p>Test Settings Window</p>
  <button id="testButton">Test Button</button>
`;

// Open the settings window
WindowManager.openWindow("settings");
console.log("Settings window opened");

// Add an event listener to the test button to verify functionality
const testBtn = document.getElementById("testButton");
if (testBtn) {
  testBtn.addEventListener("click", () => {
    console.log("Test Button Clicked");
    alert("Button pressed!");
  });
}

// Initialize the KeybindsInput, which will also output test messages in keybindsContainer
const keybindsInput = new KeybindsInput(keybindsContainer);
console.log("KeybindsInput initialized");
