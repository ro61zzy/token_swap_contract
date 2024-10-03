import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";

describe("TokenSwap Contract with GUZ and W3B", function () {
  let Token: any, guzToken: any, w3bToken: any, TokenSwap: any, tokenSwap: any;
  let owner: Signer, addr1: Signer, addr2: Signer;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    Token = await ethers.getContractFactory("ERC20Mock");

    guzToken = await Token.deploy(
      "GUZ Token",
      "GUZ",
      ethers.utils.parseEther("1000")
    );

    w3bToken = await Token.deploy(
      "W3B Token",
      "W3B",
      ethers.utils.parseEther("1000")
    );

    TokenSwap = await ethers.getContractFactory("TokenSwap");
    tokenSwap = await TokenSwap.deploy();

    await guzToken.transfer(await addr1.getAddress(), ethers.utils.parseEther("100"));
    await w3bToken.transfer(await addr2.getAddress(), ethers.utils.parseEther("100"));
  });

  describe("Create Order with GUZ and W3B", function () {
    it("create an order and transfer GUZ to the contract", async function () {
      await guzToken
        .connect(addr1)
        .approve(tokenSwap.address, ethers.utils.parseEther("100"));

      await expect(
        tokenSwap
          .connect(addr1)
          .createOrder(
            guzToken.address,
            ethers.utils.parseEther("100"),
            w3bToken.address,
            ethers.utils.parseEther("20")
          )
      ).to.emit(tokenSwap, "OrderCreated");

      expect(await guzToken.balanceOf(tokenSwap.address)).to.equal(
        ethers.utils.parseEther("100")
      );

      const order = await tokenSwap.orders(0);
      expect(order.creator).to.equal(await addr1.getAddress());
      expect(order.tokenIn).to.equal(guzToken.address);
      expect(order.amountIn).to.equal(ethers.utils.parseEther("100"));
      expect(order.tokenOut).to.equal(w3bToken.address);
      expect(order.amountOut).to.equal(ethers.utils.parseEther("20"));
      expect(order.active).to.be.true;
    });
  });

  // Other tests for fulfill, cancel orders (as described in your provided code)...
});
