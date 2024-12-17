"use client";

import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useGetChannelById } from "@/features/channels/api/use-get-channel-by-id";
import { ChatInput } from "@/features/channels/components/chat-input";
import { Header } from "@/features/channels/components/header";
import { useChannelId } from "@/hooks/use-channel-id";

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const { data: channel, isLoading: channelLoading } = useGetChannelById({
    id: channelId,
  });

  const isLoading = channelLoading;

  if (isLoading) {
    return <PageLoader />;
  }
  if (!channel) {
    return <PageError message="Channel not found" />;
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={channel.name} />
      <div className="flex-1" />
      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;
