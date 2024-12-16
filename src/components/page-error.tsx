"use client";

import { AlertTriangle } from "lucide-react";

const PageError = ({
  message = "Something went wrong!",
}: {
  message: string;
}) => {
  return (
    <div className="flex flex-col gap-y-2 bg-[#5E2C5F] h-screen items-center justify-center">
      <AlertTriangle className="size-5 text-white mb-2" />
      <p className="text-sm font-medium text-white">{message}</p>
    </div>
  );
};
export default PageError;
