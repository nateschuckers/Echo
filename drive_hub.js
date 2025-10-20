document.addEventListener('DOMContentLoaded', function() {
    // --- DATA ---
    let supplyItems = [];
    let organizations = [];
    let agencies = [];
    let allDonations = [];
    let allDistributions = [];

    // --- STATE ---
    let inventorySort = { column: 'name', direction: 'asc' };
    let gaugeViewMode = 'stock'; // 'stock' or 'donated'

    // --- HELPER FUNCTIONS ---
    const formatCurrency = (amount) => `$${Number(amount).toFixed(2)}`;
    const generateId = () => `id_${Math.random().toString(36).substr(2, 9)}`;

    // --- Toast Notification ---
    const toastEl = document.getElementById('toast-notification');
    const showToast = (message) => {
        toastEl.textContent = message;
        toastEl.classList.remove('opacity-0', 'translate-x-[120%]');
        setTimeout(() => {
            toastEl.classList.add('opacity-0', 'translate-x-[120%]');
        }, 3000);
    };

    // --- Page Navigation ---
    const dashboardPage = document.getElementById('dashboardPage');
    const dataEntryPage = document.getElementById('dataEntryPage');
    const dashboardTab = document.getElementById('dashboardTab');
    const dataEntryTab = document.getElementById('dataEntryTab');

    const switchTab = (tab) => {
        if (tab === 'dashboard') {
            dashboardPage.classList.remove('hidden');
            dataEntryPage.classList.add('hidden');
            dashboardTab.classList.add('border-primary', 'text-primary');
            dashboardTab.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200');
            dataEntryTab.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200');
            dataEntryTab.classList.remove('border-primary', 'text-primary');
        } else {
            dataEntryPage.classList.remove('hidden');
            dashboardPage.classList.add('hidden');
            dataEntryTab.classList.add('border-primary', 'text-primary');
            dataEntryTab.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200');
            dashboardTab.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200');
            dashboardTab.classList.remove('border-primary', 'text-primary');
        }
    };
    dashboardTab.addEventListener('click', () => switchTab('dashboard'));
    dataEntryTab.addEventListener('click', () => switchTab('dataEntry'));

    // --- RENDER FUNCTIONS ---
    const renderAll = () => {
        renderSupplyItems();
        renderOrganizations();
        renderAgencies();
        updateDashboardAndReports();
    };

    const renderSupplyItems = () => {
        const listEl = document.getElementById('supplyItemsList'),
            donationSelect = document.getElementById('donationItem'),
            distSelect = document.getElementById('distributionItem'),
            combinedItemFilterSelect = document.getElementById('combinedItemFilter');
        listEl.innerHTML = '', donationSelect.innerHTML = '<option value="">Select an item...</option>', distSelect.innerHTML = '<option value="">Select an item...</option>', combinedItemFilterSelect.innerHTML = '<option value="all">All Items</option>';
        if (supplyItems.length > 0) {
            const table = document.createElement('table');
            table.className = 'w-full text-sm text-left text-gray-500 dark:text-gray-400';
            table.innerHTML = `<thead class="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700/50"><tr><th class="px-2 py-2">Item</th><th class="px-2 py-2">Value</th></tr></thead><tbody></tbody>`;
            const tbody = table.querySelector('tbody');
            supplyItems.forEach(item => {
                tbody.insertRow().innerHTML = `<td class="px-2 py-1">${item.name}</td><td class="px-2 py-1">${formatCurrency(item.value)}</td>`;
                const option = new Option(`${item.name} (${formatCurrency(item.value)})`, item.id);
                donationSelect.add(option);
                distSelect.add(option.cloneNode(true));
                combinedItemFilterSelect.add(new Option(item.name, item.id));
            });
            listEl.appendChild(table);
        } else listEl.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-sm">No supply items added yet.</p>';
    };
    const renderOrganizations = () => {
        const selectEl = document.getElementById('donationOrganization');
        selectEl.innerHTML = '<option value="">Select an organization...</option>';
        organizations.forEach(org => selectEl.add(new Option(org.name, org.id)));
    };
    const renderAgencies = () => {
        const selectEl = document.getElementById('distributionAgency');
        selectEl.innerHTML = '<option value="">Select an agency...</option>';
        agencies.forEach(agency => selectEl.add(new Option(agency.name, agency.id)));
    };
    const createLogEntry = (groupedData, logEl, colorClass, darkColorClass) => {
        logEl.innerHTML = '';
        Object.entries(groupedData).forEach(([name, data]) => {
            const div = document.createElement('div');
            div.className = 'mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg';
            div.innerHTML = `<h4 class="font-semibold text-gray-700 dark:text-gray-200">${name} - <span class="font-bold text-${colorClass} dark:text-${darkColorClass}">${formatCurrency(data.total)}</span></h4>`;
            const ul = document.createElement('ul');
            ul.className = 'list-disc list-inside text-gray-600 dark:text-gray-400 text-sm mt-1';
            data.items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.quantity} x ${item.itemName} (${formatCurrency(item.totalValue)})`;
                ul.appendChild(li);
            });
            div.appendChild(ul);
            logEl.appendChild(div);
        });
    };
    const renderDonationsLog = () => {
        const logEl = document.getElementById('donationsLog');
        if (!allDonations.length) { logEl.innerHTML = '<p class="text-gray-500 dark:text-gray-400">No donations logged yet.</p>'; return; }
        const grouped = allDonations.reduce((acc, curr) => {
            acc[curr.orgName] = acc[curr.orgName] || { items: [], total: 0 };
            acc[curr.orgName].items.push(curr);
            acc[curr.orgName].total += curr.totalValue; return acc;
        }, {});
        createLogEntry(grouped, logEl, 'blue-600', 'blue-500');
    };
    const renderDistributionsLog = () => {
        const logEl = document.getElementById('distributionsLog');
        if (!allDistributions.length) { logEl.innerHTML = '<p class="text-gray-500 dark:text-gray-400">No distributions logged yet.</p>'; return; }
        const grouped = allDistributions.reduce((acc, curr) => {
            acc[curr.agencyName] = acc[curr.agencyName] || { items: [], total: 0 };
            acc[curr.agencyName].items.push(curr);
            acc[curr.agencyName].total += curr.totalValue; return acc;
        }, {});
        createLogEntry(grouped, logEl, 'emerald-600', 'emerald-500');
    };

    const updateDashboardAndReports = () => {
        const totalDonatedValue = allDonations.reduce((s, d) => s + d.totalValue, 0);
        const totalItemsDonated = allDonations.reduce((s, d) => s + d.quantity, 0);
        const totalDistributedValue = allDistributions.reduce((s, d) => s + d.totalValue, 0);
        const totalItemsDistributed = allDistributions.reduce((s, d) => s + d.quantity, 0);
        
        document.getElementById('totalDonatedValue').textContent = formatCurrency(totalDonatedValue);
        document.getElementById('totalItemsDonated').textContent = totalItemsDonated.toLocaleString();
        document.getElementById('totalDistributedValue').textContent = formatCurrency(totalDistributedValue);
        document.getElementById('totalItemsDistributed').textContent = totalItemsDistributed.toLocaleString();
        document.getElementById('currentInventoryValue').textContent = formatCurrency(totalDonatedValue - totalDistributedValue);
        
        renderInventorySummary();
        renderInventoryTable();
        renderTopDonors();
        renderTopDistributions();
        renderCombinedReportTable();
        renderDonationsLog();
        renderDistributionsLog();
    };

    const renderInventorySummary = () => {
        const container = document.getElementById('inventoryGauges');
        if (!container) return;
        const colors = ['#4338ca', '#16a34a', '#f59e0b', '#dc2626', '#2563eb', '#9333ea'];

        const summary = {};
        supplyItems.forEach(item => {
            summary[item.id] = { name: item.name, donated: 0, distributed: 0 };
        });
        allDonations.forEach(d => { if (summary[d.itemId]) summary[d.itemId].donated += d.quantity; });
        allDistributions.forEach(d => { if (summary[d.itemId]) summary[d.itemId].distributed += d.quantity; });

        const itemsWithActivity = Object.values(summary).filter(item => item.donated > 0 || item.distributed > 0);

        if (itemsWithActivity.length === 0) {
            container.innerHTML = '<p class="text-gray-500 dark:text-gray-400">No item activity to summarize yet.</p>';
            return;
        }

        container.innerHTML = itemsWithActivity.map((item, index) => {
            const { name, donated, distributed } = item;
            const inventory = donated - distributed;
            const percent = donated > 0 ? (inventory / donated) : 0;
            const color = colors[index % colors.length];

            const gaugeSize = 130;
            const strokeWidth = 12;
            const radius = (gaugeSize / 2) - strokeWidth;
            const circumference = radius * 2 * Math.PI;
            const offset = circumference - percent * circumference;
            
            let mainText, subText;
            if (gaugeViewMode === 'stock') {
                mainText = `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" class="text-3xl font-bold" style="fill: ${color};">${Math.round(percent * 100)}%</text>`;
                subText = `<text x="50%" y="50%" dy="20" text-anchor="middle" class="text-xs fill-current text-gray-500 dark:text-gray-400">${inventory} in stock</text>`;
            } else { // 'donated' mode
                mainText = `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" class="text-3xl font-bold" style="fill: ${color};">${donated}</text>`;
                subText = `<text x="50%" y="50%" dy="20" text-anchor="middle" class="text-xs fill-current text-gray-500 dark:text-gray-400">donated</text>`;
            }

            return `
                <div class="flex flex-col items-center" title="Donated: ${donated} | Distributed: ${distributed}">
                    <svg class="w-[${gaugeSize}px] h-[${gaugeSize}px]">
                        <circle class="gauge-bg" r="${radius}" cx="${gaugeSize/2}" cy="${gaugeSize/2}"></circle>
                        <circle class="gauge-fg" r="${radius}" cx="${gaugeSize/2}" cy="${gaugeSize/2}"
                            stroke-dasharray="${circumference}"
                            style="stroke-dashoffset: ${offset}; stroke: ${color};"></circle>
                        ${mainText}
                        ${subText}
                    </svg>
                    <h4 class="font-semibold text-gray-800 dark:text-gray-200 mt-2 text-center">${name}</h4>
                </div>
            `;
        }).join('');
    };

    const renderInventoryTable = () => {
        const tbody = document.getElementById('inventoryTableBody');
        if (!tbody) return;

        const summary = {};
        supplyItems.forEach(item => { summary[item.id] = { name: item.name, donated: 0, distributed: 0, stock: 0 }; });
        allDonations.forEach(d => { if (summary[d.itemId]) summary[d.itemId].donated += d.quantity; });
        allDistributions.forEach(d => { if (summary[d.itemId]) summary[d.itemId].distributed += d.quantity; });
        
        let inventoryList = Object.values(summary).map(item => ({...item, stock: item.donated - item.distributed}));

        inventoryList.sort((a, b) => {
            const valA = a[inventorySort.column];
            const valB = b[inventorySort.column];
            let comparison = 0;
            if (typeof valA === 'string') {
                comparison = valA.localeCompare(valB);
            } else {
                comparison = valA - valB;
            }
            return inventorySort.direction === 'asc' ? comparison : -comparison;
        });
        
        if (inventoryList.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center text-gray-500 dark:text-gray-400 py-4">No items to display.</td></tr>`;
            return;
        }

        tbody.innerHTML = inventoryList.map(item => `
            <tr>
                <td class="td font-medium text-gray-900 dark:text-gray-100">${item.name}</td>
                <td class="td">${item.donated}</td>
                <td class="td">${item.distributed}</td>
                <td class="td font-bold text-primary">${item.stock}</td>
            </tr>
        `).join('');
    };
    
    const renderTopDonors = () => {
        const listEl = document.getElementById('topDonorsList');
        if (!allDonations.length) { listEl.innerHTML = '<p class="text-gray-500 dark:text-gray-400">No donations to report.</p>'; return; }
        const grouped = allDonations.reduce((acc, curr) => {
            acc[curr.orgName] = (acc[curr.orgName] || 0) + curr.totalValue;
            return acc;
        }, {});
        const sorted = Object.entries(grouped).sort(([, a], [, b]) => b - a);
        listEl.innerHTML = sorted.map(([name, total], i) => `
            <div class="flex justify-between items-center p-2 ${i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/50' : ''} rounded">
                <span class="font-medium text-gray-700 dark:text-gray-300">${i + 1}. ${name}</span>
                <span class="font-bold text-primary">${formatCurrency(total)}</span>
            </div>
        `).join('');
    };
    
    const renderTopDistributions = () => {
        const listEl = document.getElementById('recipientDistributionsList');
        if (!allDistributions.length) { listEl.innerHTML = '<p class="text-gray-500 dark:text-gray-400">No distributions to report.</p>'; return; }
        const grouped = allDistributions.reduce((acc, curr) => {
            acc[curr.agencyName] = (acc[curr.agencyName] || 0) + curr.totalValue;
            return acc;
        }, {});
        const sorted = Object.entries(grouped).sort(([, a], [, b]) => b - a);
        listEl.innerHTML = sorted.map(([name, total], i) => `
             <div class="flex justify-between items-center p-2 ${i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/50' : ''} rounded">
                <span class="font-medium text-gray-700 dark:text-gray-300">${i + 1}. ${name}</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-500">${formatCurrency(total)}</span>
            </div>
        `).join('');
    };

    const renderCombinedReportTable = () => {
        const isDistributions = document.getElementById('reportToggle').checked;
        const itemFilter = document.getElementById('combinedItemFilter').value;
        const sorter = document.getElementById('combinedSorter');
        const thead = document.getElementById('combinedReportThead');
        const tbody = document.getElementById('combinedReportTbody');
        const title = document.getElementById('reportTitle');

        if (isDistributions) {
            title.textContent = 'Distribution Details Report';
            thead.innerHTML = `<tr><th class="th">Agency</th><th class="th">Item</th><th class="th">Quantity</th><th class="th">Value</th><th class="th">Date</th></tr>`;
            if (sorter.options.length === 0 || sorter.options[1].value !== 'agency-asc') {
                sorter.innerHTML = `<option value="date-desc">Date (Newest)</option><option value="agency-asc">Agency (A-Z)</option><option value="qty-desc">Quantity (High-Low)</option><option value="val-desc">Value (High-Low)</option>`;
            }
        } else {
            title.textContent = 'Donation Details Report';
            thead.innerHTML = `<tr><th class="th">Organization</th><th class="th">Item</th><th class="th">Quantity</th><th class="th">Value</th><th class="th">Date</th></tr>`;
            if (sorter.options.length === 0 || sorter.options[1].value !== 'org-asc') {
                sorter.innerHTML = `<option value="date-desc">Date (Newest)</option><option value="org-asc">Organization (A-Z)</option><option value="qty-desc">Quantity (High-Low)</option><option value="val-desc">Value (High-Low)</option>`;
            }
        }

        const data = isDistributions ? allDistributions : allDonations;
        let filteredData = data;
        if (itemFilter !== 'all') {
            filteredData = data.filter(d => d.itemId === itemFilter);
        }

        const sortedData = [...filteredData].sort((a, b) => {
            switch (sorter.value) {
                case 'org-asc': return a.orgName.localeCompare(b.orgName);
                case 'agency-asc': return a.agencyName.localeCompare(b.agencyName);
                case 'qty-desc': return b.quantity - a.quantity;
                case 'val-desc': return b.totalValue - a.totalValue;
                default: return b.timestamp - a.timestamp;
            }
        });

        if (sortedData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-gray-500 dark:text-gray-400 py-4">No data matches the current filter.</td></tr>`;
            return;
        }

        tbody.innerHTML = sortedData.map(d => {
            const primaryName = isDistributions ? d.agencyName : d.orgName;
            return `
                <tr>
                    <td class="td font-medium text-gray-900 dark:text-gray-100">${primaryName}</td>
                    <td class="td">${d.itemName}</td>
                    <td class="td">${d.quantity}</td>
                    <td class="td">${formatCurrency(d.totalValue)}</td>
                    <td class="td">${new Date(d.timestamp).toLocaleDateString()}</td>
                </tr>`;
        }).join('');
    };

    // --- FORM SUBMISSIONS ---
    document.getElementById('addItemForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('itemName').value, value = parseFloat(document.getElementById('itemValue').value);
        if(name && value > 0) { 
            supplyItems.push({id: generateId(), name, value});
            e.target.reset(); 
            showToast("Item added successfully!");
            renderAll();
        }
    });
    document.getElementById('addDonationForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const orgId = document.getElementById('donationOrganization').value, itemId = document.getElementById('donationItem').value, quantity = parseInt(document.getElementById('donationQuantity').value);
        if(!orgId || !itemId || !quantity) { showToast("Please fill out all donation fields."); return; }
        const org = organizations.find(o=>o.id===orgId), item = supplyItems.find(i=>i.id===itemId);
        allDonations.push({ id: generateId(), orgId, orgName:org.name, itemId, itemName:item.name, quantity, itemValue:item.value, totalValue:item.value*quantity, timestamp:Date.now() });
        e.target.reset(); document.getElementById('donationQuantity').value=1; showToast("Donation logged!");
        updateDashboardAndReports();
    });
    document.getElementById('addDistributionForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const agencyId = document.getElementById('distributionAgency').value, itemId = document.getElementById('distributionItem').value, quantity = parseInt(document.getElementById('distributionQuantity').value);
        if(!agencyId || !itemId || !quantity) { showToast("Please fill out all distribution fields."); return; }
        const agency = agencies.find(a=>a.id===agencyId), item = supplyItems.find(i=>i.id===itemId);
        allDistributions.push({ id: generateId(), agencyId, agencyName:agency.name, itemId, itemName:item.name, quantity, itemValue:item.value, totalValue:item.value*quantity, timestamp:Date.now() });
        e.target.reset(); document.getElementById('distributionQuantity').value=1; showToast("Distribution logged!");
        updateDashboardAndReports();
    });

    // --- Collapsible Section ---
    document.getElementById('manageItemsHeader').addEventListener('click', () => {
        document.getElementById('manageItemsContent').classList.toggle('hidden');
        document.getElementById('manageItemsToggleIcon').classList.toggle('rotate-180');
    });

    // --- REPORTING CONTROLS ---
    document.getElementById('reportToggle').addEventListener('change', renderCombinedReportTable);
    document.getElementById('combinedItemFilter').addEventListener('change', renderCombinedReportTable);
    document.getElementById('combinedSorter').addEventListener('change', renderCombinedReportTable);
    document.getElementById('gaugeToggle').addEventListener('change', (e) => {
        gaugeViewMode = e.target.checked ? 'donated' : 'stock';
        renderInventorySummary();
    });
    
    document.querySelectorAll('.sortable-header').forEach(header => {
        header.addEventListener('click', () => {
            const sortKey = header.dataset.sort;
            if (inventorySort.column === sortKey) {
                inventorySort.direction = inventorySort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                inventorySort.column = sortKey;
                inventorySort.direction = sortKey === 'name' ? 'asc' : 'desc';
            }
            renderInventoryTable();
        });
    });
    
    // --- SEED DATA ---
    const seedTestData = () => {
        supplyItems = [
            { id: 'item1', name: 'Laptop', value: 800 },
            { id: 'item2', name: 'Winter Coat', value: 75 },
            { id: 'item3', name: 'Hygiene Kit', value: 15 },
            { id: 'item4', name: 'Canned Goods (Box)', value: 40 },
            { id: 'item5', name: 'School Supplies Kit', value: 25 }
        ];
        organizations = [
            { id: 'org1', name: 'Tech Solutions Inc.' },
            { id: 'org2', name: 'Global Logistics Group' }
        ];
        agencies = [
            { id: 'ag1', name: 'New Horizons Youth Center' },
            { id: 'ag2', name: 'Community Food Bank' }
        ];
        allDonations = [
            { id: generateId(), orgId: 'org1', orgName: 'Tech Solutions Inc.', itemId: 'item1', itemName: 'Laptop', quantity: 10, itemValue: 800, totalValue: 8000, timestamp: Date.now() - 200000 },
            { id: generateId(), orgId: 'org1', orgName: 'Tech Solutions Inc.', itemId: 'item5', itemName: 'School Supplies Kit', quantity: 22, itemValue: 25, totalValue: 550, timestamp: Date.now() - 190000 },
            { id: generateId(), orgId: 'org2', name: 'Global Logistics Group', itemId: 'item2', itemName: 'Winter Coat', quantity: 100, itemValue: 75, totalValue: 7500, timestamp: Date.now() - 180000 },
            { id: generateId(), orgId: 'org2', orgName: 'Global Logistics Group', itemId: 'item4', itemName: 'Canned Goods (Box)', quantity: 100, itemValue: 40, totalValue: 4000, timestamp: Date.now() - 170000 },
             { id: generateId(), orgId: 'org2', orgName: 'Global Logistics Group', itemId: 'item3', itemName: 'Hygiene Kit', quantity: 100, itemValue: 15, totalValue: 1500, timestamp: Date.now() - 160000 }
        ];
        allDistributions = [
            { id: generateId(), agencyId: 'ag1', agencyName: 'New Horizons Youth Center', itemId: 'item1', itemName: 'Laptop', quantity: 8, itemValue: 800, totalValue: 6400, timestamp: Date.now() - 100000 },
            { id: generateId(), agencyId: 'ag1', agencyName: 'New Horizons Youth Center', itemId: 'item5', itemName: 'School Supplies Kit', quantity: 20, itemValue: 25, totalValue: 500, timestamp: Date.now() - 90000 },
            { id: generateId(), agencyId: 'ag2', agencyName: 'Community Food Bank', itemId: 'item4', itemName: 'Canned Goods (Box)', quantity: 75, itemValue: 40, totalValue: 3000, timestamp: Date.now() - 80000 },
            { id: generateId(), agencyId: 'ag2', agencyName: 'Community Food Bank', itemId: 'item2', itemName: 'Winter Coat', quantity: 50, itemValue: 75, totalValue: 3750, timestamp: Date.now() - 70000 },
            { id: generateId(), agencyId: 'ag1', agencyName: 'New Horizons Youth Center', itemId: 'item3', itemName: 'Hygiene Kit', quantity: 20, itemValue: 15, totalValue: 300, timestamp: Date.now() - 60000 }
        ];
        
        console.log("Test data loaded.");
        renderAll();
    };

    // --- INITIALIZATION ---
    seedTestData();
});

