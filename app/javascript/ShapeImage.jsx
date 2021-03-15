import React from 'react'

import cross from './images/cross.svg'
import circle from './images/circle.svg'
import triangle from './images/triangle.svg'

const ShapeImage = props => {
  const { type, ...other } = props

  return <img src={{ cross, circle, triangle }[type]} {...other} aria-label={type} />
}

export default ShapeImage
