import type { NextPage } from 'next'
import Link from 'next/link'
import { Layout } from '../src/components/core/layout'
const Home: NextPage = () => {
  return (
      <Layout>
        <div className="flex flex-col align-middle text-center space-y-8 my-auto">
          <h1 className="text-6xl font-bold">LIST YOUR SERIES</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores ex, accusamus laudantium odit, laboriosam voluptate in commodi ab ad incidunt et excepturi voluptatem beatae! Eius quam esse beatae magni dicta?</p>
          <Link href="/app">
            <a className="lg:mx-96 bg-gray-800 px-8 py-4 text-xl text-white font-bold rounded-lg active:brightness-90">MAKE YOUR LIST</a>
          </Link>
        </div>
      </Layout>
  )
}

export default Home
