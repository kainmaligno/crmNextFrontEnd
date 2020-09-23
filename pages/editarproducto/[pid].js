import { useRouter } from 'next/router';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
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
const OBTENER_PRODUCTO = gql`
  query obtenerProducto($id: ID!) {
    obtenerProducto(id: $id) {
      nombre
      precio
      existencia
      creado
    }
  }
`;
const ACTUALIZAR_PRODUCTO = gql`
  mutation actualizarProducto($id: ID!, $input: ProductoInput) {
    actualizarProducto(id: $id, input: $input) {
      id
      nombre
      existencia
      precio
    }
  }
`;

const EditarProducto = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;
  const { data, loading } = useQuery(OBTENER_PRODUCTO, { variables: { id } });
  const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO, {
    update(cache, { data: { actualizarProducto } }) {
      //leer query de productos
      const { obtenerProductos } = cache.readQuery({
        query: OBTENER_PRODUCTOS,
      });
      const productosActualizados = obtenerProductos.map(producto =>
        producto.id === id ? actualizarProducto : producto
      );

      //actualizar producto actual
      cache.writeQuery({
        query: OBTENER_PRODUCTO,
        variabes: { id },
        data: { obtenerProducto: actualizarProducto },
      });
      //actualizar productos con la nueva lista
      cache.writeQuery({
        query: OBTENER_PRODUCTOS,
        data: { obtenerProductos: productosActualizados },
      });
    },
  });
  if (loading) return <div>Loading...</div>;
  const schemaValidacion = Yup.object({
    nombre: Yup.string().required('El Nombre es Obligatorio'),
    existencia: Yup.number()
      .required('El Valor es Obligatorio')
      .positive('No se aceptan numeros negativos')
      .integer('La Existencia debe de ser Numero entero'),
    precio: Yup.number()
      .required('El Precio es Obligatorio')
      .positive('No se aceptan numeros negativos'),
  });
  const { obtenerProducto } = data;

  const actualizarInfoProducto = async valores => {
    const { nombre, existencia, precio } = valores;
    try {
      const { data } = await actualizarProducto({
        variables: {
          id,
          input: {
            nombre,
            existencia,
            precio,
          },
        },
      });
      Swal.fire(
        'Actualizado',
        `El Producto ${data.actualizarProducto.nombre} ${data.actualizarProducto.precio} se actualizó correctamente`,
        'success'
      );
      router.push('/productos');
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
    <div>
      <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik
            validationSchema={schemaValidacion}
            enableReinitialize
            initialValues={obtenerProducto}
            onSubmit={valores => {
              actualizarInfoProducto(valores);
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
                      type="text"
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
                      htmlFor="existencia"
                    >
                      Existencia
                    </label>
                    <input
                      className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline"
                      type="number"
                      name="existencia"
                      id="existencia"
                      placeholder="Existencia"
                      value={props.values.existencia}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.existencia && props.errors.existencia ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.existencia}</p>
                    </div>
                  ) : null}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="precio"
                    >
                      Precio
                    </label>
                    <input
                      className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline"
                      type="number"
                      name="precio"
                      id="precio"
                      placeholder="Precio"
                      value={props.values.precio}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.precio && props.errors.precio ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.precio}</p>
                    </div>
                  ) : null}
                  <input
                    type="submit"
                    className="bg-green-600 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-green-400"
                    value="Editar Producto"
                  />
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditarProducto;
