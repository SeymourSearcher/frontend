import { HexUser } from "@/lib/api";

export function Avatar({ user }: { user: HexUser }) {
  const defaultAvatarIndex = Number(BigInt(user.discord_id) >> BigInt(22)) % 6;
  const src = user.avatar_hash
    ? `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar_hash}.png`
    : `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;

  return <img src={src} alt={user.username} className="w-6 h-6 rounded-full" />;
}
