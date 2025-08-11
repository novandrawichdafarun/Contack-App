import fs from "node:fs";
import chalk from "chalk";
import validator from "validator";

export { simpanContacts, listContact, detailContact, deleteContact };

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

const loadContact = () => {
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

const simpanContacts = (nama, email, nomorHp) => {
  const contact = { nama, email, nomorHp };
  const contacts = loadContact();

  //? cek duplikasi
  const duplikatNama = contacts.find((contact) => contact.nama === nama);
  const duplikatNomorHp = contacts.find(
    (contact) => contact.nomorHp === nomorHp
  );
  if (duplikatNama) {
    console.log(chalk.red.bold("Nama sudah terdaftar, gunakan Nama lain"));
    return false;
  } else if (duplikatNomorHp) {
    console.log(chalk.red.bold("Nomor sudah terdaftar, gunakan Nomor lain"));
    return false;
  }

  //? cek email
  if (email) {
    if (!validator.isEmail(email)) {
      console.log(chalk.red.bold("Email tidak valid"));
      return false;
    }
  }

  //? cek NomorHp
  if (!validator.isMobilePhone(nomorHp, "id-ID")) {
    console.log(chalk.red.bold("Nomor Handphone tidak valid"));
    return false;
  }

  contacts.push(contact);

  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
  console.log(chalk.green.bold("Pendaftaran Berhasil!!"));
};

const listContact = () => {
  const contacts = loadContact();
  console.log(chalk.cyan.bold("Daftar Kontak : "));
  contacts.forEach((contact, i) => {
    console.log(`${i + 1}. ${contact.nama} ~ ${contact.nomorHp}`);
  });
};

const detailContact = (nama) => {
  const contacts = loadContact();
  const contact = contacts.find(
    (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
  );

  if (!contact) {
    console.log(chalk.red.bold(`${nama} tidak terdaftar!`));
    return false;
  }

  console.log(chalk.cyan.bold("Detail Contact :"));
  console.log(`Nama : ${contact.nama}`);
  console.log(`Nomor HP : ${contact.nomorHp}`);
  if (contact.email) console.log(`Email : ${contact.email}`);
};

const deleteContact = (nama) => {
  const contacts = loadContact();
  const newContacts = contacts.filter(
    (contact) => contact.nama.toLowerCase() !== nama.toLowerCase()
  );
  if (contacts.length === newContacts.length) {
    console.log(chalk.red.bold(`${nama} tidak terdaftar!`));
    return false;
  }

  fs.writeFileSync("data/contacts.json", JSON.stringify(newContacts));
  console.log(chalk.green.bold(`Data Contact ${nama} berhasil di hapus`));
};
