import * as joi from "joi"

export const CreateUserSchema = joi.object({
    username: joi.string(),
    full_name: joi.string(),
    email: joi.string(),
    password: joi.string(),
    profile_picture: joi.string(),
    bio: joi.string()
})

export const UpdateUserSchema = joi.object({
    username: joi.string(),
    full_name: joi.string(),
    email: joi.string(),
    password: joi.string(),
    profile_picture: joi.string(),
    bio: joi.string()
})