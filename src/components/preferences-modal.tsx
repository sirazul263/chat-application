import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { TrashIcon } from "lucide-react";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useDeleteWorkspace } from "@/features/workspaces/api/use-delete-workspace";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";

interface PreferencesModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  initialValue: string;
  workspaceId: Id<"workspaces">;
}

export const PreferencesModal = ({
  open,
  setOpen,
  initialValue,
  workspaceId,
}: PreferencesModalProps) => {
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);

  const { mutate: updateWorkspace, isPending: isPendingUpdate } =
    useUpdateWorkspace();

  const { mutate: deleteWorkspace, isPending: isPendingDelete } =
    useDeleteWorkspace();

  const schema = z.object({
    name: z
      .string()
      .min(1, "Name  must be at least 3 characters")
      .max(256, "Password must be at best 256 characters"),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValue,
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    await updateWorkspace(
      {
        id: workspaceId,
        name: values.name,
      },
      {
        onSuccess: (data) => {
          toast.success("Workspace updated successfully");
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

    await deleteWorkspace(
      {
        id: workspaceId,
      },
      {
        onSuccess: () => {
          toast.success("Workspace deleted successfully");
          router.replace("/");
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white ">
            <DialogTitle>{initialValue}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between ">
                    <p className="text-sm font-semibold">Workspace Name</p>
                    <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm">{initialValue}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="p-4 border-b bg-white ">
                  <DialogTitle>Rename this workspace</DialogTitle>
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
                            Workspace Name{" "}
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
            <button
              onClick={handleDeleteWorkspace}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border hover:bg-gray-50 text-rose-600"
              disabled={isPendingDelete}
            >
              <TrashIcon className="size-4" />
              <p className="text-sm font-semibold">Delete Workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
