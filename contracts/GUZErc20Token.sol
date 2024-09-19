// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GUZToken is ERC20 {
    constructor() ERC20("GUZToken", "GUZ") {
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals()))); // 1 million GUZ tokens minted to the deployer
    }
}

