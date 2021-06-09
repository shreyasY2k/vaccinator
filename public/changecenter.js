window.onunload = function () {
  return Cookies.remove("change");
};
function centerRender(length, centers, pincode) {
  if (pincode != "") {
    document.getElementById("centers").innerHTML = `
  <thead id="thead" class="bg-info">
          <tr>
            <td>Sl.No</td>
            <td>Center Name</td>
            <td>Address</td>
            <td>Pincode</td>
            <td>Vaccine Name</td>
            <td>Slots Remaining</td>
            <td>Select</td>
          </tr>
        </thead>`;
  }
  var j = 1;

  for (var i = 0; i < length; i++) {
    if (
      centers[i].split("|")[3] == pincode ||
      centers[i].split("|")[2] == pincode
    ) {
      centerData = centers[i].split("|");
      $("#centers").append(
        "<tr class='table-info'>" +
          "<td>" +
          j +
          "</td>" +
          "<td>" +
          centerData[1] +
          "</td>" +
          "<td>" +
          centerData[2] +
          "</td>" +
          "<td>" +
          centerData[3] +
          "</td>" +
          "<td>" +
          centerData[4] +
          "</td>" +
          "<td>" +
          centerData[5] +
          "</td>" +
          `<td><a href='/change?id=${centerData[0]}&name=${centerData[1]}&address=${centerData[2]}&vaccine=${centerData[4]}' class='btn btn-primary'>Select</a>` +
          "</td>" +
          "</tr>"
      );
      j++;
    }
  }
}
if ((username = Cookies.get("change"))) {
  var user = JSON.parse(Cookies.get("change"));
  document.getElementById("username").textContent = `Welcome: ${user.name}`;
  fetch("centers.txt")
    .then(response => response.text())
    .then(data => {
      dataArr = data.split("\n");
      document.getElementById("search").addEventListener("click", () => {
        pincode = document.getElementById("pincode").value;
        centerRender(dataArr.length, dataArr, pincode);
      });
    });
} else {
  window.location = "index.html";
}
