interface TokenProps {
  id: number;
  image?: string;
  title?: string;
  description?: string;
  loading?: boolean;
  onClick?: () => void;
}

export function Token({
  id,
  image,
  title,
  description,
  loading,
  onClick,
}: TokenProps) {
  return (
    <div className="flex items-center cursor-pointer" onClick={onClick}>
      <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden">
        {image ? (
          <img
            className="w-full h-full object-cover"
            style={{ objectPosition: "center top" }}
            src={image}
            alt=""
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center font-bold text-2xl text-gray-400">
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              "?"
            )}
          </div>
        )}
      </div>
      <div className="ml-4">
        {title ? (
          <>
            <div className="font-semibold text-gray-900">{title}</div>
            <div className="text-sm text-gray-900">{description}</div>
          </>
        ) : (
          <>
            <div className=" font-medium text-gray-900">Token #{id}</div>
            <div className="text-xs text-gray-500">Click to load metadata</div>
          </>
        )}
      </div>
    </div>
  );
}
