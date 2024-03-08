import { Request, Response } from "express"
import { Repository } from "typeorm"
import { AppDataSource } from "../data-source"

import { User } from "../entities/User"
import { Thread } from "../entities/Thread"
import { Reply } from "../entities/Reply"
import { Like } from "../entities/Like"

import { CreateReplySchema, UpdateReplySchema } from "../utils/validator/ReplyValidator"
import { json } from "stream/consumers"
import { log } from "console"
import { uploadToCloudinary } from "../utils/Cloudinary"
import { deleteFile } from "../utils/FileHelper"



export default new class ReplyService {
    private readonly replyRepository: Repository<Reply> = AppDataSource.getRepository(Reply)
    private readonly userRepository: Repository<User> = AppDataSource.getRepository(User)
    private readonly threadRepository: Repository<Thread> = AppDataSource.getRepository(Thread)

    async get(req: Request, res: Response): Promise<Response> {
        try {
            const replies = await this.replyRepository.find({
                relations: ["thread", "user"],
                order: {
                    id: "DESC"
                }
            })
            return res.status(200).json({ code: 200, data: replies })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error })
        }
    }


    async getId(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id)

            const reply = await this.replyRepository.findOne({
                where: { id: id },
                relations: ["thread", "user"]
            })
            return res.status(200).json({ code: 200, data: reply })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error })
        }
    }


    async create(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body

            const { error, value } = CreateReplySchema.validate(data)
            if (error) {
                return res.status(400).json({ code: 400, message: error })
                
            }

            let image = ""
            if (req.file?.filename) {
                // save to cloudinary
                image = await uploadToCloudinary(req.file);
                // delete file from local server after save to cloudinary
                deleteFile(req.file.path);
            }

            console.log(req.body)

            const user= await this.userRepository.findOne({
                where: { id: value.user },
            })

            const thread= await this.threadRepository.findOne({
                where: { id: value.thread },
            })

            const reply = this.replyRepository.create({
                image: image,
                content: value.content,
                thread: thread,
                user: res.locals.loginSession.user.id
            })

            const ThreadCreated = await this.replyRepository.save(reply)
            return res.status(200).json({ code: 200, data: ThreadCreated })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error })
        }
    }


    async update(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id)

            const reply = await this.replyRepository.findOne({
                where: { id: id },
                relations: ["thread", "user"]
            })

            if (!reply) {
                return res.status(404).json({ code: 404, message: "Reply not found" })
            }

            const data = req.body

            const { error } = UpdateReplySchema.validate(data)
            if (error) {
                return res.status(400).json({ code: 400, message: error })
            }

            if (data.content) {
                reply.content = data.content
            }
            if (data.image) {
                reply.image = data.image
            }
            if (data.thread) {
                reply.thread = data.thread
            }
            if (data.user) {
                reply.user = data.user
            }

            const replyUpdated = await this.replyRepository.save(reply)
            return res.status(200).json({ code: 200, data: replyUpdated })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error })

        }
    }


    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id)

            const reply = await this.replyRepository.findOne({
                where: { id: id },
                relations: ["thread", "user"]
            })

            if (!reply) {
                return res.status(404).json({ code: 404, message: "Reply not found" })
            }

            const replyDeleted = await this.replyRepository.remove(reply)
            return res.status(200).json({ code: 200, data: replyDeleted })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error })
        }
    }
}
