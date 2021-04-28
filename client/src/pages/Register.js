import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useMutation, gql } from '@apollo/client';
import { Link } from 'react-router-dom';

const REGISTER_USER = gql`
	mutation register($username: String!, $email: String!, $password: String!, $confirmPassword: String!) {
		register(username: $username, email: $email, password: $password, confirmPassword: $confirmPassword) {
			username
			email
			createdAt
		}
	}
`;

export default function Register(props) {
	const [variables, setVariables] = useState({
		email: '',
		username: '',
		password: '',
		confirmPassword: '',
	});
	const [errors, setErrors] = useState({});

	const [registerUser, { loading }] = useMutation(REGISTER_USER, {
		update: (_, __) => props.history.push('/login'),
		onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
	});

	const submitRegisterForm = (e) => {
		e.preventDefault();
		registerUser({ variables });
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
				<h1 className="text-center">Register</h1>
				<Form onSubmit={submitRegisterForm}>
					<Form.Group>
						<Form.Label className={errors.email && 'text-danger'}>
							{errors.email ?? 'Email address'}
						</Form.Label>
						<Form.Control
							type="email"
							name="email"
							className={errors.email && 'is-invalid'}
							value={variables.email}
							onChange={handleInputChange}
						/>
					</Form.Group>
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
					<Form.Group>
						<Form.Label className={errors.confirmPassword && 'text-danger'}>
							{errors.confirmPassword ?? 'Confirm password'}
						</Form.Label>
						<Form.Control
							type="password"
							name="confirmPassword"
							className={errors.email && 'is-invalid'}
							value={variables.confirmPassword}
							onChange={handleInputChange}
						/>
					</Form.Group>
					<div className="text-center">
						<Button variant="success" type="submit" disabled={loading}>
							{loading ? 'Loading...' : 'Register'}
						</Button>
						<br />
                        <small>Already have an account? <Link to="/login">Login</Link></small>
					</div>
				</Form>
			</Col>
		</Row>
	);
}
