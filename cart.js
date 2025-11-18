// // Load cart from localStorage or create empty array
// let cart = JSON.parse(localStorage.getItem("cart")) || [];

// // Add item to cart
// function addToCart(name, price) {
//   cart.push({ name: name, price: price });
//   localStorage.setItem("cart", JSON.stringify(cart));
//   displayCart();
// }

// // Display cart items
// function displayCart() {
//   const cartItems = document.getElementById("cartItems");
//   const totalAmount = document.getElementById("totalAmount");

//   cartItems.innerHTML = "";
//   let total = 0;

//   cart.forEach(function(item) {
//     const div = document.createElement("div");
//     div.classList.add("cart-item");
//     div.textContent = item.name + " — ₹" + item.price;
//     cartItems.appendChild(div);
//     total += item.price;
//   });

//   totalAmount.textContent = total;
// }

// // Show items on page load
// displayCart();


let cart = [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

function updateCart() {
    document.getElementById("cart-count").innerText = cart.length;

    let itemsBox = document.getElementById("cart-items");
    itemsBox.innerHTML = "";

    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        total += item.price;

        itemsBox.innerHTML += `
            <div class="cart-item">
                <p>${item.name} - ₹${item.price}</p>
                <button onclick="removeItem(${i})">Remove</button>
            </div>
        `;
    }

    document.getElementById("total-price").innerText = total;
}

function addToCart(name, price) {
    cart.push({ name: name, price: price });
    updateCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

function placeOrder() {
    if (cart.length === 0) {
        alert("Cart empty.");
        return;
    }

    let order = {
        id: Date.now(),
        items: cart,
        total: cart.reduce((a, b) => a + b.price, 0)
    };

    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    cart = [];
    updateCart();

    alert("Order placed.");
}