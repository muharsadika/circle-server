import { Request, Response } from "express"
import { Repository } from "typeorm"
import { AppDataSource } from "../data-source"

import { User } from "../entities/User"
import { Thread } from "../entities/Thread"
import { Reply } from "../entities/Reply"
import { Like } from "../entities/Like"

import { CreateThreadSchema, UpdateThreadSchema } from "../utils/validator/ThreadValidator"
// const cloudinary = require("cloudinary").v2
import { v2 as cloudinary } from "cloudinary"
import 'dotenv/config'
import { uploadToCloudinary } from "../utils/Cloudinary"
import { deleteFile } from "../utils/FileHelper"

export default new class ThreadService {
    private readonly threadRepository: Repository<Thread> = AppDataSource.getRepository(Thread)
    private readonly userRepository: Repository<User> = AppDataSource.getRepository(User)

    async get(req: Request, res: Response): Promise<Response> {
        try {
            const threads = await this.threadRepository.find({
                relations: [
                    "user",
                    "replies",
                    "likes",
                    "replies.user",
                    "likes.user"
                ],
                order: {
                    id: "DESC"
                }
            })

            // let newResponse = []
            // threads.forEach((data) => {
            //     newResponse.push({
            //         ...data,
            //         likes_count: Math.floor(Math.random() * 10),
            //         replies_count: Math.floor(Math.random() * 10),
            //     })dsds
            // })
            return res.status(200).json({ code: 200, data: threads })
            // return res.status(200).json(threads)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error })
        }
    }


    async getId(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id)

            const thread = await this.threadRepository.findOne({
                where: { id: id },
                relations: ["user", "replies", "likes", "replies.user", "likes.user"],
                order: { id: "DESC" }
            })

            return res.status(200).json({ code: 200, data: thread })
            // return res.status(200).json(thread)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error })
        }
    }


    async create(req: Request, res: Response): Promise<Response> {
        try {
            let image = ""
            if (req.file?.filename) {
                // save to cloudinary
                image = await uploadToCloudinary(req.file);
                // delete file from local server after save to cloudinary
                deleteFile(req.file.path);
            }

            const data = {
                content: req.body.content,
                image: image,
                user: res.locals.loginSession.user.id
            };
            console.log(data)

            const { value, error } = CreateThreadSchema.validate(data);
            if (error) {
                return res.status(400).json({ code: 400, message: error });
            }

            // cloudinary.config({
            //     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            //     api_key: process.env.CLOUDINARY_API_KEY,
            //     api_secret: process.env.CLOUDINARY_API_SECRET
            // })

            // const CloudUpload = await cloudinary.uploader.upload(data.image, {
            //     folder: "thread"
            // })



            const thread = this.threadRepository.create({
                content: data.content,
                image: data.image,
                user: data.user
            })

            const ThreadCreated = await this.threadRepository.save(thread)
            return res.status(200).json({ code: 200, data: ThreadCreated })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error })
        }
    }


    // async update(req: Request, res: Response): Promise<Response> {
    //     try {
    //         const id = parseInt(req.params.id);

    //         const thread = await this.threadRepository.findOne({ where: { id: id } })
    //         if (!thread) {
    //             return res.status(404).json({ code: 404, message: "Thread not found" })
    //         }

    //         const data = req.body;

    //         const { error } = UpdateThreadSchema.validate(data);
    //         if (error) {
    //             return res.status(400).json({ code: 400, message: error });
    //         }

    //         if (data.content) {
    //             thread.content = data.content;
    //         }
    //         if (data.image) {
    //             thread.image = data.image;
    //         }
    //         if (data.user) {
    //             thread.user = data.user;
    //         }

    //         // await this.threadRepository.save(thread)
    //         const ThreadUpdated = await this.threadRepository.save(thread)
    //         return res.status(200).json({ code: 200, data: ThreadUpdated })

    //     } catch (error) {
    //         console.log(error)
    //         return res.status(500).json({ code: 500, message: error })
    //     }
    // }


    async update(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);

            const thread = await this.threadRepository.findOne({ where: { id: id } })
            if (!thread) {
                return res.status(404).json({ code: 404, message: "Thread not found" })
            }

            const data = req.body;

            const { error } = UpdateThreadSchema.validate(data);
            if (error) {
                return res.status(400).json({ code: 400, message: error });
            }

            // Check if there is an uploaded image
            if (req.file?.filename) {
                // Upload the new image to Cloudinary
                const newImage = await uploadToCloudinary(req.file);

                // Delete the old image from Cloudinary (if it exists)
                if (thread.image) {
                    await deleteFile(thread.image);
                }

                // Update the image field in the thread entity
                thread.image = newImage;
            }

            if (data.content) {
                thread.content = data.content;
            }
            if (data.user) {
                thread.user = data.user;
            }

            const ThreadUpdated = await this.threadRepository.save(thread)
            return res.status(200).json({ code: 200, data: ThreadUpdated })

        } catch (error) {
            console.log(error);
            return res.status(500).json({ code: 500, message: error });
        }
    }


    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);

            const thread = await this.threadRepository.findOne({
                where: { id: id },
                relations: ["user"]
            })

            if (!thread) {
                return res.status(404).json({ code: 404, message: "Thread not found" })
            }

            const ThreadDeleted = await this.threadRepository.remove(thread)
            return res.status(200).json({ code: 200, thread: ThreadDeleted })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error })
        }
    }
}