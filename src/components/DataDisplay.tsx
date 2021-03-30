import { ReactNode } from "react";

export function DataDisplay({ children }) {
  return (
    <dl className="mt-5 grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow divide-y divide-gray-200 md:grid-cols-3 md:divide-y-0 md:divide-x">
      {children}
    </dl>
  );
}

interface DataItemProps {
  title: ReactNode;
  value: ReactNode;
  byline?: ReactNode;
}

export function DataItem({ title, value, byline }: DataItemProps) {
  return (
    <div className="px-4 py-5 sm:p-6">
      <dt className="text-base font-normal text-gray-900">{title}</dt>
      <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
        <div className="flex items-baseline ">
          <span className="text-2xl font-semibold text-indigo-600">
            {value}
          </span>
          {!!byline && (
            <span className="ml-2 text-sm font-medium text-gray-500">
              {byline}
            </span>
          )}
        </div>
      </dd>
    </div>
  );
}
