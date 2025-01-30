let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

const categorySelect = document.getElementById('category-select');
const customCategoryInput = document.createElement('input');
customCategoryInput.type = 'text';
customCategoryInput.id = 'custom-category';
customCategoryInput.placeholder = 'Enter custom category';
customCategoryInput.style.display = 'none';
categorySelect.insertAdjacentElement('afterend', customCategoryInput);

const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expensesTableBody = document.getElementById('expnese-table-body');
const totalAmountCell = document.getElementById('total-amount');

categorySelect.addEventListener('change', function() {
    if (this.value === 'Other') {
        customCategoryInput.style.display = 'block';
        customCategoryInput.focus();
    } else {
        customCategoryInput.style.display = 'none';
        customCategoryInput.value = '';
    }
});

function updateLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function renderExpenses() {
    expensesTableBody.innerHTML = '';
    totalAmount = 0;

    expenses.forEach((expense, index) => {
        totalAmount += expense.amount;

        const newRow = expensesTableBody.insertRow();
        newRow.innerHTML = `
            <td>${expense.category}</td>
            <td>${expense.amount}</td>
            <td>${expense.date}</td>
            <td><button class="delete-btn" data-index="${index}">Delete</button></td>
        `;
    });

    totalAmountCell.textContent = totalAmount;

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            totalAmount -= expenses[index].amount;
            expenses.splice(index, 1);
            updateLocalStorage();
            renderExpenses();
        });
    });
}

addBtn.addEventListener('click', function() {
    let category = categorySelect.value;
    if (category === 'Other') {
        category = customCategoryInput.value.trim();
        if (!category) {
            alert('Please enter a category');
            return;
        }
    }

    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    if (!date) {
        alert('Please select a date');
        return;
    }

    const expense = { category, amount, date };
    expenses.push(expense);
    updateLocalStorage();
    renderExpenses();

    categorySelect.value = '';
    customCategoryInput.style.display = 'none';
    customCategoryInput.value = '';
    categorySelect.value = 'Food & Beverage'
    amountInput.value = '';
    dateInput.value = '';
});

// Render existing expenses on page load
renderExpenses();
