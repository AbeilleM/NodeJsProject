'use strict';

const { Service } = require('@hapipal/schmervice');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const Boom  = require('@hapi/boom');
const {array} = require("joi");


module.exports = class UserService extends Service {

    async authenticate(username, password) {
        try {
            const user = await this.findByUsername(username);

            const token = this.generateToken(user);
            return token;
        } catch (err) {
            return err;
        }
    }

    async generateToken(userdata) {
        return Jwt.token.generate({
            aud: 'urn:audience:iut',
            iss: 'urn:issuer:iut',
            firstName: userdata.firstName,
            lastName: userdata.lastName,
            username: userdata.username,
            scope: userdata.role //Le scope du user
        }, {
            key: 'random_string', // La clé qui est définit dans lib/auth/strategies/jwt.js
            algorithm: 'HS512'
        }, {
            ttlSec: 14400 // 4 hours
        });
    }

    async create(user) {
        try {
            const { User } = this.server.models();

            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;

            user.role = 'user';

            return User.query().insertAndFetch(user);
        } catch (err) {
            return err;
        }
    }

    getAll() {
        const { User } = this.server.models();

        return User.query();
    }

    deleteById(userId) {

        const { User } = this.server.models();

        return User.query().deleteById(userId);

    }

    updateById(userId, updatedUserData) {

        const { User } = this.server.models();

        return User.query().patchAndFetchById(userId, updatedUserData);

    }

    findByUsername(username) {
        const { User } = this.server.models();

        return User.query().findOne({ username });
    }

    findById(userId) {
        const { User } = this.server.models();

        return User.query().findById(userId);
    }

    async updateRoleById(userId, role) {
        try {
            const { User } = this.server.models();
            const user = await User.query().findById(userId);

            user.role = role;
            await user.$query().patch({ role });

            return user;
        } catch (err) {
            console.error('Error in updateRoleById()', err);
            throw Boom.internal('Internal Server Error');
        }
    }
    async addFilmToFavorites(userId, movieId) {
        try {
            const { User } = this.server.models();
            await User.query().findById(userId).patch({ $addToSet: { favoriteMovies: movieId } });
        } catch (error) {
            console.error('Error adding movie to favorites', error);
            throw this.boomify(error);
        }
    }
};
