import type { Request, Response } from "express";

export class GetProfileController {
  constructor() {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const user = req.user;

    res.status(200).json({ status: "success", data: user });
  }
}
