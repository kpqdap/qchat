import { LoadingIndicator } from "./loading"

export const PageLoader = (): JSX.Element => {
  return (
    <div className="container max-w-4xl flex items-center justify-center">
      <LoadingIndicator isLoading />
    </div>
  )
}
