
import 'leaflet/dist/leaflet.css'
// 引入Leaflet对象 挂载到Vue上，便于全局使用，也可以单独页面中单独引用
import * as L from 'leaflet'

//引入绘图插件
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
import '@/utils/map/leaflet-zh-cn'

import 'proj4'
import 'proj4leaflet';

/* leaflet icon */
let prototype = L.Icon.Default.prototype
delete prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
    iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
    shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})
