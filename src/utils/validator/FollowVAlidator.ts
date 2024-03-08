import * as joi from 'joi'

export const FollowSchema = joi.object({
    user_id: joi.number(),
})