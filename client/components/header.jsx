import React from 'react'
import { Link } from 'react-router-dom'

const Header = ({ userName, repositoryName }) => (
  <div className="flex flex-col items-center bg-gray-300 w-full">
    <div className="font-bold my-1">
      {userName} {repositoryName}
    </div>
    <div className="flex justify-between w-full px-4">
      <Link id="go-back" className="border rounded m-1 px-2 bg-gray-100" to="/">
        Back
      </Link>
      <Link id="" className="border rounded m-1 px-2 bg-gray-100" to={`/${userName}`}>
        Repository list
      </Link>
    </div>
  </div>
)

Header.propTypes = {}

export default React.memo(Header)
