const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

require("./utils/db");
const Contact = require("./model/contact");

const app = express();
const port = 3000;

//* Setup ejs
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//? Konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

//? Halaman Home
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

//? Halaman About
app.get("/about", (req, res) => {
  res.render("about", {
    title: "Halaman About",
    layout: "layouts/main-layout",
  });
});

//? Halaman Contact
app.get("/contact", async (req, res) => {
  const contacts = await Contact.find();
  res.render("contact", {
    title: "Halaman Contact",
    layout: "layouts/main-layout",
    contacts,
    msg: req.flash("msg"),
  });
});

//? Halaman detail contact
app.get("/contact/:nama", async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });
  res.render("detail", {
    title: "Halaman Detail Contact",
    layout: "layouts/main-layout",
    contact,
  });
});

//? Menangani Jika Halaman web tidak ada
app.use("/", (req, res) => {
  res.status(404);
  res.render("404page", {
    title: "Error 404",
  });
});

app.listen(port, () => {
  console.log(`Mongo Contact App | listening at http://localhost:${port}`);
});
