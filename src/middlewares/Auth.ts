import { Response, Request, NextFunction } from "express"
import * as jwt from "jsonwebtoken"
import Env from "../utils/Env/Env"


export default new class AuthentificationMiddlewares {
    Authentification(req: Request, res: Response, next: NextFunction) : Response{
        try {
            const  Authorization = req.headers.authorization

            if (!Authorization || !Authorization.startsWith("Bearer ")) {
                return res.status(401).json({code: 401, message: "Unauthorized"})
            }

            const token = Authorization.split(" ")[1]

            try {
                const loginSession = jwt.verify(token, Env.EXPRESS_JWT_SECRET_KEY)
                res.locals.loginSession = loginSession
                next()
            } catch (error) {
                console.log(error)
                return res.status(401).json({code: 401, message: "Unauthorized"})
                
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({code: 500, message: error ("Error while Authentificating")})
            
        }
    }
}