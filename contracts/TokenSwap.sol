// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenSwap {
    struct Order {
        address creator;
        address tokenIn;
        uint256 amountIn;
        address tokenOut;
        uint256 amountOut;
        bool active;
    }

    Order[] public orders;
    event OrderCreated(uint256 orderId, address creator);
    event OrderFulfilled(uint256 orderId);
    event OrderCancelled(uint256 orderId);

    function createOrder(
        address _tokenIn,
        uint256 _amountIn,
        address _tokenOut,
        uint256 _amountOut
    ) external {
        require(_amountIn > 0 && _amountOut > 0, "Amounts must be greater than zero");

        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);

        orders.push(Order({
            creator: msg.sender,
            tokenIn: _tokenIn,
            amountIn: _amountIn,
            tokenOut: _tokenOut,
            amountOut: _amountOut,
            active: true
        }));

        emit OrderCreated(orders.length - 1, msg.sender);
    }

    function fulfillOrder(uint256 _orderId) external {
        Order storage order = orders[_orderId];
        require(order.active, "Order is not active");

        IERC20(order.tokenOut).transferFrom(msg.sender, order.creator, order.amountOut);
        IERC20(order.tokenIn).transfer(msg.sender, order.amountIn);

        order.active = false;

        emit OrderFulfilled(_orderId);
    }

    function cancelOrder(uint256 _orderId) external {
        Order storage order = orders[_orderId];
        require(order.creator == msg.sender, "Only creator can cancel the order");
        require(order.active, "Order is not active");

        IERC20(order.tokenIn).transfer(order.creator, order.amountIn);

        order.active = false;

        emit OrderCancelled(_orderId);
    }
}
