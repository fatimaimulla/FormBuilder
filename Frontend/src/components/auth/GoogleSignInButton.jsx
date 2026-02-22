import { useEffect, useRef } from "react";

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

export default function GoogleSignInButton({ onCredential, onError, width = 300 }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      onError?.("Google sign-in is not configured. Please set VITE_GOOGLE_CLIENT_ID.");
      return undefined;
    }

    const init = async () => {
      try {
        await loadGoogleScript();
        if (!isMounted || !buttonRef.current) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (!response?.credential) {
              onError?.("Google login failed. Missing credential.");
              return;
            }
            onCredential?.(response.credential);
          },
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          width,
          text: "signin_with",
        });
      } catch {
        if (isMounted) {
          onError?.("Unable to load Google sign-in right now.");
        }
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [onCredential, onError, width]);

  return <div ref={buttonRef} />;
}
