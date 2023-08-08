import React, { useState } from 'react'
import ReactSwitch from 'react-switch';
import "./header.css"

function Navbar() {
  const [checked, setChecked] = useState(false);

  const handleChange = val => {
    setChecked(val)
  }

  return (
    <div>
      <div className="nav_bar" />
      <div className="code">
        <ReactSwitch checked={checked} onChange={handleChange} height={15} width={30}/>
        <div style={{whiteSpace: 'pre-wrap'}}> Enable Code View</div>
      </div>
    </div>
  )
}
export default Navbar