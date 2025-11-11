/* ---
   SECURE PORTFOLIO - MAIN.JS
   Created by Gemini for Muhammad Talha
   --- */

document.addEventListener('DOMContentLoaded', (event) => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            mobileMenuButton.classList.toggle('open');
        });
    }
});
