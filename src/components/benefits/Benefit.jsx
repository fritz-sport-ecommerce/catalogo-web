import React from "react"

import "./Benefit.css"

const Benefit = ({ benefits }) => {
  const { icon, title, text } = benefits
  return (
    <div className="benefit  ">
      <div className="icon">{icon}</div>
      <div className="info">
        <h3 className="text-[14px]  uppercase text-black dark:text-white">
          {title}
        </h3>
        <span className="graytext">{text}</span>
      </div>
    </div>
  )
}
export default Benefit
