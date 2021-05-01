import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { gql, useLazyQuery } from '@apollo/client';
import {Link} from 'react-router-dom'
import { useAuthDispatch } from '../context/auth';
const LOGIN_USER = gql`
	query login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			username
			email
			createdAt
			token
		}
	}
`;

export default function Login(props) {
	const [variables, setVariables] = useState({
		username: '',
		password: '',
	});
	const [errors, setErrors] = useState({});
	const dispatch = useAuthDispatch()
    const [loginUser, {loading }] = useLazyQuery(LOGIN_USER,{
        onError:(err)=>setErrors(err.graphQLErrors[0].extensions.errors),
        onCompleted:(data)=>{
			dispatch({type:'LOGIN',payload:data.login})
            window.location.href = '/'
        }
    })
	const submitLoginForm = (e) => {
		e.preventDefault();
       loginUser({variables})
	};
	const handleInputChange = (e) => {
		setVariables({
			...variables,
			[e.target.name]: e.target.value,
		});
	};
	return (
		<Row className="bg-white py-5 justify-content-center">
			<Col sm={8} md={6} lg={4}>
			
				<h1 className="text-center">Login</h1>
				<Form onSubmit={submitLoginForm}>
					<Form.Group>
						<Form.Label className={errors.username && 'text-danger'}>
							{errors.username ?? 'Username'}
						</Form.Label>
						<Form.Control
							type="text"
							name="username"
							className={errors.email && 'is-invalid'}
							value={variables.username}
							onChange={handleInputChange}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label className={errors.password && 'text-danger'}>
							{errors.password ?? 'Password'}
						</Form.Label>
						<Form.Control
							type="password"
							name="password"
							className={errors.email && 'is-invalid'}
							value={variables.password}
							onChange={handleInputChange}
						/>
					</Form.Group>
					<div className="text-center">
						<Button variant="success" type="submit" disabled={loading}>
							{loading ? 'Loading...' : 'Login'}
						</Button>
                        <br />
                        <small>Dont have an account? <Link to="/register">Register</Link></small>
					</div>
				</Form>
			</Col>
		</Row>
	);
}
