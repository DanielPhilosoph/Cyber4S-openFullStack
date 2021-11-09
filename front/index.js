import "./styles.scss";
import "./images/background.jpeg";
console.log("Hello World!");

function onCallClick(event) {
  //const name = document.querySelector(/* Get Name */).textContent;
  //const number = document.querySelector(/* Get Number */).textContent;
  let name = "Daniel";
  let number = "045-454-7878";
  document.querySelector("#callPersonTitle").textContent = name;
  document.querySelector(
    "#callPersonBody"
  ).textContent = `Calling number ${number}`;
}
