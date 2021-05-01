import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import App from './App';

let httpLink = createHttpLink({
	uri: 'http://localhost:4000/',
});

const authLink = setContext((_, { headers }) => {
	// get the authentication token from local storage if it exists
	const token = localStorage.getItem('token');
	// return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : '',
		},
	};
});

const wsLink = new WebSocketLink({
	uri: 'ws://localhost:4000/graphql',
	options: {
		reconnect: true,
		connectionParams: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	},
});


httpLink=authLink.concat(httpLink)

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
	},
	wsLink,
	httpLink
);

const client = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache(),
});

export default (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);
