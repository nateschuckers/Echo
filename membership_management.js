// --- REMOVED: All Firebase imports ---

// --- This is a simplified React-like implementation for this specific module ---
const React = (() => {
    let state = [];
    let stateIndex = 0;
    
    function useState(initialValue) {
        const currentIndex = stateIndex;
        state[currentIndex] = state[currentIndex] ?? initialValue;
        const setState = (newValue) => {
            if (JSON.stringify(state[currentIndex]) === JSON.stringify(newValue)) return;
            state[currentIndex] = newValue;
            renderApp(); 
        };
        stateIndex++;
        return [state[currentIndex], setState];
    }
    
    // NOTE: useEffect is not used in this simplified version but kept for structure
    function useEffect(callback, deps) {
        const hasRunKey = `effect_${stateIndex}`;
        if (!window[hasRunKey]) {
            callback();
            window[hasRunKey] = true;
        }
        stateIndex++;
    }
    
    function resetState() {
        stateIndex = 0;
    }

    return { useState, useEffect, resetState };
})();

const { useState, useEffect } = React;

// --- Global State & Local Data ---
const affiliations = ['Women United', 'Emerging Leaders', 'Tocqueville Society', 'Retire United', 'Loyal Donors'];
let allMembersData = [];
let chartInstances = {};
let isDataReady = false;

const localMembersData = [
    { name: 'Eleanor Vance', joinDate: '2022-03-15', renewalDate: '2025-03-15', status: 'Active', type: 'Individual', giftAmount: 5000, volunteerHours: 20, affiliation: 'Tocqueville Society' },
    { name: 'Marcus Thorne', joinDate: '2023-01-20', renewalDate: '2026-01-20', status: 'Active', type: 'Household', giftAmount: 1500, volunteerHours: 40, affiliation: 'Emerging Leaders' },
    { name: 'Isabella Rossi', joinDate: '2021-11-05', renewalDate: '2024-11-05', status: 'Lapsed', type: 'Individual', giftAmount: 250, volunteerHours: 10, affiliation: 'Women United' },
    { name: 'James O\'Connell', joinDate: '2020-06-01', renewalDate: '2025-06-01', status: 'Active', type: 'Retiree', giftAmount: 1000, volunteerHours: 100, affiliation: 'Retire United' },
    { name: 'Chen Xiu Ying', joinDate: '2019-09-10', renewalDate: '2025-09-10', status: 'Active', type: 'Individual', giftAmount: 500, volunteerHours: 5, affiliation: 'Loyal Donors' },
    { name: 'Sofia Garcia', joinDate: '2023-08-12', renewalDate: '2026-08-12', status: 'Active', type: 'Individual', giftAmount: 300, volunteerHours: 25, affiliation: 'Women United' },
    { name: 'Liam Gallagher', joinDate: '2022-09-01', renewalDate: '2025-09-15', status: 'Active', type: 'Individual', giftAmount: 200, volunteerHours: 15, affiliation: 'Women United' },
    { name: 'Olivia Chen', joinDate: '2021-10-05', renewalDate: '2025-10-10', status: 'Active', type: 'Household', giftAmount: 750, volunteerHours: 30, affiliation: 'Emerging Leaders' },
    { name: 'Noah Patel', joinDate: '2020-11-15', renewalDate: '2025-11-01', status: 'Active', type: 'Individual', giftAmount: 1200, volunteerHours: 0, affiliation: 'Loyal Donors' },
    { name: 'Ava Schmidt', joinDate: '2019-07-20', renewalDate: '2025-07-01', status: 'Lapsed', type: 'Retiree', giftAmount: 2500, volunteerHours: 80, affiliation: 'Retire United' },
    { name: 'William Jones', joinDate: '2023-09-25', renewalDate: '2025-09-25', status: 'Active', type: 'Individual', giftAmount: 10000, volunteerHours: 5, affiliation: 'Tocqueville Society' },
];

const memberStatuses = ['Active', 'Lapsed'];
const memberTypes = [...new Set(localMembersData.map(m => m.type))];

// --- App Initialization Logic ---
function initializeLocalData() {
    return new Promise(resolve => {
        setTimeout(() => {
            allMembersData = localMembersData;
            isDataReady = true;
            console.log("Local data initialized.");
            resolve();
        }, 500);
    });
}

// --- Main App Component ---
function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedAffiliations, setSelectedAffiliations] = useState(['All Groups']);
    // FIX: Added state for member management filters
    const [memberFilters, setMemberFilters] = useState({
        affiliation: 'All',
        status: 'All',
        type: 'All',
        search: ''
    });

    const renderContent = () => {
        if (!isDataReady) {
            return `<div class="flex justify-center items-center h-64"><div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div></div>`;
        }
        switch (activeTab) {
            case 'dashboard': return Dashboard({ selectedAffiliations, setSelectedAffiliations });
            case 'members': return MemberManagement({ memberFilters, setMemberFilters });
            case 'renewals': return Renewals();
            default: return Dashboard({ selectedAffiliations, setSelectedAffiliations });
        }
    };

    return `
        <div>
            ${TabMenu({ activeTab, setActiveTab })}
            <main>
                <div class="bg-gray-800 p-6 rounded-b-lg shadow-lg">
                    ${renderContent()}
                </div>
            </main>
        </div>
    `;
}

// --- UI Components ---
function TabMenu({ activeTab, setActiveTab }) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-bar' },
        { id: 'members', label: 'Manage Members', icon: 'fa-users' },
        { id: 'renewals', label: 'Upcoming Renewals', icon: 'fa-calendar-check' },
    ];
    
    setTimeout(() => {
        navItems.forEach(item => {
            const tabElement = document.getElementById(`${item.id}-tab`);
            if (tabElement) {
                tabElement.onclick = () => setActiveTab(item.id);
            }
        });
    }, 0);

    return `
        <nav class="bg-gray-800 rounded-t-lg shadow-md">
            <div class="flex items-center space-x-2 p-2">
                ${navItems.map(item => `
                    <button id="${item.id}-tab" class="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-md text-left transition-colors duration-200 ${activeTab === item.id ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}">
                        <i class="fas ${item.icon} fa-fw"></i>
                        <span class="font-medium hidden sm:inline">${item.label}</span>
                    </button>
                `).join('')}
            </div>
        </nav>
    `;
}

function FilterDropdown({ selectedAffiliations, setSelectedAffiliations }) {
    setTimeout(() => {
        const filterButton = document.getElementById('filter-button');
        const filterDropdown = document.getElementById('filter-dropdown');
        const checkboxes = document.querySelectorAll('.filter-checkbox');

        if (filterButton) {
            filterButton.onclick = () => filterDropdown.classList.toggle('hidden');
        }

        checkboxes.forEach(checkbox => {
            checkbox.onchange = (e) => {
                const { value, checked } = e.target;
                let newSelection = [...selectedAffiliations];

                if (value === 'All Groups') {
                    newSelection = ['All Groups'];
                } else {
                    newSelection = newSelection.filter(item => item !== 'All Groups');
                    if (checked) {
                        newSelection.push(value);
                    } else {
                        newSelection = newSelection.filter(item => item !== value);
                    }
                }

                if (newSelection.length === 0 || newSelection.length === affiliations.length) {
                    newSelection = ['All Groups'];
                }
                
                setSelectedAffiliations(newSelection);
            };
        });

        document.addEventListener('click', (e) => {
            if (filterButton && !filterButton.contains(e.target) && filterDropdown && !filterDropdown.contains(e.target)) {
                filterDropdown.classList.add('hidden');
            }
        });
    }, 0);
    
    const displayLabel = selectedAffiliations.includes('All Groups') || selectedAffiliations.length === affiliations.length 
        ? 'All Groups' 
        : `${selectedAffiliations.length} Group(s) Selected`;

    return `
        <div class="relative inline-block text-left mb-6">
            <div>
                <button type="button" id="filter-button" class="inline-flex justify-center w-full rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary">
                    ${displayLabel}
                    <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
            <div id="filter-dropdown" class="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none hidden z-10">
                <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <label class="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600">
                        <input type="checkbox" class="filter-checkbox form-checkbox h-4 w-4 text-primary bg-gray-800 border-gray-600 rounded focus:ring-primary" value="All Groups" ${selectedAffiliations.includes('All Groups') ? 'checked' : ''}>
                        <span class="ml-3">All Groups</span>
                    </label>
                    ${affiliations.map(aff => `
                        <label class="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600">
                            <input type="checkbox" class="filter-checkbox form-checkbox h-4 w-4 text-primary bg-gray-800 border-gray-600 rounded focus:ring-primary" value="${aff}" ${selectedAffiliations.includes(aff) ? 'checked' : ''}>
                            <span class="ml-3">${aff}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}


function Dashboard({ selectedAffiliations, setSelectedAffiliations }) {
    setTimeout(() => {
        updateDashboardCards(selectedAffiliations);
        createGiftAmountsChart();
        createVolunteerHoursChart();
        createEnrollmentHistoryChart();
    }, 0);

    return `
        <div>
            ${FilterDropdown({ selectedAffiliations, setSelectedAffiliations })}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-blue-500/80 text-white p-6 rounded-xl shadow-lg">
                    <p class="text-sm font-medium opacity-80">Total Members</p>
                    <p id="total-members-card" class="text-4xl font-bold">0</p>
                </div>
                <div class="bg-red-500/80 text-white p-6 rounded-xl shadow-lg">
                    <p class="text-sm font-medium opacity-80">Up for Renewal (90 Days)</p>
                    <p id="renewal-due-card" class="text-4xl font-bold">0</p>
                </div>
                <div class="bg-green-500/80 text-white p-6 rounded-xl shadow-lg">
                    <p class="text-sm font-medium opacity-80">Total Gift Amount</p>
                    <p id="total-gifts-card" class="text-4xl font-bold">$0</p>
                </div>
                <div class="bg-purple-500/80 text-white p-6 rounded-xl shadow-lg">
                    <p class="text-sm font-medium opacity-80">Volunteer Value</p>
                    <p id="volunteer-value-card" class="text-4xl font-bold">$0</p>
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="bg-gray-800 p-6 rounded-xl shadow-lg"><canvas id="gift-amounts-chart"></canvas></div>
                <div class="bg-gray-800 p-6 rounded-xl shadow-lg"><canvas id="volunteer-hours-chart"></canvas></div>
            </div>
            <div class="bg-gray-800 p-6 rounded-xl shadow-lg mt-8"><canvas id="enrollment-history-chart" style="height: 300px;"></canvas></div>
        </div>
    `;
}

function MemberManagement({ memberFilters, setMemberFilters }) {
    // FIX: Added logic to handle filtering and searching on the member management page.
    setTimeout(() => {
        const affiliationFilter = document.getElementById('member-affiliation-filter');
        const statusFilter = document.getElementById('member-status-filter');
        const typeFilter = document.getElementById('member-type-filter');
        const searchInput = document.getElementById('searchInput');

        const handleFilterChange = () => {
            setMemberFilters({
                affiliation: affiliationFilter.value,
                status: statusFilter.value,
                type: typeFilter.value,
                search: searchInput.value
            });
        };

        affiliationFilter.onchange = handleFilterChange;
        statusFilter.onchange = handleFilterChange;
        typeFilter.onchange = handleFilterChange;
        searchInput.oninput = handleFilterChange;
    }, 0);

    let filteredMembers = allMembersData;
    if (memberFilters.affiliation !== 'All') {
        filteredMembers = filteredMembers.filter(m => m.affiliation === memberFilters.affiliation);
    }
    if (memberFilters.status !== 'All') {
        filteredMembers = filteredMembers.filter(m => m.status === memberFilters.status);
    }
    if (memberFilters.type !== 'All') {
        filteredMembers = filteredMembers.filter(m => m.type === memberFilters.type);
    }
    if (memberFilters.search) {
        filteredMembers = filteredMembers.filter(m => m.name.toLowerCase().includes(memberFilters.search.toLowerCase()));
    }

    return `
        <div id="member-management-view">
            <div class="flex flex-wrap justify-between items-center mb-4 gap-4">
                 <h2 class="text-xl font-semibold text-white w-full sm:w-auto">All Members</h2>
                 <div class="flex flex-wrap items-center space-x-4">
                    <select id="member-affiliation-filter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="All">All Groups</option>
                        ${affiliations.map(a => `<option value="${a}" ${memberFilters.affiliation === a ? 'selected' : ''}>${a}</option>`).join('')}
                    </select>
                    <select id="member-status-filter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="All">All Statuses</option>
                        ${memberStatuses.map(s => `<option value="${s}" ${memberFilters.status === s ? 'selected' : ''}>${s}</option>`).join('')}
                    </select>
                     <select id="member-type-filter" class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="All">All Types</option>
                        ${memberTypes.map(t => `<option value="${t}" ${memberFilters.type === t ? 'selected' : ''}>${t}</option>`).join('')}
                    </select>
                    <input type="text" id="searchInput" placeholder="Search members..." class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" value="${memberFilters.search}">
                    <button id="add-member-btn" class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover">Add Member</button>
                 </div>
            </div>
            <div class="bg-gray-800 shadow-lg rounded-xl overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-700">
                    <thead class="bg-gray-900/50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Join Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Renewal Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
                            <th class="relative px-6 py-3"><span class="sr-only">Edit</span></th>
                        </tr>
                    </thead>
                    <tbody id="member-table-body" class="bg-gray-800 divide-y divide-gray-700">
                        ${filteredMembers.map(member => `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">${member.name}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${member.joinDate}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${member.renewalDate}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${member.status}</span></td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${member.type}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><a href="#" class="text-primary hover:text-primary-hover">Edit</a></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function Renewals() {
    setTimeout(() => {
        const affiliationFilter = document.getElementById('renewal-affiliation-filter');
        const rangeFilter = document.getElementById('renewal-range-filter');
        const tableBody = document.getElementById('renewals-table-body');

        function populateRenewalsTable() {
            if (!tableBody) return;

            const selectedAffiliation = affiliationFilter.value;
            const selectedRange = parseInt(rangeFilter.value, 10);
            const today = new Date();
            const limitDate = new Date();
            limitDate.setDate(today.getDate() + selectedRange);

            const upcomingRenewals = allMembersData.filter(member => {
                const renewalDate = new Date(member.renewalDate);
                const isAffiliationMatch = selectedAffiliation === 'All Affiliations' || member.affiliation === selectedAffiliation;
                return renewalDate >= today && renewalDate <= limitDate && isAffiliationMatch;
            });

            upcomingRenewals.sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate));

            if (upcomingRenewals.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-gray-400">No upcoming renewals in this timeframe.</td></tr>`;
                return;
            }

            tableBody.innerHTML = upcomingRenewals.map(member => {
                const renewalDate = new Date(member.renewalDate);
                const diffTime = renewalDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return `
                    <tr class="hover:bg-gray-700/50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">${member.name}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${member.affiliation}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${member.renewalDate}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold ${diffDays < 30 ? 'text-red-400' : 'text-yellow-400'}">${diffDays}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">N/A</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button class="text-primary hover:text-primary-hover">Contact</button>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        affiliationFilter.addEventListener('change', populateRenewalsTable);
        rangeFilter.addEventListener('change', populateRenewalsTable);

        populateRenewalsTable();
    }, 0);

    return `
        <div id="renewals-view">
            <div class="bg-gray-800 p-4 rounded-xl shadow-lg mb-6 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div>
                        <label for="renewal-affiliation-filter" class="text-sm font-medium text-gray-300">Affiliation:</label>
                        <select id="renewal-affiliation-filter" class="mt-1 block w-full pl-3 pr-10 py-2 bg-gray-700 border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                            <option>All Affiliations</option>
                            ${affiliations.map(a => `<option>${a}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label for="renewal-range-filter" class="text-sm font-medium text-gray-300">Timeframe:</label>
                        <select id="renewal-range-filter" class="mt-1 block w-full pl-3 pr-10 py-2 bg-gray-700 border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                            <option value="30">Next 30 Days</option>
                            <option value="60">Next 60 Days</option>
                            <option value="90" selected>Next 90 Days</option>
                        </select>
                    </div>
                </div>
                <button id="contact-all-btn" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Contact All</button>
            </div>
            <div class="bg-gray-800 shadow-lg rounded-xl overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-700">
                    <thead class="bg-gray-900/50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Affiliation</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Renewal Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Days Until Due</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Last Contacted</th>
                            <th class="relative px-6 py-3"><span class="sr-only">Contact</span></th>
                        </tr>
                    </thead>
                    <tbody id="renewals-table-body" class="bg-gray-800 divide-y divide-gray-700"></tbody>
                </table>
            </div>
        </div>
    `;
}

// --- Data & Chart Logic ---
function getFilteredData(selectedAffiliations) {
    if (selectedAffiliations.includes('All Groups')) {
        return allMembersData;
    }
    return allMembersData.filter(member => selectedAffiliations.includes(member.affiliation));
}

function updateDashboardCards(selectedAffiliations) {
    const data = getFilteredData(selectedAffiliations);
    const totalMembers = data.length;
    const totalGifts = data.reduce((sum, m) => sum + (m.giftAmount || 0), 0);
    const totalVolunteerHours = data.reduce((sum, m) => sum + (m.volunteerHours || 0), 0);
    const volunteerValue = totalVolunteerHours * 29.95;

    const today = new Date();
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(today.getDate() + 90);
    const renewalDue = data.filter(m => {
        const renewalDate = new Date(m.renewalDate);
        return renewalDate >= today && renewalDate <= ninetyDaysFromNow;
    }).length;

    document.getElementById('total-members-card').textContent = totalMembers;
    document.getElementById('renewal-due-card').textContent = renewalDue;
    document.getElementById('total-gifts-card').textContent = `$${Math.round(totalGifts).toLocaleString()}`;
    document.getElementById('volunteer-value-card').textContent = `$${Math.round(volunteerValue).toLocaleString()}`;
}

function createChart(canvasId, type, data, options) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    if (chartInstances[canvasId]) chartInstances[canvasId].destroy();
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, { type, data, options });
    chartInstances[canvasId] = chart;
    return chart;
}

function handleChartClick(chart, elements) {
    if (elements.length === 0) return;

    const element = elements[0];
    let affiliation;

    if (chart.config.type === 'line') {
        affiliation = chart.data.datasets[element.datasetIndex].label;
    } else {
        affiliation = chart.data.labels[element.index];
    }
    
    const membersInGroup = allMembersData.filter(m => m.affiliation === affiliation);
    const modalTitle = `Members in ${affiliation}`;
    const modalContent = `
        <ul class="space-y-2">
            ${membersInGroup.map(m => `<li class="text-gray-300">${m.name}</li>`).join('')}
        </ul>
    `;

    if (window.parent && window.parent.showAppModal) {
        window.parent.showAppModal(modalTitle, modalContent);
    } else {
        console.error("Modal function not available on parent window.");
    }
}

function createGiftAmountsChart() {
    const data = {
        labels: affiliations,
        datasets: [{
            label: 'Total Gift Amount',
            data: affiliations.map(aff => allMembersData.filter(m => m.affiliation === aff).reduce((sum, m) => sum + (m.giftAmount || 0), 0)),
            backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'],
        }]
    };
    const options = { 
        responsive: true, 
        plugins: { 
            legend: { display: false },
            title: { display: true, text: 'Affinity Group Giving', color: '#E5E7EB', font: { size: 18 } }
        }, 
        scales: { x: { ticks: { color: '#9CA3AF' } }, y: { ticks: { color: '#9CA3AF' } } },
        onClick: (event, elements) => {
            const chart = chartInstances['gift-amounts-chart'];
            if (chart) handleChartClick(chart, elements);
        }
    };
    createChart('gift-amounts-chart', 'bar', data, options);
}

function createVolunteerHoursChart() {
    const data = {
        labels: affiliations,
        datasets: [{
            label: 'Volunteer Hours',
            data: affiliations.map(aff => allMembersData.filter(m => m.affiliation === aff).reduce((sum, m) => sum + (m.volunteerHours || 0), 0)),
            backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'],
            hoverOffset: 4
        }]
    };
    const options = { 
        responsive: true, 
        maintainAspectRatio: false,
        plugins: { 
            legend: { 
                position: 'right',
                labels: { color: '#9CA3AF' },
                align: 'start'
            },
            title: { display: true, text: 'Affinity Group Volunteering', color: '#E5E7EB', font: { size: 18 } }
        },
        onClick: (event, elements) => {
            const chart = chartInstances['volunteer-hours-chart'];
            if (chart) handleChartClick(chart, elements);
        }
    };
    createChart('volunteer-hours-chart', 'doughnut', data, options);
}

function createEnrollmentHistoryChart() {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);
    const datasets = affiliations.map((aff, index) => ({
        label: aff,
        data: years.map(year => allMembersData.filter(m => m.affiliation === aff && new Date(m.joinDate).getFullYear() <= year).length),
        borderColor: ['#4F46E5', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'][index],
        backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'][index] + '33',
        fill: true,
        tension: 0.4
    }));
    const options = { 
        responsive: true, 
        maintainAspectRatio: false, 
        scales: { y: { beginAtZero: true, ticks: { color: '#9CA3AF' } }, x: { ticks: { color: '#9CA3AF' } } }, 
        plugins: { 
            legend: { labels: { color: '#9CA3AF' } },
            title: { display: true, text: 'Affinity Group Enrollment History', color: '#E5E7EB', font: { size: 18 } }
        },
        onClick: (event, elements) => {
            const chart = chartInstances['enrollment-history-chart'];
            if (chart) handleChartClick(chart, elements);
        }
    };
    createChart('enrollment-history-chart', 'line', { labels: years, datasets }, options);
}

// --- App Rendering & State Management ---
function renderApp() {
    React.resetState();
    const appContainer = document.getElementById('app');
    if (appContainer) {
        appContainer.innerHTML = App();
    }
}

// --- Initial Render ---
document.addEventListener('DOMContentLoaded', async () => {
    renderApp(); // Initial render with the loading spinner
    await initializeLocalData(); // Fetch local data
    renderApp(); // Re-render the app with the data
});
