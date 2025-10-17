import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBackPath } from "../lib/projectBack";

export default function BackNavigationGuard() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      const back = getBackPath(location.pathname);
      navigate(back, { replace: true });
    };

    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [location.pathname, navigate]);

  return null;
}




