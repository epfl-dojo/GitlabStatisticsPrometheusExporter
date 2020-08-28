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

app.get('/', (req, res) => {
  fetch(apiurl, { headers: {'PRIVATE-TOKEN': privateToken}})
    .then(res => res.json())
    .then(json => res.send(json))
    .catch( (e) => { 
      console.error(e)
      res.send("Internal Error")
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
