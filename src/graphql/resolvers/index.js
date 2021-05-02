const userResolvers = require('./users')
const messageResolvers = require('./messages')
const {User, Message} = require('../../models')

module.exports = {
    Message:{
        createdAt: (parent) =>parent.createdAt.toISOString()
    },
    User:{
        createdAt: (parent) =>parent.createdAt.toISOString()
    },
    Reaction:{
        createdAt: (parent) =>parent.createdAt.toISOString(),
        Message: async (parent) => await Message.findByPk(parent.messageId),
        User: async (parent) => await User.findByPk(parent.userId,{attributes:['username','imageUrl','createdAt']}),
    },
    Query:{
        ...userResolvers.Query,
        ...messageResolvers.Query
    },
    Mutation:{
        ...userResolvers.Mutation,
        ...messageResolvers.Mutation
    },
    Subscription:{
        ...messageResolvers.Subscription,
    }

}