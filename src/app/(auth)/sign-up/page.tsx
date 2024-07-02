'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { use, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"   
import { useDebounceCallback } from "usehooks-ts";
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation';

const SignUpPage = () => {

  const [username , setusername] = useState('')
  const [usernameMessage , setusernameMessage] = useState('')
  const [loader , setLoader] = useState(false)

  const [issubmiting , setIssubmiting] = useState(false)

  const Debounce = useDebounceCallback(setusername , 3000)
  const {toast} = useToast()
  const router = useRouter()

  const form = useForm({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:"",
      email:"",
      password:""
    }
  })


  useEffect(() => {
    const usernameCheckUnique = async()=>{
    if(username){
      setLoader(true)
      setusernameMessage("");
      try {
        
        
          const res = await axios.post(`/api/check-unique-username?username=${username}`)

          setusernameMessage(res.data.message)
         


      } catch (error:any) {
         const axiosError = error as AxiosError
         //@ts-ignore
         setusernameMessage(axiosError.response?.data.message || "error in checking username")
      }finally{
        setLoader(false)
      }


    }
    }
   usernameCheckUnique()
  }, [username])
  
  console.log(usernameMessage)
  const onSubmit = async(data :z.infer<typeof signUpSchema>)=>{
         setIssubmiting(true)
         try{
             const res = await axios.post('/api/sign-up' ,data)
             toast({
                   title: 'success',
                   description:res.data.message

             })

             router.replace(`/verify/${username}`)
             setIssubmiting(false)
         }catch(error:any){
           console.error(error , "error in signup")
           toast({
            title:"fail",
            description:error
           })
         }
  }

  return (

    <div className=" flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg sahdow-md">

        <div className="text-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6"> Join Mystery Message</h1>
        <p className="mb-4">Sign up to start your anonymous </p>
        </div>

        <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
           <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} onChange={(e)=>{
                  field.onChange(e)
                  Debounce(e.target.value)
                   }} />

                  
              </FormControl>
              {loader && <Loader2 className='animate-spin'/>}
              <p className={`text-sm ${usernameMessage === 'username is unique' ? 'text-green-500' :' text-orange-600'}`}>
                {usernameMessage}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />


<FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field}  />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field}  />
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={issubmiting}>{issubmiting?(<> <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait</>):('Sign up')}</Button>
           </form>

        </Form>
        <p>Not a member yet ? 
          <a  href="/sign-in" className='pl-2 font-semibold text-blue-600 hover:underline'>Sign In</a>
        </p>

      </div>
      
      </div>

  )
}

export default SignUpPage