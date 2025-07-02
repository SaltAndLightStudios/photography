// Navigation active state

// Global flag to manage loading state for the lightbox
let isLoadingNextBatch = false;
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

        // Check for repeated "All" click & active state
        const isAllAlreadyActive = this.classList.contains('bg-stone-900') && category === 'all';

        // If repeated "All" click on mobile, collapse menu and exit early
        if (isAllAlreadyActive && window.matchMedia('(max-width: 768px)').matches) {
            const panel = document.getElementById('mobile-filter-panel');
            const toggle = document.getElementById('mobile-filter-toggle');
            if (panel) panel.classList.add('hidden');
            if (toggle) toggle.classList.remove('open');
            document.querySelectorAll('.filter-dropdown.open').forEach(dd => dd.classList.remove('open'));
            return; // Exit early to prevent toggling again
        }

        filterGallery(category);

        // If 'All' is selected on mobile, close the entire filter panel and close any open submenus
        if (category === 'all' && window.matchMedia('(max-width: 768px)').matches) {
            const panel = document.getElementById('mobile-filter-panel');
            const toggle = document.getElementById('mobile-filter-toggle');
            if (panel) panel.classList.add('hidden');
            if (toggle) toggle.classList.remove('open');
            document.querySelectorAll('.filter-dropdown.open').forEach(dd => dd.classList.remove('open'));
        }

        // Mobile dropdown: collapse if open, open if closed
        const parent   = this.closest('.filter-container');
        const dropdown = parent.querySelector('.filter-dropdown');
        const wasOpen  = dropdown && dropdown.classList.contains('open');
        document.querySelectorAll('.filter-dropdown.open').forEach(dd => dd.classList.remove('open'));
        if (dropdown && !wasOpen) {
            dropdown.classList.add('open', 'slide-down');
            // Remove animation class after it plays so it can be reused
            setTimeout(() => dropdown.classList.remove('slide-down'), 300);
        }

        // Highlight this main category button
        filterButtons.forEach(btn => {
            btn.classList.remove('bg-stone-900','text-white');
            btn.classList.add('bg-stone-100','text-stone-800');
        });
        this.classList.remove('bg-stone-100','text-stone-800');
        this.classList.add('bg-stone-900','text-white');

        // On mobile: collapse filter panel after selection
        // if (window.innerWidth <= 768) {
        //     const panel = document.getElementById('mobile-filter-panel');
        //     if (panel) panel.classList.add('hidden');
        // }
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

        // On mobile: collapse filter panel after subcategory selection
        if (window.matchMedia('(max-width: 768px)').matches) {
            const panel = document.getElementById('mobile-filter-panel');
            const toggle = document.getElementById('mobile-filter-toggle');
            if (panel) panel.classList.add('hidden');
            if (toggle) toggle.classList.remove('open');
            document.querySelectorAll('.filter-dropdown.open').forEach(dd => dd.classList.remove('open'));
        }
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
    // Optionally, you could add dynamic loading for previous if needed
});

// Navigate to next image with dynamic loading support (refactored)
lightboxNext.addEventListener('click', function () {
    if (isLoadingNextBatch) return;
    if (currentImageIndex < visibleImages.length - 1) {
        currentImageIndex++;
        updateLightboxImage();
    } else {
        const matchingItems = Array.from(galleryItems).filter(item => {
            const okCat = (currentCategory === 'all' || item.dataset.category === currentCategory);
            const okSub = (currentSubcategory === 'all' || item.dataset.subcategory === currentSubcategory);
            return okCat && okSub;
        });

        // Recalculate currentlyShown right before nextBatch calculation
        const currentlyShown = document.querySelectorAll('.gallery-item.show').length;
        const nextBatch = matchingItems.slice(currentlyShown, currentlyShown + 6);

        if (nextBatch.length > 0) {
            isLoadingNextBatch = true;
            // Disable next button visually and functionally
            lightboxNext.style.opacity = '0.3';
            lightboxNext.style.pointerEvents = 'none';
            nextBatch.forEach((item, index) => {
                setTimeout(() => {
                    item.style.display = 'block';
                    item.classList.add('show');
                    item.style.height = 'auto';
                    item.style.margin = '';
                    item.style.padding = '';
                }, index * 100);
            });

            const delay = nextBatch.length * 100 + 100;
            setTimeout(() => {
                // Refresh visibleImages after showing new items
                visibleImages = Array.from(document.querySelectorAll('.gallery-item.show'));
                // Only advance if a new image is available
                if (currentImageIndex < visibleImages.length - 1) {
                    currentImageIndex++;
                    updateLightboxImage();
                }
                isLoadingNextBatch = false;
                // Restore next button
                lightboxNext.style.opacity = '1';
                lightboxNext.style.pointerEvents = 'auto';
            }, delay);
        }
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
    // Use the most reliable source for the original image URL without any cropping parameters
    const src = img.dataset?.src || img.src;
    const originalImageUrl = src.split('?')[0];
    newImg.src = originalImageUrl;

    // Add a loading animation
    lightboxImg.style.opacity = '0.5';

    // When the new image is loaded, update the lightbox
    newImg.onload = async function () {
        await newImg.decode(); // Ensures the image is fully decoded before showing
        lightboxImg.src = newImg.src;
        lightboxCaption.textContent = img.alt;
        lightboxImg.style.opacity = '1';

        // Preload next and previous images for smoother navigation
        if (currentImageIndex + 1 < visibleImages.length) {
            const nextImg = visibleImages[currentImageIndex + 1].querySelector('img');
            const preloadNext = new Image();
            preloadNext.src = nextImg?.dataset?.src || nextImg?.src;
        }

        if (currentImageIndex > 0) {
            const prevImg = visibleImages[currentImageIndex - 1].querySelector('img');
            const preloadPrev = new Image();
            preloadPrev.src = prevImg?.dataset?.src || prevImg?.src;
        }

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

    // Determine if more images exist beyond the current set
    const matchingItems = Array.from(galleryItems).filter(item => {
        const okCat = (currentCategory === 'all' || item.dataset.category === currentCategory);
        const okSub = (currentSubcategory === 'all' || item.dataset.subcategory === currentSubcategory);
        return okCat && okSub;
    });

    const isLastVisible = currentImageIndex === visibleImages.length - 1;
    const hasMore = visibleImages.length < matchingItems.length;

    if (isLastVisible && !hasMore) {
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

    // Preload the next few hidden images for smoother mobile experience
    const preloadCount = 3;
    for (let i = visibleItems; i < visibleItems + preloadCount && i < galleryItems.length; i++) {
        const nextImg = galleryItems[i].querySelector('img');
        if (nextImg && nextImg.dataset?.src) {
            const preloadNext = new Image();
            preloadNext.src = nextImg.dataset.src;
        }
    }

    // Mobile filter panel toggle
    const mobileFilterToggle = document.getElementById('mobile-filter-toggle');
    const mobileFilterPanel = document.getElementById('mobile-filter-panel');
    if (mobileFilterToggle && mobileFilterPanel) {
        mobileFilterToggle.addEventListener('click', () => {
            mobileFilterPanel.classList.toggle('hidden');
        });
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
    const lazyElements = document.querySelectorAll("img[data-src], source[data-srcset]");

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;

                if (element.tagName === "IMG") {
                    element.src = element.dataset.src;
                    element.removeAttribute("data-src");
                } else if (element.tagName === "SOURCE") {
                    element.srcset = element.dataset.srcset;
                    element.removeAttribute("data-srcset");
                }

                observer.unobserve(element);
            }
        });
    });

    lazyElements.forEach(el => {
        imageObserver.observe(el);
    });
});

// Featured Section JavaScript - Simplified Working Carousel

class FeaturedCarousel {
    constructor() {
        this.currentIndex = 0;
        this.autoScrollInterval = null;
        this.isPlaying = true;
        this.isPaused = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.autoScrollDelay = 5000; // 5 seconds
        
        // Featured images data (you can replace these URLs with your chosen images)
        this.featuredImages = [
            {
                url: 'https://res.cloudinary.com/dsnvuavbj/image/upload/q_auto,f_auto,w_800/v1750348343/old_lighthouse2_tajsfg.jpg',
                alt: 'Little Light House',
                category: 'gulf-coast',
                subcategory: 'lighthouses'
            },
            {
                url: 'https://res.cloudinary.com/dsnvuavbj/image/upload/q_auto,f_auto,w_800/bigben_framed_London_riaqjj.jpg',
                alt: 'Big Ben',
                category: 'travel',
                subcategory: 'london'
            },
            {
                url: 'https://res.cloudinary.com/dsnvuavbj/image/upload/q_auto,f_auto,w_800/v1750350515/gulfport_harbor_ilivgh.jpg',
                alt: 'Gulfport Harbor',
                category: 'gulf-coast',
                subcategory: 'seascapes'
            },
            {
                url: 'https://res.cloudinary.com/dsnvuavbj/image/upload/q_auto,f_auto,w_800/Fagaras_Mountains_Romania_nw6cdo.jpg',
                alt: 'Fagaras Mountains',
                category: 'travel',
                subcategory: 'romania'
            },
            {
                url: 'https://res.cloudinary.com/dsnvuavbj/image/upload/q_auto,f_auto,w_800/v1750354111/praise2-2_yk2m5a.jpg',
                alt: 'Praise',
                category: 'events',
                subcategory: 'fbcbiloxi'
            },
            {
                url: 'https://res.cloudinary.com/dsnvuavbj/image/upload/q_auto,f_auto,w_800/nyc_crosswalk_xduydt.jpg',
                alt: 'All the NYC Vibes',
                category: 'travel',
                subcategory: 'new-york'
            },
            {
                url: 'https://res.cloudinary.com/dsnvuavbj/image/upload/q_auto,f_auto,w_800/v1750354096/kids_on_beach_xfuz2v.jpg',
                alt: 'Kiddos on the Beach',
                category: 'lifestyle',
                subcategory: 'family'
            },
            {
                url: 'https://res.cloudinary.com/dsnvuavbj/image/upload/q_auto,f_auto,w_800/v1750354002/starcase_film_bk1kil.jpg',
                alt: 'Cat Island Spiral Staircase',
                category: 'film',
                subcategory: 'canon-ae-1'
            },
            {
                url: 'https://res.cloudinary.com/dsnvuavbj/image/upload/q_auto,f_auto,w_800/v1750350889/birdandfish_nhkgen.jpg',
                alt: 'The Osprey\'s Catch',
                category: 'gulf-coast',
                subcategory: 'wildlife'
            },
            {
                url: 'https://res.cloudinary.com/dsnvuavbj/image/upload/q_auto,f_auto,w_800/v1750354088/jw1_m5kfo1.jpg',
                alt: 'Portrait',
                category: 'portraits',
                subcategory: 'headshots'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.createCarouselItems();
        this.createIndicators();
        this.bindEvents();
        this.updateCarousel();
        this.startAutoScroll();
        this.preloadImages();
        
        // Accessibility
        this.setupKeyboardNavigation();
        this.setupAriaLabels();
    }
    
    createCarouselItems() {
        const track = document.getElementById('featured-track');
        if (!track) return;
        
        track.innerHTML = '';
        
        this.featuredImages.forEach((image, index) => {
            const item = document.createElement('div');
            item.className = 'featured-item';
            item.setAttribute('data-index', index);
            
            const isMobile = window.innerWidth < 768;
            
            if (isMobile) {
                // Mobile: Single image layout
                item.innerHTML = `
                    <div class="featured-image-container">
                        <img class="featured-image" 
                             src="${image.url}" 
                             alt="${image.alt}"
                             data-image-index="${index}"
                             loading="lazy">
                    </div>
                `;
            } else {
                // Desktop: 3 images layout (center + sides)
                const prevIndex = (index - 1 + this.featuredImages.length) % this.featuredImages.length;
                const nextIndex = (index + 1) % this.featuredImages.length;
                
                item.innerHTML = `
                    <div class="featured-image-container featured-image-side">
                        <img class="featured-image" 
                             src="${this.featuredImages[prevIndex].url}" 
                             alt="${this.featuredImages[prevIndex].alt}"
                             data-image-index="${prevIndex}"
                             loading="lazy">
                    </div>
                    <div class="featured-image-container featured-image-main">
                        <img class="featured-image" 
                             src="${image.url}" 
                             alt="${image.alt}"
                             data-image-index="${index}"
                             loading="lazy">
                    </div>
                    <div class="featured-image-container featured-image-side">
                        <img class="featured-image" 
                             src="${this.featuredImages[nextIndex].url}" 
                             alt="${this.featuredImages[nextIndex].alt}"
                             data-image-index="${nextIndex}"
                             loading="lazy">
                    </div>
                `;
            }
            
            track.appendChild(item);
        });
    }
    
    createIndicators() {
        const indicatorsContainer = document.getElementById('featured-indicators');
        if (!indicatorsContainer) return;
        
        indicatorsContainer.innerHTML = '';
        
        this.featuredImages.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = `featured-indicator ${index === 0 ? 'active' : ''}`;
            indicator.setAttribute('data-index', index);
            indicator.setAttribute('role', 'tab');
            indicator.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
            indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
            
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
            
            indicatorsContainer.appendChild(indicator);
        });
    }
    
    bindEvents() {
        const carousel = document.querySelector('.featured-carousel');
        const prevBtn = document.querySelector('.featured-nav-prev');
        const nextBtn = document.querySelector('.featured-nav-next');
        
        if (!carousel) return;
        
        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Pause on hover
        carousel.addEventListener('mouseenter', () => this.pauseAutoScroll());
        carousel.addEventListener('mouseleave', () => this.resumeAutoScroll());
        
        // Touch/swipe support for mobile
        carousel.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        carousel.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        // Click to open lightbox
        carousel.addEventListener('click', (e) => {
            const imageElement = e.target.closest('img');
            if (imageElement) {
                const imageIndex = parseInt(imageElement.getAttribute('data-image-index'));
                this.openLightbox(imageIndex);
            }
        });
        
        // Window resize handler
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.createCarouselItems();
                this.updateCarousel();
            }, 100);
        });
    }
    
    setupKeyboardNavigation() {
        const carousel = document.querySelector('.featured-carousel');
        if (!carousel) return;
        
        carousel.setAttribute('tabindex', '0');
        carousel.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    this.toggleAutoScroll();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.featuredImages.length - 1);
                    break;
            }
        });
    }
    
    setupAriaLabels() {
        const carousel = document.querySelector('.featured-carousel');
        if (carousel) {
            carousel.setAttribute('aria-live', 'polite');
            carousel.setAttribute('aria-label', `Featured image carousel with ${this.featuredImages.length} images`);
        }
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
        this.pauseAutoScroll();
    }
    
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
        this.resumeAutoScroll();
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.featuredImages.length) % this.featuredImages.length;
        this.updateCarousel();
        this.resetAutoScroll();
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.featuredImages.length;
        this.updateCarousel();
        this.resetAutoScroll();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
        this.resetAutoScroll();
    }
    
    updateCarousel() {
        const items = document.querySelectorAll('.featured-item');
        const indicators = document.querySelectorAll('.featured-indicator');
        
        // Simple, clean transition without conflicting styles
        items.forEach((item, index) => {
            if (index === this.currentIndex) {
                item.classList.add('active');
                item.classList.remove('fade-out', 'fade-in');
            } else {
                item.classList.remove('active', 'fade-in');
                item.classList.add('fade-out');
                
                // Clean up after transition
                setTimeout(() => {
                    if (!item.classList.contains('active')) {
                        item.classList.remove('fade-out');
                    }
                }, 1000);
            }
        });
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            const isActive = index === this.currentIndex;
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        
        // Update ARIA live region
        const carousel = document.querySelector('.featured-carousel');
        if (carousel) {
            const currentImage = this.featuredImages[this.currentIndex];
            carousel.setAttribute('aria-label', `Slide ${this.currentIndex + 1} of ${this.featuredImages.length}: ${currentImage.alt}`);
        }
    }
    
    // Remove the complex performCrossFadeTransition function
    
    startAutoScroll() {
        if (!this.isPlaying) return;
        
        this.autoScrollInterval = setInterval(() => {
            if (!this.isPaused) {
                this.nextSlide();
            }
        }, this.autoScrollDelay);
    }
    
    pauseAutoScroll() {
        this.isPaused = true;
        const carousel = document.querySelector('.featured-carousel');
        if (carousel) {
            carousel.classList.add('paused');
        }
    }
    
    resumeAutoScroll() {
        this.isPaused = false;
        const carousel = document.querySelector('.featured-carousel');
        if (carousel) {
            carousel.classList.remove('paused');
        }
    }
    
    resetAutoScroll() {
        this.stopAutoScroll();
        setTimeout(() => {
            this.startAutoScroll();
        }, 100);
    }
    
    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }
    
    toggleAutoScroll() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.startAutoScroll();
        } else {
            this.stopAutoScroll();
        }
    }
    
    preloadImages() {
        // Preload next few images for smooth transitions
        const preloadCount = Math.min(3, this.featuredImages.length);
        for (let i = 1; i <= preloadCount; i++) {
            const index = (this.currentIndex + i) % this.featuredImages.length;
            const img = new Image();
            img.src = this.featuredImages[index].url;
        }
    }
    
    openLightbox(imageIndex) {
        // Create a separate lightbox experience for featured images
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        
        if (!lightbox || !lightboxImg || !lightboxCaption) return;
        
        const image = this.featuredImages[imageIndex];
        
        // Set lightbox content
        lightboxImg.src = image.url;
        lightboxCaption.textContent = image.alt;
        
        // Store reference to featured carousel for navigation
        lightbox.setAttribute('data-source', 'featured-carousel');
        lightbox.setAttribute('data-featured-index', imageIndex);
        
        // Show lightbox
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
        
        // Pause carousel while lightbox is open
        this.pauseAutoScroll();
        
        // Override lightbox navigation for featured images only
        this.setupFeaturedLightboxNavigation(lightbox, imageIndex);
        
        // Resume when lightbox closes
        const closeHandler = () => {
            if (!lightbox.classList.contains('active')) {
                this.resumeAutoScroll();
                this.cleanupFeaturedLightboxNavigation(lightbox);
                lightbox.removeEventListener('transitionend', closeHandler);
                lightbox.removeAttribute('data-source');
                lightbox.removeAttribute('data-featured-index');
            }
        };
        lightbox.addEventListener('transitionend', closeHandler);
    }
    
    setupFeaturedLightboxNavigation(lightbox, startIndex) {
        this.currentFeaturedIndex = startIndex;
        
        // Get navigation elements
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        
        if (prevBtn && nextBtn) {
            // Clone buttons to remove all existing event listeners
            const newPrevBtn = prevBtn.cloneNode(true);
            const newNextBtn = nextBtn.cloneNode(true);
            
            // Replace old buttons with new ones
            prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
            nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
            
            // Add our featured navigation listeners
            this.featuredPrevHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.currentFeaturedIndex = (this.currentFeaturedIndex - 1 + this.featuredImages.length) % this.featuredImages.length;
                this.updateFeaturedLightbox(this.currentFeaturedIndex);
            };
            
            this.featuredNextHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.currentFeaturedIndex = (this.currentFeaturedIndex + 1) % this.featuredImages.length;
                this.updateFeaturedLightbox(this.currentFeaturedIndex);
            };
            
            newPrevBtn.addEventListener('click', this.featuredPrevHandler);
            newNextBtn.addEventListener('click', this.featuredNextHandler);
            
            // Store references for cleanup
            this.featuredPrevElement = newPrevBtn;
            this.featuredNextElement = newNextBtn;
        }
        
        // Override keyboard navigation
        this.featuredKeyHandler = (e) => {
            if (!lightbox.classList.contains('active') || lightbox.getAttribute('data-source') !== 'featured-carousel') return;
            
            if (e.key === 'Escape') {
                this.closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.currentFeaturedIndex = (this.currentFeaturedIndex - 1 + this.featuredImages.length) % this.featuredImages.length;
                this.updateFeaturedLightbox(this.currentFeaturedIndex);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.currentFeaturedIndex = (this.currentFeaturedIndex + 1) % this.featuredImages.length;
                this.updateFeaturedLightbox(this.currentFeaturedIndex);
            }
        };
        
        // Remove existing keyboard listeners and add ours
        document.removeEventListener('keydown', this.originalKeyHandler);
        document.addEventListener('keydown', this.featuredKeyHandler);
    }
    
    updateFeaturedLightbox(index) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const lightbox = document.getElementById('lightbox');
        
        if (lightboxImg && lightboxCaption) {
            const image = this.featuredImages[index];
            
            // Smooth image transition
            lightboxImg.style.opacity = '0.5';
            
            setTimeout(() => {
                lightboxImg.src = image.url;
                lightboxCaption.textContent = image.alt;
                lightbox.setAttribute('data-featured-index', index);
                lightboxImg.style.opacity = '1';
            }, 150);
        }
    }
    
    cleanupFeaturedLightboxNavigation(lightbox) {
        // Get current navigation elements
        const currentPrevBtn = lightbox.querySelector('.lightbox-prev');
        const currentNextBtn = lightbox.querySelector('.lightbox-next');
        
        if (currentPrevBtn && currentNextBtn && this.featuredPrevElement && this.featuredNextElement) {
            // Clone again to remove our listeners
            const cleanPrevBtn = currentPrevBtn.cloneNode(true);
            const cleanNextBtn = currentNextBtn.cloneNode(true);
            
            // Replace with clean buttons
            currentPrevBtn.parentNode.replaceChild(cleanPrevBtn, currentPrevBtn);
            currentNextBtn.parentNode.replaceChild(cleanNextBtn, currentNextBtn);
            
            // Re-initialize the original portfolio lightbox navigation
            this.reinitializePortfolioLightbox(cleanPrevBtn, cleanNextBtn);
        }
        
        // Remove our keyboard handler
        document.removeEventListener('keydown', this.featuredKeyHandler);
        
        // Clean up references
        this.featuredPrevElement = null;
        this.featuredNextElement = null;
        this.currentFeaturedIndex = null;
    }
    
    reinitializePortfolioLightbox(prevBtn, nextBtn) {
        // Re-add the original portfolio lightbox event listeners
        // This reconnects to your existing portfolio lightbox system
        if (window.lightboxPrev && window.lightboxNext) {
            prevBtn.addEventListener('click', window.lightboxPrev);
            nextBtn.addEventListener('click', window.lightboxNext);
        } else {
            // Fallback: try to find and call the original lightbox functions
            const galleryItems = document.querySelectorAll('.gallery-item.show');
            if (galleryItems.length > 0) {
                prevBtn.addEventListener('click', () => {
                    // Call original portfolio prev logic
                    if (window.currentImageIndex > 0) {
                        window.currentImageIndex--;
                        window.updateLightboxImage();
                    }
                });
                
                nextBtn.addEventListener('click', () => {
                    // Call original portfolio next logic
                    if (window.currentImageIndex < galleryItems.length - 1) {
                        window.currentImageIndex++;
                        window.updateLightboxImage();
                    }
                });
            }
        }
    }
    
    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.classList.remove('lightbox-open');
            this.resumeAutoScroll();
        }
    }
    
    destroy() {
        this.stopAutoScroll();
        window.removeEventListener('resize', this.handleResize);
        
        // Remove all event listeners
        const carousel = document.querySelector('.featured-carousel');
        if (carousel) {
            carousel.replaceWith(carousel.cloneNode(true));
        }
    }
}

// Initialize Featured Carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Make sure the featured section exists before initializing
    if (document.getElementById('featured')) {
        window.featuredCarousel = new FeaturedCarousel();
    }
});

// Handle page visibility changes (pause when tab is not active)
document.addEventListener('visibilitychange', () => {
    if (window.featuredCarousel) {
        if (document.hidden) {
            window.featuredCarousel.pauseAutoScroll();
        } else {
            window.featuredCarousel.resumeAutoScroll();
        }
    }
});