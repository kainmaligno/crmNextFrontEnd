import { useRouter } from 'next/router';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
const ACTUALIZAR_CLIENTE = gql`
  mutation actualizarCliente($id: ID!, $input: ClienteInput) {
    actualizarCliente(id: $id, input: $input) {
      nombre
      apellido
      email
      empresa
      telefono
    }
  }
`;
const OBTENER_CLIENTE = gql`
  query obtenerCliente($id: ID!) {
    obtenerCliente(id: $id) {
      nombre
      apellido
      email
      empresa
      telefono
    }
  }
`;
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
const EditarCliente = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;
  //query mutation
  const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE, {
    update(cache, { data: { actualizarCliente } }) {
      // Actulizar Clientes
      const { obtenerClientesVendedor } = cache.readQuery({
        query: OBTENER_CLIENTES_USUARIO,
      });

      const clientesActualizados = obtenerClientesVendedor.map(cliente =>
        cliente.id === id ? actualizarCliente : cliente
      );

      cache.writeQuery({
        query: OBTENER_CLIENTES_USUARIO,
        data: {
          obtenerClientesVendedor: clientesActualizados,
        },
      });

      // Actulizar Cliente Actual
      cache.writeQuery({
        query: OBTENER_CLIENTE,
        variables: { id },
        data: {
          obtenerCliente: actualizarCliente,
        },
      });
    },
  });
  const { data, loading } = useQuery(OBTENER_CLIENTE, {
    variables: {
      id,
    },
  });
  if (loading) return 'Loadings,.....';
  const schemaValidacion = Yup.object({
    nombre: Yup.string().required('El Nombre es Obligatorio'),
    apellido: Yup.string().required('El Apellido es Obligatorio'),
    email: Yup.string()
      .email('El Email no es valido')
      .required('El Email es Obligatorio'),
    empresa: Yup.string().required('La Empresa es Obligaotorio'),
    telefono: Yup.string(),
  });
  const { obtenerCliente } = data;
  const actualizarInfoCliente = async valores => {
    const { nombre, apellido, empresa, email, telefono } = valores;

    try {
      const { data } = await actualizarCliente({
        variables: {
          id,
          input: {
            nombre,
            apellido,
            empresa,
            email,
            telefono,
          },
        },
      });
      Swal.fire(
        'Actualizado',
        `El Cliente ${data.actualizarCliente.nombre} ${data.actualizarCliente.apellido} se actualizó correctamente`,
        'success'
      );
      router.push('/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Ha Ocurrido un Error',
        text: error.message.replace('GraphQL error; ', ''),
      });
      console.log(error);
    }
  };
  return (
    <>
      <h1 className="text-2xl text-gray-800 font-light">Editar Cliente</h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik
            validationSchema={schemaValidacion}
            enableReinitialize
            initialValues={obtenerCliente}
            onSubmit={valores => {
              actualizarInfoCliente(valores);
            }}
          >
            {props => {
              return (
                <form
                  className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                  onSubmit={props.handleSubmit}
                >
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="nombre"
                    >
                      Nombre
                    </label>
                    <input
                      className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline"
                      type="texto"
                      name="nombre"
                      id="nombre"
                      placeholder="Nombre cliente"
                      value={props.values.nombre}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.nombre && props.errors.nombre ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.nombre}</p>
                    </div>
                  ) : null}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="apellido"
                    >
                      Apellido
                    </label>
                    <input
                      className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline"
                      type="texto"
                      name="apellido"
                      id="apellido"
                      placeholder="Apellido"
                      value={props.values.apellido}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.apellido && props.errors.apellido ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.apellido}</p>
                    </div>
                  ) : null}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline"
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email"
                      value={props.values.email}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.email && props.errors.email ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.email}</p>
                    </div>
                  ) : null}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="empresa"
                    >
                      Empresa
                    </label>
                    <input
                      className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline"
                      type="texto"
                      name="empresa"
                      id="empresa"
                      placeholder="Empresa"
                      value={props.values.empresa}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.empresa && props.errors.empresa ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.empresa}</p>
                    </div>
                  ) : null}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="telefono"
                    >
                      Telefono
                    </label>
                    <input
                      className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline"
                      type="tel"
                      name="telefono"
                      id="telefono"
                      placeholder="Telefono"
                      value={props.values.telefono}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {/*  {props.touched.telefono && props.errors.telefono ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{props.errors.telefono}</p>
              </div>
            ) : null} */}
                  <input
                    type="submit"
                    className="bg-green-600 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-green-400"
                    value="Editar Cliente"
                  />
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default EditarCliente;
