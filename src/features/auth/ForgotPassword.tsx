import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPassword() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  // const [errors, setErrors] = useState<LoginErrorType | undefined>();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3500";

    fetch(`${apiUrl}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then(async (response) => {
        const data = await response.json();
        setLoading(false);

        if (response.ok) {
          toast({
            title: "Success",
            description: data.message,
            variant: "default",
          });
        } else {
          // console.log(data)
          toast({
            title: "Uh Oh! Something went wrong!",
            description: data.message,
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("The error is", error);
      });
  };

  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="w-[500px] p-5 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold">Forgot Password?</h1>
          <p>
            Don't worry it happens. Just enter your email below and we will send
            a reset token.
          </p>
          <form onSubmit={submit}>
            <div className="mt-5">
              <label className="block">Email</label>
              <Input
                type="email"
                placeholder="example@gmail.com"
                className="w-full h-10 p-2 border rounded-md outline-red-400"
                onChange={(event) => setEmail(event.target.value)}
              />
              {/* <span className="text-red-500">{errors?.email}</span> */}
            </div>
            <div className="mt-5">
              <Button className="w-full" disabled={loading}>
                {loading ? "Processing" : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
