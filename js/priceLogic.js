function calculateTotals() {
  const itemsList = document.getElementById("itemsList");
  const visibleItems = Array.from(itemsList.children).filter(
    (item) => !item.classList.contains("filtered-out")
  );

  let totalSelected = 0;
  let totalSavings = 0;
  let itemsWithAvg = 0;

  visibleItems.forEach((item) => {
    if (item.dataset.isHidden === "true") return;

    const selectedPrice = getItemPrice(item);
    if (selectedPrice !== -Infinity) {
      totalSelected += selectedPrice;
    }

    const avgCost =
      item.dataset.avgCost !== "null" ? parseFloat(item.dataset.avgCost) : null;
    if (avgCost !== null && selectedPrice !== -Infinity) {
      totalSavings += avgCost - selectedPrice;
      itemsWithAvg++;
    }
  });

  // Update Savings Display
  const savingsElement = document.getElementById("savings");
  if (itemsWithAvg > 0) {
    if (totalSavings > 0) {
      savingsElement.className = "savings-positive";
      savingsElement.textContent = `+${formatNumber(totalSavings)} ج.م (توفير)`;
    } else if (totalSavings < 0) {
      savingsElement.className = "savings-negative";
      savingsElement.textContent = `${formatNumber(totalSavings)} ج.م (زيادة)`;
    } else {
      savingsElement.className = "";
      savingsElement.textContent = `${formatNumber(totalSavings)} ج.م`;
    }
  } else {
    savingsElement.className = "";
    savingsElement.textContent = "لا يوجد بيانات للمقارنة";
  }

  // Update Budget Comparison
  const budgetInput = document.getElementById("budgetInput");
  const budgetDifference = document.getElementById("budgetDifference");

  if (budgetInput.value) {
    const budget = parseFloat(budgetInput.value);
    const difference = budget - totalSelected;

    if (difference > 0) {
      budgetDifference.className = "budget-positive";
      budgetDifference.textContent = `+${formatNumber(
        difference
      )} ج.م (تحت الميزانية)`;
    } else if (difference < 0) {
      budgetDifference.className = "budget-negative";
      budgetDifference.textContent = `${formatNumber(
        difference
      )} ج.م (فوق الميزانية)`;
    } else {
      budgetDifference.className = "";
      budgetDifference.textContent = `${formatNumber(difference)} ج.م`;
    }
  } else {
    budgetDifference.className = "";
    budgetDifference.textContent = "٠ ج.م";
  }

  document.getElementById("totalPrice").textContent = `${formatNumber(
    totalSelected
  )} ج.م`;
}

function getItemPrice(item) {
  const priceType = item.dataset.priceType || "avg";

  if (priceType === "hide") {
    return -Infinity;
  } else if (priceType === "min" && item.dataset.minCost !== "null") {
    return parseFloat(item.dataset.minCost);
  } else if (priceType === "max" && item.dataset.maxCost !== "null") {
    return parseFloat(item.dataset.maxCost);
  } else if (priceType === "avg" && item.dataset.avgCost !== "null") {
    return parseFloat(item.dataset.avgCost);
  }

  return -Infinity;
}

function updatePriceType(listItem, priceType) {
  listItem.dataset.priceType = priceType;
  updatePriceTypeButtons(listItem);
  updatePriceDisplay(listItem, listItem.querySelector(".price-display"));
  saveToStorage();
  calculateTotals();
}

function updatePriceTypeButtons(listItem) {
  const priceType = listItem.dataset.priceType;
  const buttons = listItem.querySelectorAll(".price-type-btn");
  const costContainer = listItem.querySelector(".cost-container");

  buttons.forEach((btn) => btn.classList.remove("active"));
  costContainer.classList.remove(
    "min-selected",
    "max-selected",
    "avg-selected",
    "hide-selected"
  );

  if (priceType === "min") {
    buttons[1].classList.add("active");
    costContainer.classList.add("min-selected");
  } else if (priceType === "max") {
    buttons[2].classList.add("active");
    costContainer.classList.add("max-selected");
  } else if (priceType === "avg") {
    buttons[3].classList.add("active");
    costContainer.classList.add("avg-selected");
  } else if (priceType === "hide") {
    buttons[0].classList.add("active");
    costContainer.classList.add("hide-selected");
  }
}

function updatePriceDisplay(listItem, priceDisplay) {
  const minCost =
    listItem.dataset.minCost !== "null"
      ? parseFloat(listItem.dataset.minCost)
      : null;
  const maxCost =
    listItem.dataset.maxCost !== "null"
      ? parseFloat(listItem.dataset.maxCost)
      : null;
  const avgCost =
    listItem.dataset.avgCost !== "null"
      ? parseFloat(listItem.dataset.avgCost)
      : null;
  const priceType = listItem.dataset.priceType || "avg";

  let displayCost = null;
  let displayText = "";

  if (priceType === "min" && minCost !== null) {
    displayCost = minCost;
    displayText = `أقل سعر: ${formatNumber(minCost)} ج.م`;
  } else if (priceType === "max" && maxCost !== null) {
    displayCost = maxCost;
    displayText = `أعلى سعر: ${formatNumber(maxCost)} ج.م`;
  } else if (priceType === "avg" && avgCost !== null) {
    displayCost = avgCost;
    displayText = `متوسط السعر: ${formatNumber(avgCost)} ج.م`;
  }

  if (displayCost !== null) {
    const otherPrices = [];
    if (priceType !== "min" && minCost !== null)
      otherPrices.push(`أقل: ${formatNumber(minCost)}`);
    if (priceType !== "max" && maxCost !== null)
      otherPrices.push(`أعلى: ${formatNumber(maxCost)}`);
    if (priceType !== "avg" && avgCost !== null)
      otherPrices.push(`متوسط: ${formatNumber(avgCost)}`);

    if (otherPrices.length > 0) {
      displayText += ` (${otherPrices.join(" | ")})`;
    }

    priceDisplay.className = "price-display actual-price";
  } else {
    displayText = "لم يتم تحديد السعر";
    priceDisplay.className = "price-display";
  }

  priceDisplay.textContent = displayText;
}

function checkMissingCost(listItem, warningElement) {
  const minCost = listItem.dataset.minCost;
  const maxCost = listItem.dataset.maxCost;
  const avgCost = listItem.dataset.avgCost;

  if (minCost === "null" && maxCost === "null" && avgCost === "null") {
    listItem.classList.add("missing-cost");
    warningElement.textContent = "الرجاء تحديد سعر واحد على الأقل";
  } else {
    listItem.classList.remove("missing-cost");
    warningElement.textContent = "";
  }
}

// For non-module version
window.calculateTotals = calculateTotals;
window.getItemPrice = getItemPrice;
window.updatePriceType = updatePriceType;
window.updatePriceTypeButtons = updatePriceTypeButtons;
window.updatePriceDisplay = updatePriceDisplay;
window.checkMissingCost = checkMissingCost;
