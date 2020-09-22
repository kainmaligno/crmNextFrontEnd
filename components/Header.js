import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';
const OBTENER_USUARIO = gql`
  query obtenerUsuario {
    obtenerUsuario {
      id
      email
      nombre
      apellido
    }
  }
`;
const Header = () => {
  const router = useRouter();
  const { client, data, loading, error } = useQuery(OBTENER_USUARIO);
  if (loading) return 'Loading...';

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    client.clearStore();
    router.push('/login');
  };
  const vistaProtegida = () => {
    client.clearStore();
    router.push('/login');
  };

  return (
    <>
      {data.obtenerUsuario ? (
        <div className="flex justify-between mb-6">
          <p className="mr-2">
            {' '}
            Hola:{data.obtenerUsuario.nombre} {data.obtenerUsuario.apellido}
          </p>
          <button
            onClick={cerrarSesion}
            className="bg-green-600 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md"
            type="button"
          >
            Cerrar Sesión
          </button>
        </div>
      ) : (
        vistaProtegida()
      )}
    </>
  );
};

export default Header;
