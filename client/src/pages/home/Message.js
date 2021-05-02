import { useAuthState } from '../../context/auth';
import classNames from 'classnames';
import { Button, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
import moment from 'moment';
import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎'];

const REACT_TO_MESSAGE = gql`
	mutation react($uuid: String!, $content: String!) {
		reactToMessage(uuid: $uuid, content: $content) {
			uuid
		}
	}
`;
export default function Message({ message }) {
	const { user } = useAuthState();
	const sent = message.from === user.username;
	const received = !sent;

	const [showPopover, setShowPopover] = useState(false);

	const reactionIcons = [...new Set(message.reactions.map((r) => r.content))];

	const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
		onError: (err) => console.log(err),
		onCompleted: (data) => setShowPopover(false),
	});

	const react = (reaction) => {
		reactToMessage({ variables: { uuid: message.uuid, content: reaction } });
	};

	const reactButton = (
		<OverlayTrigger
			trigger="click"
			placement="top"
			show={showPopover}
			onToggle={setShowPopover}
			transition={false}
			rootClose
			overlay={
				<Popover className="rounded-pill">
					<Popover.Content className="d-flex px-0 py-1 align-items-center react-button-popover">
						{reactions.map((reaction) => (
							<Button
								variant="link"
								key={reaction}
								className="react-icon-button"
								onClick={() => react(reaction)}
							>
								{reaction}
							</Button>
						))}
					</Popover.Content>
				</Popover>
			}
		>
			<Button variant="link" className="px-2">
				<i className="far fa-smile"></i>
			</Button>
		</OverlayTrigger>
	);

	return (
		<div
			className={classNames('d-flex my-3', {
				'ml-auto': sent,
				'mr-auto': received,
			})}
		>
			{sent && reactButton}
			<OverlayTrigger
				placement={received ? 'right' : 'left'}
				overlay={<Tooltip>{moment(message.createdAt).format('MMMM DD, YYYY @ h:mm a')}</Tooltip>}
				transition={false}
			>
				<div
					className={classNames('py-2 px-3 rounded-pill bg-primary position-relative', {
						'bg-primary': sent,
						'bg-secondary': received,
					})}
				>
					{message.reactions.length > 0 && (
						<div className="reactions-div bg-secondary p-1 rounded-pill">
							{reactionIcons} {message.reactions.length}
						</div>
					)}
					<p className={classNames({ 'text-white': sent })}>{message.content}</p>
				</div>
			</OverlayTrigger>
			{received && reactButton}
		</div>
	);
}
