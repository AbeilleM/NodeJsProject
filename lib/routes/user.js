'use strict';

const Joi = require('joi');
const bcrypt = require('bcrypt');

module.exports = [
    {
        method: 'post',
        path: '/user',
        options: {
            auth: false,
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                    email: Joi.string().min(3).example('john.doe@etu.unilim.fr').description('Email of the user'),
                    password: Joi.string().min(8).example('password').description('Password of the user'),
                    username: Joi.string().min(3).example('Pipopipo').description('Username of the user')
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            request.payload.password = await bcrypt.hash(request.payload.password, 10);

            return await userService.create(request.payload);
        }
    },
    {
        method: 'get',
        path: '/users',
        options: {
            auth: {
                scope: ['user', 'admin']
            },
            tags: ['api'],
            handler: async (request, h) => {

                const { userService } = request.services();

                return await userService.getAll(request.payload);
            }
        }
    },

    {
        method: 'delete',
        path: '/user/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('ID of the user to delete')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const userId = request.params.id;

            await userService.deleteById(userId);

            return h.response().code(204);
        }
    },

    {
        method: 'patch',
        path: '/user/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('ID of the user to update')
                }),
                payload: Joi.object({
                    firstName: Joi.string().min(3).example('John').description('Updated firstname of the user'),
                    lastName: Joi.string().min(3).example('Doe').description('Updated lastname of the user'),
                    email: Joi.string().min(3).example('john.doe@etu.unilim.fr').description('Updated email of the user'),
                    password: Joi.string().min(8).example('password').description('Updated password of the user'),
                    username: Joi.string().min(3).example('Pipopipo').description('Updated username of the user')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();

            request.payload.password = await bcrypt.hash(request.payload.password, 10);

            const userId = request.params.id;
            const updatedUserData = request.payload;

            const updatedUser = await userService.updateById(userId, updatedUserData);

            return h.response(updatedUser);
        }
    },

    {
        method: 'post',
        path: '/user/login',
        options: {
            auth: false,
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    username: Joi.string().required().example('jdoe').description('Username of the user'),
                    password: Joi.string().required().example('password').description('Password of the user')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const { username, password } = request.payload;

            try {
                const token = await userService.authenticate(username, password);
                return h.response({ token }).code(200);
            } catch (err) {
                return err;
            }
        }
    },

    {
        method: 'patch',
        path: '/user/{id}/grant-admin',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('ID of the user to grant admin role')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const userId = request.params.id;
            try {
                const user = await userService.findById(userId);
                if (!user) {
                    return h.response().code(404).message(`User with ID ${userId} not found`);
                }

                await userService.updateRoleById(userId, 'admin');

                return h.response().code(200).message(`Admin role granted to user with ID ${userId}`);
            } catch (err) {
                console.error('Error granting admin role to user', err);
                return h.response().code(500).message('Internal Server Error');
            }
        }
    },

    {
        method: 'patch',
        path: '/user/{id}/grant-user',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('ID of the user to grant user role')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const userId = request.params.id;
            try {
                const user = await userService.findById(userId);
                if (!user) {
                    return h.response().code(404).message(`User with ID ${userId} not found`);
                }

                await userService.updateRoleById(userId, 'user');

                return h.response().code(200).message(`Admin role granted to user with ID ${userId}`);
            } catch (err) {
                console.error('Error granting admin role to user', err);
                return h.response().code(500).message('Internal Server Error');
            }
        }
    },

    {
        method: 'post',
        path: '/users/{userId}/favorite',
        options: {
            auth: {
                scope: ['user', 'admin']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    userId: Joi.number().integer().required().description('User ID')
                }),
                payload: Joi.object({
                    movieId: Joi.number().integer().required().description('Film ID')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const userId = request.params.userId;
            const movieId = request.payload.movieId;
            try {
                await userService.addFilmToFavorites(userId, movieId);
                return h.response().code(204);
            } catch (error) {
                console.error('Error adding film to favorites', error);
                return h.response().code(error.output.statusCode).message(error.message);
            }
        }
    }

];
