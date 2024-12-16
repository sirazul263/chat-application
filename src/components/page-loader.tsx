"use client";

import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
interface PageLoaderProps {
  className?: string;
}
const PageLoader = ({ className }: PageLoaderProps) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Loader
        className={cn(
          "size-6 animate-spin  ",
          className ? className : "text-muted-foreground"
        )}
      />
    </div>
  );
};
export default PageLoader;
