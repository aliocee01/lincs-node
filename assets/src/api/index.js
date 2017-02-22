import axios from 'axios'

export function getTags (path, success, fail) {
  axios.get(`http://localhost:3000/api/${path}`)
    .then(function (response) {
      success(response.data)
    })
    .catch(function (error) {
      fail(error)
    })
}

export function search (payload, success, fail) {
  axios.post(`http://localhost:3000/api/${payload.path}`, payload.values)
    .then(function (response) {
      success(response.data)
    })
    .catch(function (error) {
      fail(error)
    })
}
