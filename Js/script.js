const productContainer = document.querySelector(".content .products");
const showingProducts = document.querySelector(".showingProducts");
let cartCount = 0;
const cartNum = document.querySelector(".cartNum");
function gettingUserNameInTheSite() {
  const theUserName = document.querySelector("nav .container .userDetails h2");
  if (localStorage.getItem("userName")) {
    theUserName.innerHTML = `Welcome , ${localStorage.getItem("userName")}`;
  }
}
gettingUserNameInTheSite();
let productQuantities = {};
async function displayProducts() {
  const response = await fetch("https://fakestoreapi.in/api/products");
  const products = await response.json();
  const productTheme = products.products.map((item) => {
    return `
        <div class="product my-4 text-center border border-2 border-black rounded-3 p-3">
          <img class=" w-100" src="${item.image}" alt="">
          <div class="productDetails">
            <h2>Name: ${item.title}</h2>
            <h2>Price : ${item.price}$</h2>
            <h2>Category: ${item.category}</h2>
          </div>
          <div class="cartAndFav d-flex justify-content-around">
            <div class ="addToCart">
              <img  onclick="showCart(${item.id})" title="Add To Cart" class="cartIcon mx-3" src="Images/cartlogo.png" alt="cartLogo">
              <p onclick="showCart(${item.id})" class=" mt-3 fs-5 fw-bolder bg-info p-3 rounded-5  ">Add To Cart</p>
            </div>
            <div class ="addToFav">
              <img title="Add TO Favorites" class="heartIcon mx-3" src="./Images/favoritelogo.png" alt="">
              <p class=" mt-3 fs-5 fw-bolder bg-info p-3 rounded-5  ">Add To Favorites</p>
            </div>
          </div>
        </div>
      `;
  });
  productContainer.innerHTML = productTheme;
}
displayProducts();

async function showCart(id) {
  const response = await fetch("https://fakestoreapi.in/api/products");
  const products = await response.json();
  const product = products.products.find((item) => item.id === id);
  const currentCount = productQuantities[id] || 0;
  const productTitle = `
    <div class="remove" id="product-${id}">
      <h2>-Product Name :-</h2>
      <p class=" text-center fs-5 fw-bolder mt-2 bg-primary p-3 rounded-5">-${product.title}</p>
      <div>
        <i onclick="increaseProduct(${id})" class="fa-solid fa-square-plus text-success fs-3 fw-bolder"></i>
        <span class="increase decrease fs-3 fw-bolder">${currentCount}</span>
        <i onclick="decreaseProduct(${id})" class="fa-solid fa-square-minus text-danger fs-3 fw-bolder"></i>
      </div>
    </div>
  `;
  if (!document.querySelector(`#product-${id}`)) {
    showingProducts.innerHTML += productTitle;
    cartCount++;
    cartNum.innerHTML = cartCount;
  }
}

function increaseProduct(id) {
  productQuantities[id] = (productQuantities[id] || 0) + 1;
  document.querySelector(`#product-${id} .increase`).innerHTML =
    productQuantities[id];
}

function decreaseProduct(id) {
  if (productQuantities[id] > 0) {
    productQuantities[id]--;
    document.querySelector(`#product-${id} .increase`).innerHTML =
      productQuantities[id];
  } else {
    document.querySelector(`#product-${id}`).remove();
    cartCount--;
    cartNum.innerHTML = cartCount;
  }
}

function increasingCartNum() {}
