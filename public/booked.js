window.onunload = function () {
  return Cookies.remove("booked");
};

function bookedUserData(aadhar, dataArr) {
  for (i = 0; i < dataArr.length; i++) {
    if (dataArr[i].includes(aadhar)) {
      centerData = dataArr[i].split("|");
      document.getElementById("username").innerHTML = `Dear ${centerData[0]},`;
      document.getElementById(
        "centerDetails"
      ).innerHTML = `You have booked for Vaccination of ${centerData[6]} at ${centerData[4]}, ${centerData[5]} `;
    }
  }
}

if ((username = Cookies.get("booked"))) {
  var user = JSON.parse(username.slice(2, username.length));
  fetch("/userfile")
    .then(response => response.text())
    .then(data => {
      dataArr = data.toString().split("\n");
      bookedUserData(user.aadhar, dataArr);
    });
} else {
  window.location = "index.html";
}
document.querySelector("#changecenter").addEventListener("click", () => {
  Cookies.set("change", `{"name":"${user.name}","aadhar":"${user.aadhar}"}`);
});
