import { clsxm } from '@zolplay/utils'

export function Container({ className, children, ...props }: ComponentProps) {
  return (
    <div className={clsxm('lg:px-8', className)} {...props}>
      <div className="lg:max-w-4xl m-auto">
        <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
          {children}
        </div>
      </div>
    </div>
  )
}
