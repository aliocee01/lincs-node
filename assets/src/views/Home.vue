<template>
  <div class="home">
    <h1><span> <img src="../assets/logo.png" style="width: 38px; height: 38px;"></span> {{ msg }}</h1>
    <h5>gene expression profiles</h5>
    <br>

    <div class="container">
      <div class="row">

        <div class="col-sm-8 col-sm-offset-2">
          <div class="col-sm-11">
             <multiselect
                v-model="value"

                :options="options"

                :multiple="true"

                :close-on-select="true"

                :hide-selected="true"

                placeholder="Search by perturbation, cell-line, time point or dose"

                label="tag"

                MaxHeight="50"

                @input="clearTable"

                track-by="tag">

            </multiselect>
          </div>
          <div class="col-sm-1">

             <div class="form-group">
                <button @click.prevent="search" type="button" class="mb-sm btn btn-lg bg-danger"><strong><i class="fa fa-search" aria-hidden="true"></i></strong></button>
             </div>

          </div>
          <div class="clearfix"> </div>

          <fieldset></fieldset>
          <div class="table-head" v-show="show">
          <table class="table" style="width: 740px;" >
            <thead>
                <tr>
                    <th>
                        L1000 COLUMN ID
                    </th>
                    <th width="35%">
                        COMPOUND
                    </th>
                    <th width="15%">
                        DOSE
                    </th>
                    <th width="15%">
                        TIME
                    </th>
                    <th width="2%" class="text-center">
                        <input class="custom" type="checkbox" v-model="selectAll" >
                    </th>
                </tr>
            </thead>
          </table>
        </div>
          <div id="scroll" class="table-responsive" v-show="show" @scroll="onScroll">
            <table class="table" style="width: 740px;" >

                  <tbody>
                    <tr v-for="item in model.docs" >

                        <td >{{item.det_plate.split('_', 3).join('_') }}</td>
                        <td width="35%">{{item.SM_Name }}</td>
                        <td width="15%">
                          <span v-if="item.SM_Dose !== '-666.00'">{{item.SM_Dose }}{{item.SM_Dose_Unit }} </span>
                          <span v-else>-</span>
                        </td>
                        <td width="15%">
                          <span v-if="item.SM_Time !== '-666.00'">{{item.SM_Time}}{{item.SM_Time_Unit }} </span>
                          <span v-else>-</span>
                        </td>
                        <td width="2%" class="text-center"><input class="custom" type="checkbox" v-model="selected" :value="item.id"></td>
                    </tr>
                    <tr class="spinner">
                        <td colspan="3" class="text-center">
                          <img src="../assets/spinner.gif" style="width: 38px; height: 38px;">
                        </td>
                    </tr>
                  </tbody>
                  <tfooter
              </table>



              <!-- <ul v-for="item in model.docs" >

                  <li>{{item.det_plate }}</li>

              </ul> -->

            </div>
            <div class="foot col-sm-12" v-show="show">
                  <div class="col-sm-6"> Showing: {{count}}  of {{model.total}} profile(s)</div>
                  <div class="col-sm-6">
                    <a class="label label-success bg-danger pull-right download" @click.prevent="download">
                      Download
                      <span v-if="selected.length">{{selected.length}}</span>
                    </a>
                  </div>
            </div>

        </div>
        </div>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery'
import axios from 'axios'
import Multiselect from 'vue-multiselect'
export default {
  name: 'home',
  data () {
    return {
      msg: 'L1000 Data',
      value: [],
      show: false,
      selected: [],
      model: {
        docs: [],
        limit: 50,
        page: 1,
        total: 0
      },
      count: 50,
      loading: false
    }
  },
  computed: {
    options () {
      return this.$store.getters.tags
    },
    selectAll: {
      get: function () {
        return this.model.docs ? this.selected.length === this.model.docs.length : false
      },
      set: function (value) {
        var selected = []
        if (value) {
          this.model.docs.forEach(function (item) {
            selected.push(item.id)
          })
        }
        this.selected = selected
      }
    }
  },
  watch: {
    '$route': 'fetchData'
  },
  created () {
    this.fetchData()
  },
  methods: {
    onScroll (e) {
      let wrapper = e.target
      let list = wrapper.firstElementChild

      let scrollTop = wrapper.scrollTop
      let wrapperHeight = wrapper.offsetHeight
      let listHeight = list.offsetHeight

      let diffHeight = listHeight - wrapperHeight

      if (diffHeight <= scrollTop && !this.loading) {
        this.load()
      }
    },
    fetchData () {
      this.$store.dispatch('fetchTags', {
        path: 'tags'
      })
    },
    load () {
      let vm = this

      if (this.value.length === 0) {
        return
      }

      this.loading = true

      let params = {
        values: vm.value,
        limit: vm.model.limit,
        page: vm.model.page
      }
      axios.post('http://localhost:3000/api/search', params)
        .then(function (response) {
          let model = response.data.model
          let docs = model.docs

          console.log(model.page)
          vm.model.docs = vm.model.docs.concat(docs)
          vm.model.limit = model.limit
          vm.model.page++
          vm.count += vm.model.limit
          vm.model.total = model.total
          vm.loading = false
        })
        .catch(function (error) {
          console.log(error)
          vm.loading = false
        })
      this.fetchData()
      this.show = true
    },
    search () {
      let vm = this
      if (this.value.length === 0) {
        return
      }

      vm.model = {
        docs: [],
        limit: 50,
        page: 1,
        count: 0,
        total: 0
      }

      vm.count = 0

      console.log(this.count)

      let params = {
        values: vm.value,
        limit: 50,
        page: 1
      }
      axios.post('http://localhost:3000/api/search', params)
        .then(function (response) {
          vm.model = response.data.model
          vm.count = 50
        })
        .catch(function (error) {
          console.log(error)
          vm.loading = false
        })
      this.fetchData()
      this.show = true
    },
    clearTable () {
      if (this.value.length === 0) {
        this.show = false
        this.model = {
          docs: [],
          limit: 50,
          page: 1,
          count: 0,
          total: 0
        }
      }
    },
    download () {
      axios.post('http://localhost:3000/api/download', this.selected)
        .then(function (response) {
          console.log('Downloaded!')
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  components: { Multiselect }
}
</script>

<style>
/*.multiselect__tag {background: #84c65e !important;}
.multiselect__tags {border-color: #2EBEB1 !important;}
.multiselect__tag-icon:focus, .multiselect__tag-icon:hover {background: #83b267 !important;}
.multiselect__option--highlight {background: #84c65e !important;}
.multiselect__option--highlight{background:#84c65e !important;}
.multiselect__option--highlight:after{content:attr(data-select);background:#84c65e !important;}*/

/*.multiselect__tag {background: #4A9ECA !important;}
.multiselect__tags {border-color: #4A9ECA !important;}
.multiselect__tag-icon:after{color: #fff !important; }
.multiselect__tag-icon:focus, .multiselect__tag-icon:hover {background: #3d94c0 !important;}
.multiselect__option--highlight {background: #4A9ECA !important;}
.multiselect__option--highlight{background:#4A9ECA !important;}
.multiselect__option--highlight:after{content:attr(data-select);background:#4A9ECA !important;}*/


.multiselect__tag {background: #ED4D4D !important;}
.multiselect__tags {border-color: #4A9ECA !important;}
.multiselect__tag-icon:after{color: #fff !important; }
.multiselect__tag-icon:focus, .multiselect__tag-icon:hover {background: #964141 !important;}
.multiselect__option--highlight {background: #ED4D4D !important;}
.multiselect__option--highlight{background:#ED4D4D !important;}
.multiselect__option--highlight:after{content:attr(data-select);background:#ED4D4D !important;}

h1 span img{ margin: -10px 0 0 0;}

.table{
  text-align: left;
  margin: 0 auto;
}

.sortable {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    cursor: pointer;
}

.btn-warning {
    color: #fff;
    background-color: #ED5353;
    border-color: #e95252;
    text-align: left;
    border-radius: 6px;
    font-size: 20px;
}

.btn-warning:hover, .btn-warning:after, .btn-warning:active:hover, .btn-warning.focus, .btn-warning:focus {
    color: #fff;
    background-color: #f24d4d;
    border-color: #e95252;
}

.table-responsive {
    max-height: 790px;
    overflow-y: auto;
    overflow: scroll;
}

.table>tbody>tr>td{
    /*padding: 3px 8px;
    font-family: inherit;
    font-weight: 500;
    line-height: 1.1;
    color: inherit;
    font-size: 10px;*/
    border-top: 1px dashed #ddd;
}

.foot {
  text-align: left;
  padding: 0;
  margin: 20px 0;
}

.download{
  padding: 4px 8px;
}



</style>
