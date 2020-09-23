import Link from 'next/link';
const Pedidos = () => {
  return (
    <div>
      <h2 className="text-2xl text-gray-800 font-light">Pedidos</h2>
      <Link href="/nuevopedido">
        <a className="bg-green-600 w-full mt-3 mb-3 inline-block sm:w-auto font-bold uppercase text-sm rounded py-1 px-5 text-white shadow-md hover:bg-green-400">
          Nuevo Pedido
        </a>
      </Link>
    </div>
  );
};

export default Pedidos;
