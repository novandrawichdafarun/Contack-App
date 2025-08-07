import fs from "node:fs";
import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import chalk from "chalk";
import validator from "validator";

export { tulisPertanyaan, simpanContacts };

const rl = readline.createInterface({ input, output });

//? Membuat folder data jika belum ada
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

//? Membuat file contacts.json jika belum ada
const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

const tulisPertanyaan = (pertanyaan) => {
  return new Promise((resolve, rejects) => {
    rl.question(pertanyaan, (value) => {
      resolve(value);
    });
  });
};

const simpanContacts = (nama, email, nomorHp) => {
  const contact = { nama, email, nomorHp };
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(fileBuffer);

  //? cek duplikasi
  const duplikatNama = contacts.find((contact) => contact.nama === nama);
  const duplikatNomorHp = contacts.find(
    (contact) => contact.nomorHp === nomorHp
  );
  if (duplikatNama) {
    console.log(chalk.red.bold("Nama sudah terdaftar, gunakan Nama lain"));
    rl.close();
    return false;
  } else if (duplikatNomorHp) {
    console.log(chalk.red.bold("Nomor sudah terdaftar, gunakan Nomor lain"));
    rl.close();
    return false;
  }

  //? cek email
  if (email) {
    if (!validator.isEmail(email)) {
      console.log(chalk.red.bold("Email tidak valid"));
      rl.close();
      return false;
    }
  }

  //? cek NomorHp
  if (!validator.isMobilePhone(nomorHp, 'id-ID')) {
    console.log(chalk.red.bold("Nomor Handphone tidak valid"));
    rl.close();
    return false;
  }

  contacts.push(contact);

  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
  console.log(chalk.green.bold("Pendaftaran Berhasil!!"));
  rl.close();
};
