import userModel from "@/model/User"
import bcrypt from "bcryptjs"
import { dbConnect } from "@/lib/dbconnect"

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"

export async function POST(request: Request){
    await dbConnect()
    try {

        const {username,email,password}= await request.json()
        const existingUserVerifiedByUsername= await userModel.findOne({
            username,
            isVerified:true
        })

        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"Username has been already taken"
            }, {status:400})
        }
        
        const existingUserByEmail= await userModel.findOne({email})
        const verifyCode =Math.floor(100000+Math.random()*900000).toString()
        
        if (existingUserByEmail) {
                if(existingUserByEmail.isVerified){
                    return Response.json({
                        success:false,
                        message: "user already exists with this email"     
                    },{status:400})
                }else{
                    const hashedPassword= await bcrypt.hash(password,10)
                    existingUserByEmail.password= hashedPassword;
                    existingUserByEmail.verifyCode=verifyCode
                    existingUserByEmail.verifyCodeExpiry=new 
                    Date(Date.now()+3600000)
                    await existingUserByEmail.save()
                }
        }else{
            const hashedPassword = await bcrypt.hash(password,
                10)

            const expiryDate =new Date()
            expiryDate.setHours(expiryDate.getHours()+1)   

            const newUser=new userModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified:false,
                isAcceptingMessage: true,
                messages: []
            }) 
            await newUser.save()
        }
        const EmailResponse=await sendVerificationEmail(
            email,
            username,
            verifyCode,
        )
        if(!EmailResponse.success){
            return Response.json({
                success:false,
                message: EmailResponse.message        
            },{status:500})
        }
        return Response.json({
            success:true,
            message: "user registered successfully. Please check your email"      
        },{status:500})

    } catch (error) {
        console.error("Error registering user",error)
        return Response.json(
            {
                success:false,
                message:"Error registering user"
            },
            {
                status:500
            }
        )
    }
}