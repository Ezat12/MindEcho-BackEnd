import type { Request, Response } from "express";
import type { DeleteAttachmentService } from "../services/delete-attachment.service.js";

export class DeleteAttachmentController {
  constructor(
    private readonly deleteAttachmentService: DeleteAttachmentService,
  ) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const { journalId, attachmentId } = req.params;

    const userId = req.user.id;

    await this.deleteAttachmentService.execute(
      String(userId),
      String(journalId),
      String(attachmentId),
    );

    res
      .status(200)
      .json({ status: "success", message: "Attachment deleted successfully" });
  }
}
