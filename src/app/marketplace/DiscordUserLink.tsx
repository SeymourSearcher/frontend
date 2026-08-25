import { OrderUser } from "@/types/marketplace";

export default function DiscordUserLink({ user }: { user: OrderUser }) {
  return (
    <a
      href={`https://discord.com/users/${user.discord_id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 text-[10px] text-[#888] hover:text-[#5865F2] transition-colors shrink-0"
    >
      {user.avatar_hash ? (
        <img
          src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar_hash}.png?size=32`}
          alt=""
          className="w-4 h-4 rounded-full"
        />
      ) : (
        <div className="w-4 h-4 rounded-full bg-[#5865F2]" />
      )}
      <span className="truncate max-w-[60px]">{user.username}</span>
    </a>
  );
}
