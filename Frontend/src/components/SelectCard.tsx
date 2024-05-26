import React from 'react'
import CardIcon from '../assets/card-images/cash-book.svg';

function SelectCard() {
  return (
    <div className='select-card d-flex flex-row'>
         <div className='select-card-body d-flex flex-column'>
            <div className='select-card-header'>Price Calculator</div>
            <div className='select-card-body-text'>Consilio difficultates superare potest esse, immo</div>
            <button className='primary-button'>View</button>
         </div>
         <div className="select-card-img">
            <img className="top-bar-icon" src={CardIcon} alt="react logo" />
         </div>
    </div>
  )
}

export default SelectCard