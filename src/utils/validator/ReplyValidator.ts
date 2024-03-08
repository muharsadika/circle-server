import * as joi from "joi"

export const CreateReplySchema = joi.object({
    content: joi.string(),
    image: joi.string().allow("",null),
    thread: joi.number(),
    user: joi.number()
})

export const UpdateReplySchema = joi.object({
    content: joi.string(),
    image: joi.string().allow("",null),
    thread: joi.number(),
    user: joi.number()
})