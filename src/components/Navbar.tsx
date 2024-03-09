// import { ModeToggle } from "./mode-toggle";
import { UserMenu } from "./user-menu";
import { Link } from "react-router-dom";
import { MobileSidebar } from "./mobile-sidebar";
// import { CompanyIcon } from "./icons/company-icon";

export const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center shadow-sm backdrop-blur">
      <MobileSidebar />
      <div>
        <Link
          to="/dash"
          className="flex items-center gap-2 pl-1 md:pl-0"
        >
          {/* <CompanyIcon /> */}
          {/* <span className="text-2xl font-bold tracking-tight">PENALTIES</span> */}
          <img src="/URA-logo-1.png" width={100} height={100} />
        </Link>
      </div>
      <div className=" ml-auto flex gap-3  items-center">
        {/* {!userId && (
          <Link href="/sign-in">
            <Button variant="ghost">Login</Button>
          </Link>
        )}
        {userId && (
          <Link href="/admin/partners">
            <Button variant="ghost">Dashboard</Button>
          </Link>
        )} */}
        {/* <ModeToggle /> */}
        <UserMenu />
      </div>
    </div>
  );
};
