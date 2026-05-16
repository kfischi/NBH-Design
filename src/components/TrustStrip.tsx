/**
 * Trust strip — slim horizontal band of trust signals placed between
 * the hero video and the stats counter on the homepage.
 */

import { ShieldCheck, Clock, Package, Star } from "lucide-react";

const items = [
  { icon: ShieldCheck, text: "ניסיון ביטחוני מוכח" },
  { icon: Clock, text: "אב-טיפוס ב-72 שעות" },
  { icon: Package, text: "פתרון שלם — לא שעות" },
  { icon: Star, text: "100% שביעות רצון" },
] as const;

export default function TrustStrip() {
  return (
    <div className="bg-slate-800 border-y border-slate-700/50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
          {items.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 text-sm font-medium text-slate-300"
            >
              <Icon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
