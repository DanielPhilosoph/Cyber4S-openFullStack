import "./addContact.scss";
import axios from "axios";
const baseUrl = "/";

async function addContact(event) {
  event.preventDefault();
  const label = document.getElementById("resultdiv");
  try {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const number = document.getElementById("number").value;
    if (
      validateFirstName(firstName) &&
      validateLastName(lastName) &&
      validateNumber(number)
    ) {
      label.style.display = "inline";
      label.innerText = "Loading...";
      let response;
      try {
        response = await axios.post(`${baseUrl}api/persons`, {
          name: firstName + " " + lastName,
          number: number,
        });
        label.innerText = `Added ${firstName} ${lastName} Successfuly`;
      } catch (error) {
        if (error.response.data.message === "name must be unique") {
          try {
            response = await axios.put(`${baseUrl}api/persons`, {
              name: firstName + " " + lastName,
              number: number,
            });
            label.innerText = `Updated ${firstName} ${lastName}`;
          } catch (error) {
            displayError(error.response.data.message);
          }
        }
      }
      setTimeout(() => {
        label.innerText = "";
        label.style.display = "none";
      }, 3 * 1000);
    }
  } catch (error) {
    label.innerText = "";
    return error;
  }
}

const addButton = document.getElementById("addButton");
addButton.addEventListener("click", addContact);

function validateFirstName(name) {
  if (/^[a-zA-Z0-9 ]+$/.test(name)) {
    return true;
  }
  displayError("First name is not invaid");
  return false;
}

function validateLastName(name) {
  if (/^[a-zA-Z0-9 ]+$/.test(name)) {
    return true;
  }
  displayError("Last name is not invaid");
  return false;
}

function validateNumber(number) {
  if (number.length <= 11 && number.length >= 7) {
    return true;
  }
  displayError("Number is not invaid");
  return false;
}

function displayError(text) {
  const errorDiv = document.getElementById("errorDiv");
  errorDiv.style.display = "inline";
  errorDiv.innerText = text;
  setTimeout(() => {
    errorDiv.innerText = "";
    errorDiv.style.display = "none";
  }, 3 * 1000);
}
