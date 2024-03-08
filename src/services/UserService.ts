import { Request, Response } from "express"
import { Repository } from "typeorm"
import { AppDataSource } from "../data-source"

import { User } from "../entities/User"
import { Thread } from "../entities/Thread"
import { Reply } from "../entities/Reply"
import { Like } from "../entities/Like"

import { CreateUserSchema, UpdateUserSchema } from "../utils/validator/UserValidator"
import { uploadToCloudinary } from "../utils/Cloudinary"
import { deleteFile } from "../utils/FileHelper"



export default new class UserService {
    private readonly userRepository: Repository<User> = AppDataSource.getRepository(User)

    async get(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this.userRepository.find({
                relations: ["threads", "replies", "likes", "following", "followers"],
            })

            return res.status(200).json({ code: 200, data: users })

        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error })
        }
    }


    async getId(req: Request, res: Response): Promise<Response> {
        try {
            const id = res.locals.loginSession.user.id

            const user = await this.userRepository.findOne({
                where: { id: id },
                relations: ["threads", "replies", "likes", "following", "followers"],
            })

            // if (!user) {
            //     return res.status(404).json({ code: 404, message: "User not found" })
            // }
            return res.status(200).json({ code: 200, data: user })
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error })
        }
    }


    async create(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body;

            // Validate input #START
            const { error } = CreateUserSchema.validate(data);
            if (error) {
                return res.status(400).json({ code: 400, message: error });
            }
            // Validate input #END

            // Cek apakah username atau email sudah terdaftar #START
            const existingUser = await this.userRepository.findOne({
                where: [{ username: data.username }, { email: data.email }]
            });

            if (existingUser) {
                return res.status(400).json({ code: 400, message: "User already exists" });
            }
            // Cek apakah username atau email sudah terdaftar #END

            const user = this.userRepository.create({
                username: data.username,
                full_name: data.full_name,
                email: data.email,
                password: data.password,
                profile_picture: data.profile_picture,
                bio: data.bio,
            })

            const UserSaved = await this.userRepository.save(user)
            return res.status(200).json({ code: 200, message: "User created", data: UserSaved })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error })
        }
    }


    async update(req: Request, res: Response): Promise<Response> {
        try {
            const id = res.locals.loginSession.user.id

            const user = await this.userRepository.findOne({
                where: { id: id },
            })
            if (!user) {
                return res.status(404).json({ code: 404, message: "User not found" });
            }

            const data = req.body;

            const { error } = UpdateUserSchema.validate(data);
            if (error) {
                return res.status(400).json({ code: 400, message: error });
            }

            let { username, full_name, email, password, bio, profile_picture } = req.body
            // let profile_picture = ""                                                
            if (req.file?.filename) {
                // save to cloudinary
                profile_picture = await uploadToCloudinary(req.file);
                // delete file from local server after save to cloudinary
                deleteFile(req.file.path);
            }
            if(username) user.username = username;
            if(full_name) user.full_name = full_name;
            if(email) user.email = email;
            if(password) user.password = password;
            if(profile_picture) user.profile_picture = profile_picture;
            if(bio) user.bio = bio

            const UserUpdated = await this.userRepository.save(user)
            return res.status(200).json({ code: 200, message: "User updated", user: UserUpdated })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error })
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);

            const user = await this.userRepository.findOne({
                where: { id: id },
                relations: ["threads", "replies", "likes"]
            })

            if (!user) {
                return res.status(404).json({ code: 404, message: "User not found" })
            }

            const UserDeleted = await this.userRepository.remove(user)
            return res.status(200).json({ code: 200, message: "User deleted", user: UserDeleted })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ code: 500, message: error })
        }
    }
}
