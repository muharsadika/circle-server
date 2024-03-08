import * as joi from 'joi'

export const RegisterSchema = joi.object({
    full_name: joi.string(),
    username: joi.string(),
    email: joi.string(),
    password: joi.string(),
})

export const LoginSchema = joi.object({
    username: joi.string(),
    password: joi.string(),
})