document.addEventListener('DOMContentLoaded', function() {
    // --- DATA ---
    let eventsData = [
        { name: 'Annual Charity Gala', date: '2025-09-15T19:00:00', capacity: 200, icon: 'fa-ticket', color: 'purple', attendeeList: Array(150).fill({}) },
        { name: 'Leadership Breakfast', date: '2025-10-05T08:00:00', capacity: 50, icon: 'fa-calendar-day', color: 'yellow', attendeeList: Array(45).fill({}) },
        { name: 'Community Cleanup Day', date: '2025-09-28T09:00:00', capacity: 100, icon: 'fa-recycle', color: 'green', attendeeList: Array(75).fill({}) },
        { name: 'Holiday Toy Drive Kickoff', date: '2025-11-01T18:00:00', capacity: 150, icon: 'fa-gifts', color: 'red', attendeeList: Array(120).fill({}) },
        { name: 'Tech Summit 2025', date: '2025-11-15T09:00:00', capacity: 300, icon: 'fa-microphone', color: 'blue', attendeeList: Array(250).fill({}) },
        { name: 'Summer Picnic', date: '2025-08-10T12:00:00', capacity: 120, icon: 'fa-sun', color: 'orange', attendeeList: Array(110).fill({}) },
        { name: 'Art Workshop', date: '2025-10-20T14:00:00', capacity: 30, icon: 'fa-paint-brush', color: 'pink', attendeeList: Array(25).fill({}) }
    ];

    let opportunitiesData = [
        { name: 'Community Garden Cleanup', agency: 'Local Food Bank', date: '2025-09-20T09:00:00', hours: 4, capacity: 15, icon: 'fa-seedling', color: 'green', volunteerList: Array(8).fill({}) },
        { name: 'Reading Program Tutor', agency: 'Anytown Library', date: '2025-10-12T14:00:00', hours: 2, capacity: 12, icon: 'fa-book-open', color: 'blue', volunteerList: Array(12).fill({}) },
        { name: 'Gala Setup Crew', agency: 'Annual Charity Gala', date: '2025-09-15T14:00:00', hours: 5, capacity: 20, icon: 'fa-tools', color: 'orange', volunteerList: Array(10).fill({}) },
        { name: 'Toy Drive Sorter', agency: 'Holiday Toy Drive', date: '2025-11-02T10:00:00', hours: 3, capacity: 25, icon: 'fa-box-open', color: 'red', volunteerList: Array(25).fill({}) },
        { name: 'Animal Shelter Assistant', agency: 'County Animal Shelter', date: '2025-11-08T11:00:00', hours: 4, capacity: 10, icon: 'fa-paw', color: 'brown', volunteerList: Array(7).fill({}) },
        { name: 'Museum Guide', agency: 'History Museum', date: '2025-10-25T10:00:00', hours: 3, capacity: 8, icon: 'fa-landmark', color: 'purple', volunteerList: Array(5).fill({}) },
        { name: 'Trail Maintenance', agency: 'State Parks Dept.', date: '2025-09-06T08:00:00', hours: 6, capacity: 30, icon: 'fa-tree', color: 'green', volunteerList: Array(22).fill({}) }
    ];

    // --- ELEMENTS ---
    const searchInput = document.getElementById('engagement-search');
    const eventsContainer = document.getElementById('events-list-container');
    const opportunitiesContainer = document.getElementById('opportunities-list-container');

    // Modal elements
    const addEventModal = document.getElementById('add-event-modal');
    const addOpportunityModal = document.getElementById('add-opportunity-modal');
    const addAttendeeModal = document.getElementById('add-attendee-modal');
    const addVolunteerModal = document.getElementById('add-volunteer-modal');

    const addEventBtn = document.getElementById('add-event-btn');
    const addOpportunityBtn = document.getElementById('add-opportunity-btn');

    const cancelEventModalBtn = document.getElementById('cancel-event-modal');
    const cancelOpportunityModalBtn = document.getElementById('cancel-opportunity-modal');
    const cancelAttendeeModalBtn = document.getElementById('cancel-attendee-modal');
    const cancelVolunteerModalBtn = document.getElementById('cancel-volunteer-modal');

    const addEventForm = document.getElementById('add-event-form');
    const addOpportunityForm = document.getElementById('add-opportunity-form');
    const addAttendeeForm = document.getElementById('add-attendee-form');
    const addVolunteerForm = document.getElementById('add-volunteer-form');

    // --- FUNCTIONS ---

    /**
     * Calculates and displays the summary statistics.
     */
    function calculateStats() {
        const totalEvents = eventsData.length;
        const totalAttendees = eventsData.reduce((sum, event) => sum + event.attendeeList.length, 0);
        const totalVolunteers = opportunitiesData.reduce((sum, opp) => sum + opp.volunteerList.length, 0);
        const totalHours = opportunitiesData.reduce((sum, opp) => sum + (opp.volunteerList.length * opp.hours), 0);
        const valueOfHours = totalHours * 35; // Using a sample value for volunteer time

        document.getElementById('total-events').textContent = totalEvents;
        document.getElementById('total-attendees').textContent = totalAttendees.toLocaleString();
        document.getElementById('total-volunteers').textContent = totalVolunteers.toLocaleString();
        document.getElementById('total-hours').textContent = totalHours.toLocaleString();
        document.getElementById('value-of-hours').textContent = '$' + valueOfHours.toLocaleString();
    }

    /**
     * Renders a list of events into the container.
     * @param {Array} events - The array of event objects to render.
     */
    function renderEvents(events) {
        eventsContainer.innerHTML = '';
        if (events.length === 0) {
            eventsContainer.innerHTML = `<p class="text-gray-400 text-center py-4">No events found.</p>`;
            return;
        }
        events.forEach(event => {
            const item = document.createElement('div');
            item.className = 'engagement-item';
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

    /**
     * Renders a list of volunteer opportunities into the container.
     */
    function renderOpportunities(opportunities) {
        opportunitiesContainer.innerHTML = '';
         if (opportunities.length === 0) {
            opportunitiesContainer.innerHTML = `<p class="text-gray-400 text-center py-4">No opportunities found.</p>`;
            return;
        }
        opportunities.forEach(opp => {
            const item = document.createElement('div');
            item.className = 'engagement-item';
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

    /**
     * Sorts, filters, and renders all engagement data based on a search term.
     */
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

    // --- MODAL HANDLING ---
    function showModal(modal) { modal.classList.remove('hidden'); }
    function hideModal(modal) { modal.classList.add('hidden'); }

    addEventBtn.addEventListener('click', () => showModal(addEventModal));
    addOpportunityBtn.addEventListener('click', () => showModal(addOpportunityModal));
    cancelEventModalBtn.addEventListener('click', () => hideModal(addEventModal));
    cancelOpportunityModalBtn.addEventListener('click', () => hideModal(addOpportunityModal));
    cancelAttendeeModalBtn.addEventListener('click', () => hideModal(addAttendeeModal));
    cancelVolunteerModalBtn.addEventListener('click', () => hideModal(addVolunteerModal));
    
    [addEventModal, addOpportunityModal, addAttendeeModal, addVolunteerModal].forEach(modal => {
        modal.addEventListener('click', (e) => { if (e.target === modal) hideModal(modal); });
    });

    // --- FORM SUBMISSIONS ---
    addEventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const iconChoices = [{icon: 'fa-ticket', color: 'purple'}, {icon: 'fa-calendar-day', color: 'yellow'}, {icon: 'fa-recycle', color: 'green'}, {icon: 'fa-gifts', color: 'red'}, {icon: 'fa-microphone', color: 'blue'}];
        const randomChoice = iconChoices[Math.floor(Math.random() * iconChoices.length)];
        const newEvent = {
            name: document.getElementById('event-name').value,
            date: document.getElementById('event-date').value,
            capacity: parseInt(document.getElementById('event-capacity').value),
            icon: randomChoice.icon,
            color: randomChoice.color,
            attendeeList: []
        };
        eventsData.push(newEvent);
        updateDisplay();
        hideModal(addEventModal);
        addEventForm.reset();
    });

    addOpportunityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const iconChoices = [{icon: 'fa-seedling', color: 'green'}, {icon: 'fa-book-open', color: 'blue'}, {icon: 'fa-tools', color: 'orange'}, {icon: 'fa-box-open', color: 'red'}, {icon: 'fa-paint-brush', color: 'purple'}];
        const randomChoice = iconChoices[Math.floor(Math.random() * iconChoices.length)];
        const newOpportunity = {
            name: document.getElementById('opp-name').value,
            agency: document.getElementById('opp-agency').value,
            date: document.getElementById('opp-date').value,
            hours: parseInt(document.getElementById('opp-hours').value),
            capacity: parseInt(document.getElementById('opp-capacity').value),
            icon: randomChoice.icon,
            color: randomChoice.color,
            volunteerList: []
        };
        opportunitiesData.push(newOpportunity);
        updateDisplay();
        hideModal(addOpportunityModal);
        addOpportunityForm.reset();
    });

    addAttendeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const eventName = document.getElementById('attendee-event-name-hidden').value;
        const event = eventsData.find(ev => ev.name === eventName);
        if (event && event.attendeeList.length < event.capacity) {
            const newAttendee = {
                name: document.getElementById('attendee-name').value,
                email: document.getElementById('attendee-email').value
            };
            event.attendeeList.push(newAttendee);
            updateDisplay();
        }
        hideModal(addAttendeeModal);
        addAttendeeForm.reset();
    });
    
    addVolunteerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const oppName = document.getElementById('volunteer-opp-name-hidden').value;
        const opportunity = opportunitiesData.find(op => op.name === oppName);
        if (opportunity && opportunity.volunteerList.length < opportunity.capacity) {
             const newVolunteer = {
                name: document.getElementById('volunteer-name').value,
                email: document.getElementById('volunteer-email').value
            };
            opportunity.volunteerList.push(newVolunteer);
            updateDisplay();
        }
        hideModal(addVolunteerModal);
        addVolunteerForm.reset();
    });

    // --- EVENT DELEGATION FOR DYNAMIC BUTTONS ---
    eventsContainer.addEventListener('click', (e) => {
        const button = e.target.closest('.add-attendee-btn');
        if (button) {
            const eventName = button.dataset.eventName;
            document.getElementById('attendee-modal-event-name').textContent = eventName;
            document.getElementById('attendee-event-name-hidden').value = eventName;
            showModal(addAttendeeModal);
        }
    });

    opportunitiesContainer.addEventListener('click', (e) => {
        const button = e.target.closest('.add-volunteer-btn');
        if (button) {
            const oppName = button.dataset.opportunityName;
            document.getElementById('volunteer-modal-opp-name').textContent = oppName;
            document.getElementById('volunteer-opp-name-hidden').value = oppName;
            showModal(addVolunteerModal);
        }
    });

    // --- INITIALIZATION ---
    updateDisplay();

    // --- EVENT LISTENERS ---
    searchInput.addEventListener('input', filterAndRender);
});

