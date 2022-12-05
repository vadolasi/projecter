import { Git } from "node-git-server"
import { join, dirname } from "path"
import express from "express"
import git from "isomorphic-git"
import fs from "fs"
import { fileTypeFromBuffer } from "file-type"
import { fileURLToPath } from "url"
import cors from "cors"

const port =
  !process.env.PORT || isNaN(Number(process.env.PORT))
    ? 8000
    : parseInt(process.env.PORT)

const app = express()
app.use(cors())

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const repos = new Git(join(__dirname, "../repos"), { autoCreate: false })

repos.on("push", (push) => {
  push.accept()
})

repos.on("fetch", (fetch) => {
  fetch.accept()
})

app.use("/git", (req, res) => {
  repos.handle(req, res)
})

app.get("/repos/:repo/files", async (req, res) => {
  const repo = req.params.repo
  const branch = req.query.branch.toString() || "master"

  const gitdir = join(__dirname, "../repos", repo)

  const files = await git.listFiles({ fs, gitdir, ref: branch })

  res.json(files)
})

app.get("/repos/:repo/branches", async (req, res) => {
  const repo = req.params.repo

  const gitdir = join(__dirname, "../repos", repo)

  const branches = await git.listBranches({ fs, gitdir })

  res.json(branches)
})

app.get("/repos/:repo/file/:file", async (req, res) => {
  const repo = req.params.repo
  const branch = req.query.branch.toString() || "main"
  const file = req.params.file

  const gitdir = join(__dirname, "../repos", repo)

  let blob: Uint8Array

  try {
    const result = await git.readBlob({
      fs,
      gitdir,
      oid: await git.resolveRef({ fs, gitdir, ref: branch }),
      filepath: file
    })

    blob = result.blob
  } catch (e) {
    return res.status(404).end()
  }

  const content = Buffer.from(blob)

  if (content.toString("utf8").length === content.length) {
    res.send({ content: content.toString("utf8") })
  } else {
    const type = await fileTypeFromBuffer(content)

    res.send({ content: content.toString("base64"), type })
  }
})

app.post("/repos/:repo", async (req, res) => {
  const repo = req.params.repo
  const repoPath = join(__dirname, "../repos", repo)

  if (fs.existsSync(repoPath)) {
    res.status(400).json({ error: "Repo already exists" })
    return
  }

  await git.init({
    fs,
    dir: repoPath,
    bare: true
  })

  res.json({ success: true })
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
