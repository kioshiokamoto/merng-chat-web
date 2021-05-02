import React, { Fragment, useEffect, useState } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { Col, Form } from 'react-bootstrap';

import { useMessageDispatch, useMessageState } from '../../context/message';
import Message from './Message';

const SEND_MESSAGE = gql`
	mutation sendMessage($to: String!, $content: String!) {
		sendMessage(to: $to, content: $content) {
			uuid
			content
			from
			to
			createdAt
		}
	}
`;

const GET_MESSAGES = gql`
	query getMessages($from: String!) {
		getMessages(from: $from) {
			uuid
			from
			to
			content
			createdAt
			reactions {
				uuid
				content
			}
		}
	}
`;

export default function Messages() {
	const [content, setContent] = useState('');

	const { users } = useMessageState();
	const dispatch = useMessageDispatch();

	const selectedUser = users?.find((u) => u.selected === true);
	const messages = selectedUser?.messages;

	const [getMessages, { loading: messagesLoading, data: messagesData }] = useLazyQuery(GET_MESSAGES);

	const [sendMessage] = useMutation(SEND_MESSAGE, {
		onError: (err) => console.log(err),
	});

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
		selectedChatMarkup = <p className="info-text">Select a friend</p>;
	} else if (messagesLoading) {
		selectedChatMarkup = <p className="info-text">Loading..</p>;
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
		selectedChatMarkup = <p className="info-text">You are now connected! send your first message!</p>;
	}

	const submitMessage = (e) => {
		e.preventDefault();
		if (content.trim() === '' || !selectedUser) return;
		setContent('');
		sendMessage({ variables: { to: selectedUser.username, content } });
	};

	return (
		<Col xs={10} md={8} className="p-0">
			<div className="messages-box d-flex flex-column-reverse p-3">{selectedChatMarkup}</div>
			<div className="px-3 py-2">
				<Form onSubmit={submitMessage}>
					<Form.Group className="d-flex align-items-center m-0">
						<Form.Control
							type="text"
							className="message-input p-4 rounded-pill bg-secondary border-0"
							placeholder="Type a message..."
							value={content}
							onChange={(e) => setContent(e.target.value)}
						/>
						<i
							role="button"
							className="fas fa-paper-plane fa-2x text-primary ml-2"
							onClick={submitMessage}
						></i>
					</Form.Group>
				</Form>
			</div>
		</Col>
	);
}
