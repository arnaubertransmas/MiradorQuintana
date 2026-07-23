'use client';

import { createContext, useContext, useMemo, useReducer } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex((item) => item.key === action.item.key);
      if (existingIndex >= 0) {
        const items = [...state.items];
        items[existingIndex] = {
          ...items[existingIndex],
          quantity: items[existingIndex].quantity + action.item.quantity,
        };
        return { ...state, items };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case 'SET_QUANTITY': {
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((item) => item.key !== action.key) };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.key === action.key ? { ...item, quantity: action.quantity } : item
        ),
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.key !== action.key) };
    case 'SET_TABLE_NUMBER':
      return { ...state, tableNumber: action.tableNumber };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], tableNumber: '' });

  const total = useMemo(
    () =>
      state.items.reduce((sum, item) => {
        const extrasTotal = (item.extras || []).reduce((s, extra) => s + Number(extra.preu), 0);
        return sum + (Number(item.unitPrice) + extrasTotal) * item.quantity;
      }, 0),
    [state.items]
  );

  const itemCount = useMemo(() => state.items.reduce((sum, item) => sum + item.quantity, 0), [state.items]);

  const value = useMemo(
    () => ({ ...state, total, itemCount, dispatch }),
    [state, total, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
