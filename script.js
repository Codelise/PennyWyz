// EXPENSE ARRAY
let expenseArray = [];

document.addEventListener("DOMContentLoaded", () => {
  loadExpenses();
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

  document
    .querySelector("#expense-form")
    .addEventListener("submit", handleAddExpense);
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

  localStorage.setItem("expense", JSON.stringify(expenseArray));

  alert("Saved Successfully!");
  displayExpenses();
  closeModal();
  expenseForm.reset();
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
            <button class="btn-icon edit" data-id="${expense.id}">
              <span class="material-symbols-outlined">edit</span>
            </button>
            <button class="btn-icon delete" data-id="${expense.id}">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </td>
   </tr>
   `;
  });
}
