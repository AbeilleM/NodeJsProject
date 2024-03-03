'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class User extends Model {

    static get tableName() {

        return 'user';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            role: Joi.string().default('user').example('user').description('Role of the user'),
            firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
            lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
            email: Joi.string().min(3).example('john.doe@etu.unilim.fr').description('Email of the user'),
            password: Joi.string().min(8).example('password').description('Password of the user'),
            username: Joi.string().min(3).example('Pipopipo').description('Username of the user'),
            favoriteMovies: Joi.array().items(Joi.number().integer().greater(0)).default([]).description('List of favorite movies'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
        this.role = 'user';
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }

};
