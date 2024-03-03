'use strict';

module.exports = {

    async up(knex) {
        const hasRole = await knex.schema.hasColumn('user', 'role');

        if (!hasRole) {
            await knex.schema.alterTable('user', (table) => {
                table.string('role').defaultTo('user');
            });
        }
    },

    async down(knex) {

        await knex.schema.alterTable('user', (table) => {

            // Dropping added columns
            table.dropColumns('role');
        });
    }
};
