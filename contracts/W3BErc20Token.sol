// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract W3BToken is ERC20 {
    constructor() ERC20("W3BToken", "W3B") {
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals()))); 
    }
}
