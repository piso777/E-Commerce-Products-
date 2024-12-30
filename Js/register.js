let userName = document.querySelector(".userName");
let userEmail = document.querySelector(".userEmail");
let userPassword = document.querySelector(".userPassword");
regBtn = document.querySelector("#regBtn");
regBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    userName.value === "" ||
    userEmail.value === "" ||
    userPassword.value === ""
  ) {
    alert("Please Fill All Data");
  } else {
    localStorage.setItem("userName", userName.value);
    localStorage.setItem("userEmail", userEmail.value);
    localStorage.setItem("userPassword", userPassword.value);
    window.location = "login.html";
    console.log("object");
  }
});
