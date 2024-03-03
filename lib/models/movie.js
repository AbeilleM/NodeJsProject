'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Movie extends Model {

    static get tableName() {

        return 'movie';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().min(3).example('Pacific Rim').description('Title of the movie'),
            description: Joi.string().min(3).example('A wonderful movie about big monsters and Mecha fights !').description('Description of the movie'),
            releasedDate: Joi.date().example('2013-07-1').description('Release date of the movie'),
            director: Joi.string().min(3).example('Guillermo del Toro').description('Director of the movie'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }

};
