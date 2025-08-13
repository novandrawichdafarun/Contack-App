const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const {
  loadContact,
  findContact,
  addContact,
  cekDuplikat,
  deleteContact,
  updateContacts,
} = require("./utils/contacts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();
const port = 3000;

//* Gunakan ejs
app.set("view engine", "ejs");

//? Third-party Middleware
app.use(expressLayouts);
const { body, validationResult, check } = require("express-validator");

//? Konfigurasi
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

//? Build-in Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

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
  const contacts = loadContact();
  res.render("contact", {
    title: "Halaman Contact",
    layout: "layouts/main-layout",
    contacts,
    msg: req.flash("msg"),
  });
});

//? Form tambah data contaact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "From Tambah Data Contact",
    layout: "layouts/main-layout",
  });
});

//? Proses data Contact
app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const duplikat = cekDuplikat(value);
      if (duplikat) {
        throw new Error("Nama contact sudah digunakan!");
      }
      return true;
    }),
    check("email", "Email Tidak Valid!").isEmail(),
    check("nomorHp", "Nomor Hp tidak Valid!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(404).json({ errors: errors.array() });
      res.render("add-contact", {
        title: "From Tambah Data Contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
        old: req.body,
      });
    } else {
      addContact(req.body);
      //! Kirim flash message
      req.flash("msg", "Data contact berhasi ditambahkan!");
      res.redirect("/contact");
    }
  }
);

//? Delete Contact
app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  if (!contact) {
    res.status(404);
    res.send("<h1>404</h1>");
  } else {
    deleteContact(req.params.nama);
    req.flash("msg", "Data contact berhasi dihapus!");
    res.redirect("/contact");
  }
});

//? Form ubah data contact
app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("edit-contact", {
    title: "From Ubah Data Contact",
    layout: "layouts/main-layout",
    contact,
  });
});

//? Prosess ubah data
app.post(
  "/contact/update",
  [
    body("nama").custom((value, { req }) => {
      const duplikat = cekDuplikat(value);
      if (value !== req.body.oldNama && duplikat) {
        throw new Error("Nama contact sudah digunakan!");
      }
      return true;
    }),
    check("email", "Email Tidak Valid!").isEmail(),
    check("nomorHp", "Nomor Hp tidak Valid!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(404).json({ errors: errors.array() });
      res.render("edit-contact", {
        title: "From Ubah Data Contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      updateContacts(req.body);
      //! Kirim flash message
      req.flash("msg", "Data contact berhasi diubah!");
      res.redirect("/contact");
    }
  }
);

//? Halaman detail contact
app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("detail", {
    title: "Halaman Detail Contact",
    layout: "layouts/main-layout",
    contact,
  });
});

//? Menangani Jika Halaman web tidak ada
app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
