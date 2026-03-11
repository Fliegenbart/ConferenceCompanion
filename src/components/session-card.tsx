import { Clock3, MapPinned, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";

export function SessionCard({
  title,
  subtitle,
  description,
  timeRange,
  room,
  tags,
  featured,
}: {
  title: string;
  subtitle?: string | null;
  description: string;
  timeRange: { startAt: Date | string; endAt: Date | string };
  room?: string | null;
  tags?: string[];
  featured?: boolean;
}) {
  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-[#173325]">{title}</h3>
          {subtitle ? <p className="text-sm text-[#5e7066]">{subtitle}</p> : null}
        </div>
        {featured ? (
          <Badge variant="accent" className="gap-1">
            <Star className="size-3.5" />
            Featured
          </Badge>
        ) : null}
      </div>
      <p className="text-sm leading-6 text-[#3d5447]">{description}</p>
      <div className="flex flex-wrap gap-4 text-sm text-[#51665a]">
        <span className="inline-flex items-center gap-2">
          <Clock3 className="size-4" />
          {formatDateTime(timeRange.startAt)} - {formatDateTime(timeRange.endAt, "HH:mm")}
        </span>
        {room ? (
          <span className="inline-flex items-center gap-2">
            <MapPinned className="size-4" />
            {room}
          </span>
        ) : null}
      </div>
      {tags?.length ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
