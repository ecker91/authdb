import React, { createContext, useContext, useState } from 'react';

const PedidoContext = createContext(null);

export function PedidoProvider({ children }) {
  const [pedidos, setPedidos] = useState([]);
  return (
    <PedidoContext.Provider value={{ pedidos, setPedidos }}>
      {children}
    </PedidoContext.Provider>
  );
}
export const usePedidos = () => useContext(PedidoContext);