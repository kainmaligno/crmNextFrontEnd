import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
const NUEVO_CLIENTE = gql`
  mutation nuevoCliente($input: ClienteInput) {
    nuevoCliente(input: $input) {
      nombre
      apellido
      email
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
const NuevoCliente = () => {
  const [nuevoCliente] = useMutation(NUEVO_CLIENTE);
  const [mensaje, guardarMensaje] = useState(null);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      email: '',
      empresa: '',
      telefono: '',
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required('El Nombre es Obligatorio'),
      apellido: Yup.string().required('El Apellido es Obligatorio'),
      email: Yup.string()
        .email('El Email no es valido')
        .required('El Email es Obligatorio'),
      empresa: Yup.string().required('La Empresa es Obligaotorio'),
      telefono: Yup.string(),
    }),
    onSubmit: async valores => {
      const { nombre, apellido, email, empresa, telefono } = valores;
      try {
        const { data } = await nuevoCliente({
          variables: {
            input: {
              nombre,
              apellido,
              email,
              empresa,
              telefono,
            },
          },
          update: (cache, { data: { nuevoCliente } }) => {
            //Obtener el objeto de cache que deseamos actualizar
            const { obtenerClientesVendedor } = cache.readQuery({
              query: OBTENER_CLIENTES_USUARIO,
            });
            //rescribir el cache (el cache nunca se va a modificar)
            cache.writeQuery({
              query: OBTENER_CLIENTES_USUARIO,
              data: {
                obtenerClientesVendedor: [
                  ...obtenerClientesVendedor,
                  nuevoCliente,
                ],
              },
            });
          },
        });
        guardarMensaje(
          `Se guardo correctamente el Usuario: ${data.nuevoCliente.nombre}`
        );
        setTimeout(() => {
          guardarMensaje(null);
          router.push('/');
        }, 3000);
      } catch (error) {
        guardarMensaje(error.message.replace('GraphQL error; ', ''));
        setTimeout(() => {
          guardarMensaje(null);
        }, 3000);
      }
    },
  });
  const mostrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{mensaje}</p>
      </div>
    );
  };
  return (
    <div>
      {mensaje && mostrarMensaje()}
      <h1 className="text-2xl text-gray-800 font-light">Nuevo Cliente</h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form
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
                type="texto"
                name="nombre"
                id="nombre"
                placeholder="Nombre cliente"
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
                value={formik.values.apellido}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.apellido && formik.errors.apellido ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.apellido}</p>
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
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.email}</p>
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
                value={formik.values.empresa}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.empresa && formik.errors.empresa ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.empresa}</p>
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
                value={formik.values.telefono}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {/*  {formik.touched.telefono && formik.errors.telefono ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.telefono}</p>
              </div>
            ) : null} */}
            <input
              type="submit"
              className="bg-green-600 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-green-400"
              value="Registrar Cliente"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default NuevoCliente;
