interface AvatarUser {
  discord_id: string;
  username: string;
  avatar_hash: string | null;
}

interface AvatarProps {
  user: AvatarUser;
  size?: keyof typeof SIZES;
  /** Pass "" where the username is already rendered next to the image. */
  alt?: string;
}

// Requested at 2x the rendered size so the CDN copy stays sharp on retina.
const SIZES = {
  sm: { className: "w-4 h-4", cdn: 32 },
  md: { className: "w-6 h-6", cdn: 64 },
  lg: { className: "w-8 h-8", cdn: 64 },
} as const;

export function Avatar({ user, size = "md", alt }: AvatarProps) {
  const { className, cdn } = SIZES[size];

  // Discord's default avatar index for the new username system.
  const defaultIndex = Number(BigInt(user.discord_id) >> BigInt(22)) % 6;
  const src = user.avatar_hash
    ? `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar_hash}.png?size=${cdn}`
    : `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;

  return (
    <img
      src={src}
      alt={alt ?? user.username}
      className={`${className} rounded-full`}
    />
  );
}
