import { BrowserRouter as Router } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
import AuthenticatedApp from "./AuthenticatedApp";

export default function App({ children }) {
  return (
    <Router>
      <Authenticator className="flex flex-col h-screen">
        <AuthenticatedApp>{children}</AuthenticatedApp>
      </Authenticator>
    </Router>
  );
}
