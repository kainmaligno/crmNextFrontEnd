import '../styles/main.css';
import Layout from '../components/Layout';
import client from '../config/apollo';
import { ApolloProvider } from '@apollo/client';
export default function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}
