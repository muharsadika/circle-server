import { Request, Response } from "express"
import ThreadService from "../services/ThreadService"


export default new class ThreadController {
    get(req: Request, res: Response) {
        ThreadService.get(req, res)
    }

    getId(req: Request, res: Response) {
        ThreadService.getId(req, res)
    }
    create(req: Request, res: Response) {
        ThreadService.create(req, res)
    }

    update(req: Request, res: Response) {
        ThreadService.update(req, res)
    }

    delete(req: Request, res: Response) {
        ThreadService.delete(req, res)
    }
}