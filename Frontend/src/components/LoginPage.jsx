import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../lib/apiClient";
import { useAuth } from "../auth/AuthContext";

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);
    if (existing) {
      if (window.google?.accounts?.id) {
        resolve();
      } else {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("Failed to load Google script")), {
          once: true,
        });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google script"));
    document.head.appendChild(script);
  });
}

export default function LoginPage() {
  const googleButtonRef = useRef(null);
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

  useEffect(() => {
    let isMounted = true;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setError("Google sign-in is not configured. Please set VITE_GOOGLE_CLIENT_ID.");
      return undefined;
    }

    const initializeGoogle = async () => {
      try {
        await loadGoogleScript();
        if (!isMounted || !googleButtonRef.current) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (!response?.credential) {
              setError("Google login failed. Missing credential.");
              return;
            }

            setLoading(true);
            setError("");

            try {
              const result = await apiClient.post("/auth/google", {
                idToken: response.credential,
              });

              const accessToken = result?.data?.data?.accessToken;
              const user = result?.data?.data?.user;

              if (!accessToken || !user) {
                throw new Error("Invalid login response");
              }

              setSession({ accessToken, user });
              navigate(redirectTo, { replace: true });
            } catch (err) {
              setError("Could not complete sign-in. Please try again.");
            } finally {
              setLoading(false);
            }
          },
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          width: 300,
          text: "signin_with",
        });
      } catch (err) {
        if (isMounted) {
          setError("Unable to load Google sign-in right now.");
        }
      }
    };

    initializeGoogle();

    return () => {
      isMounted = false;
    };
  }, [navigate, redirectTo, setSession]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Creator Login</h1>
        <p className="text-sm text-gray-600 mt-2">
          Sign in with Google to build forms, manage published forms, and view responses.
        </p>

        <div className="mt-6 flex justify-center">
          <div ref={googleButtonRef} />
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
