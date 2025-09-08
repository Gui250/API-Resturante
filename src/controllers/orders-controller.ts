import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { knex } from "@/database/knex";
import { OrderRepository } from "@/database/types/order-repository";
import { ProductRepository } from "@/database/types/product-repository";
import { AppError } from "@/utils/AppError";

class OrdersController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_session_id: z.number(),
        product_id: z.number(),
        quantity: z.number(),
      });

      const { table_session_id, product_id, quantity } = bodySchema.parse(
        req.body
      );

      const product = await knex<ProductRepository>("products")
        .where({ id: product_id })
        .first();

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      await knex<OrderRepository>("orders").insert({
        table_session_id,
        product_id,
        quantity,
      });

      return res.status(201).json();
    } catch (error) {
      next(error);
    }
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const { table_session_id } = req.params;
      const orders = await knex<OrderRepository>("orders")
        .where({ table_session_id })
        .orderBy("created_at", "desc");
    } catch (error) {
      next(error);
    }
  }
}

export { OrdersController };
