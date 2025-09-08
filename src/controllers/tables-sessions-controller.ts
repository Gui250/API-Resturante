import { Request, Response, NextFunction } from "express";
import { knex } from "@/database/knex";
import { z } from "zod";
import { TablesSessionRepository } from "@/database/types/tables-sessions-repository";
import { AppError } from "@/utils/AppError";

class TablesSessionsController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_id: z.number(),
      });
      const { table_id } = bodySchema.parse(request.body);
      const session = await knex<TablesSessionRepository>("tables_session")
        .where({ table_id })
        .orderBy("opened_at", "desc")
        .first();

      if (session && !session.closed_at) {
        throw new AppError("Table already has an open session", 400);
      }

      await knex<TablesSessionRepository>("tables_session").insert({
        table_id,
        opened_at: knex.fn.now(),
      });

      return response.status(201).json();
    } catch (error) {
      next(error);
    }
  }
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const sessions = await knex<TablesSessionRepository>("tables_session")
        .select()
        .orderBy("opened_at", "desc");
      return response.json(sessions);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: "Invalid ID" })
        .parse(request.params.id);

      const session = await knex<TablesSessionRepository>("tables_session")
        .where({ id })
        .first();

      if (!session) {
        throw new AppError("Session not found", 404);
      }

      if (session.closed_at) {
        throw new AppError("Session already closed", 400);
      }

      await knex<TablesSessionRepository>("tables_session")
        .where({ id })
        .update({ closed_at: knex.fn.now() });

      return response.json();
    } catch (error) {
      next(error);
    }
  }
}

export { TablesSessionsController };
