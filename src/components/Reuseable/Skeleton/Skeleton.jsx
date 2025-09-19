import React from 'react'
import './Skeleton.css'

const Skeleton = (props) => {
    const {style = {} } = props

  return (
    <div className="skeleton w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl" style={style}>
      <div className="skeletonimg w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80"></div>
      <div className="skeletontitle w-full h-5"></div>
      <div className="skeletonprice w-1/2 h-5"></div>
    </div>
  )
}

export default Skeleton