// Main JavaScript file for Palm & Pine Beauty Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeCart();
    initializeNavigation();
    initializeProductFilters();
    initializeNewsletterForm();
    initializeAnimations();
    initializeImageZoom();
});

// ----------------------
// Cart Functionality
// ----------------------
function initializeCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-count');
    
    // Load cart from localStorage if available
    let cartItems = JSON.parse(localStorage.getItem('palmPineCart')) || [];
    updateCartDisplay(cartItems.length);
    
    // Add to cart click handler
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const productTitle = card.querySelector('.product-title').textContent;
            const productPrice = card.querySelector('.product-price').textContent;
            const productCategory = card.querySelector('.product-category').textContent;
            const productImage = card.querySelector('.product-image img').src;
            
            // Create product object
            const product = {
                id: generateUniqueId(),
                title: productTitle,
                price: productPrice,
                category: productCategory,
                image: productImage,
                quantity: 1
            };
            
            // Check if product already in cart
            const existingProductIndex = cartItems.findIndex(item => item.title === productTitle);
            
            if (existingProductIndex > -1) {
                // Update quantity if product already in cart
                cartItems[existingProductIndex].quantity += 1;
                showNotification(`Increased ${productTitle} quantity in cart`, 'success');
            } else {
                // Add new product to cart
                cartItems.push(product);
                showNotification(`Added ${productTitle} to cart`, 'success');
            }
            
            // Save to localStorage and update display
            localStorage.setItem('palmPineCart', JSON.stringify(cartItems));
            updateCartDisplay(cartItems.length);
            
            // Animation effect
            animateAddToCart(button);
        });
    });
    
    // Update cart count display
    function updateCartDisplay(count) {
        cartCount.textContent = count;
        if (count > 0) {
            cartCount.classList.add('has-items');
        } else {
            cartCount.classList.remove('has-items');
        }
    }
    
    // Generate random ID for cart items
    function generateUniqueId() {
        return 'pid_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Visual feedback for adding to cart
    function animateAddToCart(button) {
        button.classList.add('adding');
        button.textContent = 'Added!';
        
        setTimeout(() => {
            button.classList.remove('adding');
            button.textContent = 'Add to Cart';
        }, 1500);
    }
}

// ----------------------
// Navigation
// ----------------------
function initializeNavigation() {
    const header = document.querySelector('header');
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<span></span><span></span><span></span>';
    header.querySelector('nav').appendChild(mobileMenuToggle);
    
    // Mobile menu functionality
    mobileMenuToggle.addEventListener('click', function() {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('active');
        this.classList.toggle('active');
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                document.querySelector('.nav-links').classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Sticky header on scroll
    let lastScrollPosition = 0;
    
    window.addEventListener('scroll', function() {
        const currentScrollPosition = window.pageYOffset;
        
        if (currentScrollPosition > 150) {
            header.classList.add('sticky');
            
            // Hide header when scrolling down, show when scrolling up
            if (currentScrollPosition > lastScrollPosition) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
        } else {
            header.classList.remove('sticky');
        }
        
        lastScrollPosition = currentScrollPosition;
    });
}

// ----------------------
// Product Filters
// ----------------------
function initializeProductFilters() {
    // Only initialize if we have the filter elements
    const filterContainer = document.querySelector('.product-filters');
    if (!filterContainer) return;
    
    const productGrid = document.querySelector('.product-grid');
    const filterButtons = document.querySelectorAll('.filter-button');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter products
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach(card => {
                const category = card.querySelector('.product-category').textContent.toLowerCase();
                
                if (filterValue === 'all' || category.includes(filterValue.toLowerCase())) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.classList.remove('hidden');
                    }, 10);
                } else {
                    card.classList.add('hidden');
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ----------------------
// Newsletter Form
// ----------------------
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (isValidEmail(email)) {
            // Simulate form submission
            this.classList.add('submitting');
            
            setTimeout(() => {
                this.classList.remove('submitting');
                this.classList.add('submitted');
                this.innerHTML = '<p class="success-message">Thank you for subscribing!</p>';
                
                // Save to localStorage for demo purposes
                let subscribers = JSON.parse(localStorage.getItem('palmPineSubscribers')) || [];
                subscribers.push({ email: email, date: new Date().toISOString() });
                localStorage.setItem('palmPineSubscribers', JSON.stringify(subscribers));
            }, 1500);
        } else {
            showNotification('Please enter a valid email address', 'error');
            emailInput.classList.add('error');
            
            setTimeout(() => {
                emailInput.classList.remove('error');
            }, 3000);
        }
    });
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// ----------------------
// Notifications
// ----------------------
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Create notification container if it doesn't exist
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    notificationContainer.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ----------------------
// Animation Effects
// ----------------------
function initializeAnimations() {
    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if (!revealElements.length) return;
    
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('revealed');
            }
        });
    }
    
    // Initial check
    revealOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);
}

// ----------------------
// Product Image Zoom
// ----------------------
function initializeImageZoom() {
    const productImages = document.querySelectorAll('.product-image img');
    
    productImages.forEach(img => {
        img.addEventListener('click', function() {
            // Create modal with zoomed image
            const modal = document.createElement('div');
            modal.className = 'image-zoom-modal';
            
            const modalImg = document.createElement('img');
            modalImg.src = this.src;
            
            const closeBtn = document.createElement('span');
            closeBtn.className = 'zoom-close';
            closeBtn.innerHTML = '&times;';
            
            modal.appendChild(modalImg);
            modal.appendChild(closeBtn);
            document.body.appendChild(modal);
            
            // Animation
            setTimeout(() => {
                modal.classList.add('open');
            }, 10);
            
            // Close functionality
            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            function closeModal() {
                modal.classList.remove('open');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        });
    });
}

// ----------------------
// Reviews System
// ----------------------
function initializeReviews() {
    const reviewForm = document.querySelector('.review-form');
    if (!reviewForm) return;
    
    const reviewsContainer = document.querySelector('.reviews-container');
    const ratingInputs = document.querySelectorAll('input[name="rating"]');
    const ratingValue = document.querySelector('.rating-value');
    
    // Update rating display as user selects stars
    ratingInputs.forEach(input => {
        input.addEventListener('change', function() {
            ratingValue.textContent = this.value;
        });
    });
    
    // Handle review submission
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[name="name"]').value.trim();
        const rating = this.querySelector('input[name="rating"]:checked')?.value || 0;
        const comment = this.querySelector('textarea[name="comment"]').value.trim();
        
        if (!name || !comment || rating === 0) {
            showNotification('Please fill out all fields', 'error');
            return;
        }
        
        // Create new review
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML = `
            <div class="review-header">
                <span class="reviewer-name">${name}</span>
                <div class="review-rating">
                    ${'★'.repeat(parseInt(rating))}${'☆'.repeat(5 - parseInt(rating))}
                </div>
            </div>
            <div class="review-content">${comment}</div>
            <div class="review-date">${new Date().toLocaleDateString()}</div>
        `;
        
        // Add to page
        reviewsContainer.prepend(reviewItem);
        
        // Save to localStorage
        saveReview({
            name: name,
            rating: rating,
            comment: comment,
            date: new Date().toISOString()
        });
        
        // Reset form
        this.reset();
        ratingValue.textContent = '0';
        
        showNotification('Thank you for your review!', 'success');
    });
    
    // Save review to localStorage
    function saveReview(review) {
        let reviews = JSON.parse(localStorage.getItem('palmPineReviews')) || [];
        reviews.unshift(review);
        localStorage.setItem('palmPineReviews', JSON.stringify(reviews));
    }
    
    // Load existing reviews
    function loadReviews() {
        const reviews = JSON.parse(localStorage.getItem('palmPineReviews')) || [];
        
        if (reviews.length === 0) return;
        
        reviews.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            reviewItem.innerHTML = `
                <div class="review-header">
                    <span class="reviewer-name">${review.name}</span>
                    <div class="review-rating">
                        ${'★'.repeat(parseInt(review.rating))}${'☆'.repeat(5 - parseInt(review.rating))}
                    </div>
                </div>
                <div class="review-content">${review.comment}</div>
                <div class="review-date">${new Date(review.date).toLocaleDateString()}</div>
            `;
            
            reviewsContainer.appendChild(reviewItem);
        });
    }
    
    // Initialize reviews
    loadReviews();
}

// Additional CSS for new JavaScript features
function injectAdditionalCSS() {
    const styleTag = document.createElement('style');
    styleTag.textContent = `
        /* Mobile Menu Styles */
        .mobile-menu-toggle {
            display: none;
            background: none;
            border: none;
            width: 30px;
            height: 24px;
            position: relative;
            cursor: pointer;
            z-index: 100;
        }
        
        .mobile-menu-toggle span {
            display: block;
            position: absolute;
            height: 3px;
            width: 100%;
            background: var(--primary-color);
            border-radius: 3px;
            transition: all 0.3s ease;
        }
        
        .mobile-menu-toggle span:nth-child(1) {
            top: 0;
        }
        
        .mobile-menu-toggle span:nth-child(2) {
            top: 10px;
        }
        
        .mobile-menu-toggle span:nth-child(3) {
            top: 20px;
        }
        
        .mobile-menu-toggle.active span:nth-child(1) {
            top: 10px;
            transform: rotate(45deg);
        }
        
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-toggle.active span:nth-child(3) {
            top: 10px;
            transform: rotate(-45deg);
        }
        
        /* Notification Styles */
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }
        
        .notification {
            background: white;
            padding: 15px 20px;
            margin-bottom: 10px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(120%);
            transition: transform 0.3s ease;
            max-width: 300px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            border-left: 4px solid var(--primary-color);
        }
        
        .notification.error {
            border-left: 4px solid #e74c3c;
        }
        
        .notification.info {
            border-left: 4px solid #3498db;
        }
        
        /* Cart Button Animation */
        .add-to-cart.adding {
            background-color: var(--primary-color);
            color: white;
        }
        
        /* Image Zoom Modal */
        .image-zoom-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.9);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .image-zoom-modal.open {
            opacity: 1;
        }
        
        .image-zoom-modal img {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        }
        
        .zoom-close {
            position: absolute;
            top: 20px;
            right: 30px;
            color: white;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
        }
        
        /* Header Sticky Styles */
        header.sticky {
            position: fixed;
            width: 100%;
            animation: slideDown 0.5s;
        }
        
        header.hidden {
            transform: translateY(-100%);
        }
        
        @keyframes slideDown {
            from {
                transform: translateY(-100%);
            }
            to {
                transform: translateY(0);
            }
        }
        
        /* Reveal Animation */
        .reveal-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .reveal-on-scroll.revealed {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Review Styles */
        .review-item {
            background: white;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .review-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        
        .reviewer-name {
            font-weight: 600;
        }
        
        .review-rating {
            color: var(--secondary-color);
        }
        
        .review-content {
            margin-bottom: 10px;
            line-height: 1.6;
        }
        
        .review-date {
            font-size: 0.8rem;
            color: #888;
            text-align: right;
        }
        
        @media (max-width: 768px) {
            .mobile-menu-toggle {
                display: block;
            }
            
            .nav-links {
                position: fixed;
                top: 0;
                right: -250px;
                width: 250px;
                height: 100vh;
                background-color: white;
                flex-direction: column;
                padding: 80px 20px 20px;
                transition: right 0.3s ease;
                box-shadow: -5px 0 15px rgba(0,0,0,0.1);
                z-index: 90;
            }
            
            .nav-links.active {
                right: 0;
            }
            
            .nav-links li {
                margin: 0 0 20px 0;
            }
        }
    `;
    
    document.head.appendChild(styleTag);
}

// Initialize additional CSS
injectAdditionalCSS();