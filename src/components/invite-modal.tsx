import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useResetJoinCode } from "@/features/workspaces/api/use-reset-join-code";
import { useConfirm } from "@/hooks/use-confirm";

interface InviteModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  name: string;
  joinCode: string;
}

export const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode,
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId();

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard!"));
  };

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will deactivate the current invite code and activate a new one"
  );

  const { mutate, isPending } = useResetJoinCode();
  const handleResetJoinCode = async () => {
    const ok = await confirm();
    if (!ok) return;

    await mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success("Join code reset successfully");
        },
        onError: () => {
          toast.error("Failed to reset join code");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className=" bg-gray-50 overflow-hidden">
          <DialogHeader>
            <DialogTitle>Invite People to {name}</DialogTitle>
            <DialogDescription>
              Use the below code to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest">{joinCode}</p>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              Copy Link <CopyIcon className="size-4 ml-2" />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              disabled={isPending}
              onClick={handleResetJoinCode}
            >
              Generate New Code <RefreshCcw className="size-4 ml-2" />{" "}
            </Button>
            <DialogClose asChild disabled={isPending}>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
