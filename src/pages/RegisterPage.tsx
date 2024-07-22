import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { register } from "@/http/api";
import csiLogo from "../assets/dd.jpg";

const RegisterPage = () => {
  const navigate = useNavigate();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [selectedRole, setSelectedRole] = useState<string>("staff");

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      console.log("Successfully registered");
      navigate("/auth/login");
    },
  });

  const handleRegisterSubmit = () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const name = nameRef.current?.value;

    if (!name || !email || !password) {
      return alert("Please enter name, email, and password");
    }

    mutation.mutate({ name, email, password, role: selectedRole });
  };

  return (
    <section className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="flex flex-col items-center mb-10">
        <img src={csiLogo} alt="CSI Logo" className="w-32 h-auto" />
      </div>
      <Card className="w-full max-w-sm border border-gray-300 shadow-lg rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-blue-600">
            Welcome to <span className="text-green-600">Sahayak</span>
          </CardTitle>
          <CardDescription className="text-center mt-2">
            Enter your information to create an account <br />
            {mutation.isError && (
              <span className="text-red-500 text-sm">
                {mutation.error.message}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input ref={nameRef} id="name" placeholder="Andrew" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                ref={emailRef}
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
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                className="border border-gray-300 rounded px-2 py-1"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <Button
              onClick={handleRegisterSubmit}
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending && <LoaderCircle className="animate-spin" />}
              <span className="ml-2">Create an account</span>
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to={"/auth/login"} className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default RegisterPage;
