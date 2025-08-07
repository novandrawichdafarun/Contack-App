const fs = require("node:fs");
const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");

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

const simpanContacs = (nama, email, nomorHp) => {
  const contact = { nama, email, nomorHp };
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(fileBuffer);
  contacts.push(contact);

  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
  console.log("Terimakasi sudah memasukkan data");
  rl.close();
};

module.exports = {
  tulisPertanyaan,
  simpanContacs,
};
