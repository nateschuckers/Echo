document.addEventListener('DOMContentLoaded', function() {
    // --- ELEMENTS ---
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const collapseIcon = document.getElementById('collapse-icon');
    const expandIcon = document.getElementById('expand-icon');
    const profileButton = document.getElementById('profile-button');
    const profileDropdown = document.getElementById('profile-dropdown');
    const lightModeBtn = document.getElementById('light-mode-btn');
    const darkModeBtn = document.getElementById('dark-mode-btn');
    const themeDots = document.querySelectorAll('.theme-dot');
    const menuItems = document.querySelectorAll('.menu-item');
    const contentFrame = document.getElementById('content-frame');
    const pageTitleEl = document.getElementById('page-title');
    
    // Modal Elements
    const appModal = document.getElementById('app-modal');
    const modalContent = document.getElementById('modal-content');
    const modalTitleEl = document.getElementById('modal-title');
    const modalBodyEl = document.getElementById('modal-body');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // --- STATE ---
    let isSidebarCollapsed = false;

    // --- HELPER FUNCTIONS ---
    function setMode(mode) {
        document.documentElement.className = mode;
        localStorage.setItem('andar-mode', mode);
        updateModeButtons(mode);
        // Send theme update to the iframe
        if (contentFrame.contentWindow) {
            contentFrame.contentWindow.postMessage({ type: 'set-theme', mode: mode, theme: localStorage.getItem('andar-theme') || 'theme-blue' }, '*');
        }
    }

    function setTheme(theme) {
        const existingTheme = Array.from(document.body.classList).find(c => c.startsWith('theme-'));
        if (existingTheme) {
            document.body.classList.remove(existingTheme);
        }
        document.body.classList.add(theme);
        localStorage.setItem('andar-theme', theme);
        updateThemeDots(theme);
        updateModeButtons(localStorage.getItem('andar-mode') || 'light');
        // Send theme update to the iframe
        if (contentFrame.contentWindow) {
            contentFrame.contentWindow.postMessage({ type: 'set-theme', mode: localStorage.getItem('andar-mode') || 'light', theme: theme }, '*');
        }
    }

    function updateModeButtons(mode) {
        if (mode === 'dark') {
            darkModeBtn.classList.add('bg-primary', 'text-primary-foreground');
            lightModeBtn.classList.remove('bg-primary', 'text-primary-foreground');
        } else {
            lightModeBtn.classList.add('bg-primary', 'text-primary-foreground');
            darkModeBtn.classList.remove('bg-primary', 'text-primary-foreground');
        }
    }

    function updateThemeDots(activeTheme) {
        themeDots.forEach(dot => {
            dot.dataset.theme === activeTheme ? dot.classList.add('active') : dot.classList.remove('active');
        });
    }

    function toggleSidebar() {
        isSidebarCollapsed = !isSidebarCollapsed;
        
        sidebar.classList.toggle('sidebar-collapsed');
        
        if (isSidebarCollapsed) {
            document.documentElement.style.setProperty('--sidebar-width', '88px');
            collapseIcon.classList.add('hidden');
            expandIcon.classList.remove('hidden');
        } else {
            document.documentElement.style.setProperty('--sidebar-width', '260px');
            collapseIcon.classList.remove('hidden');
            expandIcon.classList.add('hidden');
        }
    }

    function toggleProfileDropdown() {
        profileDropdown.classList.toggle('hidden');
    }

    // --- MODAL FUNCTIONS ---
    function showModal(title, contentHTML) {
        modalTitleEl.textContent = title;
        modalBodyEl.innerHTML = contentHTML;
        appModal.classList.remove('hidden');
        setTimeout(() => {
            appModal.classList.remove('opacity-0');
            modalContent.classList.remove('scale-95');
        }, 10);
    }

    function hideModal() {
        appModal.classList.add('opacity-0');
        modalContent.classList.add('scale-95');
        setTimeout(() => {
            appModal.classList.add('hidden');
        }, 300);
    }

    // --- INITIALIZATION ---
    function initialize() {
        const savedMode = localStorage.getItem('andar-mode') || 'light';
        const savedTheme = localStorage.getItem('andar-theme') || 'theme-blue';
        
        setMode(savedMode);
        setTheme(savedTheme);
        
        // Add event listener for when the iframe loads
        contentFrame.addEventListener('load', () => {
            const currentMode = localStorage.getItem('andar-mode') || 'light';
            const currentTheme = localStorage.getItem('andar-theme') || 'theme-blue';
            // Post the theme to the iframe once it's loaded
            if (contentFrame.contentWindow) {
                contentFrame.contentWindow.postMessage({
                    type: 'set-theme',
                    mode: currentMode,
                    theme: currentTheme
                }, '*');
            }
        });

        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = e.currentTarget.getAttribute('href');
                const pageName = e.currentTarget.querySelector('.menu-text').textContent;
                
                contentFrame.src = targetPage;
                pageTitleEl.textContent = pageName;
                
                // Clear account info when navigating away from a profile
                sessionStorage.removeItem('currentAccountName');
                sessionStorage.removeItem('currentAccountType');

                menuItems.forEach(i => i.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // Global event listeners
        sidebarToggle.addEventListener('click', toggleSidebar);
        profileButton.addEventListener('click', toggleProfileDropdown);
        lightModeBtn.addEventListener('click', () => setMode('light'));
        darkModeBtn.addEventListener('click', () => setMode('dark'));
        themeDots.forEach(dot => { dot.addEventListener('click', () => setTheme(dot.dataset.theme)); });
        window.addEventListener('click', function(e) { 
            if (!profileButton.contains(e.target) && !profileDropdown.contains(e.target)) { 
                profileDropdown.classList.add('hidden'); 
            }
        });

        // Modal listeners
        modalCloseBtn.addEventListener('click', hideModal);
        appModal.addEventListener('click', (e) => {
            if (e.target === appModal) {
                hideModal();
            }
        });

        // Make modal function available to the iframe
        window.showAppModal = showModal;

        window.addEventListener('message', function(e) {
            if (e.data.type === 'navigate') {
                contentFrame.src = e.data.page;
                if (e.data.accountName) {
                    pageTitleEl.textContent = e.data.accountName;
                    sessionStorage.setItem('currentAccountName', e.data.accountName);
                    sessionStorage.setItem('currentAccountType', e.data.accountType);
                } else {
                    pageTitleEl.textContent = e.data.title;
                }
            }
        });
    }
    
    initialize();
});
