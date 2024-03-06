import { Route, Routes } from "react-router-dom";
// import { PenaltyForm } from "./components/penaltyForm";
import Layout from "./components/Layout";
import Login from "./features/auth/Login";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import Prefetch from "./features/auth/Prefetch";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/penalties/Welcome";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import AddUser from "./features/users/AddUser";
import PenaltyConfigForm from "./features/penalties/components/penaltyConfigForm";
import { PenaltyForm } from "./components/penaltyForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Login />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/reset-password/:encryptedEmail"
          element={<ResetPassword />}
        /> */}
      </Route>
      {/* protected routes */}
      <Route element={<PersistLogin />}>
        <Route
          element={
            <RequireAuth
              allowedRoles={[ROLES.Admin, ROLES.Supervisor, ROLES.Employee]}
            />
          }
        >
          <Route element={<Prefetch />}>
            <Route path="dash" element={<DashLayout />}>
              <Route index element={<Welcome />} />
              <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                <Route path="users">
                  <Route index element={<UsersList />} />
                  <Route path=":id" element={<EditUser />} />
                  <Route path="new" element={<AddUser />} />
                </Route>
                <Route path="penalties">
                  {/* <Route index element={<UsersList />} />
                  <Route path=":id" element={<EditUser />} /> */}
                  <Route path="new" element={<PenaltyConfigForm />} />
                </Route>
                <Route path="projects">
                  {/* <Route index element={<UsersList />} />
                  <Route path=":id" element={<EditUser />} /> */}
                  <Route path="new" element={<PenaltyForm />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
      {/* <main className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 lg:px-24 bg-custom-gradient">
        <PenaltyForm />
      
      </main> */}
    </Routes>
  );
}

export default App;
