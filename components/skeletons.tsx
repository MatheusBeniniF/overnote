import { Skeleton } from "./ui/skeleton";

export const SkeletonNote = () => {
  return (
    <div className="flex flex-col gap-2 p-2">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-40 w-2/3" />
    </div>
  );
};

export const SkeletonNotesSidebar = () => {
  return (
    <div className="flex flex-col gap-2 p-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
};

export const SkeletonsNoteCard = () => {
  return (
    <div className="hidden md:grid grid-cols-3 gap-2 p-2">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-40 w-full" />
      ))}
    </div>
  );
};
