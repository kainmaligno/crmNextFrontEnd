import { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';
const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      precio
      existencia
    }
  }
`;
const AsignarProductos = () => {
  const { data, loading } = useQuery(OBTENER_PRODUCTOS);
  const [productos, setProductos] = useState([]);
  const pedidoContext = useContext(PedidoContext);
  const { agregarProducto } = pedidoContext;
  useEffect(() => {
    console.log(productos);
    agregarProducto(productos);
  }, [productos]);
  const seleccionarProducto = producto => {
    setProductos(producto);
  };
  if (loading) return 'Cargando....';
  const { obtenerProductos } = data;
  return (
    <div>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        2.-Asignar Productos
      </p>
      <Select
        options={obtenerProductos}
        isMulti={true}
        onChange={opcion => seleccionarProducto(opcion)}
        getOptionValue={opciones => opciones.id}
        getOptionLabel={opciones =>
          `${opciones.nombre} - ${opciones.existencia} Disponibles`
        }
        placeholder="Selecciona el producto"
        noOptionsMessage={() => 'No hay resultados'}
      />
    </div>
  );
};

export default AsignarProductos;
