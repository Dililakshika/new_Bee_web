document.addEventListener('DOMContentLoaded', function () {
    const dashboardItems = document.querySelectorAll('.dashboard-item');

    function handleScroll() {
        dashboardItems.forEach(item => {
            const itemPosition = item.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (itemPosition < windowHeight - 100) {  // Adjust 100 to trigger earlier or later
                // Reset the animation by removing and adding the class
                item.classList.remove('visible');
                setTimeout(() => {
                    item.classList.add('visible');
                }, 10); // Small delay to allow class removal to take effect
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();  // Trigger animation if the section is already in view on page load
});

  