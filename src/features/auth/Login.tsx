import { useState } from "react";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import usePersist from "@/hooks/usePersist";
import { useLoginMutation } from "./authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";

const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: "username must be at least 1 character" }),
  password: z.string().min(1, { message: "Password is required" }),
  persist: z.boolean().default(false).optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [persist, setPersist] = usePersist();
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const [login] = useLoginMutation();

  const { toast } = useToast();
  const togglePasswordVisibility = () => {
    setPasswordVisible((prevVisible) => !prevVisible);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm<LoginFormValues>({
    defaultValues: {
      username: "rayesigwa@ura.go.ug",
      password: "12345",
      persist: persist,
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    const { username, password } = data;
    try {
      const res = await login({ username, password }).unwrap();
      dispatch(setCredentials(res));
      // console.log(res.accessToken);
      toast({
        title: "Success",
        description: "User Logged In",
        variant: "default",
      });
      navigate("/dash");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 flex justify-center items-center min-h-screen">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[500px] h-[400px]"
        >
          <Card className="mx-auto max-w-3xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Employee Login</CardTitle>
              <CardDescription>Enter Credentials</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Enter Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={isPasswordVisible ? "text" : "password"}
                              className="pr-6"
                              {...field}
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute inset-y-0 right-0 pr-2 flex items-center"
                            >
                              {isPasswordVisible ? (
                                <EyeOpenIcon />
                              ) : (
                                <EyeNoneIcon />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="persist"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            setPersist(checked);
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Trust this Device?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={isLoading} type="submit" className="w-full">
                Login
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
