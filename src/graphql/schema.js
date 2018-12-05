import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';

const typeDefs = `
    scalar Date

    input PostInput {
        text: String!
        date: Date!
        author: ID!
    }

    input UserInput {
        login: String!
        password: String!
        name: String!
        url_image: String
    }

    type User {
        _id: ID!
        login: String!
        name: String!
        url_image: String!
        following: [User]
        followers: [User]
    }

    type Post {
        _id: ID!
        text: String
        date: Date
        author: User
        likes: [User]
    }

    type PostPage {
        docs: [Post]
        total: Int
        limit: Int
        page: Int
        pages: Int
    }

    type UserPage {
        docs: [User]
        total: Int
        limit: Int
        page: Int
        pages: Int
    }

    type Query {
        user(_id: ID!): User
        users(filter: String!, page: Int!): UserPage
        usersPosts(users: String!, hashtags: String!, page: Int!): PostPage
        postsByUser(_id: ID!, page: Int): PostPage
        timelinePosts (page: Int!): PostPage
        filteredPosts(filter: String!, page: Int!): PostPage
        hashtagsPosts(filter: String!, page: Int!): PostPage
    }
    
    type Mutation {
        updateUser(_id: ID!, input: UserInput): User
        deleteUser(_id: ID!) : User
        createPost(input: PostInput) : Post
        likeOrUnlikePost(_id: ID!) : Post
        followOrUnfollowUser(_id: ID): User
    }`;

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

export default schema;