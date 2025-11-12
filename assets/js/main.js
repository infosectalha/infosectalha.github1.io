/* ---
   SECURE PORTFOLIO - MAIN.JS
   Created by Gemini for Muhammad Talha
   --- */

document.addEventListener('DOMContentLoaded', (event) => {
    
    // --- Mobile Menu Code ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            mobileMenuButton.classList.toggle('open');
        });
    }

    // --- NEW: Scroll Animation Code (Triggers Every Time) ---
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // This is the new, simpler logic.
            // It adds 'animate' if intersecting, and removes it if not.
            entry.target.classList.toggle('animate', entry.isIntersecting);
        });
    }, observerOptions);

    // Observe all elements with the class "fade-in"
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
});
