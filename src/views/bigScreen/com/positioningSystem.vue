<!--
 * @Author: nxx
 * @Date: 2024-01-04 15:27:26
 * @LastEditors: nxx
 * @LastEditTime: 2024-01-10 17:54:01
 * @FilePath: \web\src\views\bigScreen\com\positioningSystem.vue
 * @Description: 星地精密定位服务
 * Copyright (c) 2024 by nxx/exsun, All Rights Reserved. 
-->
<template>
  <div ref="diagram" class="positioningSystem"></div>
  <img class="img" src="@/assets/img/bigScreen/highChart/back.png" alt="">
</template>

<script setup>
import { getEarthPrecision } from "@/api/bigScreen";
import * as echarts from 'echarts';
let itemLable = {
  'SN1': {
    color: '#2B8EF3',
    list: ['rgba(43, 142, 243,0.18)', 'rgba(43, 142, 243,0.6)']
  },
  'SN2': {
    color: '#00FAFF',
    list: ['rgba(0, 250, 255,0.18)', 'rgba(0, 250, 255,0.6)']
  },
  'SN3': {
    color: '#3254DD',
    list: ['rgba(50, 84, 221,0.18)', 'rgba(50, 84, 221,0.6)']
  },
  'SN4': {
    color: '#BEE5FB',
    list: ['rgba(190, 229, 251,0.18)', 'rgba(190, 229, 251,0.6)']
  },
  'SN5': {
    color: '#3CD495',
    list: ['rgba(60, 212, 149,0.18)', 'rgba(60, 212, 149,0.6)']
  },
  '高度角': {
    color: '#FF6161',
  },
}
let option = {
  tooltip: {
    trigger: 'axis',
    borderColor: 'rgba(255,255,255,.3)',
    backgroundColor: 'rgba(13,5,30,.6)',
    textStyle: {
      color: 'white', //设置文字颜色
    },
    borderWidth: 1,
    padding: 5,
    formatter: function (params) {
      let src = params[0].name + '<br/>'
      params.forEach(v => {
        let _img = v.marker.replace(/background-color:(.*?);/, function ($1) {
          return $1 + `border: 2px solid ${v.borderColor};`
        });
        src += _img + v.seriesName + ": " + v.value + '<br/>'
      })
      return src
    }
  },
  legend: {
    data: [],
    top: "4%",
    textStyle: {
      color: "#BDBECB",
      fontSize: 14,
      rich: {
        a: {
          verticalAlign: 'middle',
        },
      },
      padding: [0, 0, -2, 0],
    },
    borderRadius: 2,
    itemWidth: 10,
    itemHeight: 10,
  },
  grid: {
    top: '23%',
    left: '5%',
    right: '5%',
    bottom: '0',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    // boundaryGap: false,//坐标轴两边留白
    data: [],
    axisLabel: {
      textStyle: {
        color: '#BDBECB',
        fontStyle: 'normal',
        fontFamily: '微软雅黑',
        fontSize: 14,
      }
    },
    axisTick: {//坐标轴刻度相关设置。
      show: false,
    },
    axisLine: {//坐标轴轴线相关设置
      show: false
    },
    splitLine: { //坐标轴在 grid 区域中的分隔线。
      show: false,
    }
  },
  yAxis: [
    {
      type: 'value',
      name: '单位:(dB/HZ)',
      nameTextStyle: {
        padding: [0, 0, -25, -20],
        color: '#BDBECB',
      },
      nameGap: 40,
      axisLabel: {
        textStyle: {
          color: '#BDBECB',
          fontStyle: 'normal',
          fontFamily: '微软雅黑',
          fontSize: 14,
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)',
          type: 'dashed' //设置网格线类型 dotted：虚线 solid:实线
        }
      }
    },
    {
      type: 'value',
      name: '单位:(°)',
      nameTextStyle: {
        padding: [0, 0, -25, 0],
        color: '#BDBECB',
      },
      nameGap: 40,
      axisLabel: {
        textStyle: {
          color: '#BDBECB',
          fontStyle: 'normal',
          fontFamily: '微软雅黑',
          fontSize: 14,
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)',
          type: 'dashed' //设置网格线类型 dotted：虚线 solid:实线
        }
      }
    }
  ],
  series: []
}
let diagram = ref()
let myChart;
function getData() {
  getEarthPrecision(props.positionSystemType).then(res => {
    let obj = res.data
    let legend = []
    let series = []
    obj.data.forEach(v => {
      if (v.type == 'bar') {
        series.push({
          name: v.label,
          type: v.type,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: itemLable[v.label].list[0] // 0% 处的颜色
              }, {
                offset: 1,
                color: itemLable[v.label].list[1] // 100% 处的颜色
              }], false),
              barBorderRadius: [30, 30, 0, 0],
              borderWidth: 1,
              borderColor: itemLable[v.label].color
            }
          },
          data: v.date
        })
      } else {
        let arr = [];
        v.date.forEach(i => {
          if (parseFloat(i) > 0) {
            arr.push(parseFloat(i).toFixed(4))
          } else {
            arr.push(0)
          }
        })
        series.push({
          name: v.label,
          type: v.type,
          yAxisIndex: 1,
          itemStyle: {
            color: itemLable[v.label].color
          },
          data: arr
        })
      }
      legend.push(v.label)
    })
    option.legend.data = legend
    option.xAxis.data = obj.xAxis
    option.series = series
    myChart = echarts.init(diagram.value);
    myChart.setOption(option);
  })
}
onMounted(() => {
  // getData()
  window.addEventListener("resize", () => {
    myChart.resize();
  })
})

let props = defineProps(['positionSystemType'])
watch(props, () => {
  getData();
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped>
.positioningSystem {
  width: 100%;
  height: 100%;
}

.img {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
}
</style>