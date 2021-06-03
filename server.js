const express = require("express");
const app = express();
const fs = require("fs");
var multer = require("multer");
var upload = multer();
const path = require("path");
app.listen(3000, function () {
  console.log("listening on 3000");
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//app.use(upload.array());
app.get("/", (req, res) => {
  res.redirect("/index.html");
});

app.post("/login", (req, res) => {
  // res.set({
  //   "Access-Control-Allow-Origin": "*",
  //   "Access-Control-Allow-Header": "*",
  //   "Content-Type": "application/json",
  //   "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  // });
  var name = req.body.name;
  var aadhar = req.body.aadhar;
  var mobile = req.body.mobile;
  var fileData = aadhar.concat("|").concat(name).concat("|", mobile, "\n");

  fs.readFile("users.txt", function (err, data) {
    if (err) throw err;
    if (data.includes(aadhar)) {
      res.cookie("name", name);
      res.redirect("/welcome.html");
    } else
      fs.appendFile("users.txt", fileData, function (err) {
        if (err) throw err;
        console.log("Saved!");
        fs.close();
        res.cookie("name", name);
        res.redirect("/welcome.html");
      });
  });
});
app.get("/book*", (req, res) => {
  console.log(req.query);
  res.clearCookie("name");
  res.end("Success");
});
