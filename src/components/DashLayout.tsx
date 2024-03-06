import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import Sidebar from "./Sidebar";

const DashLayout = () => {
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:block h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <div className="md:pl-56 pt-[90px] h-full px-4 md:px-7">
        <Outlet />
      </div>
    </div>
  );
};

export default DashLayout;
