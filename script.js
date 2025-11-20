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












// =======================================
// 🔐 LOGIN/GATEKEEPING LOGIC (script.js)
// =======================================

// 1. Check if the user is logged in (Local Storage का इस्तेमाल)
function isUserLoggedIn() {
    // हम 'isLoggedIn' नाम के एक लोकल स्टोरेज आइटम को चेक कर रहे हैं
    return localStorage.getItem('isLoggedIn') === 'true';
}

// 2. Gatekeeper function: यह फ़ंक्शन हर क्लिक इवेंट पर चलता है
function gatekeeper(event) {
    if (!isUserLoggedIn()) {
        // अगर यूज़र लॉग इन नहीं है
        event.preventDefault(); // बटन या लिंक के डिफ़ॉल्ट एक्शन को रोकें
        event.stopPropagation(); // इवेंट को आगे बढ़ने से रोकें

        alert("Please log in or sign up to continue shopping.");
        
        // यूज़र को सीधे लॉगिन/साइनअप पेज पर भेजें
        window.location.href = 'new.html';
        
        return false;
    }
    // अगर यूज़र लॉग इन है, तो फ़ंक्शन कुछ नहीं करता और डिफ़ॉल्ट एक्शन (जैसे लिंक पर जाना) हो जाता है
    return true;
}

// 3. Setup the event listeners (DOM Ready)
document.addEventListener('DOMContentLoaded', () => {
    // मौजूदा DOMContentLoaded लॉजिक यहाँ जारी रहेगा...

    // A. 'ADD TO CART' बटन पर लॉजिक
    const cartButtons = document.querySelectorAll('.btn-cart');
    cartButtons.forEach(button => {
        // AddToCart फ़ंक्शन से पहले gatekeeper को कॉल करें
        button.addEventListener('click', (event) => {
            if (gatekeeper(event)) {
                // अगर gatekeeper true देता है, तो add to cart लॉजिक चलाएँ
                addToCart(event); 
            }
        });
    });

    // B. 'BUY NOW' बटन पर लॉजिक
    const buyButtons = document.querySelectorAll('.btn-buy, a[href="buy.html"], a[href$=".html"]:not([href="index.html"])');
    buyButtons.forEach(button => {
        // BuyNow बटन पर gatekeeper को सीधे अटैच करें
        if (button.tagName === 'A') {
             button.addEventListener('click', gatekeeper);
        } else {
             // अगर बटन है, तो उसे लिंक की तरह काम करने के लिए gatekeeper से पहले चेक करें
             button.addEventListener('click', gatekeeper);
        }
    });

    // C. 'SHOP NOW' बटन और बैनर लिंक्स/इमेज पर लॉजिक
    const shopNowElements = document.querySelectorAll('.banner-video, .new-arrival img, .btn, .nav2 a, .nav2 h4:not(.ri-menu-3-line)');
    shopNowElements.forEach(element => {
         // हम cart.html और user-profile.html को छोड़कर सभी इंटरैक्शन को सुरक्षित करना चाहते हैं
         if (element.tagName === 'A' || element.tagName === 'IMG' || element.tagName === 'VIDEO' || element.tagName === 'BUTTON' || element.tagName === 'H4') {
             element.addEventListener('click', gatekeeper);
         }
    });
    
    // ... बाकी का cart.js और mobile menu लॉजिक यहाँ जारी रहेगा।
});

// =========================================
// 4. LOGIN PAGE के लिए फ़ंक्शन (new.html)
// =========================================

// यह फ़ंक्शन आपके new.html पेज के successful login/signup के बाद कॉल होना चाहिए
function setLoggedInStatus() {
    // लॉग इन सफल होने पर इसे कॉल करें
    localStorage.setItem('isLoggedIn', 'true');
    // यूज़र को वापस index.html पर भेजें या जहाँ से वे आए थे
    window.location.href = 'index.html'; 
}

// 5. LOGOUT फ़ंक्शन
function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    alert("You have been logged out.");
    window.location.href = 'index.html';
}

// (Tip: आप अपने user-profile.html के Logout बटन पर logoutUser() को कॉल कर सकते हैं)
