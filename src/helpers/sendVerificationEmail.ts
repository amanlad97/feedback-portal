import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string, 
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'you@example.com',
            to: email,
            subject: 'Mystery message verification code',
            react: VerificationEmail({username,otp:verifyCode}),
          })
        return {success: true , message: 'failed to  send verification email'}        
        
    } catch (emailEroor) {
        console.error("error sending verification email",
            emailEroor
        )
        return {success: false , message: 'failed to send verification email'}        
    }
}