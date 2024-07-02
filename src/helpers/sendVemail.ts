import { resend } from "@/lib/resend";
import { Apires } from "@/types/Apires";
import VerificationEmail from "../../emails/Vemail";

export async function sendVerificationEmail
(
    email :string,
    username:string,
    verifyCode: string
):Promise<Apires>{
 try {
     //@ts-ignore
    await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: ' Mystry message',
        react: VerificationEmail({ username  ,otp : verifyCode }),
      });
    
    return{success:true , message:"email send "} 

    
 } catch (emailerror) {
   console.error("error emil" , emailerror) 
   return{success:false , message:"fail in email"} 
 }
}