function applyFilters() {
  const selectedRooms = Array.from(
    document.querySelectorAll(".room-filter-btn.active")
  )
    .map((btn) => btn.dataset.room)
    .filter((room) => room !== "all");

  const showAllRooms = document
    .querySelector('.room-filter-btn[data-room="all"]')
    .classList.contains("active");

  // Get checkbox and save its state
  const optionalCheckbox = document.getElementById("showOptionalItems");
  localStorage.setItem("showOptionalItems", optionalCheckbox.checked);

  const showOptionalItems = optionalCheckbox.checked;
  const itemsList = document.getElementById("itemsList");

  // Rest of your existing filter logic...
  Array.from(itemsList.children).forEach((listItem) => {
    const roomMatch =
      showAllRooms || selectedRooms.includes(listItem.dataset.roomType);
    const optionalMatch =
      showOptionalItems || listItem.dataset.isOptional === "false";
    const shouldShow = roomMatch && optionalMatch;

    listItem.classList.toggle("filtered-out", !shouldShow);
  });

  sortItemsByPrice();
  calculateTotals();
}

function setupRoomFilters() {
  const roomFilterContainer = document.getElementById("roomFilterContainer");
  roomFilterContainer.innerHTML = "";

  // All Button
  const allButton = document.createElement("button");
  allButton.className = "room-filter-btn active";
  allButton.dataset.room = "all";
  allButton.textContent = "الكل";
  allButton.addEventListener("click", () => {
    document.querySelectorAll(".room-filter-btn").forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.room === "all") btn.classList.add("active");
    });
    applyFilters();
  });
  roomFilterContainer.appendChild(allButton);

  // Room Type Buttons
  ROOM_TYPES.forEach((room) => {
    const button = document.createElement("button");
    button.className = "room-filter-btn";
    button.dataset.room = room.id;
    button.textContent = room.name;
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const allBtn = document.querySelector(
        '.room-filter-btn[data-room="all"]'
      );
      if (e.target === allBtn) return;

      button.classList.toggle("active");

      const anyActive = Array.from(
        document.querySelectorAll(".room-filter-btn")
      ).some((btn) => btn !== allBtn && btn.classList.contains("active"));

      if (anyActive) {
        allBtn.classList.remove("active");
      } else {
        allBtn.classList.add("active");
      }

      applyFilters();
    });
    roomFilterContainer.appendChild(button);
  });
}

function sortItemsByPrice() {
  const itemsList = document.getElementById("itemsList");
  const items = Array.from(itemsList.children);

  const visibleItems = items.filter(
    (item) => !item.classList.contains("filtered-out")
  );
  const filteredOutItems = items.filter((item) =>
    item.classList.contains("filtered-out")
  );

  visibleItems.sort((a, b) => {
    const aPrice = getItemPrice(a);
    const bPrice = getItemPrice(b);
    return bPrice - aPrice;
  });

  itemsList.innerHTML = "";
  [...visibleItems, ...filteredOutItems].forEach((item) =>
    itemsList.appendChild(item)
  );
}

// For non-module version
window.applyFilters = applyFilters;
window.setupRoomFilters = setupRoomFilters;
window.sortItemsByPrice = sortItemsByPrice;
