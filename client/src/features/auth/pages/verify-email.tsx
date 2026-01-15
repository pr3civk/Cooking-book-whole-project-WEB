import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { APP_ROUTES } from "@/utils/route";
import { CheckCircle, XCircle } from "lucide-react";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const verificationUrl = searchParams.get("url");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">(() => {
    return verificationUrl ? "loading" : "error";
  });
  const [errorMessage, setErrorMessage] = useState(() => {
    return verificationUrl ? "" : "Invalid verification link";
  });

  useEffect(() => {
    if (!verificationUrl) {
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(verificationUrl, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok || response.redirected) {
          setStatus("success");
          // Redirect to sign-in after 2 seconds
          setTimeout(() => {
            navigate(`${APP_ROUTES.SIGN_IN}?verified=1`, { replace: true });
          }, 2000);
        } else {
          const data = await response.json().catch(() => ({}));
          setStatus("error");
          setErrorMessage(data.message || "Verification failed");
        }
      } catch {
        setStatus("error");
        setErrorMessage("Verification failed. The link may have expired.");
      }
    };

    verifyEmail();
  }, [verificationUrl, navigate]);

  if (status === "loading") {
    return (
      <div className="space-y-6 text-center">
        <Spinner className="mx-auto h-10 w-10" />
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Verifying your email
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Please wait...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20">
          <CheckCircle className="h-7 w-7 text-green-500" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Email verified!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Redirecting to sign in...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/20">
        <XCircle className="h-7 w-7 text-destructive" />
      </div>
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Verification failed
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
      </div>
      <Button asChild className="h-11 rounded-xl">
        <Link to={APP_ROUTES.SIGN_IN}>Go to Sign In</Link>
      </Button>
    </div>
  );
}
