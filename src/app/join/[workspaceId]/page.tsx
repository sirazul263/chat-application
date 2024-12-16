"use client";

import PageLoader from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { useJoinWorkspace } from "@/features/workspaces/api/use-join-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import VerificationInput from "react-verification-input";
import { toast } from "sonner";

const JoinPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });

  const isMember = useMemo(() => data?.isMember, [data]);

  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  const { mutate, isPending } = useJoinWorkspace();
  const handleComplete = (value: string) => {
    mutate(
      { joinCode: value, workspaceId: workspaceId },
      {
        onSuccess: () => {
          toast.success("Successfully joined the workspace");
          router.replace(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error("Error joining workspace:");
        },
      }
    );
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image src={"/logo.webp"} alt="logo" width={120} height={60} />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join {data?.name}</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          classNames={{
            container: cn(
              "flex gap-x-2",
              isPending && "opacity-50 cursor-not-allowed"
            ),
            character:
              "h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500 ",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          autoFocus
          length={6}
          onComplete={handleComplete}
        />
      </div>
      <div className="flex gap-x-4">
        <Button size="lg" variant="outline" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};
export default JoinPage;
