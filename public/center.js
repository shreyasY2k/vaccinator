function centerRender(length, centers, pincode) {
  if (pincode != "") {
    document.getElementById("centers").innerHTML = `
  <thead id="thead" class="bg-info text-center">
          <tr>
            <td>No</td>
            <td>CENTER NAME</td>
            <td>ADDRESS</td>
            <td>PINCODE</td>
            <td>VACCINE NAME</td>
            <td>SLOTS REMAINING</td>
            <td>DELETE</td>
            <td>UPDATE</td>
          </tr>
        </thead>`;

    var j = 1;

    for (var i = 0; i < length - 1; i++) {
      if (centers[i].split("|")[4] == pincode) {
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
            centerData[4] +
            "</td>" +
            "<td>" +
            centerData[5] +
            "</td>" +
            "<td>" +
            centerData[6] +
            "</td>" +
            `<td><a href='/centerdelete?id=${centerData[0]}' class='btn btn-primary'>DELETE</a>` +
            "</td>" +
            "<td>" +
            `<a href='/update.html?num=${centerData[0]}&centername=${centerData[1]}&address=${centerData[2]}&district=${centerData[3]}&pincode=${centerData[4]}&vaccine=${centerData[5]}&slots=${centerData[6]}' class='btn btn-primary'>UPDATE</a>` +
            "</td>" +
            "</tr>"
        );
        j++;
      }
    }
  }
}

if (Cookies.get("admin")) {
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
