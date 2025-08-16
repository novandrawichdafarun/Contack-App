const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const { body, validationResult, check, Result } = require("express-validator");
const methodOverride = require("method-override");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

require("./utils/db");
const Contact = require("./model/contact");

const app = express();
const port = 3000;

//* Setup method override
app.use(methodOverride("_method"));

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

//? Form tambah data contaact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "From Tambah Data Contact",
    layout: "layouts/main-layout",
  });
});

//? Proses tambah data Contact
app.post(
  "/contact",
  [
    body("nama").custom(async (value) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (duplikat) {
        throw new Error("Nama contact sudah digunakan!");
      }
      return true;
    }),
    check("email", "Email Tidak Valid!").isEmail(),
    check("nomorHp", "Nomor Hp tidak Valid!").isMobilePhone("id-ID"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "From Tambah Data Contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
        old: req.body,
      });
    } else {
      await Contact.insertMany(req.body);
      //! Kirim flash message
      req.flash("msg", "Data contact berhasi ditambahkan!");
      res.redirect("/contact");
    }
  }
);

//? Delete Contact
app.delete("/contact", async (req, res) => {
  await Contact.deleteOne({ nama: req.body.nama });
  req.flash("msg", "Data contact berhasi dihapus!");
  res.redirect("/contact");
});

//? Form ubah data contact
app.get("/contact/edit/:nama", async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });
  res.render("edit-contact", {
    title: "From Ubah Data Contact",
    layout: "layouts/main-layout",
    contact,
  });
});

//? Prosess ubah data
app.put(
  "/contact",
  [
    body("nama").custom(async (value, { req }) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (value !== req.body.oldNama && duplikat) {
        throw new Error("Nama contact sudah digunakan!");
      }
      return true;
    }),
    check("email", "Email Tidak Valid!").isEmail(),
    check("nomorHp", "Nomor Hp tidak Valid!").isMobilePhone("id-ID"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        title: "From Ubah Data Contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      await Contact.updateOne(
        { _id: req.body._id },
        {
          $set: {
            nama: req.body.nama,
            email: req.body.email,
            nomorHp: req.body.nomorHp,
          },
        }
      );
      //! Kirim flash message
      req.flash("msg", "Data contact berhasi diubah!");
      res.redirect("/contact");
    }
  }
);

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
// app.use("/", (req, res) => {
//   res.status(404);
//   res.render("404page", {
//     title: "Error 404",
//   });
// });

app.listen(port, () => {
  console.log(`Mongo Contact App | listening at http://localhost:${port}`);
});
