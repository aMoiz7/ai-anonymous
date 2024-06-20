import  "next-auth";

declare module 'next-auth'{
   interface User{
      _id?:string;
      isVerified?:boolean;
      isAcceptingMessage ?:boolean;
      username?:string
   }

   interface sesscion{
  User:{
    _id?:string;
    isVerified?:boolean;
    isAcceptingMessage ?:boolean;
    username?:string
  }  
 }
}

