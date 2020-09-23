import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import Swal from 'sweetalert2';
const CREAR_NUEVO_PRODUCTO = gql`
  mutation nuevoProducto($input: ProductoInput) {
    nuevoProducto(input: $input) {
      id
      nombre
      existencia
      precio
      creado
    }
  }
`;
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
const NuevoProducto = () => {
  const router = useRouter();
  const [nuevoProducto] = useMutation(CREAR_NUEVO_PRODUCTO);
  const formik = useFormik({
    initialValues: {
      nombre: '',
      existencia: '',
      precio: '',
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required('El Nombre es Obligatorio'),
      existencia: Yup.number()
        .required('El Valor es Obligatorio')
        .positive('No se aceptan numeros negativos')
        .integer('La Existencia debe de ser Numero entero'),
      precio: Yup.number()
        .required('El Precio es Obligatorio')
        .positive('No se aceptan numeros negativos'),
    }),
    onSubmit: async valores => {
      const { nombre, existencia, precio } = valores;
      try {
        const { data } = await nuevoProducto({
          variables: {
            input: {
              nombre,
              existencia,
              precio,
            },
          },
          update: (cache, { data: { nuevoProducto } }) => {
            //obtener el objeto de cache
            const { obtenerProductos } = cache.readQuery({
              query: OBTENER_PRODUCTOS,
            });
            // reescribir cache para actualizar el estado
            cache.writeQuery({
              query: OBTENER_PRODUCTOS,
              data: {
                obtenerProductos: {
                  ...obtenerProductos,
                  nuevoProducto,
                },
              },
            });
          },
        });
        Swal.fire(
          'Creado',
          `Se creó el ${data.nuevoProducto.nombre} correctamente`,
          'success'
        );
        router.push('/productos');
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Ha Ocurrido un Error',
          text: error.message.replace('GraphQL error; ', ''),
        });
      }
    },
  });
  return (
    <div>
      <h1 className="text-2xl text-gray-800 font-light">
        Crear Nuevo Producto
      </h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form
            action=""
            className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
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
                placeholder="Nombre Producto"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.nombre && formik.errors.nombre ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.nombre}</p>
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
                placeholder="Existencia Producto"
                value={formik.values.existencia}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.existencia && formik.errors.existencia ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.existencia}</p>
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
                placeholder="Precio Producto"
                value={formik.values.precio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.precio && formik.errors.precio ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.precio}</p>
              </div>
            ) : null}
            <input
              type="submit"
              className="bg-green-600 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-green-400"
              value="Crear Producto"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default NuevoProducto;
