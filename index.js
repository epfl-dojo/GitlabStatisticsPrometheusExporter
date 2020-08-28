const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const fetch = require('node-fetch');
const apiurl=process.env.GITLAB_URL+"/api/v4/application/statistics"
const privateToken = process.env.PRIVATE_TOKEN

// debug
console.log(process.env.PRIVATE_TOKEN)
console.log(process.env.GITLAB_URL)
console.log(apiurl)

function json_to_metrics(json) {
  let metrics = ""
  for (const [k, v] of Object.entries(json)) {
    const l1 = `# HELP gitlab_${k}_total The total number or ${k}`
    const l2 = `# TYPE gitlab_${k}_total counter`
    const l3 = `gitlab_${k}_total ${v.replace(",", "")}`
    metrics += [l1, l2, l3].join("\n") + "\n"
  }
  return metrics
}

app.get('/', (req, res) => {
  fetch(apiurl, { headers: {'PRIVATE-TOKEN': privateToken}})
  .then(res => res.json())
  .then(json => {
    res.type('text/plain; charset=utf-8')
    res.send(json_to_metrics(json))
  })
  .catch( (e) => { 
    console.error(e)
    res.send("Internal Error")
  })
})
app.get('/favicon.ico', (req, res) => res.sendStatus(204))
app.listen(port, () => {
  console.log(`Gitlab Metrics is listening on port ${port}`)
})
