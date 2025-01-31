import { Skeleton } from "./ui/skeleton";

export const SkeletonNote = () => {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-40 w-2/3" />
    </div>
  );
};
