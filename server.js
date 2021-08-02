const express = require("express");
const app = express();
var cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");

//check whether user is already vaccinated
function isUserVaccinated(aadhar) {
  var vaccinatedData = fs.readFileSync("./vaccinated.txt", "utf8");
  var vaccinatedData = vaccinatedData.toString().split("\n");
  for (i = 0; i < vaccinatedData.length; i++) {
    if (vaccinatedData[i].split("|")[2] == aadhar) {
      return vaccinatedData[i];
    }
  }
  return null;
}

//check whether user has already booked for vaccination
function isUserBooked(data, aadhar) {
  userData = data.toString().split("\n");
  for (i = 0; i < userData.length; i++) {
    if (userData[i].split("|").length > 3 && userData[i].includes(aadhar)) {
      return true;
    }
  }
}

//change booked center
function changeCenter(
  centerId,
  centerName,
  centerDist,
  vaccineSelected,
  userDetails
) {
  fs.readFile("users.txt", function (err, data) {
    if (err) throw err;
    data = data.toString().split("\n");
    for (i = 0; i < data.length; i++) {
      if (data[i].split("|")[2] == userDetails.aadhar) {
        data[i] = data[i].split("|");
        var oldId = data[i][3];
        var oldName = data[i][4];
        fs.readFile("./public/centers.txt", function (err, data) {
          if (err) throw err;
          var centerList = data.toString().split("\n");
          for (i = 0; i < centerList.length; i++) {
            if (centerList[i].split("|")[0] == oldId) {
              var matchCenter = centerList[i].split("|");
              matchCenter[6] = parseInt(matchCenter[6]) + 1;
              centerList[i] = matchCenter.join("|");
              console.log(`Slot Increased at ${oldId}:${oldName}`);
            }
            if (centerList[i].split("|")[0] == centerId) {
              var matchCenter = centerList[i].split("|");
              matchCenter[6] = parseInt(matchCenter[6]) - 1;
              centerList[i] = matchCenter.join("|");
              console.log(`Slot Reduced at ${centerId}:${centerName}`);
            }
          }
          fs.writeFile(
            "./public/centers.txt",
            centerList.join("\n"),
            function (err) {
              if (err) throw err;
            }
          );
        });

        data[i][3] = centerId;
        data[i][4] = centerName;
        data[i][5] = centerDist;
        data[i][6] = vaccineSelected;
        data[i] = data[i].join("|");
        fs.writeFile("users.txt", data.join("\n"), function (err) {
          if (err) throw err;
          console.log(
            `User:${userDetails.name}'s Slot Changed to ${centerId}:${centerName}`
          );
        });
        break;
      }
    }
  });
}

//book vaccine appointment for the user and update users.txt file accordingly
function bookVaccine(
  centerId,
  centerName,
  centerDist,
  vaccineSelected,
  userDetails
) {
  fs.readFile("users.txt", function (err, data) {
    if (err) throw err;
    var userFileData = data.toString().split("\n");
    for (i = 0; i < userFileData.length; i++) {
      if (userFileData[i].includes(userDetails.aadhar)) {
        userFileData[i] = userFileData[i].concat(
          "|",
          centerId,
          "|",
          centerName,
          "|",
          centerDist,
          "|",
          vaccineSelected
        );
        fs.readFile("./public/centers.txt", function (err, data) {
          if (err) throw err;
          var centerList = data.toString().split("\n");
          for (i = 0; i < centerList.length; i++) {
            if (centerList[i].split("|")[0] == centerId) {
              var matchCenter = centerList[i].split("|");
              matchCenter[6] = parseInt(matchCenter[6]) - 1;
              centerList[i] = matchCenter.join("|");
              break;
            }
          }
          fs.writeFile(
            "./public/centers.txt",
            centerList.join("\n"),
            function (err) {
              if (err) throw err;
              console.log(`Slot Reduced at ${centerId}:${centerName}`);
            }
          );
        });
        break;
      }
    }
    fs.writeFile("users.txt", userFileData.join("\n"), function (err) {
      if (err) throw err;
      console.log(
        `User:${userDetails.name}'s Slot Booked at ${centerId}:${centerName}`
      );
    });
  });
}

//function to update the center
function updatecenter(
  num,
  centername,
  address,
  district,
  pincode,
  vaccinename,
  slots
) {
  fs.readFile("./public/centers.txt", function (err, data) {
    if (err) throw err;
    data = data.toString().split("\n");
    for (i = 0; i < data.length; i++) {
      if (data[i].split("|")[0] == num) {
        data[i] = data[i].split("|");
        data[i][1] = centername;
        data[i][2] = address;
        data[i][3] = district;
        data[i][4] = pincode;
        data[i][5] = vaccinename;
        data[i][6] = slots;
        data[i] = data[i].join("|");
      }
    }
    fs.writeFile("./public/centers.txt", data.join("\n"), function (err) {
      if (err) throw err;
      console.log("Center updated!");
    });
  });
}

app.listen(process.env.PORT || 8080, function () {
  console.log("listening on 8080");
});
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Get user details from the login form and update txt file
app.post("/login", (req, res) => {
  var name = req.body.name;
  var aadhar = req.body.aadhar;
  var mobile = req.body.mobile;

  var fileData = name.concat("|").concat(mobile).concat("|", aadhar, "\n");
  fs.readFile("users.txt", function (err, data) {
    if (err) throw err;
    if (!data.includes(aadhar) && isUserVaccinated(aadhar) == null) {
      fs.appendFile("users.txt", fileData, function (err) {
        if (err) throw err;
        console.log("Saved!");
        res.cookie(
          "userDetails",
          { name: name, aadhar: aadhar },
          { expire: 360000 + Date.now() }
        );
        res.redirect("/welcome.html");
      });
    } else if (
      !data.includes(aadhar) &&
      (vaccinatedDetails = isUserVaccinated(aadhar))
    ) {
      res.cookie(
        "vaccinated",
        {
          name: name,
          centerName: vaccinatedDetails.split("|")[4],
          centerDist: vaccinatedDetails.split("|")[5],
          vaccineName: vaccinatedDetails.split("|")[6]
        },
        { expire: 360000 + Date.now() }
      );
      res.redirect("/vaccinated.html");
    } else if (data.includes(aadhar) && isUserBooked(data, aadhar)) {
      res.cookie(
        "booked",
        { name: name, aadhar: aadhar },
        { expire: 360000 + Date.now() }
      );
      res.redirect("/booked.html");
    } else {
      res.cookie(
        "userDetails",
        { name: name, aadhar: aadhar },
        { expire: 360000 + Date.now() }
      );
      res.redirect("/welcome.html");
    }
  });
});

//Book Vaccine for the User and Delete his cookie
app.get("/book*", (req, res) => {
  var userDetails = req.cookies["userDetails"];
  var centerId = req.query.id;
  var centerName = req.query.name;
  var centerDist = req.query.district;
  var vaccineSelected = req.query.vaccine;
  bookVaccine(centerId, centerName, centerDist, vaccineSelected, userDetails);
  res.cookie(
    "booked",
    { name: userDetails.name, aadhar: userDetails.aadhar },
    { expire: 360000 + Date.now() }
  );
  res.clearCookie("userDetails");
  res.redirect("/booked.html");
});

//Respond to change center request
app.get("/change*", (req, res) => {
  var userDetails = JSON.parse(req.cookies["change"]);
  var centerId = req.query.id;
  var centerName = req.query.name;
  var centerDist = req.query.district;
  var vaccineSelected = req.query.vaccine;

  changeCenter(centerId, centerName, centerDist, vaccineSelected, userDetails);
  res.cookie(
    "booked",
    { name: userDetails.name, aadhar: userDetails.aadhar },
    { expire: 360000 + Date.now() }
  );
  res.clearCookie("change");
  res.redirect("/booked.html");
});

app.get("/userfile", function (req, res) {
  var file = path.join(__dirname + "/users.txt");
  res.sendFile(file);
});

//get request for the admin login page
app.get("/admin", function (req, res) {
  res.redirect("/admin.html");
});

//for validating password and redirecting to welcome page

app.post("/adminlogin", function (req, res) {
  let password = req.body.pass;
  let adminPassword = "Surmalhar91!@#";
  if (password == adminPassword) {
    res.cookie("admin", { admin: "admin-loggedin" });
    res.redirect("/adminwelcome.html");
  }
});

//to add new center
app.post("/center", (req, res) => {
  let centername = req.body.center;
  let address = req.body.address;
  let district = req.body.district;
  let pincode = req.body.pincode;
  let vaccinename = req.body.vaccine;
  let slots = req.body.slots;
  var centerdata = centername
    .concat("|")
    .concat(address)
    .concat("|")
    .concat(district)
    .concat("|")
    .concat(pincode)
    .concat("|")
    .concat(vaccinename)
    .concat("|", slots);

  fs.readFile("./public/centers.txt", function (err, data) {
    var datalist = data.toString().split("\n");
    let arr = datalist.slice(-2);
    var array = arr.toString().split("|");
    let item = parseInt(array[0]);
    let num = parseInt(item + 1);
    let numb = num.toString();

    let centerdatalist = numb.concat("|").concat(centerdata, "\n");
    if (data.includes(pincode) && data.includes(centerdatalist)) {
      console.log("center typed exits!");
      res.redirect("/center.html");
    } else {
      fs.appendFile("./public/centers.txt", centerdatalist, function (err) {
        console.log("saved!");
        res.redirect("/center.html");
      });
    }
  });
});

//to delete the center
app.get("/centerdelete*", (req, res) => {
  let center = req.query.id;
  fs.readFile("./public/centers.txt", function (err, data) {
    let centerdata = data.toString().split("\n");

    for (i = 0; i < centerdata.length; i++) {
      if (center.includes(centerdata[i].split("|")[0])) {
        centerdata[i] = "";
      }
    }
    fs.writeFile("./public/centers.txt", centerdata.join("\n"), function (err) {
      if (err) throw err;
      console.log("center deleted!");
      res.redirect("/center.html");
    });
  });
});

//to mark user as vaccinated
app.get("/vaccine", (req, res) => {
  let aadhar = req.query.aadhar;
  fs.readFile("users.txt", function (err, data) {
    let userdata = data.toString().split("\n");

    for (i = 0; i < userdata.length; i++) {
      if (userdata[i].split("|")[2] == aadhar) {
        let vaccinedata = userdata[i] + "\n";

        fs.appendFile("vaccinated.txt", vaccinedata, function (err) {
          console.log("Vaccinated!");
          res.redirect("/user.html");
        });
      }

      if (userdata[i].split("|")[2] == aadhar) {
        userdata[i] = "";
      }
    }
    fs.writeFile("users.txt", userdata.join("\n"), function (err) {
      if (err) throw err;
    });
  });
});

//to update the center
app.post("/update", (req, res) => {
  let centername = req.body.center;
  let address = req.body.address;
  let district = req.body.district;
  let pincode = req.body.pincode;
  let vaccinename = req.body.vaccine;
  let slots = req.body.slots;
  let num = req.body.num;
  console.log(num);
  console.log(centername);
  updatecenter(num, centername, address, district, pincode, vaccinename, slots);
  res.redirect("/adminwelcome.html");
});
