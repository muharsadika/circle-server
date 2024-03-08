import { Request, Response } from "express";
import LikeService from "../services/LikeService";


export default new class LikeController {
    get(req: Request, res: Response): Promise<Response> {
        return LikeService.get(req, res);
    }

    getId(req: Request, res: Response): Promise<Response> {
        return LikeService.getId(req, res);
    }

    create(req: Request, res: Response): Promise<Response> {
        return LikeService.create(req, res);
    }

    update(req: Request, res: Response): Promise<Response> {
        return LikeService.update(req, res);
    }

    delete(req: Request, res: Response): Promise<Response> {
        return LikeService.delete(req, res);
    }
}