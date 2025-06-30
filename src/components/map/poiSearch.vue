<!--
 * @Author: pmy
 * @Date: 2022-09-22 09:23:05
 * @LastEditors: pmy
 * @LastEditTime: 2022-09-22 17:21:55
 * @FilePath: \tyzhhw_yidong\src\components\common\poiSearch.vue
 * @Description: 点击获取定位和兴趣点的组件
 * Copyright (c) 2022 by pmy/exsun, All Rights Reserved. 
-->
<template>
  <div style="position:relative">
    <div class="point-search">
      <el-input :placeholder="placeholder" :clearable="clearable" v-model="searchText" @clear="clearInputHandle"
        class="poi-input" @input="getSearchPoi" @blur="blurHandle" @focus="focusHandle"></el-input>
      <ul class="poi-list" v-show="showPoi">
        <li v-for="(v, i) in pois" :key="i" @click.stop="poiItemClick(v)">
          <img :src="poiImg" class="poi-img">
          <div>
            <span class="address-text">{{ v.name }}</span>
            <span class="area-text">{{ v.province + v.city + v.area }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div id="psMap"></div>
  </div>
</template>
<script>
import axios from "axios"
import { gcj02towgs84, wgs84togcj02 } from "@/utils/map/coordinateTransfor"
import { initMap } from '@/utils/map/leafletMap';
let timer, map, marker;
export default {
  props: {
    placeholder: {
      typeof: String,
      default: "请输入关键字：(选定后搜索)"
    },
    clearable: {
      typeof: Boolean,
      default: true,
    },
    clearFunc: {
      typeof: Function,
      default: () => {
        return () => { }
      },
    },
    poiSelClick: {
      typeof: Function,
      default: () => {
        return () => { }
      },
    },
    centerCity: {
      typeof: String,
      default: "武汉市",
    },
    // 如果表格存在经纬度，则传递  {lng:111,lat:33}
    formData: {
      typeof: Object,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      searchText: "",
      showPoi: false,
      pois: [],
      poiImg: "data:image/png;base64,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",
      outputPos: {
        lng: null,
        lat: null,
        position: null,
      }
    };
  },
  components: {},
  mounted() {
    let _this = this;
    this.$nextTick(() => {
      initMap("psMap").then(_map => {
        map = _map

        _map.on('click', (e) => {
          _this.confirmPosition(e.latlng)
        })
        if (_this.formData.lng && _this.formData.lat) {
          _this.confirmPosition(_this.formData)
          map.flyTo(_this.formData, 15, { animate: false }); //同时设置地图层级与中心点
        }
      })
    })
  },
  methods: {
    confirmPosition(data) {
      let _this = this;
      if (marker) {
        marker.removeFrom(map)
      }
      marker = new L.marker(data).addTo(map);
      if (data.address) {
        marker.bindTooltip(data.address)
        _this.outputPos = {
          lng: data.lng,
          lat: data.lat,
          position: data.address,
        }
      } else {
        _this.getGraphAddress(data).then(res => {
          _this.outputPos = {
            lng: data.lng,
            lat: data.lat,
            position: res,
          }
          marker.bindTooltip(res)
        })
      }
    },
    doFunc() {
      this.showPoi = !!this.searchText;
      if (this.searchText) {
        axios({
          url: GlobalSetting.MapConfig.poiService + "/bigdata/poiData/matchQuery",
          method: "get",
          params: {
            city: this.centerCity,//城市权重优先
            search: this.searchText,
            cityLimit: false//是否只搜索一个城市
          }
        }).then(res => {
          this.pois = res.data.detail;
        })
      }
    },
    async getGraphAddress(point) {
      let _point = wgs84togcj02(point.lng, point.lat)
      let res = await axios({
        url: GlobalSetting.MapConfig.poiService + "/bigdata/poiData/getMinAdsByPoi",
        method: "get",
        params: {
          lng: _point[0],//城市权重优先
          lat: _point[1],
        }
      })
      if (res.data.code == 0) {
        return res.data.detail.address;
      }
      return ''
    },
    getSearchPoi() {
      let _this = this;
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(function () {
        _this.doFunc()
      }, 200)
    },
    clearInputHandle() {
      this.clearFunc.call(this);
      this.showPoi = false
    },
    focusHandle() {
      this.showPoi = true
      if (!this.searchText) {
        this.pois = [];
      }
    },
    poiItemClick(obj) {
      let point84 = gcj02towgs84(obj.lng, obj.lat)
      map.flyTo(obj, 15, { animate: false }); //同时设置地图层级与中心点
      obj.lng = point84[0];
      obj.lat = point84[1];
      this.searchText = obj.name;
      this.poiSelClick(obj)
      this.confirmPosition(obj)
      this.showPoi = false
    },
    blurHandle() {
      let _this = this;
      setTimeout(() => {
        _this.showPoi = false
      }, 300)
    },
  }
}
</script>
<style lang='scss' scoped>
#psMap {
  width: 100%;
  height: 100%;
  z-index: 0;
}

.point-search {
  position: absolute;
  z-index: 10;
  left: 16px;
  top: 16px;
}

.poi-input {
  width: 230px;
}

.poi-list {
  margin-top: 4px;
  border-radius: 4px;
  width: 230px;
  max-height: 260px;
  overflow-y: auto;
  background: #fff;
  color: #000;
  font-size: 13px;
  box-sizing: border-box;

  li {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding: 8px 10px;
    cursor: pointer;

    &:last-of-type {
      border: 0;
    }

    &:hover {
      background-color: #cae1ff;
    }
  }
}

.poi-img {
  width: 11px;
  height: 16px;
  margin-right: 8px;
}

.area-text {
  color: #999;
  font-size: 12px;
  margin-left: 10px;
}
</style>