<template>
  <div class="barContent">
    <div ref="chartDom" :style="{ width: '100%', height: '100%' }"></div>
  </div>
</template>

<script>
let myChart = null;
import * as echarts from 'echarts';
export default {
  name: "BarChart",
  components: {
    echarts,
  },
  props: ["echartsClass", "echartsData"],
  data() {
    return {

    };
  },
  created() { },
  beforeCreate() { },
  mounted() {
    let dom = this.$refs.chartDom;
    let _this = this;
    myChart = echarts.init(dom);
    _this.initChart();

    window.addEventListener("resize", () => {
      myChart.resize();
    })
  },
  methods: {
    initChart() {
      switch (this.echartsClass) {
        case "normalBar":
          this.normalBar();
          break;
      }
    },
    normalBar() {
      let data = [{
        "name": "行驶",
        "value": 80
      }, {
        "name": "停留",
        "value": 87
      }, {
        "name": "熄火",
        "value": 71
      }, {
        "name": "定位失败",
        "value": 80
      }, {
        "name": "离线",
        "value": 66
      }];
      let xData = [],
        yData = [];
      let min = 50;
      if (this.echartsData) {
        data = this.echartsData
      }
      data.map(function (a, b) {
        xData.push(a.name);
        yData.push(a.value);
      });
      let option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              opacity: 0
            }
          },
          formatter: function (prams) {
            return prams[0].axisValue + "：" + prams[0].data
          }
        },
        legend: {
          show: false
        },
        grid: {
          left: '0%',
          right: '0%',
          bottom: '5%',
          top: '7%',
          height: '85%',
          containLabel: true,
          z: 22
        },
        xAxis: [{
          type: 'category',
          gridIndex: 0,
          data: xData,
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: '#0c3b71'
            }
          },
          axisLabel: {
            show: true,
            color: '#8C8C8C',
            fontSize: 14
          }
        }],
        yAxis: [{
          type: 'value',
          gridIndex: 0,
          splitLine: {
            show: true
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#0c3b71'
            }
          },
          axisLabel: {
            color: '#8C8C8C',
            formatter: '{value}'
          }
        },
        {
          type: 'value',
          gridIndex: 0,
          min: min,
          max: 100,
          splitNumber: 12,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: ['rgba(250,250,250,0.0)', 'rgba(250,250,250,0.05)']
            }
          }
        }
        ],
        series: [{
          type: 'bar',
          barWidth: '25%',
          xAxisIndex: 0,
          yAxisIndex: 0,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1, [{
                offset: 0,
                color: '#3388ff'
                // color: '#00feff'
              },
              {
                offset: 0.5,
                color: '#027eff'
              },
              {
                offset: 1,
                color: '#3388ff'
              }])
          },
          data: yData,
          zlevel: 11
        }]
      };
      myChart.setOption(option);
    },
  },
  computed: {},
  watch: {
    echartsData: {
      handler: function (val, oldVal) {
        this.initChart();
      },
      deep: true,
    },
  },
};
</script>

<style>
.barContent {
  height: 100%;
  width: 100%;
}
</style>
