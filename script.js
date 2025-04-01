// Theme Switcher
function setTheme(theme, event) {
    // Remove all theme classes
    document.body.classList.remove('theme-dark', 'theme-contrast');

    // Add selected theme class
    if (theme !== 'light') {
        document.body.classList.add(`theme-${theme}`);
    }

    // Update active button
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // If this was called from a click event, update the clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // If this was called directly, find and activate the matching button
        const themeBtn = document.querySelector(`.theme-btn[onclick*="${theme}"]`);
        if (themeBtn) {
            themeBtn.classList.add('active');
        }
    }

    // Save theme preference
    localStorage.setItem('theme', theme);

    // Update CSS variables based on theme
    updateThemeColors(theme);
}

function updateThemeColors(theme) {
    const root = document.documentElement;

    switch (theme) {
        case 'dark':
            root.style.setProperty('--primary-color', '#FF6B6B');
            root.style.setProperty('--secondary-color', '#ECF0F1');
            root.style.setProperty('--accent-color', '#FFD700');
            root.style.setProperty('--text-color', '#FFFFFF');
            root.style.setProperty('--background-color', '#1A1A1A');
            root.style.setProperty('--card-bg', '#2D2D2D');
            root.style.setProperty('--card-border', '#404040');
            root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
            root.style.setProperty('--hover-shadow', 'rgba(0, 0, 0, 0.4)');
            break;
        case 'contrast':
            root.style.setProperty('--primary-color', '#FF0000');
            root.style.setProperty('--secondary-color', '#000000');
            root.style.setProperty('--accent-color', '#FFFF00');
            root.style.setProperty('--text-color', '#000000');
            root.style.setProperty('--background-color', '#FFFFFF');
            root.style.setProperty('--card-bg', '#FFFFFF');
            root.style.setProperty('--card-border', '#000000');
            root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.5)');
            root.style.setProperty('--hover-shadow', 'rgba(0, 0, 0, 0.7)');
            break;
        default: // light
            root.style.setProperty('--primary-color', '#FF4D4D');
            root.style.setProperty('--secondary-color', '#2C3E50');
            root.style.setProperty('--accent-color', '#FFD700');
            root.style.setProperty('--text-color', '#333');
            root.style.setProperty('--background-color', '#F5F5F5');
            root.style.setProperty('--card-bg', '#FFFFFF');
            root.style.setProperty('--card-border', '#e5e5e5');
            root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
            root.style.setProperty('--hover-shadow', 'rgba(0, 0, 0, 0.12)');
    }
}

function toggleThemeSwitcher() {
    const switcher = document.querySelector('.theme-switcher');
    switcher.classList.toggle('collapsed');
    switcher.classList.toggle('expanded');
}

// Navigation and Section Scrolling
function scrollToSection(sectionId) {
    debugger; // Debug point 1: Check if function is called
    console.log('Attempting to scroll to section:', sectionId);
    const section = document.getElementById(sectionId);
    console.log('Found section:', section); // Debug point 2: Check if section is found

    if (section) {
        // First scroll to the section
        section.scrollIntoView({ behavior: 'smooth' });
        console.log('Scrolled to section'); // Debug point 3: Check if scroll worked

        // Then filter to show only that section
        filterCategory(sectionId);
        console.log('Filtered category'); // Debug point 4: Check if filter worked
    } else {
        console.error('Section not found:', sectionId); // Debug point 5: Error if section not found
    }
}

// Category Filtering
function filterCategory(category) {
    debugger; // Debug point 6: Check if filter function is called
    console.log('Filtering category:', category);
    const sections = document.querySelectorAll('.menu-category-section');
    console.log('Found sections:', sections.length); // Debug point 7: Check number of sections

    sections.forEach(section => {
        console.log('Checking section:', section.id); // Debug point 8: Check each section
        if (category === 'all' || section.id === category) {
            section.style.display = 'block';
            console.log('Showing section:', section.id); // Debug point 9: Log visible sections
        } else {
            section.style.display = 'none';
            console.log('Hiding section:', section.id); // Debug point 10: Log hidden sections
        }
    });

    // Update active filter button
    const filterButtons = document.querySelectorAll('.category-filter-btn');
    console.log('Found filter buttons:', filterButtons.length); // Debug point 11: Check filter buttons

    filterButtons.forEach(btn => {
        console.log('Button category:', btn.dataset.category); // Debug point 12: Check button categories
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
            console.log('Activated button:', btn.dataset.category); // Debug point 13: Log active button
        }
    });
}

// Cart functionality
let cart = [];

function addToCart(item) {
    // Check if item already exists in cart
    const existingItem = cart.find(cartItem => cartItem.name === item.name && cartItem.price === item.price);

    if (existingItem) {
        // If item exists, increment quantity
        existingItem.quantity += 1;
    } else {
        // If item doesn't exist, add it with quantity 1
        cart.push({
            ...item,
            quantity: 1
        });
    }

    updateCartDisplay();
    updateCartCount();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    updateCartCount();
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const subtotalElement = document.querySelector('.subtotal span:last-child');
    const totalElement = document.querySelector('.total span:last-child');

    // Clear current cart items
    cartItems.innerHTML = '';

    let subtotal = 0;

    // Add each item to cart display
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';

        // Calculate item total
        const price = parseFloat(item.price.replace('₱', '').replace(',', ''));
        const itemTotal = price * item.quantity;
        subtotal += itemTotal;

        itemElement.innerHTML = `
            <img src="https://via.placeholder.com/80x80.png?text=${item.name}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateCartItemQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartItemQuantity(${index}, 1)">+</button>
                </div>
                <div class="cart-item-total">₱${itemTotal.toFixed(2)}</div>
            </div>
        `;

        cartItems.appendChild(itemElement);
    });

    // Update subtotal and total
    const deliveryFee = 50;
    const total = subtotal + deliveryFee;

    subtotalElement.textContent = `₱${subtotal.toFixed(2)}`;
    totalElement.textContent = `₱${total.toFixed(2)}`;
}

function updateCartItemQuantity(index, change) {
    const item = cart[index];
    const newQuantity = item.quantity + change;

    if (newQuantity > 0) {
        item.quantity = newQuantity;
        updateCartDisplay();
        updateCartCount();
    } else {
        removeFromCart(index);
    }
}

function toggleCart() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    cartSidebar.classList.toggle('active');
}

function closeCart() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    cartSidebar.classList.remove('active');
}

// Initialize cart icon click handler
document.querySelector('.cart-icon').addEventListener('click', toggleCart);

// Item Overview Modal
let currentQuantity = 1;
let currentItem = null;

function showItemOverview(card) {
    const modal = document.getElementById('itemModal');
    const modalImage = modal.querySelector('.modal-image img');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDescription = modal.querySelector('.modal-description');
    const modalPrice = modal.querySelector('.modal-price');
    const quantityValue = modal.querySelector('.quantity-value');

    // Get item details from the card
    const image = card.querySelector('.card-image img').src;
    const title = card.querySelector('.card-title').textContent;
    const description = card.querySelector('.card-description').textContent;

    // Handle both regular and special prices
    let price;
    const specialPrice = card.querySelector('.special-price');
    const regularPrice = card.querySelector('.price');

    if (specialPrice) {
        price = specialPrice.textContent;
    } else if (regularPrice) {
        price = regularPrice.textContent;
    } else {
        console.error('No price found for item:', title);
        return;
    }

    // Store current item for cart functionality
    currentItem = {
        name: title,
        price: price,
        quantity: 1
    };

    // Update modal content
    modalImage.src = image;
    modalImage.alt = title;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalPrice.textContent = price;
    quantityValue.textContent = '1';
    currentQuantity = 1;

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeItemOverview() {
    const modal = document.getElementById('itemModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentItem = null;
}

function updateQuantity(change) {
    const quantityValue = document.querySelector('.quantity-value');
    currentQuantity = Math.max(1, currentQuantity + change);
    quantityValue.textContent = currentQuantity;

    if (currentItem) {
        currentItem.quantity = currentQuantity;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    debugger; // Debug point 14: Check if initialization runs
    console.log('DOM Content Loaded');

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Initialize category filters
    const filterButtons = document.querySelectorAll('.category-filter-btn');
    console.log('Found filter buttons on init:', filterButtons.length); // Debug point 15: Check initial buttons

    filterButtons.forEach(btn => {
        console.log('Setting up button:', btn.dataset.category); // Debug point 16: Log button setup
        btn.addEventListener('click', () => {
            console.log('Button clicked:', btn.dataset.category); // Debug point 17: Log button clicks
            filterCategory(btn.dataset.category);
        });
    });

    // Initialize cart
    updateCartCount();
    updateCartDisplay();

    // Add click handlers for "Add to Cart" buttons
    document.querySelectorAll('.btn-primary').forEach(button => {
        console.log('Found button:', button.textContent.trim()); // Debug point 18: Log found buttons
        if (button.textContent.trim() === 'Add to Cart') {
            button.addEventListener('click', function () {
                console.log('Add to Cart clicked'); // Debug point 19: Log cart clicks
                const card = this.closest('.card');
                const name = card.querySelector('.card-title').textContent;
                const price = card.querySelector('.price').textContent;
                addToCart({ name, price });
            });
        }
    });

    // Add click handlers for "View Menu" buttons
    document.querySelectorAll('.btn-primary').forEach(button => {
        if (button.textContent.trim() === 'View Menu') {
            console.log('Found View Menu button'); // Debug point 20: Log view menu buttons
            button.addEventListener('click', function () {
                console.log('View Menu clicked'); // Debug point 21: Log view menu clicks
                // Try to get section ID from onclick attribute
                const onclickAttr = this.getAttribute('onclick');
                console.log('onclick attribute:', onclickAttr); // Debug point 22: Log onclick attribute

                if (onclickAttr) {
                    const match = onclickAttr.match(/'([^']+)'/);
                    console.log('Match result:', match); // Debug point 23: Log match result
                    if (match) {
                        const sectionId = match[1];
                        console.log('Section ID:', sectionId); // Debug point 24: Log section ID
                        scrollToSection(sectionId);
                    }
                } else {
                    // Try to get section ID from parent card
                    const card = this.closest('.card');
                    if (card) {
                        const sectionId = card.querySelector('.card-title').textContent.toLowerCase().replace(/\s+/g, '-');
                        console.log('Derived section ID:', sectionId); // Debug point 25: Log derived section ID
                        scrollToSection(sectionId);
                    }
                }
            });
        }
    });

    // Add click handler for checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            console.log('Checkout clicked'); // Debug point 27: Log checkout clicks
            if (cart.length === 0) {
                showNotification('Your cart is empty');
                return;
            }
            showNotification('Proceeding to checkout...');
        });
    }

    // Add double-click handler for item cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('dblclick', () => {
            showItemOverview(card);
        });
    });

    // Add click handlers for modal controls
    const modal = document.getElementById('itemModal');
    if (modal) {
        // Close button
        modal.querySelector('.modal-close').addEventListener('click', closeItemOverview);

        // Overlay click
        modal.querySelector('.modal-overlay').addEventListener('click', closeItemOverview);

        // Quantity controls
        modal.querySelector('.quantity-btn.minus').addEventListener('click', () => updateQuantity(-1));
        modal.querySelector('.quantity-btn.plus').addEventListener('click', () => updateQuantity(1));

        // Add to cart button
        modal.querySelector('.add-to-cart-modal').addEventListener('click', () => {
            if (currentItem) {
                // Add item to cart with quantity
                for (let i = 0; i < currentItem.quantity; i++) {
                    addToCart({
                        name: currentItem.name,
                        price: currentItem.price
                    });
                }
                closeItemOverview();
            }
        });
    }

    // Mobile Navigation Toggle
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';

    const nav = document.querySelector('.main-nav');
    const navLinks = document.querySelector('.nav-links');

    if (nav && navLinks) {
        nav.insertBefore(menuToggle, navLinks);

        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    }
});
