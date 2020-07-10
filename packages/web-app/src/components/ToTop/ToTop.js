import React from 'react'

export default function ToTop() {
  function goToTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  return (
    <div className="to-top" onClick={goToTop}>
      <div className="to-top__arrow"></div>
    </div>
  )
}