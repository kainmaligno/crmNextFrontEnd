import { gql, useQuery } from '@apollo/client';
import Producto from '../components/Producto';
import Link from 'next/link';
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
const Productos = () => {
  const { data, loading } = useQuery(OBTENER_PRODUCTOS);
  if (loading) return 'Cargando....';
  return (
    <div>
      <h1 className="text-2xl text-gray-800 font-light">Productos</h1>
      <Link href="/nuevoproducto">
        <a className="bg-green-600 w-full mt-3 mb-3 inline-block sm:w-auto font-bold uppercase text-sm rounded py-1 px-5 text-white shadow-md hover:bg-green-400">
          Nuevo Producto
        </a>
      </Link>
      <table className="table-auto shadow-md mt-10 w-full w-lg">
        <thead className="bg-green-600">
          <tr className="text-white">
            <th className="w-1/5 py-2">Nombre</th>
            <th className="w-1/5 py-2">Existencia</th>
            <th className="w-1/5 py-2">Precio</th>
            <th className="w-1/5 py-2">Eliminar</th>
            <th className="w-1/5 py-2">Editar</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {loading ? (
            <tr>
              <td>Loading...</td>
            </tr>
          ) : (
            data.obtenerProductos.map(producto => (
              <Producto key={producto.id} producto={producto} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Productos;
