// Addd interection observer for section transition
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver(
    (entries) =>{
        entries.forEach(entry =>{
            if(entry.isIntersecting){
                entry.target.classList.add('active');
            }
        });
    },
    {threshold: 0.5}

);

sections.forEach(section => observer.observe(section));



// Cart functionality
// Function to get cart items from localStorage
function getCartItems() {
    const items = localStorage.getItem('cartItems');
    return items ? JSON.parse(items) : [];
}

// Function to save cart items to localStorage
function saveCartItems(items) {
    localStorage.setItem('cartItems', JSON.stringify(items));
}

// Function to add a product to the cart
function addToCart(event) {
    const button = event.currentTarget;
    // उत्पाद विवरण (Product Details) बॉक्स से निकालें
    const productBox = button.closest('.box');

    // अगर हम एक मान्य productBox में हैं
    if (productBox) {
        const item = {
            id: Date.now(), // प्रत्येक आइटम के लिए अद्वितीय ID (Unique ID)
            img: productBox.querySelector('img').getAttribute('src'),
            name: productBox.querySelector('h4').textContent,
            desc: productBox.querySelector('span:nth-of-type(1)').textContent,
            price: parseFloat(productBox.querySelector('.new-price').textContent.replace('₹', '')),
            quantity: 1
        };

        const cartItems = getCartItems();
        cartItems.push(item);
        saveCartItems(cartItems);

        alert(`${item.name} has been added to your cart!`);

        // कार्ट आइकन को अपडेट करने के लिए अगर यह main page पर है
        // यहाँ हम सिर्फ alert दिखा रहे हैं, लेकिन आप UI अपडेट कर सकते हैं
    }
}

// Event Listeners for "ADD TO CART" buttons
document.addEventListener('DOMContentLoaded', () => {
    // मुख्य पेज पर सभी 'ADD TO CART' बटन चुनें
    const cartButtons = document.querySelectorAll('.btn-cart');
    cartButtons.forEach(button => {
        // सुनिश्चित करें कि यह फ़ंक्शन केवल मुख्य पेज पर ही सक्रिय हो,
        // क्योंकि cart.html में कोई .btn-cart नहीं होगा
        if (button.closest('.cloth-container')) {
             button.addEventListener('click', addToCart);
        }
    });

    // नेविगेशन बार में कार्ट आइकन को cart.html से लिंक करें (अगर यह main.html है)
    const cartIcon = document.querySelector('.nav2 .ri-shopping-cart-2-fill');
    if (cartIcon && !window.location.href.includes('cart.html')) {
        cartIcon.closest('h4').style.cursor = 'pointer';
        cartIcon.closest('h4').onclick = () => {
            window.location.href = 'cart.html';
        };
    }
});


// =========================================================
// CART PAGE FUNCTIONS (cart.html)
// =========================================================

function displayCart() {
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalElement = document.getElementById('cart-total');
    const emptyMessage = document.getElementById('empty-cart-message');
    
    if (!cartItemsList || !cartTotalElement) return; // केवल cart.html पर काम करें

    let cartItems = getCartItems();
    cartItemsList.innerHTML = ''; // मौजूदा सामग्री साफ करें
    let total = 0;

    if (cartItems.length === 0) {
        if (emptyMessage) emptyMessage.style.display = 'block';
    } else {
        if (emptyMessage) emptyMessage.style.display = 'none';

        cartItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';
            cartItemDiv.innerHTML = `
                <div class="item-details">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="item-name">
                        <h4>${item.name}</h4>
                        <p>${item.desc}</p>
                    </div>
                </div>
                <div class="item-quantity">
                    Qty: ${item.quantity} 
                    </div>
                <div class="item-price">
                    ₹${itemTotal.toFixed(2)}
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            `;
            cartItemsList.appendChild(cartItemDiv);
        });
    }

    cartTotalElement.textContent = total.toFixed(2);
    // कुल राशि को पेमेंट पेज के लिए स्टोर करें
    localStorage.setItem('orderTotal', total.toFixed(2));
}

function removeFromCart(itemId) {
    let cartItems = getCartItems();
    // उस आइटम को हटाएँ जिसकी ID मैच करती है
    cartItems = cartItems.filter(item => item.id !== itemId); 
    
    saveCartItems(cartItems);
    displayCart(); // कार्ट UI को फिर से लोड करें
}

function placeOrder() {
    const total = parseFloat(localStorage.getItem('orderTotal'));
    if (total > 0) {
        // Payment page पर जाएँ
        window.location.href = 'payment.html';
    } else {
        alert('Your cart is empty. Please add items to place an order.');
    }
}



// =======================================
// 🍔 MOBILE MENU TOGGLE LOGIC (script.js)
// =======================================

document.addEventListener('DOMContentLoaded', () => {
    // अन्य सारा DOMContentLoaded लॉजिक यहाँ जारी रहेगा...
    
    const hamburgerIcon = document.querySelector('.nav2 h5'); // आपका हैमबर्गर आइकन
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = mobileMenu.querySelectorAll('a');

    if (hamburgerIcon && mobileMenu) {
        // 1. Hamburger आइकन पर क्लिक करने पर मेन्यू को खोलें/बंद करें
        hamburgerIcon.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });

        // 2. जब यूज़र मेन्यू में किसी लिंक पर क्लिक करे, तो मेन्यू को बंद कर दें
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
        
        // 3. (Optional) जब विंडो का साइज़ बड़ा हो जाए, तो मेन्यू को हटा दें
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                mobileMenu.classList.remove('active');
            }
        });
    }

    //... बाकी का cart.js लॉजिक यहाँ जारी रहेगा।
});