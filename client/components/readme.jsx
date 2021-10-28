import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import Head from './head'

const Readme = () => {
  const { userName, repositoryName } = useParams()
  const [text, setText] = useState('')
  const url = `https://raw.githubusercontent.com/${userName}/${repositoryName}/master/README.md`
  useEffect(() => {
    fetch(url)
      .then((r) => r.text())
      .then((str) => {
        setText(str)
      })
      .catch((err) => console.log('Error: ', err))
  }, [url])
  return (
    <div>
      <Head title="Readme" />
      {`${userName} - ${repositoryName}`}
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  )
}

Readme.propTypes = {}

export default React.memo(Readme)
