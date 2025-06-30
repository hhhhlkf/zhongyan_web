<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: hjh
 * @Date: 2021-11-10 14:42:48
 * @LastEditors: nxx
 * @LastEditTime: 2023-06-25 16:29:55
-->
<template>
  <div class="PieContent">
    <div :id="chartsId" :style="{ width: '100%', height: '95%' }"></div>
  </div>
</template>

<script>
// 引入基本模板
import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
import Highcharts3D from 'highcharts/highcharts-3d';

HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);

export default {
  name: "PieChart",
  props: ["charData", "pieClass"],
  data() {
    return {
      chartsId: '',
      pieChart: null,
    };
  },
  created() {
    this.chartsId = 'a' + Math.random().toString(36).substr(2)
  },
  beforeCreate() { },
  mounted() {
    this.initChart();
  },
  methods: {
    // 初始化图表
    initChart() {
      let data = [
        { name: '正确告警', y: 267, h: 1 },
        { name: '闪现告警', y: 55, h: 1 },
        { name: '误报告警', y: 123, h: 1 },
        { name: '重复告警', y: 237, h: 1 },
      ];
      if (this.charData) {
        data = this.charData ? this.charData : data;
      }

      var each = Highcharts.each,
        round = Math.round,
        cos = Math.cos,
        sin = Math.sin,
        deg2rad = Highcharts.deg2rad;
      Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'translate', function (proceed) {
        proceed.apply(this, [].slice.call(arguments, 1));
        // Do not do this if the chart is not 3D
        if (!this.chart.is3d()) {
          return;
        }
        var series = this,
          chart = series.chart,
          options = chart.options,
          seriesOptions = series.options,
          depth = seriesOptions.depth || 0,
          options3d = options.chart.options3d,
          alpha = options3d.alpha,
          beta = options3d.beta,
          z = seriesOptions.stacking ? (seriesOptions.stack || 0) * depth : series._i * depth;
        z += depth / 2;
        if (seriesOptions.grouping !== false) {
          z = 0;
        }
        each(series.data, function (point) {
          var shapeArgs = point.shapeArgs,
            angle;
          point.shapeType = 'arc3d';
          var ran = point.options.h;
          shapeArgs.z = z;
          shapeArgs.depth = depth * 0.65 + ran;
          shapeArgs.alpha = alpha;
          shapeArgs.beta = beta;
          shapeArgs.center = series.center;
          shapeArgs.ran = ran;
          angle = (shapeArgs.end + shapeArgs.start) / 2;
          point.slicedTranslation = {
            translateX: round(cos(angle) * seriesOptions.slicedOffset * cos(alpha * deg2rad)),
            translateY: (round(sin(angle) * seriesOptions.slicedOffset * cos(alpha * deg2rad)))
          };
        });
      });
      (function (H) {
        H.wrap(Highcharts.SVGRenderer.prototype, 'arc3dPath', function (proceed) {
          // Run original proceed method
          var ret = proceed.apply(this, [].slice.call(arguments, 1));
          ret.zTop = (ret.zOut + 0.5) / 100;
          return ret;
        });
      }(Highcharts));

      let option;
      if (this.pieClass == 'heightPie') {
        option = {
          chart: {
            type: 'pie',
            animation: false,
            events: {
              load: function () {
                var each = Highcharts.each,
                  points = this.series[0].points;
                each(points, function (p, i) {
                  p.graphic.attr({
                    translateY: -p.shapeArgs.ran
                  });
                  p.graphic.side1.attr({
                    translateY: -p.shapeArgs.ran
                  });
                  p.graphic.side2.attr({
                    translateY: -p.shapeArgs.ran
                  });
                });
              }
            },
            backgroundColor: 'transparent',
            options3d: {
              enabled: true,
              alpha: 60,
              beta: 0
            }
          },
          title: {
            text: ''
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            pointFormat: '{point.percentage:.1f}%</b>',
            style: {
              color: 'rgba(216, 250, 252, 1)',
              fontSize: '14px',
            }
          },
          colors: ['#00A5FF', '#ED933E', '#F5EE00', '#00FCE8', '#0067FF', '#5D81FF'],
          plotBackgroundColor: 'transparent',
          plotOptions: {
            pie: {
              name: '',
              allowPointSelect: true,
              cursor: 'pointer',
              depth: 35,
              innerSize: '60%',
              dataLabels: {
                enabled: false
              }
            }
          },
          credits: {
            enabled: false
          },
          series: [{
            type: 'pie',
            data: data
          }]
        }
      }
      if (this.pieChart) {
        this.pieChart.destroy()
        this.pieChart = null
      }
      this.pieChart = Highcharts.chart(this.chartsId, option);
    },
  },
  computed: {},
  destroyed() {
    this.pieChart.destroy()
    this.pieChart = null
  },
  watch: {
    charData: {
      handler: function (val, oldVal) {
        this.initChart();
      },
      deep: true,
    },
  },
};
</script>

<style>
.PieContent {
  height: 100%;
  width: 100%;
}
</style>
