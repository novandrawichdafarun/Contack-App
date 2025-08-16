const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/contact-app");

// //? Menambah satu data
// const contact1 = new Contact({
//   nama: "Ucup Surucup",
//   nomorHp: "08812343212313",
//   email: "ucupbandung@gmail.com",
// });

// //? Simpan ke collection
// contact1.save().then((contact) => console.log(contact));
