// import clientLogo from '../src/assets/images/rt-logo.svg';
// import ProfileIcon from '../src/assets/images/profile-icon.svg';
// import SideNav from './components/SideNav';
import Header from "./components/header/Header";
import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage></LandingPage>}></Route>
        <Route path="/dashboard" element={<LandingPage></LandingPage>}></Route>
      </Routes>
    </BrowserRouter>
    // <div className='d-flex flex-grow-1'>
    //   <div className='d-flex flex-column h-100 w-100'>
    //     <div className='row mx-0'>
    //       <div className="col-12 header d-flex justify-content-between">
    //         <	img className="top-bar-logo" src={clientLogo} alt="react logo" />
    //         <	img className="top-bar-icon" src={ProfileIcon} alt="react logo" />
    //       </div>
    //     </div>
    //     <div className="row flex-grow-1 overflow-hidden mx-0">
    //       <div className="col-12 col-12 flex-grow-1 overflow-hidden d-flex flex-column h-100">
    //         <div className="row h-100 flex-grow-1 overflow-hidden d-flex flex-column h-100">
    //           <div className="col-3 flex-grow-1 overflow-hidden d-flex flex-column h-100">
    //             <button className='primary-button w-100'>New Order</button>
    //             <SideNav></SideNav>
    //           </div>
    //           <div className="col-9 flex-grow-1 overflow-hidden d-flex flex-column h-100">
    //              <LandingPage></LandingPage>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default App;
