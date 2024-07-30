import './App.css';
import OrderBook from './orderbook';
import { OrderBookProvider } from './orderbookContext';

const App=()=> {
  return (
    <OrderBookProvider>
    <div className="App">
    <h2>OrderBook Status</h2>
    <OrderBook />
    </div>  
    </OrderBookProvider>
  );
}

export default App;