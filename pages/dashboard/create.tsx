import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../auth.context';
import requestClient from '../../requestClient';

const Create: NextPage = () => {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const context = useContext(AuthContext)
  const router = useRouter();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = async (event: React.FormEvent) => {
    if (!file) {
      return;
    }
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    return await requestClient.post('/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        console.log(response.data.reference);
        return response.data.reference;
      })
      .catch((error) => {
        console.error(error);
        return;
      });
  }


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await handleUploadClick(event);
    if (response) {
      requestClient.post('/messages', {
        description,
        "recording_reference": response
      })
        .then(resp => {
          console.log(resp);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  const signout = () => {
    localStorage.removeItem('accessToken');
    router.push('/');
  }

  useEffect(() => {
    // checks if the user is authenticated
    !context.isAuthenticated && router.push("/");
    }, []);

  return (
    <div>
      <Head>
        <title>View Messages</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid gap-4 grid-cols-3 grid-rows-1">
        <div className='py-5 px-2 flex flex-col gap-4'>
          <nav className="bg-gray-800 text-white h-screen w-64 fixed left-0 top-0 bottom-0">
            <ul className="list-none p-0">
              <li className="py-2 px-4">
                <Link href="/dashboard/create" className="block text-gray-400 hover:text-white">Create Message</Link>
              </li>
              <li className="py-2 px-4">
                <Link href="/dashboard/view" className="block text-gray-400 hover:text-white">View Message</Link>
              </li>
              <li className="py-2 px-4">
                <a onClick={() => signout()} className="block text-gray-400 hover:text-white">Sign Out</a>
              </li>
            </ul>
          </nav>

        </div>
        <div className='py-5 col-span-2 w-80'>
          <form className='flex items-center justify-center flex-col' onSubmit={handleSubmit}>
            <div className='mt-4 flex items-start justify-center flex-col w-full'>
              <label htmlFor="username">Select Audio to Upload</label>
              <input required id='username' name="username"
                className='mt-2 max-w-xs py-4 px-2 border-black border-solid border-2 rounded shadow-sm'
                type={'file'} onChange={handleFileChange} placeholder="UserName"
                accept="audio/*" />
            </div>
            <div className='mt-4 flex items-start justify-center flex-col w-full'>
              <label htmlFor="description">Add Description Message</label>
              <textarea required id='description' name='description'
                value={description}
                className='mt-2 max-w-xs py-4 px-2 border-black border-solid border-2 rounded shadow-sm resize w-full'
                onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            </div>
            <button type="submit" className='rounded-md mt-4 bg-black text-white py-2 px-4'>Create Message</button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Create
