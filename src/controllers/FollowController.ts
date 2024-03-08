import { Request, Response } from "express";
import FollowService from "../services/FollowService";


export default new class FollowController {
    followUser(req: Request, res: Response): Promise<Response> {
        return FollowService.followUser(req, res);
    }

    getFollowingUsers(req: Request, res: Response): Promise<Response> {
        return FollowService.getFollowingUsers(req, res);
    }

    getFollowerUsers(req: Request, res: Response): Promise<Response> {
        return FollowService.getFollowerUsers(req, res);
    }
}