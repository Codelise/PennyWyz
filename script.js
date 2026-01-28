// EXPENSE ARRAY
let expenseArray = [];

// Tracks edit state
let currentEditId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadExpenses();
  expenseTotal();
  expenseTotal();
  updateCategoryTotal();
  displayExpenses();
  setupEventListeners();
});

function setupEventListeners() {
  // Open modal
  document
    .querySelector("#add-expense-btn")
    .addEventListener("click", openModal);

  // Close modal
  document.querySelector("#close-modal").addEventListener("click", closeModal);
  document.querySelector("#cancel-btn").addEventListener("click", closeModal);

  // Submit added expense
  document
    .querySelector("#expense-form")
    .addEventListener("submit", handleAddExpense);

  // Used tbody because edit and delete btns are inside that
  const tbody = document.querySelector("#expenses-tbody");
  tbody.addEventListener("click", (event) => {
    // Delete expense
    const deleteBtn = event.target.closest(".delete"); // gets the class .delete
    const editBtn = event.target.closest(".edit");
    if (deleteBtn) {
      const deleteId = deleteBtn.dataset.id; // from delete [data-id]
      deleteExpense(deleteId);
    } else if (editBtn) {
      // Edit expense
      if (!editBtn) return;
      const editId = editBtn.dataset.id;
      editExpense(editId);
    }
  });
}

// EXPENSE MODAL FUNCTIONS
// Open Modal
function openModal() {
  const expenseModal = document.querySelector("#expense-modal");
  expenseModal.style.display = "flex";
}

// Close Modal
const closeModal = () => {
  const expenseModal = document.querySelector("#expense-modal");
  expenseModal.style.display = "none";
};

// CRUD
// ADD EXPENSE FUNCTION
function handleAddExpense(event) {
  event.preventDefault();

  const expenseName = document.querySelector("#expense-name").value.trim();
  const expenseAmount = Number(document.querySelector("#expense-amount").value);
  const expenseCategory = document.querySelector("#expense-category").value;
  const expenseDate = document.querySelector("#expense-date").value;
  const expenseNote = document.querySelector("#expense-note").value;

  if (!expenseName || !expenseAmount || !expenseDate) {
    alert("Fill the required fields to add expense");
    return;
  }

  // for editing expense
  if (currentEditId !== null) {
    const expenseToUpdate = expenseArray.find(
      (expense) => expense.id === currentEditId,
    );
    expenseToUpdate.expenseName = expenseName;
    expenseToUpdate.expenseAmount = expenseAmount;
    expenseToUpdate.expenseCategory = expenseCategory;
    expenseToUpdate.expenseDate = expenseDate;
    expenseToUpdate.expenseNote = expenseNote;
  } else {
    // for adding expense
    const expenseObject = {
      id: "-" + Math.random().toString(36).substring(2, 9),
      expenseName: expenseName,
      expenseAmount: expenseAmount,
      expenseCategory: expenseCategory,
      expenseDate: expenseDate,
      expenseNote: expenseNote,
      createdAt: Date.now(),
    };

    expenseArray.push(expenseObject);
  }
  0;
  currentEditId = null;

  saveToLocalStorage();
  alert("Saved Successfully!");

  displayExpenses();
  expenseTotal();
  expenseTotal();
  updateCategoryTotal();
  closeModal();
  document.querySelector("#expense-form").reset();
}

// Delete Expense
function deleteExpense(id) {
  const confirmDelete = confirm("Are you sure you want to delete this item?");
  if (!confirmDelete) return;

  expenseArray = expenseArray.filter((expense) => expense.id !== id);
  saveToLocalStorage();
  alert("Succesfully deleted!");
  expenseTotal();
  displayExpenses();
}

function editExpense(id) {
  const expenseToEdit = expenseArray.find((expense) => expense.id === id);

  document.querySelector("#expense-name").value = expenseToEdit.expenseName;
  document.querySelector("#expense-amount").value = expenseToEdit.expenseAmount;
  document.querySelector("#expense-category").value =
    expenseToEdit.expenseCategory;
  document.querySelector("#expense-date").value = expenseToEdit.expenseDate;

  currentEditId = id;
  openModal();
}

// CALCULATIONS
// Count Total
function expenseTotal() {
  const total = expenseArray.reduce(
    (sum, expense) => sum + expense.expenseAmount,
    0,
  );
  document.querySelector("#total-spent").textContent = `₱${total.toFixed(2)}`;
}

// Total per category function
function updateCategoryTotal() {
  const needsTotal = expenseArray
    .filter((expense) => expense.expenseCategory === "Needs")
    .reduce((sum, expense) => sum + expense.expenseAmount, 0);

  const wantsTotal = expenseArray
    .filter((expense) => expense.expenseCategory === "Wants")
    .reduce((sum, expense) => sum + expense.expenseAmount, 0);

  const savingsTotal = expenseArray
    .filter((expense) => expense.expenseCategory === "Savings")
    .reduce((sum, expense) => sum + expense.expenseAmount, 0);

  const emergencyTotal = expenseArray
    .filter((expense) => expense.expenseCategory === "Emergency")
    .reduce((sum, expense) => sum + expense.expenseAmount, 0);

  const investmentsTotal = expenseArray
    .filter((expense) => expense.expenseCategory === "Investments")
    .reduce((sum, expense) => sum + expense.expenseAmount, 0);

  const grandTotal =
    needsTotal + wantsTotal + savingsTotal + emergencyTotal + investmentsTotal;

  const needsPercentage = grandTotal > 0 ? (needsTotal / grandTotal) * 100 : 0;
  const wantsPercentage = grandTotal > 0 ? (wantsTotal / grandTotal) * 100 : 0;
  const savingsPercentage =
    grandTotal > 0 ? (savingsTotal / grandTotal) * 100 : 0;
  const emergencyPercentage =
    grandTotal > 0 ? (emergencyTotal / grandTotal) * 100 : 0;
  const investmentsPercentage =
    grandTotal > 0 ? (investmentsTotal / grandTotal) * 100 : 0;

  // Needs and Wants Stats Cards
  document.querySelector("#needs-total").textContent =
    `₱${needsTotal.toFixed(2)}`;
  document.querySelector("#wants-total").textContent =
    `₱${wantsTotal.toFixed(2)}`;

  const categories = [
    {
      name: "Needs",
      total: needsTotal,
      percent: needsPercentage,
      color: "purple",
    },
    {
      name: "Wants",
      total: wantsTotal,
      percent: wantsPercentage,
      color: "amber",
    },
    {
      name: "Savings",
      total: savingsTotal,
      percent: savingsPercentage,
      color: "green",
    },
    {
      name: "Emergency",
      total: emergencyTotal,
      percent: emergencyPercentage,
      color: "amber",
    },
    {
      name: "Investments",
      total: investmentsTotal,
      percent: investmentsPercentage,
      color: "purple",
    },
  ];

  const categoryList = document.querySelector("#category-list");

  categoryList.innerHTML = "";

  categories.forEach((category) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.className = "category-item";
    categoryContainer.innerHTML = `
       <div class="category-header">
          <span class="category-name">${category.name}</span>
          <span class="category-percent">${category.percent.toFixed(1)}%</span>
       </div>
        <div class="progress-bar">
          <div class="progress-fill ${category.color}" style="width: ${category.percent}%"></div>
        </div>
    `;
    categoryList.appendChild(categoryContainer);
  });
}

// LOCAL STORAGE FUNCTIONS
// Save to localStorage
function saveToLocalStorage() {
  localStorage.setItem("expense", JSON.stringify(expenseArray));
}

// Load expense localStorage
function loadExpenses() {
  const loadExpense = localStorage.getItem("expense");
  if (loadExpense) {
    expenseArray = JSON.parse(loadExpense);
  } else {
    expenseArray = [];
  }
}

// DISPLAY FUNCTIONS
// Display Expense
function displayExpenses() {
  const tbody = document.querySelector("#expenses-tbody");
  const emptyState = document.querySelector("#empty-state");
  tbody.innerHTML = "";

  if (emptyState) {
    tbody.appendChild(emptyState);
  }

  if (expenseArray.length === 0) {
    emptyState.style.display = "table-row";
  } else {
    emptyState.style.display = "none";
  }

  expenseArray.forEach((expense) => {
    tbody.innerHTML += `
   <tr>
   <td>
   <span class="category-badge ${expense.expenseCategory.toLowerCase()}">
   ${expense.expenseCategory}
   </span>
   </td>
    <td>${expense.expenseName}</td>
    <td>${expense.expenseDate}</td>
    <td>₱${expense.expenseAmount}</td>
    <td class="text-center">
          <div class="action-btns">
            <button class="btn-icon edit" data-id="${expense.id}" id="editBtn">
              <span class="material-symbols-outlined">edit</span>
            </button>
            <button class="btn-icon delete" data-id="${expense.id}" id="deleteBtn">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </td>
   </tr>
   `;
  });
}
