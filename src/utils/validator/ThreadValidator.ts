import * as joi from "joi"

export const CreateThreadSchema = joi.object({
    content: joi.string(),
    image: joi.string().allow("",null),
    user: joi.number()
})

export const UpdateThreadSchema = joi.object({
    content: joi.string(),
    image: joi.string().allow("",null),
    user: joi.number()
})