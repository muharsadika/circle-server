import { Request, Response } from "express"
import { Repository } from "typeorm"
import { AppDataSource } from "../data-source"

import { Thread } from "../entities/Thread"
import { User } from "../entities/User"
import { Reply } from "../entities/Reply"
import { Like } from "../entities/Like"

import { LoginSchema, RegisterSchema } from "../utils/validator/AuthValidator"

import * as jwt from "jsonwebtoken"
import * as bycrypt from "bcrypt"


export default new class AuthService {
    private readonly AuthRepository: Repository<User> = AppDataSource.getRepository(User)

    async register(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body;
            console.log(data)

            const { error } = RegisterSchema.validate(data);
            if (error) {
                return res.status(400).json({ code: 400, message: error });
            }

            const isCheckEmail = await this.AuthRepository.findOne({
                where: { email: data.email },
            });

            if (isCheckEmail) {
                return res.status(400).json({ code: 400, message: "Email already exists" });
            }

            const hashedPassword = await bycrypt.hash(data.password, 10);

            const user = this.AuthRepository.create({
                full_name: data.full_name,
                email: data.email,
                username: data.username,
                password: hashedPassword
            })

            const UserCreated = await this.AuthRepository.save(user)
            return res.status(200).json({ code: 200, message: "Register success", data: UserCreated });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error });
        }
    }


    async login(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body;

            const { error } = LoginSchema.validate(data);
            if (error) {
                return res.status(400).json({ code: 400, message: error });
            }

            const isCheckEmail = await this.AuthRepository.findOne({
                where: { username: data.username },
                select: [
                    "id",
                    "full_name",
                    "email",
                    "username",
                    "password",
                    "bio",
                    "profile_picture",
                    // "following",
                    // "followers",
                    // "threads",
                    // "replies",
                    // "likes",
                ],
                relations: ["threads", "replies", "likes", "following", "followers"]
            })
            if (!isCheckEmail) {
                return res.status(404).json({ code: 404, message: "User not found" });
            }

            const isCheckPassword = await bycrypt.compare(data.password, isCheckEmail.password)

            if (!isCheckPassword) {
                return res.status(400).json({ code: 400, message: "Wrong password" });
            }

            const user = await this.AuthRepository.create({
                id: isCheckEmail.id,
                full_name: isCheckEmail.full_name,
                email: isCheckEmail.email,
                username: isCheckEmail.username,
                bio: isCheckEmail.bio,
                profile_picture: isCheckEmail.profile_picture,
                threads: isCheckEmail.threads,
                replies: isCheckEmail.replies,
                likes: isCheckEmail.likes,
                following: isCheckEmail.following,
                followers: isCheckEmail.followers,
            })

            const token = await jwt.sign({ user }, "secret", {
                expiresIn: process.env.EXPRESS_JWT_EXPIRED_TIME
            })

            return res.status(200).json({ code: 200, token: token, user })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error });
        }
    }


    async check(req: Request, res: Response): Promise<Response> {
        try {
            const loginSession = res.locals.loginSession
            console.log(loginSession)

            const user = await this.AuthRepository.findOne({
                where: { id: loginSession.user.id },
                relations: ["threads", "replies", "likes", "following", "followers"],
            })

            return res.status(200).json({ code: 200, user: user, message: "Login success" });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error });
        }
    }
}
