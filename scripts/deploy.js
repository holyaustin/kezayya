const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const FileNFT = await hre.ethers.getContractFactory("FileNFT");
  const fileShare = await FileNFT.deploy();
  await fileShare.deployed();
  console.log("fileShare Contract deployed to:", fileShare.address);

  const myTable = await hre.ethers.getContractFactory("userTable");
  const mytable= await myTable.deploy();
  await mytable.deployed();
  console.log("fileShare Contract deployed to:", mytable.address);

  fs.writeFileSync('./config.js', `
  export const fileShareAddress = "${fileShare.address}"
  export const UserTableAddress = "${mytable.address}"
  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
