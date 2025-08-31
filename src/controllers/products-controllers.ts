import { NextFunction, Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { z } from "zod";
import { knex } from "@/database/knex";

class ProductsController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.query;
      const products = await knex<ProductRepository>("products")
        .select("*")
        .whereLike("name", `%${name ?? ""}%`)
        .orderBy("name");

      return res.json(products);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string().trim().min(6),
        price: z.number().gt(0, { message: "Price must be greater than 0" }),
      });
      const { name, price } = bodySchema.parse(req.body);

      await knex<ProductRepository>("products").insert({ name, price });

      return res.status(201).json();
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: "Invalid ID" })
        .parse(req.params.id);

      const bodySchema = z.object({
        name: z.string().trim().min(6),
        price: z.number().gt(0, { message: "Price must be greater than 0" }),
      });

      const { name, price } = bodySchema.parse(req.body);

      await knex<ProductRepository>("products")
        .where({ id })
        .update({ name, price, updated_at: knex.fn.now() });

      return res.json();
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: "Invalid ID" })
        .parse(req.params.id);

      const product = await knex<ProductRepository>("products")
        .where({ id })
        .first();

      if (!product) {
        throw new AppError("Product not found", 404);
      }
      await knex<ProductRepository>("products").where({ id }).delete();

      return res.json();
    } catch (err) {
      next(err);
    }
  }
}
export { ProductsController };
