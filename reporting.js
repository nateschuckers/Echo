document.addEventListener('DOMContentLoaded', () => {
    console.log('Reporting script loaded and DOM is ready.'); // Debug 1: Confirms the script is running

    // --- Get Element Helper ---
    const getEl = (id) => document.getElementById(id);

    // --- NEW: Top Navigation Logic ---
    const navLinks = document.querySelectorAll('#top-nav-menu .nav-link');
    const reportPages = document.querySelectorAll('.report-page');

    console.log(`Found ${navLinks.length} navigation links.`); // Debug 2: Confirms links are found
    console.log(`Found ${reportPages.length} report pages.`); // Debug 3: Confirms pages are found

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            console.log(`Navigation link clicked. Target: ${targetId}`); // Debug 4: Confirms clicks are registered

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            let foundPage = false;
            reportPages.forEach(page => {
                const isActive = page.id === targetId;
                if (isActive) foundPage = true;
                page.classList.toggle('active', isActive);
            });

            if (!foundPage) {
                console.error(`Could not find a report page with ID: ${targetId}`);
            }
        });
    });

    // --- NEW: Report Options Drawer Logic ---
    const drawer = getEl('report-options-drawer');
    const drawerBackdrop = getEl('drawer-backdrop');
    const drawerTitle = getEl('drawer-title');
    const runReportButtons = document.querySelectorAll('.run-report-btn');
    const closeDrawerButtons = [getEl('close-drawer-btn'), getEl('cancel-drawer-btn'), drawerBackdrop];
    
    // --- NEW: Reusable Scheduler Component HTML ---
    const schedulerHTML = `
        <div class="space-y-4">
            <div class="accordion">
                <button class="accordion-header">
                    <h4>Scheduling Options</h4>
                    <i class="fa-solid fa-chevron-down accordion-icon"></i>
                </button>
                <div class="accordion-content open">
                    <div class="pt-4 space-y-2 radio-group">
                        <label><input type="radio" name="schedule-group" value="immediate" checked> Run Immediately</label>
                        <label><input type="radio" name="schedule-group" value="overnight"> Overnight</label>
                        <label class="flex items-center"><input type="radio" name="schedule-group" value="daily"> Every <input type="number" class="filter-input w-20 mx-2" value="5"> Days</label>
                        <label><input type="radio" name="schedule-group" value="monthly"> Last Day of Every Month</label>
                    </div>
                </div>
            </div>
            <div class="accordion">
                <button class="accordion-header">
                    <h4>Report & Job Options</h4>
                    <i class="fa-solid fa-chevron-down accordion-icon"></i>
                </button>
                <div class="accordion-content open">
                    <div class="pt-4 space-y-4">
                        <div class="input-group">
                            <label class="input-label">Report Format</label>
                            <div class="flex space-x-6">
                               <label class="checkbox-label"><input type="checkbox" class="checkbox" checked> PDF</label>
                               <label class="checkbox-label"><input type="checkbox" class="checkbox"> CSV</label>
                            </div>
                        </div>
                        <div class="input-group">
                            <label for="job-description" class="input-label">Job Description</label>
                            <input type="text" id="job-description" class="filter-input">
                        </div>
                    </div>
                </div>
            </div>
            <div class="accordion">
                <button class="accordion-header">
                    <h4>Email & Delivery</h4>
                    <i class="fa-solid fa-chevron-down accordion-icon"></i>
                </button>
                <div class="accordion-content">
                    <div class="pt-4 space-y-4">
                        <div class="input-group">
                            <label class="checkbox-label"><input type="checkbox" id="save-to-sharepoint" class="checkbox"> Save copies of reports to SharePoint</label>
                            <div id="sharepoint-options" class="pl-6 pt-2 space-y-2 radio-group hidden">
                                <label><input type="radio" name="sharepoint-location" disabled> Save to top level folder</label>
                                <label><input type="radio" name="sharepoint-location" disabled> Select folder</label>
                            </div>
                        </div>
                        <div class="input-group">
                           <label class="checkbox-label"><input type="checkbox" id="email-report" class="checkbox"> Email report</label>
                           <div id="email-options" class="pl-6 pt-2 space-y-2 hidden">
                                <input type="text" class="filter-input" placeholder="Select an account to email" disabled>
                                <input type="text" class="filter-input mt-2" placeholder="Select a warehouse to email" disabled>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // --- NEW: Dynamic Drawer UI Initializer ---
    const initializeDrawerUI = (container) => {
        if (!container) return;
        
        // NEW: Populate campaign year dropdowns
        const campaignYearDropdowns = container.querySelectorAll('.campaign-year-select');
        campaignYearDropdowns.forEach(dropdown => {
            if (dropdown.options.length <= 1) { 
                const years = [2025, 2024, 2023, 2022];
                years.forEach(year => {
                    const option = document.createElement('option');
                    option.value = year;
                    option.textContent = year;
                    dropdown.appendChild(option);
                });
            }
        });


        // Stepper/Tab Logic
        const steps = container.querySelectorAll('.step');
        const stepContents = container.querySelectorAll('.step-content');
        steps.forEach(step => {
            step.addEventListener('click', () => {
                const targetStep = step.dataset.step;
                steps.forEach(s => s.classList.remove('active'));
                step.classList.add('active');
                stepContents.forEach(content => {
                    content.classList.toggle('active', content.dataset.stepContent === targetStep);
                });
            });
        });

        // Accordion Logic
        const accordions = container.querySelectorAll('.accordion-header');
        accordions.forEach(accordion => {
            accordion.addEventListener('click', () => {
                const content = accordion.nextElementSibling;
                const icon = accordion.querySelector('.accordion-icon');
                content.classList.toggle('open');
                icon.classList.toggle('open');
            });
        });

        // Multi-select Modal Logic
        const multiSelectButtons = container.querySelectorAll('[data-modal-target]');
        multiSelectButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.dataset.modalTarget;
                const modal = getEl(modalId);
                if (modal) {
                    modal.style.zIndex = '60';
                    modal.style.display = 'flex';
                }
            });
        });

        // Scheduler Interactivity
        const schedulerContainer = container.querySelector('.scheduler-placeholder');
        if (schedulerContainer) {
            schedulerContainer.innerHTML = schedulerHTML;
            const sharepointCheck = schedulerContainer.querySelector('#save-to-sharepoint');
            const sharepointOptions = schedulerContainer.querySelector('#sharepoint-options');
            const emailCheck = schedulerContainer.querySelector('#email-report');
            const emailOptions = schedulerContainer.querySelector('#email-options');

            sharepointCheck.addEventListener('change', () => {
                sharepointOptions.classList.toggle('hidden');
                sharepointOptions.querySelectorAll('input').forEach(input => input.disabled = !sharepointCheck.checked);
            });
            emailCheck.addEventListener('change', () => {
                emailOptions.classList.toggle('hidden');
                emailOptions.querySelectorAll('input').forEach(input => input.disabled = !emailCheck.checked);
            });
        }
    };
    
    const openDrawer = (title, reportType) => {
        drawerTitle.textContent = title;
        
        document.querySelectorAll('.report-options-content').forEach(el => el.style.display = 'none');
        
        const optionsContainer = getEl(`${reportType}-report-options`);
        if (optionsContainer) {
            optionsContainer.style.display = 'block';
            initializeDrawerUI(optionsContainer);
        }

        drawer.classList.add('active');
        drawerBackdrop.classList.add('active');
    };

    const closeDrawer = () => {
        drawer.classList.remove('active');
        drawerBackdrop.classList.remove('active');
    };

    runReportButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.dataset.reportTitle || 'Configure Report';
            const reportType = btn.dataset.reportType;
            openDrawer(title, reportType);
        });
    });
    closeDrawerButtons.forEach(btn => btn.addEventListener('click', closeDrawer));
    
    // --- NEW: Global Modals Data & Logic ---
    const setupMultiSelectModal = (modalId, checkboxContainerId, doneButtonId, mockData, buttonSelector) => {
        const modal = getEl(modalId);
        if (!modal) return;

        const checkboxContainer = getEl(checkboxContainerId);
        checkboxContainer.innerHTML = '';
        mockData.forEach(item => {
            checkboxContainer.innerHTML += `<label class="checkbox-label col-span-2"><input type="checkbox" class="checkbox" value="${item}"><span>${item}</span></label>`;
        });

        getEl(doneButtonId).addEventListener('click', () => {
            const selected = Array.from(checkboxContainer.querySelectorAll('input:checked'));
            document.querySelectorAll(buttonSelector).forEach(button => {
                button.textContent = selected.length > 0 ? `${selected.length} item(s) selected` : 'No items selected';
                button.classList.toggle('active', selected.length > 0);
            });
            modal.style.display = 'none';
            modal.style.zIndex = '';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) getEl(doneButtonId).click();
        });
    };
    
    // Campaign Accounts
    const mockCampaigns = ['Annual Giving Campaign (2025)', 'Capital Campaign', 'Special Event Gala', 'Community Cleanup Drive', 'United Way Campaign (2024)'];
    setupMultiSelectModal('campaign-account-modal', 'campaign-account-checkboxes', 'campaign-account-modal-done', mockCampaigns, '[data-modal-target="campaign-account-modal"]');
    
    // Campaign Types
    const mockCampaignTypes = ['Corporate', 'Other Campaign', 'Employee', 'Other Non-Campaign', 'Individual', 'Workplace Special Event'];
    setupMultiSelectModal('campaign-type-modal', 'campaign-type-checkboxes', 'campaign-type-modal-done', mockCampaignTypes, '[data-modal-target="campaign-type-modal"]');

    // Campaign Statuses
    const mockCampaignStatuses = ['Unknown', 'Final', 'Partial'];
    setupMultiSelectModal('campaign-status-modal', 'campaign-status-checkboxes', 'campaign-status-modal-done', mockCampaignStatuses, '[data-modal-target="campaign-status-modal"]');


    // --- ORIGINAL REPORTING.JS LOGIC (for 'Build a Report' page) ---
    // --- STATE MANAGEMENT ---
    let allData = [];
    let currentFilteredData = [];
    let customChart = null;
    let selectedFields = ['name', 'role', 'donationAmount', 'pledgePaid', 'churnStatus'];

    // --- MOCK DATA CONSTANTS ---
    const USER_ROLES = ['Employee', 'Individual', 'Volunteer', 'Attendee'];
    const WORKPLACES = ['TechCorp', 'HealthInc', 'EduGreat', 'FinanceLLC', 'RetailCo', 'No Workplace'];
    const VOLUNTEER_OPPORTUNITIES = ['Annual Gala', 'Community Cleanup', 'Mentorship Program', 'Fundraising Drive'];
    const EVENT_NAMES = ['Networking Night', 'Charity Auction', 'Webinar Series', 'Annual Conference'];
    const CHURN_STATUSES = ['New', 'Increased', 'Flat', 'Decreased', 'Lapsed'];
    const GIFT_TYPES = ['Individual', 'Employee'];
    const CAMPAIGN_YEARS = [2023, 2024, 2025];
    const PAYMENT_TYPES = ['Credit Card', 'Check', 'Bank Transfer'];
    const PLEDGE_STATUSES = [{key: 'paid', label: 'Paid'}, {key: 'unpaid', label: 'Unpaid'}];
    const FIRST_NAMES = ['John', 'Jane', 'Alex', 'Emily', 'Chris', 'Katie', 'Michael', 'Sarah', 'David', 'Laura'];
    const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    
    // --- FIELD DEFINITIONS ---
    const ALL_FIELDS = [
        { key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }, { key: 'donationAmount', label: 'Donation' },
        { key: 'workplace', label: 'Workplace' }, { key: 'pledgePaid', label: 'Pledge Status' }, { key: 'churnStatus', label: 'Churn Status' },
        { key: 'pledgeAmount', label: 'Pledge Amount' }, { key: 'paymentAmount', label: 'Payment Amount' }, { key: 'address', label: 'Address' },
        { key: 'email', label: 'Email Address' }, { key: 'phone', label: 'Phone Number' },
        { key: 'volunteerHistory', label: 'Volunteer Events'}, { key: 'volunteerOppsAttended', label: 'Volunteer Opps Attended'},
        { key: 'eventHistory', label: 'Event History'}, { key: 'eventsAttended', label: 'Total Events Attended'},
    ];
    const GROUPABLE_FIELDS = [
        { key: 'churnStatus', label: 'Churn Status' }, { key: 'workplace', label: 'Workplace' }, { key: 'giftType', label: 'Gift Type'},
        { key: 'campaignYear', label: 'Campaign Year'}, { key: 'campaignType', label: 'Campaign Type'}, { key: 'paymentType', label: 'Payment Type'}
    ];
    const METRIC_FIELDS = [
        { key: 'donationAmount', label: 'Sum of Donation Amount'}, { key: 'pledgeAmount', label: 'Sum of Pledge Amount'}, { key: 'paymentAmount', label: 'Sum of Payment Amount'},
        { key: 'volunteerOppsAttended', label: 'Sum of Volunteer Opps'}, { key: 'eventsAttended', label: 'Sum of Total Events'}
    ];
    
    // --- DATA GENERATION ---
    const generateData = (count) => {
        const data = [];
        for (let i = 0; i < count; i++) {
            const roles = [...new Set(Array.from({length: Math.floor(Math.random() * 2) + 1}, () => USER_ROLES[Math.floor(Math.random() * USER_ROLES.length)]))];
            const isDonor = roles.includes('Individual') || roles.includes('Employee');
            const isVolunteer = roles.includes('Volunteer');
            const donationAmount = isDonor ? Math.floor(Math.random() * 5000) + 5 : 0;
            const pledgePaid = Math.random() > 0.2;
            const volunteerHistory = isVolunteer ? [...new Set(Array.from({length: Math.floor(Math.random() * 4)}, () => VOLUNTEER_OPPORTUNITIES[Math.floor(Math.random() * VOLUNTEER_OPPORTUNITIES.length)]))] : [];
            const eventHistory = [...new Set(Array.from({length: Math.floor(Math.random() * 5)}, () => EVENT_NAMES[Math.floor(Math.random() * EVENT_NAMES.length)]))];

            data.push({
                name: `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`,
                role: roles,
                workplace: WORKPLACES[Math.floor(Math.random() * WORKPLACES.length)],
                giftType: GIFT_TYPES[Math.floor(Math.random() * GIFT_TYPES.length)],
                donationAmount, pledgePaid,
                churnStatus: isDonor ? CHURN_STATUSES[Math.floor(Math.random() * CHURN_STATUSES.length)] : 'N/A',
                campaignYear: CAMPAIGN_YEARS[Math.floor(Math.random() * CAMPAIGN_YEARS.length)],
                campaignType: mockCampaignTypes[Math.floor(Math.random() * mockCampaignTypes.length)],
                paymentType: PAYMENT_TYPES[Math.floor(Math.random() * PAYMENT_TYPES.length)],
                pledgeAmount: donationAmount + (Math.random() * 500),
                paymentAmount: pledgePaid ? donationAmount : 0,
                address: `${i+1} Main St`, email: `user${i}@example.com`, phone: `555-01${String(i).padStart(2, '0')}`,
                volunteerHistory, volunteerOppsAttended: volunteerHistory.length,
                eventHistory, eventsAttended: eventHistory.length,
            });
        }
        return data;
    };

    // --- RENDERING FUNCTIONS ---
    const renderTable = (data) => {
        const tableHead = getEl('data-table-head');
        const tableBody = getEl('data-table-body');
        if (!tableHead || !tableBody) return;
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';
        
        const headerRow = document.createElement('tr');
        selectedFields.forEach(fieldKey => {
            const field = ALL_FIELDS.find(f => f.key === fieldKey);
            if (field) {
                const th = document.createElement('th');
                th.className = "px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider";
                th.textContent = field.label;
                headerRow.appendChild(th);
            }
        });
        tableHead.appendChild(headerRow);

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="${selectedFields.length}" class="text-center py-8 text-gray-500">No accounts match the selected filters.</td></tr>`;
            return;
        }

        data.slice(0, 200).forEach(d => { // Limit to 200 rows for performance
            const row = document.createElement('tr');
            row.className = "hover:bg-gray-700/50";
            selectedFields.forEach(fieldKey => {
                const td = document.createElement('td');
                td.className = "px-4 py-3 whitespace-nowrap text-sm text-gray-300";
                let content = d[fieldKey];
                
                if (['role', 'volunteerHistory', 'eventHistory'].includes(fieldKey)) {
                    content = Array.isArray(d[fieldKey]) ? d[fieldKey].join(', ') : d[fieldKey];
                } else if (['donationAmount', 'pledgeAmount', 'paymentAmount'].includes(fieldKey)) {
                    content = `$${content.toLocaleString()}`;
                } else if (fieldKey === 'pledgePaid') {
                    content = d.pledgePaid ? '<span class="text-green-400 font-semibold">Paid</span>' : '<span class="text-red-400">Unpaid</span>';
                }
                td.innerHTML = content || 'N/A';
                row.appendChild(td);
            });
            tableBody.appendChild(row);
        });
    };

    const renderCustomChart = (chartData, chartType, title) => {
        const canvas = getEl('custom-chart-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if(customChart) customChart.destroy();
        getEl('chart-display-title').textContent = title;
        customChart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: chartData.metricLabel,
                    data: chartData.data,
                    backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#ec4899'],
                    borderColor: '#4b5563',
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#d1d5db' } } } }
        });
        getEl('chart-display-modal').style.display = 'flex';
    };

    // --- FILTERING LOGIC ---
    const applyFilters = () => {
        const roleLogicEl = document.querySelector('input[name="role-logic"]:checked');
        if (!roleLogicEl) return; // Exit if builder page elements aren't present

        const getSelected = (id) => Array.from(document.querySelectorAll(`#${id} input:checked`)).map(cb => cb.value);
        const filters = {
            minAmount: parseFloat(getEl('min-amount-filter').value) || 0,
            maxAmount: parseFloat(getEl('max-amount-filter').value) || Infinity,
            minVolunteerEvents: parseFloat(getEl('min-volunteer-events-filter').value) || 0,
            maxVolunteerEvents: parseFloat(getEl('max-volunteer-events-filter').value) || Infinity,
            minTotalEvents: parseFloat(getEl('min-total-events-filter').value) || 0,
            maxTotalEvents: parseFloat(getEl('max-total-events-filter').value) || Infinity,
            selectedRoles: getSelected('role-checkboxes'),
            roleLogic: roleLogicEl.value,
            selectedWorkplaces: getSelected('workplace-checkboxes'),
            selectedOpps: getSelected('opportunity-checkboxes'),
            selectedEvents: getSelected('event-checkboxes'),
            selectedPledge: getSelected('pledge-checkboxes'),
            selectedChurn: getSelected('churn-checkboxes'),
            selectedGiftTypes: getSelected('gift-type-checkboxes'),
            selectedCampaignYears: getSelected('campaign-year-checkboxes'),
            selectedCampaignTypes: getSelected('campaign-type-checkboxes'),
            selectedPaymentTypes: getSelected('payment-type-checkboxes'),
        };

        currentFilteredData = allData.filter(d => {
            const roleMatch = filters.selectedRoles.length === 0 || (filters.roleLogic === 'or' ? filters.selectedRoles.some(r => d.role.includes(r)) : filters.selectedRoles.every(r => d.role.includes(r)));
            const pledgeMatch = filters.selectedPledge.length === 0 || (filters.selectedPledge.includes('paid') && d.pledgePaid) || (filters.selectedPledge.includes('unpaid') && !d.pledgePaid);
            
            return roleMatch && pledgeMatch &&
                (filters.selectedWorkplaces.length === 0 || filters.selectedWorkplaces.includes(d.workplace)) &&
                (filters.selectedOpps.length === 0 || filters.selectedOpps.some(opp => d.volunteerHistory.includes(opp))) &&
                (filters.selectedEvents.length === 0 || filters.selectedEvents.some(evt => d.eventHistory.includes(evt))) &&
                (d.volunteerOppsAttended >= filters.minVolunteerEvents && d.volunteerOppsAttended <= filters.maxVolunteerEvents) &&
                (d.eventsAttended >= filters.minTotalEvents && d.eventsAttended <= filters.maxTotalEvents) &&
                (filters.selectedGiftTypes.length === 0 || filters.selectedGiftTypes.includes(d.giftType)) &&
                (d.donationAmount >= filters.minAmount && d.donationAmount <= filters.maxAmount) &&
                (filters.selectedChurn.length === 0 || filters.selectedChurn.includes(d.churnStatus)) &&
                (filters.selectedCampaignYears.length === 0 || filters.selectedCampaignYears.includes(String(d.campaignYear))) &&
                (filters.selectedCampaignTypes.length === 0 || filters.selectedCampaignTypes.includes(d.campaignType)) &&
                (filters.selectedPaymentTypes.length === 0 || filters.selectedPaymentTypes.includes(d.paymentType));
        });
        
        getEl('results-count').textContent = currentFilteredData.length.toLocaleString();
        renderTable(currentFilteredData);
    };

    // --- UI SETUP & INITIALIZATION ---
    const initializeBuilderPage = () => {
        if (!getEl('reporting-sidebar')) return;

        allData = generateData(5000);
        
        const populateCheckboxes = (containerId, options) => {
            const container = getEl(containerId);
            if (!container) return;
            container.innerHTML = '';
            options.forEach(opt => {
                const label = typeof opt === 'object' ? opt.label : opt;
                const value = typeof opt === 'object' ? opt.key : opt;
                container.innerHTML += `<label class="checkbox-label"><input type="checkbox" class="checkbox" value="${value}"><span>${label}</span></label>`;
            });
        };
        
        const setupModal = (buttonId, modalId, doneButtonId, checkboxesSelector, defaultText) => {
            const button = getEl(buttonId);
            const modal = getEl(modalId);
            if (!button || !modal) return;

            getEl(doneButtonId).addEventListener('click', () => {
                modal.style.display = 'none';
                const selected = Array.from(document.querySelectorAll(`${checkboxesSelector} input:checked`)).map(cb => cb.value);
                button.textContent = selected.length === 0 ? defaultText : selected.length > 2 ? `${selected.length} selected` : selected.map(val => {
                    const option = PLEDGE_STATUSES.find(p => p.key === val);
                    return option ? option.label : val;
                }).join(', ');

                button.classList.toggle('active', selected.length > 0);
                applyFilters();
            });
            button.addEventListener('click', () => modal.style.display = 'flex');
            modal.addEventListener('click', (e) => { if (e.target === modal) getEl(doneButtonId).click(); });
        };

        populateCheckboxes('role-checkboxes', USER_ROLES);
        populateCheckboxes('workplace-checkboxes', WORKPLACES);
        populateCheckboxes('opportunity-checkboxes', VOLUNTEER_OPPORTUNITIES);
        populateCheckboxes('event-checkboxes', EVENT_NAMES);
        populateCheckboxes('pledge-checkboxes', PLEDGE_STATUSES);
        populateCheckboxes('churn-checkboxes', CHURN_STATUSES);
        populateCheckboxes('gift-type-checkboxes', GIFT_TYPES);
        populateCheckboxes('campaign-year-checkboxes', CAMPAIGN_YEARS);
        populateCheckboxes('payment-type-checkboxes', PAYMENT_TYPES);
        
        const fieldsCheckboxes = getEl('fields-checkboxes');
        if(fieldsCheckboxes) {
            fieldsCheckboxes.innerHTML = '';
            ALL_FIELDS.forEach(field => {
                fieldsCheckboxes.innerHTML += `<label class="checkbox-label"><input type="checkbox" class="checkbox" value="${field.key}" ${selectedFields.includes(field.key) ? 'checked' : ''}><span>${field.label}</span></label>`;
            });
        }
        
        const populateSelect = (selectEl, options, defaultOption) => {
            if (!selectEl) return;
            selectEl.innerHTML = `<option value="all" disabled selected>${defaultOption}</option>`;
            options.forEach(opt => {
                selectEl.innerHTML += `<option value="${opt.key}">${opt.label}</option>`;
            });
        };
        populateSelect(getEl('group-by-select'), GROUPABLE_FIELDS, 'Select Field');
        populateSelect(getEl('metric-select'), METRIC_FIELDS, 'Select Metric');
        
        document.querySelectorAll('.filter-input').forEach(el => el.addEventListener('input', applyFilters));
        document.querySelectorAll('input[name="role-logic"]').forEach(el => el.addEventListener('change', applyFilters));

        document.querySelectorAll('.filter-toggle-button').forEach(button => {
            button.addEventListener('click', () => {
                const target = getEl(button.dataset.target);
                const icon = button.querySelector('i');
                target.classList.toggle('open');
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            });
        });

        setupModal('role-filter-button', 'role-modal', 'role-modal-done', '#role-checkboxes', 'All Roles');
        setupModal('workplace-filter-button', 'workplace-modal', 'workplace-modal-done', '#workplace-checkboxes', 'All Workplaces');
        setupModal('opportunity-filter-button', 'opportunity-modal', 'opportunity-modal-done', '#opportunity-checkboxes', 'Any Opportunity');
        setupModal('event-filter-button', 'event-modal', 'event-modal-done', '#event-checkboxes', 'Any Event');
        setupModal('pledge-filter-button', 'pledge-modal', 'pledge-modal-done', '#pledge-checkboxes', 'All Pledge Statuses');
        setupModal('churn-filter-button', 'churn-modal', 'churn-modal-done', '#churn-checkboxes', 'All Churn Statuses');
        setupModal('gift-type-filter-button', 'gift-type-modal', 'gift-type-modal-done', '#gift-type-checkboxes', 'All Gift Types');
        setupModal('campaign-year-filter-button', 'campaign-year-modal', 'campaign-year-modal-done', '#campaign-year-checkboxes', 'All Campaign Years');
        setupModal('payment-type-filter-button', 'payment-type-modal', 'payment-type-modal-done', '#payment-type-checkboxes', 'All Payment Types');

        if(getEl('select-fields-button')) {
            getEl('select-fields-button').addEventListener('click', () => getEl('fields-modal').style.display = 'flex');
            getEl('fields-modal-done').addEventListener('click', () => {
                selectedFields = Array.from(document.querySelectorAll('#fields-checkboxes input:checked')).map(cb => cb.value);
                getEl('fields-modal').style.display = 'none';
                applyFilters();
            });
        }
        
        if(getEl('create-chart-button')) {
            getEl('create-chart-button').addEventListener('click', () => getEl('chart-creator-modal').style.display = 'flex');
            getEl('chart-creator-cancel').addEventListener('click', () => getEl('chart-creator-modal').style.display = 'none');
            getEl('chart-display-close').addEventListener('click', () => getEl('chart-display-modal').style.display = 'none');
            getEl('chart-creator-generate').addEventListener('click', () => {
                const groupBy = getEl('group-by-select').value;
                const metric = getEl('metric-select').value;
                const chartType = getEl('chart-type-select').value;
                if (!groupBy || !metric || groupBy === 'all' || metric === 'all') return;
                const groupedData = currentFilteredData.reduce((acc, item) => {
                    const key = item[groupBy] || 'N/A';
                    if (!acc[key]) acc[key] = 0;
                    acc[key] += item[metric];
                    return acc;
                }, {});
                const chartData = {
                    labels: Object.keys(groupedData),
                    data: Object.values(groupedData),
                    metricLabel: METRIC_FIELDS.find(f => f.key === metric).label
                };
                const title = `${METRIC_FIELDS.find(f => f.key === metric).label} by ${GROUPABLE_FIELDS.find(f => f.key === groupBy).label}`;
                renderCustomChart(chartData, chartType, title);
                getEl('chart-creator-modal').style.display = 'none';
            });
        }

        if(getEl('reset-filters')) {
            getEl('reset-filters').addEventListener('click', () => {
                document.querySelectorAll('.filter-input').forEach(i => i.value = '');
                document.querySelectorAll('.modal-body input[type="checkbox"]').forEach(c => c.checked = false);
                document.querySelectorAll('.filter-multiselect-button').forEach(b => {
                    b.classList.remove('active');
                    const id = b.id;
                    if (id.includes('role')) b.textContent = 'All Roles'; else if (id.includes('workplace')) b.textContent = 'All Workplaces'; else if (id.includes('opportunity')) b.textContent = 'Any Opportunity'; else if (id.includes('event')) b.textContent = 'Any Event'; else if (id.includes('pledge')) b.textContent = 'All Pledge Statuses'; else if (id.includes('churn')) b.textContent = 'All Churn Statuses'; else if (id.includes('gift-type')) b.textContent = 'All Gift Types'; else if (id.includes('campaign-year')) b.textContent = 'All Campaign Years'; else if (id.includes('payment-type')) b.textContent = 'All Payment Types';
                });
                applyFilters();
            });
        }
        
        if(getEl('sidebar-toggle')) {
            getEl('sidebar-toggle').addEventListener('click', () => {
                const sidebar = getEl('reporting-sidebar');
                sidebar.classList.toggle('w-80');
                sidebar.classList.toggle('w-20');
                getEl('sidebar-content').classList.toggle('hidden');
                getEl('collapse-icon').classList.toggle('hidden');
                getEl('expand-icon').classList.toggle('hidden');
            });
        }

        applyFilters(); 
    };
    
    // Wrap the initialization in a try-catch to prevent it from breaking navigation
    try {
        initializeBuilderPage();
    } catch (error) {
        console.error("An error occurred during the initialization of the 'Custom' report builder page:", error);
    }
});

