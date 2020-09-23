import AsignarCliente from '../components/pedidos/AsignarCliente';
import AsignarProductos from '../components/pedidos/AsignarProductos';
const NuevoPedido = () => {
  return (
    <div>
      <h1 className="text-2xl text-gray-800 font-light">Crear Nuevo Pedido</h1>
      <AsignarCliente />
      <AsignarProductos />
    </div>
  );
};

export default NuevoPedido;
