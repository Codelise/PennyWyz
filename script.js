// EXPENSE ARRAY
let expenseArray = [];

// Tracks edit state
let currentEditId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadExpenses();
  expenseTotal();
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

  saveToLocalStorage();
  alert("Saved Successfully!");
  expenseTotal();
  displayExpenses();
  closeModal();
  document.querySelector("#expense-form").reset();

  currentEditId = null;
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

// Count Total
function expenseTotal() {
  const total = expenseArray.reduce(
    (sum, expense) => sum + expense.expenseAmount,
    0,
  );
  document.querySelector("#total-spent").textContent = `₱${total.toFixed(2)}`;
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
