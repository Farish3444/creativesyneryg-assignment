import React,{ createContext,useState,useContext,useEffect, Children, useReducer } from 'react';

const initialState = {
    orders:[]
}

const OrderBookContext = createContext(initialState);

const orderBookReducer = (state,action) =>{
    switch(action.type){
        case "ADD_ORDERS":
            return {
                ...state, orders:[...state.orders,...action.payload]
            }
        default:
            return state;    
    }
}


export const OrderBookProvider =({ children }) =>{

    const [state,dispatch] = useReducer(orderBookReducer,initialState);

    return (
        <OrderBookContext.Provider value={{state,dispatch}}>
                {children}
        </OrderBookContext.Provider>
    )

};

export const useOrderBook =()=> useContext(OrderBookContext);