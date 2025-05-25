// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const addToCartButtons = document.querySelectorAll('button.add-to-cart');
const cartCount = document.querySelector('.cart-count');
const newsletterForm = document.querySelector('.newsletter-form');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
    if (!hamburger.contains(event.target) && !navLinks.contains(event.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Add to Cart Functionality
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
updateCartCount();

addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});

function addToCart(event) {
    const productCard = event.target.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    const productPrice = productCard.querySelector('.product-price').textContent;
    const productImage = productCard.querySelector('img').src;
    
    const product = {
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1
    };
    
    // Check if product already exists in cart
    const existingProductIndex = cartItems.findIndex(item => item.name === productName);
    
    if (existingProductIndex !== -1) {
        cartItems[existingProductIndex].quantity += 1;
    } else {
        cartItems.push(product);
    }
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Update cart count
    updateCartCount();
    
    // Update cart total
    updateCartTotal();
    
    // Show notification
    showNotification(`${productName} added to cart!`);
    
    // Open mini cart
    const miniCart = document.getElementById('mini-cart');
    const overlayBg = document.getElementById('overlay-bg');
    if (miniCart && overlayBg) {
        miniCart.classList.add('active');
        overlayBg.classList.add('active');
    }
}

function updateCartCount() {
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

function updateCartTotal() {
    // Calculate the total price
    const totalPrice = cartItems.reduce((total, item) => {
        const price = parseFloat(item.price.replace('₹', ''));
        return total + (price * item.quantity);
    }, 0);
    
    // Update the total price display
    const totalPriceElement = document.querySelector('.total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = `₹${totalPrice.toFixed(2)}`;
    }
    
    // Update or create cart items HTML
    const cartItemsContainer = document.querySelector('.cart-items');
    if (cartItemsContainer) {
        // Clear the container
        cartItemsContainer.innerHTML = '';
        
        if (cartItems.length === 0) {
            // Show empty cart message
            const emptyCartHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Your cart is empty</p>
                    <a href="products.html" class="btn">Shop Now</a>
                </div>
            `;
            cartItemsContainer.innerHTML = emptyCartHTML;
        } else {
            // Add each cart item
            cartItems.forEach((item, index) => {
                const itemTotal = parseFloat(item.price.replace('₹', '')) * item.quantity;
                const cartItemHTML = `
                    <div class="cart-item" data-index="${index}">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <div class="cart-item-price">${item.price} × ${item.quantity}</div>
                            <div class="cart-item-total">₹${itemTotal.toFixed(2)}</div>
                        </div>
                        <button class="remove-from-cart" data-index="${index}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                cartItemsContainer.innerHTML += cartItemHTML;
            });
            
            // Add event listeners to remove buttons
            const removeButtons = document.querySelectorAll('.remove-from-cart');
            removeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    removeFromCart(index);
                });
            });
        }
    }
}

function removeFromCart(index) {
    // Remove the item from cart
    cartItems.splice(index, 1);
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Update cart
    updateCartCount();
    updateCartTotal();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add visible class for animation
    setTimeout(() => {
        notification.classList.add('visible');
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('visible');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Newsletter Form Submission
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        // Here you would typically send this to a server
        // For now, we'll just simulate it
        console.log('Subscription email:', email);
        
        // Show success message
        showNotification('Thanks for subscribing to our newsletter!');
        
        // Reset form
        emailInput.value = '';
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: var(--light-text);
        padding: 12px 20px;
        border-radius: var(--border-radius);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transform: translateY(100px);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
        z-index: 1000;
    }
    
    .notification.visible {
        transform: translateY(0);
        opacity: 1;
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Initialize AOS (Animate on Scroll) library
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 350,
            easing: 'ease-out',
            once: true,
            offset: 50,
            disable: window.innerWidth < 768 ? true : false
        });
    }
    
    // Back to top button functionality
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        // Show button when user scrolls down 300px
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top when button is clicked
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Add hover effects for product cards
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    // Handle mobile navigation active state
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    const currentPath = window.location.pathname;
    const pageFilename = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    
    mobileNavLinks.forEach(link => {
        // Remove all active classes first
        link.classList.remove('active');
        
        // Check if this link corresponds to the current page
        const linkHref = link.getAttribute('href');
        if ((pageFilename === '' || pageFilename === '/' || pageFilename === 'index.html') && linkHref === 'index.html') {
            link.classList.add('active');
        } else if (linkHref === pageFilename) {
            link.classList.add('active');
        }
    });

    // Hide mobile navigation when keyboard is open (for better user experience)
    const formInputs = document.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            document.body.classList.add('keyboard-open');
        });
        
        input.addEventListener('blur', function() {
            document.body.classList.remove('keyboard-open');
        });
    });

    // Search, Cart and Account functionality
    const searchToggle = document.getElementById('search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearch = document.getElementById('close-search');
    
    const cartToggle = document.getElementById('cart-toggle');
    const miniCart = document.getElementById('mini-cart');
    const closeCart = document.getElementById('close-cart');
    
    const accountToggle = document.getElementById('account-toggle');
    const accountMenu = document.getElementById('account-menu');
    const closeAccount = document.getElementById('close-account');
    
    const overlayBg = document.getElementById('overlay-bg');
    
    // Function to close all menus
    function closeAllMenus() {
        if (searchOverlay) searchOverlay.classList.remove('active');
        if (miniCart) miniCart.classList.remove('active');
        if (accountMenu) accountMenu.classList.remove('active');
        if (overlayBg) overlayBg.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Search functionality
    if (searchToggle && searchOverlay && closeSearch) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            closeAllMenus();
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus the search input after a slight delay
            setTimeout(() => {
                const searchInput = searchOverlay.querySelector('input');
                if (searchInput) searchInput.focus();
            }, 100);
        });
        
        closeSearch.addEventListener('click', function() {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Cart functionality
    if (cartToggle && miniCart && closeCart && overlayBg) {
        cartToggle.addEventListener('click', function(e) {
            e.preventDefault();
            closeAllMenus();
            miniCart.classList.add('active');
            overlayBg.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeCart.addEventListener('click', function() {
            miniCart.classList.remove('active');
            overlayBg.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Account functionality
    if (accountToggle && accountMenu && closeAccount && overlayBg) {
        accountToggle.addEventListener('click', function(e) {
            e.preventDefault();
            closeAllMenus();
            accountMenu.classList.add('active');
            overlayBg.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeAccount.addEventListener('click', function() {
            accountMenu.classList.remove('active');
            overlayBg.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close menus when clicking on overlay background
    if (overlayBg) {
        overlayBg.addEventListener('click', closeAllMenus);
    }
    
    // Close menus on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllMenus();
        }
    });
    
    // Add to cart functionality for product pages
    const addToCartButtons = document.querySelectorAll('button.add-to-cart');
    
    if (addToCartButtons.length > 0) {
        // Initialize cart items from localStorage
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        updateCartCount();
        
        // Add click event to all add to cart buttons
        addToCartButtons.forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    // Product card click functionality to view product details
    productCards.forEach((card, index) => {
        // Add click event to the entire card
        card.addEventListener('click', function(e) {
            // Don't navigate if the add to cart button or mini store link was clicked
            if (e.target.classList.contains('add-to-cart') || 
                e.target.closest('.add-to-cart') ||
                e.target.classList.contains('btn') || 
                e.target.closest('.btn') ||
                e.target.href && e.target.href.includes('elecoffeeco.mini.store')) {
                e.stopPropagation();
                return;
            }
            
            // Get product data
            const productName = this.querySelector('h3').textContent;
            const productPrice = this.querySelector('.product-price').textContent;
            const productImage = this.querySelector('img').src;
            const productDescription = this.querySelector('p').textContent;
            
            // Additional data if available
            let productOrigin = '';
            let productRoast = '';
            
            const originElement = this.querySelector('.product-origin');
            const roastElement = this.querySelector('.product-roast');
            
            if (originElement) {
                productOrigin = originElement.textContent;
            }
            
            if (roastElement) {
                productRoast = roastElement.textContent;
            }
            
            // Create product data object
            const productData = {
                id: index + 1, // Simple ID for demo purposes
                name: productName,
                price: productPrice,
                image: productImage,
                description: productDescription,
                origin: productOrigin,
                roast: productRoast
            };
            
            // Store product data in localStorage
            localStorage.setItem('productData', JSON.stringify(productData));
            
            // Navigate to product detail page
            window.location.href = `product.html?id=${index + 1}`;
        });
        
        // Change cursor to pointer to indicate clickable
        card.style.cursor = 'pointer';
    });

    // Initialize the cart display on page load
    updateCartTotal();

    // Animate impact counters when in view
    const counters = document.querySelectorAll('.count');
    let counted = false;

    function animateCounters() {
        if (counted) return;
        
        const impactSection = document.querySelector('.impact-section');
        if (!impactSection) return;
        
        const position = impactSection.getBoundingClientRect();
        
        // If impact section is in viewport
        if(position.top < window.innerHeight && position.bottom >= 0) {
            counted = true;
            
            counters.forEach(counter => {
                // Set default target values if HTML is empty
                let target;
                if (counter.id === 'tree-count') {
                    target = 101;
                } else if (counter.id === 'donation-count') {
                    target = 5000;
                } else {
                    // Extract from innerHTML only if it contains a number
                    const text = counter.innerText.replace(/[^\d]/g, '');
                    target = text && !isNaN(parseInt(text)) ? parseInt(text) : 100;
                }
                
                let count = 0;
                const increment = target / 50; // Speed of counting
                
                function updateCount() {
                    const currentCount = Math.ceil(count);
                    if(currentCount < target) {
                        // Preserve currency symbol if it exists
                        if (counter.id === 'donation-count') {
                            counter.innerText = '₹' + currentCount.toLocaleString() + '+';
                        } else {
                            counter.innerText = currentCount.toLocaleString() + '+';
                        }
                        count += increment;
                        setTimeout(updateCount, 20); // Faster animation (30ms → 20ms)
                    } else {
                        if (counter.id === 'donation-count') {
                            counter.innerText = '₹' + target.toLocaleString() + '+';
                        } else {
                            counter.innerText = target.toLocaleString() + '+';
                        }
                    }
                }
                
                updateCount();
            });
        }
    }

    // Call immediately and on scroll events
    window.addEventListener('scroll', animateCounters);
    
    // Ensure counters animate on page load
    if (document.readyState === 'complete') {
        animateCounters();
    } else {
        window.addEventListener('load', animateCounters);
    }
    
    // Also trigger on DOMContentLoaded to ensure early animation
    document.addEventListener('DOMContentLoaded', animateCounters);

    // Spotlight effect on impact features
    const impactFeatures = document.querySelectorAll('.impact-feature');

    impactFeatures.forEach(feature => {
        feature.addEventListener('mousemove', e => {
            const rect = feature.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            feature.style.setProperty('--mouse-x', `${x}px`);
            feature.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Account Management
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('eleCurrentUser'));
    updateUserInterface(currentUser);
    
    // Account toggle functionality - reuse variables already defined
    if (accountToggle) {
        accountToggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close all other overlays
            closeAllMenus();
            
            // Open account menu
            if (accountMenu) accountMenu.classList.add('active');
            if (overlayBg) overlayBg.classList.add('active');
        });
    }
    
    // Login form functionality
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Validate login credentials
            const users = JSON.parse(localStorage.getItem('eleUsers') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Set current user in localStorage
                localStorage.setItem('eleCurrentUser', JSON.stringify({
                    fullName: user.fullName,
                    email: user.email,
                    loggedIn: true
                }));
                
                // Update UI
                updateUserInterface({
                    fullName: user.fullName,
                    email: user.email,
                    loggedIn: true
                });
                
                // Close account menu
                if (accountMenu) accountMenu.classList.remove('active');
                if (overlayBg) overlayBg.classList.remove('active');
                
                // Show success notification
                showNotification('Successfully logged in. Welcome back!');
            } else {
                // Show error message
                showNotification('Invalid email or password. Please try again.');
            }
        });
    }
    
    // Handle logout
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear current user
            localStorage.removeItem('eleCurrentUser');
            
            // Update UI
            updateUserInterface(null);
            
            // Show notification
            showNotification('Successfully logged out.');
            
            // Close account menu
            if (accountMenu) accountMenu.classList.remove('active');
            if (overlayBg) overlayBg.classList.remove('active');
        });
    }
    
    // Update user interface based on login status
    function updateUserInterface(user) {
        const accountMenuContent = document.querySelector('.account-menu-content');
        
        if (accountMenuContent) {
            if (user && user.loggedIn) {
                // User is logged in, show user details and logout option
                accountMenuContent.innerHTML = `
                    <div class="logged-in-content">
                        <div class="user-info">
                            <h4>Welcome, ${user.fullName}</h4>
                            <p>${user.email}</p>
                        </div>
                        <div class="account-links">
                            <a href="account-dashboard.html">My Account</a>
                            <a href="order-history.html">Order History</a>
                            <a href="#" id="logout-button">Logout</a>
                        </div>
                    </div>
                `;
                
                // Add event listener to the new logout button
                document.getElementById('logout-button').addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Clear current user
                    localStorage.removeItem('eleCurrentUser');
                    
                    // Update UI
                    updateUserInterface(null);
                    
                    // Show notification
                    showNotification('Successfully logged out.');
                    
                    // Close account menu
                    if (accountMenu) accountMenu.classList.remove('active');
                    if (overlayBg) overlayBg.classList.remove('active');
                });
            } else {
                // User is not logged in, show login form
                accountMenuContent.innerHTML = `
                    <div class="account-login">
                        <form class="login-form">
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" placeholder="Your email" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" id="password" placeholder="Your password" required>
                            </div>
                            <button type="submit" class="btn btn-block">Sign In</button>
                        </form>
                        <div class="account-links">
                            <a href="#">Forgot password?</a>
                            <a href="create-account.html">Create account</a>
                        </div>
                    </div>
                `;
                
                // Re-add event listener to the login form
                const newLoginForm = accountMenuContent.querySelector('.login-form');
                if (newLoginForm) {
                    newLoginForm.addEventListener('submit', function(e) {
                        e.preventDefault();
                        
                        const email = document.getElementById('email').value;
                        const password = document.getElementById('password').value;
                        
                        // Validate login credentials
                        const users = JSON.parse(localStorage.getItem('eleUsers') || '[]');
                        const user = users.find(u => u.email === email && u.password === password);
                        
                        if (user) {
                            // Set current user in localStorage
                            localStorage.setItem('eleCurrentUser', JSON.stringify({
                                fullName: user.fullName,
                                email: user.email,
                                loggedIn: true
                            }));
                            
                            // Update UI
                            updateUserInterface({
                                fullName: user.fullName,
                                email: user.email,
                                loggedIn: true
                            });
                            
                            // Close account menu
                            if (accountMenu) accountMenu.classList.remove('active');
                            if (overlayBg) overlayBg.classList.remove('active');
                            
                            // Show success notification
                            showNotification('Successfully logged in. Welcome back!');
                        } else {
                            // Show error message
                            showNotification('Invalid email or password. Please try again.');
                        }
                    });
                }
            }
        }
    }

    // Product Image Gallery Functionality
    const galleries = document.querySelectorAll('.image-gallery');
    
    galleries.forEach(gallery => {
        const dots = gallery.querySelectorAll('.gallery-dot');
        const images = gallery.querySelectorAll('img');
        const productCard = gallery.closest('.product-card');
        const productTitle = productCard ? productCard.querySelector('h3').textContent : '';
        
        // Special handling for 300gms Coffee Powder product
        if (productTitle && productTitle.includes('300gms') && productTitle.includes('Coffee Powder')) {
            // Skip the second image if it exists
            const imageArray = Array.from(images);
            if (imageArray.length > 2) {
                const secondImage = imageArray[1];
                if (secondImage && secondImage !== imageArray[0]) {
                    secondImage.remove();
                }
            }
        }
        
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                // Get the index from the data attribute
                const index = this.getAttribute('data-index');
                
                // Remove active class from all images and dots
                images.forEach(img => img.classList.remove('active-image'));
                dots.forEach(dot => dot.classList.remove('active'));
                
                // Add active class to the selected image and dot
                const activeImages = Array.from(images);
                if (activeImages[index]) {
                    activeImages[index].classList.add('active-image');
                    this.classList.add('active');
                }
            });
        });
    });
});