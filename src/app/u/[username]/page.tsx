"use client";
import  { useState , useEffect } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { GemIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"


const page = () => {
  const param = useParams();
  const username = param.username;

  const [message, setMessage] = useState("");

  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [AiLoader , setAiLoader]  =useState(false)
  const [acceptMsg , setacceptMsg] = useState(true) 
  
   

  console.log(process.env.DB_PASS , "new");
  

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

   
  
  

   const Aihandler = async()=>{
     try {
      setAiLoader(true)
       const res = await axios.post('/api/suggest-message')
       if (!res.data) {
        toast({
          title: "failed",
          description: " Downtime ",
          variant: "destructive",
        });
      }
       
      const data = res.data.split('||')
      const dataedit = data.map(question => question.replace(/0:"\s?|"\s?$/, '').trim());
      
      setAiSuggestions(dataedit)
      setAiLoader(false)

     } catch (error:any) {
      setAiLoader(false)
      console.error(error)
      toast({
        title: "failed",
        description: error,
        variant: "destructive",
      });
     }
   }

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
        h-44 ">
        
        {
          AiLoader?<Skeleton className=" ml-8 w-2/3 h-24 mt-6  rounded-m" />
          :
        aiSuggestions.map((question, index)=>(
          <button className="border-2 rounded-m mt-4 ml-12 before:m-2 w-11/12" onClick={() => handleClick(question)} >
           {question}
          </button>
        ))
      }
      
          </div>

       
      </div>
    </div>
  );
};

export default page;
