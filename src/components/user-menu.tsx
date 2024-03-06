"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "@/features/auth/authApiSlice";
import useAuth from "@/hooks/useAuth";

export function UserMenu() {
  const { userName, status } = useAuth();
  const navigate = useNavigate();

  const [sendLogout] = useSendLogoutMutation();
  const handleSignOut = async () => {
    try {
      await sendLogout({}).unwrap();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className=" h-13 flex items-center space-x-2 "
        >
          <Avatar className="shrink-0">
            {/* <AvatarImage
              src={session?.user?.avatar as string}
              alt={`${session?.user?.name}'s avatar`}
            /> */}
            <AvatarFallback delayMs={600}>RA</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-start">
            <span className="font-medium">{userName}</span>
            <span className="font-semibold">{status}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuItem>
          <Link to="/dashboard/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            handleSignOut();
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
