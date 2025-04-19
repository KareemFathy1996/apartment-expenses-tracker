function addNewItem(
  itemValue,
  minCost = null,
  maxCost = null,
  avgCost = null,
  isOptional = false,
  roomType = "general",
  priceType = "avg"
) {
  const itemsList = document.getElementById("itemsList");
  const listItem = document.createElement("li");

  // Set data attributes
  listItem.dataset.minCost = minCost !== null ? minCost : "null";
  listItem.dataset.maxCost = maxCost !== null ? maxCost : "null";
  listItem.dataset.avgCost = avgCost !== null ? avgCost : "null";
  listItem.dataset.priceType = priceType;
  listItem.dataset.roomType = roomType;
  listItem.dataset.isOptional = isOptional.toString();
  listItem.dataset.isHidden = "false";

  // Item Header
  const itemHeader = document.createElement("div");
  itemHeader.className = "item-header";

  // Item Name
  const itemNameContainer = document.createElement("div");
  itemNameContainer.className = "item-name-container";

  const itemNameDisplay = document.createElement("div");
  itemNameDisplay.className = "item-name-display";
  itemNameDisplay.textContent = itemValue;

  const itemNameInput = document.createElement("input");
  itemNameInput.type = "text";
  itemNameInput.className = "item-name-input";
  itemNameInput.value = itemValue;
  itemNameInput.style.display = "none";

  // Name editing
  itemNameDisplay.addEventListener("click", () => {
    itemNameDisplay.style.display = "none";
    itemNameInput.style.display = "block";
    itemNameInput.focus();
  });

  itemNameInput.addEventListener("blur", () => {
    const newValue = itemNameInput.value.trim();
    if (newValue) {
      itemNameDisplay.textContent = newValue;
      saveToStorage();
    }
    itemNameDisplay.style.display = "block";
    itemNameInput.style.display = "none";
  });

  itemNameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") itemNameInput.blur();
  });

  itemNameContainer.appendChild(itemNameDisplay);
  itemNameContainer.appendChild(itemNameInput);

  // Item Controls
  const itemControls = document.createElement("div");
  itemControls.className = "item-controls";

  // Optional Toggle
  const optionalToggle = document.createElement("span");
  optionalToggle.className = isOptional
    ? "item-optional-toggle optional"
    : "item-optional-toggle";
  optionalToggle.textContent = isOptional ? "اختياري" : "إجباري";
  optionalToggle.addEventListener("click", () => {
    const isOptional = listItem.dataset.isOptional === "true";
    listItem.dataset.isOptional = (!isOptional).toString();
    optionalToggle.textContent = !isOptional ? "اختياري" : "إجباري";
    optionalToggle.className = !isOptional
      ? "item-optional-toggle optional"
      : "item-optional-toggle";
    saveToStorage();
    applyFilters();
  });

  // Room Select
  const roomSelect = document.createElement("select");
  roomSelect.className = "room-select";
  ROOM_TYPES.forEach((room) => {
    const option = document.createElement("option");
    option.value = room.id;
    option.textContent = room.name;
    option.selected = room.id === roomType;
    roomSelect.appendChild(option);
  });
  roomSelect.addEventListener("change", () => {
    listItem.dataset.roomType = roomSelect.value;
    saveToStorage();
    applyFilters();
  });

  // Remove Button
  const removeButton = document.createElement("span");
  removeButton.className = "remove-item";
  removeButton.innerHTML = "&times;";
  removeButton.addEventListener("click", () => {
    itemsList.removeChild(listItem);
    saveToStorage();
    applyFilters();
  });

  itemControls.appendChild(optionalToggle);
  itemControls.appendChild(roomSelect);
  itemControls.appendChild(removeButton);

  itemHeader.appendChild(itemNameContainer);
  itemHeader.appendChild(itemControls);

  // Price Controls
  const priceTypeSelector = document.createElement("div");
  priceTypeSelector.className = "price-type-selector";

  // Price Type Buttons
  const hideItemBtn = document.createElement("button");
  hideItemBtn.className =
    priceType === "hide" ? "price-type-btn active" : "price-type-btn";
  hideItemBtn.textContent = "إخفاء من المجموع";
  hideItemBtn.addEventListener("click", () =>
    updatePriceType(listItem, "hide")
  );

  const minPriceBtn = document.createElement("button");
  minPriceBtn.className =
    priceType === "min" ? "price-type-btn active" : "price-type-btn";
  minPriceBtn.textContent = "أقل سعر";
  minPriceBtn.addEventListener("click", () => updatePriceType(listItem, "min"));

  const maxPriceBtn = document.createElement("button");
  maxPriceBtn.className =
    priceType === "max" ? "price-type-btn active" : "price-type-btn";
  maxPriceBtn.textContent = "أعلى سعر";
  maxPriceBtn.addEventListener("click", () => updatePriceType(listItem, "max"));

  const avgPriceBtn = document.createElement("button");
  avgPriceBtn.className =
    priceType === "avg" ? "price-type-btn active" : "price-type-btn";
  avgPriceBtn.textContent = "متوسط";
  avgPriceBtn.addEventListener("click", () => updatePriceType(listItem, "avg"));

  priceTypeSelector.appendChild(hideItemBtn);
  priceTypeSelector.appendChild(minPriceBtn);
  priceTypeSelector.appendChild(maxPriceBtn);
  priceTypeSelector.appendChild(avgPriceBtn);

  // Cost Container
  const costContainer = document.createElement("div");
  costContainer.className = `cost-container ${priceType}-selected`;

  const priceDisplay = document.createElement("div");
  priceDisplay.className = "price-display";
  updatePriceDisplay(listItem, priceDisplay);
  costContainer.appendChild(priceDisplay);
  costContainer.appendChild(priceTypeSelector);

  // Cost Inputs
  const costInputs = document.createElement("div");
  costInputs.className = "cost-inputs";

  const minInput = document.createElement("input");
  minInput.type = "number";
  minInput.placeholder = "أقل سعر";
  minInput.className = "cost-input min-input";
  minInput.step = "1";
  minInput.min = "0";
  if (minCost !== null) minInput.value = minCost;

  const maxInput = document.createElement("input");
  maxInput.type = "number";
  maxInput.placeholder = "أعلى سعر";
  maxInput.className = "cost-input max-input";
  maxInput.step = "1";
  maxInput.min = "0";
  if (maxCost !== null) maxInput.value = maxCost;

  const avgInput = document.createElement("input");
  avgInput.type = "number";
  avgInput.placeholder = "متوسط السعر";
  avgInput.className = "cost-input avg-input";
  avgInput.step = "1";
  avgInput.min = "0";
  if (avgCost !== null) avgInput.value = avgCost;

  costInputs.appendChild(minInput);
  costInputs.appendChild(maxInput);
  costInputs.appendChild(avgInput);
  costContainer.appendChild(costInputs);

  // Missing Cost Warning
  const missingCostWarning = document.createElement("div");
  missingCostWarning.className = "missing-cost-warning";
  costContainer.appendChild(missingCostWarning);
  checkMissingCost(listItem, missingCostWarning);

  // Handle Cost Changes
  const handleCostChange = () => {
    listItem.dataset.minCost = minInput.value ? minInput.value : "null";
    listItem.dataset.maxCost = maxInput.value ? maxInput.value : "null";
    listItem.dataset.avgCost = avgInput.value ? avgInput.value : "null";
    updatePriceDisplay(listItem, priceDisplay);
    checkMissingCost(listItem, missingCostWarning);
    saveToStorage();
    calculateTotals();
  };

  minInput.addEventListener("change", handleCostChange);
  maxInput.addEventListener("change", handleCostChange);
  avgInput.addEventListener("change", handleCostChange);

  // Assemble Item
  listItem.appendChild(itemHeader);
  listItem.appendChild(costContainer);
  itemsList.appendChild(listItem);

  return listItem;
}

function addItemFromInputs() {
  const itemInput = document.getElementById("itemInput");
  const minCostInput = document.getElementById("minCost");
  const maxCostInput = document.getElementById("maxCost");
  const avgCostInput = document.getElementById("avgCost");
  const isOptionalCheckbox = document.getElementById("isOptional");
  const roomSelect = document.getElementById("roomSelect");

  const itemValue = itemInput.value.trim();
  const minCost = minCostInput.value ? parseFloat(minCostInput.value) : null;
  const maxCost = maxCostInput.value ? parseFloat(maxCostInput.value) : null;
  const avgCost = avgCostInput.value ? parseFloat(avgCostInput.value) : null;
  const isOptional = isOptionalCheckbox.checked;
  const roomType = roomSelect.value;

  if (itemValue) {
    addNewItem(itemValue, minCost, maxCost, avgCost, isOptional, roomType);
    itemInput.value = "";
    minCostInput.value = "";
    maxCostInput.value = "";
    avgCostInput.value = "";
    isOptionalCheckbox.checked = false;
    roomSelect.value = "general";
    itemInput.focus();
    saveToStorage();
    applyFilters();
  }
}

// For non-module version
window.addNewItem = addNewItem;
window.addItemFromInputs = addItemFromInputs;
