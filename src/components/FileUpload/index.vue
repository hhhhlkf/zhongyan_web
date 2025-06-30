<template>
    <template v-if="!readOnly">
        <el-upload action="#" class="upload-demo" ref="fileUpload" :before-upload="handleBeforeUpload"
            :http-request="uploadFile" :before-remove="beforeRemove">
            <template #trigger>
                <el-button size="small" type="primary">选取文件</el-button>
            </template>
            <template #tip>
                <div class="el-upload__tip">{{ placeholder }}</div>
            </template>
        </el-upload>
        <ul class="el-upload-list el-upload-list--text">
            <li class="el-upload-list__item is-ready" v-for="(v, i) in lastFileList" :key="i">
                <div class="el-upload-list__item-info">
                    <a class="el-upload-list__item-name">
                        <el-icon>
                            <Document />
                        </el-icon>
                        {{ v.name }}
                    </a>
                </div>
                <el-icon @click="deleteFile(v)">
                    <Close />
                </el-icon>
            </li>
        </ul>
    </template>
    <ul v-else class="el-upload-list el-upload-list--text">
        <li class="el-upload-list__item is-ready" v-for="(v, i) in lastFileList" :key="i">
            <div class="el-upload-list__item-info">
                <a class="el-upload-list__item-name">
                    <el-icon>
                        <Document />
                    </el-icon>
                    {{ v.name }}
                </a>
            </div>
        </li>
    </ul>
</template>
<script setup>
const { pFileList, placeholder, limit, accept, readOnly } = defineProps({
    //父节点传递的文件集合
    pFileList: { typeof: Array, default: () => [] },
    placeholder: { typeof: String, default: "可上传文件，推荐pdf、word等", },
    // 限制上传个数
    limit: { type: Number, default: 1, },
    accept: { type: Array, default: () => [] },
    readOnly: { type: Boolean, default: false },
});
const { proxy } = getCurrentInstance();

//编辑的时候已存在的文件
const lastFileList = ref([]);
const fileList = ref([]);

lastFileList.value = JSON.parse(JSON.stringify(pFileList))

function beforeRemove(file) {
    fileList.value.forEach((v, index, array) => {
        if (v.name == file.name) {
            array.splice(v, 1)
        }
    })
}
function uploadFile(httpRequest) {
    const _file = httpRequest.file
    fileList.value.push(_file);
}
function handleBeforeUpload(_file) {
    const suffix = _file.name.split('\.')
    if (fileList.value.length + lastFileList.value.length >= limit) {
        proxy.$modal.msgError("只能上传" + limit + "个文件！");
        return false
    }
    if (accept.length > 0 && accept.indexOf(suffix[suffix.length - 1]) === -1) {
        proxy.$modal.msgError("只能上传" + accept.join() + "文件！");
        return false
    }
    return true
}
function deleteFile(obj) {
    //从数组中获取对象的索引
    function getIndexInArr(_arr, _obj) {
        var len = _arr.length;
        for (var i = 0; i < len; i++) {
            if (_arr[i].path == _obj.path) {
                return i;
            }
        }
        return -1;
    };
    lastFileList.value.splice(getIndexInArr(lastFileList.value, obj), 1);
}
// 提交文件
function uploadInfo() {
    if (fileList.value.length > 0) {
        return fileList.value;
    } else {
        return false;
    }
}
defineExpose({
    uploadInfo,
    lastFileList
})
</script>
<style lang="scss" scoped>
.el-upload__tip {
    width: max-content;
    margin-top: 0;
    margin-left: 20px;
}

.el-upload-list {
    margin: 0;
}
</style>