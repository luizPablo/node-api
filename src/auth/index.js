require('dotenv-safe').load();

import user from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

module.exports = {
    async login(req, res) {
        const found = await user.findOne({ login: req.body.login }).populate('following', '-password').populate('followers', '-password').exec();

        if (found) {
            if (bcrypt.compareSync(req.body.password, found.password)) {
                const id = found._id;
                var token = jwt.sign({
                    id
                }, process.env.SECRET, {
                    expiresIn: 1000000000000
                });

                found.password = '';

                return res.json({
                    auth: true,
                    user: found,
                    token: token
                });
            } else {
                return res.status(401).json({
                    auth: false,
                    message: 'Invalid password'
                });
            }
        }

        return res.status(401).json({
            auth: false,
            message: 'User not found'
        });
    },

    verify(req, res, next) {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).send({
                auth: false,
                message: 'No token provided'
            });
        }
    
        jwt.verify(token, process.env.SECRET, function (err, decoded) {
            if (err) {
                return res.status(500).send({
                    auth: false,
                    message: 'Failed to authenticate token.'
                });
            }
            next();
        });
    },

    async register(req, res) {

        try {
            const user_data = req.body;
            user_data.url_image = 'https://api.adorable.io/avatars/285/';

            const salt = bcrypt.genSaltSync();
            user_data.password = bcrypt.hashSync(user_data.password, salt);

            const user_create = await user.create(user_data);
            
            return res.status(201).json(user_create);

        } catch (e) {
            return res.json(e);

        }
        

    },
}