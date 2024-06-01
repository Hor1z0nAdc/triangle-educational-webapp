import React from 'react'

import { useState } from 'react';

const Instruction = (props) => {
  const [open, setOPen] = useState(false);

  const toggle = () => {
    setOPen(!open);
  };

  return (
    <>
    <div className='instructionContainer'>
      <div className='left'>
        <button className='instructionBtn' onClick={toggle}>{(open && props.closeText) || props.openText }</button>
      </div>
    </div>
    <div className='inst'>
      {open &&
      <div className="toggle">{props.children}</div>
      }
    </div>
    </>
  )
}

export default Instruction