const express = require("express");
const app = express();
var cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");

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
app.listen(process.env.PORT || 8080, function () {
  console.log("listening on 8080");
});
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Default HomePage Redirect
app.get("/", (req, res) => {
  res.redirect("/index.html");
});

//Get user details from the login form and update txt file
app.post("/login", (req, res) => {
  var name = req.body.name;
  var aadhar = req.body.aadhar;
  var mobile = req.body.mobile;

  var fileData = name.concat("|").concat(mobile).concat("|", aadhar, "\n");
  fs.readFile("users.txt", function (err, data) {
    if (err) throw err;
    if (!data.includes(aadhar)) {
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
