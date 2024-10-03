import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy GUZ Token
  const Token = await ethers.getContractFactory("ERC20Mock");

  const guzToken = await Token.deploy(
    "GUZ Token",
    "GUZ",
    ethers.parseEther("1000")
  );

  // Log the deployment transaction result
  console.log("GUZ Token Deployment Transaction:", guzToken.deployTransaction);

  // Wait for the contract deployment to be mined
  await guzToken.deployTransaction.wait();
  console.log("GUZ Token deployed to:", guzToken.address);

  // Deploy W3B Token
  const w3bToken = await Token.deploy(
    "W3B Token",
    "W3B",
    ethers.parseEther("1000")
  );
  console.log("W3B Token Deployment Transaction:", w3bToken.deployTransaction);

  await w3bToken.deployTransaction.wait();
  console.log("W3B Token deployed to:", w3bToken.address);

  // Deploy TokenSwap Contract
  const TokenSwap = await ethers.getContractFactory("TokenSwap");
  const tokenSwap = await TokenSwap.deploy();
  console.log("TokenSwap Contract Deployment Transaction:", tokenSwap.deployTransaction);

  await tokenSwap.deployTransaction.wait();
  console.log("TokenSwap Contract deployed to:", tokenSwap.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
