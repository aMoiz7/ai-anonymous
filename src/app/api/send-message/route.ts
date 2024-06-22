import { Message } from "@/models/User";
import { UserModel } from "@/models/User";
import { dbconnect } from "@/lib/dbConnect";


export async function POST(req:Request) {
    await dbconnect()

   const {username , content}= await req.json()

   try {
    const user = await UserModel.findOne({username})

    if(!user){
        return Response.json({
            success :false , 
            message:"user not found"
        },{status :404 })
    }

    if(!user.isAcceptingMessage){
        return Response.json({
            success :false , 
            message:"user not accepting msg "
        },{status :403 })
    }
      
    const newMessage ={content , createdAt: new Date()}
    user.messages.push(newMessage) as Message
     await user.save()

  
        return Response.json({
            success :true , 
            message:"message send successfully"
        },{status :200 })
    


   } catch (error) {
    
        return Response.json({
            success :false , 
            message:error
        },{status :404 })
    }
   
}