import { JSX, h } from 'preact'
import { forwardRef } from 'preact/compat'

const elem = <T extends keyof HTMLElementTagNameMap>({
  tag: TagName,
  defaultProps = {},
  defaultClass = '',
}: {
  tag: T
  defaultProps?: Partial<JSX.HTMLAttributes<HTMLElementTagNameMap[T]>>
  defaultClass?: string
}) =>
  forwardRef(
    (
      {
        class: className = '',
        ...otherProps
      }: JSX.HTMLAttributes<HTMLElementTagNameMap[T]>,
      ref
    ) => {
      const Component = TagName as any
      return (
        <Component
          ref={ref}
          {...defaultProps}
          class={`${defaultClass} ${className}`}
          {...otherProps}
        />
      )
    }
  )

export default elem
