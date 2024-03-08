import { Request, Response } from "express"
import ReplyService from "../services/ReplyService"


export default new class ReplyController {
    get(req: Request, res: Response): Promise<Response> {
        return ReplyService.get(req, res)
    }

    getId(req: Request, res: Response): Promise<Response> {
        return ReplyService.getId(req, res)
    }

    create(req: Request, res: Response): Promise<Response> {
        return ReplyService.create(req, res)
    }

    update(req: Request, res: Response): Promise<Response> {
        return ReplyService.update(req, res)
    }

    delete(req: Request, res: Response): Promise<Response> {
        return ReplyService.delete(req, res)
    }
}