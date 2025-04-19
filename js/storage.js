function loadFromStorage() {
  let savedData;
  try {
    savedData = JSON.parse(localStorage.getItem("appData")) || {};

    // Handle migration from old format
    if (!savedData.items && Array.isArray(savedData)) {
      savedData = { items: savedData, budget: null };
    } else if (!savedData.items) {
      const oldItems = JSON.parse(localStorage.getItem("items")) || [];
      savedData = { items: oldItems, budget: null };
    }
  } catch (e) {
    savedData = { items: [], budget: null };
  }

  const savedItems = savedData.items || [];
  const savedBudget = savedData.budget || null;

  const itemsList = document.getElementById("itemsList");
  itemsList.innerHTML = "";

  savedItems.forEach((item) => {
    const listItem = addNewItem(
      item.name,
      item.minCost !== undefined ? item.minCost : null,
      item.maxCost !== undefined ? item.maxCost : null,
      item.avgCost !== undefined ? item.avgCost : null,
      item.isOptional || false,
      item.roomType || "general",
      item.priceType || "avg"
    );

    if (item.isHidden !== undefined) {
      listItem.dataset.isHidden = item.isHidden.toString();
      const hideBtn = listItem.querySelector(".hide-sum-btn");
      if (hideBtn)
        hideBtn.textContent = item.isHidden
          ? "إظهار في المجموع"
          : "إخفاء من المجموع";
    }
    if (savedData.showOptionalItems !== undefined) {
      document.getElementById("showOptionalItems").checked =
        savedData.showOptionalItems;
    }
  });

  if (savedBudget !== null) {
    document.getElementById("budgetInput").value = savedBudget;
  }

  setupRoomFilters();
  sortItemsByPrice();
  calculateTotals();
}

function saveToStorage() {
  const itemsList = document.getElementById("itemsList");
  const budgetInput = document.getElementById("budgetInput");
  const showOptional = document.getElementById("showOptionalItems").checked;

  const dataToSave = {
    items: Array.from(itemsList.children).map((listItem) => ({
      name: listItem.querySelector(".item-name-display").textContent,
      minCost:
        listItem.dataset.minCost !== "null"
          ? parseFloat(listItem.dataset.minCost)
          : null,
      maxCost:
        listItem.dataset.maxCost !== "null"
          ? parseFloat(listItem.dataset.maxCost)
          : null,
      avgCost:
        listItem.dataset.avgCost !== "null"
          ? parseFloat(listItem.dataset.avgCost)
          : null,
      priceType: listItem.dataset.priceType || "avg",
      roomType: listItem.dataset.roomType || "general",
      isOptional: listItem.dataset.isOptional === "true",
      isHidden: listItem.dataset.isHidden === "true",
    })),
    budget: budgetInput.value ? parseFloat(budgetInput.value) : null,
    showOptionalItems: showOptional,
  };

  localStorage.setItem("appData", JSON.stringify(dataToSave));
}

// For non-module version
window.loadFromStorage = loadFromStorage;
window.saveToStorage = saveToStorage;
