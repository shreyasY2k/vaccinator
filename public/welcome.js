function centerRender(length, centers) {
  var table = document.getElementById("centers");
  var header = table.createTHead(0);
  var row = header.insertRow(0);
  var centerId = row.insertCell(0);
  var centerName = row.insertCell(1);
  var centerAddr = row.insertCell(2);
  var vaccine = row.insertCell(3);
  var selectButton = row.insertCell(4);
  centerId.innerHTML = "SL.NO";
  centerName.innerHTML = "Name";
  centerAddr.innerHTML = "Address";
  vaccine.innerHTML = "Vaccine";
  selectButton.innerHTML = "Select";
  for (i = 1; i < length; i++) {
    var row = table.insertRow(i);
    var centerId = row.insertCell(0);
    var centerName = row.insertCell(1);
    var centerAddr = row.insertCell(2);
    var vaccine = row.insertCell(3);
    var selectButton = row.insertCell(4);

    centerId.innerHTML = centers[i].center_id;
    centerName.innerHTML = centers[i].name;
    centerAddr.innerHTML = centers[i].address;
    vaccine.innerHTML = centers[i].vaccine;
    var btn = document.createElement("a");
    btn.setAttribute("class", "btn btn-primary");
    btn.setAttribute(
      "href",
      "/book?id=" +
        centers[i].center_id +
        "&name=" +
        centers[i].name +
        "&address=" +
        centers[i].address +
        "&vaccine=" +
        centers[i].vaccine
    );
    btn.textContent = "Select";
    btn.id = centers[i].center_id;
    console.log(btn.id);
    selectButton.appendChild(btn);
  }
}
if ((username = Cookies.get("name"))) {
  console.log(username);
  document.getElementById("username").textContent = `Welcome ${username}`;
  fetch("centers.txt")
    .then(response => response.text())
    .then(data => {
      data = JSON.parse(data).centers;
      centerRender(data.length, data);
    });
} else {
  window.location = "index.html";
}
