import { NextPage } from "next"
import Link from "next/link"

const HomePage: NextPage = () => {
  return (
    <div>
      <Link role="button" href="/create_repo" className="no-underline text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Criar repositório</Link>
    </div>
  )
}

export default HomePage
