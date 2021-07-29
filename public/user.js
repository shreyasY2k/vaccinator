function userdata(length, Udata) {
  if (length >= "") {
    document.getElementById("users").innerHTML = `
    <thead id="thead" class="bg-info text-center">
            <tr>
            <td>NO</td>
              <td>NAME</td>
              <td>MOBILE NUMBER</td>
              <td>DISTRICT</td>
              <td>VACCINE NAME</td>
              <td>MARK AS VACCINATED</td>
            </tr>
          </thead>`;

    var j = 1;

    for (var i = 0; i <= length - 1; i++) {
      if (Udata[i].split("|").length > 3) {
        Udetails = Udata[i].split("|");
        $("#users").append(
          "<tr class='table-info'>" +
            "<td>" +
            j +
            "</td>" +
            "<td>" +
            Udetails[0] +
            "</td>" +
            "<td>" +
            Udetails[1] +
            "</td>" +
            "<td>" +
            Udetails[5] +
            "</td>" +
            "<td>" +
            Udetails[6] +
            "</td>" +
            `<td><a href='/vaccine?aadhar=${Udetails[2]}' class='btn btn-primary'>MARK AS VACCINATED</a>` +
            "</td>" +
            "</tr>"
        );
        j++;
      }
    }
  }
}
if (Cookies.get("admin")) {
  fetch("/userfile")
    .then(response => response.text())
    .then(data => {
      dataArr = data.split("\n");
      userdata(dataArr.length, dataArr);
    });
} else {
  window.location = "index.html";
}
