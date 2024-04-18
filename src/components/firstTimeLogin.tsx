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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useToast } from "./ui/use-toast";
import useAuth from "@/hooks/useAuth";
import { useSetFirstPasswordMutation } from "@/features/auth/authApiSlice";
import { useNavigate } from "react-router-dom";

const formSchema = z
  .object({
    newPassword: z
      .string()
      .min(5, "Password must be at least 5 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New Password and Confirm Password must match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof formSchema>;

export default function FirstTimeLogin() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const { toast } = useToast();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setPasswordVisible((prevVisible) => !prevVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
  const [setFirstPassword, { isLoading }] = useSetFirstPasswordMutation();

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      await setFirstPassword({
        ...data,
        userId,
      }).unwrap();

      navigate("/dash/payments", { replace: true });
      window.location.reload();
      // toast({
      //   title: "Success",
      //   description: "Your password has been changed successfully",
      // });
    } catch (error) {
      if (typeof error === "object" && error !== null && "data" in error) {
        const errorResponse = error as ErrorResponse;
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Error: ${errorResponse.data.message}`,
        });
      }
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
              <CardTitle className="text-2xl">First Time Login</CardTitle>
              <CardDescription>Please Update your password</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
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
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <FormLabel htmlFor="password">Password</FormLabel>
                </div>
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={
                                isConfirmPasswordVisible ? "text" : "password"
                              }
                              className="pr-6"
                              {...field}
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              onClick={toggleConfirmPasswordVisibility}
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
            </CardContent>
            <CardFooter>
              <Button disabled={isLoading} type="submit" className="w-full">
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
