<template>
    <div class="informationServiceInfo" :class="{ active: props.infoShow }">
        <div class="title">
            <div class="select">
                <el-select v-model="activeType" placeholder="全部" suffix-icon="CaretBottom">
                    <el-option v-for="item in options" :key="item.type" :label="item.label" :value="item.type" />
                </el-select>
            </div>
            <svg class="close" @click="close" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"
                fill="none">
                <path
                    d="M10.9494 8.99999L15.4527 4.49661C15.7913 4.15799 15.8491 3.6667 15.5819 3.39962L14.6 2.41772C14.3328 2.15054 13.8422 2.20915 13.503 2.54755L9.00008 7.05081L4.49682 2.54766C4.1582 2.2087 3.66691 2.15054 3.39972 2.41806L2.41782 3.40007C2.15074 3.66681 2.20857 4.1581 2.54764 4.49672L7.05102 8.99999L2.54764 13.5036C2.20913 13.842 2.15052 14.3329 2.41782 14.6001L3.39972 15.5821C3.66691 15.8493 4.1582 15.7914 4.49682 15.4529L9.00031 10.9493L13.5031 15.4522C13.8423 15.7915 14.3329 15.8493 14.6001 15.5821L15.582 14.6001C15.8491 14.3329 15.7913 13.842 15.4529 13.5031L10.9494 8.99999Z"
                    fill="white" />
            </svg>
        </div>
        <div class="tableDiv">
            <div class="trBox" v-for="item in tableList" :key="item.type" @click="toMap(item)">
                <div class="label">
                    <img class="img" :src="getImg(imgObj[item.type])" alt="">
                    <span>{{ item.name }}</span>
                </div>
                <!-- <div class="position">{{ item.position || '---' }}</div> -->
                <div class="position">{{'---' }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>

let props = defineProps(['infoShow', 'infoType', 'onClick', 'close', 'active'])
let imgObj = {
    '1': 'remoteSensingImage',
    '2': 'obliquePhotography',
    '3': 'pointCloud',
    '4': 'infraredData',
    '5': 'glimmerData',
    '6': 'panoramicData',
    '7': 'video',
    '8': 'photograph',
    '11': 'partitioningAlgorithm',
    '12': 'recognitionAlgorithm',
    '13': 'exponentialAlgorithm',
    '14': 'geologicalMonitoringAlgorithm',
    '15': 'soilMoistureContentAlgorithm',
    '16': 'growthAnalysisAlgorithm',
}

const activeType = ref('')
let activeService = ref(1)
const options = ref([])

let tableList = ref([])

function getImg(name) {
    return new URL(`../../../assets/img/bigScreen/informationServiceInfo/${name}.png`, import.meta.url).href;
}

function getOptions() {
    options.value = [];
    let obj = {
        tap: activeService.value
    }
    
}

function toMap(obj) {

    props.onClick(obj)
}

function close() {
    props.close()
}

function getTableList() {
    
}

onMounted(() => {
    getOptions()
})
watch(
    props,
    (newValue, oldValue) => {
        if (props.infoType) {
            activeType.value = props.infoType
        } else {
            activeType.value = ''
        }
        if (props.active) {
            activeService.value = props.active
        }
    },
)
watch(
    activeType,
    (newValue, oldValue) => {
        getTableList()
    },
)

watch(
    activeService,
    (newValue, oldValue) => {
        getOptions()
    },
)
</script>
<style lang="scss" scoped>
.informationServiceInfo {
    width: 405px;
    padding: 10px;
    position: absolute;
    top: 96px;
    bottom: 36px;
    left: 45px;
    box-sizing: border-box;
    background: rgba(4, 25, 66, 0.70);
    box-shadow: 0px 0px 47px 0px rgba(51, 136, 255, 0.28) inset, 0px 0px 13px 0px rgba(51, 136, 255, 0.46) inset;
    backdrop-filter: blur(7.5px);
    z-index: 101;
    opacity: 0;
    transition: opacity 1s;
    pointer-events: none;

    &.active {
        opacity: 1;
        pointer-events: auto;
    }

    .title {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .select {
            width: 100px;

        }

        .close {
            cursor: pointer;
        }
    }

    :deep(.title .el-select .el-input.is-focus .el-input__wrapper) {
        background-color: transparent;
        padding: 0;
        box-shadow: 0 0 0 0px #fff inset !important;
    }

    :deep(.title .el-input__wrapper) {
        background-color: transparent;
        padding: 0;
        box-shadow: 0 0 0 0px #fff inset !important;
    }

    :deep(.title .el-input__wrapper .el-input__inner) {
        border: 0;
        font-size: 20px;
        font-weight: 600;
        background: linear-gradient(90deg, #6EDBF3 3.72%, #E4EEED 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .tableDiv {
        height: calc(100% - 50px);
        margin-top: 15px;

        .trBox {
            height: 64px;
            padding: 0 12px;
            font-size: 16px;
            background: url("@/assets/img/bigScreen/informationServiceInfo/back-1.png") center no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
            overflow: hidden;

            &:nth-child(2n) {
                background-image: url("@/assets/img/bigScreen/informationServiceInfo/back-2.png");
            }

            &:hover {
                background-image: url("@/assets/img/bigScreen/informationServiceInfo/back-a.png") !important;
                color: #00F1FF;

                .position {
                    color: #00F1FF;
                }
            }

            .img {
                width: 20px;
                height: 20px;
                margin-right: 10px;
            }

            .label {
                height: 30px;
                margin-top: 4px;
                display: flex;
                align-items: center;
                justify-content: flex-start;

                >span {
                    margin-right: 6px;
                    background: linear-gradient(2deg, #00F1FF 3.72%, #E4EEED 100%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
            }

            .position {
                color: #BDBECB;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
</style>