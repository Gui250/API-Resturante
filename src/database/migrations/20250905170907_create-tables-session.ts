import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("tables_session", (table) => {
    table.increments("id").primary(),
      table
        .integer("table_id")
        .notNullable()
        .references("id")
        .inTable("tables"),
      table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable(),
      table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("tables_session");
}
