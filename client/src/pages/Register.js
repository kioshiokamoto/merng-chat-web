import { useState } from 'react';
import { Card, Container, Row, Col, Form, Button } from 'react-bootstrap';
export default function Register() {
    const [variables, setVariables] = useState({
		email: '',
		username: '',
		password: '',
		confirmPassword: '',
	});
	const submitRegisterForm = (e) => {
		e.preventDefault();
        console.log(variables)
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
						<Form.Label>Email address</Form.Label>
						<Form.Control type="email" name="email" value={variables.email} onChange={handleInputChange} />
					</Form.Group>
					<Form.Group>
						<Form.Label>Username</Form.Label>
						<Form.Control
							type="text"
							name="username"
							value={variables.username}
							onChange={handleInputChange}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							name="password"
							value={variables.password}
							onChange={handleInputChange}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Confirm password</Form.Label>
						<Form.Control
							type="password"
							name="confirmPassword"
							value={variables.confirmPassword}
							onChange={handleInputChange}
						/>
					</Form.Group>
					<div className="text-center">
						<Button variant="success" type="submit">
							Register
						</Button>
					</div>
				</Form>
			</Col>
		</Row>
	);
}
