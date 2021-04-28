import { ApolloClient, InMemoryCache, ApolloProvider  } from '@apollo/client';
import App from './App';

const client = new ApolloClient({
	uri: 'http://localhost:4000/',
	cache: new InMemoryCache(),
});

export default (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);
