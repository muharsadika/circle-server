import { Response, Request } from "express";
import AuthService from "../services/AuthService";

export default new class AuthController {
    register(req: Request, res: Response): Promise<Response> {
        return AuthService.register(req, res);
    }

    login(req: Request, res: Response): Promise<Response> {
        return AuthService.login(req, res);
    }

    check(req: Request, res: Response): Promise<Response> {
        return AuthService.check(req, res);
    }

    // getId(req: Request, res: Response): Promise<Response> {
    //     return AuthService.getId(req, res);
    // }
}