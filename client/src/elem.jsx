import { h } from 'preact'

const elem =
  ({ tag: TagName, defaultProps = {}, defaultClass = '' }) =>
  ({ class: className = '', ...otherProps }) =>
    (
      <TagName
        {...defaultProps}
        class={`${defaultClass} ${className}`}
        {...otherProps}
      />
    )

export default elem
