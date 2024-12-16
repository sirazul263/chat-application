import { useCurrentMember } from "@/features/members/api/use-current-memeber";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import PageLoader from "./page-loader";
import PageError from "./page-error";
import { WorkspaceHeader } from "./workspace-header";
import { HashIcon, MessageSquareText, SendHorizontal } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { useGetChannels } from "@/features/channels/api/use-get-chaneels";
import { WorkspaceSection } from "./workspace-section";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { UserItem } from "./user-item";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useChannelId } from "@/hooks/use-channel-id";

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const [_open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceById({
    id: workspaceId,
  });

  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });

  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  });

  const isLoading =
    memberLoading || workspaceLoading || channelsLoading || membersLoading;

  if (isLoading) {
    return <PageLoader className="text-white" />;
  }
  if (!workspace || !member) {
    return <PageError message="Workspace not found!" />;
  }

  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full ">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drafts & Sends" icon={SendHorizontal} id="drafts" />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New Channel"
        onNew={member.role === "admin" ? () => setOpen(true) : undefined}
      >
        {channels?.map((item, i) => (
          <SidebarItem
            key={i}
            label={item.name}
            icon={HashIcon}
            id={item._id}
            variant={channelId === item._id ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection
        label="Direct Messages"
        hint="New Message"
        onNew={() => {}}
      >
        {members?.map((item, i) => (
          <UserItem
            id={item._id}
            label={item.user.name}
            image={item.user.image}
            key={i}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};
