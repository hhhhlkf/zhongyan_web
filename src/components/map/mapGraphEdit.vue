<!--
 * @Author: your name
 * @Date: 2021-06-26 13:21:35
 * @LastEditTime: 2023-09-23 11:16:03
 * @LastEditors: pmy
 * @Description: 公用-点、线、面
 * @FilePath: \bdcar-net\src\components\map\mapGraphEdit.vue
-->
<template>
  <div class="mapGraphEdit">
    <div id="mapGraphEdit"></div>
    <!-- 左上侧的搜索框 -->
    <!-- <poiSearch class="searchDom" :poiSelClick='showLocatePoint'></poiSearch> -->
    <div class="map-tool" v-if="showTools">
      <div class="tool-item" @click="drawGraph()" v-show="isDraw"><i class="fa fa-x fa-plus"></i>绘制</div>
      <div class="tool-item" @click="editGraph()" v-show="!isDraw && editType !== 'point'"><i
          class="fa fa-x fa-pencil"></i>{{ edit ? '完成' : '编辑' }}</div>
      <div class="tool-item" @click="deleteGraph()" v-show="!isDraw && !edit"><i class="fa fa-x fa-power-off"></i>删除
      </div>
    </div>
  </div>
</template>
<script lang="js">
import { initMap } from '../../utils/map/leafletMap';
// import poiSearch from '@/components/map/poiSearch.vue';
import { wgs84togcj02 } from "../../utils/map/coordinateTransfor.js"
import axios from "axios"
export default {
  props: {
    // 当前编辑类型（point：点，line:线，polygon：面）
    editType: {
      type: String
    },
    // 父组件传递的图形坐标点集（point：点-length为1,line:线-length大于1，polygon：面-length大于2）
    selectGraph: {
      type: [Array, String, Object]
    },
    showTools: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      map: null,

      graph: [],//最终的图形坐标点集
      address: "",//选择点位的地址
      edit: false,//是否可以编辑地图
      isDraw: true,
      polyEditor: null,
      beforeGraph: [],
      mouseTool: null,//暂存画图工具

      drawControl: null,
      drawObj: null,
      drawLayerGroup: null,
      inEdit: null, // 控制图层对象的编辑
      beforeLayer: L.featureGroup(),//框选功能图层
    }
  },
  components: {
    // poiSearch
  },
  created() {
    if (typeof this.selectGraph === "object" && this.selectGraph.aoLatLng && Array.isArray(this.selectGraph.aoLatLng)) {
      this.beforeGraph = [];
      this.selectGraph.aoLatLng.forEach(v => {
        this.beforeGraph.push([v.lat, v.lng])
      })
      this.isDraw = this.beforeGraph.length === 0;
    } else if (typeof this.selectGraph === "object" && this.selectGraph.aoLatLng && typeof this.selectGraph.aoLatLng === "object") {
      this.beforeGraph = [];
      if (this.selectGraph.aoLatLng.lng && this.selectGraph.aoLatLng.lat) {
        this.beforeGraph = [this.selectGraph.aoLatLng.lat, this.selectGraph.aoLatLng.lng];
      }
      this.isDraw = this.beforeGraph.length === 0;
    }
  },
  mounted() {
    // 地图初始化
    initMap("mapGraphEdit").then(map => {
      this.map = map;
      //加载地图其他配置
      this.initMapConfig();
    });
  },
  methods: {
    showLocatePoint(obj) {
      this.map.flyTo(obj, 17, { animate: false }); //同时设置地图层级与中心点
    },
    initMapConfig() {
      // 初始化绘制图层
      // if (!this.isDraw) {
      //   this.setEditGraph(this.beforeGraph);
      // }
      this.initDrawCtrl();
    },
    //开始绘制
    drawGraph() {
      this.isDraw = false;
      this.edit = true;
      this.startDraw();
    },
    // 编辑图形方法
    editGraph() {
      this.edit = !this.edit;
      if (this.edit) {
        this.inEdit.enable();
      } else {
        this.inEdit.disable();
        this.inEdit.save();

        this.detailSavedData();
      }
    },
    // 根据图层类型处理数据
    detailSavedData() {
      let _list = [], _center;
      if (this.editType == "line") {
        _list = this.beforeLayer?.getLayers()[0]?.editing?.latlngs[0] ?? [];
        // 给传递后端的数据赋值
        this.graph = [];
        _list.forEach(v => {
          this.graph.push([v.lng, v.lat])
        })
        _center = this.getPolygonAreaCenter(_list.map(v => {
          return [v.lng, v.lat]
        }))
      } else if (this.editType == "polygon") {
        _list = this.beforeLayer?.getLayers()[0]?.editing?.latlngs[0][0] ?? [];
        // 给传递后端的数据赋值
        this.graph = [];
        _list.forEach(v => {
          this.graph.push([v.lng, v.lat])
        })
        _center = this.getPolygonAreaCenter(_list.map(v => {
          return [v.lng, v.lat]
        }))
      } else if (this.editType == "point") {
        _list = [this.beforeLayer?.getLayers()[0]?.editing._marker._latlng]
        _center = [_list[0].lng, _list[0].lat]
      } else if (this.editType == "circle") {
        _center = this.beforeLayer?.getLayers()[0].getLatLng();
        this.graph = {
          center: _center,
          radius: this.beforeLayer?.getLayers()[0].getRadius(),
        };
      }
      // 根据经纬度获取地址信息
      this.getGraphAddress(_center);
    },
    // 编辑后，默认保存图层 
    submitSaveEdit() {
      this.detailSavedData();
    },
    deleteGraph() {
      this.beforeLayer && this.beforeLayer.clearLayers();
      // this.drawLayerGroup && this.drawLayerGroup.clearLayers();
      this.isDraw = !this.isDraw;
      this.graph = []
      // 清除地图实例上的所有 click 事件绑定
      // this.map.clearEvents('click');
    },
    async getGraphAddress(point) {
      let _this = this;
      let _point = wgs84togcj02(point[0], point[1])
      let res = await axios({
        url: GlobalSetting.MapConfig.poiService + "/bigdata/poiData/getMinAdsByPoi",
        method: "get",
        params: {
          lng: _point[0],//城市权重优先
          lat: _point[1],
        }
      })
      if (res.data.code == 0) {
        _this.address = res.data.detail.address;
      }
    },
    //e可能为array或者事件
    setEditGraph(e) {
      let _this = this, path;
      // 传递数组说明是点线多边形，否则是圆
      if (Array.isArray(e)) {
        path = e;
      } else if (typeof e === "object") {

      }
      let _graph = null;
      // 存储当前的图形数据并显示
      switch (_this.editType) {
        case "line":
          const polylinenObj = {
            fillColor: '#0066FF', // 多边形填充颜色
            weight: 2, // 线条宽度，默认为 1
            color: '#0066FF', // 线条颜色
          };
          _graph = L.polyline(path, { ...polylinenObj });
          // 给传递后端的数据赋值
          _this.graph = [];
          path.forEach(v => {
            _this.graph.push([v.lng, v.lat])
          })
          break;
        case "polygon":
          const polygonObj = {
            fillColor: '#0066FF',// 多边形填充颜色
            weight: 2, // 线条宽度，默认为 1
            color: '#0066FF', // 线条颜色
          };
          _graph = L.polygon(path, { ...polygonObj });
          _this.mapxyStr = { aoLatLng: [] };
          path.forEach(v => {
            _this.mapxyStr.aoLatLng.push({ lat: v.lat, lng: v.lng })
          })
          // 给传递后端的数据赋值
          _this.graph = [];
          path.forEach(v => {
            _this.graph.push([v.lng, v.lat])
          })
          break;
        case "circle":
          const circleObj = {
            radius: e.getRadius(), // 圆半径
            fillColor: '#0066FF',  // 圆形填充颜色
            strokeColor: '#fff', // 描边颜色
            strokeWeight: 2, // 描边宽度
          }
          _graph = L.circle(e.getLatLng(), { ...circleObj });
          // 给传递后端的数据赋值
          _this.graph = {
            center: e.getLatLng(),
            radius: e.getRadius(),
          };
          break;
        case "point":
          let lat = '', lng = ''
          if (path[0].lat) {
            lat = path[0].lat
            lng = path[0].lng
          } else if (path[0] && path[0].length > 0) {
            lat = path[0][0]
            lng = path[0][1]
          }
          _this.graph = [[lng, lat]];
          _graph = L.marker([lat, lng])
          break;
      }
      _this.beforeLayer.addLayer(_graph).addTo(_this.map);
      _this.inEdit = new L.EditToolbar.Edit(_this.map, { featureGroup: _this.beforeLayer });
      _this.map.fitBounds(_this.beforeLayer.getBounds(), { maxZoom: 17 });
    },
    startDraw() {
      if (this.drawObj) {
        this.drawObj.disable();
      }
      switch (this.editType) {
        case 'circle': {
          this.drawObj = new L.Draw.Circle(this.map, this.drawControl.options.draw.circle);
          break;
        }
        case 'polygon': {
          this.drawObj = new L.Draw.Polygon(this.map, this.drawControl.options.draw.polygon);
          break;
        }
        case 'line': {
          this.drawObj = new L.Draw.Polyline(this.map, this.drawControl.options.draw.polyline);
          break;
        }
        case 'point': {// 点
          this.drawObj = new L.Draw.Marker(this.map, this.drawControl.options.draw.marker);
          break;
        }
      }
      // 启动
      this.drawObj?.enable();
    },
    stopDraw() {
      if (this.drawLayerGroup) {
        this.drawLayerGroup.clearLayers();
      }
      this.drawObj.disable();
    },
    drawCreateBack(e) {
      let drawLayer = e.layer;
      if (!this.drawLayerGroup) {
        this.drawLayerGroup = new L.FeatureGroup;
        this.map.addLayer(this.drawLayerGroup);
      }

      this.drawLayerGroup.addLayer(drawLayer);
      this.edit = false;
      this.isDraw = false;

      let _list = [], _center;
      if (this.editType == 'polygon') {
        _list = drawLayer.editing.latlngs[0][0];
        this.graph = [];
        _list.forEach(v => {
          this.graph.push([v.lng, v.lat])
        })
        _center = this.getPolygonAreaCenter(_list.map(v => {
          return [v.lng, v.lat]
        }))
        this.setEditGraph(_list)
      } else if (this.editType == "line") {
        _list = drawLayer.editing.latlngs[0];
        this.graph = [];
        _list.forEach(v => {
          this.graph.push([v.lng, v.lat])
        })
        _center = this.getPolygonAreaCenter(_list.map(v => {
          return [v.lng, v.lat]
        }))
        this.setEditGraph(_list)
      } else if (this.editType == "circle") {
        _center = drawLayer.getLatLng()
        this.graph = {
          center: _center,
          radius: drawLayer.getRadius(),
        };
        this.setEditGraph(drawLayer)
      } else if (this.editType == "point") {
        _list = [drawLayer._latlng];
        this.graph = [];
        _list.forEach(v => {
          this.graph.push([v.lng, v.lat])
        })
        _center = this.getPolygonAreaCenter(_list.map(v => {
          return [v.lng, v.lat]
        }))
        this.setEditGraph(_list)
      }
      // 根据经纬度获取地址信息
      this.getGraphAddress(_center);
      // this.destroyDrawCtrl()
    },
    initDrawCtrl() {
      let _this = this;
      this.drawControl = new L.Control.Draw({
        // position: 'bottomleft',
        draw: {
          polygon: _this.editType == 'polygon',
          polyline: _this.editType == 'line',
          circle: _this.editType == 'circle',
          rectangle: _this.editType == 'rectangle',
          point: false,
          marker: false,
        },
        edit: {
          featureGroup: this.beforeLayer,
          edit: {},
          remove: true,
        }
      }).addTo(this.map);

      this.map.on(L.Draw.Event.CREATED, this.drawCreateBack);
    },
    destroyDrawCtrl() {
      // this.drawControl = null;
      this.drawObj = null;
      if (this.drawLayerGroup) {
        this.drawLayerGroup.clearLayers();
      }

      // this.map.off(L.Draw.Event.CREATED, this.drawCreateBack);
    },
    //计算质心
    getPolygonAreaCenter(points) {
      function Area(p0, p1, p2) {
        let area = 0.0;
        area = p0[0] * p1[1] + p1[0] * p2[1] + p2[0] * p0[1] - p1[0] * p0[1] - p2[0] * p1[1] - p0[0] * p2[1];
        return area / 2;
      }
      let sum_x = 0;
      let sum_y = 0;
      let sum_area = 0;

      if (points.length == 2) {
        return [(points[0][0] + points[1][0]) / 2, (points[0][1] + points[1][1]) / 2]
      }

      let p1 = points[1],
        p2, area;
      for (let i = 2; i < points.length; i++) {
        p2 = points[i];
        area = Area(points[0], p1, p2);
        sum_area += area;
        sum_x += (points[0][0] + p1[0] + p2[0]) * area;
        sum_y += (points[0][1] + p1[1] + p2[1]) * area;
        p1 = p2;
      }
      let xx = sum_x / sum_area / 3;
      let yy = sum_y / sum_area / 3;
      return [xx, yy];
    },
  },
}
</script>
<style scoped lang="scss">
.mapGraphEdit {
  width: 100%;
  height: 100%;
  position: relative;

  #mapGraphEdit {
    height: 100%;
    width: 100%;
  }

  .map-tool {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 70px;
    background-color: var(--el-color-primary);
    color: #fff;
    text-align: center;
    border-radius: 5px;
    z-index: 500;

    .tool-item {
      line-height: 35px;
      cursor: pointer;

      i {
        margin-right: 4px;
      }

      &:hover {
        color: #fff;
      }
    }
  }

  .searchDom {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 220px;
    z-index: 500;
  }

  :deep(.leaflet-draw-section) {
    display: none;
  }
}
</style>