import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../auth.context';
import QRCodeGenerator from '../../qrcode.component';
import requestClient from '../../requestClient';
import Table from '../../table.component';

const View: NextPage = () => {
  const [content, setContent] = useState([]);
  const router = useRouter();
  const context = useContext(AuthContext)

  const getMessages = () => {
    requestClient.get('/messages?page=0&size=100')
      .then(resp => {
        const newArray = resp.data.content.map((content: any) => {
          return {
            id: content.id,
            description: content.description,
            reference: content.recording.reference,
            link: content.recording.url
          }
        });
        setContent(newArray);
      })
      .catch(err => {
        setContent([]);
        console.log(err);
      })
  }

  const signout = () => {
    localStorage.removeItem('accessToken');
    router.push('/');
  }

  useEffect(() => {
    // checks if the user is authenticated
    !context.isAuthenticated && router.push("/");
  }, []);

  useEffect(() => {
    getMessages();
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
        <div className='py-5 col-span-2'>
          <Table headers={['id', 'description', 'reference', 'link', 'Download QR']} content={content} renderRow={
            (row: any) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.description}</td>
                <td>{row.reference}</td>
                <td>{row.link}</td>
                <QRCodeGenerator link={`http://localhost:5000/messages/${row.id}`} />
              </tr>
            )
          } />
        </div>
      </main>
    </div>
  )
}

export default View
