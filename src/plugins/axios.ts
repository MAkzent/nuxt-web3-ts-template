import humps from 'humps'

export default ({ $axios }) => {
  $axios.setHeader('Content-Type', 'application/json', ['post'])

  $axios.onRequest((config) => {
    config.data = humps.decamelizeKeys(config.data)
  })

  $axios.onResponse((response) => {
    response.data = humps.camelizeKeys(response.data)
  })
}
