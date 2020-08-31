# Gitlab Statistics Prometheus Exporter

<!-- TOC titleSize:2 tabSpaces:2 depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 skip:1 title:1 charForUnorderedList:* -->
## Table of Contents
* [About](#about)
  * [Note](#note)
* [Usage](#usage)
  * [Options](#options)
  * [Docker run](#docker-run)
  * [Docker-compose](#docker-compose)
  * [Pure node](#pure-node)
* [Output example](#output-example)
* [Development](#development)
  * [Guidelines](#guidelines)
<!-- /TOC -->


## About

This is a really simple prometheus exporter for Gitlab statistics.

It takes the Gitlab statistics from the API
(https://docs.gitlab.com/ce/api/statistics.html) and format them as prometheus
metrics.


### Note

You have to be an administrator in order to access to the Gitlab instance 
statistics. For that reason, the `PRIVATE_TOKEN` (aka Personal Access Tokens) 
your are using needs to be issued by an administrator. The scope is `api` 
(Grants complete read/write access to the API, including all groups and 
projects, the container registry, and the package registry).


## Usage

### Options

| Variable          |*| Description                                           |
|-------------------|-|-------------------------------------------------------|
| `PRIVATE_TOKEN`   |*| Gitlab private token, with admin access and api scope |
| `GITLAB_URL`      |*| The Gitlab instance to connect to                     |
| `API_PATH`        | | Default to `/api/v4/application/statistics`           |
| `PORT`            | | Internal port used. Default to `3000`                 |
| `LABELS`          | | Labels to be added to each metrics. Default `none`    |

`*` Mandatory


### Docker run

```
export PRIVATE_TOKEN='g1tLA8-pR1VatET0kEn';
export GITLAB_URL='https://gitlab.epfl.ch';
docker run -d \
           --name GitlabStatsExporter \
           -e PRIVATE_TOKEN=$PRIVATE_TOKEN \
           -e GITLAB_URL=$GITLAB_URL \
           -p 3000:3000 \
           epfldojo/gitlabstatisticsprometheusexporter
```


### Docker-compose

Copy the [docker-compose.yml](./docker-compose.yml) of this repository and run a
`docker-compose up -d`. The `PRIVATE_TOKEN` and `GITLAB_URL` environment
variables have to be set, see
[Environment variables in Compose](https://docs.docker.com/compose/environment-variables/)
to choose a way to do it.


### Pure node

Clone this
[repo](https://github.com/epfl-dojo/GitlabStatisticsPrometheusExporter) and run
`npm start`. The `PRIVATE_TOKEN` and `GITLAB_URL` environment variables have to
be set.


## Output example

```
$ http -b localhost:3000

# HELP gitlab_forks_total The total number or forks
# TYPE gitlab_forks_total counter
gitlab_forks_total 227
# HELP gitlab_issues_total The total number or issues
# TYPE gitlab_issues_total counter
gitlab_issues_total 2592
# HELP gitlab_merge_requests_total The total number or merge_requests
# TYPE gitlab_merge_requests_total counter
gitlab_merge_requests_total 4006
# HELP gitlab_notes_total The total number or notes
# TYPE gitlab_notes_total counter
gitlab_notes_total 67334
# HELP gitlab_snippets_total The total number or snippets
# TYPE gitlab_snippets_total counter
gitlab_snippets_total 47
# HELP gitlab_ssh_keys_total The total number or ssh_keys
# TYPE gitlab_ssh_keys_total counter
gitlab_ssh_keys_total 1767
# HELP gitlab_milestones_total The total number or milestones
# TYPE gitlab_milestones_total counter
gitlab_milestones_total 89
# HELP gitlab_users_total The total number or users
# TYPE gitlab_users_total counter
gitlab_users_total 2091
# HELP gitlab_projects_total The total number or projects
# TYPE gitlab_projects_total counter
gitlab_projects_total 2942
# HELP gitlab_groups_total The total number or groups
# TYPE gitlab_groups_total counter
gitlab_groups_total 324
# HELP gitlab_active_users_total The total number or active_users
# TYPE gitlab_active_users_total counter
gitlab_active_users_total 2086
```


## Development

List a commands that can be used in a development cycle:

  * Remove existing image:  
    `docker rm -f GitlabStatsExporter`
  * Build image:  
    `docker build -t epfldojo/gitlabstatisticsprometheusexporter .`
  * Run image:  
```
docker run -d \
           --name GitlabStatsExporter \
           -e PRIVATE_TOKEN=$PRIVATE_TOKEN \
           -e GITLAB_URL=$GITLAB_URL \
           -p 3000:3000 \
           epfldojo/gitlabstatisticsprometheusexporter
```
  * Check the logs:  
    `docker logs -f GitlabStatsExporter`
  * Send a request:  
    `http localhost:3000`
  * Tag image:  
    `docker tag epfldojo/gitlabstatisticsprometheusexporter:latest epfldojo/gitlabstatisticsprometheusexporter:v$(jq -r ".version" package.json)`
  * Push image:  
    `docker push epfldojo/gitlabstatisticsprometheusexporter:latest; docker push epfldojo/gitlabstatisticsprometheusexporter:v$(jq -r ".version" package.json)`

### Guidelines

  * [writing exporters](https://prometheus.io/docs/instrumenting/writing_exporters/)
  * [best practices on metric naming](https://prometheus.io/docs/practices/naming/)