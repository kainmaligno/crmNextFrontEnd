import { useReducer } from 'react';
import PedidoContext from './PedidoContext';
import PedidoReducer from './PedidoReducer';
import {
  SELECCIONAR_PRODUCTO,
  CANTIDAD_PRODUCTOS,
  SELECIONAR_CLIENTE,
} from '../../types';

const PedidoState = ({ children }) => {
  const initialState = {
    cliente: {},
    productos: [],
    total: 0,
  };
  const [state, dispatch] = useReducer(PedidoReducer, initialState);
  const agregarCliente = cliente => {
    console.log(cliente);
    dispatch({ type: SELECIONAR_CLIENTE, payload: cliente });
  };
  const agregarProducto = productos => {
    console.log(productos);
    dispatch({ type: SELECCIONAR_PRODUCTO, payload: productos });
  };
  return (
    <PedidoContext.Provider value={{ agregarCliente, agregarProducto }}>
      {children}
    </PedidoContext.Provider>
  );
};

export default PedidoState;
