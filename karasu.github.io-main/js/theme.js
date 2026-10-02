/* =========================================
   1. THEME MANAGEMENT & ASSET UPDATES
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const toggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const meowImg = document.getElementById('meowGuruImg');
    const mainLogo = document.getElementById('mainLogo');
  
    // --- Initialize Theme ---
    const savedTheme = localStorage.getItem('artistHubTheme');
    if (savedTheme === 'dark') {
      body.classList.add('dark');
      if(themeIcon) themeIcon.className = 'bi bi-sun-fill';
    }
  
    // --- Toggle Logic ---
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark');
        const isDark = body.classList.contains('dark');
        
        // Icon Update
        if(themeIcon) themeIcon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
        
        // Save Preference
        localStorage.setItem('artistHubTheme', isDark ? 'dark' : 'light');
  
        // Trigger updates for dynamic assets
        updateDynamicAssets(isDark);
      });
    }
  
    // --- Dynamic Asset Updater ---
    function updateDynamicAssets(isDark) {
      if (meowImg) {
        meowImg.src = isDark ? meowImg.dataset.dark : meowImg.dataset.light;
      }
      if (mainLogo) {
        mainLogo.src = isDark ? mainLogo.dataset.dark : mainLogo.dataset.light;
      }
    }
  
    updateDynamicAssets(body.classList.contains('dark'));
  });
