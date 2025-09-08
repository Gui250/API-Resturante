import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("tables", (table) => {
    table.increments("id").primary(),
      table.integer("table_number").notNullable(),
      table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable(),
      table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("tables");
}
