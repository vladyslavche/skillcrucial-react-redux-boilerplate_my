import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Head from './head'
// import wave from '../assets/images/wave.jpg'
import { history } from '../redux'

const Home = () => {
  const [value, setValue] = useState('')

  const onChange = (e) => {
    console.log(value)
    setValue(e.target.value)
  }

  const onClick = () => {
    history.push(`/${value}`)
  }

  return (
    <div className="flex justify-center items-center">
      <Head title="Welcome" />
      <div className="flex flex-col bg-gray-100 rouned border m-2 p-4" space-y-2>
        <input
          className="rounded p-2"
          type="text"
          id="input-field"
          onChange={onChange}
          value={value}
        />
        <button
          className="border bg-gray-300 rounded p-2"
          type="button"
          id="search-button"
          onClick={onClick}
        >
          Enter
        </button>
        <Link className="border bg-gray-300 rounded p-2" id="search-link" to={`/${value}`}>Enter with Link</Link>
      </div>
    </div>
  )
}

Home.propTypes = {}

export default Home
