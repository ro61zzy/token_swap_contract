import { ethers } from "hardhat"; // Ensure correct import of ethers
import { Contract } from "ethers"; // Import Contract from ethers.js

async function main() {
  // Deploy the GUZ Token
  const GuzTokenFactory = await ethers.getContractFactory("ERC20Mock");
  const guzToken: Contract = await GuzTokenFactory.deploy("GUZ Token", "GUZ", ethers.utils.parseEther("1000000"));
  await guzToken.deployed();
  console.log("GUZ Token deployed to:", guzToken.address);

  // Deploy the W3B Token
  const W3BTokenFactory = await ethers.getContractFactory("ERC20Mock");
  const w3bToken: Contract = await W3BTokenFactory.deploy("W3B Token", "W3B", ethers.utils.parseEther("1000000"));
  await w3bToken.deployed();
  console.log("W3B Token deployed to:", w3bToken.address);

  // Deploy the TokenSwap Contract
  const TokenSwapFactory = await ethers.getContractFactory("TokenSwap");
  const tokenSwap: Contract = await TokenSwapFactory.deploy();
  await tokenSwap.deployed();
  console.log("TokenSwap Contract deployed to:", tokenSwap.address);

  // Optionally, link tokens to the swap contract if necessary
  // await tokenSwap.setTokens(guzToken.address, w3bToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
