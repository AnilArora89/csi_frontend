import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/http/api";
import useTokenStore from "@/store";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import csiLogo from "../assets/dd.jpg";

const LoginPage = () => {
  const navigate = useNavigate();
  const setToken = useTokenStore((state) => state.setToken);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [role, setRole] = useState<string>("");

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setToken(response.data.accessToken);
      navigate("/dashboard/home");
    },
  });

  const handleLoginSubmit = () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password || !role) {
      return alert("Please enter email, password, and select a role");
    }

    mutation.mutate({ email, password, role });
  };

  return (
    <section className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="flex flex-col items-center mb-10">
        <img src={csiLogo} alt="CSI Logo" className="w-32 h-auto" />
      </div>
      <Card className="w-full max-w-sm border border-gray-300 shadow-lg rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-blue-600">
            Welcome to <span className="text-green-600">SAHAYAK</span>
          </CardTitle>
          <CardDescription className="text-center mt-2">
            Enter your Username below to login to your account. <br />
            {mutation.isError && (
              <span className="text-red-500 text-sm">
                {"Something went wrong"}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Username</Label>
            <Input
              ref={emailRef}
              id="email"
              type="email"
              placeholder="andrew-singh"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input ref={passwordRef} id="password" type="password" required />
          </div>
          <div className="grid gap-2">
            <Label>Role</Label>
            <div className="flex gap-4 items-center">
              <div className="flex items-center">
                <Input
                  type="radio"
                  id="roleAdmin"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                  className="w-4 h-4"
                />
                <Label htmlFor="roleAdmin" className="ml-2 text-sm">
                  Admin
                </Label>
              </div>
              <div className="flex items-center">
                <Input
                  type="radio"
                  id="roleStaff"
                  name="role"
                  value="staff"
                  checked={role === "staff"}
                  onChange={() => setRole("staff")}
                  className="w-4 h-4"
                />
                <Label htmlFor="roleStaff" className="ml-2 text-sm">
                  Staff
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <Button
              onClick={handleLoginSubmit}
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending && <LoaderCircle className="animate-spin" />}
              <span className="ml-2">Sign in</span>
            </Button>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link to={"/auth/register"} className="underline">
                Sign up
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
};

export default LoginPage;
