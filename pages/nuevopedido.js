import { useContext, useState } from 'react';
import AsignarCliente from '../components/pedidos/AsignarCliente';
import AsignarProductos from '../components/pedidos/AsignarProductos';
import ResumenPedido from '../components/pedidos/ResumenPedido';
import Total from '../components/pedidos/Total';
import PedidoContext from '../context/pedidos/PedidoContext';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import { Router, useRouter } from 'next/router';
const NUEVO_PEDIDO = gql`
  mutation nuevoPedido($input: PedidoInput) {
    nuevoPedido(input: $input) {
      id
      total
    }
  }
`;

const NuevoPedido = () => {
  const [nuevoPedido] = useMutation(NUEVO_PEDIDO);
  const pedidoContext = useContext(PedidoContext);
  const { cliente, productos, total } = pedidoContext;
  const [mensaje, setMensaje] = useState(null);
  const router = useRouter();
  const validarPedido = () => {
    return !productos.every(producto => producto.cantidad > 0) ||
      total === 0 ||
      cliente.length === 0
      ? 'opacity-50 cursor-not-allowed'
      : '';
  };
  const crearNuevoPedido = async () => {
    const { id } = cliente;
    //remover lo no deseado de productos
    const pedido = productos.map(
      ({ __typename, existencia, ...producto }) => producto
    );
    console.log(pedido, 'el pedido');
    try {
      const { data } = await nuevoPedido({
        variables: {
          input: {
            cliente: id,
            total: total,
            pedido,
          },
        },
      });
      router.push('/pedidos');
      Swal.fire('Correcto', 'El pedido se registro correctamente', 'success');
    } catch (error) {
      setMensaje(error.message.replace('GraphQL error', ''));
      setTimeout(() => {
        setMensaje(null);
      }, 3000);
      console.log(error);
    }
  };
  const mostrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto ">
        <p>{mensaje}</p>
      </div>
    );
  };
  return (
    <div>
      <h1 className="text-2xl text-gray-800 font-light">Crear Nuevo Pedido</h1>
      {mensaje && mostrarMensaje()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <AsignarCliente />
          <AsignarProductos />
          <ResumenPedido />
          <Total />
          <button
            type="button"
            className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()}`}
            onClick={() => crearNuevoPedido()}
          >
            registrar pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default NuevoPedido;
