// Get form and input fields
const form = document.getElementById("regForm");

// First & last name fields and error containers
const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const nameError = document.getElementById("errorFirstName");
const lastNameError = document.getElementById("errorLastName");

// Email and phone
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");

// Gender
const gender = document.getElementById("gender");
const genderError = document.getElementById("genderError");

// Address fields
const street = document.getElementById("street");
const streetError = document.getElementById("streetError");

const city = document.getElementById("city");
const cityError = document.getElementById("cityError");

const state = document.getElementById("state");
const stateError = document.getElementById("stateError");

const zip = document.getElementById("zip");
const zipError = document.getElementById("zipError");

const country = document.getElementById("country");
const countryError = document.getElementById("countryError");

// Account fields
const username = document.getElementById("username");
const usernameError = document.getElementById("usernameError");

const passowrd = document.getElementById("password");
const passwordErrorList = document.getElementById("passwordErrorList");
const passwordHeader = document.getElementById("passwordHeader");

const message = document.getElementById("matchMessage");

// Submit event listener
form.addEventListener("submit", function (e) {
  e.preventDefault(); // prevent actual form submission

  // Regex to validate names (at least 2 characters, only letters/spaces)
  /* ============================
   Personal Information Validation
   ============================ */
  const nameRegex = /^[A-Za-z\s]{2,}$/;
  // === First Name Validation ===
  if (firstName.value.trim() === "") {
    firstName.classList.add("input-error");
    nameError.textContent = "First name is required.";
  } else if (!nameRegex.test(firstName.value.trim())) {
    firstName.classList.add("input-error");
    nameError.textContent = "First name must be at least 2 letters.";
  } else {
    firstName.classList.remove("input-error");
    nameError.textContent = "";
  }

  // === Last Name Validation ===
  if (lastName.value.trim() === "") {
    lastName.classList.add("input-error");
    lastNameError.textContent = "Last name is required";
  } else if (!nameRegex.test(lastName.value.trim())) {
    lastName.classList.add("input-error");
    lastNameError.textContent =
      "Last name must be at least 2 letters and contain only letters and spaces.";
  } else {
    lastName.classList.remove("input-error");
    lastNameError.textContent = "";
  }

  // === Email Validation ===
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.value.trim() === "") {
    email.classList.add("input-error");
    emailError.textContent = "Email is required";
  } else if (!emailRegex.test(email.value.trim())) {
    email.classList.add("input-error");
    emailError.textContent = "Please enter a valid email address.";
  } else {
    email.classList.remove("input-error");
    emailError.textContent = "";
  }

  // === Phone Validation === (10–15 digits, optional +, starts with 1–9)
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  if (!phoneRegex.test(phone.value.trim())) {
    phone.classList.add("input-error");
    phoneError.textContent =
      "Enter a valid international phone number (10–15 digits).";
  } else {
    phone.classList.remove("input-error");
    phoneError.textContent = "";
  }

  // === Gender Validation ===
  if (gender.value === "") {
    gender.classList.add("input-error");
    genderError.textContent = "Gender required";
  } else {
    gender.classList.remove("input-error");
    genderError.textContent = "";
  }

  /* =============================
     Address Information Validation
     ============================= */

  // === Street Validation ===
  if (street.value.trim() === "") {
    street.classList.add("input-error");
    streetError.textContent =
      "Enter a valid street address (5–100 characters).";
  } else {
    street.classList.remove("input-error");
    streetError.textContent = "";
  }

  // Regex patterns for city, state, and zip
  const cityPattern = /^[a-zA-Z\s\-'.]{2,50}$/;
  const statePattern = /^[a-zA-Z\s\-'.]{2,50}$/;
  const zipPattern = /^[A-Za-z0-9\s\-]{3,10}$/;

  // === City Validation ===
  if (!cityPattern.test(city.value.trim())) {
    city.classList.add("input-error");
    cityError.textContent = "Enter a valid city name.";
  } else {
    city.classList.remove("input-error");
    cityError.textContent = "";
  }

  // === State Validation ===
  if (!statePattern.test(state.value.trim())) {
    state.classList.add("input-error");
    stateError.textContent = "Enter a valid state or region.";
  } else {
    state.classList.remove("input-error");
    stateError.textContent = "";
  }

  // === ZIP Code Validation ===
  if (!zipPattern.test(zip.value.trim())) {
    zip.classList.add("input-error");
    zipError.textContent = "Enter a valid ZIP/postal code.";
  } else {
    zip.classList.remove("input-error");
    zipError.textContent = "";
  }

  // === Country Validation (select dropdown) ===
  if (country.value === "") {
    country.classList.add("input-error");
    countryError.textContent = "Select a country.";
  } else {
    country.classList.remove("input-error");
    countryError.textContent = "";
  }

  /* =============================
     Account Information Validation
     ============================= */

  // === Username Validation ===
  const usernamePattern = /^(?!.*[._]{2})[a-zA-Z][a-zA-Z0-9._]{3,19}(?<![._])$/;
  if (!usernamePattern.test(username.value.trim())) {
    username.classList.add("input-error");
    usernameError.textContent = "Enter a valid username.";
  } else {
    username.classList.remove("input-error");
    usernameError.textContent = "";
  }

  // === Password Validation === (multi-rule check)
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}[\]|:;"'<>,.?/~`]).{8,}$/;

  // Reset password error display
  passwordErrorList.innerHTML = "";
  passwordHeader.style.display = "none";

  const password = password.value.trim();
  const errors = [];

  // === Individual rule checks ===
  if (password.length < 8) errors.push("Must be at least 8 characters.");
  if (!/[a-z]/.test(password))
    errors.push("Must contain at least one lowercase letter.");
  if (!/[A-Z]/.test(password))
    errors.push("Must contain at least one uppercase letter.");
  if (!/[0-9]/.test(password)) errors.push("Must contain at least one digit.");
  if (!/[!@#$%^&*()_+=\-{}[\]|:;"'<>,.?/~`]/.test(password))
    errors.push("Must contain at least one special character.");

  // Display error messages if any
  if (errors.length > 0) {
    passwordHeader.style.display = "block";
    password.classList.add("input-error");

    errors.forEach((msg) => {
      const li = document.createElement("li");
      li.textContent = msg;
      passwordErrorList.appendChild(li);
    });
  } else {
    passwordHeader.style.display = "none";
    passwordErrorList.innerHTML = "";
    password.classList.remove("input-error");
  }

  // === Confirm Password Match Check ===
  const confirm = document.getElementById("confirm").value;
  if (password !== confirm) {
    message.textContent = "❌ Passwords do not match.";
    message.classList.add("input-error");
  } else {
    message.textContent = "";
    message.classList.remove("input-error");
  }
});

/* ================================
   Toggle Password Visibility Function
   ================================ */

function toggleVisibility(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}
