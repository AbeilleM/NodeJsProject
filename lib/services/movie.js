'use strict';

const { Service } = require('@hapipal/schmervice');
const Jwt = require('@hapi/jwt');
const Boom  = require('@hapi/boom');


module.exports = class MovieService extends Service {
    createMovie(movie) {
        try {
            const { Movie } = this.server.models();

            return Movie.query().insertAndFetch(movie);
        } catch (err) {
            return err;
        }
    }

    getAllMovie() {
        const { Movie } = this.server.models();

        return Movie.query();
    }
    deleteMovieById(movieId) {
        const { Movie } = this.server.models();

        return Movie.query().deleteById(movieId);
    }
    updateByMovieId(movieId, updatedMovieData) {

        const { Movie } = this.server.models();

        return Movie.query().patchAndFetchById(movieId, updatedMovieData);

    }
};
