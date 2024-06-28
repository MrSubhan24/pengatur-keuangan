const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const type = document.getElementsByName('type');
const categoryContainer = document.getElementById('category-container');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    const selectedType = Array.from(type).find(radio => radio.checked).value;
    const sign = selectedType === 'income' ? 1 : -1;

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Silakan masukkan keterangan dan jumlah transaksi');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: sign * +amount.value,
            category: selectedType === 'expense' ? category.value : '' // Tambahkan kategori hanya untuk pengeluaran
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);

        updateValues();

        updateLocalStorage();

        text.value = '';
        amount.value = '';
        if (selectedType === 'expense') category.value = '';
    }
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.text} ${transaction.category ? `(${transaction.category})` : ''} <span>${sign}Rp${Math.abs(transaction.amount)}</span> <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `Rp${formatRupiah(total)}`;
    money_plus.innerText = `Rp${formatRupiah(income)}`;
    money_minus.innerText = `Rp${formatRupiah(expense)}`;
}

// Remove transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();

    init();
}

// Update local storage transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Format Rupiah
function formatRupiah(amount) {
    return parseInt(amount).toLocaleString('id-ID');
}

// Show or hide category based on type
function toggleCategory() {
    const selectedType = Array.from(type).find(radio => radio.checked).value;
    if (selectedType === 'expense') {
        categoryContainer.style.display = 'block';
    } else {
        categoryContainer.style.display = 'none';
    }
}

// Add event listeners to toggle category on type change
Array.from(type).forEach(radio => {
    radio.addEventListener('change', toggleCategory);
});

// Init app
function init() {
    list.innerHTML = '';

    transactions.forEach(addTransactionDOM);
    updateValues();
    toggleCategory(); // Call toggleCategory to set initial state
}

init();

form.addEventListener('submit', addTransaction);
