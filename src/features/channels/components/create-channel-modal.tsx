import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { useCreateChannel } from "../api/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

export const CreateChannelModal = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [open, setOpen] = useCreateChannelModal();

  const handleClose = () => {
    setOpen(false);
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
      name: "",
    },
  });

  const { mutate, isPending, data, error } = useCreateChannel();

  const onSubmit = async (values: z.infer<typeof schema>) => {
    await mutate(
      {
        name: values.name.replace(/\s+/g, "-").toLocaleLowerCase(),
        workspaceId,
      },
      {
        onSuccess: (data) => {
          toast.success("Channel created successfully");
          router.push(`/workspace/${workspaceId}/channel/${data}`);
          form.reset();
          handleClose();
        },
        onError: () => {
          toast.error("Failed to create channel");
        },
      }
    );
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new channel</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Channel Name <span className="text-red-700">*</span>{" "}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Channel Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isPending}>
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
