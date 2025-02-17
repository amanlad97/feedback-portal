import {z} from "zod"

export const messageSchema =z.object({
    content:z.string()
    .min(10,{message:'minimun 10 charaters message is required'})
    .max(200,{message:'maximum 200 charaters are allowed'})

})