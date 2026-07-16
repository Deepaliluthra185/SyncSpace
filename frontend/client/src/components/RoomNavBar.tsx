import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Share2, Users, Wifi, WifiOff, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface User {
  userId: string;
  userName: string;
  userEmail: string;
  joinedAt: Date;
}

interface RoomNavBarProps {
  roomName: string;
  roomId: string;
  connected: boolean;
  activeUsers: User[];
  currentUserId: string;
}

export function RoomNavBar({
  roomName,
  roomId,
  connected,
  activeUsers,
  currentUserId,
}: RoomNavBarProps) {
  const [copied, setCopied] = useState(false);

  const handleShareRoom = async () => {
    const shareUrl = `${window.location.origin}/room/${roomId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Room link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy room link");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Room Info */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-semibold text-foreground">{roomName}</h1>
            <p className="text-xs text-muted-foreground">Room ID: {roomId.slice(0, 8)}...</p>
          </div>
        </div>

        {/* Center: Status and Users */}
        <div className="flex items-center gap-6">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            {connected ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-xs font-medium text-green-600">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-xs font-medium text-red-600">Disconnected</span>
              </>
            )}
          </div>

          {/* Active Users Count */}
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {activeUsers.length} active
          </Badge>

          {/* User Avatars */}
          <div className="flex items-center gap-2">
            {activeUsers.slice(0, 4).map((user) => (
              <Tooltip key={user.userId}>
                <TooltipTrigger asChild>
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarImage src="" alt={user.userName} />
                    <AvatarFallback className="text-xs font-semibold">
                      {getInitials(user.userName)}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm font-medium">{user.userName}</p>
                  <p className="text-xs text-muted-foreground">{user.userEmail}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            {activeUsers.length > 4 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarFallback className="text-xs font-semibold">
                      +{activeUsers.length - 4}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    {activeUsers.slice(4).map((user) => (
                      <div key={user.userId}>
                        <p className="text-sm font-medium">{user.userName}</p>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Right: Share Button */}
        <Button
          onClick={handleShareRoom}
          variant="default"
          size="sm"
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              Share Room Link
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
