import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("products").del();

  // Inserts seed entries
  await knex("products").insert([
    { name: "Nhoque quatro queijos", price: 45 },
    { name: "Isca de Frango", price: 60 },
    { name: "Isca de Peixe", price: 60 },
    { name: "Coxinha de Frango", price: 50 },
    { name: "Coxinha de Peixe", price: 50 },
    { name: "Coxinha de Carne", price: 50 },
    { name: "Coxinha de Camarao", price: 50 },
    { name: "Coxinha de Bacon", price: 50 },
    { name: "Coxinha de Presunto", price: 50 },
  ]);
}
