import React, { Fragment, useEffect, useState } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { Col, Form } from 'react-bootstrap';

import { useMessageDispatch, useMessageState } from '../../context/message';
import Message from './Message';

const GET_MESSAGES = gql`
	query getMessages($from: String!) {
		getMessages(from: $from) {
			uuid
			from
			to
			content
			createdAt
		}
	}
`;

export default function Messages() {
	const [content, setContent] = useState('')

	const { users } = useMessageState();
	const dispatch = useMessageDispatch();

	const selectedUser = users?.find((u) => u.selected === true);
	const messages = selectedUser?.messages;

	const [getMessages, { loading: messagesLoading, data: messagesData }] = useLazyQuery(GET_MESSAGES);

	useEffect(() => {
		if (selectedUser && !selectedUser.messages) {
			getMessages({ variables: { from: selectedUser.username } });
		}
	}, [selectedUser]);

	useEffect(() => {
		if (messagesData) {
			dispatch({
				type: 'SET_USER_MESSAGES',
				payload: {
					username: selectedUser.username,
					messages: messagesData.getMessages,
				},
			});
		}
	}, [messagesData]);

	let selectedChatMarkup;
	if (!messages && !messagesLoading) {
		selectedChatMarkup = <p>Select a friend</p>;
	} else if (messagesLoading) {
		selectedChatMarkup = <p>Loading..</p>;
	} else if (messages.length > 0) {
		selectedChatMarkup = messages.map((message, index) => (
			<Fragment key={message.uuid}>
				<Message message={message} />
				{index === messages.length - 1 && (
					<div className="invisible">
						<hr className="m-0 " />
					</div>
				)}
			</Fragment>
		));
	} else if (messages.length === 0) {
		selectedChatMarkup = <p>You are now connected! send your first message!</p>;
	}

	const submitMessage = (e)=>{
		e.preventDefault()
		if(content==='') return



	}

	return (
		<Col xs={10} md={8} className="messages-box d-flex flex-column-reverse">
			{selectedChatMarkup}
			<Form onSubmit={submitMessage}>
				<Form.Group>
					<Form.Control
						type="text"
						className="rounded-pill bg-secondary"
						placeholder="Type a message..."
						value={content}
						onChange={e=>setContent(e.target.value)}
					/>

				</Form.Group>
			</Form>
		</Col>
	);
}
