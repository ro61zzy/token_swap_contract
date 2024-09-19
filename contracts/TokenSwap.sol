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


//to restrict contract to only use guz and w3b, I have deployed the contracts, so give their addresses
//     address public constant GUZ_TOKEN = 0x...; 
// address public constant W3B_TOKEN = 0x...; 




    uint256 public orderCount;
    mapping(uint256 => Order) public orders;

    event OrderCreated(
        uint256 orderId,
        address indexed creator,
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint256 amountOut
    );
    event OrderFulfilled(uint256 orderId, address indexed fulfiller);
    event OrderCancelled(uint256 orderId);


    function createOrder(
        address _tokenIn,
        uint256 _amountIn,
        address _tokenOut,
        uint256 _amountOut
    ) external {
        require(_amountIn > 0, "Amount in must be greater than zero");
        require(_amountOut > 0, "Amount out must be greater than zero");

        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);

//restrict contract to only use these two
// require(
//     (_tokenIn == GUZ_TOKEN && _tokenOut == W3B_TOKEN) || 
//     (_tokenIn == W3B_TOKEN && _tokenOut == GUZ_TOKEN),
//     "Only GUZ and W3B tokens are allowed"
// );

        orders[orderCount] = Order({
            creator: msg.sender,
            tokenIn: _tokenIn,
            amountIn: _amountIn,
            tokenOut: _tokenOut,
            amountOut: _amountOut,
            active: true
        });

        emit OrderCreated(
            orderCount,
            msg.sender,
            _tokenIn,
            _amountIn,
            _tokenOut,
            _amountOut
        );

        orderCount++;
    }

    function fulfillOrder(uint256 _orderId) external {
        Order memory order = orders[_orderId];
        require(order.active, "Order is not active");

        IERC20(order.tokenOut).transferFrom(
            msg.sender,
            order.creator,
            order.amountOut
        );

        IERC20(order.tokenIn).transfer(msg.sender, order.amountIn);

        orders[_orderId].active = false;

        emit OrderFulfilled(_orderId, msg.sender);
    }


    function cancelOrder(uint256 _orderId) external {
        Order memory order = orders[_orderId];
        require(
            msg.sender == order.creator,
            "Only creator can cancel the order"
        );
        require(order.active, "Order is not active");

       
        IERC20(order.tokenIn).transfer(order.creator, order.amountIn);

        orders[_orderId].active = false;

        emit OrderCancelled(_orderId);
    }

       function getOrder(uint256 _orderId) external view returns (
        address creator,
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint256 amountOut,
        bool active
    ) {
        Order memory order = orders[_orderId];
        return (order.creator, order.tokenIn, order.amountIn, order.tokenOut, order.amountOut, order.active);
    }

}
