import { NextFunction, Request, Response } from "express";

class ProductsController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (err) {
      next(err);
    }
  }
}

export { ProductsController };
