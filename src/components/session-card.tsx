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
          <h3 className="font-manrope text-2xl font-semibold tracking-[-0.05em] text-[#111315]">{title}</h3>
          {subtitle ? <p className="text-sm text-[#59616a]">{subtitle}</p> : null}
        </div>
        {featured ? (
          <Badge variant="accent" className="gap-1">
            <Star className="size-3.5" />
            Highlight
          </Badge>
        ) : null}
      </div>
      <p className="overflow-hidden text-sm leading-6 text-[#59616a] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
        {description}
      </p>
      <div className="flex flex-wrap gap-4 text-sm text-[#5f584f]">
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
