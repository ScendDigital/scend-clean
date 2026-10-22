import { ReactNode } from "react";

type Props = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

export default function ToolLayout({
  title,
  subtitle,
  children,
}: Props) {
  return (
    <div className="max-w-7xl mx-auto p-6">

      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h1 className="text-2xl font-bold">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="text-gray-600 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        {children}
      </div>

    </div>
  );
}
