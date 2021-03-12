import React from 'react'
import { Tooltip } from 'bootstrap'

class CopyButton extends React.Component {
  constructor(props) {
    super(props)

    const { children, copyText, ...others } = this.props
    this.htmlOptions = others

    this.buttonRef = React.createRef()

    this.state = {
      justCopiedTimeoutId: null,
    }
  }

  componentDidMount() {
    this.buttonTooltip = new Tooltip(this.buttonRef.current, {
      trigger: 'manual',
      title: this.props.copiedTitle || 'Copied',
    })
  }

  performCopy() {
    const input = document.createElement('input')
    input.value = this.props.copyText()
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)

    if (this.state.justCopiedTimeoutId !== null) {
      clearTimeout(this.state.justCopiedTimeoutId)
    }

    this.buttonTooltip.show()

    this.setState({
      justCopiedTimeoutId: setTimeout(() => {
        this.buttonTooltip.hide()
      }, 1000),
    })
  }

  render() {
    return (
      <button
        ref={this.buttonRef}
        onClick={this.performCopy.bind(this)}
        {...this.htmlOptions}>
        {this.props.children}
      </button>
    )
  }
}

export default CopyButton
