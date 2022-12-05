import Link from "next/link"
import { join } from "path"
import { Suspense } from "react"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"

const Readme = async ({ repo, branch, path }: { repo: string, branch: string, path: string }) => {
  const res = await fetch(`http://localhost:8000/repos/${repo}/file/${join(path, "README.md")}?branch=${branch}`)

  const data = await res.json()

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(data.content)

  const contentHtml = processedContent.toString()

  return (
    <div className="prose rounded-lg p-2 border" dangerouslySetInnerHTML={{ __html: contentHtml }} />
  )
}

const RepoPage = async ({ params: { repo, branch } }: { params: { repo: string, branch: string } }) => {
  const res = await fetch(`http://localhost:8000/repos/${repo}/branches`)

  const branches = await res.json()

  const isRepoEmpty = branches.length === 0

  branch = branch || branches[0]

  return (
    <div>
      {isRepoEmpty ? (
        <div className="min-h-screen w-full flex items-center justify-center">
          <div className="flex flex-col p-4 md:(w-1/2) lg:w-1/4">
            <h1 className="text-center font-bold text-lg mb-7">Repositório vazio</h1>
            <p className="text-center text-sm">Este repositório está vazio.</p>
            <Link href={`/repos/${repo}/upload`} className="text-center mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full">Enviar arquivo</Link>
          </div>
        </div>
      ) : (
        <>
          <ul>
            {branches.map((branch: string) => (
              <select key={branch} defaultValue={branch}>
                {branches.map((branch: string) => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            ))}
          </ul>
          <Suspense fallback={<div>Loading...</div>}>
            <Readme repo={repo} branch={branch} path="" />
          </Suspense>
        </>
      )
    }
    </div>
  )
}

export default RepoPage
