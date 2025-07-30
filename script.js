document.addEventListener('DOMContentLoaded', () => {
    
    // --- Sticky Header ---
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Hamburger Menu ---
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    hamburger.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
    });

    // --- My List Functionality ---
    const myListKey = 'netflixMyList';
    let myList = JSON.parse(localStorage.getItem(myListKey)) || [];

    const addToListButtons = document.querySelectorAll('.add-to-list-btn');

    // Function to update the visual state of buttons
    const updateButtonStates = () => {
        const allThumbnails = document.querySelectorAll('.thumbnail');
        allThumbnails.forEach(thumb => {
            const title = thumb.dataset.title;
            const button = thumb.querySelector('.add-to-list-btn');
            if (button) {
                if (myList.some(item => item.title === title)) {
                    button.classList.add('added');
                    button.innerHTML = '<i class="fas fa-check"></i>';
                    button.title = "Remove from My List";
                } else {
                    button.classList.remove('added');
                    button.innerHTML = '<i class="fas fa-plus"></i>';
                    button.title = "Add to My List";
                }
            }
        });
    };

    addToListButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent hover effect from triggering
            const thumbnail = button.closest('.thumbnail');
            const title = thumbnail.dataset.title;
            const imageSrc = thumbnail.querySelector('img').src;

            const itemIndex = myList.findIndex(item => item.title === title);

            if (itemIndex > -1) {
                // Item is in the list, so remove it
                myList.splice(itemIndex, 1);
            } else {
                // Item is not in the list, so add it
                myList.push({ title, imageSrc });
            }

            // Save updated list to localStorage
            localStorage.setItem(myListKey, JSON.stringify(myList));
            
            // Update button visuals
            updateButtonStates();
        });
    });

    // --- Render My List Page ---
    const myListGrid = document.getElementById('my-list-grid');
    if (myListGrid) {
        if (myList.length > 0) {
            myListGrid.innerHTML = ''; // Clear the empty message
            myList.forEach(item => {
                const thumbnailHTML = `
                    <div class="thumbnail" data-title="${item.title}">
                        <img src="${item.imageSrc}" alt="${item.title}">
                        <div class="thumbnail-overlay">
                            <button class="add-to-list-btn added" title="Remove from My List">
                                <i class="fas fa-check"></i>
                            </button>
                        </div>
                    </div>
                `;
                myListGrid.innerHTML += thumbnailHTML;
            });
        }
        // Re-add event listeners for the dynamically created buttons on this page
        const dynamicButtons = myListGrid.querySelectorAll('.add-to-list-btn');
        dynamicButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const title = button.closest('.thumbnail').dataset.title;
                myList = myList.filter(item => item.title !== title);
                localStorage.setItem(myListKey, JSON.stringify(myList));
                // Re-render the list page content
                window.location.reload(); 
            });
        });
    }

    // Initial check to set button states on page load
    updateButtonStates();
});
