document.addEventListener('DOMContentLoaded', function() {
    // --- DATA ---
    let fundraisers = []; // {id, title, description, goal, category, endDate, status, creator, createdDate, approvedDate, totalPledged}
    let applications = []; // Tied to fundraisers, {id, fundraiserId, status, reviewNotes, submittedDate}
    let pledges = []; // {id, fundraiserId, amount, pledgerName, pledgerEmail, date}

    // --- STATE ---
    let activeTab = 'user';

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

    // --- Tab Switching ---
    const switchTab = (tab) => {
        // Hide all sections
        document.querySelectorAll('.tab-content').forEach(section => section.classList.add('hidden'));
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('border-primary', 'text-primary');
            button.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200');
        });

        // Show selected section and update button
        document.getElementById(`${tab}Section`).classList.remove('hidden');
        document.getElementById(`${tab}Tab`).classList.add('border-primary', 'text-primary');
        document.getElementById(`${tab}Tab`).classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200');
        activeTab = tab;
        renderAll();
    };

    document.getElementById('userTab').addEventListener('click', () => switchTab('user'));
    document.getElementById('staffTab').addEventListener('click', () => switchTab('staff'));
    document.getElementById('publicTab').addEventListener('click', () => switchTab('public'));

    // --- RENDER FUNCTIONS ---
    const renderAll = () => {
        renderUserCampaigns();
        renderPendingApplications();
        renderLiveCampaigns();
    };

    const renderUserCampaigns = () => {
        const listEl = document.getElementById('userCampaignsList');
        const userFundraisers = fundraisers.filter(f => f.creator === 'currentUser'); // Placeholder for user ID
        if (userFundraisers.length === 0) {
            listEl.innerHTML = '<p class="text-gray-500 dark:text-gray-400">No campaigns created yet.</p>';
            return;
        }
        listEl.innerHTML = userFundraisers.map(f => `
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 class="font-semibold">${f.title}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">${f.description}</p>
                <p>Goal: ${formatCurrency(f.goal)} | Raised: ${formatCurrency(f.totalPledged || 0)} | Status: ${f.status}</p>
                <div class="mt-2 space-x-2">
                    <a href="/campaign/${f.id}" class="bg-primary text-primary-foreground px-2 py-1 rounded text-sm">View Site</a>
                    <button onclick="editCampaign('${f.id}')" class="bg-blue-500 text-white px-2 py-1 rounded text-sm">Edit</button>
                    <button onclick="viewPledges('${f.id}')" class="bg-green-500 text-white px-2 py-1 rounded text-sm">View Pledges</button>
                </div>
            </div>
        `).join('');
    };

    const renderPendingApplications = () => {
        const listEl = document.getElementById('pendingApplications');
        const pendingApps = applications.filter(a => a.status === 'pending');
        if (pendingApps.length === 0) {
            listEl.innerHTML = '<p class="text-gray-500 dark:text-gray-400">No pending applications.</p>';
            return;
        }
        listEl.innerHTML = pendingApps.map(a => {
            const fundraiser = fundraisers.find(f => f.id === a.fundraiserId);
            return `
                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 class="font-semibold">${fundraiser.title}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${fundraiser.description}</p>
                    <p>Submitted: ${new Date(a.submittedDate).toLocaleDateString()}</p>
                    <div class="mt-2 space-x-2">
                        <button onclick="approveApplication('${a.id}')" class="bg-green-500 text-white px-2 py-1 rounded text-sm">Approve</button>
                        <button onclick="denyApplication('${a.id}')" class="bg-red-500 text-white px-2 py-1 rounded text-sm">Deny</button>
                        <button onclick="modifyApplication('${a.id}')" class="bg-yellow-500 text-white px-2 py-1 rounded text-sm">Modify</button>
                        <button onclick="previewCampaign('${a.id}')" class="bg-blue-500 text-white px-2 py-1 rounded text-sm">Preview</button>
                    </div>
                </div>
            `;
        }).join('');
    };

    const renderLiveCampaigns = () => {
        const listEl = document.getElementById('liveCampaignsList');
        const liveFundraisers = fundraisers.filter(f => f.status === 'approved');
        if (liveFundraisers.length === 0) {
            listEl.innerHTML = '<p class="text-gray-500 dark:text-gray-400 col-span-full">No live campaigns available.</p>';
            return;
        }
        listEl.innerHTML = liveFundraisers.map(f => {
            const progress = f.totalPledged / f.goal * 100;
            return `
                <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <img src="https://placehold.co/300x200/6b7280/ffffff?text=${encodeURIComponent(f.title)}" alt="${f.title}" class="w-full h-48 object-cover rounded-t-lg">
                    <div class="p-4">
                        <h5 class="text-xl font-semibold mb-2">${f.title}</h5>
                        <p class="text-gray-600 dark:text-gray-400 mb-4">${f.description}</p>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <span class="text-2xl font-semibold mr-2">${formatCurrency(f.totalPledged || 0)}</span>
                                <span class="text-gray-600 dark:text-gray-400">raised of</span>
                            </div>
                            <div class="flex items-center">
                                <span class="text-2xl font-semibold mr-2">${formatCurrency(f.goal)}</span>
                                <span class="text-gray-600 dark:text-gray-400">goal</span>
                            </div>
                        </div>
                        <div class="mt-4">
                            <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                                <div class="h-full bg-primary rounded-full" style="width: ${Math.min(progress, 100)}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    };

    // --- FORM SUBMISSIONS ---
    document.getElementById('fundraiserForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('campaignTitle').value;
        const description = document.getElementById('campaignDescription').value;
        const goal = parseFloat(document.getElementById('campaignGoal').value);
        const category = document.getElementById('campaignCategory').value;
        const endDate = document.getElementById('campaignEndDate').value;
        const imageFile = document.getElementById('campaignImage').files[0];

        if (!title || !description || !goal) {
            showToast("Please fill out all required fields.");
            return;
        }

        const formData = new FormData();
        formData.append('image', imageFile);

        fetch('/upload-image', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            const newFundraiser = {
                id: generateId(),
                title,
                description,
                goal,
                category,
                endDate,
                image: data.imageUrl,
                status: 'pending',
                creator: 'currentUser', // Placeholder for logged-in user
                createdDate: Date.now(),
                totalPledged: 0
            };
            fundraisers.push(newFundraiser);

            const application = {
                id: generateId(),
                fundraiserId: newFundraiser.id,
                status: 'pending',
                submittedDate: Date.now()
            };
            applications.push(application);

            e.target.reset();
            showToast("Fundraiser submitted for review!");
            renderAll();
        })
        .catch(error => console.error('Error uploading image:', error));
    });

    // --- LIVE PREVIEW FUNCTIONALITY ---
    const updatePreview = () => {
        const title = document.getElementById('campaignTitle').value || 'Campaign Title';
        const description = document.getElementById('campaignDescription').value || 'Campaign description will appear here.';
        const goal = parseFloat(document.getElementById('campaignGoal').value) || 0;
        const imageFile = document.getElementById('campaignImage').files[0];

        // Update text elements
        document.getElementById('previewTitle').textContent = title;
        document.getElementById('previewDescription').textContent = description;
        document.getElementById('previewGoal').textContent = goal.toFixed(2);

        // Update image if uploaded
        if (imageFile) {
            const imageUrl = URL.createObjectURL(imageFile);
            document.getElementById('previewImage').src = imageUrl;
            document.getElementById('previewImage').classList.remove('hidden');
        } else {
            document.getElementById('previewImage').classList.add('hidden');
        }

        // Update progress bar (assuming 0 raised for preview)
        const progressBar = document.querySelector('#campaignPreview .h-full');
        progressBar.style.width = '0%';
    };

    // Add event listeners to form inputs for live updates
    document.getElementById('campaignTitle').addEventListener('input', updatePreview);
    document.getElementById('campaignDescription').addEventListener('input', updatePreview);
    document.getElementById('campaignGoal').addEventListener('input', updatePreview);
    document.getElementById('campaignImage').addEventListener('change', updatePreview);

    // --- ACTION HANDLERS ---
    window.approveApplication = (appId) => {
        const app = applications.find(a => a.id === appId);
        app.status = 'approved';
        const fundraiser = fundraisers.find(f => f.id === app.fundraiserId);
        fundraiser.status = 'approved';
        fundraiser.approvedDate = Date.now();
        showToast("Application approved!");
        renderAll();
    };

    window.denyApplication = (appId) => {
        const app = applications.find(a => a.id === appId);
        app.status = 'denied';
        const fundraiser = fundraisers.find(f => f.id === app.fundraiserId);
        fundraiser.status = 'denied';
        showToast("Application denied.");
        renderAll();
    };

    window.modifyApplication = (appId) => {
        // Placeholder for modification logic (e.g., open a modal)
        showToast("Modification feature coming soon!");
    };

    window.editCampaign = (fundraiserId) => {
        // Placeholder for editing (e.g., pre-fill form)
        showToast("Edit feature coming soon!");
    };

    window.viewPledges = (fundraiserId) => {
        const fundraiserPledges = pledges.filter(p => p.fundraiserId === fundraiserId);
        // Placeholder for pledge details view
        showToast(`Viewing pledges for ${fundraiserId}. Total: ${fundraiserPledges.length}`);
    };

    window.previewCampaign = (appId) => {
        const app = applications.find(a => a.id === appId);
        const fundraiser = fundraisers.find(f => f.id === app.fundraiserId);
        // Placeholder for preview modal or page
        showToast(`Previewing ${fundraiser.title} - feature coming soon!`);
    };

    window.makePledge = (event, fundraiserId) => {
        event.preventDefault();
        const form = event.target;
        const amount = parseFloat(form[0].value);
        const name = form[1].value;
        const email = form[2].value;

        if (!amount || !name || !email) {
            showToast("Please fill out pledge details.");
            return;
        }

        const pledge = {
            id: generateId(),
            fundraiserId,
            amount,
            pledgerName: name,
            pledgerEmail: email,
            date: Date.now()
        };
        pledges.push(pledge);

        const fundraiser = fundraisers.find(f => f.id === fundraiserId);
        fundraiser.totalPledged = (fundraiser.totalPledged || 0) + amount;

        form.reset();
        showToast("Pledge submitted successfully!");
        renderAll();
    };

    // --- SEED DATA FOR TESTING ---
    const seedTestData = () => {
        fundraisers = [
            { id: 'fund1', title: 'School Supplies Drive', description: 'Help provide school supplies for underprivileged kids.', goal: 5000, category: 'education', status: 'approved', creator: 'user1', createdDate: Date.now() - 1000000, approvedDate: Date.now() - 500000, totalPledged: 3200 },
            { id: 'fund2', title: 'Community Health Clinic', description: 'Fund a new clinic for the community.', goal: 15000, category: 'health', status: 'pending', creator: 'currentUser', createdDate: Date.now() - 500000, totalPledged: 0 }
        ];
        applications = [
            { id: 'app1', fundraiserId: 'fund1', status: 'approved', submittedDate: Date.now() - 1000000 },
            { id: 'app2', fundraiserId: 'fund2', status: 'pending', submittedDate: Date.now() - 500000 }
        ];
        pledges = [
            { id: 'pledge1', fundraiserId: 'fund1', amount: 100, pledgerName: 'John Doe', pledgerEmail: 'john@example.com', date: Date.now() - 200000 },
            { id: 'pledge2', fundraiserId: 'fund1', amount: 200, pledgerName: 'Jane Smith', pledgerEmail: 'jane@example.com', date: Date.now() - 100000 }
        ];
        console.log("Test data loaded for P2P Hub.");
        renderAll();
    };

    // --- INITIALIZATION ---
    seedTestData();
});