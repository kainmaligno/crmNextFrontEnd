import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import fetch from 'node-fetch';
import { setContext } from 'apollo-link-context';
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/',
  fetch,
});
const authLink = setContext((_, { headers }) => {
  //leer sorage almacenado
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache({ resultCaching: true }),
  link: authLink.concat(httpLink),
});

export default client;
