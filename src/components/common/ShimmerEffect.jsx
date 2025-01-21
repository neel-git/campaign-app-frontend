// src/components/common/ShimmerEffect.jsx
export const ShimmerEffect = () => {
    return (
      <div className="animate-pulse p-4 border-b border-gray-200">
        <div className="flex justify-between">
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>
        <div className="space-y-2 mt-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  };