// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// we need
// user to create order - deposit a specific amount of tokens and specify the amount of the other token needed
// fullfill order by the other user
// cancel order if it has not been fulfilled

contract TokenSwap {
    
    struct Order {
        address creator;
        address tokenIn;
        uint256 amountIn;
        address tokenOut;
        uint256 amountOut;
        bool active;
    }

    uint256 public orderCount;
    mapping(uint256 => Order) public orders;

   
    event OrderCreated(uint256 orderId, address indexed creator, address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOut);



    event OrderCancelled(uint256 orderId);


    function createOrder(
        address _tokenIn, 
        uint256 _amountIn, 
        address _tokenOut, 
        uint256 _amountOut
    ) external {
        require(_amountIn > 0, "Amount in must be greater than zero");
        require(_amountOut > 0, "Amount out must be greater than zero");

        // Transfer tokens from the order creator to this contract
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);
        
        orders[orderCount] = Order({
            creator: msg.sender,
            tokenIn: _tokenIn,
            amountIn: _amountIn,
            tokenOut: _tokenOut,
            amountOut: _amountOut,
            active: true
        });

        emit OrderCreated(orderCount, msg.sender, _tokenIn, _amountIn, _tokenOut, _amountOut);

        orderCount++;
    }

 
}
