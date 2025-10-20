// Theme and mode loader for iframe content
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = window.parent.localStorage.getItem('andar-theme') || 'theme-blue';
    const savedMode = window.parent.localStorage.getItem('andar-mode') || 'light';
    document.documentElement.className = savedMode;
    document.body.classList.add(savedTheme);
});