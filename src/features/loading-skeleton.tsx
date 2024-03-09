export const LoadingSkeleton = (): JSX.Element => {
  return (
    <div className="h-full w-full flex items-center justify-center bg-altBackground col-span-full sm:col-span-4 md:col-span-5 lg:col-span-4 xl:col-span-5">
      <div className="loader">Loading...</div>
    </div>
  )
}
