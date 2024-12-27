"use client";

import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useGetChannelById } from "@/features/channels/api/use-get-channel-by-id";
import { ChatInput } from "@/features/channels/components/chat-input";
import { Header } from "@/features/channels/components/header";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useChannelId } from "@/hooks/use-channel-id";
import { MessageList } from "@/features/messages/components/message-list";

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const { results, status, loadMore } = useGetMessages({ channelId });

  const { data: channel, isLoading: channelLoading } = useGetChannelById({
    id: channelId,
  });

  const isLoading = channelLoading || status === "LoadingFirstPage";

  if (isLoading) {
    return <PageLoader />;
  }
  if (!channel) {
    return <PageError message="Channel not found" />;
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={channel.name} />
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />

      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;
