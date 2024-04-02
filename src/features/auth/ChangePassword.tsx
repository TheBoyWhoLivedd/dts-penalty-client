import React from "react";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useChangePasswordMutation } from "./authApiSlice";
import useAuth from "@/hooks/useAuth";
import { ReloadIcon } from "@radix-ui/react-icons";

const formSchema = z
  .object({
    oldPassword: z.string().min(1, "Old Password is required"),
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

const ChangePassword: React.FC = () => {
  const { toast } = useToast();
  const { userId } = useAuth();
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      await changePassword({
        ...data,
        userId,
      }).unwrap();

      toast({
        title: "Success",
        description: "Your password has been changed successfully",
      });
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <div className="md:grid md:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter Old Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter New Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={isLoading} className="ml-auto" type="submit">
          {isLoading ? (
            <ReloadIcon className="mr-2 w-4 h-4 animate-spin" />
          ) : null}
          Change Password
        </Button>
      </form>
    </Form>
  );
};

export default ChangePassword;
