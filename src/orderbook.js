import React, { useEffect, useState, useContext } from 'react';
import { useOrderBook } from './orderbookContext';
// import './orderbook.scss';

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
      }))
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message)
      if (Array.isArray(message[1])) {
        dispatch({ type: 'ADD_ORDERS', payload: message[1] });
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
      {state.orders.map((order, index) => (
        <div key={index}>{order}</div>
      ))}
    </div>
  );
};

export default OrderBook;
