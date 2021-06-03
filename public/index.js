function validateEntry() {
  var regName = /[a-zA-Z]+/;
  var regAadhar = /[0-9]{12}/;
  var regNum =
    /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/;
  var name = document.querySelector("#name").value;
  var aadhar = document.querySelector("#aadhar").value;
  var mobile = document.querySelector("#mobile").value;
  if (!regName.test(name)) {
    console.log(name);
    document.getElementById("error-name").innerHTML =
      " Please Enter Valid Name *";
  }
  if (!regAadhar.test(aadhar)) {
    console.log(aadhar);
    document.getElementById("error-aadhar").innerHTML =
      " Please Enter Valid Aadhar Number *";
  }
  if (!regNum.test(mobile)) {
    console.log(mobile);
    document.getElementById("error-mobile").innerHTML =
      " Please Enter a Valid Phone Number *";
  }
  if (regName.test(name) && regNum.test(mobile) && regAadhar.test(aadhar)) {
    return 1;
  } else {
    return 0;
  }
}
async function login() {
  return await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      aadhar: document.querySelector("#aadhar").value,
      mobile: document.querySelector("#mobile").value,
      name: document.querySelector("#name").value
    })
  })
    .then(response => {
      return response;
    })
    .then(data => {
      window.location = data.url;
    })
    .catch(error => alert(error.message));
}
document.querySelector("#login").addEventListener("click", () => {
  if (validateEntry() == 1) {
    login();
  } else {
    console.log("error");
  }
});
