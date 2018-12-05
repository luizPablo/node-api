import mongoose from 'mongoose';

import User from '../models/user';
import Post from '../models/post';

const { ObjectId } = mongoose.Types;

ObjectId.prototype.valueOf = function () {
    return this.toString()
}

export const resolvers = {
    Query: {
        async users(root, { filter, page }) {
            const usernames = filter.replace(/@/g,'').split(',');

            const users = await User.paginate(
                { login: {$in: usernames} }, 
                { page, limit: 10, populate: [['following', '-password'], ['followers', '-password']] }
            );

            users.docs.forEach(element => {
                element.password = '';
            });

            return users;
        },

        async usersPosts(root, { users, hashtags, page }) {
            const usernames = users.replace(/@/g,'').split(',');
            const hashtags_regex = hashtags.split(',').join('|');

            const found_users = await User.find({ login: {
                $in: usernames
            }}).exec();

            const ids = [];
            found_users.forEach(element => {
                ids.push(element._id);
            });

            const regex = new RegExp(hashtags_regex, 'i');

            const posts = await Post.paginate(
                { author: { $in: ids }, text: regex }, 
                { page, limit: 10, sort: {date : -1}, populate: ['author', 'likes'] }
            );

            return posts;
        },

        async user(root, { _id }) {
            return await User.findById(_id).populate('following', '-password').populate('followers', '-password').exec();
        },

        async postsByUser(root, { _id, page = 1 }) {
            const posts = await Post.paginate(
                { author: _id }, 
                { populate: ['author', 'likes'], page, limit: 10, sort: { date: -1 } }
            );
            return posts;
        },

        async timelinePosts(root, { page }) {
            const user = await User.findById(root.id);
            const ids = user.following;
            ids.push(root.id);

            const posts = await Post.paginate(
                { author: { $in: ids } }, 
                { populate: ['author', 'likes'], page, limit: 10, sort: { date: -1} }
            );

            return posts;
        },

        async filteredPosts(root, { filter, page }) {
            const regex = new RegExp('.*' + filter + '.*', 'i');

            const posts = await Post.paginate(
                {text: regex}, 
                { page, limit: 10, sort: {date: -1}, populate: ['author', 'likes'] }
            );

            return posts;
        },

        async hashtagsPosts(root, { filter, page }) {
            const hashtags = filter.split(',').join('|');
            const regex = new RegExp(hashtags, 'i');

            const posts = await Post.paginate( 
                {text: regex}, 
                {page, limit: 10, sort: {date: -1}, populate: ['author', 'likes'] }
            );

            return posts;
        },
    },

    Mutation: {
        async updateUser(root, { _id, input }) {
            return await User.findOneAndUpdate({ _id }, input, { new: true });
        },

        async deleteUser(root, { _id }) {
            return await User.findOneAndDelete({ _id });
        },

        async createPost(root, { input }) {
            return await Post.create(input);
        },

        async likeOrUnlikePost(root, { _id }) {
            const user = await User.findById(root.id);
            const post = await Post.findById(_id);

            const index = post.likes.indexOf(user._id);
            
            if(index === -1){
                post.likes.push(user);
            } else {
                post.likes.splice(index, 1);
            }

            await post.save();
            const response = await Post.findById(_id).populate('likes').exec();
            
            return response;
        },

        async followOrUnfollowUser(root, { _id }){
            const sender = await User.findById(root.id);
            const tofollow = await User.findById(_id);

            const index_followers = tofollow.followers.indexOf(sender._id);
            const index_following = sender.following.indexOf(tofollow._id);

            if(index_followers === -1 && index_following === -1){
                sender.following.push(tofollow._id);
                tofollow.followers.push(sender._id);
            } else {
                sender.following.splice(index_following, 1);
                tofollow.followers.splice(index_followers, 1);
            }

            await sender.save();
            await tofollow.save();
            const response = await User.findById(_id).populate('followers').exec();
            return response;
        }
    },
};