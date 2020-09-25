import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import Pedido from '../components/Pedido';
const OBTENER_PEDIDOS = gql`
  query obtenerPedidosVendedor {
    obtenerPedidosVendedor {
      id
      pedido {
        id
        cantidad
        nombre
      }
      cliente {
        id
        nombre
        apellido
        email
        telefono
      }
      vendedor
      total
      estado
    }
  }
`;
const Pedidos = () => {
  const { data, loading, error } = useQuery(OBTENER_PEDIDOS);
  if (loading) return 'Cargando...';
  const { obtenerPedidosVendedor } = data;
  return (
    <div>
      <h2 className="text-2xl text-gray-800 font-light">Pedidos</h2>
      <Link href="/nuevopedido">
        <a className="bg-green-600 w-full mt-3 mb-3 inline-block sm:w-auto font-bold uppercase text-sm rounded py-1 px-5 text-white shadow-md hover:bg-green-400">
          Nuevo Pedido
        </a>
      </Link>
      {obtenerPedidosVendedor.length === 0 ? (
        <div className="mt-5 text-center text-2xl">
          <p>No hay pedidos aun </p>
        </div>
      ) : (
        obtenerPedidosVendedor.map(pedido => (
          <Pedido key={pedido.id} pedido={pedido} />
        ))
      )}
    </div>
  );
};

export default Pedidos;
