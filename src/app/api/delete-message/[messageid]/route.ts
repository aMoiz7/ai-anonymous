import { dbconnect } from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { UserModel } from "@/models/User";



export async function DELETE (req : Request , {params} :{params:{messageid : string}}){
    const messageId = params.messageid
    await dbconnect()


    const session =await getServerSession(authOptions)
    const user :User = session?.user as User

    if(!session || !session.user){
         return Response.json({
            success:false,
            message :"Not Authenticated"
         },
         {
            status :401
         }
        )
    }
    
    try {
      const updateResult = await UserModel.updateOne(
            {_id:user._id},
            {$pull :{message:{_id: messageId}}}
        )
  

        if(updateResult.modifiedCount == 0 ){
            return Response.json({
                success:false,
                message :"Message not found "
             },
             {
                status :404
             }
            )
        }


        return Response.json({
            success:true,
            message :"Message deleted"
         },
         {
            status :200
         }
        )
    } catch (error) {
        console.log("error in delete Route " , error)
        return Response.json({
            success:false,
            message :error
         },
         {
            status :500
         }
        )
    }
}