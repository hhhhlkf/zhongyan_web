<template>
    <div class="container">
        <div class="above-container">
            <div class="left-side">
                <div class="table-container">
                    <h2 class="table-title">设备状态</h2>
                    <el-table :data="deviceStatuses" height="100%"
                        style="width: 100%;margin-top: 5px;width: 99.97%;--el-table-border-color: none;border-right: 1px #143275 solid;border-left: 1px #143275 solid;border-bottom: 1px #143275 solid;"
                        :highlight-current-row="false" header-cell-class-name="headerClass"
                        :header-cell-style="{ color: '#fff', fontSize: '14px', textAlign: 'center', borderLeft: '0.5px #154480 solid', borderBottom: '1px #154480 solid' }"
                        :cell-style="{ color: '#fff', fontSize: '14px', textAlign: 'center', borderBottom: '0.5px #143275 solid', borderLeft: '0.5px #143275 solid', padding: '13px 0px' }"
                        :row-style="{ color: '#fff', fontSize: '14px', textAlign: 'center', }">
                        <el-table-column prop="name" label="设备" width="100">
                            <template #default="scope">
                                <a @click="handleRowClick(scope.$index)">
                                    <span>
                                        {{ scope.row.name }}
                                    </span></a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="text" label="状态" width="80">
                            <template v-slot="scope">
                                <el-tag :type="scope.row.type">{{ scope.row.text }}</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>


                </div>
            </div>
            <div class="divider"></div>
            <div class="right-side">
                <div class="table-container">
                    <h2 class="table-title">应急进度</h2>
                    <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage" style="width: 100%;"
                        :color="colorFunction" />
                    <el-card class="log-card">
                        <el-scrollbar class="custom-scrollbar">
                            <div v-for="log in logs" :key="log.id" class="log-entry">
                                {{ log }}
                            </div>
                        </el-scrollbar>
                    </el-card>
                </div>
            </div>
        </div>
        <el-dialog title="资源使用率" v-model="isClose" width="30%" class="sourceDialog" :draggable="true"
            @close="isClose = false">
            <div class="below-container-nxsource">
                <div ref="nxSource" class="nxSource" style="width: 100%;height: 100%"></div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="resetCurrentClock">时间矫正</el-button>
                </span>
            </template>
        </el-dialog>
        <div class="below-container">
            <div ref="transpeed" class="transpeed"></div>
        </div>
    </div>

</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';
import { getDeviceStatus, getLogInfo, getSourceUse, getTransRate, getTransSchedule } from '../../../api/zhongyan/api';
import { set } from '@vueuse/core';
import { resetClock, transferControl } from '@/api/zhongyan/dataManager'
import { ElMessage } from 'element-plus';


// onMounted(() => {
//     generateFakeLogs(10); // 生成10条伪日志
// });
let props = defineProps(["perc"]);
let statusWord = ['success', 'warning', 'danger', 'info'];
let statusText = ['正常', '断开', '损坏', '等待'];
let percentage = ref(0);
let isClose = ref(false);
let deviceStatuses = reactive([
    { type: 'info', text: '等待', name: '板卡设备' },
    { type: 'info', text: '等待', name: '通信设备' },
    { type: 'info', text: '等待', name: 'LLT相机' },
    { type: 'info', text: '等待', name: 'RGB相机' },
    { type: 'info', text: '等待', name: 'HSI相机' },
]);
let device = ['nx', 'trans', 'llt', 'rgb', 'hsi'];
let interval = ref(1);
let nxSource = ref(null);
let isTrans = ref(true);
let sourceChart = null;
let transChart = null;
let sourceIntervalId = null;
let deviceTimer = null;
let logTimer = null;
let percentageTimer = null;
let transRateTimer = null;


function handleRowClick(index) {
    if (index == 0) {
        // console.log(index);
        isClose.value = true;
        setTimeout(() => {
            drawSourceCircle();
        }, 500);
    }
    if(index == 1) {
        ElMessage.info('传输状态转换中');
        transferControl(isTrans.value).then(res => {
            if (res.code == 200) {
                console.log('Before:', isTrans.value);
                isTrans.value = !isTrans.value;
                console.log('After:', isTrans.value);
                console.log(isTrans.value)
                if (res.data.status) {
                    ElMessage.success('传输开启成功');
                } else {
                    ElMessage.success('传输关闭成功');
                }
            } else {
                ElMessage.error('传输开启失败');
            }
        }).catch(err => {
            console.log(err);
        });
    }

}


function resetCurrentClock() {
    if (deviceStatuses[0].type == 'success') {
        resetClock().then(res => {
            if (res.data.status) {
                console.log('时钟重置成功！');
                ElMessage.success('时钟重置成功');
            } else {
                console.log('时钟重置失败！');
                ElMessage.error('时钟重置失败，请检查设备状态！');
            }
        }).catch(err => {
            console.log(err);
        });
    } else {
        console.log('设备状态正常，无需重置时钟');
        ElMessage.warning('设备状态异常，请检查设备状态！');
    }
}

function drawSourceCircle() {
    sourceChart = echarts.init(nxSource.value);
    const gaugeData = [
        {
            value: 0,
            name: '1号板卡',
            title: {
                offsetCenter: ['0%', '-30%']
            },
            detail: {
                valueAnimation: true,
                offsetCenter: ['0%', '-20%']
            }
        },
        {
            value: 0,
            name: '2号板卡',
            title: {
                offsetCenter: ['0%', '0%']
            },
            detail: {
                valueAnimation: true,
                offsetCenter: ['0%', '10%']
            }
        },
        {
            value: 0,
            name: '3号板卡',
            title: {
                offsetCenter: ['0%', '30%']
            },
            detail: {
                valueAnimation: true,
                offsetCenter: ['0%', '40%']
            }
        }
    ];
    let option = {
        series: [
            {
                type: 'gauge',
                startAngle: 90,
                endAngle: -270,
                pointer: {
                    show: false
                },
                radius: '100%',
                progress: {
                    show: true,
                    overlap: false,
                    roundCap: true,
                    clip: false,
                    itemStyle: {
                        borderWidth: 1,
                        borderColor: '#464646'
                    }
                },
                axisLine: {
                    lineStyle: {
                        width: 40,
                        color: [[1, '#175d83']]
                    }
                },
                splitLine: {
                    show: false,
                    distance: 0,
                    length: 10
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false,
                    distance: 50
                },
                data: gaugeData,
                title: {
                    fontSize: 14,
                    color: '#fff'
                },
                detail: {
                    width: 50,
                    height: 14,
                    fontSize: 14,
                    color: 'inherit',
                    borderColor: 'inherit',
                    borderRadius: 20,
                    borderWidth: 1,
                    formatter: '{value}%',
                    color: '#fff'
                }
            }
        ]
    };
    sourceIntervalId = setInterval(function () {
        sourceChart.resize();
        getSourceUse(false).then(res => {
            if (res.code == 200) {
                gaugeData[0].value = (100 * res.data.nx_1).toFixed(2);
                gaugeData[1].value = (100 * res.data.nx_2).toFixed(2);
                gaugeData[2].value = (100 * res.data.nx_3).toFixed(2);
                // console.log(gaugeData[0].value, gaugeData[1].value, gaugeData[2].value);
                sourceChart.setOption({
                    series: [
                        {
                            data: gaugeData,
                            pointer: {
                                show: false
                            }
                        }
                    ]
                });
                sourceChart.setOption({
                    series: [
                        {
                            data: gaugeData,
                            pointer: {
                                show: false
                            }
                        }
                    ]
                });

                if (!isClose.value) {
                    clearInterval(sourceIntervalId);
                    sourceChart.clear();
                    sourceIntervalId = null;
                }
            }
        }).catch(err => {
            console.log(err);
        });
        // gaugeData[0].value = +(Math.random() * 100).toFixed(2);
        // gaugeData[1].value = +(Math.random() * 100).toFixed(2);
        // gaugeData[2].value = +(Math.random() * 100).toFixed(2);
    }, 2500);

    option && sourceChart.setOption(option);
    // sourceChart.setOption(option);
    // return sourceChart;
}


onMounted(() => {
    window.addEventListener('resize', handleResize);
    deviceTimer = setInterval(() => {
        getDeviceStatus(device).then(res => {
            if (res.code == 200) {
                let devStatus = res.data.status
                for (let i = 0; i < devStatus.length; i++) {
                    deviceStatuses[i].type = statusWord[devStatus[i]];
                    deviceStatuses[i].text = statusText[devStatus[i]];
                }
            }
        }).catch(err => {
            console.log(err);
        });
    }, 5000);

    logTimer = setInterval(() => {
        getLogInfo().then(res => {
            if (res.code == 200) {
                // console.log(res.data);
                res.data.logList.forEach(log => {
                    logs.push(log)
                    // 如果logs多于50条，删除最早的一条
                    if (logs.length > 50) {
                        logs.shift();
                    }
                })
            }
        }).catch(err => {
            console.log(err);
        });
    }, 5000);

    percentageTimer = setInterval(() => {
        percentage.value = props.perc * 100;
        // getTransSchedule().then(res => {
        //     if (res.code == 200) {
        //         percentage.value = res.data.toFixed(2) * 100;
        //     }
        // }).catch(err => {
        //     console.log(err);
        // });
    }, 1000);

    transChart = echarts.init(transpeed.value);
    let option;
    let data = generateData('2023-10-01 12:00:00', '2023-10-01 12:10:00');
    option = {
        // title: {
        //     left: 'center',
        //     text: 'Tooltip and dataZoom on Mobile Device'
        // },
        legend: {
            top: 'top',
            data: ['下载速率'],
        },
        tooltip: [
            {
                // triggerOn: 'none',

                trigger: 'axis',
                axisPointer: {
                    animation: false,
                    label: {
                        backgroundColor: '#505765',
                    }
                },
                formatter: function (params) {
                    // params 是一个数组，包含了当前指示器指向的所有系列的数据
                    let tooltipText = '';
                    params.forEach(param => {
                        tooltipText += `${param.value[0]}的${param.seriesName}: ${param.value[1]} Mbps<br/>`; // 获取 y 值
                    });
                    return tooltipText;
                }
            },
        ],
        xAxis: {
            type: 'time',
            // 限制时间轴最多展示 5 个标识，避免横轴标签过密
            splitNumber: 5,
            axisLabel: {
                color: '#FFFFFF', // 设置 x 轴刻度字体颜色为白色
                hideOverlap: true,
                // show: false
            },
            // 坐标轴名称
            name: '时间',
            nameTextStyle: {
                color: '#FFFFFF', // 设置名称字体颜色
                // fontSize: 14, // 设置名称字体大小
                padding: [0, 0, 0, -10] // 设置名称与轴线的距离
            }
        },
        yAxis: {
            type: 'value',
            axisTick: {
                inside: false
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                inside: false,
                formatter: '{value}\n',
                color: '#FFFFFF', // 设置 y 轴刻度字体颜色为白色,
                show: false
            },
            // 坐标轴名称
            name: '传输速率',
            nameTextStyle: {
                color: '#FFFFFF', // 设置名称字体颜色
                // fontSize: 14, // 设置名称字体大小
                padding: [0, 0, -22, 0] // 设置名称与轴线的距离
            }
        },
        grid: {
            top: '10%', // 调整 grid 的位置
            left: '7%',
            right: '8%',
            bottom: '10%', // 为图例留出空间
            containLabel: true
        },
        dataZoom: [
            {
                type: 'inside',
                throttle: 50
            }
        ],
        series: [
            {
                name: '下载速率',
                type: 'line',
                smooth: true,
                sampling: 'average',
                showSymbol: false,
                itemStyle: {
                    color: '#175d83'
                },
                stack: 'a',
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: '#175d83'
                        },
                        {
                            offset: 1,
                            color: '#175d83'
                        }
                    ])
                },
                data: timeStamp,
            },
        ]

    }

    option && transChart.setOption(option);

    transRateTimer = setInterval(() => {
        getTransRate().then(res => {
            if (res.code == 200) {
                // 这里使用本地时间，避免 toISOString() 带来的 UTC 时区偏移
                let now = formatDate(new Date());
                // 让时间短一点，方便观察

                // console.log(now, res.data)
                timeStamp.push([now, res.data])
                if (timeStamp.length > 100) {
                    timeStamp.shift();
                }
                if (option) {
                    transChart.setOption(option);
                }
            }
        }).catch(err => {
            console.log(err);
        });
    }, 2000)
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    clearInterval(deviceTimer);
    clearInterval(logTimer);
    clearInterval(percentageTimer);
    clearInterval(transRateTimer);
    clearInterval(sourceIntervalId);
    sourceChart && sourceChart.dispose();
    transChart && transChart.dispose();
});

function handleResize() {
    sourceChart && sourceChart.resize();
    transChart && transChart.resize();
}

let logs = reactive([
]);


function generateFakeLogs(count) {
    let fakeLogs = [];
    for (let i = 0; i < count; i++) {
        const log = {
            id: i + 1,
            message: `日志条目${i + 1}`,
            receivedTime: formatDate(new Date()),
            receivedSize: `${(Math.random().toFixed(2) * 100)} MB`
        };
        fakeLogs.push(log);
    }
    logs.value = fakeLogs;
}

function formatDate(date) {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

let colorFunction = computed(() => (percentage) => {
    if (percentage < 20) {
        return '#005254';
    } else if (percentage < 40) {
        return '#005f5f';
    }
    else if (percentage < 60) {
        return '#006b6b';
    }
    else if (percentage < 80) {
        return '#007575';
    }
    else {
        return '#007a7a';
    }
});

// generateFakeLogs(10);
let transpeed = ref(null);
let timeStamp = reactive([])


function generateData(startTime, endTime) {
    let start = new Date(startTime).getTime();
    let end = new Date(endTime).getTime();
    let oneSecond = 1000;
    let valueBase = Math.random() * 300;
    let data = [];

    for (let time = start; time <= end; time += oneSecond) {
        let now = new Date(time);
        let timeStr = formatDate(now); // 格式化时间到秒
        valueBase = Math.round((Math.random() - 0.5) * 20 + valueBase);
        valueBase <= 0 && (valueBase = Math.random() * 300);
        data.push([timeStr, Math.round(valueBase)]); // 传输速率为整数
    }

    return data;
}
// let percentage = ref(0);
</script>

<style scoped>
.container {
    width: 100%;
    background: url("@/assets/img/bigScreen/highChart/back-h.png") center no-repeat;
    background-size: 100% 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.above-container {
    display: flex;
    height: 75%;
    min-height: 0;
}

.below-container {
    display: flex;
    height: 25%;
    min-height: 140px;
}

.below-container-nxsource {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}


.left-side,
.right-side {
    flex: 1;
    flex-basis: 50%;
    padding: 10px;
    min-width: 0;
    min-height: 0;
}

.divider {
    width: 1px;
    background-color: #175d83;
    /* 分割线颜色 */
    margin: 0 5px;
    height: 100%;
    /* 可选：添加左右间距 */
}

.table-container {
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: stretch;
    min-height: 0;
}

.li-name {
    text-decoration: underline;
    margin-bottom: 1px;

}

.li-name:hover {
    color: rgb(31, 180, 225);
}

.el-carousel__item h3 {
    color: #476769;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;

}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf !important;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6 !important;
}


/*  
// 表格部分样式
 // 最外层透明 */
:deep .el-table,
:deep .el-table__expanded-cell {
    background-color: transparent;
    border: 0px solid !important;
}

/* 表格内背景颜色  */

::v-deep .el-table tr {
    background-color: transparent;
    height: 5px;
}

/* // 去掉最下面的那一条线  */
.el-table::before {
    height: 0px;
}

/* // 设置表格行高度 */
::v-deep .el-table__body tr {
    padding: 0;
    height: 40px;
}



::v-deep .el-table__header th {
    background: #175d83 !important;
}

.table-title {
    font-size: 18px;
    font-weight: bold;
    color: #d2fbfc;
    margin-bottom: 10px;
    /* 标题与表格之间的间距 */
}

.log-card {
    margin-top: 20px;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

.log-entry {
    /* border-bottom: 1px solid #e0e0e0; */
    font-size: 12px;
}

.custom-scrollbar ::v-deep .el-scrollbar__wrap {
    border: none;
    /* 去掉边框 */
}

.transpeed {
    width: 100%;
    height: 100%;
}

::v-deep .el-dialog__body {
    height: min(60vh, 400px);
}

.sourceDialog {
    z-index: 0;
}

.left-side :deep(.el-table) {
    flex: 1;
    min-height: 0;
}
</style>
