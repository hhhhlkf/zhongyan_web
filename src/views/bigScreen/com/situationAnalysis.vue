<!--
 * @Author: nxx
 * @Date: 2024-01-04 21:47:53
 * @LastEditors: nxx
 * @LastEditTime: 2024-01-05 16:09:08
 * @FilePath: \web\src\views\bigScreen\com\situationAnalysis.vue
 * @Description: 平台服务态势分析
 * Copyright (c) 2024 by nxx/exsun, All Rights Reserved. 
-->
<template>
    <div ref="diagram" class="situationAnalysis"></div>
    <div class="bottom">
        <div class="bottom-item" v-for="(v, i) in listData">
            <div>{{ v.label }}</div>
            <div class="num">
                <div :class="v.status == '1' ? 'text2' : 'text'">{{ v.value }}万</div>
                <img :src="getImg(v.status == 1 ? 'down.png' : 'up.png')" alt="">
            </div>
        </div>
    </div>
</template>

<script setup>
import { getPlatform } from "@/api/bigScreen";
import * as echarts from 'echarts';
let option = {
    tooltip: {
        trigger: 'item',
        borderColor: 'rgba(255,255,255,.3)',
        backgroundColor: 'rgba(13,5,30,.6)',
        textStyle: {
            color: 'white', //设置文字颜色
        },
        borderWidth: 1,
        padding: 5,
    },
    "radar": {
        "center": ["50%", "50%"],
        "radius": "70%",
        "startAngle": 90,
        "splitNumber": 4,
        "shape": "circle",
        "splitArea": {
            "areaStyle": {
                "color": ["transparent"]
            }
        },
        "axisLabel": {
            "show": false,
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: "white"//
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: "white"//
            }
        },
        indicator: [{
            "name": "感知服务态势",
        }, {
            "name": "授时服务态势",
        }, {
            "name": "通信服务态势",
        }, {
            "name": "定位服务态势",
        }]
    },
    series: [{
        name: "平台服务态势分析(单位:万)",
        type: "radar",
        symbol: "circle",
        symbolSize: 10,
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 1, 0, [{
                    offset: 0.2,
                    color: 'rgba(71, 123, 255, 0.65)'
                }, {
                    offset: 0.5,
                    color: 'rgba(71, 171, 255, 0.65)'
                }, {
                    offset: 0.6,
                    color: 'rgba(71, 205, 255, 0.48)'
                }, {
                    offset: 0.7,
                    color: 'rgba(71, 255, 167, 0.40)'
                }
                ], false)
            }
        },
        itemStyle: {
            color: 'rgba(71, 123, 255, 1)',
            borderColor: 'rgba(71, 123, 255, 0.3)',
            borderWidth: 10,
        },
        lineStyle: {
            normal: {
                color: "rgba(71, 123, 255, 1)",
                width: 2
            }
        },
        data: [
            [32012, 13201, 9029, 8741]
        ]
    }]
}
let listData = ref([])
let diagram = ref()
let myChart;

function getImg(name) {
    return new URL(`../../../assets/img/bigScreen/situationAnalysis/${name}`, import.meta.url).href;
}

function getData() {
    getPlatform().then(res => {
        listData.value = res.data
        let data = res.data.map(v => v.value)
        myChart = echarts.init(diagram.value);
        option.series[0].data = [data]
        myChart.setOption(option);
    })
}

onMounted(() => {
    getData();
    window.addEventListener("resize", () => {
        myChart.resize();
    })
})
</script>
<style lang="scss" scoped>
.situationAnalysis {
    width: 100%;
    height: 80%;
}

.bottom {
    position: absolute;
    bottom: 4px;
    left: 30px;
    height: 49.2px;
    width: 410px;
    display: flex;
    justify-content: space-between;
    color: #FFF;
    font-family: PingFang SC;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    opacity: 0.85;

    .bottom-item {
        width: 97px;
        height: 49.2px;
        text-align: left;

        .num {
            display: flex;
            margin-top: 5.2px;
            align-items: center;
            font-family: DIN;
            font-size: 20px;
            font-style: normal;
            font-weight: 600;

            .text {
                background: linear-gradient(6deg, #FF4545 7.4%, #F8FFFE 66.32%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-right: 5px;
                font-family: D-DIN;
            }

            .text2 {
                background: linear-gradient(6deg, #45FFA6 7.4%, #F8FFFE 66.32%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-right: 5px;
                font-family: D-DIN;
            }

            img {
                width: 10.1px;
                height: 16.8px;
            }
        }
    }
}
</style>