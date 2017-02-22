<template>
    <div class="panel">
        <div class="panel-heading">
            <p class="panel-title">
                <slot name="title"></slot>
            </p>

        </div>
        <div class="panel-body">
            <table class="table table-link">
                <thead>
                    <tr>
                        <th v-for="column in thead">
                            <div class="sortable" @click="sort(column)">
                                <span v-text="column.title"></span>
                                <div class="sortable-direction" v-if="query.column === column.key">
                                    <span class="fa fa-sort-amount-desc" v-if="query.direction === 'desc'"></span>
                                    <span class="fa fa-sort-amount-asc" v-else></span>
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <slot v-for="item in model" :item="item"></slot>
                </tbody>
            </table>
        </div>
        <div class="panel-footer">
            <div class="pagination">
                <span class="pagination-status">Showing {{model.from}} - {{model.to}} of {{model.total}}</span>
                <div class="pagination-controls">
                    <button class="btn" @click="prevPage" :disabled="!model.prev_page_url">&laquo; Prev</button>
                    <button class="btn" @click="nextPage" :disabled="!model.next_page_url">Next &raquo;</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
    export default {
      props: ['thead', 'resource', 'filter'],
      data () {
        return {
          query: {
            page: this.$route.query.page || 1,
            per_page: this.$route.query.per_page || 13,
            column: this.$route.query.column || 'id',
            direction: this.$route.query.direction || 'desc',
            search_column: this.$route.query.search_column || 'id',
            search_operator: this.$route.query.search_operator || 'equal_to',
            search_query_1: this.$route.query.search_query_1 || '',
            search_query_2: this.$route.query.search_query_2 || ''
          }
        }
      },
      computed: {
        model () {
          return this.$store.getters.model
        }
      },
      methods: {
        sort (column) {
          if (!column.sort) {
            return
          }
          if (this.query.column === column.key) {
            if (this.query.direction === 'desc') {
              this.query.direction = 'asc'
            } else {
              this.query.direction = 'desc'
            }
          } else {
            this.query.column = column.key
            this.query.direction = 'desc'
          }
          this.$router.push(this.link())
        },
        nextPage () {
          if (this.model.next_page_url) {
            this.query.page++
            this.$router.push(this.link())
          }
        },
        prevPage () {
          if (this.model.prev_page_url) {
            this.query.page--
            this.$router.push(this.link())
          }
        },
        search () {
          this.$store.dispatch('searchData', {
            values: this.value,
            path: 'search',
            redirect: 'search'
          })
        }
      }
    }
</script>
