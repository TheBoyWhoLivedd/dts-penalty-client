import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./features/auth/Login";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import Prefetch from "./features/auth/Prefetch";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/penaltiesConfig/Welcome";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import AddUser from "./features/users/AddUser";
import PenaltyConfigForm from "./features/penaltiesConfig/components/penaltyConfigForm";
import PenaltiesList from "./features/penaltiesConfig/PenaltiesConfigList";
import { IssuePenalty } from "./features/payments/IssuePenalty";
import EditPenaltyConfig from "./features/penaltiesConfig/EditPenaltyConfig";
import ResetPassword from "./features/auth/ResetPassword";
import ForgotPassword from "./features/auth/ForgotPassword";
import ChangePassword from "./features/auth/ChangePassword";
// import PaymentsList from "./features/payments/PaymentsList";
import PaymentDetails from "./features/payments/PaymentDetails";
import { PaymentsClient } from "./features/payments/components/client";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/reset-password/:encryptedEmail"
          element={<ResetPassword />}
        />
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
                  <Route index element={<PenaltiesList />} />
                  <Route path=":id" element={<EditPenaltyConfig />} />
                  <Route
                    path="new"
                    element={<PenaltyConfigForm initialData={null} />}
                  />
                </Route>
              </Route>
              <Route path="settings">
                <Route index element={<ChangePassword />} />
              </Route>
              <Route path="payments">
                <Route index element={<PaymentsClient />} />
                <Route path=":id" element={<PaymentDetails />} />
                <Route path="new" element={<IssuePenalty />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
