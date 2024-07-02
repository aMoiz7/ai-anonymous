"use client";
import  { useState , useEffect } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { GemIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"
import { useCompletion } from 'ai/react'


const User = () => {
  const param = useParams();
  const username = param.username;

  const [message, setMessage] = useState("");

  const [acceptMsg , setacceptMsg] = useState(true) 
  
   

 
  

  const { toast } = useToast();


  const checkUserAcceptingmsg =async()=>{
   
    const res = await axios.get('/api/accept-message')

    setacceptMsg(res.data.isAcceptingMessage)

  }

  const handleSubmit = async () => {
    if(!acceptMsg){
      toast({
        title: "failed",
        description: "user not accepting new messages",
        variant: "destructive",
      });
    }else{
      const res = await axios.post("/api/send-message", {
        username,
        content: message,
      });
  
      if (!res.data) {
        toast({
          title: "failed",
          description: "sending failed",
          variant: "destructive",
        });
      }
  
      toast({
        title: "success",
        description: " message send ",
      });
    }
    
  };


  const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};
   
  const {completion , complete , error , isLoading}= useCompletion({
    api:"/api/suggest-message",
    
  })



  
  const Aihandler = async () => {
    try {
      complete('');
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Handle error appropriately
    }
  };



   useEffect(() => {
    checkUserAcceptingmsg()
    Aihandler()
  }, [])

   const handleClick = async(question :string)=>{
       setMessage(question)
   }

  return (
    <div>
      <h1 className=" flex justify-center items-center mt-10 text-3xl font-extrabold ">
        Public Profile Link
      </h1>
      <div className="flex flex-col ml-32 mr-32  mt-10 ">
        <span className="    text-s   ">
          Send anonymous messages to @{`${username}`}{" "}
        </span>
        <Input
          className="w-11/12 mt-4"
          value={message}
          type="text"
          placeholder={` write your anonymous message to ${username}`}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          className="  w-20 align-middle justify-center mt-4  "
          onClick={handleSubmit}
        >
          Send
        </Button>
      </div>


      <div className="flex flex-col ml-32 mr-32  mt-10 ">
      
     

      <Button
          className=" gap-4 w-44 align-middle justify-center mt-4  "
          onClick={Aihandler}
        >
          Suggestions

          <GemIcon className="text-l text-orange-600"/>
        </Button>
        <span className="text-s">
          click on any message bellow to select it.
        </span>
        <div className="  border-gray-300 rounded-lg border-4 
        h-44 md:border-0 sm:border-0 flex flex-wrap">
        
        {
          isLoading?<Skeleton className=" ml-8 w-2/3 h-24 mt-6  rounded-m" />
          :
          parseStringMessages(completion).map((question ,i)=>(
          <button className="border-2 rounded-m mt-4 ml-12  w-11/12   " key={i} onClick={() => handleClick(question)} >
           {question}
          </button>
        ))
      }
      
          </div>

       
      </div>
    </div>
  );
};

export default User;
