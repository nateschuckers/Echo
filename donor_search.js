document.addEventListener('DOMContentLoaded', function() {
    const accountData = [
        { id: 1, name: 'Alex Doe', type: 'individual', employer: 'Tech Solutions Inc.', tags: ['Board Member', 'Major Donor'], leadership: "Patron's Circle", search: "alex doe tech solutions inc board member major donor patron's circle" },
        { id: 2, name: 'Tech Solutions Inc.', type: 'organization', tags: ['Corporate Partner', 'Workplace Campaign'], leadership: "Benefactor's Circle", search: "tech solutions inc corporate partner workplace campaign benefactor's circle" },
        { id: 3, name: 'Jane Smith', type: 'individual', employer: 'Innovate Corp', tags: ['Major Donor', 'Volunteer'], leadership: "Director's Circle", search: "jane smith innovate corp major donor volunteer director's circle" },
        { id: 4, name: 'Anytown Community Foundation', type: 'organization', tags: ['Agency', 'Grantee'], leadership: "", search: "anytown community foundation agency grantee" },
        { id: 5, name: 'John Davis', type: 'individual', employer: 'Self-Employed', tags: ['Volunteer'], leadership: "", search: "john davis self-employed volunteer" },
        { id: 6, name: 'Innovate Corp', type: 'organization', tags: ['Corporate Partner'], leadership: "", search: "innovate corp corporate partner" }
    ];

    function toggleFilters() {
        const filterContainer = document.getElementById('filter-container');
        const filterToggleText = document.getElementById('filter-toggle-text');
        if (filterContainer.style.maxHeight && filterContainer.style.maxHeight !== '0px') {
            filterContainer.style.maxHeight = '0px';
            filterToggleText.textContent = 'Show Filters';
        } else {
            filterContainer.style.maxHeight = filterContainer.scrollHeight + "px";
            filterToggleText.textContent = 'Hide Filters';
        }
    }

    function filterAccounts() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const accountType = document.querySelector('#account-type-filters .bg-primary').dataset.type;
        const employer = document.getElementById('employer').value.toLowerCase();
        const leadership = document.getElementById('leadership-level').value;
        const tag = document.getElementById('tag').value;
        
        const visibleCards = accountData.filter(card => {
            const matchesSearch = card.search.includes(searchTerm);
            const matchesType = accountType === 'all' || card.type === accountType;
            const matchesEmployer = !employer || (card.employer && card.employer.toLowerCase().includes(employer));
            const matchesLeadership = leadership === 'All' || card.leadership === leadership;
            const matchesTag = tag === 'All' || card.tags.includes(tag);
            
            return matchesSearch && matchesType && matchesEmployer && matchesLeadership && matchesTag;
        });

        renderAccountCards(visibleCards);
        
        const resultsCount = document.getElementById('results-count');
        const noResultsMessage = document.getElementById('no-results-message');
        const accountsContainer = document.getElementById('accounts-container');
        
        resultsCount.textContent = `Showing ${visibleCards.length} of ${accountData.length} results.`;
        
        if (visibleCards.length === 0) {
            noResultsMessage.classList.remove('hidden');
            accountsContainer.classList.add('hidden');
        } else {
            noResultsMessage.classList.add('hidden');
            accountsContainer.classList.remove('hidden');
        }
    }
    
    function renderAccountCards(cards, view = 'grid') {
        const accountsContainer = document.getElementById('accounts-container');
        accountsContainer.innerHTML = '';
        
        if (view === 'grid') {
            accountsContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
        } else {
            accountsContainer.className = 'space-y-4';
        }

        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'account-card bg-gray-800 rounded-lg shadow-sm border border-gray-700 cursor-pointer hover:shadow-lg transition-shadow';
            cardElement.dataset.accountId = card.id;
            cardElement.dataset.accountName = card.name;
            cardElement.dataset.accountType = card.type;
            
            const icon = card.type === 'individual' 
                ? `<svg class="w-6 h-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>`
                : `<svg class="w-6 h-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v-3.75a.75.75 0 01.75-.75z" /></svg>`;
            
            const iconBg = card.type === 'individual' ? 'bg-blue-900' : 'bg-green-900';

            if (view === 'grid') {
                cardElement.innerHTML = `
                    <div class="p-6">
                        <div class="flex items-center space-x-4 mb-4">
                            <div class="w-12 h-12 rounded-full ${iconBg} flex items-center justify-center shrink-0">${icon}</div>
                            <div>
                                <h3 class="text-xl font-bold text-gray-200">${card.name}</h3>
                                ${card.employer ? `<p class="text-sm text-gray-400">${card.employer}</p>` : ''}
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${card.tags.map(tag => `<span class="bg-gray-700 text-xs font-medium px-2.5 py-1 rounded-full text-gray-200">${tag}</span>`).join('')}
                        </div>
                        ${card.leadership ? `<p class="text-sm text-gray-400">Leadership Level: <span class="font-semibold text-primary">${card.leadership}</span></p>` : ''}
                    </div>
                `;
            } else { // List View
                 cardElement.innerHTML = `
                    <div class="p-4 flex items-center space-x-4">
                        <div class="w-10 h-10 rounded-full ${iconBg} flex items-center justify-center shrink-0">${icon}</div>
                        <div class="flex-grow grid grid-cols-3 gap-4 items-center">
                            <div>
                                <h3 class="font-bold text-gray-200">${card.name}</h3>
                                ${card.employer ? `<p class="text-sm text-gray-400">${card.employer}</p>` : ''}
                            </div>
                            <div class="flex flex-wrap gap-1">
                                ${card.tags.map(tag => `<span class="bg-gray-700 text-xs font-medium px-2 py-0.5 rounded-full text-gray-200">${tag}</span>`).join('')}
                            </div>
                            ${card.leadership ? `<p class="text-sm text-gray-400">Leadership: <span class="font-semibold text-primary">${card.leadership}</span></p>` : '<div></div>'}
                        </div>
                    </div>
                `;
            }
            accountsContainer.appendChild(cardElement);
        });
    }

    // --- EVENT LISTENERS ---
    
    // ** New, simplified click listener for the whole container **
    document.getElementById('accounts-container').addEventListener('click', (e) => {
        const cardElement = e.target.closest('.account-card');
        if (cardElement) {
            const accountType = cardElement.dataset.accountType;
            const page = accountType === 'organization' ? 'account_profile.html' : 'individual_profile.html';
            
            window.parent.postMessage({ 
                type: 'navigate', 
                page: page,
                accountName: cardElement.dataset.accountName,
                accountType: accountType
            }, '*');
        }
    });
    
    const searchInput = document.getElementById('search-input');
    const filterToggle = document.getElementById('filter-toggle');
    const gridViewBtn = document.getElementById('grid-view-btn');
    const listViewBtn = document.getElementById('list-view-btn');
    const accountTypeButtons = document.querySelectorAll('.account-type-btn');
    const filterInputs = document.querySelectorAll('.filter-input');

    if (searchInput) searchInput.addEventListener('input', filterAccounts);
    if (filterToggle) filterToggle.addEventListener('click', toggleFilters);

    accountTypeButtons.forEach(button => {
        button.addEventListener('click', () => {
            accountTypeButtons.forEach(btn => {
                btn.classList.remove('bg-primary', 'text-primary-foreground');
                btn.classList.add('text-gray-200');
            });
            button.classList.add('bg-primary', 'text-primary-foreground');
            button.classList.remove('text-gray-200');
            filterAccounts();
        });
    });

    filterInputs.forEach(input => {
        input.addEventListener('change', filterAccounts);
    });

    if (gridViewBtn) gridViewBtn.addEventListener('click', () => {
        renderAccountCards(accountData, 'grid');
        gridViewBtn.classList.add('bg-primary', 'text-primary-foreground');
        listViewBtn.classList.remove('bg-primary', 'text-primary-foreground');
    });
    if (listViewBtn) listViewBtn.addEventListener('click', () => {
        renderAccountCards(accountData, 'list');
        listViewBtn.classList.add('bg-primary', 'text-primary-foreground');
        gridViewBtn.classList.remove('bg-primary', 'text-primary-foreground');
    });

    renderAccountCards(accountData, 'grid');
});


