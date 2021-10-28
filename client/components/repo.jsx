import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Head from './head'

const Repo = () => {
  const { userName } = useParams()
  const [repos, setRepos] = useState([])
  const url = `https://api.github.com/users/${userName}/repos`
  useEffect(() => {
    fetch(url)
      .then((r) => r.json())
      .then((arr) => {
        setRepos(arr)
      })
      .catch((err) => console.log('Error: ', err))
  }, [url])
  return (
    <div>
      <Head title="Repositories" />
      {userName}
      {repos.map((repoObj) => {
        return (
          <Link to={`/${userName}/${repoObj.name}`} key={repoObj.id}>
            {repoObj.name}
          </Link>
        )
      })}
    </div>
  )
}

Repo.propTypes = {}

export default React.memo(Repo)
