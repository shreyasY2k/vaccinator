window.onbeforeunload = function () {
  return Cookies.remove("userDetails");
};
function centerRender(length, centers) {
  var table = document.getElementById("centerValues");
  for (i = 0; i < length; i++) {
    var row = table.insertRow();
    var centerId = row.insertCell(0);
    var centerName = row.insertCell(1);
    var centerAddr = row.insertCell(2);
    var pincode = row.insertCell(3);
    var vaccine = row.insertCell(4);
    var slots = row.insertCell(5);
    var selectButton = row.insertCell(6);
    var centerData = centers[i].split("|");
    centerId.innerHTML = centerData[0];
    centerName.innerHTML = centerData[1];
    centerAddr.innerHTML = centerData[2];
    pincode.innerHTML = centerData[3];
    vaccine.innerHTML = centerData[4];
    slots.innerHTML = centerData[5];
    var btn = document.createElement("a");
    btn.setAttribute("class", "btn btn-primary");
    btn.setAttribute(
      "href",
      "/book?id=" +
        centerData[0] +
        "&name=" +
        centerData[1] +
        "&address=" +
        centerData[2] +
        "&vaccine=" +
        centerData[4]
    );
    btn.textContent = "Select";
    btn.id = centerData[0];
    selectButton.appendChild(btn);
  }
}
if ((username = Cookies.get("userDetails"))) {
  var user = JSON.parse(username.slice(2, username.length));
  document.getElementById("username").textContent = `Welcome: ${user.name}`;
  fetch("centers.txt")
    .then(response => response.text())
    .then(data => {
      dataArr = data.split("\n");
      centerRender(dataArr.length, dataArr);
    });
} else {
  window.location = "index.html";
}
