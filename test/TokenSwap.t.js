const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenSwap Contract with GUZ and W3B", function () {
  let Token, guzToken, w3bToken, TokenSwap, tokenSwap;
  let owner, addr1, addr2;

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

    await guzToken.transfer(addr1.address, ethers.utils.parseEther("100"));
    await w3bToken.transfer(addr2.address, ethers.utils.parseEther("100"));
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
      expect(order.creator).to.equal(addr1.address);
      expect(order.tokenIn).to.equal(guzToken.address);
      expect(order.amountIn).to.equal(ethers.utils.parseEther("100"));
      expect(order.tokenOut).to.equal(w3bToken.address);
      expect(order.amountOut).to.equal(ethers.utils.parseEther("20"));
      expect(order.active).to.be.true;
    });
  });

  describe("Fulfill Order with GUZ and W3B", function () {
    it("should fulfill an order and transfer GUZ and W3B between parties", async function () {
      await guzToken
        .connect(addr1)
        .approve(tokenSwap.address, ethers.utils.parseEther("100"));

      await tokenSwap
        .connect(addr1)
        .createOrder(
          guzToken.address,
          ethers.utils.parseEther("100"),
          w3bToken.address,
          ethers.utils.parseEther("20")
        );

      await w3bToken
        .connect(addr2)
        .approve(tokenSwap.address, ethers.utils.parseEther("20"));

      await expect(tokenSwap.connect(addr2).fulfillOrder(0)).to.emit(
        tokenSwap,
        "OrderFulfilled"
      );

      expect(await guzToken.balanceOf(addr2.address)).to.equal(
        ethers.utils.parseEther("100")
      );
      expect(await w3bToken.balanceOf(addr1.address)).to.equal(
        ethers.utils.parseEther("20")
      );

      const order = await tokenSwap.orders(0);
      expect(order.active).to.be.false;
    });

    it("should not fulfill an inactive order", async function () {
      await guzToken
        .connect(addr1)
        .approve(tokenSwap.address, ethers.utils.parseEther("100"));

      await tokenSwap
        .connect(addr1)
        .createOrder(
          guzToken.address,
          ethers.utils.parseEther("100"),
          w3bToken.address,
          ethers.utils.parseEther("20")
        );

      await w3bToken
        .connect(addr2)
        .approve(tokenSwap.address, ethers.utils.parseEther("20"));

      await tokenSwap.connect(addr2).fulfillOrder(0);

      await expect(tokenSwap.connect(addr2).fulfillOrder(0)).to.be.revertedWith(
        "Order is not active"
      );
    });
  });

  describe("Cancel Order with GUZ and W3B", function () {
    it("should allow the creator to cancel the order and reclaim GUZ tokens", async function () {
      await guzToken
        .connect(addr1)
        .approve(tokenSwap.address, ethers.utils.parseEther("100"));

      await tokenSwap
        .connect(addr1)
        .createOrder(
          guzToken.address,
          ethers.utils.parseEther("100"),
          w3bToken.address,
          ethers.utils.parseEther("20")
        );

      await expect(tokenSwap.connect(addr1).cancelOrder(0)).to.emit(
        tokenSwap,
        "OrderCancelled"
      );

      expect(await guzToken.balanceOf(tokenSwap.address)).to.equal(0);

      expect(await guzToken.balanceOf(addr1.address)).to.equal(
        ethers.utils.parseEther("100")
      );

      const order = await tokenSwap.orders(0);
      expect(order.active).to.be.false;
    });

    it("should not allow a non-creator to cancel the order", async function () {
      await guzToken
        .connect(addr1)
        .approve(tokenSwap.address, ethers.utils.parseEther("100"));

      await tokenSwap
        .connect(addr1)
        .createOrder(
          guzToken.address,
          ethers.utils.parseEther("100"),
          w3bToken.address,
          ethers.utils.parseEther("20")
        );

      await expect(tokenSwap.connect(addr2).cancelOrder(0)).to.be.revertedWith(
        "Only creator can cancel the order"
      );
    });
  });
});
