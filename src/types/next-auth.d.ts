import  "next-auth";

declare module 'next-auth'{
   interface User{
      _id?:string;
      isVerified?:boolean;
      isAcceptingMessage ?:boolean;
      username?:string
   }

   interface session{
  User:{
    _id?:string;
    isVerified?:boolean;
    isAcceptingMessage ?:boolean;
    username?:string
  }  
 }
}

