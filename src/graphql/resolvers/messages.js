const { UserInputError, AuthenticationError, withFilter, ForbiddenError } = require('apollo-server');
const { subscribe } = require('graphql');
const { Op } = require('sequelize');

//const pubSub = new PubSub()
//Own
const { User, Message, Reaction } = require('../../models');
module.exports = {
	Query: {
		getMessages: async (parent, { from }, { user }) => {
			try {
				if (!user) throw new AuthenticationError('Unauthenticated');
				const otherUser = await User.findOne({
					where: { username: from },
				});
				if (!otherUser) {
					throw new UserInputError('User not found');
				}

				const usernames = [user.username, otherUser.username];

				const messages = await Message.findAll({
					where: {
						from: { [Op.in]: usernames },
						to: { [Op.in]: usernames },
					},
					order: [['createdAt', 'DESC']],
					include: [{ model: Reaction, as: 'reactions' }],
				});

				return messages;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
	},
	Mutation: {
		sendMessage: async (parent, { to, content }, { user, pubSub }) => {
			try {
				if (!user) throw new AuthenticationError('Unauthenticated');

				const recipient = await User.findOne({ where: { username: to } });

				if (!recipient) {
					throw new UserInputError('User not found');
				} else if (recipient.username === user.username) {
					throw new UserInputError('You cant message yourself');
				}

				if (content.trim() === '') throw new UserInputError('Message is empty');

				const message = await Message.create({
					from: user.username,
					to,
					content,
				});

				pubSub.publish('NEW_MESSAGE', { newMessage: message });

				return message;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
		reactToMessage: async (_, { uuid, content }, { user, pubSub }) => {
			const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎'];

			try {
				if (!reactions.includes(content)) {
					throw new UserInputError('Invalid reaction');
				}

				//Get user
				const username = user ? user.username : '';
				user = await User.findOne({ where: { username } });
				if (!user) throw new AuthenticationError('Unauthenticated');

				//Get message
				const message = await Message.findOne({ where: { uuid } });
				if (!message) throw new UserInputError('message not found');

				if (message.from !== user.username && message.to !== user.username) {
					throw new ForbiddenError('Unauthorized');
				}

				let reaction = await Reaction.findOne({
					where: { messageId: message.id, userId: user.id },
				});

				if (reaction) {
					//Reaction exists, update!
					reaction.content = content;
					await reaction.save();
				} else {
					//Reaction doesnt exist, create
					reaction = await Reaction.create({
						messageId: message.id,
						userId: user.id,
						content,
					});
				}
				pubSub.publish('NEW_REACTION', { newReaction: reaction });

				return reaction;
			} catch (error) {
				throw error;
			}
		},
	},
	Subscription: {
		newMessage: {
			subscribe: withFilter(
				(_, __, { pubSub, user }) => {
					if (!user) throw new AuthenticationError('Unauthenticated');
					return pubSub.asyncIterator('NEW_MESSAGE');
				},
				({ newMessage }, _, { user }) => {
					if (newMessage.from === user.username || newMessage.to === user.username) {
						return true;
					}
					return false;
				}
			),
		},
		newReaction: {
			subscribe: withFilter(
				(_, __, { pubSub, user }) => {
					if (!user) throw new AuthenticationError('Unauthenticated');
					return pubSub.asyncIterator('NEW_REACTION');
				},
				async ({ newReaction }, _, { user }) => {
					const message = await newReaction.getMessage();
					if (message.from === user.username || message.to === user.username) {
						return true;
					}
					return false;
				}
			),
		},
	},
};
