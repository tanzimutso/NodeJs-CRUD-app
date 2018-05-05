var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var ObjectId = require("mongodb").ObjectID;
var mongoJs = require("mongojs");
var db = mongoJs("mycustomers", ["customers"]);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", function(request, response) {
  db.customers.find(function(err, docs) {
    response.render("index", {
      title: "Customer",
      users: docs
    });
  });
});

app.post("/user/addData", function(request, response) {
  var firstName = request.body.firstName;
  var lastName = request.body.lastName;
  db.customers.insert({ firstName: firstName, lastName: lastName });

  db.customers.find(function(err, docs) {
    response.render("show", {
      title: "Customer",
      users: docs
    });
  });
});

app.get("/user/edit/:id", function(request, response) {
  db
    .collection("customers")
    .find({ _id: new ObjectId(request.params.id) }, function(err, customer) {
      response.render("edit", { customer: customer });
    });
});

app.post("/user/update/:id", function(request, response) {
  var firstName = request.body.firstName;
  var lastName = request.body.lastName;
  db.customers.update({_id: new ObjectId(request.params.id)},{
      $set: {
          firstName: firstName,
          lastName: lastName
      }
  })
  
  db.customers.find(function(err, docs) {
    response.render("show", {
      title: "Customer",
      users: docs
    });
  });
});

app.get("/user/delete/:id", function(request, response) {
  db.customers.remove({
    _id: new ObjectId(request.params.id)
  });
  db.customers.find(function(err, docs) {
    response.render("show", {
      title: "Customer",
      users: docs
    });
  });
});

app.listen(8181, function() {
  console.log("Server Started on 8181");
});

// http
//   .createServer(function(request, response) {
//     response.writeHead(200, { "Content-Type": "text/html" });
//     response.end("<h1>Hello World!</h1>");
//   })
//   .listen(8089);

// console.log("SERVER IS RUNNING ON 8089");
