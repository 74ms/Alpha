// keybindsinput.js

export class KeybindsInput {
  constructor(containerElement) {
    this.container = containerElement;
    this.keys = ["key", "type", "value"];
    this.objectArray = [];
    this.initUI();
  }
  
  initUI() {
    // Create a label for the keybind inputs
    const label = document.createElement("p");
    label.innerText = "Attack Percentage Keybinds";
    this.container.appendChild(label);

    // Create an "Add" button
    const addButton = document.createElement("button");
    addButton.innerText = "Add";
    addButton.addEventListener("click", () => this.addObject());
    this.container.appendChild(addButton);
  }

  addObject() {
    // Default keybind object
    this.objectArray.push({ key: "", type: "absolute", value: 0.8 });
    this.displayObjects();
  }

  updateObject(index, property, event) {
    if (index >= this.objectArray.length) return;
    let value;
    if (property === "value") {
      // For absolute keybinds, we use percentages (stored as decimals)
      value =
        this.objectArray[index].type === "absolute"
          ? parseFloat(event.target.value) / 100
          : parseFloat(event.target.value);
    } else if (property === "key") {
      value = event.key;
    } else {
      value = event.target.value;
    }
    this.objectArray[index][property] = value;
    if (property === "key") this.displayObjects();
  }

  startKeyInput(index, property, event) {
    event.target.value = "Press any key";
    const handler = (e) =>
      this.updateObject(index, property, { target: event.target, key: e.key });
    event.target.addEventListener("keydown", handler, { once: true });
    event.target.addEventListener("blur", () => {
      event.target.removeEventListener("keydown", handler);
      event.target.value = this.objectArray[index][property] || "";
    }, { once: true });
  }

  displayObjects() {
    // Clear any previous keybind UI except label and add button
    while (this.container.childNodes.length > 2) {
      this.container.removeChild(this.container.lastChild);
    }
    if (this.objectArray.length === 0) {
      const info = document.createElement("div");
      info.innerText = "No custom attack percentage keybinds added";
      this.container.appendChild(info);
    }
    this.objectArray.forEach((obj, index) => {
      const row = document.createElement("div");
      this.keys.forEach((key) => {
        const input = document.createElement(key === "type" ? "select" : "input");
        if (key === "type") {
          input.innerHTML =
            '<option value="absolute">Absolute</option><option value="relative">Relative</option>';
          input.value = obj.type;
          input.addEventListener("change", (e) => this.updateObject(index, key, e));
        } else if (key === "key") {
          input.type = "text";
          input.readOnly = true;
          input.placeholder = "No key set";
          input.value = obj[key];
          input.addEventListener("click", (e) => this.startKeyInput(index, key, e));
        } else {
          // For 'value', change input type based on type
          input.type = obj.type === "absolute" ? "text" : "number";
          input.value = obj.type === "absolute" ? obj.value * 100 + "%" : obj.value;
          input.addEventListener("input", (e) => this.updateObject(index, key, e));
        }
        row.appendChild(input);
      });
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => this.deleteObject(index));
      row.appendChild(deleteBtn);
      this.container.appendChild(row);
    });
  }

  deleteObject(index) {
    this.objectArray.splice(index, 1);
    this.displayObjects();
  }
}
