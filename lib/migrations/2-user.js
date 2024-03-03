'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.alterTable('user', (table) => {

            // Adding new columns
            table.string('role').notNull();
        });
    },

    async down(knex) {

        await knex.schema.alterTable('user', (table) => {

            // Dropping added columns
            table.dropColumns('role');
        });
    }
};
