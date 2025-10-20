/**
 * This script initializes the account profile component, handles tab switching,
 * and renders all dynamic data for the selected account.
 * It uses a robust event delegation pattern to handle all clicks within the main
 * container.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Main container for the entire profile page
    const accountProfileContainer = document.getElementById('account-profile-container');
    if (!accountProfileContainer) {
        console.error('CRITICAL ERROR: Main container "#account-profile-container" not found.');
        return;
    }
    
    // --- MOCK DATA ---
    // This object holds all the sample data for different accounts.
    const organizationAccountData = {
        "Tech Solutions Inc.": {
            id: 2, name: 'Tech Solutions Inc.', industry: 'Technology',
            email: 'contact@techsolutions.inc', phone: '555-987-6543', address: '789 Tech Park, Anytown, CA 12345',
            website: 'www.techsolutions.inc',
            userDefined: { 'Account Manager': 'John Doe', 'Fiscal Year End': 'December 31' },
            details: { 'Contact Roles': 'Corporate Partner, Workplace Campaign', 'Sub-Type': 'Corporation' },
            contacts: [
                { name: 'Alex Doe', role: 'Primary Contact', email: 'alex.doe@example.com' },
                { name: 'HR Department', role: 'Workplace Campaign Lead', email: 'hr@techsolutions.inc' }
            ],
            transactions: [
                { 
                    id: 101, campaign: '2025 Workplace Campaign', amount: 15000.00, paid: 7500.00, date: '2025-09-01', 
                    designations: [{agency: 'RUM', amount: 10000}, {agency: 'Community Shelter', amount: 5000}], 
                    recurring: null,
                    documents: [
                        { id: 'doc1', name: '2025 Pledge Form.pdf', content: 'This is the content of the 2025 pledge form PDF.' },
                        { id: 'doc2', name: 'Thank You Letter - 2025.pdf', content: 'Dear Tech Solutions Inc., thank you for your generous pledge...' }
                    ],
                    auditLog: [
                        { user: 'Alex Doe', action: 'Pledge Created via Corporate Portal', date: '2025-09-01', icon: 'fa-plus', color: 'bg-blue-500' },
                        { user: 'System', action: 'Payment of $7,500.00 Received (Payroll Deduction)', date: '2025-09-15', icon: 'fa-credit-card', color: 'bg-green-500' },
                        { user: 'Jane Smith (Dev)', action: 'Thank You Letter Sent', date: '2025-09-16', icon: 'fa-paper-plane', color: 'bg-purple-500' },
                    ]
                },
                { 
                    id: 102, campaign: '2024 Workplace Campaign', amount: 12500.00, paid: 12500.00, date: '2024-09-01', 
                    designations: [{agency: 'RUM', amount: 12500}], 
                    recurring: null,
                    documents: [
                         { id: 'doc3', name: '2024 Pledge Form.pdf', content: 'This is the content of the 2024 pledge form PDF.' }
                    ],
                    auditLog: [
                         { user: 'Alex Doe', action: 'Pledge Created via Corporate Portal', date: '2024-09-01', icon: 'fa-plus', color: 'bg-blue-500' },
                         { user: 'System', action: 'Payment of $12,500.00 Received (Payroll Deduction)', date: '2024-09-15', icon: 'fa-credit-card', color: 'bg-green-500' }
                    ]
                }
            ],
        },
        "Innovate Corp": {
            id: 6, name: 'Innovate Corp', industry: 'Technology',
            email: 'contact@innovate.corp', phone: '555-111-3333', address: '123 Innovation Ave, Techville, CA 90210',
            website: 'www.innovate.corp',
            userDefined: { 'Account Manager': 'Jane Smith' },
            details: { 'Contact Roles': 'Corporate Partner', 'Sub-Type': 'Corporation' },
            contacts: [
                { name: 'Jane Smith', role: 'CEO', email: 'jane.smith@innovate.corp' }
            ],
            transactions: [
                { id: 103, campaign: '2025 Sponsorship', amount: 10000.00, paid: 10000.00, date: '2025-01-20', designations: [], recurring: null, documents: [], auditLog: [] }
            ]
        },
        "Anytown Community Foundation": {
            id: 4, name: 'Anytown Community Foundation', industry: 'Non-Profit',
            email: 'info@anytowncf.org', phone: '555-222-4444', address: '555 Community Plaza, Anytown, CA 12345',
            website: 'www.anytowncf.org',
            userDefined: { 'Grant Cycle': 'Fall' },
            details: { 'Contact Roles': 'Agency, Grantee', 'Sub-Type': 'Foundation' },
            contacts: [
                { name: 'Director of Grants', role: 'Primary Contact', email: 'grants@anytowncf.org' }
            ],
            transactions: []
        }
    };
    
    // --- STATE & RENDER FUNCTIONS ---
    let currentAccountData = {};
    let designationChart = null; 

    const renderers = {
        profile: (container, data) => {
            container.querySelector('#account-initials').innerHTML = `<i class="fa-solid fa-building text-3xl"></i>`;
            container.querySelector('#account-name').textContent = data.name;
            container.querySelector('#account-name + p').textContent = data.industry;
            container.querySelector('#account-name + p + p').classList.add('hidden'); // Hide informal/formal name
            
            const contactHtml = `
                <div class="flex items-center space-x-3"><svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg><span>${data.email}</span></div>
                <div class="flex items-center space-x-3"><svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg><span>${data.phone}</span></div>
                <div class="flex items-center space-x-3"><svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg><span>${data.address}</span></div>
                 <div class="flex items-center space-x-3"><svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0012 13.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 003 12c0 .778.099 1.533.284 2.253m18.132-4.5A11.953 11.953 0 0112 16.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0012 13.5c-2.998 0-5.74-1.1-7.843-2.918" /></svg><span>${data.website || 'N/A'}</span></div>`;
            container.querySelector('#profile-contact-info').innerHTML = contactHtml;

            container.querySelector('.editable-card:nth-child(3) h3').textContent = "Key Contacts";
            const contactsHtml = (data.contacts || []).map(contact => `<div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"><p class="font-semibold">${contact.name}</p><p class="text-sm text-gray-500">${contact.role}</p><p class="text-sm text-primary">${contact.email}</p></div>`).join('');
            container.querySelector('#profile-interests').innerHTML = contactsHtml;

            const userDefinedHtml = Object.entries(data.userDefined).map(([key, value]) => `<div><p class="text-sm text-gray-500">${key}</p><p>${value}</p></div>`).join('');
            container.querySelector('#profile-user-defined').innerHTML = userDefinedHtml;
            
            const detailsHtml = Object.entries(data.details).map(([key, value]) => `<div><p class="text-sm text-gray-500">${key}</p><p>${value ? value : 'N/A'}</p></div>`).join('');
            container.querySelector('#profile-details').innerHTML = detailsHtml;

            container.querySelector('#profile-relationships').closest('.editable-card').classList.add('hidden');
        },
        transactions: (container, data) => {
            const formatCurrency = (amount) => (amount || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
            const transactions = data.transactions || [];
            
            const lifetime = transactions.reduce((sum, t) => sum + t.amount, 0);
            const lastGift = transactions.length > 0 ? transactions[0].amount : 0;
            const largestGift = transactions.reduce((max, t) => Math.max(max, t.amount), 0);
            const firstYear = transactions.length > 0 ? new Date(transactions[transactions.length - 1].date).getFullYear() : '-';
            
            container.querySelector('#lifetime-giving').textContent = formatCurrency(lifetime);
            container.querySelector('#last-gift-amount').textContent = formatCurrency(lastGift);
            container.querySelector('#largest-gift').textContent = formatCurrency(largestGift);
            container.querySelector('#giving-since').textContent = firstYear.toString();

            const transactionsContainer = container.querySelector('#transactions-container');
            if (transactions.length === 0) {
                transactionsContainer.innerHTML = `<div class="text-center py-8 text-gray-500">No transaction history found.</div>`;
                return;
            }
            transactionsContainer.innerHTML = transactions.map(trx => {
                const progress = trx.amount > 0 ? (trx.paid / trx.amount) * 100 : 0;
                
                const documentsHtml = (trx.documents || []).map(doc => `
                    <a href="#" class="transaction-document-link text-primary hover:underline flex items-center text-sm" data-doc-id="${doc.id}" data-doc-title="View Document: ${doc.name}" data-doc-content="${doc.content}">
                        <i class="fa-solid fa-file-pdf mr-2"></i>${doc.name}
                    </a>
                `).join('');

                const auditLogHtml = (trx.auditLog || []).map(log => `
                    <div class="timeline-item">
                        <div class="timeline-icon ${log.color} text-white">
                            <i class="fa-solid ${log.icon}"></i>
                        </div>
                        <div class="timeline-content">
                            <p class="font-semibold text-sm">${log.action}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">By ${log.user} on ${new Date(log.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                `).join('');

                return `
                <div data-transaction-card class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="p-4">
                        <div class="pledge-card-header">
                            <div class="pledge-card-info">
                                <p class="text-sm text-gray-500 dark:text-gray-400">${new Date(trx.date).toLocaleDateString()}</p>
                                <p class="text-md font-semibold">${trx.campaign}</p>
                                <p class="text-2xl font-bold mt-1">${formatCurrency(trx.amount)}</p>
                            </div>
                            <div class="pledge-card-actions">
                                ${trx.designations.length > 0 ? `<button class="designated-button pledge-tag"><i class="fa-solid fa-flag text-primary"></i> Designated</button>` : ''}
                                ${trx.recurring ? `<button class="recurring-button pledge-tag"><i class="fa-solid fa-arrows-rotate text-green-500"></i> Recurring</button>` : ''}
                            </div>
                        </div>
                        <div class="mt-4">
                            <div class="flex justify-between items-center mb-1"><span class="text-sm font-medium">${formatCurrency(trx.paid)} paid</span><span class="text-sm font-bold">${Math.round(progress)}%</span></div>
                            <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5"><div class="h-2.5 rounded-full bg-primary" style="width: ${progress}%;"></div></div>
                        </div>
                        <div class="designation-details hidden">${trx.designations.map(d => `<p>${d.agency}: ${formatCurrency(d.amount)}</p>`).join('')}</div>
                        ${trx.recurring ? `<div class="recurring-details hidden"><p>Frequency: ${trx.recurring.frequency}</p><p>Amount: ${formatCurrency(trx.recurring.amount)}</p><p>Remaining Payments: ${trx.recurring.remaining}</p></div>` : ''}
                    </div>
                    
                    <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-2">
                        <button data-action="toggle-audit" class="text-sm font-semibold text-primary hover:underline flex items-center">
                            View Audit Log <i class="fa-solid fa-chevron-down audit-chevron ml-1.5 transition-transform"></i>
                        </button>
                    </div>
                    <div class="audit-log-container">
                        ${documentsHtml ? `<div class="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600 space-y-2"><h4 class="font-semibold text-sm mb-2">Associated Documents</h4>${documentsHtml}</div>` : ''}
                        <div class="timeline p-4 bg-gray-50 dark:bg-gray-700/50">
                            ${auditLogHtml}
                        </div>
                    </div>
                </div>`;
            }).join('');
        },
        campaign: (container, data) => {
            initGivingChart(container.querySelector('#giving-history-chart'));
            initDesignationChart(container.querySelector('#designation-chart'));
        },
        engagements: (container, data) => {
            // Placeholder for organization engagements
            container.innerHTML = `<div class="text-center p-8 bg-white dark:bg-gray-800 rounded-lg">Engagement data for organizations is not yet available.</div>`;
        },
        communications: (container, data) => {
            // Placeholder for organization communications
             container.innerHTML = `<div class="text-center p-8 bg-white dark:bg-gray-800 rounded-lg">Communications data for organizations is not yet available.</div>`;
        }
    };
    
    function initGivingChart(canvas) {
        if (!canvas) return;
        const isDarkMode = document.documentElement.classList.contains('dark');
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const labelColor = isDarkMode ? '#d1d5db' : '#4b5563';
        const primaryColor = getComputedStyle(document.body).getPropertyValue('--color-primary').trim();
        const gradient = canvas.getContext('2d').createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, `hsl(${primaryColor} / 0.8)`);
        gradient.addColorStop(1, `hsl(${primaryColor} / 0.5)`);
        new Chart(canvas, { type: 'bar', data: { labels: ['2023', '2024', '2025'], datasets: [{ label: 'RUM', data: [800, 1000, 1250], backgroundColor: gradient, borderColor: `hsl(${primaryColor})`, borderWidth: 1, borderRadius: 4 }, { label: 'Other', data: [400, 500, 250], backgroundColor: 'hsl(220, 13%, 69% / 0.5)', borderColor: 'hsl(220, 13%, 69%)', borderWidth: 1, borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, barPercentage: 0.5, categoryPercentage: 0.6, plugins: { legend: { display: false } }, scales: { y: { stacked: true, beginAtZero: true, ticks: { color: labelColor, callback: (value) => '$' + value / 1000 + 'k' }, grid: { color: gridColor } }, x: { stacked: true, ticks: { color: labelColor }, grid: { display: false } } } } });
    }

    function initDesignationChart(canvas, dataType = 'priorYear') {
        if (!canvas) return;
        if(designationChart) { designationChart.destroy(); }
        const isDarkMode = document.documentElement.classList.contains('dark');
        const labelColor = isDarkMode ? '#d1d5db' : '#4b5563';
        const primaryColor = getComputedStyle(document.body).getPropertyValue('--color-primary').trim();
        const backgroundColors = [ `hsl(${primaryColor} / 0.8)`, '#ef4444', '#f97316', '#22c55e', '#6b7280' ];
        const data = {
            priorYear: { labels: ['RUM', 'Anytown Food Bank'], data: [1000, 250] },
            lifetime: { labels: ['RUM', 'Anytown Food Bank', 'Community Shelter', 'Other'], data: [15000, 2250, 1500, 3650] }
        };
        designationChart = new Chart(canvas, { type: 'doughnut', data: { labels: data[dataType].labels, datasets: [{ data: data[dataType].data, backgroundColor: backgroundColors, borderColor: isDarkMode ? '#1f2937' : '#fff', borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'right', labels: { color: labelColor } } } } });
    }

    // --- MAIN LOGIC ---

    function loadTabContent(targetId) {
        const template = document.getElementById(`${targetId}-template`);
        const contentContainer = document.getElementById('profile-tab-content-container');

        if (template && contentContainer) {
            const templateContent = template.content.cloneNode(true);
            
            contentContainer.innerHTML = '';
            contentContainer.appendChild(templateContent);

            if (renderers[targetId]) {
                renderers[targetId](contentContainer, currentAccountData);
            }
        } else {
            console.error(`Template or content container not found for tab: ${targetId}`);
        }
    }
    
    function updateActiveTab(clickedTab) {
        const tabsContainer = document.getElementById('profile-tabs');
        if (!tabsContainer) return;
        tabsContainer.querySelectorAll('.profile-tab').forEach(t => {
            t.classList.remove('border-primary', 'text-primary');
            t.classList.add('border-transparent', 'text-gray-500');
        });
        clickedTab.classList.add('border-primary', 'text-primary');
        clickedTab.classList.remove('border-transparent', 'text-gray-500');
    }

    function initializeComponent() {
        const accountName = sessionStorage.getItem('currentAccountName') || "Tech Solutions Inc.";
        currentAccountData = organizationAccountData[accountName];

        if (!currentAccountData) {
            accountProfileContainer.innerHTML = `<div class="text-center p-8"><h2 class="text-xl font-semibold">Error</h2><p class="text-gray-500">Could not find data for account: ${accountName}</p></div>`;
            return;
        }

        accountProfileContainer.innerHTML = `
            <div>
                <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
                    <nav id="profile-tabs" class="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                        <a href="#profile" class="profile-tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-primary text-primary">Profile</a>
                        <a href="#transactions" class="profile-tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">Transactions</a>
                        <a href="#campaign" class="profile-tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">Campaign</a>
                        <a href="#engagements" class="profile-tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">Engagements</a>
                        <a href="#communications" class="profile-tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">Communications</a>
                    </nav>
                </div>
                <div id="profile-tab-content-container"></div>
            </div>
        `;

        loadTabContent('profile');
    }

    // --- EVENT LISTENERS ---
    accountProfileContainer.addEventListener('click', (e) => {
        const target = e.target;
        
        const clickedTab = target.closest('.profile-tab');
        if (clickedTab) {
            e.preventDefault();
            const targetId = clickedTab.getAttribute('href').substring(1);
            updateActiveTab(clickedTab);
            loadTabContent(targetId);
            return;
        }

        const auditToggle = target.closest('[data-action="toggle-audit"]');
        if (auditToggle) {
            const card = auditToggle.closest('[data-transaction-card]');
            const container = card?.querySelector('.audit-log-container');
            const chevron = auditToggle.querySelector('.audit-chevron');
            if (container) {
                container.classList.toggle('open');
                chevron.classList.toggle('rotated');
            }
            return;
        }

        const docLink = target.closest('.transaction-document-link');
        if(docLink) {
            e.preventDefault();
            const title = docLink.dataset.docTitle;
            const content = docLink.dataset.docContent;
            if(typeof window.parent.showAppModal === 'function') {
                window.parent.showAppModal(title, `<p>${content}</p>`);
            }
            return;
        }

        const designationToggle = target.closest('#designation-toggle');
        if (designationToggle) {
            const canvas = document.getElementById('designation-chart');
            initDesignationChart(canvas, designationToggle.checked ? 'lifetime' : 'priorYear');
            return;
        }

        const designatedButton = target.closest('.designated-button');
        if (designatedButton) {
            const card = designatedButton.closest('[data-transaction-card]');
            const details = card?.querySelector('.designation-details');
            const title = `Designations for ${card?.querySelector('.text-md.font-semibold')?.textContent}`;
            if (details && typeof window.parent.showAppModal === 'function') {
                window.parent.showAppModal(title, details.innerHTML);
            }
            return;
        }
        const recurringButton = target.closest('.recurring-button');
        if (recurringButton) {
            const card = recurringButton.closest('[data-transaction-card]');
            const details = card?.querySelector('.recurring-details');
            const title = `Recurring Payments for ${card?.querySelector('.text-md.font-semibold')?.textContent}`;
            if (details && typeof window.parent.showAppModal === 'function') {
                window.parent.showAppModal(title, details.innerHTML);
            }
            return;
        }
        
        const commItem = target.closest('.communication-item, .note-item');
        if (commItem) {
            const title = commItem.querySelector('.font-semibold').textContent;
            const content = commItem.querySelector('.log-full-content').innerHTML;
            if (typeof window.parent.showAppModal === 'function') {
                window.parent.showAppModal(title, content);
            }
        }
    });
    
    window.addEventListener('message', (event) => {
        if (event.data.type === 'set-theme') {
            document.documentElement.className = event.data.mode;
            const existingTheme = Array.from(document.body.classList).find(c => c.startsWith('theme-'));
            if (existingTheme) document.body.classList.remove(existingTheme);
            document.body.classList.add(event.data.theme);
            
            const activeTab = document.querySelector('.profile-tab.border-primary')?.getAttribute('href')?.substring(1);
            if(activeTab === 'campaign') {
                loadTabContent('campaign');
            }
        }
    });

    initializeComponent();
});
