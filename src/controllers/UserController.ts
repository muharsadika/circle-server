import { Request, Response } from "express"
import UserService from "../services/UserService"


export default new class UserController {
    get(req: Request, res: Response) {
        UserService.get(req, res)
    }

    getId(req: Request, res: Response) {
        UserService.getId(req, res)
    }

    create(req: Request, res: Response) {
        UserService.create(req, res)
    }

    update(req: Request, res: Response) {
        UserService.update(req, res)
    }

    delete(req: Request, res: Response) {
        UserService.delete(req, res)
    }
}