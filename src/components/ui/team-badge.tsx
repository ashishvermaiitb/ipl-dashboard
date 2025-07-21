import Image from "next/image";
import { Team } from "@/types/ipl";
import { cn } from "@/utils/cn";

interface TeamBadgeProps {
  team: Team;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
}

export function TeamBadge({
  team,
  size = "md",
  showName = false,
  className,
}: TeamBadgeProps) {
  const sizeMap = {
    sm: 24,
    md: 32,
    lg: 48,
  };

  const textSizeMap = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const logoSize = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="relative flex-shrink-0 rounded-full border-2 overflow-hidden team-badge"
        style={{
          width: logoSize,
          height: logoSize,
          borderColor: team.color || "#555",
        }}
      >
        {team.logo ? (
          <Image
            src={team.logo}
            alt={team.name}
            width={logoSize}
            height={logoSize}
            className="object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center font-bold text-white"
            style={{ backgroundColor: team.color || "#555" }}
          >
            {team.shortName?.substring(0, 2)}
          </div>
        )}
      </div>

      {showName && (
        <span
          className={cn(
            "font-medium text-gray-900 dark:text-gray-100 team-name",
            textSizeMap[size]
          )}
        >
          {team.shortName || team.name}
        </span>
      )}
    </div>
  );
}
