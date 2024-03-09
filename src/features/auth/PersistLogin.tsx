import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        console.log("verifying refresh token");
        try {
          await refresh({});
          setTrueSuccess(true);
        } catch (err) {
          console.error(err);
        }
      };

      if (!token && persist) verifyRefreshToken();
    }

    return () => {
      effectRan.current = true;
    };

    // eslint-disable-next-line
  }, []);

  if (isLoading) return <p>Loading...</p>;

  if (!persist || (token && isUninitialized) || (isSuccess && trueSuccess))
    return <Outlet />;

  if (isError) {
    console.log("error");

    let errorMessage = "An error occurred";

    if (error && "status" in error) {
      const fetchError = error as FetchBaseQueryError;
      if (
        fetchError.data &&
        typeof fetchError.data === "object" &&
        "message" in fetchError.data
      ) {
        errorMessage = (fetchError.data as { message: string }).message;
      }
    }

    return (
      <p className="text-red-500">
        {errorMessage} <Link to="/login">Please login again</Link>.
      </p>
    );
  }
};

export default PersistLogin;
