import { HamburgerMenuIcon } from "@radix-ui/react-icons";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition z-10">
        <HamburgerMenuIcon />
      </SheetTrigger>
      <SheetContent side="left" className=" w-[200px] p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
