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
      <div>Enter your text: </div>
      <div className="text-black">
        <input type="text" onChange={(e) => setText(e.target.value)} value={text} />
      </div>
      <div>
        <button type="button" onClick={onClick}>
          Send
        </button>
      </div>
      <div>{textFromServer}</div>
    </div>
  )
}
Dummy.propTypes = {}

export default React.memo(Dummy)
