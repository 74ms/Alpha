// territorial-proxy/windowmanager.js

// Ensure the UI container exists, or create one if missing.
const createWindowContainer = () => {
  let container = document.getElementById("windowContainer");
  if (!container) {
    container = document.createElement("span");
    container.id = "windowContainer";
    document.body.appendChild(container);
  }
  return container;
};

const container = createWindowContainer();

// Use a MutationObserver to reattach the container if it gets removed
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.removedNodes.forEach((node) => {
      if (node.id === "windowContainer") {
        document.body.appendChild(node);
        console.log("windowContainer reattached.");
      }
    });
  });
});
observer.observe(document.body, { childList: true });

// This object will hold each window’s info
const windows = {};

const addWindow = (winObj) => {
  windows[winObj.name] = winObj;
  windows[winObj.name].isOpen = false;
};

const createWindow = (info) => {
  const winEl = document.createElement("div");
  info.element = winEl;
  // Apply the CSS classes (assuming your CSS is already loaded)
  winEl.className =
    "window" +
    (info.classes !== undefined
      ? " " + info.classes
      : " scrollable selectable");
  winEl.style.display = "none";

  // Optionally add a close button
  if (info.closeWithButton === true) {
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", () => closeWindow(info.name));
    // Delay appending if necessary
    setTimeout(() => winEl.appendChild(closeBtn));
  }
  container.appendChild(winEl);
  addWindow(info);
  return winEl;
};

const openWindow = (name, ...args) => {
  if (!windows[name].isOpen) {
    if (windows[name].beforeOpen) windows[name].beforeOpen(...args);
    windows[name].isOpen = true;
    windows[name].element.style.display = "block";
  }
};

const closeWindow = (name) => {
  if (windows[name].isOpen) {
    windows[name].isOpen = false;
    windows[name].element.style.display = "none";
    if (windows[name].onClose) windows[name].onClose();
  }
};

const closeAll = () => {
  Object.values(windows).forEach((winObj) => {
    if (winObj.closable !== false) closeWindow(winObj.name);
  });
};

// Global event listeners for closing windows when clicking outside or pressing Escape.
document.addEventListener("mousedown", (e) => {
  if (!container.contains(e.target)) {
    closeAll();
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAll();
});

// Export your window manager functions as an object.
export default { createWindow, addWindow, openWindow, closeWindow, closeAll };
