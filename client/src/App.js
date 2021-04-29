import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import './App.scss';
import { AuthProvider } from './context/auth';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DynamicRoute from './util/DynamicRoute';

export default function App() {
	return (
		<AuthProvider>
			<Container className="pt-5">
				<Router>
					<Switch>
						<DynamicRoute exact path="/" component={Home} authenticated/>
						<DynamicRoute path="/register" component={Register} guest />
						<DynamicRoute path="/login" component={Login} guest />
					</Switch>
				</Router>
			</Container>
		</AuthProvider>
	);
}
