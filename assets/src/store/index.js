import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './types'
import { getTags, search } from '../api'

Vue.use(Vuex)

const state = {
  model: {},
  tags: [],
  loading: false,
  processing: false
}

const actions = {
  fetchTags ({commit, state}, payload) {
    commit(types.LOADING_BEGIN)
    commit(types.CLEAN_UP)
    getTags(payload.path, function (data) {
      commit(types.SET_TAGS, data)
      commit(types.LOADING_END)
    }, function (error) {
      console.log(error)
    })
  },
  searchData ({commit, state}, payload) {
    commit(types.LOADING_BEGIN)
    search(payload, function (data) {
      commit(types.SET_MODEL, data)
      commit(types.LOADING_END)
    }, function (error) {
      console.log(error)
    })
  }
}

const getters = {
  tags (state) {
    return state.tags
  },
  model (state) {
    return state.model
  },
  loading (state) {
    return state.loading
  }
}

const mutations = {
  [types.CLEAN_UP] (state, payload) {
    state.tags = []
    state.model = {}
  },
  [types.SET_TAGS] (state, payload) {
    state.tags = payload
  },
  [types.SET_MODEL] (state, payload) {
    state.model = payload.model
  },
  [types.LOADING_BEGIN] (state) {
    state.loading = true
  },
  [types.LOADING_END] (state) {
    state.loading = false
  },
  [types.PROCESS_BEGIN] (state) {
    state.processing = true
  },
  [types.PROCESS_END] (state) {
    state.processing = false
  }
}

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations
})
