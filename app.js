//? Mengambil argument dari command line
import yargs from "yargs";
import { tulisPertanyaan, simpanContacts } from './contacts.js';

const argv = yargs(process.argv.slice(2)).command({
  command: "add",
  describe: "Menambahkan Contact baru",
  builder: {
    nama: {
      describe: "Nama Lengkap",
      demandOption: true,
      type: "string",
    },
    email: {
      describe: "Email",
      demandOption: false,
      type: "string",
    },
    nomorHp: {
      describe: "Nomor Handphone",
      demandOption: true,
      type: "string",
    },
  },
  handler(argv) {
    simpanContacts(argv.nama, argv.email, argv.nomorHp);
  },
}).argv;


//? With vanila js
// const {tulisPertanyaan, simpanContacs} = require("./contacts");

// const main = async () => {
//   const nama = await tulisPertanyaan("Masukkan Nama Anda : ");
//   const email = await tulisPertanyaan("Masukkan Email Anda : ");
//   const nomorHp = await tulisPertanyaan("Masukkan Nomor HP Anda : ");

//   simpanContacs(nama, email, nomorHp);
// };

// main();
