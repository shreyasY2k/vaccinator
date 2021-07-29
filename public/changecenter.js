window.onunload = function () {
  return Cookies.remove("change");
};
function centerRender(length, centers, pincode) {
  if (pincode != "") {
    document.getElementById("centers").innerHTML = `
  <thead id="thead" class="bg-info text-center">
          <tr>
            <td>No</td>
            <td>CENTER NAME</td>
            <td>ADDRESS</td>
            <td>VACCINE NAME</td>
            <td>SLOTS REMAINING</td>
            <td>SELECT</td>
          </tr>
        </thead>`;

    var j = 1;

    for (var i = 0; i < length; i++) {
      if (
        centers[i]
          .split("|")[3]
          .toString()
          .toLowerCase()
          .includes(pincode.toLowerCase()) ||
        centers[i].split("|")[4] == pincode
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
            centerData[5] +
            "</td>" +
            "<td>" +
            centerData[6] +
            "</td>" +
            `<td><a href='/change?id=${centerData[0]}&name=${centerData[1]}&district=${centerData[3]}&vaccine=${centerData[5]}' class='btn btn-primary'>Select</a>` +
            "</td>" +
            "</tr>"
        );
        j++;
      }
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
