// --- MOCK DATA & DEFAULTS ---
const sampleDonors = [
    // Individuals - High Major Gift Potential
    { type: 'individual', name: 'Eleanor Vance', email: 'e.vance@example.com', donations: [{ amount: 10000, date: '2023-11-20', type: 'pledge-fulfilled' }, { amount: 5000, date: '2024-05-15', type: 'payment' }], eventAttendance: 8, volunteerHistory: [], surveyScore: 5, competitiveGifts: [{ amount: 50000, date: '2023-09-01' }], externalPhilanthropy: 150000, cultivationActions: 12, emailStats: { sent: 40, opened: 38, clicked: 25 } },
    { type: 'individual', name: 'Marcus Thorne', email: 'm.thorne@example.com', donations: [{ amount: 2500, date: '2023-03-01', type: 'payment' }, { amount: 2500, date: '2023-06-01', type: 'payment' }, { amount: 5000, date: '2024-01-10', type: 'payment' }], eventAttendance: 4, volunteerHistory: [], surveyScore: 4, competitiveGifts: [], externalPhilanthropy: 75000, cultivationActions: 8, emailStats: { sent: 35, opened: 30, clicked: 12 } },
    { type: 'individual', name: 'Liam Gallagher', email: 'liam.g@example.com', donations: [{ amount: 7500, date: '2024-02-28', type: 'payment' }], eventAttendance: 2, volunteerHistory: [], surveyScore: 5, competitiveGifts: [{ amount: 10000, date: '2023-12-15' }], externalPhilanthropy: 100000, cultivationActions: 6, emailStats: { sent: 25, opened: 22, clicked: 10 } },

    // Individuals - High Recurring Potential
    { type: 'individual', name: 'Fiona Chen', email: 'f.chen@example.com', donations: Array.from({ length: 18 }, (_, i) => ({ amount: 100, date: `2023-${Math.floor(i/1.5)+1}-${(i%2 * 14)+1}`, type: 'payment' })), eventAttendance: 6, volunteerHistory: [{ hours: 50, date: '2023-08-12' }], surveyScore: 5, competitiveGifts: [], externalPhilanthropy: 500, cultivationActions: 5, emailStats: { sent: 60, opened: 55, clicked: 30 } },
    { type: 'individual', name: 'David Miller', email: 'd.miller@example.com', donations: Array.from({ length: 24 }, (_, i) => ({ amount: 50, date: `2022-${Math.floor(i/2)+1}-${(i%2 * 15)+1}`, type: 'payment' })), eventAttendance: 2, volunteerHistory: [], surveyScore: 4, competitiveGifts: [], externalPhilanthropy: 200, cultivationActions: 2, emailStats: { sent: 50, opened: 40, clicked: 15 } },
    { type: 'individual', name: 'Chloe Kim', email: 'chloe.k@example.com', donations: [{ amount: 75, date: '2023-01-05', type: 'payment' }, { amount: 75, date: '2023-04-05', type: 'payment' }, { amount: 75, date: '2023-07-05', type: 'payment' }, { amount: 75, date: '2023-10-05', type: 'payment' }, { amount: 100, date: '2024-01-05', type: 'payment' }], eventAttendance: 7, volunteerHistory: [{ hours: 30, date: '2023-09-20' }], surveyScore: 5, competitiveGifts: [], externalPhilanthropy: 1000, cultivationActions: 9, emailStats: { sent: 45, opened: 42, clicked: 22 } },

    // Individuals - High Lapse Risk
    { type: 'individual', name: 'Olivia Martinez', email: 'o.martinez@example.com', donations: [{ amount: 500, date: '2022-02-01', type: 'payment' }], eventAttendance: 0, volunteerHistory: [], surveyScore: 2, competitiveGifts: [], externalPhilanthropy: 0, cultivationActions: 1, emailStats: { sent: 25, opened: 2, clicked: 0 } },
    { type: 'individual', name: 'George Clark', email: 'g.clark@example.com', donations: [{ amount: 100, date: '2022-05-20', type: 'pledge-unfulfilled' }], eventAttendance: 1, volunteerHistory: [], surveyScore: 3, competitiveGifts: [], externalPhilanthropy: 100, cultivationActions: 3, emailStats: { sent: 30, opened: 10, clicked: 1 } },
    { type: 'individual', name: 'Ben Carter', email: 'ben.c@example.com', donations: [{ amount: 200, date: '2021-12-15', type: 'payment' }], eventAttendance: 0, volunteerHistory: [], surveyScore: 1, competitiveGifts: [], externalPhilanthropy: 0, cultivationActions: 0, emailStats: { sent: 10, opened: 0, clicked: 0 } },
    
    // Mid-range Individuals
    { type: 'individual', name: 'Jane Doe', email: 'jane.d@example.com', donations: [{ amount: 50, date: '2023-01-15', type: 'payment' }, { amount: 75, date: '2023-07-20', type: 'payment' }, { amount: 100, date: '2024-02-10', type: 'pledge-fulfilled' }], eventAttendance: 3, volunteerHistory: [{ hours: 20, date: '2023-10-05' }], surveyScore: 4, competitiveGifts: [], externalPhilanthropy: 500, cultivationActions: 10, emailStats: { sent: 50, opened: 35, clicked: 10 } },
    { type: 'individual', name: 'John Smith', email: 'j.smith@example.com', donations: [{ amount: 1500, date: '2023-05-01', type: 'payment' }], eventAttendance: 1, volunteerHistory: [], surveyScore: 5, competitiveGifts: [{ amount: 5000, date: '2023-11-01' }], externalPhilanthropy: 25000, cultivationActions: 5, emailStats: { sent: 20, opened: 18, clicked: 5 } },
    { type: 'individual', name: 'Michael Brown', email: 'mike.b@example.com', donations: [{ amount: 250, date: '2023-11-05', type: 'payment' }, { amount: 250, date: '2024-05-10', type: 'payment' }], eventAttendance: 5, volunteerHistory: [{ hours: 100, date: '2024-01-20' }], surveyScore: 5, competitiveGifts: [], externalPhilanthropy: 1000, cultivationActions: 15, emailStats: { sent: 60, opened: 55, clicked: 25 } },
    { type: 'individual', name: 'Sophia Rodriguez', email: 'sophia.r@example.com', donations: [{ amount: 300, date: '2023-08-18', type: 'payment' }], eventAttendance: 10, volunteerHistory: [{ hours: 15, date: '2023-11-11' }], surveyScore: 4, competitiveGifts: [], externalPhilanthropy: 2000, cultivationActions: 7, emailStats: { sent: 40, opened: 33, clicked: 8 } },

    // Companies - High Major Gift Potential
    { type: 'company', name: 'Quantum Solutions', email: 'grants@quantum.com', donations: [{ amount: 100000, date: '2023-12-01', type: 'payment' }], eventAttendance: 10, volunteerHistory: [], surveyScore: 5, competitiveGifts: [], externalPhilanthropy: 2500000, cultivationActions: 15, emailStats: { sent: 20, opened: 19, clicked: 12 }, missionAlignmentGiving: 150000 },
    { type: 'company', name: 'Starlight Enterprises', email: 'foundation@starlight.com', donations: [{ amount: 25000, date: '2023-04-10', type: 'payment' }, { amount: 50000, date: '2024-04-15', type: 'pledge-fulfilled' }], eventAttendance: 8, volunteerHistory: [], surveyScore: 4, competitiveGifts: [], externalPhilanthropy: 500000, cultivationActions: 25, emailStats: { sent: 50, opened: 45, clicked: 20 }, missionAlignmentGiving: 75000 },
    { type: 'company', name: 'Apex Industries', email: 'community@apex.com', donations: [{ amount: 75000, date: '2024-03-20', type: 'payment' }], eventAttendance: 5, volunteerHistory: [], surveyScore: 5, competitiveGifts: [], externalPhilanthropy: 1200000, cultivationActions: 18, emailStats: { sent: 30, opened: 28, clicked: 18 }, missionAlignmentGiving: 100000 },

    // Companies - High Lapse Risk
    { type: 'company', name: 'Legacy Systems', email: 'contact@legacy.com', donations: [{ amount: 2000, date: '2022-01-15', type: 'payment' }], eventAttendance: 1, volunteerHistory: [], surveyScore: 2, competitiveGifts: [], externalPhilanthropy: 5000, cultivationActions: 2, emailStats: { sent: 15, opened: 1, clicked: 0 }, missionAlignmentGiving: 0 },
    { type: 'company', name: 'Coastline Logistics', email: 'outreach@coastline.com', donations: [{ amount: 1500, date: '2022-03-30', type: 'pledge-unfulfilled' }], eventAttendance: 0, volunteerHistory: [], surveyScore: 3, competitiveGifts: [], externalPhilanthropy: 10000, cultivationActions: 4, emailStats: { sent: 20, opened: 5, clicked: 1 }, missionAlignmentGiving: 1000 },
    { type: 'company', name: 'Horizon Manufacturing', email: 'info@horizonmfg.com', donations: [{ amount: 3000, date: '2021-11-01', type: 'payment' }], eventAttendance: 2, volunteerHistory: [], surveyScore: 2, competitiveGifts: [], externalPhilanthropy: 8000, cultivationActions: 1, emailStats: { sent: 12, opened: 2, clicked: 0 }, missionAlignmentGiving: 500 },

    // Mid-range Companies
    { type: 'company', name: 'Innovate Corp.', email: 'contact@innovate.com', donations: [{ amount: 5000, date: '2023-06-01', type: 'payment' }, { amount: 7500, date: '2024-06-15', type: 'pledge-fulfilled' }], eventAttendance: 5, volunteerHistory: [], surveyScore: 5, competitiveGifts: [], externalPhilanthropy: 50000, cultivationActions: 20, emailStats: { sent: 40, opened: 30, clicked: 15 }, missionAlignmentGiving: 10000 },
    { type: 'company', name: 'Global Solutions Ltd.', email: 'info@globalsolutions.com', donations: [{ amount: 1000, date: '2022-09-20', type: 'payment' }], eventAttendance: 2, volunteerHistory: [], surveyScore: 3, competitiveGifts: [{ amount: 5000, date: '2023-10-10' }], externalPhilanthropy: 10000, cultivationActions: 12, emailStats: { sent: 25, opened: 10, clicked: 1 }, missionAlignmentGiving: 0 },
    { type: 'company', name: 'Tech Giants LLC', email: 'outreach@techgiants.com', donations: [{ amount: 25000, date: '2023-12-15', type: 'payment' }], eventAttendance: 3, volunteerHistory: [], surveyScore: 5, competitiveGifts: [], externalPhilanthropy: 1000000, cultivationActions: 8, emailStats: { sent: 15, opened: 14, clicked: 7 }, missionAlignmentGiving: 50000 },
    { type: 'company', name: 'Pioneer Builders', email: 'contact@pioneer.com', donations: [{ amount: 10000, date: '2024-02-01', type: 'payment' }], eventAttendance: 6, volunteerHistory: [], surveyScore: 4, competitiveGifts: [], externalPhilanthropy: 60000, cultivationActions: 10, emailStats: { sent: 33, opened: 25, clicked: 11 }, missionAlignmentGiving: 2500 },
];
const defaultSettings = {
    majorGift: { largePaymentWeight: 30, highTotalPaymentWeight: 20, pledgeFulfillmentWeight: 15, externalGivingWeight: 15, emailEngagementWeight: 10, movesManagementWeight: 5, missionAlignmentWeight: 40 },
    lapseRisk: { lastEngagementWeight: 40, emailDisengagementWeight: 30, unfulfilledPledgeWeight: 20, lowSurveyScoreWeight: 10 },
    recurringPotential: { consistencyWeight: 30, frequencyWeight: 25, emailEngagementWeight: 20, volunteerWeight: 15, sweetSpotWeight: 10 }
};

// --- GLOBAL STATE & ELEMENTS ---
let allDonors = [];
let currentSettings = JSON.parse(localStorage.getItem('forecasterSettings')) || JSON.parse(JSON.stringify(defaultSettings));

// --- SCORING ALGORITHM ---
const calculateScores = (donor, settings) => {
    const scores = { majorGift: 0, lapseRisk: 0, recurringPotential: 0 };
    const now = new Date();
    const mg = settings.majorGift;
    const lr = settings.lapseRisk;
    const rp = settings.recurringPotential;

    const payments = donor.donations.filter(d => d.type === 'payment' || d.type === 'pledge-fulfilled');
    const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
    const largestPayment = Math.max(0, ...payments.map(p => p.amount));
    const totalExternalGiving = (donor.externalPhilanthropy || 0) + (donor.competitiveGifts || []).reduce((sum, g) => sum + g.amount, 0);
    const emailEngagementRate = donor.emailStats.sent > 0 ? (donor.emailStats.opened + donor.emailStats.clicked) / (donor.emailStats.sent * 2) : 0;
    
    let majorGiftScore = 0;
    const scale = donor.type === 'company' ? 10 : 1;
    if (largestPayment > 5000 * scale) majorGiftScore += mg.largePaymentWeight;
    else if (largestPayment > 1000 * scale) majorGiftScore += mg.largePaymentWeight / 2;
    if (totalPayments > 10000 * scale) majorGiftScore += mg.highTotalPaymentWeight;
    else if (totalPayments > 2500 * scale) majorGiftScore += mg.highTotalPaymentWeight / 2;
    const fulfilled = donor.donations.filter(d => d.type === 'pledge-fulfilled').length;
    const unfulfilled = donor.donations.filter(d => d.type === 'pledge-unfulfilled').length;
    const fulfillmentRate = (fulfilled + unfulfilled) > 0 ? fulfilled / (fulfilled + unfulfilled) : 0;
    if (fulfillmentRate > 0.8) majorGiftScore += mg.pledgeFulfillmentWeight;
    if (totalExternalGiving > 25000 * scale) majorGiftScore += mg.externalGivingWeight;
    else if (totalExternalGiving > 5000 * scale) majorGiftScore += mg.externalGivingWeight / 2;
    if (emailEngagementRate > 0.7) majorGiftScore += mg.emailEngagementWeight;
    const movesEffectiveness = donor.cultivationActions > 0 ? totalPayments / donor.cultivationActions : 0;
    if (movesEffectiveness > 100 * scale) majorGiftScore += mg.movesManagementWeight;
    if (donor.type === 'company' && (donor.missionAlignmentGiving || 0) > 0) {
        majorGiftScore += Math.min(mg.missionAlignmentWeight, (donor.missionAlignmentGiving / 10000) * mg.missionAlignmentWeight);
    }
    scores.majorGift = Math.min(100, Math.max(1, Math.round(majorGiftScore)));

    let lapseRiskScore = 0;
    const allEngagements = [ ...donor.donations.map(d => new Date(d.date).getTime()), ...(donor.volunteerHistory || []).map(v => new Date(v.date).getTime())];
    const lastEngagementDate = allEngagements.length > 0 ? new Date(Math.max(...allEngagements)) : null;
    if (lastEngagementDate) {
        const daysSince = (now - lastEngagementDate) / (1000 * 3600 * 24);
        if (daysSince > 540) lapseRiskScore += lr.lastEngagementWeight;
        else if (daysSince > 365) lapseRiskScore += lr.lastEngagementWeight / 2;
    } else {
        lapseRiskScore = 50;
    }
    if (emailEngagementRate < 0.1 && donor.emailStats.sent > 10) lapseRiskScore += lr.emailDisengagementWeight;
    if (unfulfilled > 0) lapseRiskScore += lr.unfulfilledPledgeWeight * unfulfilled;
    if (donor.surveyScore < 3) lapseRiskScore += lr.lowSurveyScoreWeight;
    scores.lapseRisk = Math.min(100, Math.max(1, Math.round(lapseRiskScore)));

    if (donor.type === 'individual') {
        let recurringScore = 0;
        const donationCount = payments.length;
        if (donationCount > 1) {
            const dates = payments.map(p => new Date(p.date).getTime()).sort((a,b) => a-b);
            const intervals = dates.slice(1).map((d, i) => (d - dates[i]) / (1000 * 3600 * 24));
            const avgInterval = intervals.reduce((s, v) => s + v, 0) / intervals.length;
            const stdDev = Math.sqrt(intervals.map(x => Math.pow(x - avgInterval, 2)).reduce((a, b) => a + b) / intervals.length);
            if (stdDev < 30 && avgInterval < 100) recurringScore += rp.consistencyWeight;
        }
        if (donationCount > 4) recurringScore += rp.frequencyWeight;
        if (emailEngagementRate > 0.75) recurringScore += rp.emailEngagementWeight;
        if (donor.volunteerHistory.length > 0) recurringScore += rp.volunteerWeight;
        const avgPayment = donationCount > 0 ? totalPayments / donationCount : 0;
        if (avgPayment > 25 && avgPayment < 150) recurringScore += rp.sweetSpotWeight;
        scores.recurringPotential = Math.min(100, Math.max(0, Math.round(recurringScore)));
    } else {
        scores.recurringPotential = 0;
    }
    return scores;
};


// --- RENDER FUNCTIONS ---
const renderApp = (state, container) => {
    const { donors, loading, error, searchTerm, sortConfig, donorType, chartFilter } = state;
    
    let filteredDonors = donors.filter(d => d.type === donorType);
    if (chartFilter) {
        filteredDonors = filteredDonors.filter(donor => {
            const score = donor.scores[chartFilter.category];
            if (chartFilter.segmentName === 'Low (<30)') return score < 30;
            if (chartFilter.segmentName === 'Medium (30-70)') return score >= 30 && score <= 70;
            if (chartFilter.segmentName === 'High (>70)') return score > 70;
            return true;
        });
    }
    if (searchTerm) {
        filteredDonors = filteredDonors.filter(donor => donor.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    filteredDonors.sort((a, b) => {
        const keys = sortConfig.key.split('.');
        const valA = keys.reduce((o, k) => (o || {})[k], a);
        const valB = keys.reduce((o, k) => (o || {})[k], b);
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
    });

    container.innerHTML = `
        <div class="forecaster-card">
            <div class="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div class="flex items-center gap-4">
                    <h2 class="text-xl font-semibold text-gray-200">${donorType === 'individual' ? 'Individual Donors' : 'Corporate Donors'} (${filteredDonors.length})</h2>
                    ${chartFilter ? `<button id="clear-chart-filter" class="flex items-center text-sm bg-primary/20 text-primary font-bold py-1 px-3 rounded-full transition-colors hover:bg-primary/30"><i class="fa-solid fa-times-circle mr-2"></i>Clear Filter: ${chartFilter.segmentName}</button>` : ''}
                </div>
                <div class="flex items-center gap-4">
                    <div class="forecaster-toggle-button">
                        <button id="toggle-individual" class="${donorType === 'individual' ? 'active' : ''}"><i class="fa-solid fa-user mr-2"></i>Individuals</button>
                        <button id="toggle-company" class="${donorType === 'company' ? 'active' : ''}"><i class="fa-solid fa-building mr-2"></i>Companies</button>
                    </div>
                    <input type="text" id="search-input" placeholder="Search by name..." class="filter-input" value="${searchTerm}">
                    <button id="settings-btn" class="text-gray-400 hover:text-white transition-colors"><i class="fa-solid fa-cog text-xl"></i></button>
                </div>
            </div>
            ${renderTable(filteredDonors, sortConfig, donorType)}
        </div>
    `;
};

const renderTable = (donors, sortConfig, donorType) => {
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return '';
        return sortConfig.direction === 'ascending' ? '<i class="fa-solid fa-chevron-up ml-1"></i>' : '<i class="fa-solid fa-chevron-down ml-1"></i>';
    };
    const scorePill = (score) => {
        let colorClass = 'bg-red-900/50 text-red-300';
        if (score > 70) colorClass = 'bg-green-900/50 text-green-300';
        else if (score > 30) colorClass = 'bg-yellow-900/50 text-yellow-300';
        return `<span class="px-3 py-1 text-sm font-semibold rounded-full ${colorClass}">${score}</span>`;
    };

    return `
        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead class="border-b border-gray-700">
                    <tr>
                        <th class="p-4 cursor-pointer text-gray-400 font-semibold" data-sort="name">${donorType === 'individual' ? 'Name' : 'Company Name'} ${getSortIcon('name')}</th>
                        <th class="p-4 cursor-pointer text-center text-gray-400 font-semibold" data-sort="scores.majorGift">Major Gift ${getSortIcon('scores.majorGift')}</th>
                        <th class="p-4 cursor-pointer text-center text-gray-400 font-semibold" data-sort="scores.lapseRisk">Lapse Risk ${getSortIcon('scores.lapseRisk')}</th>
                        ${donorType === 'individual' ? `<th class="p-4 cursor-pointer text-center text-gray-400 font-semibold" data-sort="scores.recurringPotential">Recurring Potential ${getSortIcon('scores.recurringPotential')}</th>` : ''}
                        <th class="p-4 text-center text-gray-400 font-semibold">Total Paid</th>
                    </tr>
                </thead>
                <tbody>
                    ${donors.map(donor => `
                        <tr class="border-b border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer" data-donor-id="${donor.id}">
                            <td class="p-4 font-medium text-gray-200">${donor.name} <br/><span class="text-xs text-gray-500">${donor.email}</span></td>
                            <td class="p-4 text-center">${scorePill(donor.scores?.majorGift || 0)}</td>
                            <td class="p-4 text-center">${scorePill(donor.scores?.lapseRisk || 0)}</td>
                            ${donorType === 'individual' ? `<td class="p-4 text-center">${scorePill(donor.scores?.recurringPotential || 0)}</td>` : ''}
                            <td class="p-4 text-center text-green-400 font-semibold">$${donor.donations.filter(d => d.type === 'payment' || d.type === 'pledge-fulfilled').reduce((sum, d) => sum + d.amount, 0).toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ${donors.length === 0 ? '<p class="text-center py-8 text-gray-500">No donors found.</p>' : ''}
        </div>
    `;
};

// --- MAIN APP LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    
    const appContainer = document.getElementById('forecaster-app-container');
    const settingsModal = document.getElementById('settings-modal');
    const settingsForm = document.getElementById('settings-form');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelSettingsBtn = document.getElementById('cancel-settings-btn');
    const resetSettingsBtn = document.getElementById('reset-settings-btn');

    if (!appContainer || !settingsModal) {
        console.error("Initialization failed: A required container element is missing.");
        return;
    }

    let state = {
        donors: [],
        loading: true,
        error: null,
        searchTerm: '',
        sortConfig: { key: 'scores.majorGift', direction: 'descending' },
        donorType: 'individual',
        chartFilter: null,
    };

    function setState(newState) {
        state = { ...state, ...newState };
        renderApp(state, appContainer);
    }

    function handleSort(key) {
        let direction = 'ascending';
        if (state.sortConfig.key === key && state.sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setState({ sortConfig: { key, direction } });
    }
    
    // --- SETTINGS MODAL LOGIC ---
    function showSettingsModal() {
        populateSettingsForm();
        settingsModal.classList.remove('hidden');
    }

    function hideSettingsModal() {
        settingsModal.classList.add('hidden');
    }

    function populateSettingsForm() {
        for (const category in currentSettings) {
            for (const key in currentSettings[category]) {
                const input = settingsForm.querySelector(`[name="${category}.${key}"]`);
                if (input) {
                    input.value = currentSettings[category][key];
                    input.dispatchEvent(new Event('input'));
                }
            }
        }
    }

    function handleSaveSettings(e) {
        e.preventDefault();
        const formData = new FormData(settingsForm);
        const newSettings = JSON.parse(JSON.stringify(defaultSettings));

        for (let [key, value] of formData.entries()) {
            const [category, setting] = key.split('.');
            newSettings[category][setting] = parseInt(value, 10);
        }
        
        currentSettings = newSettings;
        localStorage.setItem('forecasterSettings', JSON.stringify(currentSettings));
        
        recalculateAllScores();
        setState({ donors: allDonors });
        hideSettingsModal();
    }

    function recalculateAllScores() {
        allDonors = allDonors.map(donor => {
            const newScores = calculateScores(donor, currentSettings);
            return { ...donor, scores: newScores };
        });
    }

    // --- INITIALIZATION ---
    try {
        const processedDonors = sampleDonors.map((donor, index) => {
            const scores = calculateScores(donor, currentSettings);
            return {
                id: `local-${index}`,
                ...donor,
                scores
            };
        });

        allDonors = processedDonors;
        setState({ donors: allDonors, loading: false });

    } catch (err) {
        console.error("Initialization failed:", err);
        setState({ loading: false, error: "Failed to initialize application." });
    }

    // --- EVENT LISTENERS ---
    appContainer.addEventListener('click', (e) => {
        const sortHeader = e.target.closest('[data-sort]');
        if (sortHeader) {
            handleSort(sortHeader.dataset.sort);
            return;
        }
        
        const targetId = e.target.id || e.target.closest('button')?.id;
        switch(targetId) {
            case 'toggle-individual':
                setState({ donorType: 'individual' });
                break;
            case 'toggle-company':
                setState({ donorType: 'company' });
                break;
            case 'clear-chart-filter':
                setState({ chartFilter: null });
                break;
            case 'settings-btn':
                showSettingsModal();
                break;
        }
    });

    appContainer.addEventListener('input', (e) => {
        if (e.target.id === 'search-input') {
            setState({ searchTerm: e.target.value });
        }
    });

    settingsForm.addEventListener('submit', handleSaveSettings);
    closeModalBtn.addEventListener('click', hideSettingsModal);
    cancelSettingsBtn.addEventListener('click', hideSettingsModal);

    resetSettingsBtn.addEventListener('click', () => {
        currentSettings = JSON.parse(JSON.stringify(defaultSettings));
        populateSettingsForm();
    });

    settingsForm.addEventListener('input', (e) => {
        if (e.target.type === 'range') {
            const display = e.target.nextElementSibling;
            if (display) {
                display.textContent = e.target.value;
            }
        }
    });
});
