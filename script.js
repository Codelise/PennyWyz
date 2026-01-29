// EXPENSE ARRAY
let expenseArray = [];

// INCOME ARRAY
let incomeArray = [];

// Tracks edit state
let currentEditId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadIncome();
  loadExpenses();
  expenseTotal();
  incomeTotal();
  updateCategoryTotal();
  displayExpenses();
  setupEventListeners();
});

function setupEventListeners() {
  // Open Expense modal
  document
    .querySelector("#add-expense-btn")
    .addEventListener("click", openExpenseModal);

  // Close Expense modal
  document
    .querySelector("#close-modal")
    .addEventListener("click", closeExpenseModal);
  document
    .querySelector("#cancel-btn")
    .addEventListener("click", closeExpenseModal);

  // Open Income modal
  document
    .querySelector("#add-income-btn")
    .addEventListener("click", openIncomeModal);

  // Close Income Modal
  document
    .querySelector("#close-income-modal")
    .addEventListener("click", closeIncomeModal);
  document
    .querySelector("#cancel-income-btn")
    .addEventListener("click", closeIncomeModal);

  // Submit added expense
  document
    .querySelector("#expense-form")
    .addEventListener("submit", handleAddExpense);

  // Submit added income
  document
    .querySelector("#income-form")
    .addEventListener("submit", handleAddIncome);

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
// Open Expense Modal
function openExpenseModal() {
  const expenseModal = document.querySelector("#expense-modal");
  expenseModal.style.display = "flex";
}

// Close Expense Modal
function closeExpenseModal() {
  const expenseModal = document.querySelector("#expense-modal");
  expenseModal.style.display = "none";
}

// Open Income Modal
function openIncomeModal() {
  const incomeModal = document.querySelector("#income-modal");
  incomeModal.style.display = "flex";
}
// Close Income Modal
function closeIncomeModal() {
  const incomeModal = document.querySelector("#income-modal");
  incomeModal.style.display = "none";
}

// CRUD
// ADD EXPENSE FUNCTION
function handleAddExpense(event) {
  event.preventDefault();

  const expenseName = document.querySelector("#expense-name").value.trim();
  const expenseAmount = parseFloat(
    document.querySelector("#expense-amount").value,
  );
  const expenseCategory = document.querySelector("#expense-category").value;
  const expenseDate = document.querySelector("#expense-date").value;
  const expenseNote = document.querySelector("#expense-note").value;

  if (!expenseName || !expenseAmount || !expenseDate) {
    alert("Fill the required fields to add expense");
    return;
  }

  if (isNaN(expenseAmount) || expenseAmount <= 0) {
    alert("Please enter positive number");
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

  currentEditId = null;

  saveToLocalStorage();
  alert("Saved Successfully!");
  displayExpenses();
  expenseTotal();
  updateCategoryTotal();
  closeExpenseModal();
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
  openExpenseModal();
}

function handleAddIncome() {
  const incomeName = document.querySelector("#income-name").value.trim();
  const incomeAmount = parseFloat(
    document.querySelector("#income-amount").value,
  );
  const incomeDate = document.querySelector("#income-date").value;
  const incomeCategory = document.querySelector("#income-category").value;
  const incomeNote = document.querySelector("#income-note").value;

  if (!incomeName || !incomeAmount || !incomeDate) {
    alert("All fields required!");
    return;
  }

  if (isNaN(incomeAmount) || incomeAmount <= 0) {
    alert("Positive numbers only");
    return;
  }
  const incomeObject = {
    id: "-" + Math.random().toString(36).substring(2, 9),
    incomeName: incomeName,
    incomeAmount: incomeAmount,
    incomeCategory: incomeCategory,
    incomeDate: incomeDate,
    incomeNote: incomeNote,
    createdAt: Date.now(),
  };

  console.log(incomeObject);

  incomeArray.push(incomeObject);
  alert("Saved income");
  saveToLocalStorage();
  incomeTotal();
  closeIncomeModal();
  document.querySelector("#income-form").reset();
}
// CALCULATIONS
// Count Total
function expenseTotal() {
  const expenseTotal = expenseArray.reduce(
    (sum, expense) => sum + expense.expenseAmount,
    0,
  );

  document.querySelector("#total-spent").textContent =
    currencyFormatter.format(expenseTotal);
}

// Income Total
function incomeTotal() {
  const incomeTotal = incomeArray.reduce(
    (sum, income) => sum + income.incomeAmount,
    0,
  );

  document.querySelector("#income-stats-amount").textContent =
    currencyFormatter.format(incomeTotal);
}

// Calculate percentage
function calculatePercent(part, total) {
  return total > 0 ? (part / total) * 100 : 0;
}

// Reusable function for updateCategoryTotal()
function getCategoryTotal(category) {
  return expenseArray // only use return when the function is "Query"/Result not "Command"
    .filter((expense) => expense.expenseCategory === category)
    .reduce((sum, expense) => sum + expense.expenseAmount, 0); // expense - current, sum - holder of expense value
}

// Total per category function
function updateCategoryTotal() {
  const needsTotal = getCategoryTotal("Needs"); // ("Needs") = (category) paremeter from getCategoryTotal()

  const wantsTotal = getCategoryTotal("Wants");

  const savingsTotal = getCategoryTotal("Savings");

  const emergencyTotal = getCategoryTotal("Emergency");

  const investmentsTotal = getCategoryTotal("Investments");

  const grandTotal =
    needsTotal + wantsTotal + savingsTotal + emergencyTotal + investmentsTotal;

  const needsPercentage = calculatePercent(needsTotal, grandTotal);
  const wantsPercentage = calculatePercent(wantsTotal, grandTotal);
  const savingsPercentage = calculatePercent(savingsTotal, grandTotal);
  const emergencyPercentage = calculatePercent(emergencyTotal, grandTotal);
  const investmentsPercentage = calculatePercent(investmentsTotal, grandTotal);

  // Needs and Wants Stats Cards
  document.querySelector("#needs-total").textContent =
    currencyFormatter.format(needsTotal);
  document.querySelector("#wants-total").textContent =
    currencyFormatter.format(wantsTotal);

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
  localStorage.setItem("income", JSON.stringify(incomeArray));
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

// load income localStorage
function loadIncome() {
  const income = localStorage.getItem("income");
  if (income) {
    incomeArray = JSON.parse(income);
  } else {
    incomeArray = [];
  }
}

// FORMAT NUMBER
const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

// DISPLAY FUNCTIONS
// Display Expense
function displayExpenses() {
  const tbody = document.querySelector("#expenses-tbody");
  const emptyState = document.querySelector("#empty-state");

  if (emptyState) {
    tbody.appendChild(emptyState);
  }

  if (expenseArray.length === 0) {
    emptyState.style.display = "table-row";
  } else {
    emptyState.style.display = "none";
  }

  let html = "";
  expenseArray.forEach((expense) => {
    html += `
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
  tbody.innerHTML = html;
}
