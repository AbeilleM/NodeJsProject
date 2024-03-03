'use strict';

exports.up = async (knex) => {
    await knex.schema.alterTable('user', (table) => {
        table.jsonb('favoriteMovies');
    });
};

exports.down = async (knex) => {
    await knex.schema.alterTable('user', (table) => {
        table.dropColumn('favoriteMovies');
    });
};
