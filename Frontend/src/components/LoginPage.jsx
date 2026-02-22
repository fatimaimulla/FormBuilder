import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../lib/apiClient";
import { useAuth } from "../auth/AuthContext";
import GoogleSignInButton from "./auth/GoogleSignInButton";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession, isAuthenticated } = useAuth();

  const redirectTo = useMemo(() => {
    return location.state?.from?.pathname || "/build-forms";
  }, [location.state]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleCredential = async (idToken) => {
    setLoading(true);
    setError("");
    try {
      const result = await apiClient.post("/auth/google", { idToken });
      const accessToken = result?.data?.data?.accessToken;
      const user = result?.data?.data?.user;
      if (!accessToken || !user) {
        throw new Error("Invalid login response");
      }

      setSession({ accessToken, user });
      navigate(redirectTo, { replace: true });
    } catch {
      setError("Could not complete sign-in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Creator Login</h1>
        <p className="text-sm text-gray-600 mt-2">
          Sign in with Google to build forms, manage published forms, and view responses.
        </p>

        <div className="mt-6 flex justify-center">
          <GoogleSignInButton
            onCredential={handleCredential}
            onError={(message) => setError(message)}
            width={300}
          />
        </div>

        {loading && (
          <p className="mt-4 text-sm text-center text-gray-600">Signing you in...</p>
        )}

        {error && (
          <p className="mt-4 text-sm text-center text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}
