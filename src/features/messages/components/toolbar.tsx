import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { MessageSquareTextIcon, Pencil, SmileIcon, Trash } from "lucide-react";
import { Hint } from "@/components/hint";
import { EmojiPopover } from "@/components/emoji-popover";

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThead: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton: boolean | undefined;
}
export const Toolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleDelete,
  handleThead,
  handleReaction,
  hideThreadButton,
}: ToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0  transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopover
          hint="Add reaction"
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
        >
          <Button variant="ghost" size="iconSm" disabled={isPending}>
            <SmileIcon className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button
              variant="ghost"
              size="iconSm"
              disabled={isPending}
              onClick={handleThead}
            >
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <>
            <Hint label="Edit Message">
              <Button
                variant="ghost"
                size="iconSm"
                disabled={isPending}
                onClick={handleEdit}
              >
                <Pencil className="size-4" />
              </Button>
            </Hint>
            <Hint label="Delete Message">
              <Button
                variant="ghost"
                size="iconSm"
                disabled={isPending}
                onClick={handleDelete}
              >
                <Trash className="size-4" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
};
