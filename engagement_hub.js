document.addEventListener('DOMContentLoaded', function() {
    // --- DATA ---
    let eventsData = [
        { name: 'Annual Charity Gala', date: '2025-09-15T19:00:00', capacity: 200, icon: 'fa-ticket', color: 'purple', attendeeList: [{name: 'Jane Doe', email: 'jane.d@example.com'}, {name: 'John Smith', email: 'j.smith@example.com'}] },
        { name: 'Leadership Breakfast', date: '2025-10-05T08:00:00', capacity: 50, icon: 'fa-calendar-day', color: 'yellow', attendeeList: [{name: 'Emily White', email: 'emily.w@example.com'}] },
        { name: 'Community Cleanup Day', date: '2025-09-28T09:00:00', capacity: 100, icon: 'fa-recycle', color: 'green', attendeeList: [] },
        { name: 'Holiday Toy Drive Kickoff', date: '2025-11-01T18:00:00', capacity: 150, icon: 'fa-gifts', color: 'red', attendeeList: [] },
        { name: 'Tech Summit 2025', date: '2025-11-15T09:00:00', capacity: 300, icon: 'fa-microphone', color: 'blue', attendeeList: [] },
        { name: 'Summer Picnic', date: '2025-08-10T12:00:00', capacity: 120, icon: 'fa-sun', color: 'orange', attendeeList: [] },
        { name: 'Art Workshop', date: '2025-10-20T14:00:00', capacity: 30, icon: 'fa-paint-brush', color: 'pink', attendeeList: [] }
    ];

    let opportunitiesData = [
        { name: 'Community Garden Cleanup', agency: 'Local Food Bank', date: '2025-09-20T09:00:00', hours: 4, capacity: 15, icon: 'fa-seedling', color: 'green', volunteerList: [{name: 'Peter Jones', email: 'pete@example.com'}] },
        { name: 'Reading Program Tutor', agency: 'Anytown Library', date: '2025-10-12T14:00:00', hours: 2, capacity: 12, icon: 'fa-book-open', color: 'blue', volunteerList: [] },
        { name: 'Gala Setup Crew', agency: 'Annual Charity Gala', date: '2025-09-15T14:00:00', hours: 5, capacity: 20, icon: 'fa-tools', color: 'orange', volunteerList: [] },
        { name: 'Toy Drive Sorter', agency: 'Holiday Toy Drive', date: '2025-11-02T10:00:00', hours: 3, capacity: 25, icon: 'fa-box-open', color: 'red', volunteerList: [] },
        { name: 'Animal Shelter Assistant', agency: 'County Animal Shelter', date: '2025-11-08T11:00:00', hours: 4, capacity: 10, icon: 'fa-paw', color: 'brown', volunteerList: [] },
        { name: 'Museum Guide', agency: 'History Museum', date: '2025-10-25T10:00:00', hours: 3, capacity: 8, icon: 'fa-landmark', color: 'purple', volunteerList: [] },
        { name: 'Trail Maintenance', agency: 'State Parks Dept.', date: '2025-09-06T08:00:00', hours: 6, capacity: 30, icon: 'fa-tree', color: 'green', volunteerList: [] }
    ];

    // --- ELEMENTS ---
    const mainHubView = document.getElementById('main-hub-view');
    const detailView = document.getElementById('detail-view');
    const searchInput = document.getElementById('engagement-search');
    const eventsContainer = document.getElementById('events-list-container');
    const opportunitiesContainer = document.getElementById('opportunities-list-container');

    // Modals
    const addEventModal = document.getElementById('add-event-modal');
    const addOpportunityModal = document.getElementById('add-opportunity-modal');
    const addAttendeeModal = document.getElementById('add-attendee-modal');
    const addVolunteerModal = document.getElementById('add-volunteer-modal');
    
    // Buttons
    const addEventBtn = document.getElementById('add-event-btn');
    const addOpportunityBtn = document.getElementById('add-opportunity-btn');
    const backToHubBtn = document.getElementById('back-to-hub-btn');
    const addPersonFromDetailBtn = document.getElementById('add-person-from-detail-btn');

    // --- FUNCTIONS ---

    function calculateStats() {
        const totalEvents = eventsData.length;
        const totalAttendees = eventsData.reduce((sum, event) => sum + event.attendeeList.length, 0);
        const totalVolunteers = opportunitiesData.reduce((sum, opp) => sum + opp.volunteerList.length, 0);
        const totalHours = opportunitiesData.reduce((sum, opp) => sum + (opp.volunteerList.length * opp.hours), 0);
        const valueOfHours = totalHours * 35; 

        document.getElementById('total-events').textContent = totalEvents;
        document.getElementById('total-attendees').textContent = totalAttendees.toLocaleString();
        document.getElementById('total-volunteers').textContent = totalVolunteers.toLocaleString();
        document.getElementById('total-hours').textContent = totalHours.toLocaleString();
        document.getElementById('value-of-hours').textContent = '$' + valueOfHours.toLocaleString();
    }

    function renderEvents(events) {
        eventsContainer.innerHTML = '';
        if (events.length === 0) {
            eventsContainer.innerHTML = `<p class="text-gray-400 text-center py-4">No events found.</p>`;
            return;
        }
        events.forEach(event => {
            const item = document.createElement('div');
            item.className = 'engagement-item';
            item.dataset.name = event.name;
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            const isFull = event.attendeeList.length >= event.capacity;

            item.innerHTML = `
                <div class="engagement-icon bg-${event.color}-900/50 text-${event.color}-400"><i class="fa-solid ${event.icon}"></i></div>
                <div class="flex-grow">
                    <p class="font-semibold">${event.name}</p>
                    <p class="text-sm text-gray-400">${formattedDate} at ${formattedTime}</p>
                </div>
                <div class="text-right flex flex-col items-end">
                    <p class="font-semibold text-sm ${isFull ? 'text-red-400' : ''}">${event.attendeeList.length} / ${event.capacity} Attendees</p>
                    <button data-event-name="${event.name}" class="add-attendee-btn text-xs ${isFull ? 'text-gray-500 cursor-not-allowed' : 'text-blue-400 hover:text-blue-300'} mt-1 transition-colors" ${isFull ? 'disabled' : ''}>
                        <i class="fa-solid fa-user-plus mr-1"></i>Add Attendee
                    </button>
                </div>
            `;
            eventsContainer.appendChild(item);
        });
    }

    function renderOpportunities(opportunities) {
        opportunitiesContainer.innerHTML = '';
         if (opportunities.length === 0) {
            opportunitiesContainer.innerHTML = `<p class="text-gray-400 text-center py-4">No opportunities found.</p>`;
            return;
        }
        opportunities.forEach(opp => {
            const item = document.createElement('div');
            item.className = 'engagement-item';
            item.dataset.name = opp.name;
            const isFull = opp.volunteerList.length >= opp.capacity;
            
            item.innerHTML = `
                <div class="engagement-icon bg-${opp.color}-900/50 text-${opp.color}-400"><i class="fa-solid ${opp.icon}"></i></div>
                <div class="flex-grow">
                    <p class="font-semibold">${opp.name}</p>
                    <p class="text-sm text-gray-400">${opp.agency}</p>
                </div>
                <div class="text-right flex flex-col items-end">
                    <p class="font-semibold text-sm ${isFull ? 'text-red-400' : ''}">${opp.volunteerList.length} / ${opp.capacity} Volunteers</p>
                     <button data-opportunity-name="${opp.name}" class="add-volunteer-btn text-xs ${isFull ? 'text-gray-500 cursor-not-allowed' : 'text-blue-400 hover:text-blue-300'} mt-1 transition-colors" ${isFull ? 'disabled' : ''}>
                        <i class="fa-solid fa-user-plus mr-1"></i>Add Volunteer
                     </button>
                </div>
            `;
            opportunitiesContainer.appendChild(item);
        });
    }

    function filterAndRender() {
        const lowerCaseSearchTerm = searchInput.value.toLowerCase();
        const sortedEvents = [...eventsData].sort((a, b) => new Date(b.date) - new Date(a.date));
        const sortedOpportunities = [...opportunitiesData].sort((a, b) => new Date(b.date) - new Date(a.date));
        const filteredEvents = sortedEvents.filter(event => event.name.toLowerCase().includes(lowerCaseSearchTerm));
        const filteredOpportunities = sortedOpportunities.filter(opp => opp.name.toLowerCase().includes(lowerCaseSearchTerm) || opp.agency.toLowerCase().includes(lowerCaseSearchTerm));
        renderEvents(filteredEvents);
        renderOpportunities(filteredOpportunities);
    }
    
    function updateDisplay() {
        filterAndRender();
        calculateStats();
    }

    function showDetailView(itemName, type) {
        const item = type === 'event' 
            ? eventsData.find(e => e.name === itemName)
            : opportunitiesData.find(o => o.name === itemName);
        
        if (!item) return;

        // Populate detail view
        document.getElementById('detail-title').textContent = item.name;
        const itemDate = new Date(item.date);
        document.getElementById('detail-datetime').textContent = `${itemDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${itemDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;

        const detailList = document.getElementById('detail-list');
        detailList.innerHTML = '';
        
        let listData, capacity, label, personType;

        if (type === 'event') {
            document.getElementById('detail-subtitle').textContent = 'Event Details';
            document.getElementById('detail-hours-container').classList.add('hidden');
            listData = item.attendeeList;
            capacity = item.capacity;
            label = 'Attendees';
            personType = 'Attendee';
        } else { // opportunity
            document.getElementById('detail-subtitle').textContent = item.agency;
            document.getElementById('detail-hours-container').classList.remove('hidden');
            document.getElementById('detail-hours').textContent = `${item.hours} hours per volunteer`;
            listData = item.volunteerList;
            capacity = item.capacity;
            label = 'Volunteers';
            personType = 'Volunteer';
        }
        
        // Stats
        document.getElementById('detail-stat-label').textContent = label;
        document.getElementById('detail-stat-value').textContent = `${listData.length} / ${capacity}`;
        const progress = capacity > 0 ? (listData.length / capacity) * 100 : 0;
        document.getElementById('detail-progress-bar').style.width = `${progress}%`;

        // Add person button
        const addPersonBtnText = document.getElementById('add-person-from-detail-btn-text');
        addPersonFromDetailBtn.dataset.name = item.name;
        addPersonFromDetailBtn.dataset.type = type;
        addPersonBtnText.textContent = `Add ${personType}`;

        // Person list
        document.getElementById('detail-list-label').textContent = `${label} List`;
        if (listData.length === 0) {
            detailList.innerHTML = `<p class="p-4 text-gray-400 text-center">No ${label.toLowerCase()} have been added yet.</p>`;
        } else {
            listData.forEach(person => {
                const personEl = document.createElement('div');
                personEl.className = 'p-4 border-b border-gray-700/50 flex justify-between items-center';
                personEl.innerHTML = `
                    <div>
                        <p class="font-semibold">${person.name}</p>
                        <p class="text-sm text-gray-400">${person.email}</p>
                    </div>
                `;
                detailList.appendChild(personEl);
            });
        }

        mainHubView.classList.add('hidden');
        detailView.classList.remove('hidden');
    }

    // --- MODAL HANDLING ---
    function showModal(modal) { modal.classList.remove('hidden'); }
    function hideModal(modal) { modal.classList.add('hidden'); }
    
    [addEventModal, addOpportunityModal, addAttendeeModal, addVolunteerModal].forEach(modal => {
        modal.addEventListener('click', (e) => { if (e.target === modal) hideModal(modal); });
        document.getElementById(`cancel-${modal.id.split('-')[1]}-modal`).addEventListener('click', () => hideModal(modal));
    });

    // --- FORM SUBMISSIONS ---
    addEventForm.addEventListener('submit', (e) => { e.preventDefault(); /* ... same as before ... */ });
    addOpportunityForm.addEventListener('submit', (e) => { e.preventDefault(); /* ... same as before ... */ });

    addAttendeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const eventName = document.getElementById('attendee-event-name-hidden').value;
        const event = eventsData.find(ev => ev.name === eventName);
        if (event && event.attendeeList.length < event.capacity) {
            event.attendeeList.push({ name: document.getElementById('attendee-name').value, email: document.getElementById('attendee-email').value });
            updateDisplay();
            if(!detailView.classList.contains('hidden')) {
                showDetailView(eventName, 'event');
            }
        }
        hideModal(addAttendeeModal);
        addAttendeeForm.reset();
    });
    
    addVolunteerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const oppName = document.getElementById('volunteer-opp-name-hidden').value;
        const opportunity = opportunitiesData.find(op => op.name === oppName);
        if (opportunity && opportunity.volunteerList.length < opportunity.capacity) {
             opportunity.volunteerList.push({ name: document.getElementById('volunteer-name').value, email: document.getElementById('volunteer-email').value });
            updateDisplay();
             if(!detailView.classList.contains('hidden')) {
                showDetailView(oppName, 'opportunity');
            }
        }
        hideModal(addVolunteerModal);
        addVolunteerForm.reset();
    });

    // --- EVENT LISTENERS ---
    addEventBtn.addEventListener('click', () => showModal(addEventModal));
    addOpportunityBtn.addEventListener('click', () => showModal(addOpportunityModal));

    eventsContainer.addEventListener('click', (e) => {
        const button = e.target.closest('.add-attendee-btn');
        if (button) {
            const eventName = button.dataset.eventName;
            document.getElementById('attendee-modal-event-name').textContent = eventName;
            document.getElementById('attendee-event-name-hidden').value = eventName;
            showModal(addAttendeeModal);
        } else {
            const item = e.target.closest('.engagement-item');
            if (item) {
                showDetailView(item.dataset.name, 'event');
            }
        }
    });

    opportunitiesContainer.addEventListener('click', (e) => {
        const button = e.target.closest('.add-volunteer-btn');
        if (button) {
            const oppName = button.dataset.opportunityName;
            document.getElementById('volunteer-modal-opp-name').textContent = oppName;
            document.getElementById('volunteer-opp-name-hidden').value = oppName;
            showModal(addVolunteerModal);
        } else {
            const item = e.target.closest('.engagement-item');
            if (item) {
                showDetailView(item.dataset.name, 'opportunity');
            }
        }
    });

    backToHubBtn.addEventListener('click', () => {
        detailView.classList.add('hidden');
        mainHubView.classList.remove('hidden');
        updateDisplay();
    });

    addPersonFromDetailBtn.addEventListener('click', (e) => {
        const name = e.currentTarget.dataset.name;
        const type = e.currentTarget.dataset.type;

        if (type === 'event') {
            document.getElementById('attendee-modal-event-name').textContent = name;
            document.getElementById('attendee-event-name-hidden').value = name;
            showModal(addAttendeeModal);
        } else {
            document.getElementById('volunteer-modal-opp-name').textContent = name;
            document.getElementById('volunteer-opp-name-hidden').value = name;
            showModal(addVolunteerModal);
        }
    });

    searchInput.addEventListener('input', filterAndRender);
    
    // --- INITIALIZATION ---
    updateDisplay();
});

