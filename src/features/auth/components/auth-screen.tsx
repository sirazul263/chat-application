"use client";

import { useState } from "react";
import { SignInFlow } from "../types";
import { SignInCards } from "./sign-in-cards";
import { SignUpCards } from "./signup-cards";

const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");
  return (
    <div className="h-full flex items-center justify-center bg-[#5C3B58]">
      <div className="md:h-auto md:w-[420px]">
        {state === "signIn" ? (
          <SignInCards setState={setState} />
        ) : (
          <SignUpCards setState={setState} />
        )}
      </div>
    </div>
  );
};
export default AuthScreen;
