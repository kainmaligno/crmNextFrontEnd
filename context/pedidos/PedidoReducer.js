import {
  SELECIONAR_CLIENTE,
  SELECCIONAR_PRODUCTO,
  CANTIDAD_PRODUCTOS,
} from '../../types';
export default (state, action) => {
  switch (action.type) {
    case SELECIONAR_CLIENTE:
      return {
        ...state,
        cliente: action.payload,
      };

    case SELECCIONAR_PRODUCTO:
      return {
        ...state,
        productos: action.payload,
      };

    default:
      return state;
  }
};
