document.addEventListener('DOMContentLoaded', () => {
    console.log('Reporting script loaded and DOM is ready.');

    // --- Get Element Helper ---
    const getEl = (id) => document.getElementById(id);

    // --- Top Navigation Logic ---
    const navLinks = document.querySelectorAll('#top-nav-menu .nav-link');
    const reportPages = document.querySelectorAll('.report-page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            reportPages.forEach(page => page.classList.toggle('active', page.id === targetId));
        });
    });

    // --- Report Options Drawer Logic ---
    const drawer = getEl('report-options-drawer');
    const drawerBackdrop = getEl('drawer-backdrop');
    const drawerTitle = getEl('drawer-title');
    const runReportButtons = document.querySelectorAll('.run-report-btn');
    const closeDrawerButtons = [getEl('close-drawer-btn'), getEl('cancel-drawer-btn'), drawerBackdrop];
    const previewReportBtn = getEl('preview-report-btn');
    
    // --- Reusable Scheduler Component HTML ---
    const schedulerHTML = `
        <div class="space-y-4">
            <div class="accordion">
                <button class="accordion-header"><h4>Scheduling Options</h4><i class="fa-solid fa-chevron-down accordion-icon"></i></button>
                <div class="accordion-content open"><div class="pt-4 space-y-2 radio-group">
                    <label><input type="radio" name="schedule-group" value="immediate" checked> Run Immediately</label>
                    <label><input type="radio" name="schedule-group" value="overnight"> Overnight</label>
                    <label class="flex items-center"><input type="radio" name="schedule-group" value="daily"> Every <input type="number" class="filter-input w-20 mx-2" value="5"> Days</label>
                    <label><input type="radio" name="schedule-group" value="monthly"> Last Day of Every Month</label>
                </div></div>
            </div>
            <div class="accordion">
                <button class="accordion-header"><h4>Report & Job Options</h4><i class="fa-solid fa-chevron-down accordion-icon"></i></button>
                <div class="accordion-content open"><div class="pt-4 space-y-4">
                    <div class="input-group"><label class="input-label">Report Format</label><div class="flex space-x-6">
                       <label class="checkbox-label"><input type="checkbox" class="checkbox" checked> PDF</label>
                       <label class="checkbox-label"><input type="checkbox" class="checkbox"> CSV</label>
                    </div></div>
                    <div class="input-group"><label for="job-description" class="input-label">Job Description</label><input type="text" id="job-description" class="filter-input"></div>
                </div></div>
            </div>
            <div class="accordion">
                <button class="accordion-header"><h4>Email & Delivery</h4><i class="fa-solid fa-chevron-down accordion-icon"></i></button>
                <div class="accordion-content"><div class="pt-4 space-y-4">
                    <div class="input-group"><label class="checkbox-label"><input type="checkbox" id="save-to-sharepoint" class="checkbox"> Save copies of reports to SharePoint</label>
                        <div id="sharepoint-options" class="pl-6 pt-2 space-y-2 radio-group hidden">
                            <label><input type="radio" name="sharepoint-location" disabled> Save to top level folder</label>
                            <label><input type="radio" name="sharepoint-location" disabled> Select folder</label>
                        </div>
                    </div>
                    <div class="input-group"><label class="checkbox-label"><input type="checkbox" id="email-report" class="checkbox"> Email report</label>
                       <div id="email-options" class="pl-6 pt-2 space-y-2 hidden">
                            <input type="text" class="filter-input" placeholder="Select an account to email" disabled>
                            <input type="text" class="filter-input mt-2" placeholder="Select a warehouse to email" disabled>
                       </div>
                    </div>
                </div></div>
            </div>
        </div>`;
    
    // --- Dynamic Drawer UI Initializer ---
    const initializeDrawerUI = (container) => {
        if (!container) return;
        
        // Populate campaign year dropdowns
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
                stepContents.forEach(content => content.classList.toggle('active', content.dataset.stepContent === targetStep));
            });
        });

        // Accordion Logic
        container.querySelectorAll('.accordion-header').forEach(accordion => {
            if(accordion.dataset.listenerAttached) return;
            accordion.addEventListener('click', () => {
                const content = accordion.nextElementSibling;
                const icon = accordion.querySelector('.accordion-icon');
                content.classList.toggle('open');
                icon.classList.toggle('open');
            });
            accordion.dataset.listenerAttached = true;
        });

        // Multi-select Modal Logic
        container.querySelectorAll('[data-modal-target]').forEach(button => {
             if(button.dataset.listenerAttached) return;
            button.addEventListener('click', () => {
                const modalId = button.dataset.modalTarget;
                const modal = getEl(modalId);
                if (modal) {
                    modal.style.zIndex = '60';
                    modal.style.display = 'flex';
                }
            });
             button.dataset.listenerAttached = true;
        });

        // Scheduler Interactivity
        const schedulerContainer = container.querySelector('.scheduler-placeholder');
        if (schedulerContainer && !schedulerContainer.dataset.initialized) {
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
            schedulerContainer.dataset.initialized = true;
        }
        
        // Recap Report Interactivity
        const produceRecapCheck = container.querySelector('#produce-recap-report');
        if (produceRecapCheck && !produceRecapCheck.dataset.listenerAttached) {
            const recapOptionsContainer = container.querySelector('#recap-report-options');
            const recapRadios = recapOptionsContainer.querySelectorAll('input[type="radio"]');
            produceRecapCheck.addEventListener('change', () => {
                const isChecked = produceRecapCheck.checked;
                recapOptionsContainer.classList.toggle('opacity-50', !isChecked);
                recapRadios.forEach(radio => radio.disabled = !isChecked);
            });
            produceRecapCheck.dataset.listenerAttached = true;
        }

        // More Selections Interactivity
        const showContactCheck = container.querySelector('#show-contact-check');
        if(showContactCheck && !showContactCheck.dataset.listenerAttached) {
            const contactTypeSelect = container.querySelector('#contact-type-select');
            showContactCheck.addEventListener('change', () => {
                contactTypeSelect.disabled = !showContactCheck.checked;
            });
            showContactCheck.dataset.listenerAttached = true;
        }
        
        const showManagerCheck = container.querySelector('#show-manager-check');
        if(showManagerCheck && !showManagerCheck.dataset.listenerAttached) {
            const managerOptions = container.querySelector('#manager-options');
            showManagerCheck.addEventListener('change', () => {
                const isChecked = showManagerCheck.checked;
                managerOptions.classList.toggle('opacity-50', !isChecked);
                managerOptions.querySelectorAll('input, select').forEach(el => el.disabled = !isChecked);
            });
            showManagerCheck.dataset.listenerAttached = true;
        }


        // Column Manager Logic
        if (container.id === 'monitoring-report-options' && !container.dataset.columnsInitialized) {
            initializeColumnManager();
            container.dataset.columnsInitialized = true;
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

        // Show/hide preview button based on report type
        previewReportBtn.classList.toggle('hidden', reportType !== 'monitoring');

        drawer.classList.add('active');
        drawerBackdrop.classList.add('active');
    };

    const closeDrawer = () => {
        drawer.classList.remove('active');
        drawerBackdrop.classList.remove('active');
    };

    runReportButtons.forEach(btn => btn.addEventListener('click', () => {
        const title = btn.dataset.reportTitle || 'Configure Report';
        const reportType = btn.dataset.reportType;
        openDrawer(title, reportType);
    }));
    closeDrawerButtons.forEach(btn => btn.addEventListener('click', closeDrawer));
    
    // --- Global Modals Data & Logic ---
    const setupMultiSelectModal = (modalId, checkboxContainerId, doneButtonId, mockData, buttonSelector) => {
        const modal = getEl(modalId);
        if (!modal) return;

        const checkboxContainer = getEl(checkboxContainerId);
        checkboxContainer.innerHTML = '';
        mockData.forEach(item => checkboxContainer.innerHTML += `<label class="checkbox-label col-span-2"><input type="checkbox" class="checkbox" value="${item}"><span>${item}</span></label>`);

        getEl(doneButtonId).addEventListener('click', () => {
            const selected = Array.from(checkboxContainer.querySelectorAll('input:checked'));
            document.querySelectorAll(buttonSelector).forEach(button => {
                button.textContent = selected.length > 0 ? `${selected.length} item(s) selected` : 'No items selected';
                button.classList.toggle('active', selected.length > 0);
            });
            modal.style.display = 'none';
            modal.style.zIndex = '';
        });

        modal.addEventListener('click', (e) => { if (e.target === modal) getEl(doneButtonId).click(); });
    };
    
    setupMultiSelectModal('campaign-account-modal', 'campaign-account-checkboxes', 'campaign-account-modal-done', ['Annual Giving Campaign (2025)', 'Capital Campaign', 'Special Event Gala', 'Community Cleanup Drive', 'United Way Campaign (2024)'], '[data-modal-target="campaign-account-modal"]');
    setupMultiSelectModal('campaign-type-modal', 'campaign-type-checkboxes', 'campaign-type-modal-done', ['Corporate', 'Other Campaign', 'Employee', 'Other Non-Campaign', 'Individual', 'Workplace Special Event'], '[data-modal-target="campaign-type-modal"]');
    setupMultiSelectModal('campaign-status-modal', 'campaign-status-checkboxes', 'campaign-status-modal-done', ['Unknown', 'Final', 'Partial'], '[data-modal-target="campaign-status-modal"]');

    // --- Column Manager & Preview ---
    let monitoringReportColumns = [
        // Merged list from all screenshots
        { id: 'structureNode', original: 'Structure Node', current: 'Structure Node', visible: true },
        { id: 'manager', original: 'Manager', current: 'Manager', visible: true },
        { id: 'accountName', original: 'Account Name', current: 'Account Name', visible: true },
        { id: 'payrollStart', original: 'PayrollStart', current: 'Payroll Start', visible: false },
        { id: 'accountNum', original: 'Account #', current: 'Acct #', visible: true },
        { id: 'campaignName', original: 'Campaign Name', current: 'Campaign', visible: true },
        { id: 'campaignStart', original: 'Campaign Start', current: 'Camp. Start', visible: false },
        { id: 'campaignEnd', original: 'Campaign End', current: 'Camp. End', visible: false },
        { id: 'campaignType', original: 'Campaign Type', current: 'Camp. Type', visible: true },
        { id: 'prevYrProc', original: 'Prev Yr Proc', current: 'Prev Yr Proc', visible: true },
        { id: 'managerType', original: 'managerType', current: 'Mgr Type', visible: false },
        { id: 'incrOnCVConsumed', original: '% Incr on CV Consumed', current: '% Incr CV', visible: false },
        { id: 'incrOpenCV', original: '% Incr OpenCV to meet Goal', current: '% Incr OpenCV', visible: false },
        { id: 'accountType', original: 'ACCOUNTTYPE', current: 'Acct Type', visible: false },
        { id: 'campaignAccount', original: 'Campaign Account', current: 'Camp. Acct', visible: false },
        { id: 'consumedCV', original: 'Consumed CV', current: 'CV Consumed', visible: false },
        { id: 'managerDesc', original: 'managerDesc', current: 'Mgr Desc', visible: false },
        { id: 'nodeNumber', original: 'Node Number', current: 'Node #', visible: false },
        { id: 'prevYrProcMemo', original: 'Prev Yr Proc Memo', current: 'Prev Yr Memo', visible: false },
        { id: 'processedMemo', original: 'Processed Memo', current: 'Proc. Memo', visible: false },
        { id: 'projChgGoal', original: 'Proj. %Chg Goal', current: 'Proj. % Chg Goal', visible: false },
        { id: 'rnGainLoss', original: 'RN Gain/Loss vs CV', current: 'Gain/Loss', visible: true },
        { id: 'rnProcessed', original: 'RN Processed', current: 'Processed', visible: true },
        { id: 'rnTotalIn', original: 'RN Total In', current: 'Total In', visible: true },
        { id: 'rnTotInChgCV', original: 'RN TotIn %Chg CV', current: '% Chg CV', visible: true },
        { id: 'spDesignNonRenew', original: 'SP Design NonRenew', current: 'Non-Renew', visible: false },
        { id: 'spDesignRenew', original: 'SP Design Renew', current: 'Renew', visible: false },
        { id: 'spDesignTotal', original: 'SP Design Total', current: 'Design Total', visible: false },
        { id: 'spNodeGoal', original: 'SP Node Goal', current: 'Node Goal', visible: false },
        { id: 'subaccount', original: 'SUBACCOUNT', current: 'Sub-Acct', visible: false },
        { id: 'totalInMemo', original: 'Total In Memo', current: 'Total In Memo', visible: false }
    ];

    function initializeColumnManager() {
        const container = getEl('monitoring-column-manager');
        let draggedItem = null;

        function renderColumns() {
            container.innerHTML = '';
            monitoringReportColumns.forEach((col, index) => {
                const item = document.createElement('li');
                item.className = `column-item flex items-center gap-3 p-2 bg-gray-800 border border-gray-700 rounded-md transition-opacity ${!col.visible ? 'hidden-column' : ''}`;
                item.draggable = true;
                item.dataset.index = index;
                
                item.innerHTML = `
                    <i class="fa-solid fa-grip-vertical text-gray-500 cursor-grab drag-handle"></i>
                    <input type="text" class="filter-input flex-grow" value="${col.current}">
                    <button class="text-gray-400 hover:text-white toggle-visibility-btn w-6 h-6">
                        <i class="fa-solid ${col.visible ? 'fa-eye' : 'fa-eye-slash'}"></i>
                    </button>
                `;
                container.appendChild(item);
            });
        }

        function attachListeners() {
            container.querySelectorAll('.column-item').forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    draggedItem = e.target.closest('.column-item');
                    draggedItem.classList.add('dragging');
                });

                item.addEventListener('dragend', () => {
                    if (!draggedItem) return;
                    draggedItem.classList.remove('dragging');
                    draggedItem = null;
                });

                item.querySelector('.filter-input').addEventListener('input', (e) => {
                    const index = item.dataset.index;
                    monitoringReportColumns[index].current = e.target.value;
                });

                item.querySelector('.toggle-visibility-btn').addEventListener('click', () => {
                    const index = item.dataset.index;
                    monitoringReportColumns[index].visible = !monitoringReportColumns[index].visible;
                    renderColumns();
                    attachListeners();
                });
            });
        }

        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(container, e.clientY);
            const currentDragged = document.querySelector('.dragging');
            if (afterElement == null) {
                container.appendChild(currentDragged);
            } else {
                container.insertBefore(currentDragged, afterElement);
            }
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            const newOrder = Array.from(container.children).map(item => monitoringReportColumns[item.dataset.index]);
            monitoringReportColumns = newOrder;
            renderColumns();
            attachListeners();
        });

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.column-item:not(.dragging)')];
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }

        renderColumns();
        attachListeners();
    }

    // --- Preview Modal Logic ---
    const previewModal = getEl('report-preview-modal');
    const closePreviewBtn = getEl('close-preview-btn');
    const previewContent = getEl('preview-content');

    const renderReportPreview = () => {
        const visibleColumns = monitoringReportColumns.filter(c => c.visible);
        let tableHTML = '<table><thead><tr>';
        visibleColumns.forEach(c => { tableHTML += `<th>${c.current}</th>`; });
        tableHTML += '</tr></thead><tbody>';

        // Generate a few rows of mock data for preview
        for (let i = 1; i <= 5; i++) {
            tableHTML += '<tr>';
            visibleColumns.forEach(col => {
                tableHTML += `<td>${col.id} data ${i}</td>`;
            });
            tableHTML += '</tr>';
        }

        tableHTML += '</tbody></table>';
        previewContent.innerHTML = tableHTML;
        previewModal.style.display = 'flex';
    };

    previewReportBtn.addEventListener('click', renderReportPreview);
    closePreviewBtn.addEventListener('click', () => previewModal.style.display = 'none');
    previewModal.addEventListener('click', (e) => { if(e.target === previewModal) previewModal.style.display = 'none'});


    // --- ORIGINAL REPORTING.JS LOGIC (for 'Build a Report' page) ---
    let allData = [];
    let currentFilteredData = [];
    let customChart = null;
    let selectedFields = ['name', 'role', 'donationAmount', 'pledgePaid', 'churnStatus'];
    const USER_ROLES = ['Employee', 'Individual', 'Volunteer', 'Attendee'];
    const WORKPLACES = ['TechCorp', 'HealthInc', 'EduGreat', 'FinanceLLC', 'RetailCo', 'No Workplace'];
    const VOLUNTEER_OPPORTUNITIES = ['Annual Gala', 'Community Cleanup', 'Mentorship Program', 'Fundraising Drive'];
    const EVENT_NAMES = ['Networking Night', 'Charity Auction', 'Webinar Series', 'Annual Conference'];
    const CHURN_STATUSES = ['New', 'Increased', 'Flat', 'Decreased', 'Lapsed'];
    const GIFT_TYPES = ['Individual', 'Employee'];
    const CAMPAIGN_YEARS = [2023, 2024, 2025];
    const PAYMENT_TYPES = ['Credit Card', 'Check', 'Bank Transfer'];
    const PLEDGE_STATUSES = [{key: 'paid', label: 'Paid'}, {key: 'unpaid', label: 'Unpaid'}];
    const ALL_FIELDS = [ { key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }, { key: 'donationAmount', label: 'Donation' }, { key: 'workplace', label: 'Workplace' }, { key: 'pledgePaid', label: 'Pledge Status' }, { key: 'churnStatus', label: 'Churn Status' }, { key: 'pledgeAmount', label: 'Pledge Amount' }, { key: 'paymentAmount', label: 'Payment Amount' }, { key: 'address', label: 'Address' }, { key: 'email', label: 'Email Address' }, { key: 'phone', label: 'Phone Number' }, { key: 'volunteerHistory', label: 'Volunteer Events'}, { key: 'volunteerOppsAttended', label: 'Volunteer Opps Attended'}, { key: 'eventHistory', label: 'Event History'}, { key: 'eventsAttended', label: 'Total Events Attended'}, ];
    const GROUPABLE_FIELDS = [ { key: 'churnStatus', label: 'Churn Status' }, { key: 'workplace', label: 'Workplace' }, { key: 'giftType', label: 'Gift Type'}, { key: 'campaignYear', label: 'Campaign Year'}, { key: 'campaignType', label: 'Campaign Type'}, { key: 'paymentType', label: 'Payment Type'} ];
    const METRIC_FIELDS = [ { key: 'donationAmount', label: 'Sum of Donation Amount'}, { key: 'pledgeAmount', label: 'Sum of Pledge Amount'}, { key: 'paymentAmount', label: 'Sum of Payment Amount'}, { key: 'volunteerOppsAttended', label: 'Sum of Volunteer Opps'}, { key: 'eventsAttended', label: 'Sum of Total Events'} ];
    
    const initializeBuilderPage = () => {
        if (!getEl('reporting-sidebar')) return;

        const saveWarehouseBtn = getEl('save-warehouse-btn');
        const saveMailingListBtn = getEl('save-mailing-list-btn');
        const saveListModal = getEl('save-list-modal');
        const saveListModalTitle = getEl('save-list-modal-title');
        const saveListCount = getEl('save-list-count');
        const saveListType = getEl('save-list-type');
        const listNameInput = getEl('list-name-input');
        const saveListCancelBtn = getEl('save-list-cancel-btn');
        const saveListSaveBtn = getEl('save-list-save-btn');
        let currentListType = '';

        function openSaveListModal(type) {
            currentListType = type;
            saveListModalTitle.textContent = `Save as ${type}`;
            saveListType.textContent = type.toLowerCase();
            saveListCount.textContent = currentFilteredData.length.toLocaleString();
            listNameInput.value = '';
            saveListModal.style.display = 'flex';
            listNameInput.focus();
        }

        function closeSaveListModal() {
            saveListModal.style.display = 'none';
        }

        saveWarehouseBtn.addEventListener('click', () => openSaveListModal('Warehouse'));
        saveMailingListBtn.addEventListener('click', () => openSaveListModal('Mailing List'));
        saveListCancelBtn.addEventListener('click', closeSaveListModal);
        saveListModal.addEventListener('click', (e) => {
            if (e.target === saveListModal) {
                closeSaveListModal();
            }
        });

        saveListSaveBtn.addEventListener('click', () => {
            const listName = listNameInput.value.trim();
            if (!listName) {
                listNameInput.classList.add('border-red-500');
                setTimeout(() => listNameInput.classList.remove('border-red-500'), 1500);
                return;
            }
            
            console.log(`Saving ${currentListType}...`);
            console.log(`List Name: ${listName}`);
            console.log(`Number of records: ${currentFilteredData.length}`);
            console.log('Data:', currentFilteredData);
            
            closeSaveListModal();
        });


        allData = [];
        const generateData = (count) => { for (let i = 0; i < count; i++) { allData.push({ name: `User ${i}`, role: [USER_ROLES[i%4]], donationAmount: Math.floor(Math.random()*5000), pledgePaid: Math.random() > 0.3, churnStatus: CHURN_STATUSES[i%5]}); }};
        generateData(5000);
        
        const renderTable = () => {
            const tableHead = getEl('data-table-head');
            const tableBody = getEl('data-table-body');
            if (!tableHead || !tableBody) return;
            tableHead.innerHTML = ''; tableBody.innerHTML = '';
            const headerRow = document.createElement('tr');
            selectedFields.forEach(fieldKey => { const field = ALL_FIELDS.find(f => f.key === fieldKey); if (field) { const th = document.createElement('th'); th.className = "px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"; th.textContent = field.label; headerRow.appendChild(th); } });
            tableHead.appendChild(headerRow);
            currentFilteredData.slice(0, 200).forEach(d => { const row = document.createElement('tr'); selectedFields.forEach(fieldKey => { const td = document.createElement('td'); td.className = "px-4 py-3 whitespace-nowrap text-sm text-gray-300"; let content = d[fieldKey]; if (fieldKey === 'pledgePaid') { content = d.pledgePaid ? '<span class="text-green-400 font-semibold">Paid</span>' : '<span class="text-red-400">Unpaid</span>'; } td.innerHTML = content || 'N/A'; row.appendChild(td); }); tableBody.appendChild(row); });
        };
        const applyFilters = () => {
            currentFilteredData = allData;
            getEl('results-count').textContent = currentFilteredData.length.toLocaleString();
            renderTable();
        };
        
        const setupModal = (buttonId, modalId, doneButtonId) => {
            const button = getEl(buttonId); const modal = getEl(modalId); if (!button || !modal) return;
            getEl(doneButtonId).addEventListener('click', () => { modal.style.display = 'none'; applyFilters(); });
            button.addEventListener('click', () => modal.style.display = 'flex');
            modal.addEventListener('click', (e) => { if (e.target === modal) getEl(doneButtonId).click(); });
        };
        
        ['role', 'workplace', 'opportunity', 'event', 'pledge', 'churn', 'gift-type', 'campaign-year', 'payment-type'].forEach(type => {
            setupModal(`${type}-filter-button`, `${type}-modal`, `${type}-modal-done`);
        });
        
        applyFilters(); 
    };
    
    try {
        initializeBuilderPage();
    } catch (error) {
        console.error("An error occurred during the initialization of the 'Custom' report builder page:", error);
    }
});

