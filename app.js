const {tulisPertanyaan, simpanContacs} = require("./contacts");

const main = async () => {
  const nama = await tulisPertanyaan("Masukkan Nama Anda : ");
  const email = await tulisPertanyaan("Masukkan Email Anda : ");
  const nomorHp = await tulisPertanyaan("Masukkan Nomor HP Anda : ");

  simpanContacs(nama, email, nomorHp);
};

main();
