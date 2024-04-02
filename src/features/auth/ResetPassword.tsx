import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast"; // Assuming this is accessible
import { Input } from "@/components/ui/input"; // Assuming this is accessible
import { Button } from "@/components/ui/button"; // Assuming this is accessible

function ResetPassword() {
  const { encryptedEmail } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [authState, setAuthState] = useState({
    password: "",
    cpassword: "",
  });
  const [loading, setLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const signature = queryParams.get("signature");
  // console.log("email: ", encryptedEmail, "signature: ", signature);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (authState.password !== authState.cpassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3500";

    try {
      const response = await fetch(`${apiUrl}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          encryptedEmail: encryptedEmail,
          signature: signature,
          password: authState.password,
          password_confirmation: authState.cpassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.message || "An error occurred. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: data.message,
          variant: "default",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="w-[500px] p-5 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold">Reset Password?</h1>
          <form onSubmit={submit}>
            {/* Password Input */}
            <div className="mt-5">
              <label className="block">Password</label>
              <Input
                type="password"
                placeholder="Enter your new password"
                className="w-full h-10 p-2 border rounded-md outline-red-400"
                onChange={(event) =>
                  setAuthState({ ...authState, password: event.target.value })
                }
              />
            </div>
            {/* Confirm Password Input */}
            <div className="mt-5">
              <label className="block">Confirm Password</label>
              <Input
                type="password"
                placeholder="Confirm your new password"
                className="w-full h-10 p-2 border rounded-md outline-red-400"
                onChange={(event) =>
                  setAuthState({ ...authState, cpassword: event.target.value })
                }
              />
            </div>
            {/* Submit Button */}
            <div className="mt-5">
              <Button className="w-full" disabled={loading}>
                {loading ? "Processing.." : "Submit"}
              </Button>
            </div>
            {/* Link to Login (Adjust as necessary) */}
            <div className="mt-5 text-center">
              <button onClick={() => navigate("/")} className="text-orange-400">
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
