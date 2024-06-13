import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation } from "@tanstack/react-query"
import { Link , useNavigate} from "react-router-dom"
import { useRef } from "react"
import { Loader } from "lucide-react"
import { register } from "@/http/api"

const RegisterPage = () => {

  const navigate = useNavigate();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn : register,
    onSuccess: () =>{
      console.log("Successfully registered");
      navigate('/auth/login');
    }
    
  })

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account <br/>
          {mutation.isError && <span className='text-red-500 text-small'> {mutation.error.message} </span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input ref = {nameRef} id="name" placeholder="Andrew" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              ref = {emailRef}
              id="email"
              type="email"
              placeholder="m@example.com"
              required 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input ref={passwordRef} id="password" type="password" />
          </div>
          <Button type="submit" className="w-full">
            {mutation.isPending && <Loader className="animate-spin"/>}
            Create an account
          </Button>
          
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to={'/auth/login'} className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}

export default RegisterPage
