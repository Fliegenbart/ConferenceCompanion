import { Bell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";

type AnnouncementFeedItem = {
  id: string;
  title: string;
  body: string;
  pinned?: boolean;
  publishedAt: Date | string;
};

export function AnnouncementFeed({ items }: { items: AnnouncementFeedItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Bell className="size-4 text-[#da4f29]" />
                <h3 className="font-semibold text-[#173325]">{item.title}</h3>
              </div>
              <p className="text-sm leading-6 text-[#41584b]">{item.body}</p>
            </div>
            {item.pinned ? <Badge variant="accent">Pinned</Badge> : null}
          </div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#708177]">{formatDateTime(item.publishedAt)}</p>
        </Card>
      ))}
    </div>
  );
}
