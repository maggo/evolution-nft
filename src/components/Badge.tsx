import { ReactNode } from "react";

interface BadgeProps {
  label: string;
  icon?: ReactNode;
}

export function Badge({ label, icon }: BadgeProps) {
  return (
    <span className="inline-flex rounded-full items-center py-0.5 px-2 text-sm font-medium bg-indigo-100 hover:bg-indigo-200 cursor-pointer text-indigo-700">
      {icon}
      {label}
    </span>
  );
}
