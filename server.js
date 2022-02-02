var express = require("express");
var app = express();
const PORT = 3000;

app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT);
});

app.use(express.static("static"));
var path = require("path");
var hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const { report } = require("process");

app.set("views", path.join(__dirname, "views")); // ustalamy katalog views
app.engine("hbs", hbs({ defaultLayout: "main.hbs" })); // domyślny layout, potem można go zmienić
app.set("view engine", "hbs");

//TABLICA I FLAGA LOGOWANIA
flag = false;
var uzytkownicy = [
  { id: 1, login: "AAA", pass: "PASS1", wiek: 10, uczen: "checked", plec: "m" },
  { id: 2, login: "BBB", pass: "PASS2", wiek: 12, plec: "k" },
  { id: 3, login: "CCC", pass: "PASS3", wiek: 9, plec: "m" },
  { id: 4, login: "DDD", pass: "PASS4", wiek: 14, uczen: "checked", plec: "m" },
  { id: 5, login: "EEE", pass: "PASS5", wiek: 3, uczen: "checked", plec: "k" },
];

var id = 6;

app.use(bodyParser.urlencoded({ extended: true }));

//MAIN

app.get("/", function (req, res) {
  context = {};
  if (flag == true) {
    context.logout = "Logout";
  }
  res.render("index.hbs", context);
});

//LOGIN

app.get("/login", function (req, res) {
  context = {};
  if (flag === true) {
    context.logout = "Logout";
  }
  res.render("login.hbs", context);
});

//LOGOWANIE
app.post("/logging", function (req, res) {
  context = {};
  if (flag === true) {
    context.logout = "Logout";
  }

  logins = [];
  for (let i = 0; i < uzytkownicy.length; i++) {
    if (uzytkownicy[i].login === req.body.login) {
      logins.push(i);
    }
  }
  for (let j = 0; j < logins.length; j++) {
    if (uzytkownicy[logins[j]].pass === req.body.pass) {
      flag = true;
      res.redirect("/admin");
    }
  }
  if (flag == false) {
    res.redirect("/login");
  }
});

// LOGOUT
app.get("/logout", function (req, res) {
  flag = false;
  res.redirect("/login");
});

//REGISTER

app.get("/register", function (req, res) {
  context = {};
  if (flag == true) {
    context.logout = "Logout";
  }

  wiekall = [];
  for (let i = 1; i <= 100; i++) {
    let rok = {};
    rok.i = i;
    wiekall.push(rok);
  }
  context.lata = wiekall;

  res.render("register.hbs", context);
});

//REJESTRACJA

app.post("/registering", function (req, res) {
  context = {};
  if (flag == true) {
    context.logout = "Logout";
  }

  let registerinfo = req.body;
  registerinfo.id = id;
  id = id + 1;
  if (registerinfo.plec != "m" && registerinfo.plec != "k") {
    registerinfo.plec = "undefined";
  }
  uzytkownicy.push(registerinfo);
  res.redirect("/login");
});

//ADMIN

app.get("/admin", function (req, res) {
  context = {};
  if (flag == true) {
    context.logout = "Logout";
  }

  if (flag == true) {
    res.render("admin_zalogowany.hbs", context);
  } else {
    res.render("admin_niezalogowany.hbs", context);
  }
});

//SORT
app.get("/sort", function (req, res) {
  context = {};
  context.lista = uzytkownicy;
  if (flag == true) {
    context.logout = "Logout";
  }

  if (req.query.sorting == "growing") {
    uzytkownicy.sort(function (a, b) {
      return parseFloat(a.wiek) - parseFloat(b.wiek);
    });
  } else {
    uzytkownicy
      .sort(function (a, b) {
        return parseFloat(a.wiek) - parseFloat(b.wiek);
      })
      .reverse();
  }

  res.render("sort.hbs", context);
});

//GENDER
app.get("/gender", function (req, res) {
  context = {};
  context.lista = uzytkownicy;
  if (flag == true) {
    context.logout = "Logout";
  }

  kobiety = [];
  reszta = [];

  for (let i = 0; i < uzytkownicy.length; i++) {
    if (uzytkownicy[i].plec == "k") {
      kobiety.push(uzytkownicy[i]);
    } else {
      reszta.push(uzytkownicy[i]);
    }
  }

  context.kobiety = kobiety;
  context.reszta = reszta;

  res.render("gender.hbs", context);
});

//SHOW
app.get("/show", function (req, res) {
  context = {};
  context.lista = uzytkownicy;
  if (flag == true) {
    context.logout = "Logout";
  }

  uzytkownicy
    .sort(function (a, b) {
      return parseFloat(a.wiek) - parseFloat(b.wiek);
    })
    .reverse();

  res.render("show.hbs", context);
});
