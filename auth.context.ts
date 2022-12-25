import React from "react";

interface IAuthContext {
  accessToken: string;
  addToken: (token: string) => void;
  isAuthenticated: boolean;
}

export const AuthContext = React.createContext<IAuthContext>({
  accessToken: "",
  addToken: () => {},
  isAuthenticated: false
});
