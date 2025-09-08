import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("orders", (table) => {
    table.increments("id").primary(),
      table
        .integer("table_session_id")
        .notNullable()
        .references("id")
        .inTable("tables_session"),
      table
        .integer("product_id")
        .notNullable()
        .references("id")
        .inTable("products"),
      table.integer("quantity").notNullable(),
      table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable(),
      table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {}
