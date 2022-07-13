import { h } from 'preact'
import { forwardRef } from 'preact/compat'

const elem = ({ tag: TagName, defaultProps = {}, defaultClass = '' }) =>
  forwardRef(({ class: className = '', ...otherProps }, ref) => (
    <TagName
      ref={ref}
      {...defaultProps}
      class={`${defaultClass} ${className}`}
      {...otherProps}
    />
  ))

export default elem
