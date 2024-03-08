import { Request, Response } from "express"
import { Repository } from "typeorm"
import { AppDataSource } from "../data-source"

import { Thread } from "../entities/Thread"
import { User } from "../entities/User"
import { Reply } from "../entities/Reply"
import { Like } from "../entities/Like"

import { CreateLikeSchema, UpdateLikeSchema } from "../utils/validator/LikeValidator"


export default new class LikeService {
    private readonly likeRepository: Repository<Like> = AppDataSource.getRepository(Like)
    private readonly threadRepository: Repository<Thread> = AppDataSource.getRepository(Thread)
    private readonly userRepository: Repository<User> = AppDataSource.getRepository(User)

    async get(req: Request, res: Response): Promise<Response> {
        try {
            const likes = await this.likeRepository.find({
                relations: ["thread", "user"]
            })
            return res.status(200).json({ code: 200, data: likes })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error })
        }
    }


    async getId(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id)

            const like = await this.likeRepository.findOne({
                where: { id: id },
                relations: ["thread", "user"]
            })
            return res.status(200).json({ code: 200, data: like })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error })
        }
    }


    async create(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body

            const { error, value } = CreateLikeSchema.validate(data)
            if (error) {
                return res.status(400).json({ code: 400, message: error })
            }

            const likeSetected: Like | null = await this.likeRepository.findOne({
                where: {
                    user: { id: res.locals.loginSession.user.id },
                    thread: { id: value.thread }
                }
            })

            console.log(res.locals.loginSession.user.id)
            console.log(value.thread)

            if (likeSetected) {
                await this.likeRepository.remove(likeSetected)
                return res.status(200).json({ code: 200, message: "You unlike this thread" })
            }

            const like = this.likeRepository.create({
                user: res.locals.loginSession.user.id,
                thread: value.thread
            })
            const LikeCreated = await this.likeRepository.save(like)
            return res.status(200).json({ code: 200, message: "You like this thread" , data: LikeCreated })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error })
        }
    }


    async update(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id)

            const like = await this.likeRepository.findOne({
                where: { id: id },
                relations: ["thread", "user"]
            })
            if (!like) {
                return res.status(404).json({ code: 404, message: "Like not found" })
            }

            const data = req.body

            const { error } = UpdateLikeSchema.validate(data)
            if (error) {
                return res.status(400).json({ code: 400, message: error })
            }
            if (data.user) {
                like.user = data.user
            }
            if (data.thread) {
                like.thread = data.thread
            }

            const LikeUpdated = await this.likeRepository.save(like)
            return res.status(200).json({ code: 200, data: LikeUpdated })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error })
        }
    }


    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id)

            const like = await this.likeRepository.findOne({
                where: { id: id },
                relations: ["thread", "user"]
            })

            if (!like) {
                return res.status(404).json({ code: 404, message: "Like not found" })
            }

            const likeDeleted = await this.likeRepository.remove(like)
            return res.status(200).json({ code: 200, data: likeDeleted })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error })
        }
    }
}