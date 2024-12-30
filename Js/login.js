let userEmail = document.querySelector(".userEmail");
let userPassword = document.querySelector(".userPassword");
let loginBtn = document.querySelector("#loginBtn");
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (userEmail.value === "" || userPassword.value === "") {
    alert("Please Enter Your Email And Password");
  } else {
    if (
      userEmail.value.trim() === localStorage.getItem("userEmail").trim() &&
      userPassword.value.trim() === localStorage.getItem("userPassword").trim()
    ) {
      window.location = "home.html";
    } else {
      alert("Invalid Email Or Password");
    }
  }
});
