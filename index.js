const express = require('express')
const app = express()
const fetch = require('node-fetch')
const winston = require('winston')
const { URL, parse } = require('url')

const log_format = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
)

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: log_format,
    }),
  ],
})

const instance = validate_env('GITLAB_URL')
const private_token = validate_env('PRIVATE_TOKEN')
const port = process.env.PORT || 3000
const api_path = process.env.API_PATH || '/api/v4/application/statistics'
const api_url = new URL(api_path, instance)
const target = validate_url(api_url.href, ['http', 'https'])

function logRequest(req, res, next) {
  logger.info(
    req.ip + ' ' + req.method + ' ' + req.url + ' (user-agent: ' + req.get('user-agent') + ')'
  )
  next()
}
app.use(logRequest)

function logError(err, req, res, next) {
  logger.error(err)
  next()
}
app.use(logError)

logger.info(`Gitlab Statistics Prometheus Exporter launched for ${api_url.host}`)

function validate_env(env_name) {
  if (!process.env[env_name]) {
    logger.error(`Can not run without env: ${env_name}`)
    process.exit(1)
  }
  return process.env[env_name]
}

// https://stackoverflow.com/a/55585593/960623
function stringIsAValidUrl(s, protocols) {
  try {
    new URL(s)
    const parsed = parse(s)
    return protocols
      ? parsed.protocol
        ? protocols.map((x) => `${x.toLowerCase()}:`).includes(parsed.protocol)
        : false
      : true
  } catch (err) {
    return false
  }
}

function validate_url(url, p) {
  if (!stringIsAValidUrl(url, p)) {
    logger.error(`Please use a valide URL: ${url}`)
    process.exit(1)
  }
  return url
}

const json_to_metrics = (json) => {
  let metrics = ''
  let labels =
    typeof process.env.LABELS !== 'undefined' && process.env.LABELS !== ''
      ? `{${process.env.LABELS}}`
      : ''
  for (const [k, v] of Object.entries(json)) {
    const l1 = `# HELP gitlab_${k}_total The total number or ${k}`
    const l2 = `# TYPE gitlab_${k}_total gauge`
    const l3 = `gitlab_${k}_total${labels} ${v.replace(',', '')}`
    metrics += [l1, l2, l3].join('\n') + '\n'
  }
  return metrics
}

function serve_statistics(req, res) {
  fetch(target, { headers: { 'PRIVATE-TOKEN': private_token } })
    .then((res) => res.json())
    .then((json) => {
      res.type('text/plain; charset=utf-8')
      res.send(json_to_metrics(json))
    })
    .catch((e) => {
      logger.error(e)
      res.send('Internal Error')
    })
}
app.get('/', serve_statistics)
app.get('/metrics', serve_statistics)
app.get('/favicon.ico', (req, res) => res.sendStatus(204))
app.listen(port, () => {
  logger.info(`Gitlab Statistics Prometheus Exporter is listening on port ${port}`)
})
