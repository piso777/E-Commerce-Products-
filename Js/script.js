const productContainer = document.querySelector(".content .products");
const showingProducts = document.querySelector(".showingProducts");
const cartContent = document.querySelector(".cartContent");
const cartNum = document.querySelector(".cartNum");
let cartCount = 0;
let productQuantities = {};
let searchProductBar = document.querySelector(".searchProductBar");
let goToCart = document.querySelector(".goToCart");
let goToFavorites = document.querySelector(".goToFavorites");

function gettingUserNameInTheSite() {
  const theUserName = document.querySelector("nav .container .userDetails h2");
  if (theUserName && localStorage.getItem("userName")) {
    theUserName.innerHTML = `Welcome, ${localStorage.getItem("userName")}`;
  } else {
    console.error(
      "User details element not found or username not set in localStorage"
    );
  }
}
gettingUserNameInTheSite();

async function displayProducts() {
  try {
    const response = await fetch("https://fakestoreapi.in/api/products");
    if (!response.ok) throw new Error("Failed to fetch products");
    const products = await response.json();
    if (!products.products) throw new Error("No products found in response");

    const productTheme = products.products.map((item) => {
      return `
        <div class="product my-4 text-center border border-2 border-black rounded-3 p-3">
          <img class="w-100" src="${item.image}" alt="Product Image">
          <div class="productDetails">
            <h2 class="product-name">Name: ${item.title}</h2>
            <h2>Price: ${item.price}$</h2>
            <h2 class="product-category">Category: ${item.category}</h2>
          </div>
          <div class="cartAndFav d-flex justify-content-around">
            <div class="addToCart">
              <h2 onclick="showCart(${item.id})" title="Add To Cart" class="cartIcon mx-3 bg-black text-white px-3 p-1 pt-2 rounded-3">Add To Cart</h2>
            </div>
            <div class="addToFav">
              <h2 onclick="addToFavorites(${item.id})" title="Add To Favorites" class="favIcon mx-3 bg-warning text-black px-3 p-1 pt-2 rounded-3">Add to Fav</h2>
            </div>
          </div>
        </div>
      `;
    });

    if (productContainer) {
      productContainer.innerHTML = productTheme.join("");
    } else {
      console.error("Product container not found!");
    }
  } catch (error) {
    console.error("Error fetching products:", error.message);
  }
}
displayProducts();

async function showCart(id) {
  try {
    const response = await fetch("https://fakestoreapi.in/api/products");
    if (!response.ok) throw new Error("Failed to fetch products");
    const products = await response.json();
    const product = products.products.find((item) => item.id === id);
    if (!product) throw new Error(`Product with ID ${id} not found`);

    const currentCount = productQuantities[id] || 0;
    const productTitle = `
      <div class="remove" id="product-${id}">
        <h2>-Product Name:-</h2>
        <p class="text-center fs-5 fw-bolder mt-2 bg-primary p-3 rounded-5">-${product.title}</p>
        <div>
          <i onclick="increaseProduct(${id})" class="plus fa-solid fa-square-plus text-success fs-3 fw-bolder"></i>
          <span class="increase decrease fs-3 fw-bolder">${currentCount}</span>
          <i onclick="decreaseProduct(${id})" class="minus fa-solid fa-square-minus text-danger fs-3 fw-bolder"></i>
        </div>
      </div>
    `;

    if (!document.querySelector(`#product-${id}`)) {
      if (showingProducts) {
        showingProducts.innerHTML += productTitle;
      }
      cartCount++;
      if (cartNum) {
        cartNum.innerHTML = cartCount;
      }

      let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      cartItems.push({ ...product, quantity: currentCount + 1 });
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  } catch (error) {
    console.error("Error showing cart:", error.message);
  }
}

function increaseProduct(id) {
  productQuantities[id] = (productQuantities[id] || 0) + 1;
  const increaseElem = document.querySelector(`#product-${id} .increase`);
  if (increaseElem) {
    increaseElem.innerHTML = productQuantities[id];
  } else {
    console.error(`Increase element for product ID ${id} not found`);
  }
}

function decreaseProduct(id) {
  if (productQuantities[id] && productQuantities[id] > 0) {
    productQuantities[id]--;
    const increaseElem = document.querySelector(`#product-${id} .increase`);
    if (increaseElem) {
      increaseElem.innerHTML = productQuantities[id];
    }
  } else if (productQuantities[id] === 0) {
    const productElem = document.querySelector(`#product-${id}`);
    if (productElem) {
      productElem.remove();
    }
    cartCount--;
    if (cartNum) {
      cartNum.innerHTML = cartCount;
    }
  }
}

if (searchProductBar) {
  searchProductBar.addEventListener("keyup", (e) => {
    const searchValue = e.target.value.toLowerCase();
    const productNames = document.querySelectorAll(".product-name");
    productNames.forEach((productName) => {
      if (productName.innerHTML.toLowerCase().includes(searchValue)) {
        productName.parentElement.parentElement.style.display = "block";
      } else {
        productName.parentElement.parentElement.style.display = "none";
      }
    });
  });
} else {
  console.error("Search product bar not found!");
}

if (goToCart) {
  goToCart.addEventListener("click", () => {
    window.location = "cartPage.html";
  });
} else {
  console.error("Go to cart button not found!");
}

async function displayCart() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  let totalPrice = 0;

  if (cartContent) {
    cartContent.innerHTML = "";
    cartItems.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;

      const productInCart = `
        <div class="cart-item d-flex justify-content-between border-bottom p-3">
          <div class="product-info d-flex">
            <img src="${item.image}" alt="${
        item.title
      }" class="cart-product-image" style="width: 100px; height: 100px; object-fit: cover; margin-right: 15px;">
            <div>
              <h4>${item.title}</h4>
              <p>Price: $${item.price}</p>
              <p>Quantity: ${item.quantity}</p>
            </div>
          </div>
          <div class="product-total">
            <h5>Total: $${itemTotal.toFixed(2)}</h5>
            <button class="remove-btn btn btn-danger" onclick="removeFromCart(${
              item.id
            })">Remove</button>
          </div>
        </div>
      `;

      cartContent.innerHTML += productInCart;
    });

    const totalPriceElement = `
      <div class="total-price text-center mt-3">
        <h3>Total Price: $${totalPrice.toFixed(2)}</h3>
      </div>
    `;

    cartContent.innerHTML += totalPriceElement;
  } else {
    console.error("Cart content element not found!");
  }
}

displayCart();

function removeFromCart(id) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  cartItems = cartItems.filter((item) => item.id !== id);

  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  displayCart();
}

function increaseProduct(id) {
  productQuantities[id] = (productQuantities[id] || 0) + 1;
  const increaseElem = document.querySelector(`#product-${id} .increase`);
  if (increaseElem) {
    increaseElem.innerHTML = productQuantities[id];
  }

  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const productIndex = cartItems.findIndex((item) => item.id === id);
  if (productIndex > -1) {
    cartItems[productIndex].quantity = productQuantities[id];
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }
}

function decreaseProduct(id) {
  if (productQuantities[id] && productQuantities[id] > 0) {
    productQuantities[id]--;
    const increaseElem = document.querySelector(`#product-${id} .increase`);
    if (increaseElem) {
      increaseElem.innerHTML = productQuantities[id];
    }

    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const productIndex = cartItems.findIndex((item) => item.id === id);
    if (productIndex > -1) {
      cartItems[productIndex].quantity = productQuantities[id];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  } else if (productQuantities[id] === 0) {
    const productElem = document.querySelector(`#product-${id}`);
    if (productElem) {
      productElem.remove();
    }
    cartCount--;
    if (cartNum) {
      cartNum.innerHTML = cartCount;
    }

    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems = cartItems.filter((item) => item.id !== id);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }
}

function addToFavorites(id) {
  fetch("https://fakestoreapi.in/api/products")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    })
    .then((products) => {
      const product = products.products.find((item) => item.id === id);
      if (!product) throw new Error(`Product with ID ${id} not found`);

      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      if (!favorites.some((fav) => fav.id === id)) {
        favorites.push(product);
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }
    })
    .catch((error) => {
      console.error("Error adding to favorites:", error.message);
    });
}

function displayFavorites() {
  goToFavorites.addEventListener("click", () => {
    window.location = "favorite.html";
  });
}
displayFavorites();
