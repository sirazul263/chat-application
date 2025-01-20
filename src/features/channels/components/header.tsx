import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useChannelId } from "@/hooks/use-channel-id";
import { useConfirm } from "@/hooks/use-confirm";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";
import { z } from "zod";
import { useUpdateChannel } from "../api/use-update-channel";
import { useDeleteChannel } from "../api/use-delete-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";

interface HeaderProps {
  title: string;
}
export const Header = ({ title }: HeaderProps) => {
  const router = useRouter();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const { data: member } = useCurrentMember({ workspaceId });

  const [editOpen, setEditOpen] = useState(false);

  const { mutate: updateChannel, isPending: isPendingUpdate } =
    useUpdateChannel();

  const { mutate: deleteChannel, isPending: isPendingDelete } =
    useDeleteChannel();

  const handleOpen = () => {
    if (member?.role !== "admin") {
      return;
    }
    setEditOpen(true);
  };

  const schema = z.object({
    name: z
      .string()
      .min(1, "Name  must be at least 3 characters")
      .max(256, "Password must be at best 256 characters"),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: title,
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    await updateChannel(
      {
        id: channelId,
        name: values.name.replace(/\s+/g, "-").toLocaleLowerCase(),
      },
      {
        onSuccess: () => {
          toast.success("Channel updated successfully");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Something went wrong");
          setEditOpen(false);
        },
      }
    );
  };

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Workspace",
    "Are you sure you want to delete this workspace?"
  );

  const handleDeleteWorkspace = async () => {
    const ok = await confirm();
    if (!ok) return null;

    await deleteChannel(
      {
        id: channelId,
      },
      {
        onSuccess: () => {
          toast.success("Channel deleted successfully");
          router.replace(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };
  return (
    <>
      <ConfirmDialog />
      <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="text-xl font-semibold px-2 overflow-hidden w-auto"
              size="sm"
            >
              <span className="truncate">#{title}</span>
              <FaChevronDown className="size-2.5 ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-gray-50 overflow-hidden">
            <DialogHeader className="p-4 border-b bg-white ">
              <DialogTitle>#{title}</DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4 flex flex-col gap-y-2">
              <Dialog open={editOpen} onOpenChange={handleOpen}>
                <DialogTrigger asChild>
                  <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between ">
                      <p className="text-sm font-semibold">Channel Name</p>
                      {member?.role === "admin" && (
                        <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                          Edit
                        </p>
                      )}
                    </div>
                    <p className="text-sm">#{title}</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader className="p-4 border-b bg-white ">
                    <DialogTitle>Rename this channel</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Channel Name{" "}
                              <span className="text-red-700">*</span>{" "}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Workspace Name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isPendingUpdate}
                          >
                            Cancel
                          </Button>
                        </DialogClose>

                        <Button type="submit" disabled={isPendingUpdate}>
                          Save
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              {member?.role === "admin" && (
                <button
                  onClick={handleDeleteWorkspace}
                  className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border hover:bg-gray-50 text-rose-600"
                  disabled={isPendingDelete}
                >
                  <TrashIcon className="size-4" />
                  <p className="text-sm font-semibold">Delete Channel</p>
                </button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
