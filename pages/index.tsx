import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../auth.context'
import requestClient from '../requestClient'

const Home: NextPage = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const { addToken } = useContext(AuthContext)
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestClient.post('/auth/login', {
      username,
      password,
      "expires": 120
    })
      .then(resp => {
        addToken(resp.data.access_token);
        localStorage.setItem('accessToken', JSON.stringify(resp.data.access_token));
        router.push('/dashboard/view');
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-3xl font-bold">
          Login
        </h1>
        <form className='flex items-center justify-center flex-col' onSubmit={handleSubmit}>
          <div className='mt-4 flex items-start justify-center flex-col'>
            <label htmlFor="username">Username</label>
            <input required id='username' name="username"
              value={username}
              className='mt-2 max-w-xs py-4 px-2 border-black border-solid border-2 rounded shadow-sm'
              type={'text'} onChange={(e) => setUserName(e.target.value)} placeholder="UserName" />
          </div>
          <div className='mt-4 flex items-start justify-center flex-col'>
            <label htmlFor="password">Password</label>
            <input required id='password' name='password'
              value={password}
              className='mt-2 max-w-xs py-4 px-2 border-black border-solid border-2 rounded shadow-sm'
              type={'password'} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          </div>
          <button type="submit" className='rounded-md mt-4 bg-black text-white py-2 px-4'>Login</button>
        </form>
      </main>
    </div>
  )
}

export default Home
