import * as joi from "joi"

export const CreateLikeSchema = joi.object({
    user: joi.number(),
    thread: joi.number(),
})

export const UpdateLikeSchema = joi.object({
    user: joi.number(),
    thread: joi.number(),
})