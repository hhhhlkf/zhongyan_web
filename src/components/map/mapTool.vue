<template>
  <div class="my-tool">
    <!-- 测量工具 -->
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        <svg-icon icon-class="toolBox" class="rp-img" />
        <span>工具</span>
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="line">测距</el-dropdown-item>
          <el-dropdown-item command="area">测面</el-dropdown-item>
          <el-dropdown-item command="marker">坐标查询</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!-- 地图源切换 -->
    <el-dropdown v-show="show" @command="handleMapChange">
      <span class="el-dropdown-link">
        <svg-icon icon-class="layerControl" class="rp-img" />
        <span>{{ currentMap }}</span>
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :command="v.value" v-for="v in mapList" :key='v.value'>{{ v.label }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script lang="ts">
import dayjs from "dayjs"
let markerIndex = 1000, drawObj: any = null, editType = null, _map, graphLayer;
import virtualTable from '../../components/virtualTable/index.vue'
import { ref, PropType, toRaw } from "vue";
declare const L: any;
declare const GlobalSetting: any;
let toolMap;
export default {
  props: {
    map: {
      type: null || Object as PropType<any>,
    },
    show: {
      type: Boolean
    }
  },
  setup() {
    const mapList = ref([
      { value: "vetor", label: "矢量图" },
      { value: "image", label: "影像图" },
    ]);
    const currentMap = ref("影像图")
    const mapLayer: any = ref({})
    const measuregroup = ref({})
    const showQueryTime = ref(false)
    const timer = ref(null) //节流方法
    const query = ref({
      startTime: dayjs(new Date()).format("YYYY-MM-DD 00:00:00"),
      endTime: dayjs(new Date()).format("YYYY-MM-DD 23:59:59")
    });
    return {
      mapList, currentMap, mapLayer, measuregroup, timer, query, showQueryTime
    };
  },
  components: { virtualTable },
  mounted() {
  },
  methods: {
    handleMapChange(command: string) {
      this.mapList.forEach(v => {
        if (v.value === command) this.currentMap = v.label
      })
      let t_setting = GlobalSetting.MapConfig.tianditu, baseLayer, baseNote;
      switch (command) {
        case 'vetor':
          baseLayer = L.tileLayer(t_setting.vectorUrl, {
            //@ts-ignore
            subdomains: [0, 1, 2, 3, 4, 5, 6, 7],
            maxZoom: t_setting.maxZoom,
            maxNativeZoom: t_setting.maxNativeZoom,
          });
          baseNote = L.tileLayer(t_setting.vNoteUrl, {
            //@ts-ignore
            subdomains: [0, 1, 2, 3, 4, 5, 6, 7],
            maxZoom: t_setting.maxZoom,
            maxNativeZoom: t_setting.maxNativeZoom,
          });
          break;
        case 'image':
          baseLayer = L.tileLayer(t_setting.imageUrl, {
            //@ts-ignore
            subdomains: [0, 1, 2, 3, 4, 5, 6, 7],
            maxZoom: t_setting.maxZoom,
            maxNativeZoom: t_setting.maxNativeZoom,
          });
          baseNote = L.tileLayer(t_setting.iNoteUrl, {
            //@ts-ignore
            subdomains: [0, 1, 2, 3, 4, 5, 6, 7],
            maxZoom: t_setting.maxZoom,
            maxNativeZoom: t_setting.maxNativeZoom,
          });
          break;
        default:
          break;
      }
      toolMap.baseLayerGroup.getLayers().forEach(v => {
        v.removeFrom(toolMap.baseLayerGroup);
      })
      toolMap.baseLayerGroup.addLayer(baseLayer).setZIndex(0);
      toolMap.baseLayerGroup.addLayer(baseNote).setZIndex(0);
    },
    //测量工具方法
    handleCommand(command: string) {
      switch (command) {
        case 'line':
          this.startDrawLine();
          break;
        case 'area':
          this.startDrawPolygon();
          break;
        case 'marker':
          this.startDrawMarker();
          break;
        default:
          break;
      }
    },
    thro(func: Function, wait: number) {
      let timerOut: any = this.timer
      return function (e: any) {
        if (!timerOut) {
          func(e);
          timerOut = setTimeout(function () {
            timerOut = null;
          }, wait)
        }
      }
    },
    // 自定义 展示框  :notShow,不展示关闭按钮
    setTipText(content: string, removeMeasureLayer: Function, notShow = true) {
      const el = document.createElement("div");
      el.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      el.style.width = "fit-content";
      el.style.height = "28px";
      el.style.position = "absolute";
      el.style.left = "20px";
      el.style.top = "-7px";
      el.style.padding = "0 5px";
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.color = "#fff";

      const triangle = document.createElement("div");
      triangle.style.position = "absolute";
      triangle.style.left = "-10px";
      triangle.style.top = "6px";
      triangle.style.width = "0";
      triangle.style.height = "0";
      triangle.style.borderTop = "7px solid transparent";
      triangle.style.borderRight = "10px solid rgba(0, 0, 0, 0.5)";
      triangle.style.borderBottom = "7px solid transparent";

      const text = document.createElement("span");
      text.innerHTML = content;
      text.style.fontSize = "14px";
      text.style.whiteSpace = "nowrap";

      const close = document.createElement("span");
      close.innerHTML = "×";
      close.style.width = "10px";
      close.style.fontSize = "18px";
      close.style.marginLeft = "5px";
      close.style.cursor = "pointer";
      close.style.display = notShow ? "none" : '';

      close.addEventListener("click", () => {
        removeMeasureLayer();
      });

      L.DomEvent.disableClickPropagation(el)

      el.appendChild(triangle);
      el.appendChild(text);
      el.appendChild(close);

      return el;
    },
    startDrawMarker() {
      const map = toolMap;
      let _this: any = this;
      let _marker: any;
      function removeMeasureLayer() {
        _marker.removeFrom(_this.measuregroup);
      }
      //监听鼠标点击事件，弹出经纬度
      const mousemoveHandler = (e: any) => {
        if (!_marker) {
          _marker = L.marker(e.latlng, {
            icon: L.divIcon({
              html: _this.setTipText('lng:' + e.latlng.lng.toFixed(6) + ',lat:' + e.latlng.lat.toFixed(6), removeMeasureLayer, false)
            }),
            zIndexOffset: markerIndex,
          }).addTo(_this.measuregroup)
        } else {
          _marker.setIcon(L.divIcon({
            html: _this.setTipText('lng:' + e.latlng.lng.toFixed(6) + ',lat:' + e.latlng.lat.toFixed(6), removeMeasureLayer, false)
          }));
          _marker.setLatLng(e.latlng)
        }
      };
      // 点击结束， 移除事件是良好的编程习惯
      const onMapClick = () => {
        map.off("click", onMapClick);
        map.off("mousemove", mousemoveHandler);
      };
      map.on('click', onMapClick);
      map.on("mousemove", mousemoveHandler);
    },
    startDrawLine() {
      let _this: any = this, map = toolMap;
      // interactive = false 避免用户双击map无效
      let _lineLayer = L.polyline([], {
        interactive: false,
        color: '#0066FF'
      }).addTo(_this.measuregroup);
      // 存储线的marker，方便一起移除
      let _markerList: any = [];
      // 绘制mousemove line
      const tempLayer = L.polyline([], {
        interactive: false,
        color: '#0066FF'
      }).addTo(_this.measuregroup);
      let tempPoints: any = [];
      // 结束绘制
      const removeMeasureLayer = () => {
        _lineLayer.removeFrom(_this.measuregroup);
        _markerList.forEach((v: { removeFrom: Function }) => {
          v.removeFrom(_this.measuregroup);
        })
      };
      _markerList = [];

      const clickHandler = (e: any) => {
        _lineLayer.addLatLng(e.latlng);
        tempPoints[0] = e.latlng;
        map.doubleClickZoom.disable()

        let latlng: any = _lineLayer.getLatLngs();
        const len = this.formatLength(latlng);

        let _marker = L.marker(e.latlng, {
          icon: L.divIcon({ html: _this.setTipText(len, removeMeasureLayer) }),
          zIndexOffset: markerIndex + _markerList.length,
        }).addTo(_this.measuregroup)
        _markerList.push(_marker)
      };

      const throClickHandler = _this.thro(clickHandler, 300)

      const mousemoveHandler = (e: any) => {
        if (tempPoints.length) {
          tempPoints[1] = e.latlng;
          tempLayer.setLatLngs(tempPoints);
        }
      };
      // 双击结束， 移除事件是良好的编程习惯
      const dblclickHandler = () => {
        tempPoints = null;
        tempLayer.remove();
        map.doubleClickZoom.enable()

        // 只展示最后一个节点
        _markerList[_markerList.length - 1]._icon.children[0].children[2].style.display = '';

        map.off("click", throClickHandler);
        map.off("mousemove", mousemoveHandler);
        map.off("dblclick", dblclickHandler);
      };

      map.on("click", throClickHandler);
      map.on("mousemove", mousemoveHandler);
      map.on("dblclick", dblclickHandler);

    },
    startDrawPolygon() {
      const map = toolMap;
      let _this: any = this;
      let _lastMarker: any; //多边形最后一个点的标注
      // interactive：false,这个参数让线或者图标不可点击
      let _polygon: any = L.polygon([], {
        interactive: false,
        color: '#0066FF'
      }).addTo(_this.measuregroup);
      const tempLayer = L.polygon([], {
        interactive: false,
        color: '#0066FF'
      }).addTo(_this.measuregroup);
      let tempPoints: any = [];
      // 结束绘制
      const removeMeasureLayer = () => {
        _polygon?.removeFrom(_this.measuregroup);
        _lastMarker?.removeFrom(_this.measuregroup);
        dblclickHandler(null);
      };
      const clickHandler = (e: any) => {
        _polygon.addLatLng(e.latlng);
        tempPoints[0] = e.latlng;
        map.doubleClickZoom.disable()
      };

      const mousemoveHandler = (e: any) => {
        if (tempPoints.length) {
          tempPoints[1] = e.latlng;
          tempLayer.setLatLngs(tempPoints);
        }
      };
      // 双击结束， 移除事件是良好的编程习惯
      const dblclickHandler = (e: any) => {
        tempPoints = null;
        tempLayer.removeFrom(_this.measuregroup);
        map.doubleClickZoom.enable()

        let latlng = _polygon.getLatLngs();
        const len = this.formatArea(latlng);

        if (e) {
          _lastMarker = L.marker(e.latlng, {
            icon: L.divIcon({ html: _this.setTipText(len, removeMeasureLayer, false) }),
            zIndexOffset: markerIndex,
          }).addTo(_this.measuregroup)
        }


        map.off("click", clickHandler);
        map.off("mousemove", mousemoveHandler);
        map.off("dblclick", dblclickHandler);
      };

      map.on("click", clickHandler);
      map.on("mousemove", mousemoveHandler);
      map.on("dblclick", dblclickHandler);
    },
    formatLength(line: Array<{ lat: number, lng: number }>) {
      let dis = 0;
      for (let i = 0; i < line.length - 1; i++) {
        let start = line[i];
        let end = line[i + 1];
        dis += L.latLng([start.lat, start.lng]).distanceTo([end.lat, end.lng]);//计算两个点之间的距离，并累加
      }
      //结果得到的也是number类型，单位是 米
      return (dis / 10e2).toFixed(2) + "km";
    },
    formatArea(polygon: Array<string>) {
      //L.GeometryUtil.geodesicArea(),返回number类型的数据，单位是平方米，这里做了一下转化
      //@ts-ignore
      let seeArea = L.GeometryUtil.geodesicArea(polygon[0]);
      let area = (seeArea / 10e5).toFixed(2) + "km²";
      return area;
    },
    initDrawCtrl() {
      _map = toRaw(toolMap)
      _map.on(L.Draw.Event.CREATED, this.drawCreateBack);
    },
    startDraw() {
      if (drawObj) {
        drawObj.disable();
        drawObj = null;
      }
      if (graphLayer) {
        graphLayer.removeFrom(_map)
        graphLayer = null;
      }
      this.showQueryTime = false;
      switch (editType) {
        case 'circle': {
          drawObj = new L.Draw.Circle(_map);
          break;
        }
        case 'polygon': {
          drawObj = new L.Draw.Polygon(_map);
          break;
        }
        case 'line': {
          drawObj = new L.Draw.Polyline(_map);
          break;
        }
        case 'rectangle': {
          drawObj = new L.Draw.Rectangle(_map);
          break;
        }
        case 'point': {// 点
          drawObj = new L.Draw.Marker(_map);
          break;
        }
      }
      // 启动
      drawObj?.enable();
    },
    drawCreateBack(e) {
      drawObj.disable();
      drawObj = null;
      let _borderColor = '#0066FF';
      let points = [], radius = 0, circlePoint = {}, type = 0;
      if (editType == 'circle') {
        circlePoint = e.layer.getLatLng();
        radius = e.layer.getRadius();
        type = 0;
        graphLayer = L.circle(circlePoint, {
          radius: radius, // 圆半径
          fillColor: _borderColor,  // 圆形填充颜色
          strokeColor: '#fff', // 描边颜色
          strokeWeight: 2, // 描边宽度
        }).addTo(_map);
      } else if (editType == 'rectangle') {
        points = e.layer.getLatLngs()[0];
        type = 1;
        graphLayer = L.polygon(points, {
          fillColor: _borderColor,// 多边形填充颜色
          weight: 2, // 线条宽度，默认为 1
          color: _borderColor, // 线条颜色
        }).addTo(_map);
      } else if (editType == 'polygon') {
        points = e.layer.getLatLngs()[0];
        type = 2;
        graphLayer = L.polygon(points, {
          fillColor: _borderColor,// 多边形填充颜色
          weight: 2, // 线条宽度，默认为 1
          color: _borderColor, // 线条颜色
        }).addTo(_map);
      }
      this.query.circlePoint = JSON.parse(JSON.stringify(circlePoint));
      this.query.points = JSON.parse(JSON.stringify(points));
      this.query.radius = radius;
      this.query.type = type;
      this.showQueryTime = true;
      // 只生效一次
      _map.off(L.Draw.Event.CREATED, this.drawCreateBack);
    },
  },
  watch: {
    map() {
      toolMap = toRaw(this.map)
      this.measuregroup = L.featureGroup([]).addTo(toolMap)
    }
  }
}
</script>
<style lang='scss' scoped>
.my-tool {
  height: 32px;
  background: #fff;
  border-radius: 5px;
  color: #000;
  font-size: 12px;
  display: flex;
  align-items: center;
  padding: 0 10px;

  :deep(.el-dropdown) {
    margin-right: 10px;

    &:last-of-type {
      margin-right: 0;
    }
  }

  :deep(.el-dropdown-link) {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
}

.rp-img {
  margin-right: 4px;
  font-size: 18px;
}

ul {
  list-style: none;
  margin: 0 !important;
}

.area-query-dom {
  background-color: #fff;
  position: absolute;
  top: 40px;
  left: 0;
  border-radius: 5px;
  padding: 8px;

  .area-query-title {
    font-size: 16px;
    line-height: 30px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2px 0 6px;
  }

  :deep(.el-form-item__label) {
    font-weight: normal;
  }

  .dialog-footer {
    text-align: right;
  }
}

.search {
  display: flex;
  margin-bottom: 15px;

  .search-title {
    display: flex;
    align-items: center;

    .search-text {
      margin-right: 5px;
    }
  }
}
</style>