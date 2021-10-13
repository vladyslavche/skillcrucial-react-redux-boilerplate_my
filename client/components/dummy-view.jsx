import React, { useState } from 'react'
import Head from './head'

const Dummy = () => {
  const [text, setText] = useState('')
  const [textFromServer, setTextFromServer] = useState('')
  console.log('Text: ', text)

  const onClick = () => {
    fetch('/api/v1/input', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input: text })
    })
      .then((res) => res.json())
      .then((data) => setTextFromServer(data.result))
  }

  return (
    <div>
      <Head title="Hello" />
      <h1 className="text-grey-darkest">Program from 10-11 week</h1>
      <div>Enter your text: </div>
      <div className="text-black">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
          type="text"
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
      </div>
      <div>
        <button
          type="button"
          className="flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white text-green border-green hover:bg-green"
          onClick={onClick}
        >
          Send
        </button>
      </div>
      <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
        {textFromServer}
      </div>
    </div>
  )
}
Dummy.propTypes = {}

export default React.memo(Dummy)
