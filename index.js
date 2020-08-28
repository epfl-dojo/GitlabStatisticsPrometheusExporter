const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const fetch = require('node-fetch');

const apiurl=process.env.GITLAB_URL+"/api/v4/application/statistics"

app.get('/', (req, res) => {
	fetch(apiurl)
    	.then(res => res.json())
    	.then(json => res.send(json))
    	.catch( (e) => { res.send("Internal Error")})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
