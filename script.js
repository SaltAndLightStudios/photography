// Navigation active state
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Portfolio filter functionality with dynamic grid
const filterButtons = document.querySelectorAll('.portfolio-filter');
const galleryItems = document.querySelectorAll('.gallery-item');
const loadMoreBtn = document.getElementById('load-more');
let currentCategory = 'all';
let visibleItems = 6;
let currentSubcategory = 'all';

// Function to filter gallery items with dynamic layout
function filterGallery(category) {
    currentCategory = category;
    visibleItems = 6; // Reset visible items count when changing categories

    // Update active button styling
    filterButtons.forEach(btn => {
        btn.classList.remove('bg-stone-900', 'text-white');
        btn.classList.add('bg-stone-100', 'text-stone-800');
    });

    // Sub-category filtering
    const dropdownItems = document.querySelectorAll('.filter-dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function () {
            const parent = this.closest('.filter-container');
            // Toggle active highlight
            parent.querySelectorAll('.filter-dropdown-item')
                .forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // Reset main‐button styling
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-stone-900', 'text-white');
                btn.classList.add('bg-stone-100', 'text-stone-800');
            });

            const category = this.dataset.category;
            const subcat = this.dataset.subcategory;
            currentCategory = category;
            currentSubcategory = subcat;
            const parentBtn = parent.querySelector('.filter-button');

            // Highlight the parent category button
            parentBtn.classList.remove('bg-stone-100', 'text-stone-800');
            parentBtn.classList.add('bg-stone-900', 'text-white');

            // Hide all
            galleryItems.forEach(item => {
                item.classList.remove('show');
                item.style.display = 'none';
            });

            // Filter by both category and (unless “all”) subcategory
            const matching = Array.from(galleryItems).filter(item => {
                const okCat = (category === 'all' || item.dataset.category === category);
                const okSub = (subcat === 'all' || item.dataset.subcategory === subcat);
                return okCat && okSub;
            });

            // Show up to visibleItems items
            matching.slice(0, visibleItems).forEach((item, idx) => {
                setTimeout(() => {
                    item.style.display = 'block';
                    item.classList.add('show');
                    item.style.height = 'auto';
                    item.style.margin = '';
                    item.style.padding = '';
                }, idx * 100);
            });

            // Toggle “Load More”
            loadMoreBtn.style.display = matching.length > visibleItems ? 'block' : 'none';
        });
    });

    // Add active styling to clicked button
    //event.currentTarget.classList.remove('bg-stone-100', 'text-stone-800');
    //event.currentTarget.classList.add('bg-stone-900', 'text-white');

    // First, completely hide all items and reset their display property
    galleryItems.forEach(item => {
        item.classList.remove('show');
        item.style.display = 'none'; // Explicitly hide all items
        item.style.height = '0';
        item.style.margin = '0';
        item.style.padding = '0';
    });

    // Get all items that match the current category
    const matchingItems = Array.from(galleryItems).filter(item => {
        return category === 'all' || item.getAttribute('data-category') === category;
    });

    // Show only the first 'visibleItems' number of matching items
    const itemsToShow = matchingItems.slice(0, visibleItems);

    // Add a slight delay before showing items to allow hiding animation to complete
    setTimeout(() => {
        itemsToShow.forEach((item, index) => {
            // Add a slight delay for each item to create a cascade effect
            setTimeout(() => {
                item.style.display = 'block'; // Make sure the item is displayed
                item.classList.add('show');
                item.style.height = 'auto';
                item.style.margin = '';
                item.style.padding = '';
            }, index * 100);
        });
    }, 300);

    // Show/hide load more button based on number of items in category
    if (matchingItems.length <= visibleItems) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

// Add click event to filter buttons
filterButtons.forEach(button => {
    button.addEventListener('click', function () {
        const category = this.getAttribute('data-category');
        filterGallery(category);

        // Mobile dropdown: collapse if open, open if closed
        const parent   = this.closest('.filter-container');
        const dropdown = parent.querySelector('.filter-dropdown');
        const wasOpen  = dropdown && dropdown.classList.contains('open');
        document.querySelectorAll('.filter-dropdown.open').forEach(dd => dd.classList.remove('open'));
        if (dropdown && !wasOpen) {
            dropdown.classList.add('open');
        }

        // Highlight this main category button
        filterButtons.forEach(btn => {
            btn.classList.remove('bg-stone-900','text-white');
            btn.classList.add('bg-stone-100','text-stone-800');
        });
        this.classList.remove('bg-stone-100','text-stone-800');
        this.classList.add('bg-stone-900','text-white');
    });
});


// Bind sub-category clicks globally so images load immediately
document.querySelectorAll('.filter-dropdown-item').forEach(item => {
    item.addEventListener('click', function (event) {
        const parent = this.closest('.filter-container');
        // Highlight selected sub-category
        parent.querySelectorAll('.filter-dropdown-item')
            .forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        // Reset styling on main buttons
        filterButtons.forEach(btn => {
            btn.classList.remove('bg-stone-900', 'text-white');
            btn.classList.add('bg-stone-100', 'text-stone-800');
        });
        // Update globals
        const category = this.dataset.category;
        const subcat = this.dataset.subcategory;
        currentCategory = category;
        currentSubcategory = subcat;
        visibleItems = 6;
        // Highlight parent category button
        const parentBtn = parent.querySelector('.portfolio-filter');
        parentBtn.classList.remove('bg-stone-100', 'text-stone-800');
        parentBtn.classList.add('bg-stone-900', 'text-white');
        // Hide all items
        galleryItems.forEach(it => {
            it.classList.remove('show');
            it.style.display = 'none';
            it.style.height = '0';
            it.style.margin = '0';
            it.style.padding = '0';
        });
        // Filter and show initial sub-category items
        const matching = Array.from(galleryItems).filter(it => {
            const okCat = (category === 'all' || it.dataset.category === category);
            const okSub = (subcat === 'all' || it.dataset.subcategory === subcat);
            return okCat && okSub;
        });
        matching.slice(0, visibleItems).forEach((it, idx) => {
            setTimeout(() => {
                it.style.display = 'block';
                it.classList.add('show');
                it.style.height = 'auto';
                it.style.margin = '';
                it.style.padding = '';
            }, idx * 100);
        });
        // Toggle “Load More”
        loadMoreBtn.style.display = (matching.length > visibleItems) ? 'block' : 'none';
        // Collapse the sub-category dropdown
        const dropdown = parent.querySelector('.filter-dropdown');
        if (dropdown) dropdown.classList.remove('open');
    });
});

// Load more functionality
loadMoreBtn.addEventListener('click', function () {
    // Get all items that match the current category
    const matchingItems = Array.from(galleryItems).filter(item => {
        const okCat = (currentCategory === 'all' || item.dataset.category === currentCategory);
        const okSub = (currentSubcategory === 'all' || item.dataset.subcategory === currentSubcategory);
        return okCat && okSub;
    });

    // Calculate how many more items to show
    const currentlyShown = document.querySelectorAll('.gallery-item.show').length;
    const nextBatch = matchingItems.slice(currentlyShown, currentlyShown + 6);

    // Show the next batch of items
    nextBatch.forEach((item, index) => {
        setTimeout(() => {
            item.style.display = 'block'; // Make sure the item is displayed
            item.classList.add('show');
            item.style.height = 'auto';
            item.style.margin = '';
            item.style.padding = '';
        }, index * 100);
    });

    // Hide load more button if all items in category are shown
    if (currentlyShown + nextBatch.length >= matchingItems.length) {
        loadMoreBtn.style.display = 'none';
    }
});

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

let currentImageIndex = 0;
let visibleImages = [];

// Open lightbox when clicking on a gallery item
galleryItems.forEach((item, index) => {
    item.addEventListener('click', function () {
        // Get all currently visible images based on the active category
        visibleImages = Array.from(document.querySelectorAll('.gallery-item.show'));

        // Find the index of the clicked image within visible images
        const clickedImage = item.querySelector('img');
        currentImageIndex = visibleImages.findIndex(img => img === item);

        // Set the lightbox image source and caption
        // Use the original image URL without any cropping parameters
        const originalImageUrl = clickedImage.src.split('?')[0];
        lightboxImg.src = originalImageUrl;
        lightboxCaption.textContent = clickedImage.alt;

        // Show the lightbox with animation
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');

        // Update navigation visibility
        updateLightboxNavigation();
    });
});

// Close lightbox when clicking the close button or outside the image
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Navigate to previous image
lightboxPrev.addEventListener('click', function () {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateLightboxImage();
    }
});

// Navigate to next image
lightboxNext.addEventListener('click', function () {
    if (currentImageIndex < visibleImages.length - 1) {
        currentImageIndex++;
        updateLightboxImage();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            updateLightboxImage();
        }
    } else if (e.key === 'ArrowRight') {
        if (currentImageIndex < visibleImages.length - 1) {
            currentImageIndex++;
            updateLightboxImage();
        }
    }
});

// Update lightbox image and caption
function updateLightboxImage() {
    const img = visibleImages[currentImageIndex].querySelector('img');

    // Create a new image to preload
    const newImg = new Image();
    // Use the original image URL without any cropping parameters
    const originalImageUrl = img.src.split('?')[0];
    newImg.src = originalImageUrl;

    // Add a loading animation
    lightboxImg.style.opacity = '0.5';

    // When the new image is loaded, update the lightbox
    newImg.onload = function () {
        lightboxImg.src = newImg.src;
        lightboxCaption.textContent = img.alt;
        lightboxImg.style.opacity = '1';

        // Update navigation visibility
        updateLightboxNavigation();
    };
}

// Update navigation buttons visibility
function updateLightboxNavigation() {
    if (currentImageIndex === 0) {
        lightboxPrev.style.opacity = '0.3';
        lightboxPrev.style.cursor = 'default';
    } else {
        lightboxPrev.style.opacity = '1';
        lightboxPrev.style.cursor = 'pointer';
    }

    if (currentImageIndex === visibleImages.length - 1) {
        lightboxNext.style.opacity = '0.3';
        lightboxNext.style.cursor = 'default';
    } else {
        lightboxNext.style.opacity = '1';
        lightboxNext.style.cursor = 'pointer';
    }
}

// Close the lightbox
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('lightbox-open');
}

// Initialize gallery with "All" category
document.addEventListener('DOMContentLoaded', function () {
    // Show all items initially with proper display setting
    galleryItems.forEach((item, index) => {
        if (index < visibleItems) {
            item.style.display = 'block'; // Explicitly set display property
            setTimeout(() => {
                item.classList.add('show');
                item.style.height = 'auto';
                item.style.margin = '';
                item.style.padding = '';
            }, index * 100);
        } else {
            item.style.display = 'none'; // Hide items beyond the initial visible count
        }
    });

    // Show/hide load more button
    if (galleryItems.length <= visibleItems) {
        loadMoreBtn.style.display = 'none';
    }
});
// collapse/expand sidebar on small screens
const navToggle = document.getElementById('nav-toggle');
const sidebar = document.querySelector('.sidebar');

navToggle.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
});

// collapse sidebar on menu link click (mobile)
const navLinksMobile = document.querySelectorAll('.sidebar .nav-link');
navLinksMobile.forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.add('hidden');
    });
});


/*(function () {
    function c() {
        var b = a.contentDocument || a.contentWindow.document;
        if (b) {
            var d = b.createElement('script');
            d.innerHTML = "window.__CF$cv$params={r:'94fe2f5c20722e7e',t:'MTc0OTk0OTc5Ny4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
            b.getElementsByTagName('head')[0].appendChild(d)
        }
    }
    if (document.body) {
        var a = document.createElement('iframe');
        a.height = 1;
        a.width = 1;
        a.style.position = 'absolute';
        a.style.top = 0;
        a.style.left = 0;
        a.style.border = 'none';
        a.style.visibility = 'hidden';
        document.body.appendChild(a);
        if ('loading' !== document.readyState) c();
        else if (window.addEventListener) document.addEventListener('DOMContentLoaded', c);
        else {
            var e = document.onreadystatechange || function () { };
            document.onreadystatechange = function (b) {
                e(b);
                'loading' !== document.readyState && (document.onreadystatechange = e, c())
            }
        }
    }
})();*/
// Lazy load images using IntersectionObserver
document.addEventListener("DOMContentLoaded", () => {
    const lazyImages = document.querySelectorAll("img[data-src]");

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute("data-src");
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
});