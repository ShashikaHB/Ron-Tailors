import React from 'react'
import SelectCard from '../components/SelectCard'

function LandingPage() {
    return (
        <div className='container-fluid'>
            <div className='row overflow-y-auto p-3 gap-3 justify-content-center'>
                <div className="col-5">
                    <SelectCard></SelectCard>
                </div>
                <div className="col-5">
                    <SelectCard></SelectCard>
                </div>
                <div className="col-5">
                    <SelectCard></SelectCard>
                </div>
                <div className="col-5">
                    <SelectCard></SelectCard>
                </div>
                <div className="col-5">
                    <SelectCard></SelectCard>
                </div>
                <div className="col-5">
                    <SelectCard></SelectCard>
                </div>
            </div>
        </div>
    )
}

export default LandingPage