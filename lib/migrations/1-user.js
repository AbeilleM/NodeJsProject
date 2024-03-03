'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.alterTable('user', (table) => {

            // Adding new columns
            table.string('email').notNull();
            table.string('password').notNull();
            table.string('username').notNull();
        });
    },

    async down(knex) {

        await knex.schema.alterTable('user', (table) => {

            // Dropping added columns
            table.dropColumns('email', 'password', 'username');
        });
    }
};
