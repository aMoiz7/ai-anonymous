import { dbconnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import z from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";

const UsernameQueryschmea = z.object({
  username: userNameValidation,
});

export async function POST(request: Request) {
  await dbconnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    //validate with zod

    const result = UsernameQueryschmea.safeParse(queryParam);

    if(!result.success){
        const usernameErrors = result.error.format().username?._errors || []

        return Response.json({
            success:false,
            message: usernameErrors?.length>0?usernameErrors.join(','):"invalid query perameter"
        },{
            status:400
        })
    }

      
    const {username} = result.data
    
   const existingVUser =  await UserModel.findOne({username , isVerified:true})

   if(existingVUser){
      
    return Response.json({
        success:false,
        message: "username is already taken"
    },{
        status:400
    })
   }

   
   return Response.json({
    success:true,
    message:"username is unique"
},{
    status:200
})

  } catch (error) {
    console.error("error in checking username ");
    return Response.json(
      {
        success: false,
        message: "Error in username checking ",
      },
      {
        status: 500,
      }
    );
  }
}
