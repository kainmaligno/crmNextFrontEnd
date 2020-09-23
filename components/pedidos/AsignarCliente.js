import { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      email
      empresa
    }
  }
`;

const AsignarCliente = () => {
  const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);
  const [cliente, setCliente] = useState([]);
  const pedidoContext = useContext(PedidoContext);
  const { agregarCliente } = pedidoContext;
  useEffect(() => {
    agregarCliente(cliente);
  }, [cliente]);
  const seleccionarCliente = clientes => {
    setCliente(clientes);
  };
  if (loading) return 'loading...!';
  const { obtenerClientesVendedor } = data;
  return (
    <div>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        1.- Asigna un Cliente al pedido
      </p>
      <Select
        options={obtenerClientesVendedor}
        onChange={opcion => seleccionarCliente(opcion)}
        getOptionValue={opciones => opciones.id}
        getOptionLabel={opciones => opciones.nombre}
        placeholder="Selecciona el cliente"
        noOptionsMessage={() => 'No hay resultados'}
      />
    </div>
  );
};

export default AsignarCliente;
