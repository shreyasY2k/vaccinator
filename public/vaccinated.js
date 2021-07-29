window.onunload = function () {
  return Cookies.remove("vaccinated");
};

if ((username = Cookies.get("vaccinated"))) {
  var user = JSON.parse(username.slice(2, username.length));
  document.getElementById("username").innerHTML = `Dear ${user.name},`;
  document.getElementById(
    "centerDetails"
  ).innerHTML = `Your vaccination of  ${user.vaccineName} has been completed at ${user.centerName}, ${user.centerDist} `;
} else {
  window.location = "index.html";
}
