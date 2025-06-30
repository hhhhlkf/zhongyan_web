<template>
  <div class="barContent">
    <div ref="chartDom" :style="{ width: '100%', height: '100%' }"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
const chartDom = ref(null);
let myChart = null;
const props = defineProps({
  echartsClass: {
    type: String
  },
  echartsData: {
    type: Object || Array
  },
  skin: {
    type: String
  },
});
onMounted(() => {
  myChart = echarts.init(chartDom.value);
  initChart();
})
watch(() => props.echartsData, () => {
  initChart();
}, { deep: true })
// 正常线图
function normalLine() {
  let data = {
    xAxisData: [],
    yAxisName: [],
    seriesData: [],
    titleText: "",
    unit: "",
    color: ['#01C3D0', '#4DE28D', '#FF9A01', '#DC635E', '#99BE5B', '#5A61FF', '#6375CA', '#00897B', '#68728B'],
    fontColor: '#6B7A99',
  };
  if (props.skin == 'dead') {
    data.fontColor = "#bdbecb"
  }
  if (props.echartsData) {
    data = {
      ...data,
      ...props.echartsData,
    }
  }
  myChart.clear();
  let myChartsOptions = null;
  if (data.seriesData.length && !data.seriesData[0].length) {
    myChartsOptions = ({
      title: {
        text: '暂无数据',
        x: 'center',
        y: 'center',
        textStyle: {
          fontSize: 14,
          color: data.fontColor,
          fontWeight: 'normal',
        }
      },
    })
    myChart.setOption(myChartsOptions);
    return;
  }
  let padd = [0, 0, -25, -20];
  if (data.titleText.length > 2) {
    let _num = data.titleText.length - 2
    padd = [0, 0, -25, (_num * 20) + -20];
  }
  myChartsOptions = ({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        animation: false,
        label: {
          backgroundColor: '#505765'
        }
      },
      formatter: function (params) {
        let str = `${params[0].axisValue}`;
        params.forEach(item => {
          let value = Array.isArray(item.value) ? item.value[1] : item.value;
          str += `<br />${item.marker}${item.seriesName}：${value} ${data.unit}`;
        });
        return str;
      },
    },
    color: data.color,
    grid: {
      top: '15%',
      left: '4%',
      right: '4%',
      bottom: '8%',
      containLabel: true
    },
    legend: {
      top: '5%',
      right: '4%',
      itemWidth: 10,
      textStyle: {
        color: data.fontColor,
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: true,
      axisTick: {
        show: false,
        lineStyle: {
          color: data.fontColor,
        },
      },
      axisLine: {
        lineStyle: {
          color: data.fontColor,
        },
        show: true,
      },
      splitLine: {
        lineStyle: {
          color: data.fontColor,
          opacity: 0.2,
        },
        show: false,
      },
      axisLabel: {
        color: data.fontColor,
      },
      data: data.xAxisData?.map(item => {
        return item.replace(' ', '\n');
      }),
    },
    yAxis: {
      type: "value",
      name: data.titleText + '(' + data.unit + ')',
      nameTextStyle: {
        padding: padd,
        color: data.fontColor,
      },
      nameGap: 40,
      axisTick: {
        show: false,
        interval: 'auto',
      },
      splitLine: {
        lineStyle: {
          color: data.fontColor,
          opacity: 0.1,
        },
        show: true,
      },
      axisLine: {
        lineStyle: {
          color: data.fontColor,
        },
      },
      axisLabel: {
        color: data.fontColor,
      },
    },
    series: [],
    dataZoom: [{
      type: 'slider',
      show: false,
    }, {
      show: true,
      height: 24,
      start: 0,
      end: 100,
      borderColor: "#90979c",
      brushSelect: false,
      showDetail: false,
    }],
  });
  if (props.skin == 'dead') {
    myChartsOptions.tooltip = {
      trigger: 'axis',
      borderColor: 'rgba(255,255,255,.3)',
      backgroundColor: 'rgba(13,5,30,.6)',
      textStyle: {
        color: 'white', //设置文字颜色
      },
      borderWidth: 1,
      padding: 5,
      formatter: function (params) {
        let str = `${params[0].axisValue}`;
        params.forEach(item => {
          let value = Array.isArray(item.value) ? item.value[1] : item.value;
          str += `<br />${item.marker}${item.seriesName}：${value} ${data.unit}`;
        });
        return str;
      },
    }
  }
  data.seriesData.forEach((item, index) => {
    let obj = {
      type: "line",
      name: data.yAxisName[index],
      smooth: true, //是否平滑曲线显示
      lineStyle: {
        color: data.color[index],
        width: 2,
      },
      symbol: "circle",
      symbolSize: 5,
      data: item,
    };
    myChartsOptions.series.push(obj);
  })
  nextTick(() => {
    myChart.setOption(myChartsOptions);
  })
}
function initChart() {
  switch (props.echartsClass) {
    // 工作台-气泡-曲线
    case "normalLine":
      normalLine();
      break;
  }
}
function resize() {
  myChart.resize();
}
defineExpose({
  resize
})
</script>

<style>
.barContent {
  height: 100%;
  width: 100%;
}
</style>
