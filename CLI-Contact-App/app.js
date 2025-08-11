//? Mengambil argument dari command line
import yargs from "yargs";
import {
  simpanContacts,
  listContact,
  detailContact,
  deleteContact,
} from "./contacts.js";

const argv1 = yargs(process.argv.slice(2))
  .command({
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
  })
  .demandCommand().argv;

//? Menampilkan daftar semau nama & nomor Handphone
const argv2 = yargs(process.argv.slice(2))
  .command({
    command: "list",
    describe: "Menampilkan daftar semau nama & nomor Handphone",
    handler() {
      listContact();
    },
  })
  .demandCommand().argv;

//? menampilkan detail sebuah contact
const argv3 = yargs(process.argv.slice(2))
  .command({
    command: "detail",
    describe: "Menampilkan detail sebuah contact berdasarkan nama",
    builder: {
      nama: {
        describe: "Nama Lengkap",
        demandOption: true,
        type: "string",
      },
    },
    handler(argv) {
      detailContact(argv.nama);
    },
  })
  .demandCommand().argv;

//? Menghapus Contact berdasarkan nama
const argv4 = yargs(process.argv.slice(2))
  .command({
    command: "delete",
    describe: "Menghapus sebuah contact berdasarkan nama",
    builder: {
      nama: {
        describe: "Nama Lengkap",
        demandOption: true,
        type: "string",
      },
    },
    handler(argv) {
      deleteContact(argv.nama);
    },
  })
  .demandCommand().argv;
