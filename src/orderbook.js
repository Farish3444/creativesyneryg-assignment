import React, { useEffect, useState, useContext } from 'react';
import { useOrderBook } from './orderbookContext';
import './orderbook.scss';

const OrderBook = () => {

  const { state, dispatch } = useOrderBook();

  useEffect(() => {
    // Load saved orders from local storage on component mount
    const savedOrders = JSON.parse(localStorage.getItem('orders'));
    if (savedOrders) {
      dispatch({ type: 'ADD_ORDERS', payload: savedOrders });
    }
  }, [dispatch]);

  useEffect(() => {
    const ws = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

    ws.onopen = () => {
      ws.send(JSON.stringify({
        event: 'subscribe',
        channel: 'book',
        symbol: 'tBTCUSD'
      }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (Array.isArray(message[1])) {
        const [price, count, amount] = message[1];
        const channelID = message[0];
        const bookEntry = { channelID, price, count, amount };
        dispatch({ type: 'ADD_ORDERS', payload: [bookEntry] });
      }
    };

    return () => {
      ws.close();
    };
  }, [dispatch]);

  useEffect(() => {
    // Save orders to local storage whenever state.orders changes
    localStorage.setItem('orders', JSON.stringify(state.orders));
  }, [state.orders]);

  return (
    <div className="order-book">
    <table>
      <thead>
        <tr>
          <th>Channel ID</th>
          <th>Price</th>
          <th>Count</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {state.orders.map((order, index) => (
          <tr key={index}>
            <td>{order.channelID}</td>
            <td>{order.price}</td>
            <td>{order.count}</td>
            <td>{order.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default OrderBook;
