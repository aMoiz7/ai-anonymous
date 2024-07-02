
import { dbconnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import z from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";


export async  function POST(req : Request){
  await  dbconnect()
  try {
    
   const {username , code} = await req.json()
   const decodedusername =  decodeURIComponent(username)
   //@ts-ignore
   const user = await UserModel.findOne({username:decodedusername})


   if(!user){
     return Response.json({
        success: false,
        message : "User not found"
     },{status:500})
   }

    const isCodeValid = user.
    verifyCode===code
    
    console.log(user.
      verifyCode)
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

    if(isCodeValid && isCodeNotExpired){
          user.isVerified =true
          await user.save();

          return Response.json({
            success: true,
            message : "verifiedsuccessfull "
         },{status:200}) 
    }else if(!isCodeNotExpired){
        return Response.json({
            success: false,
            message : "verification code is expired signup for new code"
         },{status:401})
    }
    else{
        return Response.json({
            success: false,
            message : "Incorrect verification code "
         },{status:401})
    }

    

  } catch (error) {
     console.error("")
     return Response.json({
        success: false,
        message : "Error checking username"
     },{status:401})
  }
} 