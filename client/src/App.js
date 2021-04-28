import { Container } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.scss';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
export default function App() {
	

	return (
		<Container className="pt-5">
			<Router>
				<Switch>
					<Route exact path='/' component={Home} />
					<Route path='/register' component={Register}/>
					<Route path='/login' component={Login}/>

				</Switch>

			</Router>
		</Container>
	);
}
