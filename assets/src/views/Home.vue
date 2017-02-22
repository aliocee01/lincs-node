<template>
  <div class="home">
    <h1><span> <img src="../assets/logo.png" style="width: 48px; height: 48px;"></span> {{ msg }}</h1>
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
                <button @click.prevent="search" type="button" class="mb-sm btn btn-warning"><strong><i class="fa fa-search" aria-hidden="true"></i></strong></button>
             </div>

          </div>
          <div class="clearfix"> </div>

          <fieldset></fieldset>

          <div class="table-responsive" v-show="show">
            <table class="table" style="width: 740px;" >
                  <thead>
                      <tr>
                          <th>
                              L1000 COLUMN ID
                          </th>
                          <th width="25%">
                              COMPOUND
                          </th>
                          <th width="2%">
                              <input class="custom" type="checkbox" v-model="selectAll" >
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in model" >

                        <td>{{item.det_plate }}</td>
                        <td>{{item.SM_Name }}</td>
                        <td><input class="custom" type="checkbox" v-model="selected" :value="item._id"></td>

                    </tr>
                  </tbody>
              </table>

            </div>
        </div>
        </div>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery'
import Multiselect from 'vue-multiselect'
export default {
  name: 'home',
  data () {
    return {
      msg: 'L1000 Data',
      value: [],
      show: false,
      thead: [
          { title: 'ID', key: '_id', sort: true },
          { title: 'Matrix Column', key: 'id', sort: true }
      ],
      selected: [],
      query: {
        page: this.$route.query.page || 1,
        per_page: this.$route.query.per_page || 13
      }
    }
  },
  computed: {
    model () {
      return this.$store.getters.model
    },
    options () {
      return this.$store.getters.tags
    },
    selectAll: {
      get: function () {
        return this.model ? this.selected.length === this.model.length : false
      },
      set: function (value) {
        var selected = []
        if (value) {
          this.model.forEach(function (item) {
            selected.push(item._id)
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
    fetchData () {
      this.$store.dispatch('fetchTags', {
        path: 'tags'
      })
    },
    search () {
      if (this.value.length === 0) {
        return
      }
      this.$store.dispatch('searchData', {
        values: this.value,
        path: 'search',
        redirect: 'search'
      })
      this.fetchData()
      this.show = true
    },
    clearTable () {
      if (this.value.length === 0) {
        this.show = false
      }
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


</style>
