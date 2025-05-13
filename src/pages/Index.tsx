
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  useEffect(() => {
    // Change the document title
    document.title = "Kaam Karao | Local Service Marketplace";
  }, []);

  // Redirect to the home page
  return <Navigate to="/" replace />;
};

export default Index;
