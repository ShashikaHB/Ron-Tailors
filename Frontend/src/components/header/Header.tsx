import React from 'react'
import clientLogo from '../../assets/images/rt-logo.svg'
import ProfileIcon from '../../assets/images/profile-icon.svg';
const Header = () => {
  return (
    <>
        <div className='row mx-0'>
          <div className="col-12 header d-flex justify-content-between">
            <	img className="top-bar-logo" src={clientLogo} alt="react logo" />
            <	img className="top-bar-icon" src={ProfileIcon} alt="react logo" />
          </div>
        </div>
    </>
  )
}

export default Header