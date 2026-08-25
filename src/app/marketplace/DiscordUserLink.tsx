import { Avatar } from "@/components/Avatar";
import { OrderUser } from "@/types/marketplace";

export default function DiscordUserLink({ user }: { user: OrderUser }) {
  return (
    <a
      href={`https://discord.com/users/${user.discord_id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 text-[10px] text-[#888] hover:text-[#5865F2] transition-colors shrink-0"
    >
      <Avatar user={user} size="sm" alt="" />
      <span className="truncate max-w-[60px]">{user.username}</span>
    </a>
  );
}
