import { Git } from "node-git-server"
import { join } from "path"
import express from "express"

const port =
  !process.env.PORT || isNaN(Number(process.env.PORT))
    ? 8000
    : parseInt(process.env.PORT)

const app = express()

const repos = new Git(join(__dirname, "../repos"))

repos.on("push", (push) => {
  console.log(`push ${push.repo}/${push.commit} ( ${push.branch} )`)
  push.accept()
})

repos.on("fetch", (fetch) => {
  console.log(`fetch ${fetch.commit}`)
  fetch.accept()
})

app.use("/git", (req, res) => {
  repos.handle(req, res)
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
