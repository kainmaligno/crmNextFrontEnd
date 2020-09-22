import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Cliente from '../components/Cliente';
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
const Index = () => {
  const { data, loading, error, client } = useQuery(OBTENER_CLIENTES_USUARIO);
  const router = useRouter();
  if (loading) return <p>Loading...</p>;
  /* if (!data.obtenerClientesVendedor) {
    client.clearStore();
    router.push('/login');
  } */
  const vistaProtegida = () => {
    client.clearStore();
    router.push('/login');
  };
  return (
    <div>
      {data.obtenerClientesVendedor ? (
        <div>
          <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>
          <Link href="/nuevocliente">
            <a className="bg-green-600 w-full mt-3 mb-3 inline-block sm:w-auto font-bold uppercase text-sm rounded py-1 px-5 text-white shadow-md hover:bg-green-400">
              Nuevo Cliente
            </a>
          </Link>
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-green-600">
              <tr className="text-white">
                <th className="w-1/5 py-2">Nombre</th>
                <th className="w-1/5 py-2">Empresa</th>
                <th className="w-1/5 py-2">Email</th>
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
                data.obtenerClientesVendedor.map(cliente => (
                  <Cliente key={cliente.id} cliente={cliente} />
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        vistaProtegida()
      )}
    </div>
  );
};
export default Index;
