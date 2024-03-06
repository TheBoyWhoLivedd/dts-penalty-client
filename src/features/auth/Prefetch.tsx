import { store } from "../../app/store";
import { usersApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Prefetch = () => {
  useEffect(() => {
    console.log("subscribing");

    const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());

    return () => {
      console.log("unsubscribing");

      users.unsubscribe();
    };
  }, []);

  return <Outlet />;
};

// const Prefetch = () => {
//   useEffect(() => {
//     store.dispatch(
//       usersApiSlice.util.prefetch("getUsers", undefined, { force: true })
//     );
//     // store.dispatch(notesApiSlice.util.prefetch('getNotes', undefined, { force: true }))
//   }, []);

//   return <Outlet />;
// };
export default Prefetch;
