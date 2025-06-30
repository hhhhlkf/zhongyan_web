<!--
 * @Autor: pmy
 * @Date: 2021-12-23 16:24:05
 * @LastEditTime: 2023-10-24 15:15:47
 * @LastEditors: pmy
 * @Description: 上传图片组件
 * @FilePath: \bdcar-net\src\components\ImageUpload\index.vue
-->
<template>
  <div class="container">
    <ul v-if="Array.isArray(props.pictures)" class="el-upload-list--picture-card">
      <li class="el-upload-list__item" v-for="(item, index) in props.pictures" :key="index" :ref="'img_li_' + index">
        <el-image :ref="'img_' + index" :src="getImgSrc(item)" style="width:100%;height:100%">
        </el-image>
        <div class="item-actions">
          <el-icon>
            <ZoomIn title="查看" @click="handleImage('check', item, index)" />
          </el-icon>
          <el-icon>
            <Delete v-if="!props.disabled" title="删除" @click="handleImage('delete', item, index)" />
          </el-icon>
        </div>
      </li>
    </ul>
    <el-upload v-if="!props.disabled" class="avatar-uploader" action="" :accept="getAccept" :on-change="handleChange"
      list-type="picture-card" ref="uploadImgRef" :on-exceed="uploadExceed" :auto-upload="false" :on-remove="handleRemove"
      :on-preview="handlePictureCardPreview">
      <el-icon>
        <Plus />
      </el-icon>
    </el-upload>
    <el-dialog v-model="dialogVisible" title="图片查看">
      <div style="width:100%;height:600px">
        <img w-full :src="dialogImageUrl" alt="图片查看" style="width:100%;height:100%" />
      </div>
    </el-dialog>
    <div v-show="!props.disabled" class="remark-str">{{ props.remarkStr }}</div>
  </div>
</template>
<script setup>
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}
import request from "@/utils/request"
import { computed } from 'vue';
const { proxy } = getCurrentInstance();
let imgFile = [];
// 存储移除的照片，提交之前用于筛选给出最后的图片结果数组
let deleteFile = [];
const count = ref(0);
const props = defineProps({
  pictures: { type: Array, require: true },// 需要展示的图片数组
  url: { type: String, require: true }, //上传使用的方法
  limit: { type: Number, default: 3, }, // 限制上传个数
  accept: { type: Array, default: () => [] }, // 上传格式限制
  require: { type: Boolean, default: false, }, // 是否必须上传
  rank: { type: Number, default: 0, }, // 一个页面多次使用组件的时候，主动排序
  disabled: { type: Boolean, default: false, },
  remarkStr: { type: String, default: '图片格式支持.png .jpg .gif .jpeg', },
});
const { url, limit, accept, require } = props;
const imgList = ref([]);
function initData() {
  imgFile = [];
  deleteFile = [];
  count.value = 0
  count.value += props.pictures?.length;
  if (count.value >= limit) {
    nextTick(() => {
      if (document.getElementsByClassName('el-upload--picture-card').length > 0) {
        document.getElementsByClassName('el-upload--picture-card')[props.rank].style.display = 'none';
      }
    })
  }
}
watch(props, (val) => {
  initData();
}, {
  immediate: true,
  deep: true,
})
function getImgSrc(val) {
  if (val && val.path) {
    return import.meta.env.VITE_APP_BASE_API + val.path;
  }
  else return "";
}
function handleImage(operation, item, index) {
  let myRef;
  switch (operation) {
    case 'check':
      handlePictureCardPreview({ url: getImgSrc(item) });
      break;
    case 'delete':
      handleRemove();
      myRef = 'img_li_' + index;
      proxy.$refs[myRef][0].style.display = 'none';
      deleteFile.push(item);
      break;
    default:
      break;
  }
}
//上传照片-限制数量
function handleChange(file, fileList) {
  count.value++;
  imgFile = fileList;
  if (count.value >= limit) {
    let dom = document.getElementsByClassName('el-upload--picture-card')[props.rank]
    dom.style.display = 'none';
  }
}
//上传照片-移除限制
function handleRemove() {
  count.value--;
  if (limit > 0) {
    if (count.value < limit) {
      let dom = document.getElementsByClassName('el-upload--picture-card')[props.rank];
      dom.style.display = 'inline-flex';
    }
  }
}
async function uploadData(data) {
  return request({
    method: 'post',
    url: url,
    data: data,
  });
}
// 调用该方法返回Promise对象，得到提交的路径
function uploadInfo() {
  if (require && count.value === 0) {
    proxy.$modal.msgError({ message: `请上传图片` });
    // 后续操作在调用处接catch()执行
    return Promise.resolve(false)
  }
  const p = new Promise((resolve, reject) => {
    let uploadImg = new FormData(), imgPath = [];
    props.pictures.forEach(v => {
      if (!deleteFile.some(vv => v === vv)) {
        imgPath.push(v);
      }
    })
    if (imgFile.length > 0) {
      // 验证后缀格式
      if (accept.length > 0) {
        let isAccept = true;
        imgFile.forEach(el => {
          let suffix = el.name.split('\.');
          accept.includes(suffix[suffix.length - 1]) || (isAccept = false);
        })
        if (!isAccept) {
          proxy.$modal.msgError({ message: `请上传${accept.toString()}格式的图片` });
          return Promise.reject()
        }
      }
      // 放进formData上传图片
      imgFile.forEach(file => {// 因为要上传多个文件，所以需要遍历
        uploadImg.append('file', file.raw, file.name);
      })
      uploadData(uploadImg).then(result => {
        if (result.code == 200) {
          for (let val of result.data) {
            imgPath.push({ path: val });
          }
        }
        resolve(imgPath);
      })
    } else {
      resolve(imgPath);
    }
  })
  return p
}
function uploadExceed() {
  proxy.$modal.msgError({ message: `最多上传${limit}张图片` });
}
const getAccept = computed(() => {
  let accepts = '';
  accept.forEach(el => {
    accepts += ('.' + el + ',')
  })
  return accepts.slice(0, accepts.length)
})
defineExpose({
  uploadInfo,
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: start;
  position: relative;

  .remark-str {
    color: red;
    position: absolute;
    width: fit-content;
    width: max-content;
    bottom: -30px;
  }

  .item-actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-transition: opacity 0.3s;
    transition: opacity 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      opacity: 1;
    }

    i {
      cursor: pointer;
      margin: auto 8px;
    }
  }
}

:deep(.el-upload--picture-card) {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  i {
    width: 100%;
    height: 100%;
    margin: auto;
  }
}
</style>