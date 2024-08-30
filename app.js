const app = {
    expenses: [],
    friends: [],
    groups: [],
    activities: [],

    init() {
        this.loadData();
        this.bindEvents();
        this.loadPage('dashboard');
        AOS.init();

        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch((error) => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    },

    bindEvents() {
        document.querySelectorAll('.navbar-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.loadPage(page);
            });
        });
    },

    loadPage(page) {
        const content = document.getElementById('page-content');
        content.innerHTML = '';
        content.className = 'fade-in';

        switch (page) {
            case 'dashboard':
                this.renderDashboard(content);
                break;
            case 'expenses':
                this.renderExpenses(content);
                break;
            case 'friends':
                this.renderFriends(content);
                break;
            case 'groups':
                this.renderGroups(content);
                break;
        }

        setTimeout(() => content.classList.add('show'), 50);
    },

    renderDashboard(container) {
        container.innerHTML = `
            <h1 class="title">Dashboard</h1>
            <div class="columns">
                <div class="column">
                    <div class="box" data-aos="fade-up">
                        <h2 class="subtitle">Expense Overview</h2>
                        <canvas id="expenseChart"></canvas>
                    </div>
                </div>
                <div class="column">
                    <div class="box" data-aos="fade-up" data-aos-delay="100">
                        <h2 class="subtitle">Expense by Category</h2>
                        <canvas id="categoryChart"></canvas>
                    </div>
                </div>
            </div>
            <div class="columns">
                <div class="column">
                    <div class="box" data-aos="fade-up" data-aos-delay="200">
                        <h2 class="subtitle">Recent Activity</h2>
                        <div id="recentActivity"></div>
                    </div>
                </div>
                <div class="column">
                    <div class="box" data-aos="fade-up" data-aos-delay="300">
                        <h2 class="subtitle">Balance Overview</h2>
                        <canvas id="balanceChart"></canvas>
                    </div>
                </div>
            </div>
        `;

        this.renderExpenseChart();
        this.renderCategoryChart();
        this.renderRecentActivity();
        this.renderBalanceChart();
    },

    renderExpenseChart() {
        const ctx = document.getElementById('expenseChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Monthly Expenses',
                    data: [300, 450, 380, 520, 400, 550],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    },

    renderCategoryChart() {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Food', 'Transport', 'Rent', 'Entertainment', 'Others'],
                datasets: [{
                    data: [300, 150, 800, 200, 100],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        });
    },

    renderRecentActivity() {
        const recentActivity = document.getElementById('recentActivity');
        this.activities.slice(0, 5).forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <p><strong>${activity.type}</strong>: ${activity.description}</p>
                <small>${new Date(activity.date).toLocaleString()}</small>
            `;
            recentActivity.appendChild(activityItem);
        });
    },

    renderBalanceChart() {
        const ctx = document.getElementById('balanceChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['You Owe', 'You are Owed'],
                datasets: [{
                    label: 'Balance',
                    data: [50, 120],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(75, 192, 192, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    },

    renderExpenses(container) {
        container.innerHTML = `
            <h1 class="title">Expenses</h1>
            <button class="button is-primary mb-4" id="addExpenseBtn">Add Expense</button>
            <div id="expenseList"></div>
        `;

        const expenseList = document.getElementById('expenseList');
        this.expenses.forEach((expense, index) => {
            const expenseItem = document.createElement('div');
            expenseItem.className = 'box expense-item';
            expenseItem.setAttribute('data-aos', 'fade-up');
            expenseItem.setAttribute('data-aos-delay', index * 100);
            expenseItem.innerHTML = `
                <p><strong>${expense.description}</strong></p>
                <p>Amount: $${expense.amount}</p>
                <p>Paid by: ${expense.paidBy}</p>
                <p>Split: ${expense.split.join(', ')}</p>
            `;
            expenseList.appendChild(expenseItem);
        });

        document.getElementById('addExpenseBtn').addEventListener('click', () => this.showAddExpenseForm());
    },

    renderFriends(container) {
        container.innerHTML = `
            <h1 class="title">Friends</h1>
            <button class="button is-primary mb-4" id="addFriendBtn">Add Friend</button>
            <div id="friendList"></div>
        `;

        const friendList = document.getElementById('friendList');
        this.friends.forEach((friend, index) => {
            const friendItem = document.createElement('div');
            friendItem.className = 'box friend-item';
            friendItem.setAttribute('data-aos', 'fade-up');
            friendItem.setAttribute('data-aos-delay', index * 100);
            friendItem.textContent = friend;
            friendList.appendChild(friendItem);
        });

        document.getElementById('addFriendBtn').addEventListener('click', () => this.addFriend());
    },

    renderGroups(container) {
        container.innerHTML = `
            <h1 class="title">Groups</h1>
            <button class="button is-primary mb-4" id="addGroupBtn">Add Group</button>
            <div id="groupList"></div>
        `;

        const groupList = document.getElementById('groupList');
        this.groups.forEach((group, index) => {
            const groupItem = document.createElement('div');
            groupItem.className = 'box group-item';
            groupItem.setAttribute('data-aos', 'fade-up');
            groupItem.setAttribute('data-aos-delay', index * 100);
            groupItem.textContent = group;
            groupList.appendChild(groupItem);
        });

        document.getElementById('addGroupBtn').addEventListener('click', () => this.addGroup());
    },

    showAddExpenseForm() {
        const formHtml = `
            <div class="expense-split-form">
                <div class="field">
                    <label class="label">Description</label>
                    <div class="control">
                        <input class="input" type="text" id="expenseDescription" placeholder="Expense description">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Amount</label>
                    <div class="control">
                        <input class="input" type="number" id="expenseAmount" placeholder="Expense amount">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Paid by</label>
                    <div class="control">
                        <div class="select">
                            <select id="expensePaidBy">
                                ${this.friends.map(friend => `<option value="${friend}">${friend}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                </div>
                <div class="field">
                    <label class="label">Split with</label>
                    <div class="control" id="splitOptions">
                        ${this.friends.map(friend => `
                            <label class="checkbox split-option">
                                <input type="checkbox" value="${friend}">
                                ${friend}
                            </label>
                        `).join('')}
                    </div>
                </div>
                <div class="field">
                    <div class="control">
                        <button class="button is-primary" id="submitExpense">Add Expense</button>
                    </div>
                </div>
            </div>
        `;

        const modalHtml = `
            <div class="modal is-active">
                <div class="modal-background"></div>
                <div class="modal-content">
                    <div class="box">
                        <h2 class="subtitle">Add New Expense</h2>
                        ${formHtml}
                    </div>
                </div>
                <button class="modal-close is-large" aria-label="close"></button>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        document.querySelector('.modal-close').addEventListener('click', () => {
            document.querySelector('.modal').remove();
        });

        document.getElementById('submitExpense').addEventListener('click', () => this.addExpense());
    },

    addExpense() {
        const description = document.getElementById('expenseDescription').value;
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        const paidBy = document.getElementById('expensePaidBy').value;
        const split = Array.from(document.querySelectorAll('#splitOptions input:checked')).map(input => input.value);

        if (description && !isNaN(amount) && paidBy && split.length > 0) {
            const newExpense = { description, amount, paidBy, split };
            this.expenses.push(newExpense);
            this.activities.unshift({
                type: 'New Expense',
                description: `${paidBy} added ${description} ($${amount})`,
                date: new Date()
            });
            this.saveData();
            document.querySelector('.modal').remove();
            this.loadPage('expenses');
        } else {
            alert('Please fill in all fields and select at least one person to split with.');
        }
    },

    addFriend() {
        const friend = prompt('Enter friend name:');
        if (friend) {
            this.friends.push(friend);
            this.activities.unshift({
                type: 'New Friend',
                description: `${friend} was added to your friends list`,
                date: new Date()
            });
            this.saveData();
            this.loadPage('friends');
        }
    },

    addGroup() {
        const group = prompt('Enter group name:');
        if (group) {
            this.groups.push(group);
            this.activities.unshift({
                type: 'New Group',
                description: `Group "${group}" was created`,
                date: new Date()
            });
            this.saveData();
            this.loadPage('groups');
        }
    },

    loadData() {
        const data = JSON.parse(localStorage.getItem('splitrightData'));
        if (data) {
            this.expenses = data.expenses || [];
            this.friends = data.friends || [];
            this.groups = data.groups || [];
            this.activities = data.activities || [];
        }
    },

    saveData() {
        localStorage.setItem('splitrightData', JSON.stringify({
            expenses: this.expenses,
            friends: this.friends,
            groups: this.groups,
            activities: this.activities
        }));
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});