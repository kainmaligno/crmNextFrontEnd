import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
const AUTENTICAR_USUARIO = gql`
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;
const Login = () => {
  const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);
  const [mensaje, guardarMensaje] = useState(null)
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('El Email no es valido')
        .required('Email es Obligatorio'),
      password: Yup.string().required('Password no puede estar en blanco'),
    }),
    onSubmit: async valores => {
      const { email, password } = valores;
      try {
        const { data } = await autenticarUsuario({
          variables: {
            input: { email, password },
          },
        });
        guardarMensaje("Autenticando ....")
        //guardar el token 
        const {token} = data.autenticarUsuario
        localStorage.setItem("token",token)
        //redireccionar a clientes
        setTimeout(()=>{
            guardarMensaje(null);
            router.push("/")
        },2000)
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
    <>
    {mensaje && mostrarMensaje()}
      <h1 className="text-center text-2xl text-white font-light">Login</h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-sm">
          <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
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
                placeholder="Email Usuario"
                value={formik.values.nombre}
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
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:online-none focus:shadow-outline"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.password}</p>
              </div>
            ) : null}
            <input
              className="bg-green-600 w-full mt-5 p-2 text-white uppercase hover:bg-green-900"
              type="submit"
              value="Iniciar Sesión"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
