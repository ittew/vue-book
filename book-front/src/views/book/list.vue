<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        clearable
        placeholder="书名"
        style="width: 200px;margin-right: 10px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-input
        v-model="listQuery.author"
        clearable
        placeholder="作者"
        style="width: 200px;margin-right: 10px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-select
        v-model="listQuery.category"
        placeholder="分类"
        clearable
        style="width: 200px;margin-right: 10px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.value"
          :label="item.label+'('+item.num+')'"
          :value="item.value"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="searchBtn"
      >
        查询
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        style="margin-left: 5px"
        @click="handleCreate"
      >
        新增
      </el-button>
      <el-checkbox
        v-model="showCover"
        class="filter-item"
        style="margin-left:5px;"
        @change="changeShowCover"
      >
        显示封面
      </el-checkbox>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="bookList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :default-sort="{prop: 'id', order: 'ascending'}"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
      />
      <el-table-column label="书名" min-width="200" align="center">
        <template slot-scope="{ row: { titleWrapper }}">
          <span v-html="titleWrapper" />
        </template>
      </el-table-column>
      <el-table-column label="作者" width="150" align="center">
        <template slot-scope="{ row: { authorWrapper }}">
          <span v-html="authorWrapper" />
        </template>
      </el-table-column>
      <el-table-column label="出版社" prop="publisher" width="150" align="center" />
      <el-table-column label="分类" prop="categoryText" width="100" align="center" />
      <el-table-column label="语言" prop="language" width="100" align="center" />
      <el-table-column v-if="showCover" label="封面图片" width="150" align="center">
        <template slot-scope="{row: { cover }}">
          <a :href="cover" target="_blank">
            <img
              :src="cover"
              style="width:120px;height:180px"
            >
          </a>
        </template>
      </el-table-column>
      <el-table-column label="文件名" prop="fileName" width="200" align="center" />
      <el-table-column label="上传人" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDt | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text" icon="el-icon-delete" style="color:#f56c6c" @click="handleDelete(row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getListData"
    />
  </div>
</template>
<script>
import waves from '../../directive/waves'
import Pagination from '../../components/Pagination'
import { parseTime } from '@/utils'
import { getCategory, getBookList, deleteBook } from '../../api/book'
export default {
  directives: {
    waves
  },
  components: {
    Pagination
  },
  filters: {
    valueFilter(value) {
      return value || '无'
    },
    timeFilter(time) {
      return time ? parseTime(time, '{y}-{m}-{d} {h}:{i}') : '无'
    }
  },
  data() {
    return {
      total: 0,
      tableKey: 'tab1',
      showCover: false,
      categoryList: [],
      listLoading: false,
      bookList: [],
      listQuery: {
        page: 1,
        pageSize: 20,
        sort: '+id'
      }
    }
  },
  mounted() {
    this.getListData()
    this.getCategoryData()
  },
  methods: {
    getListData() {
      this.listLoading = true
      getBookList(this.listQuery).then(res => {
        this.bookList = res.data.list
        this.total = res.data.count
        this.listLoading = false
        // 搜素内容高亮
        this.bookList.map(book => {
          book.titleWrapper = this.wrapperKeyword('title', book.title)
          book.authorWrapper = this.wrapperKeyword('author', book.author)
        })
      })
    },
    getCategoryData() {
      getCategory().then(res => {
        this.categoryList = res.data
      })
    },
    wrapperKeyword(k, v) { // 搜素内容高亮
      function highlight(value) {
        return `<span style="color: #1890ff">${value}</span>`
      }
      if (!this.listQuery[k]) {
        return v
      } else {
        return v.replace(new RegExp(this.listQuery[k], 'ig'), (v) => highlight(v))
      }
    },
    changeShowCover(value) {
      this.showCover = value
    },
    handleCreate() {
      this.$router.push('/book/create')
    },
    handleFilter() {
      this.getListData()
    },
    searchBtn() {
      this.listQuery.page = 1
      this.getListData()
    },
    sortChange(data) {
      const { prop, order } = data
      if (order === 'ascending') {
        this.listQuery.sort = `+${prop}`
      } else {
        this.listQuery.sort = `-${prop}`
      }
      this.handleFilter()
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该电子书, 是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBook(row.fileName).then(res => {
          this.$notify({
            title: '成功',
            message: res.msg || '删除成功',
            type: 'success',
            duration: 2000
          })
          this.handleFilter()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
