'use strict';

const Joi = require('joi');

module.exports = [

    {
        method: 'post',
        path: '/movie',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    title: Joi.string().min(3).example('Pacific Rim').description('Title of the movie'),
                    description: Joi.string().min(3).example('A wonderful movie about big monsters and Mecha fights !').description('Description of the movie'),
                    releasedDate: Joi.date().example('2013-07-1').description('Release date of the movie'),
                    director: Joi.string().min(3).example('Guillermo del Toro').description('Director of the movie'),
                })
            }
        },
        handler: async (request, h) => {
            const { movieService } = request.services();
            const dataMovie = request.payload;
            try {
                const film = await movieService.createMovie(dataMovie);
                return h.response(film).code(201);
            } catch (error) {
                console.error('Error creating film', error);
                return h.response().code(error.output.statusCode).message(error.message);
            }
        }
    },
    {
        method: 'get',
        path: '/movies',
        options: {
            auth: {
                scope: ['user', 'admin']
            },
            tags: ['api'],
            handler: async (request, h) => {

                const { movieService } = request.services();

                return await movieService.getAllMovie(request.payload);
            }
        }
    },

    {
        method: 'delete',
        path: '/movie/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('ID of the movie to delete')
                })
            }
        },
        handler: async (request, h) => {
            const { movieService } = request.services();
            const movieId = request.params.id;

            await movieService.deleteMovieById(movieId);

            return h.response().code(204);
        }
    },
    {
        method: 'patch',
        path: '/movie/{id}',
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
                    title: Joi.string().min(3).example('Pacific Rim').description('Title of the movie'),
                    description: Joi.string().min(3).example('A wonderful movie about big monsters and Mecha fights !').description('Description of the movie'),
                    releasedDate: Joi.date().example('2013-07-1').description('Release date of the movie'),
                    director: Joi.string().min(3).example('Guillermo del Toro').description('Director of the movie'),
                })
            }
        },
        handler: async (request, h) => {
            const { movieService } = request.services();

            const movieId = request.params.id;
            const updatedMovieData = request.payload;

            const updatedMovie = await movieService.updateByMovieId(movieId, updatedMovieData);

            return h.response(updatedMovie);
        }
    }

];
