import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useMutation } from '@tanstack/react-query'
import { login } from '@/http/api'
import { Loader } from 'lucide-react'
import useTokenStore from '@/store'
const LoginPage = () => {
    const navigate = useNavigate();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const setToken = useTokenStore((state) => state.setToken);

    // to send data to server we use mutation
    const mutation = useMutation({
      mutationFn: login,
      onSuccess: (response) =>{
        console.log('login success');
        //before login we will need to store token also

        setToken(response.data.token);

        //here after a successful login we redirect to home page
        //in router dom we have a hook called useNavigate
        navigate('/dashboard/home');
      }
    })



    const handleLoginSubmit = () => {
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        console.log('data', { email, password });
        
        if (!email || !password) {
          return alert('Please enter email and password');
        }

        mutation.mutate({ email, password });

        
    }

    return (
        <div className='flex justify-center items-center h-screen'>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account <br/>
                        {mutation.isError && <span className='text-red-500 text-small'>{mutation.error.message}</span>}
                    </CardDescription>


                </CardHeader> 
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input ref={emailRef} id="email" type="email" placeholder="Enter your Email (e.g., Andrew@gmail.com)" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input ref={passwordRef} id="password" type="password" required />
                    </div>
                </CardContent>
                <CardFooter>
                    <div className='w-full'>
                        <Button onClick={handleLoginSubmit} className="w-full" disabled={mutation.isPending}>
                          {/*added the loading function*/}
                          {mutation.isPending && <Loader className='animate-spin'/>}
                          <span>Sign in</span>
                        </Button>
                        <div className="mt-4 text-center text-sm">
                            Don't have an account?{" "}
                            <Link to={'/register'} className="underline">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default LoginPage
