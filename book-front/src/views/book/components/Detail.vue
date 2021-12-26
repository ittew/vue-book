<template>
  <div class="detail">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar ' + postForm.status">
        <el-button v-if="!isEdit" @click.prevent.stop="showGuide">显示帮助</el-button>
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          {{ isEdit ? '编辑电子书' : '新增电子书' }}
        </el-button>
      </sticky>
      <div class="detail-container">
        <el-row>
          <Warning />
          <el-col :span="24">
            <ebook-upload
              :file-list="fileList"
              :disabled="isEdit"
              @onSuccess="onUploadSuccess"
              @onRemove="onUploadRemove"
            />
          </el-col>
          <el-col :span="24">
            <el-form-item prop="title">
              <MdInput v-model="postForm.title" :maxlength="100" name="name" required>
                书名
              </MdInput>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="作者：" :label-width="labelWidth">
                  <el-input
                    v-model="postForm.author"
                    placeholder="作者"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="出版社：" :label-width="labelWidth">
                  <el-input
                    v-model="postForm.publisher"
                    placeholder="出版社"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="语言：" :label-width="labelWidth">
                  <el-input
                    v-model="postForm.language"
                    placeholder="语言"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="根文件：" :label-width="labelWidth">
                  <el-input
                    v-model="postForm.rootFile"
                    placeholder="根文件"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="文件路径：" :label-width="labelWidth">
                  <el-input
                    v-model="postForm.filePath"
                    placeholder="文件路径"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="解压路径：" :label-width="labelWidth">
                  <el-input
                    v-model="postForm.unzipPath"
                    placeholder="解压路径"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="封面路径：" :label-width="labelWidth">
                  <el-input
                    v-model="postForm.filePath"
                    placeholder="封面路径"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="文件名称：" :label-width="labelWidth">
                  <el-input
                    v-model="postForm.unzipPath"
                    placeholder="文件名称"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="封面：" :label-width="labelWidth">
                  <a v-if="postForm.cover" :href="postForm.cover" target="_blank">
                    <img :src="postForm.cover" class="preview-img">
                  </a>
                  <span v-else>无</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="目录：" :label-width="labelWidth">
                  <div v-if="postForm.contents && postForm.contents.length > 0" class="contents-wrapper">
                    <el-tree />
                  </div>
                  <span v-else>无</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>
import Sticky from '../../../components/Sticky'
import Warning from './Warning'
import { validURL } from '@/utils/validate'
import EbookUpload from '../../../components/EbookUpload'
import MdInput from '../../../components/MDinput'

export default {
  components: { Sticky, Warning, MdInput, EbookUpload },
  props: {
    isEdit: Boolean
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      loading: false,
      postForm: {
        ebook_uri: ''
      },
      fileList: [],
      labelWidth: '120px',
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      }
    }
  },
  methods: {
    onUploadSuccess() {
      console.log('onUploadSuccess')
    },
    onUploadRemove() {
      console.log('onUploadRemove')
    },
    submitForm() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    showGuide() {
      console.log('show guide...')
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .detail {
    position: relative;
    .detail-container {
      padding: 40px 45px 20px 50px;
      .preview-img {
        width: 200px;
        height: 270px;
      }
      .contents-wrapper {
        padding: 5px 0;
      }
    }
  }
</style>
