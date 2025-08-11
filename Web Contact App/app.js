const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const app = express();
const port = 3000;

//* Gunakan ejs
app.set("view engine", "ejs");

//? Third-party Middleware
app.use(expressLayouts);
app.use(morgan("dev"));

//? Build-in Middleware
app.use(express.static("public"));

//? Application level Middleware
app.use((req, res, next) => {
  console.log("Time : " + Date.now());
  next();
});

app.get("/", (req, res) => {
  const mahasiswa = [
    {
      nama: "Novandra Wichda Farun",
      nim: "3130024028",
    },
    {
      nama: "Ucup Surucup",
      nim: "3130023008",
    },
    {
      nama: "Otong Surotong",
      nim: "3130022018",
    },
  ];
  res.render("index", {
    nama: "Novandra",
    title: "Halaman Home",
    mahasiswa,
    layout: "layouts/main-layout",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "Halaman About",
    layout: "layouts/main-layout",
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Halaman Contact",
    layout: "layouts/main-layout",
  });
});

app.get("/product/:id", (req, res) => {
  res.send(
    `Product ID : ${req.params.id} <br> Category : ${req.query.category}`
  );
});

//? Menangani Jika Halaman web tidak ada
app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
