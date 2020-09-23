import '../styles/main.css';
import Layout from '../components/Layout';
import client from '../config/apollo';
import { ApolloProvider } from '@apollo/client';
import PedidoState from '../context/pedidos/PedidoState';
export default function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <PedidoState>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PedidoState>
    </ApolloProvider>
  );
}
