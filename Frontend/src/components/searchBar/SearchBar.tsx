import { FaSearch } from "react-icons/fa";


const SearchBar = () => {
  return (
    <div className='d-flex align-items-center'>
        <FaSearch  className='mr-2'/>
        <input type="text" placeholder='Search here...'/>
    </div>
  )
}

export default SearchBar