import { useReducer } from 'react';
import PedidoContext from './PedidoContext';
import PedidoReducer from './PedidoReducer';
import {
  SELECCIONAR_PRODUCTO,
  CANTIDAD_PRODUCTOS,
  SELECIONAR_CLIENTE,
  ACTUALIZAR_TOTAL,
} from '../../types';

const PedidoState = ({ children }) => {
  const initialState = {
    cliente: {},
    productos: [],
    total: 0,
  };
  const [state, dispatch] = useReducer(PedidoReducer, initialState);
  const agregarCliente = cliente => {
    dispatch({ type: SELECIONAR_CLIENTE, payload: cliente });
  };

  const agregarProducto = productosSeleccionados => {
    //arreglar el borrado de los objetos por el paso de informacion
    let nuevoState;
    if (state.productos.length > 0) {
      nuevoState = productosSeleccionados.map(producto => {
        const nuevoObjeto = state.productos.find(
          productoState => productoState.id === producto.id
        );
        return { ...producto, ...nuevoObjeto };
      });
    } else {
      nuevoState = productosSeleccionados;
    }
    dispatch({ type: SELECCIONAR_PRODUCTO, payload: nuevoState });
  };

  //modifica las cantidades de los productos
  const cantidadProductos = nuevoProducto => {
    dispatch({
      type: CANTIDAD_PRODUCTOS,
      payload: nuevoProducto,
    });
  };
  const actualizarTotal = () => {
    dispatch({ type: ACTUALIZAR_TOTAL });
  };
  return (
    <PedidoContext.Provider
      value={{
        productos: state.productos,
        total: state.total,
        cliente: state.cliente,
        agregarCliente,
        agregarProducto,
        cantidadProductos,
        actualizarTotal,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
};

export default PedidoState;
