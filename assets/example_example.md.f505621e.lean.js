import{k as Nt,o as Rt,c as Pt,d as Ne,a5 as Ms,j as Dn,a6 as Nn,a7 as Ie,C as B,a8 as Os,_ as In,Y as Dh,H as Nh,J as Y,E as At,a as xt}from"./chunks/framework.91564eae.js";const Ih=`<template>\r
  <div class="container">\r
    <div ref="mainElementRef" class="main"></div>\r
  </div>\r
</template>\r
\r
<script lang="ts" setup>\r
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'\r
import { createCanvas, createGroup, renderCanvas, ZRenderGroup, ZRenderType } from 'auto-drawing'\r
import type { ShapeCoreType } from 'auto-drawing'\r
import axios from 'axios'\r
\r
type Nullable<T> = T | null\r
\r
interface IState {\r
  zr: Nullable<ZRenderType>\r
  group: Nullable<ZRenderGroup>\r
  loading: boolean\r
}\r
\r
const state = reactive<IState>({ zr: null, group: null, loading: true })\r
const mainElementRef = ref<any>(null)\r
const width = 688\r
const height = 400\r
const baseOptions = { x: 40, y: 0 }\r
onMounted(() => {\r
  state.zr = createCanvas(mainElementRef.value, {\r
    width,\r
    height\r
  })\r
  state.group = createGroup(baseOptions)\r
  axios.get('https://xf-1252186245.cos.ap-chengdu.myqcloud.com/CAD/data.json').then(res => {\r
    const data = res.data as ShapeCoreType[]\r
    renderCanvas(state.zr as ZRenderType, state.group as ZRenderGroup, data)\r
    state.loading = false\r
  })\r
})\r
\r
onBeforeUnmount(() => {\r
  state.zr && state.zr.dispose()\r
})\r
<\/script>\r
\r
<style scoped>\r
.container {\r
  padding: 40px;\r
  background: #000;\r
  box-sizing: border-box;\r
  overflow: hidden;\r
}\r
</style>\r
`,Bh=`<template>\r
  <div class="container">\r
    <div ref="mainElementRef" class="main-element" />\r
  </div>\r
</template>\r
\r
<script lang="ts" setup>\r
import { onMounted, onBeforeUnmount, shallowReactive, ref, reactive } from 'vue'\r
import type { ZRenderType, ZRenderGroup, ShapeCoreType } from 'auto-drawing'\r
import { createCanvas, createGroup, renderCanvas } from 'auto-drawing'\r
type Params = {\r
  /**\r
   * 开始坐标\r
   */\r
  start?: number[]\r
  /**\r
   * 结束坐标\r
   */\r
  end?: number[]\r
  /**\r
   * 标题\r
   */\r
  title: string\r
  /**\r
   * 圆点的类型  basicPoint：基点 不可点击   endpoint：端点 可点击\r
   */\r
  pointType: 'basicPoint' | 'endpoint' | ''\r
  /**\r
   * 圆的圆心x坐标\r
   */\r
  cx?: number\r
  /**\r
   * 圆的圆心y坐标\r
   */\r
  cy?: number\r
}\r
type Nullable<T> = T | null\r
\r
interface IState {\r
  zr: Nullable<ZRenderType>\r
  group: Nullable<ZRenderGroup>\r
  clickGroup: Nullable<ZRenderGroup>\r
}\r
\r
const props = defineProps({\r
  /**\r
   * 画布宽\r
   */\r
  width: {\r
    type: Number,\r
    default: 688\r
  },\r
  /**\r
   * 画布高\r
   */\r
  height: {\r
    type: Number,\r
    default: 400\r
  }\r
})\r
\r
const state = shallowReactive<IState>({\r
  zr: null,\r
  group: null,\r
  clickGroup: null\r
})\r
const mainElementRef = ref<any>(null)\r
// 基本配置\r
const baseOptions = { x: props.width / 2, y: props.height / 2 }\r
// 画布两边留白\r
const gutter = 40\r
\r
onMounted(() => {\r
  state.zr = createCanvas(mainElementRef.value as HTMLDivElement) as ZRenderType\r
  state.group = createGroup(baseOptions) as ZRenderGroup\r
  state.clickGroup = createGroup(baseOptions) as ZRenderGroup\r
\r
  const mainRadius = props.height / 2 - gutter\r
\r
  const main = {\r
    type: 'circle',\r
    cx: 0,\r
    cy: 0,\r
    r: mainRadius,\r
    fill: '#ccc',\r
    stroke: '#ccc',\r
    zlevel: 1\r
  }\r
\r
  const terminal = [...new Array(50)].map((_, index) => {\r
    const q = [+1, -1]\r
    const getMark = () => q.at(Math.floor(Math.random() * 2)) as number\r
    const cx = ((Math.random() * mainRadius * Math.sqrt(2)) / 2 - 12) * getMark()\r
    const cy = ((Math.random() * mainRadius * Math.sqrt(2)) / 2 - 12) * getMark()\r
    return {\r
      type: 'group',\r
      params: {\r
        title: index,\r
        pointType: 'endpoint'\r
      },\r
      data: [\r
        {\r
          type: 'circle',\r
          cx,\r
          cy,\r
          r: 12,\r
          fill: 'green',\r
          stroke: 'green',\r
          zlevel: 1\r
        },\r
        {\r
          type: 'circle',\r
          cx,\r
          cy,\r
          r: 8,\r
          fill: 'blue',\r
          stroke: 'blue',\r
          zlevel: 2\r
        },\r
        {\r
          type: 'circle',\r
          cx,\r
          cy,\r
          r: 4,\r
          fill: '#ccc',\r
          stroke: '#ccc',\r
          zlevel: 2\r
        }\r
      ]\r
    }\r
  })\r
\r
  // 所有数据\r
  const data = [main, ...terminal] as ShapeCoreType[]\r
\r
  renderCanvas(state.zr, state.group, data, {\r
    scale: true,\r
    translate: true\r
  })\r
  renderCanvas(state.zr, state.clickGroup, [], {\r
    scale: true,\r
    translate: true\r
  })\r
\r
  state.zr.on('click', (e: any) => {\r
    const { shape, type, parent } = e?.target || {}\r
    const params = (parent?.params as Params) || {}\r
\r
    if (!shape || type !== 'circle' || params.pointType !== 'endpoint') return\r
    const data: ShapeCoreType = {\r
      type: 'circle',\r
      ...shape,\r
      r: 12,\r
      stroke: 'red',\r
      fill: 'red',\r
      zlevel: 2\r
    }\r
    // 移除之前的图形\r
    state.clickGroup?.removeAll()\r
    renderCanvas(state.zr as ZRenderType, state.clickGroup as ZRenderGroup, [data], {\r
      scale: true,\r
      translate: true\r
    })\r
    setTimeout(() => {\r
      alert('点了我：' + params.title)\r
    })\r
  })\r
})\r
\r
onBeforeUnmount(() => {\r
  // 销毁画布\r
  state.zr && state.zr.dispose()\r
})\r
\r
const containerCSS = reactive({\r
  width: props.width + 'px',\r
  height: props.height + 'px'\r
})\r
<\/script>\r
\r
<style lang="scss" scoped>\r
.container {\r
  height: v-bind(' containerCSS.height');\r
  width: v-bind(' containerCSS.width');\r
  overflow: hidden;\r
  padding: 0;\r
  .main-element {\r
    padding: 0;\r
  }\r
}\r
</style>\r
`,Fh=`<template>\r
  <div id="div1" class="canvas-wrapper"></div>\r
</template>\r
\r
<script setup>\r
import { onMounted } from 'vue'\r
import { createCanvas, createGroup, renderCanvas } from 'auto-drawing'\r
onMounted(() => {\r
  const width = 688\r
  const height = 300\r
  const zr = createCanvas('div1', {\r
    width,\r
    height\r
  })\r
  const baseOptions = { x: width / 2, y: height / 2 }\r
  const gp = createGroup(baseOptions)\r
  const data = [\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 43.8405,\r
          y: -35.6235,\r
          width: 90.519,\r
          height: 71.247,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -134.3595,\r
          y: -35.6235,\r
          width: 90.519,\r
          height: 71.247,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'polyline',\r
          points: [\r
            [75.405, -62.865],\r
            [75.405, -52.8],\r
            [46.2, -52.8],\r
            [46.2, 52.8],\r
            [75.405, 52.8],\r
            [75.405, 62.865],\r
            [-75.405, 62.865],\r
            [-75.405, 52.8],\r
            [-46.2, 52.8],\r
            [-46.2, -52.8],\r
            [-75.405, -52.8],\r
            [-75.405, -62.865],\r
            [75.405, -62.865],\r
            [75.405, -62.865]\r
          ],\r
          stroke: 'green',\r
          lineWidth: 0.5,\r
          zlevel: 10\r
        }\r
      ]\r
    },\r
    { type: 'line', zlevel: 1, x1: -10, y1: 0, x2: 10, y2: 0, stroke: 'green' },\r
    { type: 'line', zlevel: 1, x1: 0, y1: 10, x2: 0, y2: -10, stroke: 'green' }\r
  ]\r
  renderCanvas(zr, gp, data, {\r
    scale: true,\r
    translate: true\r
  })\r
})\r
<\/script>\r
`,Wh=`<template>\r
  <div id="div2" class="canvas-wrapper"></div>\r
</template>\r
\r
<script setup>\r
import { onMounted } from 'vue'\r
import { createCanvas, createGroup, renderCanvas } from 'auto-drawing'\r
onMounted(() => {\r
  const width = 688\r
  const height = 300\r
  const zr = createCanvas('div2', {\r
    width,\r
    height\r
  })\r
  const baseOptions = { x: width / 2, y: height / 2 }\r
  const gp = createGroup(baseOptions)\r
  const data = [\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -75.856,\r
          y: 31.344,\r
          width: 32.512,\r
          height: 32.512,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 43.344,\r
          y: 31.344,\r
          width: 32.512,\r
          height: 32.512,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 43.344,\r
          y: -63.856,\r
          width: 32.512,\r
          height: 32.512,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -75.856,\r
          y: -63.856,\r
          width: 32.512,\r
          height: 32.512,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'polyline',\r
          points: [\r
            [-81.28, -70.096],\r
            [81.28, -70.096],\r
            [81.28, 70.096],\r
            [-81.28, 70.096],\r
            [-81.28, 8],\r
            [-75.2, 8],\r
            [-75.2, 8],\r
            [-75.2, 8],\r
            [-72.464, 7.52],\r
            [-70.048, 6.128],\r
            [-68.272, 4],\r
            [-67.312, 1.392],\r
            [-67.312, -1.392],\r
            [-68.272, -4],\r
            [-70.048, -6.128],\r
            [-72.464, -7.52],\r
            [-75.2, -8],\r
            [-81.28, -8],\r
            [-81.28, -70.096],\r
            [-81.28, -70.096]\r
          ],\r
          stroke: 'green',\r
          lineWidth: 0.5,\r
          zlevel: 10\r
        }\r
      ]\r
    },\r
    {\r
      type: 'line',\r
      zlevel: 100,\r
      x1: -10,\r
      y1: 0,\r
      x2: 10,\r
      y2: 0,\r
      stroke: 'green'\r
    },\r
    {\r
      type: 'line',\r
      zlevel: 100,\r
      x1: 0,\r
      y1: 10,\r
      x2: 0,\r
      y2: -10,\r
      stroke: 'green'\r
    }\r
  ]\r
  renderCanvas(zr, gp, data, {\r
    scale: true,\r
    translate: true\r
  })\r
})\r
<\/script>\r
`,Hh=`<template>\r
  <div id="div3" class="canvas-wrapper"></div>\r
</template>\r
\r
<script setup>\r
import { onMounted } from 'vue'\r
import { createCanvas, createGroup, renderCanvas } from 'auto-drawing'\r
onMounted(() => {\r
  const width = 688\r
  const height = 300\r
  const zr = createCanvas('div3', {\r
    width,\r
    height\r
  })\r
  const baseOptions = { x: width / 2, y: height / 2 }\r
  const gp = createGroup(baseOptions)\r
  const data = [\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -107.46,\r
          y: 52.14,\r
          width: 30.48,\r
          height: 15.24,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -107.46,\r
          y: 22.26,\r
          width: 30.48,\r
          height: 15.24,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -107.46,\r
          y: -7.62,\r
          width: 30.48,\r
          height: 15.24,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -107.46,\r
          y: -37.5,\r
          width: 30.48,\r
          height: 15.24,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -107.46,\r
          y: -67.38,\r
          width: 30.48,\r
          height: 15.24,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 76.98,\r
          y: -67.38,\r
          width: 30.48,\r
          height: 15.24,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 76.98,\r
          y: -37.5,\r
          width: 30.48,\r
          height: 15.24,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 76.98,\r
          y: -7.62,\r
          width: 30.48,\r
          height: 15.24,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 76.98,\r
          y: 22.26,\r
          width: 30.48,\r
          height: 15.24,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 76.98,\r
          y: 52.14,\r
          width: 30.48,\r
          height: 15.24,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'polyline',\r
          points: [\r
            [72, -81.6],\r
            [72, 81.6],\r
            [-60, 81.6],\r
            [-72, 69.6],\r
            [-72, -81.6],\r
            [72, -81.6],\r
            [72, -81.6]\r
          ],\r
          stroke: 'green',\r
          lineWidth: 0.5,\r
          zlevel: 10\r
        }\r
      ]\r
    },\r
    { type: 'line', zlevel: 1, x1: -10, y1: 0, x2: 10, y2: 0, stroke: 'green' },\r
    { type: 'line', zlevel: 1, x1: 0, y1: 10, x2: 0, y2: -10, stroke: 'green' }\r
  ]\r
  renderCanvas(zr, gp, data, {\r
    scale: true,\r
    translate: true\r
  })\r
})\r
<\/script>\r
`,Gh=`<template>\r
  <div id="div4"></div>\r
</template>\r
\r
<script setup>\r
import { onMounted } from 'vue'\r
import { createCanvas, createGroup, renderCanvas } from 'auto-drawing'\r
onMounted(() => {\r
  const width = 688\r
  const height = 300\r
  const zr = createCanvas('div4', {\r
    width,\r
    height\r
  })\r
  const baseOptions = { x: width / 2, y: height / 2 }\r
  const gp = createGroup(baseOptions)\r
  const data = [\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -78.375,\r
          y: 96.206,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -67.375,\r
          y: 96.206,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -56.375,\r
          y: 96.206,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -45.375,\r
          y: 96.206,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -34.375,\r
          y: 96.206,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -23.375,\r
          y: 96.206,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -12.375,\r
          y: 96.206,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -1.375,\r
          y: 96.206,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 9.625,\r
          y: 96.206,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 20.625,\r
          y: 96.206,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 31.625,\r
          y: 96.206,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 42.625,\r
          y: 96.206,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 81.125,\r
          y: 57.706,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 81.125,\r
          y: 46.706,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 81.125,\r
          y: 35.706,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 81.125,\r
          y: 24.706,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 81.125,\r
          y: 13.706,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 81.125,\r
          y: 2.706,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 81.125,\r
          y: -8.294,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 81.125,\r
          y: -19.294,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 81.125,\r
          y: -30.294,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 81.125,\r
          y: -41.294,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 81.125,\r
          y: -52.294,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 81.125,\r
          y: -63.294,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 42.625,\r
          y: -101.794,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 31.625,\r
          y: -101.794,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 20.625,\r
          y: -101.794,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: 9.625,\r
          y: -101.794,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -1.375,\r
          y: -101.794,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -12.375,\r
          y: -101.794,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -23.375,\r
          y: -101.794,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -34.375,\r
          y: -101.794,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -45.375,\r
          y: -101.794,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -56.375,\r
          y: -101.794,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -67.375,\r
          y: -101.794,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -78.375,\r
          y: -101.794,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -116.875,\r
          y: -63.294,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -116.875,\r
          y: -52.294,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -116.875,\r
          y: -41.294,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -116.875,\r
          y: -30.294,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -116.875,\r
          y: -19.294,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -116.875,\r
          y: -8.294,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -116.875,\r
          y: 2.706,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -116.875,\r
          y: 13.706,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -116.875,\r
          y: 24.706,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -116.875,\r
          y: 35.706,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -116.875,\r
          y: 46.706,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1,\r
          x: -116.875,\r
          y: 57.706,\r
          width: 35.75,\r
          height: 5.588,\r
          fill: 'green',\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'polyline',\r
          points: [\r
            [-77, 66],\r
            [-77, -77],\r
            [77, -77],\r
            [77, 77],\r
            [-66, 77],\r
            [-77, 66],\r
            [-77, 66]\r
          ],\r
          stroke: 'red',\r
          lineWidth: 0.5,\r
          zlevel: 10\r
        }\r
      ]\r
    },\r
    {\r
      type: 'line',\r
      zlevel: 1,\r
      x1: -10,\r
      y1: 0,\r
      x2: 10,\r
      y2: 0,\r
      stroke: 'red'\r
    },\r
    {\r
      type: 'line',\r
      zlevel: 1,\r
      x1: 0,\r
      y1: 10,\r
      x2: 0,\r
      y2: -10,\r
      stroke: 'red'\r
    }\r
  ]\r
  renderCanvas(zr, gp, data, {\r
    scale: true,\r
    translate: true\r
  })\r
})\r
<\/script>\r
`,Uh=`<template>\r
  <div id="div5"></div>\r
</template>\r
\r
<script setup>\r
import { onMounted } from 'vue'\r
import { createCanvas, createGroup, renderCanvas } from 'auto-drawing'\r
onMounted(() => {\r
  const width = 688\r
  const height = 400\r
  const zr = createCanvas('div5', {\r
    width,\r
    height\r
  })\r
  const baseOptions = { x: width / 2, y: height / 2, scaleX: 1.5, scaleY: 1.5 }\r
  const gp = createGroup(baseOptions)\r
  const data = [\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -57.6,\r
          y: -96,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -50.1,\r
          y: -96,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -42.6,\r
          y: -96,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -35.1,\r
          y: -96,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -27.6,\r
          y: -96,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -20.1,\r
          y: -96,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -12.6,\r
          y: -96,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -5.1,\r
          y: -96,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 2.4,\r
          y: -96,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 9.9,\r
          y: -96,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 17.4,\r
          y: -96,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 24.9,\r
          y: -96,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 32.4,\r
          y: -96,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 39.9,\r
          y: -96,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 47.4,\r
          y: -96,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 54.9,\r
          y: -96,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 54.9,\r
          y: 75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 47.4,\r
          y: 75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 39.9,\r
          y: 75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 32.4,\r
          y: 75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 24.9,\r
          y: 75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 17.4,\r
          y: 75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 9.9,\r
          y: 75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 2.4,\r
          y: 75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -5.1,\r
          y: 75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -12.6,\r
          y: 75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -20.1,\r
          y: 75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -27.6,\r
          y: 75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -35.1,\r
          y: 75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -42.6,\r
          y: 75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -50.1,\r
          y: 75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -57.6,\r
          y: 75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 84.15,\r
          y: -66.75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 84.15,\r
          y: -59.25,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 84.15,\r
          y: -51.75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 84.15,\r
          y: -44.25,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 84.15,\r
          y: -36.75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 84.15,\r
          y: -29.25,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 84.15,\r
          y: -21.75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 84.15,\r
          y: -14.25,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 84.15,\r
          y: -6.75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 84.15,\r
          y: 0.75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 84.15,\r
          y: 8.25,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 84.15,\r
          y: 15.75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 84.15,\r
          y: 23.25,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 84.15,\r
          y: 30.75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 84.15,\r
          y: 38.25,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: 84.15,\r
          y: 45.75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -86.85,\r
          y: 45.75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -86.85,\r
          y: 38.25,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -86.85,\r
          y: 30.75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -86.85,\r
          y: 23.25,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -86.85,\r
          y: 15.75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -86.85,\r
          y: 8.25,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -86.85,\r
          y: 0.75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -86.85,\r
          y: -6.75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -86.85,\r
          y: -14.25,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -86.85,\r
          y: -21.75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -86.85,\r
          y: -29.25,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -86.85,\r
          y: -36.75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -86.85,\r
          y: -44.25,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -86.85,\r
          y: -51.75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -86.85,\r
          y: -59.25,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'group',\r
      data: [\r
        {\r
          type: 'rect',\r
          zlevel: 1000,\r
          x: -86.85,\r
          y: -66.75,\r
          width: 2.7,\r
          height: 21,\r
          fill: 'none',\r
          lineWidth: 1,\r
          stroke: 'green'\r
        }\r
      ]\r
    },\r
    {\r
      type: 'line',\r
      zlevel: 100,\r
      x1: -10,\r
      y1: 0,\r
      x2: 10,\r
      y2: 0,\r
      stroke: 'red'\r
    },\r
    {\r
      type: 'line',\r
      zlevel: 100,\r
      x1: 0,\r
      y1: 10,\r
      x2: 0,\r
      y2: -10,\r
      stroke: 'red'\r
    },\r
    {\r
      type: 'rect',\r
      x: -75,\r
      y: -75,\r
      width: 150,\r
      height: 150,\r
      stroke: '#fff',\r
      lineWidth: 0.5,\r
      zlevel: 100,\r
      lineDash: 'dashed'\r
    },\r
    {\r
      type: 'circle',\r
      zlevel: 1500,\r
      cx: -60,\r
      cy: 60,\r
      r: 7.5,\r
      fill: 'red',\r
      stroke: 'red',\r
      opacity: 0.5\r
    }\r
  ]\r
\r
  renderCanvas(zr, gp, data, {\r
    scale: true,\r
    translate: true\r
  })\r
})\r
<\/script>\r
`,$h=`<template>\r
  <div class="container">\r
    <div ref="mainElementRef" class="main-element" />\r
  </div>\r
</template>\r
\r
<script lang="ts" setup>\r
import { onMounted, onBeforeUnmount, shallowReactive, ref, reactive } from 'vue'\r
import type { ZRenderType, ZRenderGroup, ShapeCoreType } from 'auto-drawing'\r
import { createCanvas, createGroup, renderCanvas } from 'auto-drawing'\r
import type { Params } from './utils'\r
import { getCircle, getLine, getText } from './utils'\r
\r
interface IState {\r
  zr: Nullable<ZRenderType>\r
  group: Nullable<ZRenderGroup>\r
  clickGroup: Nullable<ZRenderGroup>\r
}\r
\r
type Direction = 'left' | 'right'\r
\r
const props = defineProps({\r
  /**\r
   * 画布宽\r
   */\r
  width: {\r
    type: Number,\r
    default: 688\r
  },\r
  /**\r
   * 画布高\r
   */\r
  height: {\r
    type: Number,\r
    default: 400\r
  }\r
})\r
\r
const state = shallowReactive<IState>({\r
  zr: null,\r
  group: null,\r
  clickGroup: null\r
})\r
const mainElementRef = ref<any>(null)\r
// 基本配置\r
const baseOptions = { x: props.width / 2, y: props.height / 2 }\r
\r
onMounted(() => {\r
  state.zr = createCanvas(mainElementRef.value as HTMLDivElement) as ZRenderType\r
  state.group = createGroup(baseOptions) as ZRenderGroup\r
  state.clickGroup = createGroup(baseOptions) as ZRenderGroup\r
  state.zr.setBackgroundColor('#fff')\r
\r
  // 原数据\r
  const originData: string[] = [...new Array(30)].map((_, index) => String(index))\r
\r
  // 画布两边留白\r
  const gutter = 40\r
  // 鱼刺往后斜的距离\r
  const angleLength = props.width / 20\r
  // 鱼刺方向\r
  const direction: Direction = 'left'\r
  // 鱼刺长度\r
  const fishboneLength = (props.height / 2 - gutter) / 2\r
  // 主轴的基本坐标\r
  const base = props.width / 2 - gutter\r
  // 主轴数据\r
  const main = originData.slice(0, 2)\r
  // 鱼刺数据\r
  const body = originData.slice(2)\r
  // 主轴上面鱼刺数据\r
  const bodyTop = body.slice(0, Math.ceil(body.length / 2))\r
  // 主轴下面鱼刺数据\r
  const bodyBottom = body.slice(Math.ceil(body.length / 2))\r
  // 主抽的点数量\r
  const pointCount = Math.max(bodyTop.length, bodyBottom.length)\r
  // 主抽每个点之间的间距\r
  const pointStep = (props.width - gutter * 2) / (pointCount + 1)\r
\r
  // 生成主轴点数据\r
  const point = [...new Array(pointCount)].map((item, index) => {\r
    return [-base + (index + 1) * pointStep, 0]\r
  })\r
\r
  // 生成鱼刺方法\r
  const getData = (item: string, index: number, type: string) => {\r
    const mark = type === 'top' ? -1 : 1\r
    const directionMark = direction === 'left' ? -1 : 1\r
    const [baseX, baseY] = point[index]\r
    const params: Params = {\r
      start: point[index],\r
      end: [baseX + angleLength * directionMark, fishboneLength * mark],\r
      title: item,\r
      pointType: 'basicPoint',\r
      tag: 'start'\r
    }\r
    // 生成主轴基点圆图形数据\r
    const baseCircle = getCircle(baseX, baseY, params)\r
    const [x1, y1] = baseCircle.params.start as number[]\r
    const [x2, y2] = baseCircle.params.end as number[]\r
    // 生成鱼刺圆点图形数据\r
    const bodyTop = getCircle(x2, y2, {\r
      ...baseCircle.params,\r
      pointType: 'endpoint',\r
      tag: 'end'\r
    })\r
    // 生成鱼刺直线图形数据\r
    const line = getLine(x1, y1, x2, y2)\r
    // 生成鱼刺文字图形数据\r
    const offset = mark === -1 ? -24 : 14\r
    const text = getText(x2 - 10, y2 + offset, baseCircle.params.title)\r
    return { type: 'group', data: [baseCircle, bodyTop, line, text], params }\r
  }\r
\r
  /** 上鱼刺数据处理 */\r
  const bodyTopData = bodyTop.map((item, index) => getData(item, index, 'top'))\r
\r
  /** 下鱼刺数据处理 */\r
  const bodyBottomData = bodyBottom.map((item, index) => getData(item, index, 'bottom'))\r
\r
  /** 主抽数据处理 */\r
  const mainCircleData = main.map((item, index) => {\r
    const cx = index === 0 ? -base : base\r
    const cy = 0\r
    const title = item\r
    const params: Params = {\r
      title: item,\r
      cx,\r
      cy,\r
      pointType: 'endpoint',\r
      point: [cx, cy]\r
    }\r
    // 主抽圆点图数据\r
    const circle = getCircle(cx, 0, params)\r
    // 主抽文字图数据\r
    const x = cx - 6\r
    const y = cy - 24\r
    const text = getText(x, y, title)\r
    return { type: 'group', data: [circle, text], params }\r
  })\r
  const mainLineMap = mainCircleData.map(item => item.params.point as number[])\r
  const [[x1, y1], [x2, y2]] = mainLineMap\r
  // 主抽直线图数据\r
  const mainLineData = getLine(x1, y1, x2, y2)\r
  // 主抽整体图数据\r
  const mainData = [...mainCircleData, mainLineData]\r
\r
  // 所有数据\r
  const data = [...mainData, ...bodyTopData, ...bodyBottomData] as ShapeCoreType[]\r
\r
  renderCanvas(state.zr, state.group, data, { scale: true, translate: true })\r
  renderCanvas(state.zr, state.clickGroup, [], {\r
    scale: true,\r
    translate: true\r
  })\r
\r
  state.zr.on('click', (e: any) => {\r
    const { shape, type } = e?.target || {}\r
    const params = (e?.target?.params as Params) || {}\r
    if (!shape || type !== 'circle' || params.pointType !== 'endpoint') return\r
    const data: ShapeCoreType = {\r
      type: 'circle',\r
      ...shape,\r
      stroke: 'red',\r
      fill: 'red',\r
      zlevel: 2\r
    }\r
    // 移除之前的图形\r
    state.clickGroup?.removeAll()\r
    renderCanvas(state.zr as ZRenderType, state.clickGroup as ZRenderGroup, [data], {\r
      scale: true,\r
      translate: true\r
    })\r
    setTimeout(() => {\r
      alert('点了我：' + params.title)\r
    })\r
  })\r
})\r
\r
onBeforeUnmount(() => {\r
  // 销毁画布\r
  state.zr && state.zr.dispose()\r
})\r
\r
const containerCSS = reactive({\r
  width: props.width + 'px',\r
  height: props.height + 'px'\r
})\r
<\/script>\r
\r
<style lang="scss" scoped>\r
.container {\r
  height: v-bind('containerCSS.height');\r
  width: v-bind('containerCSS.width');\r
  overflow: hidden;\r
  padding: 0;\r
  .main-element {\r
    padding: 0;\r
  }\r
}\r
</style>\r
`,Xh=`<template>\r
  <div id="div0" class="canvas-wrapper"></div>\r
</template>\r
\r
<script setup>\r
import { onMounted } from 'vue'\r
import { createCanvas, createGroup, renderCanvas } from 'auto-drawing'\r
onMounted(() => {\r
  const width = 688\r
  const height = 400\r
  const zr = createCanvas('div0', {\r
    width,\r
    height\r
  })\r
  const baseOptions = { x: 200, y: 140 }\r
  const gp = createGroup(baseOptions)\r
  const data = [\r
    {\r
      type: 'line',\r
      zlevel: 1,\r
      x1: 32,\r
      y1: 62,\r
      x2: 168,\r
      y2: 62,\r
      stroke: '#f8f8b8'\r
    },\r
    {\r
      type: 'line',\r
      zlevel: 1,\r
      x1: 168,\r
      y1: 62,\r
      x2: 168,\r
      y2: 139,\r
      stroke: '#f8f8b8'\r
    },\r
    {\r
      type: 'line',\r
      zlevel: 1,\r
      x1: 168,\r
      y1: 139,\r
      x2: 32,\r
      y2: 139,\r
      stroke: '#f8f8b8'\r
    },\r
    {\r
      type: 'line',\r
      zlevel: 1,\r
      x1: 32,\r
      y1: 139,\r
      x2: 32,\r
      y2: 62,\r
      stroke: '#f8f8b8'\r
    },\r
    {\r
      type: 'rect',\r
      zlevel: 0,\r
      x: 135,\r
      y: 76,\r
      width: 40,\r
      height: 50,\r
      fill: '#00ff01',\r
      stroke: '#00ff01'\r
    },\r
    {\r
      type: 'sector',\r
      cx: 100,\r
      cy: 96,\r
      r: 100,\r
      r0: 0,\r
      startAngle: 0,\r
      endAngle: 90,\r
      fill: 'yellow',\r
      clockwise: true\r
    }\r
  ]\r
  renderCanvas(zr, gp, data, {\r
    scale: true,\r
    translate: true\r
  })\r
})\r
<\/script>\r
`,Yh=`<template>\r
  <div class="container">\r
    <div ref="mainElementRef" class="main"></div>\r
  </div>\r
</template>\r
\r
<script lang="ts" setup>\r
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'\r
import { createCanvas, createGroup, renderCanvas, ZRenderGroup, ZRenderType } from 'auto-drawing'\r
import type { ShapeCoreType } from 'auto-drawing'\r
import axios from 'axios'\r
\r
type Nullable<T> = T | null\r
\r
interface IState {\r
  zr: Nullable<ZRenderType>\r
  group: Nullable<ZRenderGroup>\r
  loading: boolean\r
}\r
\r
/**\r
 * 生成圆弧\r
 * @param cx\r
 * @param cy\r
 * @param params\r
 * @returns\r
 */\r
const getCircle = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => ({\r
  type: 'arc',\r
  cx: cx,\r
  cy: cy,\r
  startAngle,\r
  endAngle,\r
  r,\r
  fill: 'none',\r
  stroke: 'green',\r
  zlevel: 1\r
})\r
\r
/**\r
 * 生成直线\r
 * @param x1\r
 * @param y1\r
 * @param x2\r
 * @param y2\r
 * @returns\r
 */\r
const getLine = (x1: number, y1: number, x2: number, y2: number, stroke = '#fff') => ({\r
  type: 'line',\r
  x1,\r
  y1,\r
  x2,\r
  y2,\r
  stroke,\r
  fill: '#fff'\r
})\r
\r
/**\r
 * 生成文字\r
 * @param x\r
 * @param y\r
 * @param text\r
 * @returns\r
 */\r
const getText = (x: number, y: number, text: string) => ({\r
  type: 'text',\r
  x,\r
  y,\r
  text: text,\r
  fontSize: 6,\r
  fontWeight: 400,\r
  stroke: '#fff',\r
  fill: '#fff',\r
  zlevel: 10\r
})\r
\r
const state = reactive<IState>({ zr: null, group: null, loading: true })\r
const mainElementRef = ref<any>(null)\r
\r
const width = 688\r
const height = 400\r
const rate = 50\r
\r
const baseOptions = { x: 260, y: height - 100 }\r
onMounted(() => {\r
  state.zr = createCanvas(mainElementRef.value, {\r
    width,\r
    height\r
  })\r
  state.group = createGroup(baseOptions)\r
  axios.get('https://xf-1252186245.cos.ap-chengdu.myqcloud.com/room.json').then(res => {\r
    const data = res.data.data\r
    const shapeData = data.map((item: any) => {\r
      if (item['名称'] === '直线') {\r
        const x1 = Number(item['起点X']) / rate\r
        const y1 = -Number(item['起点Y']) / rate\r
        const x2 = Number(item['端点X']) / rate\r
        const y2 = -Number(item['端点Y']) / rate\r
        const layout = item['图层']\r
        const color: Record<string, string> = {\r
          标注: 'red',\r
          '0': 'yellow',\r
          墙线: '#fff',\r
          轴线: 'green',\r
          楼梯: '#ccc',\r
          门窗: '#eee'\r
        }\r
        const stroke = color[layout] || '#fff'\r
        return getLine(x1, y1, x2, y2, stroke)\r
      }\r
      if (item['名称'] === '圆弧') {\r
        const cx = Number(item['中心X']) / rate\r
        const cy = -Number(item['中心Y']) / rate\r
        const r = Number(item['半径']) / rate\r
        const startAngle = Number(item['起点角度'])\r
        const endAngle = startAngle + Number(item['总角度'])\r
        return getCircle(cx, cy, r, startAngle, endAngle)\r
      }\r
      if (item['名称'] === '多行文字') {\r
        const x = Number(item['位置X']) / rate\r
        const y = -Number(item['位置Y']) / rate\r
        const text = item['内容']\r
        return getText(x, y, text)\r
      }\r
      return {\r
        type: 'group',\r
        data: []\r
      }\r
    }) as ShapeCoreType[]\r
\r
    renderCanvas(state.zr as ZRenderType, state.group as ZRenderGroup, shapeData, {\r
      translate: true,\r
      scale: true\r
    })\r
    state.loading = false\r
  })\r
})\r
\r
onBeforeUnmount(() => {\r
  state.zr && state.zr.dispose()\r
})\r
<\/script>\r
\r
<style scoped>\r
.container {\r
  padding: 40px;\r
  background: #000;\r
  box-sizing: border-box;\r
  overflow: hidden;\r
}\r
</style>\r
`,qh=`<template>\r
  <div class="container">\r
    <div ref="mainElementRef" class="main"></div>\r
  </div>\r
</template>\r
\r
<script lang="ts" setup>\r
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'\r
import { createCanvas, createGroup, renderCanvas, ZRenderGroup, ZRenderType } from 'auto-drawing'\r
import type { ShapeCoreType } from 'auto-drawing'\r
import axios from 'axios'\r
\r
type Nullable<T> = T | null\r
\r
interface IState {\r
  zr: Nullable<ZRenderType>\r
  group: Nullable<ZRenderGroup>\r
  loading: boolean\r
}\r
\r
/**\r
 * 生成圆弧\r
 * @param cx\r
 * @param cy\r
 * @param params\r
 * @returns\r
 */\r
const getCircle = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => ({\r
  type: 'arc',\r
  cx: cx,\r
  cy: cy,\r
  startAngle,\r
  endAngle,\r
  r,\r
  fill: 'none',\r
  stroke: 'green',\r
  zlevel: 1\r
})\r
\r
/**\r
 * 生成直线\r
 * @param x1\r
 * @param y1\r
 * @param x2\r
 * @param y2\r
 * @returns\r
 */\r
const getLine = (x1: number, y1: number, x2: number, y2: number, stroke = '#fff') => ({\r
  type: 'line',\r
  x1,\r
  y1,\r
  x2,\r
  y2,\r
  stroke,\r
  fill: '#fff'\r
})\r
\r
/**\r
 * 生成文字\r
 * @param x\r
 * @param y\r
 * @param text\r
 * @returns\r
 */\r
const getText = (x: number, y: number, text: string) => ({\r
  type: 'text',\r
  x,\r
  y,\r
  text: text,\r
  fontSize: 6,\r
  fontWeight: 400,\r
  stroke: '#fff',\r
  fill: '#fff',\r
  zlevel: 10\r
})\r
\r
const state = reactive<IState>({ zr: null, group: null, loading: true })\r
const mainElementRef = ref<any>(null)\r
\r
const width = 688\r
const height = 400\r
const rate = 60\r
\r
const baseOptions = { x: 160, y: height - 40 }\r
onMounted(() => {\r
  state.zr = createCanvas(mainElementRef.value, {\r
    width,\r
    height\r
  })\r
  state.group = createGroup(baseOptions)\r
  axios.get('https://xf-1252186245.cos.ap-chengdu.myqcloud.com/room1.json').then(res => {\r
    const data = res.data.data\r
    const shapeData = data.map((item: any) => {\r
      if (item['名称'] === '直线') {\r
        const x1 = Number(item['起点X']) / rate\r
        const y1 = -Number(item['起点Y']) / rate\r
        const x2 = Number(item['端点X']) / rate\r
        const y2 = -Number(item['端点Y']) / rate\r
        const layout = item['图层']\r
        const color: Record<string, string> = {\r
          标注: 'red',\r
          '0': 'yellow',\r
          墙线: '#fff',\r
          轴线: 'green',\r
          楼梯: '#ccc',\r
          门窗: '#eee'\r
        }\r
        const stroke = color[layout] || '#fff'\r
        return getLine(x1, y1, x2, y2, stroke)\r
      }\r
      if (item['名称'] === '圆弧') {\r
        const cx = Number(item['中心X']) / rate\r
        const cy = -Number(item['中心Y']) / rate\r
        const r = Number(item['半径']) / rate\r
        const startAngle = Number(item['起点角度'])\r
        const endAngle = startAngle + Number(item['总角度'])\r
        return getCircle(cx, cy, r, startAngle, endAngle)\r
      }\r
      if (item['名称'] === '多行文字') {\r
        const x = Number(item['位置X']) / rate\r
        const y = -Number(item['位置Y']) / rate\r
        const text = item['内容']\r
        return getText(x, y, text)\r
      }\r
      return {\r
        type: 'group',\r
        data: []\r
      }\r
    }) as ShapeCoreType[]\r
\r
    renderCanvas(state.zr as ZRenderType, state.group as ZRenderGroup, shapeData, {\r
      translate: true,\r
      scale: true\r
    })\r
    state.loading = false\r
  })\r
})\r
\r
onBeforeUnmount(() => {\r
  state.zr && state.zr.dispose()\r
})\r
<\/script>\r
\r
<style scoped>\r
.container {\r
  padding: 40px;\r
  background: #000;\r
  box-sizing: border-box;\r
  overflow: hidden;\r
}\r
</style>\r
`,Zh=`<template>\r
  <div id="sharePost" class="canvas-wrapper"></div>\r
</template>\r
\r
<script setup lang="ts">\r
import FileSaver from 'file-saver'\r
import { onMounted, reactive } from 'vue'\r
import { createCanvas, createGroup, renderCanvas, canvasToImage } from 'auto-drawing'\r
import type { ZRenderType, ZRenderGroup, ShapeCoreType } from 'auto-drawing'\r
\r
interface IState {\r
  zr: ZRenderType | null\r
  gp: ZRenderGroup | null\r
}\r
\r
const state: IState = reactive({\r
  zr: null,\r
  gp: null\r
})\r
\r
onMounted(() => {\r
  const width = 375\r
  const height = 592\r
  state.zr = createCanvas('sharePost', {\r
    width,\r
    height\r
  })\r
  state.zr.setBackgroundColor('#ff6e0b')\r
  state.gp = createGroup()\r
  const data: ShapeCoreType[] = [\r
    {\r
      type: 'image',\r
      x: 0,\r
      y: 0,\r
      width: 375,\r
      height: 592,\r
      image: 'https://auto-drawing-doc-1252186245.cos.ap-beijing.myqcloud.com/post.png'\r
    },\r
    {\r
      type: 'image',\r
      x: 40,\r
      y: 20,\r
      width: 50,\r
      height: 50,\r
      image: 'https://auto-drawing-doc-1252186245.cos.ap-beijing.myqcloud.com/avatar.png',\r
      zlevel: 1\r
    },\r
    {\r
      type: 'text',\r
      x: 98,\r
      y: 24,\r
      text: '我的店铺',\r
      fontSize: 16,\r
      fill: '#fff'\r
    },\r
    {\r
      type: 'text',\r
      x: 98,\r
      y: 50,\r
      text: '邀请你共享优惠',\r
      fontSize: 12,\r
      fill: '#ffd3a2'\r
    },\r
    {\r
      type: 'text',\r
      x: 50,\r
      y: 400,\r
      text: '￥99.9',\r
      fontSize: 32,\r
      fill: '#f00'\r
    },\r
    {\r
      type: 'text',\r
      x: 150,\r
      y: 410,\r
      text: '￥1999.9',\r
      fontSize: 12,\r
      fill: '#999'\r
    },\r
    {\r
      type: 'line',\r
      x1: 158,\r
      y1: 414,\r
      x2: 200,\r
      y2: 414,\r
      stroke: '#999'\r
    },\r
    {\r
      type: 'text',\r
      x: 60,\r
      y: 440,\r
      text: '自营',\r
      fontSize: 12,\r
      backgroundColor: '#fa4f00',\r
      padding: 2,\r
      borderRadius: 5\r
    },\r
    {\r
      type: 'text',\r
      x: 96,\r
      y: 440,\r
      text: '30天最低价',\r
      fontSize: 12,\r
      fill: '#805609',\r
      backgroundColor: '#faf5d9',\r
      padding: 2\r
    },\r
    {\r
      type: 'text',\r
      x: 168,\r
      y: 440,\r
      text: '包邮',\r
      fontSize: 12,\r
      fill: '#805609',\r
      backgroundColor: '#faf5d9',\r
      padding: 2\r
    },\r
    {\r
      type: 'text',\r
      x: 200,\r
      y: 440,\r
      text: '满减优惠',\r
      fontSize: 12,\r
      fill: '#805609',\r
      backgroundColor: '#faf5d9',\r
      padding: 2\r
    },\r
    {\r
      type: 'text',\r
      x: 55,\r
      y: 480,\r
      text: '精美兔子毛绒',\r
      fontSize: 24,\r
      fill: '#000'\r
    },\r
    {\r
      type: 'text',\r
      x: 55,\r
      y: 510,\r
      text: '玩具，回家必备。',\r
      fontSize: 24,\r
      fill: '#000'\r
    },\r
    {\r
      type: 'image',\r
      x: 250,\r
      y: 472,\r
      width: 70,\r
      height: 70,\r
      image: 'https://auto-drawing-doc-1252186245.cos.ap-beijing.myqcloud.com/code.jpg'\r
    },\r
    {\r
      type: 'text',\r
      x: 320,\r
      y: 210,\r
      text: '兔 年 快 乐',\r
      fontSize: 20,\r
      fill: '#fa4f00',\r
      rotation: -90,\r
      originX: 320,\r
      originY: 210\r
    }\r
  ]\r
\r
  renderCanvas(state.zr, state.gp, data)\r
})\r
\r
// 下载\r
const download = async () => {\r
  try {\r
    const { blob, base64 } = await canvasToImage(state.zr as ZRenderType)\r
    console.log('blob:', blob)\r
    console.log('base64:', base64)\r
    FileSaver.saveAs(blob, 'post.png')\r
  } catch (error) {\r
    console.log(error)\r
    alert('下载失败')\r
  }\r
}\r
<\/script>\r
\r
<style>\r
.btn {\r
  margin: 10px;\r
  text-align: left;\r
}\r
</style>\r
`;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Vh=function(){function r(){this.firefox=!1,this.ie=!1,this.edge=!1,this.newEdge=!1,this.weChat=!1}return r}(),jh=function(){function r(){this.browser=new Vh,this.node=!1,this.wxa=!1,this.worker=!1,this.svgSupported=!1,this.touchEventsSupported=!1,this.pointerEventsSupported=!1,this.domSupported=!1,this.transformSupported=!1,this.transform3dSupported=!1,this.hasGlobalWindow=typeof window<"u"}return r}(),Rr=new jh;typeof wx=="object"&&typeof wx.getSystemInfoSync=="function"?(Rr.wxa=!0,Rr.touchEventsSupported=!0):typeof document>"u"&&typeof self<"u"?Rr.worker=!0:typeof navigator>"u"?(Rr.node=!0,Rr.svgSupported=!0):Jh(navigator.userAgent,Rr);function Jh(r,t){var e=t.browser,n=r.match(/Firefox\/([\d.]+)/),i=r.match(/MSIE\s([\d.]+)/)||r.match(/Trident\/.+?rv:(([\d.]+))/),a=r.match(/Edge?\/([\d.]+)/),o=/micromessenger/i.test(r);n&&(e.firefox=!0,e.version=n[1]),i&&(e.ie=!0,e.version=i[1]),a&&(e.edge=!0,e.version=a[1],e.newEdge=+a[1].split(".")[0]>18),o&&(e.weChat=!0),t.svgSupported=typeof SVGRect<"u",t.touchEventsSupported="ontouchstart"in window&&!e.ie&&!e.edge,t.pointerEventsSupported="onpointerdown"in window&&(e.edge||e.ie&&+e.version>=11),t.domSupported=typeof document<"u";var s=document.documentElement.style;t.transform3dSupported=(e.ie&&"transition"in s||e.edge||"WebKitCSSMatrix"in window&&"m11"in new WebKitCSSMatrix||"MozPerspective"in s)&&!("OTransition"in s),t.transformSupported=t.transform3dSupported||e.ie&&+e.version>=9}var lt=Rr;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Ds=1;lt.hasGlobalWindow&&(Ds=Math.max(window.devicePixelRatio||window.screen&&window.screen.deviceXDPI/window.screen.logicalXDPI||1,1));var bn=Ds,Yi=.4,qi="#333",Zi="#ccc",Kh="#eee";/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Ns=Wn(["Function","RegExp","Date","Error","CanvasGradient","CanvasPattern","Image","Canvas"],function(r,t){return r["[object "+t+"]"]=!0,r},{}),Is=Wn(["Int8","Uint8","Uint8Clamped","Int16","Uint16","Int32","Uint32","Float32","Float64"],function(r,t){return r["[object "+t+"Array]"]=!0,r},{}),Bn=Object.prototype.toString,Fn=Array.prototype,Qh=Fn.forEach,tf=Fn.filter,Bs=Fn.slice,rf=Fn.map,Ya=(function(){}).constructor,Xe=Ya?Ya.prototype:null,ba="__proto__",ef=2311;function Fs(){return ef++}function rr(){for(var r=[],t=0;t<arguments.length;t++)r[t]=arguments[t];typeof console<"u"&&console.error.apply(console,r)}function Dr(r){if(r==null||typeof r!="object")return r;var t=r,e=Bn.call(r);if(e==="[object Array]"){if(!Te(r)){t=[];for(var n=0,i=r.length;n<i;n++)t[n]=Dr(r[n])}}else if(Is[e]){if(!Te(r)){var a=r.constructor;if(a.from)t=a.from(r);else{t=new a(r.length);for(var n=0,i=r.length;n<i;n++)t[n]=r[n]}}}else if(!Ns[e]&&!Te(r)&&!ji(r)){t={};for(var o in r)r.hasOwnProperty(o)&&o!==ba&&(t[o]=Dr(r[o]))}return t}function de(r,t,e){if(!tr(t)||!tr(r))return e?Dr(t):r;for(var n in t)if(t.hasOwnProperty(n)&&n!==ba){var i=r[n],a=t[n];tr(a)&&tr(i)&&!Re(a)&&!Re(i)&&!ji(a)&&!ji(i)&&!qa(a)&&!qa(i)&&!Te(a)&&!Te(i)?de(i,a,e):(e||!(n in r))&&(r[n]=Dr(t[n]))}return r}function G(r,t){if(Object.assign)Object.assign(r,t);else for(var e in t)t.hasOwnProperty(e)&&e!==ba&&(r[e]=t[e]);return r}function Nr(r,t,e){for(var n=q(t),i=0;i<n.length;i++){var a=n[i];(e?t[a]!=null:r[a]==null)&&(r[a]=t[a])}return r}function Ut(r,t){if(r){if(r.indexOf)return r.indexOf(t);for(var e=0,n=r.length;e<n;e++)if(r[e]===t)return e}return-1}function Ws(r,t,e){if(r="prototype"in r?r.prototype:r,t="prototype"in t?t.prototype:t,Object.getOwnPropertyNames)for(var n=Object.getOwnPropertyNames(t),i=0;i<n.length;i++){var a=n[i];a!=="constructor"&&(e?t[a]!=null:r[a]==null)&&(r[a]=t[a])}else Nr(r,t,e)}function Yt(r){return!r||typeof r=="string"?!1:typeof r.length=="number"}function _t(r,t,e){if(r&&t)if(r.forEach&&r.forEach===Qh)r.forEach(t,e);else if(r.length===+r.length)for(var n=0,i=r.length;n<i;n++)t.call(e,r[n],n,r);else for(var a in r)r.hasOwnProperty(a)&&t.call(e,r[a],a,r)}function dt(r,t,e){if(!r)return[];if(!t)return Hs(r);if(r.map&&r.map===rf)return r.map(t,e);for(var n=[],i=0,a=r.length;i<a;i++)n.push(t.call(e,r[i],i,r));return n}function Wn(r,t,e,n){if(r&&t){for(var i=0,a=r.length;i<a;i++)e=t.call(n,e,r[i],i,r);return e}}function Vi(r,t,e){if(!r)return[];if(!t)return Hs(r);if(r.filter&&r.filter===tf)return r.filter(t,e);for(var n=[],i=0,a=r.length;i<a;i++)t.call(e,r[i],i,r)&&n.push(r[i]);return n}function q(r){if(!r)return[];if(Object.keys)return Object.keys(r);var t=[];for(var e in r)r.hasOwnProperty(e)&&t.push(e);return t}function nf(r,t){for(var e=[],n=2;n<arguments.length;n++)e[n-2]=arguments[n];return function(){return r.apply(t,e.concat(Bs.call(arguments)))}}Xe&&Be(Xe.bind)&&Xe.call.bind(Xe.bind);function Re(r){return Array.isArray?Array.isArray(r):Bn.call(r)==="[object Array]"}function Be(r){return typeof r=="function"}function fr(r){return typeof r=="string"}function be(r){return typeof r=="number"}function tr(r){var t=typeof r;return t==="function"||!!r&&t==="object"}function qa(r){return!!Ns[Bn.call(r)]}function af(r){return!!Is[Bn.call(r)]}function ji(r){return typeof r=="object"&&typeof r.nodeType=="number"&&typeof r.ownerDocument=="object"}function Ta(r){return r.colorStops!=null}function of(r){return r.image!=null}function sf(r){return r!==r}function j(r,t){return r??t}function cn(r,t,e){return r??t??e}function Hs(r){for(var t=[],e=1;e<arguments.length;e++)t[e-1]=arguments[e];return Bs.apply(r,t)}function lf(r){if(typeof r=="number")return[r,r,r,r];var t=r.length;return t===2?[r[0],r[1],r[0],r[1]]:t===3?[r[0],r[1],r[2],r[1]]:r}function Za(r,t){if(!r)throw new Error(t)}function ve(r){return r==null?null:typeof r.trim=="function"?r.trim():r.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")}var hf="__ec_primitive__";function Te(r){return r[hf]}function Hn(r,t){var e;if(Object.create)e=Object.create(r);else{var n=function(){};n.prototype=r,e=new n}return t&&G(e,t),e}function Gs(r){var t=r.style;t.webkitUserSelect="none",t.userSelect="none",t.webkitTapHighlightColor="rgba(0,0,0,0)",t["-webkit-touch-callout"]="none"}function Mr(){}var pn=180/Math.PI;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 *//*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */var Ji=function(r,t){return Ji=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])},Ji(r,t)};function U(r,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");Ji(r,t);function e(){this.constructor=r}r.prototype=t===null?Object.create(t):(e.prototype=t.prototype,new e)}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var ff=function(){function r(t){t&&(this._$eventProcessor=t)}return r.prototype.on=function(t,e,n,i){this._$handlers||(this._$handlers={});var a=this._$handlers;if(typeof e=="function"&&(i=n,n=e,e=null),!n||!t)return this;var o=this._$eventProcessor;e!=null&&o&&o.normalizeQuery&&(e=o.normalizeQuery(e)),a[t]||(a[t]=[]);for(var s=0;s<a[t].length;s++)if(a[t][s].h===n)return this;var l={h:n,query:e,ctx:i||this,callAtLast:n.zrEventfulCallAtLast},h=a[t].length-1,f=a[t][h];return f&&f.callAtLast?a[t].splice(h,0,l):a[t].push(l),this},r.prototype.isSilent=function(t){var e=this._$handlers;return!e||!e[t]||!e[t].length},r.prototype.off=function(t,e){var n=this._$handlers;if(!n)return this;if(!t)return this._$handlers={},this;if(e){if(n[t]){for(var i=[],a=0,o=n[t].length;a<o;a++)n[t][a].h!==e&&i.push(n[t][a]);n[t]=i}n[t]&&n[t].length===0&&delete n[t]}else delete n[t];return this},r.prototype.trigger=function(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];if(!this._$handlers)return this;var i=this._$handlers[t],a=this._$eventProcessor;if(i)for(var o=e.length,s=i.length,l=0;l<s;l++){var h=i[l];if(!(a&&a.filter&&h.query!=null&&!a.filter(t,h.query)))switch(o){case 0:h.h.call(h.ctx);break;case 1:h.h.call(h.ctx,e[0]);break;case 2:h.h.call(h.ctx,e[0],e[1]);break;default:h.h.apply(h.ctx,e);break}}return a&&a.afterTrigger&&a.afterTrigger(t),this},r.prototype.triggerWithContext=function(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];if(!this._$handlers)return this;var i=this._$handlers[t],a=this._$eventProcessor;if(i)for(var o=e.length,s=e[o-1],l=i.length,h=0;h<l;h++){var f=i[h];if(!(a&&a.filter&&f.query!=null&&!a.filter(t,f.query)))switch(o){case 0:f.h.call(s);break;case 1:f.h.call(s,e[0]);break;case 2:f.h.call(s,e[0],e[1]);break;default:f.h.apply(s,e.slice(1,o-1));break}}return a&&a.afterTrigger&&a.afterTrigger(t),this},r}(),ee=ff;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function Er(r){return isFinite(r)}function uf(r,t,e){var n=t.x==null?0:t.x,i=t.x2==null?1:t.x2,a=t.y==null?0:t.y,o=t.y2==null?0:t.y2;t.global||(n=n*e.width+e.x,i=i*e.width+e.x,a=a*e.height+e.y,o=o*e.height+e.y),n=Er(n)?n:0,i=Er(i)?i:1,a=Er(a)?a:0,o=Er(o)?o:0;var s=r.createLinearGradient(n,a,i,o);return s}function cf(r,t,e){var n=e.width,i=e.height,a=Math.min(n,i),o=t.x==null?.5:t.x,s=t.y==null?.5:t.y,l=t.r==null?.5:t.r;t.global||(o=o*n+e.x,s=s*i+e.y,l=l*a),o=Er(o)?o:.5,s=Er(s)?s:.5,l=l>=0&&Er(l)?l:.5;var h=r.createRadialGradient(o,s,0,o,s,l);return h}function Ki(r,t,e){for(var n=t.type==="radial"?cf(r,t,e):uf(r,t,e),i=t.colorStops,a=0;a<i.length;a++)n.addColorStop(i[a].offset,i[a].color);return n}function pf(r,t){if(r===t||!r&&!t)return!1;if(!r||!t||r.length!==t.length)return!0;for(var e=0;e<r.length;e++)if(r[e]!==t[e])return!0;return!1}function Ye(r){return parseInt(r,10)}function Yr(r,t,e){var n=["width","height"][t],i=["clientWidth","clientHeight"][t],a=["paddingLeft","paddingTop"][t],o=["paddingRight","paddingBottom"][t];if(e[n]!=null&&e[n]!=="auto")return parseFloat(e[n]);var s=document.defaultView.getComputedStyle(r);return(r[i]||Ye(s[n])||Ye(r.style[n]))-(Ye(s[a])||0)-(Ye(s[o])||0)|0}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function Tn(){return[1,0,0,1,0,0]}function df(r){return r[0]=1,r[1]=0,r[2]=0,r[3]=1,r[4]=0,r[5]=0,r}function vf(r,t){return r[0]=t[0],r[1]=t[1],r[2]=t[2],r[3]=t[3],r[4]=t[4],r[5]=t[5],r}function ei(r,t,e){var n=t[0]*e[0]+t[2]*e[1],i=t[1]*e[0]+t[3]*e[1],a=t[0]*e[2]+t[2]*e[3],o=t[1]*e[2]+t[3]*e[3],s=t[0]*e[4]+t[2]*e[5]+t[4],l=t[1]*e[4]+t[3]*e[5]+t[5];return r[0]=n,r[1]=i,r[2]=a,r[3]=o,r[4]=s,r[5]=l,r}function Va(r,t,e){return r[0]=t[0],r[1]=t[1],r[2]=t[2],r[3]=t[3],r[4]=t[4]+e[0],r[5]=t[5]+e[1],r}function gf(r,t,e){var n=t[0],i=t[2],a=t[4],o=t[1],s=t[3],l=t[5],h=Math.sin(e),f=Math.cos(e);return r[0]=n*f+o*h,r[1]=-n*h+o*f,r[2]=i*f+s*h,r[3]=-i*h+f*s,r[4]=f*a+h*l,r[5]=f*l-h*a,r}function yf(r,t,e){var n=e[0],i=e[1];return r[0]=t[0]*n,r[1]=t[1]*i,r[2]=t[2]*n,r[3]=t[3]*i,r[4]=t[4]*n,r[5]=t[5]*i,r}function mf(r,t){var e=t[0],n=t[2],i=t[4],a=t[1],o=t[3],s=t[5],l=e*o-a*n;return l?(l=1/l,r[0]=o*l,r[1]=-a*l,r[2]=-n*l,r[3]=e*l,r[4]=(n*s-o*i)*l,r[5]=(a*i-e*s)*l,r):null}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function ne(r,t){return r==null&&(r=0),t==null&&(t=0),[r,t]}function _f(r){return[r[0],r[1]]}function ja(r,t,e){return r[0]=t[0]+e[0],r[1]=t[1]+e[1],r}function wf(r,t,e){return r[0]=t[0]-e[0],r[1]=t[1]-e[1],r}function xf(r){return Math.sqrt(bf(r))}function bf(r){return r[0]*r[0]+r[1]*r[1]}function ni(r,t,e){return r[0]=t[0]*e,r[1]=t[1]*e,r}function Tf(r,t){var e=xf(t);return e===0?(r[0]=0,r[1]=0):(r[0]=t[0]/e,r[1]=t[1]/e),r}function Qi(r,t){return Math.sqrt((r[0]-t[0])*(r[0]-t[0])+(r[1]-t[1])*(r[1]-t[1]))}var Sf=Qi;function zf(r,t){return(r[0]-t[0])*(r[0]-t[0])+(r[1]-t[1])*(r[1]-t[1])}var Kr=zf;function Ja(r,t,e){var n=t[0],i=t[1];return r[0]=e[0]*n+e[2]*i+e[4],r[1]=e[1]*n+e[3]*i+e[5],r}function qr(r,t,e){return r[0]=Math.min(t[0],e[0]),r[1]=Math.min(t[1],e[1]),r}function Zr(r,t,e){return r[0]=Math.max(t[0],e[0]),r[1]=Math.max(t[1],e[1]),r}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Ka=df,Qa=5e-5;function cr(r){return r>Qa||r<-Qa}var pr=[],Ir=[],ii=Tn(),ai=Math.abs,kf=function(){function r(){}return r.prototype.getLocalTransform=function(t){return r.getLocalTransform(this,t)},r.prototype.setPosition=function(t){this.x=t[0],this.y=t[1]},r.prototype.setScale=function(t){this.scaleX=t[0],this.scaleY=t[1]},r.prototype.setSkew=function(t){this.skewX=t[0],this.skewY=t[1]},r.prototype.setOrigin=function(t){this.originX=t[0],this.originY=t[1]},r.prototype.needLocalTransform=function(){return cr(this.rotation)||cr(this.x)||cr(this.y)||cr(this.scaleX-1)||cr(this.scaleY-1)||cr(this.skewX)||cr(this.skewY)},r.prototype.updateTransform=function(){var t=this.parent&&this.parent.transform,e=this.needLocalTransform(),n=this.transform;if(!(e||t)){n&&(Ka(n),this.invTransform=null);return}n=n||Tn(),e?this.getLocalTransform(n):Ka(n),t&&(e?ei(n,t,n):vf(n,t)),this.transform=n,this._resolveGlobalScaleRatio(n)},r.prototype._resolveGlobalScaleRatio=function(t){var e=this.globalScaleRatio;if(e!=null&&e!==1){this.getGlobalScale(pr);var n=pr[0]<0?-1:1,i=pr[1]<0?-1:1,a=((pr[0]-n)*e+n)/pr[0]||0,o=((pr[1]-i)*e+i)/pr[1]||0;t[0]*=a,t[1]*=a,t[2]*=o,t[3]*=o}this.invTransform=this.invTransform||Tn(),mf(this.invTransform,t)},r.prototype.getComputedTransform=function(){for(var t=this,e=[];t;)e.push(t),t=t.parent;for(;t=e.pop();)t.updateTransform();return this.transform},r.prototype.setLocalTransform=function(t){if(t){var e=t[0]*t[0]+t[1]*t[1],n=t[2]*t[2]+t[3]*t[3],i=Math.atan2(t[1],t[0]),a=Math.PI/2+i-Math.atan2(t[3],t[2]);n=Math.sqrt(n)*Math.cos(a),e=Math.sqrt(e),this.skewX=a,this.skewY=0,this.rotation=-i,this.x=+t[4],this.y=+t[5],this.scaleX=e,this.scaleY=n,this.originX=0,this.originY=0}},r.prototype.decomposeTransform=function(){if(this.transform){var t=this.parent,e=this.transform;t&&t.transform&&(ei(Ir,t.invTransform,e),e=Ir);var n=this.originX,i=this.originY;(n||i)&&(ii[4]=n,ii[5]=i,ei(Ir,e,ii),Ir[4]-=n,Ir[5]-=i,e=Ir),this.setLocalTransform(e)}},r.prototype.getGlobalScale=function(t){var e=this.transform;return t=t||[],e?(t[0]=Math.sqrt(e[0]*e[0]+e[1]*e[1]),t[1]=Math.sqrt(e[2]*e[2]+e[3]*e[3]),e[0]<0&&(t[0]=-t[0]),e[3]<0&&(t[1]=-t[1]),t):(t[0]=1,t[1]=1,t)},r.prototype.transformCoordToLocal=function(t,e){var n=[t,e],i=this.invTransform;return i&&Ja(n,n,i),n},r.prototype.transformCoordToGlobal=function(t,e){var n=[t,e],i=this.transform;return i&&Ja(n,n,i),n},r.prototype.getLineScale=function(){var t=this.transform;return t&&ai(t[0]-1)>1e-10&&ai(t[3]-1)>1e-10?Math.sqrt(ai(t[0]*t[3]-t[2]*t[1])):1},r.prototype.copyTransform=function(t){Us(this,t)},r.getLocalTransform=function(t,e){e=e||[];var n=t.originX||0,i=t.originY||0,a=t.scaleX,o=t.scaleY,s=t.anchorX,l=t.anchorY,h=t.rotation||0,f=t.x,u=t.y,c=t.skewX?Math.tan(t.skewX):0,p=t.skewY?Math.tan(-t.skewY):0;if(n||i||s||l){var d=n+s,g=i+l;e[4]=-d*a-c*g*o,e[5]=-g*o-p*d*a}else e[4]=e[5]=0;return e[0]=a,e[3]=o,e[1]=p*a,e[2]=c*o,h&&gf(e,e,h),e[4]+=n+f,e[5]+=i+u,e},r.initDefaultProps=function(){var t=r.prototype;t.scaleX=t.scaleY=t.globalScaleRatio=1,t.x=t.y=t.originX=t.originY=t.skewX=t.skewY=t.rotation=t.anchorX=t.anchorY=0}(),r}(),Pe=["x","y","originX","originY","anchorX","anchorY","rotation","scaleX","scaleY","skewX","skewY"];function Us(r,t){for(var e=0;e<Pe.length;e++){var n=Pe[e];r[n]=t[n]}}var $s=kf;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var dn={linear:function(r){return r},quadraticIn:function(r){return r*r},quadraticOut:function(r){return r*(2-r)},quadraticInOut:function(r){return(r*=2)<1?.5*r*r:-.5*(--r*(r-2)-1)},cubicIn:function(r){return r*r*r},cubicOut:function(r){return--r*r*r+1},cubicInOut:function(r){return(r*=2)<1?.5*r*r*r:.5*((r-=2)*r*r+2)},quarticIn:function(r){return r*r*r*r},quarticOut:function(r){return 1- --r*r*r*r},quarticInOut:function(r){return(r*=2)<1?.5*r*r*r*r:-.5*((r-=2)*r*r*r-2)},quinticIn:function(r){return r*r*r*r*r},quinticOut:function(r){return--r*r*r*r*r+1},quinticInOut:function(r){return(r*=2)<1?.5*r*r*r*r*r:.5*((r-=2)*r*r*r*r+2)},sinusoidalIn:function(r){return 1-Math.cos(r*Math.PI/2)},sinusoidalOut:function(r){return Math.sin(r*Math.PI/2)},sinusoidalInOut:function(r){return .5*(1-Math.cos(Math.PI*r))},exponentialIn:function(r){return r===0?0:Math.pow(1024,r-1)},exponentialOut:function(r){return r===1?1:1-Math.pow(2,-10*r)},exponentialInOut:function(r){return r===0?0:r===1?1:(r*=2)<1?.5*Math.pow(1024,r-1):.5*(-Math.pow(2,-10*(r-1))+2)},circularIn:function(r){return 1-Math.sqrt(1-r*r)},circularOut:function(r){return Math.sqrt(1- --r*r)},circularInOut:function(r){return(r*=2)<1?-.5*(Math.sqrt(1-r*r)-1):.5*(Math.sqrt(1-(r-=2)*r)+1)},elasticIn:function(r){var t,e=.1,n=.4;return r===0?0:r===1?1:(!e||e<1?(e=1,t=n/4):t=n*Math.asin(1/e)/(2*Math.PI),-(e*Math.pow(2,10*(r-=1))*Math.sin((r-t)*(2*Math.PI)/n)))},elasticOut:function(r){var t,e=.1,n=.4;return r===0?0:r===1?1:(!e||e<1?(e=1,t=n/4):t=n*Math.asin(1/e)/(2*Math.PI),e*Math.pow(2,-10*r)*Math.sin((r-t)*(2*Math.PI)/n)+1)},elasticInOut:function(r){var t,e=.1,n=.4;return r===0?0:r===1?1:(!e||e<1?(e=1,t=n/4):t=n*Math.asin(1/e)/(2*Math.PI),(r*=2)<1?-.5*(e*Math.pow(2,10*(r-=1))*Math.sin((r-t)*(2*Math.PI)/n)):e*Math.pow(2,-10*(r-=1))*Math.sin((r-t)*(2*Math.PI)/n)*.5+1)},backIn:function(r){var t=1.70158;return r*r*((t+1)*r-t)},backOut:function(r){var t=1.70158;return--r*r*((t+1)*r+t)+1},backInOut:function(r){var t=2.5949095;return(r*=2)<1?.5*(r*r*((t+1)*r-t)):.5*((r-=2)*r*((t+1)*r+t)+2)},bounceIn:function(r){return 1-dn.bounceOut(1-r)},bounceOut:function(r){return r<1/2.75?7.5625*r*r:r<2/2.75?7.5625*(r-=1.5/2.75)*r+.75:r<2.5/2.75?7.5625*(r-=2.25/2.75)*r+.9375:7.5625*(r-=2.625/2.75)*r+.984375},bounceInOut:function(r){return r<.5?dn.bounceIn(r*2)*.5:dn.bounceOut(r*2-1)*.5+.5}},Xs=dn;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var qe=Math.pow,hr=Math.sqrt,Sn=1e-8,Ys=1e-4,to=hr(3),Ze=1/3,$t=ne(),St=ne(),Qr=ne();function sr(r){return r>-Sn&&r<Sn}function qs(r){return r>Sn||r<-Sn}function et(r,t,e,n,i){var a=1-i;return a*a*(a*r+3*i*t)+i*i*(i*n+3*a*e)}function ro(r,t,e,n,i){var a=1-i;return 3*(((t-r)*a+2*(e-t)*i)*a+(n-e)*i*i)}function Zs(r,t,e,n,i,a){var o=n+3*(t-e)-r,s=3*(e-t*2+r),l=3*(t-r),h=r-i,f=s*s-3*o*l,u=s*l-9*o*h,c=l*l-3*s*h,p=0;if(sr(f)&&sr(u))if(sr(s))a[0]=0;else{var d=-l/s;d>=0&&d<=1&&(a[p++]=d)}else{var g=u*u-4*f*c;if(sr(g)){var y=u/f,d=-s/o+y,v=-y/2;d>=0&&d<=1&&(a[p++]=d),v>=0&&v<=1&&(a[p++]=v)}else if(g>0){var m=hr(g),_=f*s+1.5*o*(-u+m),w=f*s+1.5*o*(-u-m);_<0?_=-qe(-_,Ze):_=qe(_,Ze),w<0?w=-qe(-w,Ze):w=qe(w,Ze);var d=(-s-(_+w))/(3*o);d>=0&&d<=1&&(a[p++]=d)}else{var S=(2*f*s-3*o*u)/(2*hr(f*f*f)),x=Math.acos(S)/3,T=hr(f),z=Math.cos(x),d=(-s-2*T*z)/(3*o),v=(-s+T*(z+to*Math.sin(x)))/(3*o),C=(-s+T*(z-to*Math.sin(x)))/(3*o);d>=0&&d<=1&&(a[p++]=d),v>=0&&v<=1&&(a[p++]=v),C>=0&&C<=1&&(a[p++]=C)}}return p}function Vs(r,t,e,n,i){var a=6*e-12*t+6*r,o=9*t+3*n-3*r-9*e,s=3*t-3*r,l=0;if(sr(o)){if(qs(a)){var h=-s/a;h>=0&&h<=1&&(i[l++]=h)}}else{var f=a*a-4*o*s;if(sr(f))i[0]=-a/(2*o);else if(f>0){var u=hr(f),h=(-a+u)/(2*o),c=(-a-u)/(2*o);h>=0&&h<=1&&(i[l++]=h),c>=0&&c<=1&&(i[l++]=c)}}return l}function zn(r,t,e,n,i,a){var o=(t-r)*i+r,s=(e-t)*i+t,l=(n-e)*i+e,h=(s-o)*i+o,f=(l-s)*i+s,u=(f-h)*i+h;a[0]=r,a[1]=o,a[2]=h,a[3]=u,a[4]=u,a[5]=f,a[6]=l,a[7]=n}function Cf(r,t,e,n,i,a,o,s,l,h,f){var u,c=.005,p=1/0,d,g,y,v;$t[0]=l,$t[1]=h;for(var m=0;m<1;m+=.05)St[0]=et(r,e,i,o,m),St[1]=et(t,n,a,s,m),y=Kr($t,St),y<p&&(u=m,p=y);p=1/0;for(var _=0;_<32&&!(c<Ys);_++)d=u-c,g=u+c,St[0]=et(r,e,i,o,d),St[1]=et(t,n,a,s,d),y=Kr(St,$t),d>=0&&y<p?(u=d,p=y):(Qr[0]=et(r,e,i,o,g),Qr[1]=et(t,n,a,s,g),v=Kr(Qr,$t),g<=1&&v<p?(u=g,p=v):c*=.5);return f&&(f[0]=et(r,e,i,o,u),f[1]=et(t,n,a,s,u)),hr(p)}function Rf(r,t,e,n,i,a,o,s,l){for(var h=r,f=t,u=0,c=1/l,p=1;p<=l;p++){var d=p*c,g=et(r,e,i,o,d),y=et(t,n,a,s,d),v=g-h,m=y-f;u+=Math.sqrt(v*v+m*m),h=g,f=y}return u}function st(r,t,e,n){var i=1-n;return i*(i*r+2*n*t)+n*n*e}function eo(r,t,e,n){return 2*((1-n)*(t-r)+n*(e-t))}function Pf(r,t,e,n,i){var a=r-2*t+e,o=2*(t-r),s=r-n,l=0;if(sr(a)){if(qs(o)){var h=-s/o;h>=0&&h<=1&&(i[l++]=h)}}else{var f=o*o-4*a*s;if(sr(f)){var h=-o/(2*a);h>=0&&h<=1&&(i[l++]=h)}else if(f>0){var u=hr(f),h=(-o+u)/(2*a),c=(-o-u)/(2*a);h>=0&&h<=1&&(i[l++]=h),c>=0&&c<=1&&(i[l++]=c)}}return l}function js(r,t,e){var n=r+e-2*t;return n===0?.5:(r-t)/n}function kn(r,t,e,n,i){var a=(t-r)*n+r,o=(e-t)*n+t,s=(o-a)*n+a;i[0]=r,i[1]=a,i[2]=s,i[3]=s,i[4]=o,i[5]=e}function Lf(r,t,e,n,i,a,o,s,l){var h,f=.005,u=1/0;$t[0]=o,$t[1]=s;for(var c=0;c<1;c+=.05){St[0]=st(r,e,i,c),St[1]=st(t,n,a,c);var p=Kr($t,St);p<u&&(h=c,u=p)}u=1/0;for(var d=0;d<32&&!(f<Ys);d++){var g=h-f,y=h+f;St[0]=st(r,e,i,g),St[1]=st(t,n,a,g);var p=Kr(St,$t);if(g>=0&&p<u)h=g,u=p;else{Qr[0]=st(r,e,i,y),Qr[1]=st(t,n,a,y);var v=Kr(Qr,$t);y<=1&&v<u?(h=y,u=v):f*=.5}}return l&&(l[0]=st(r,e,i,h),l[1]=st(t,n,a,h)),hr(u)}function Ef(r,t,e,n,i,a,o){for(var s=r,l=t,h=0,f=1/o,u=1;u<=o;u++){var c=u*f,p=st(r,e,i,c),d=st(t,n,a,c),g=p-s,y=d-l;h+=Math.sqrt(g*g+y*y),s=p,l=d}return h}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Af=/cubic-bezier\(([0-9,\.e ]+)\)/;function Sa(r){var t=r&&Af.exec(r);if(t){var e=t[1].split(","),n=+ve(e[0]),i=+ve(e[1]),a=+ve(e[2]),o=+ve(e[3]);if(isNaN(n+i+a+o))return;var s=[];return function(l){return l<=0?0:l>=1?1:Zs(0,n,a,1,l,s)&&et(0,i,o,1,s[0])}}}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Mf=function(){function r(t){this._inited=!1,this._startTime=0,this._pausedTime=0,this._paused=!1,this._life=t.life||1e3,this._delay=t.delay||0,this.loop=t.loop||!1,this.onframe=t.onframe||Mr,this.ondestroy=t.ondestroy||Mr,this.onrestart=t.onrestart||Mr,t.easing&&this.setEasing(t.easing)}return r.prototype.step=function(t,e){if(this._inited||(this._startTime=t+this._delay,this._inited=!0),this._paused){this._pausedTime+=e;return}var n=this._life,i=t-this._startTime-this._pausedTime,a=i/n;a<0&&(a=0),a=Math.min(a,1);var o=this.easingFunc,s=o?o(a):a;if(this.onframe(s),a===1)if(this.loop){var l=i%n;this._startTime=t-l,this._pausedTime=0,this.onrestart()}else return!0;return!1},r.prototype.pause=function(){this._paused=!0},r.prototype.resume=function(){this._paused=!1},r.prototype.setEasing=function(t){this.easing=t,this.easingFunc=Be(t)?t:Xs[t]||Sa(t)},r}(),Of=Mf;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Js=function(){function r(t){this.value=t}return r}(),Df=function(){function r(){this._len=0}return r.prototype.insert=function(t){var e=new Js(t);return this.insertEntry(e),e},r.prototype.insertEntry=function(t){this.head?(this.tail.next=t,t.prev=this.tail,t.next=null,this.tail=t):this.head=this.tail=t,this._len++},r.prototype.remove=function(t){var e=t.prev,n=t.next;e?e.next=n:this.head=n,n?n.prev=e:this.tail=e,t.next=t.prev=null,this._len--},r.prototype.len=function(){return this._len},r.prototype.clear=function(){this.head=this.tail=null,this._len=0},r}(),Nf=function(){function r(t){this._list=new Df,this._maxSize=10,this._map={},this._maxSize=t}return r.prototype.put=function(t,e){var n=this._list,i=this._map,a=null;if(i[t]==null){var o=n.len(),s=this._lastRemovedEntry;if(o>=this._maxSize&&o>0){var l=n.head;n.remove(l),delete i[l.key],a=l.value,this._lastRemovedEntry=l}s?s.value=e:s=new Js(e),s.key=t,n.insertEntry(s),i[t]=s}return a},r.prototype.get=function(t){var e=this._map[t],n=this._list;if(e!=null)return e!==n.tail&&(n.remove(e),n.insertEntry(e)),e.value},r.prototype.clear=function(){this._list.clear(),this._map={}},r.prototype.len=function(){return this._list.len()},r}(),za=Nf;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var no={transparent:[0,0,0,0],aliceblue:[240,248,255,1],antiquewhite:[250,235,215,1],aqua:[0,255,255,1],aquamarine:[127,255,212,1],azure:[240,255,255,1],beige:[245,245,220,1],bisque:[255,228,196,1],black:[0,0,0,1],blanchedalmond:[255,235,205,1],blue:[0,0,255,1],blueviolet:[138,43,226,1],brown:[165,42,42,1],burlywood:[222,184,135,1],cadetblue:[95,158,160,1],chartreuse:[127,255,0,1],chocolate:[210,105,30,1],coral:[255,127,80,1],cornflowerblue:[100,149,237,1],cornsilk:[255,248,220,1],crimson:[220,20,60,1],cyan:[0,255,255,1],darkblue:[0,0,139,1],darkcyan:[0,139,139,1],darkgoldenrod:[184,134,11,1],darkgray:[169,169,169,1],darkgreen:[0,100,0,1],darkgrey:[169,169,169,1],darkkhaki:[189,183,107,1],darkmagenta:[139,0,139,1],darkolivegreen:[85,107,47,1],darkorange:[255,140,0,1],darkorchid:[153,50,204,1],darkred:[139,0,0,1],darksalmon:[233,150,122,1],darkseagreen:[143,188,143,1],darkslateblue:[72,61,139,1],darkslategray:[47,79,79,1],darkslategrey:[47,79,79,1],darkturquoise:[0,206,209,1],darkviolet:[148,0,211,1],deeppink:[255,20,147,1],deepskyblue:[0,191,255,1],dimgray:[105,105,105,1],dimgrey:[105,105,105,1],dodgerblue:[30,144,255,1],firebrick:[178,34,34,1],floralwhite:[255,250,240,1],forestgreen:[34,139,34,1],fuchsia:[255,0,255,1],gainsboro:[220,220,220,1],ghostwhite:[248,248,255,1],gold:[255,215,0,1],goldenrod:[218,165,32,1],gray:[128,128,128,1],green:[0,128,0,1],greenyellow:[173,255,47,1],grey:[128,128,128,1],honeydew:[240,255,240,1],hotpink:[255,105,180,1],indianred:[205,92,92,1],indigo:[75,0,130,1],ivory:[255,255,240,1],khaki:[240,230,140,1],lavender:[230,230,250,1],lavenderblush:[255,240,245,1],lawngreen:[124,252,0,1],lemonchiffon:[255,250,205,1],lightblue:[173,216,230,1],lightcoral:[240,128,128,1],lightcyan:[224,255,255,1],lightgoldenrodyellow:[250,250,210,1],lightgray:[211,211,211,1],lightgreen:[144,238,144,1],lightgrey:[211,211,211,1],lightpink:[255,182,193,1],lightsalmon:[255,160,122,1],lightseagreen:[32,178,170,1],lightskyblue:[135,206,250,1],lightslategray:[119,136,153,1],lightslategrey:[119,136,153,1],lightsteelblue:[176,196,222,1],lightyellow:[255,255,224,1],lime:[0,255,0,1],limegreen:[50,205,50,1],linen:[250,240,230,1],magenta:[255,0,255,1],maroon:[128,0,0,1],mediumaquamarine:[102,205,170,1],mediumblue:[0,0,205,1],mediumorchid:[186,85,211,1],mediumpurple:[147,112,219,1],mediumseagreen:[60,179,113,1],mediumslateblue:[123,104,238,1],mediumspringgreen:[0,250,154,1],mediumturquoise:[72,209,204,1],mediumvioletred:[199,21,133,1],midnightblue:[25,25,112,1],mintcream:[245,255,250,1],mistyrose:[255,228,225,1],moccasin:[255,228,181,1],navajowhite:[255,222,173,1],navy:[0,0,128,1],oldlace:[253,245,230,1],olive:[128,128,0,1],olivedrab:[107,142,35,1],orange:[255,165,0,1],orangered:[255,69,0,1],orchid:[218,112,214,1],palegoldenrod:[238,232,170,1],palegreen:[152,251,152,1],paleturquoise:[175,238,238,1],palevioletred:[219,112,147,1],papayawhip:[255,239,213,1],peachpuff:[255,218,185,1],peru:[205,133,63,1],pink:[255,192,203,1],plum:[221,160,221,1],powderblue:[176,224,230,1],purple:[128,0,128,1],red:[255,0,0,1],rosybrown:[188,143,143,1],royalblue:[65,105,225,1],saddlebrown:[139,69,19,1],salmon:[250,128,114,1],sandybrown:[244,164,96,1],seagreen:[46,139,87,1],seashell:[255,245,238,1],sienna:[160,82,45,1],silver:[192,192,192,1],skyblue:[135,206,235,1],slateblue:[106,90,205,1],slategray:[112,128,144,1],slategrey:[112,128,144,1],snow:[255,250,250,1],springgreen:[0,255,127,1],steelblue:[70,130,180,1],tan:[210,180,140,1],teal:[0,128,128,1],thistle:[216,191,216,1],tomato:[255,99,71,1],turquoise:[64,224,208,1],violet:[238,130,238,1],wheat:[245,222,179,1],white:[255,255,255,1],whitesmoke:[245,245,245,1],yellow:[255,255,0,1],yellowgreen:[154,205,50,1]};function Se(r){return r=Math.round(r),r<0?0:r>255?255:r}function io(r){return r<0?0:r>1?1:r}function oi(r){var t=r;return t.length&&t.charAt(t.length-1)==="%"?Se(parseFloat(t)/100*255):Se(parseInt(t,10))}function ze(r){var t=r;return t.length&&t.charAt(t.length-1)==="%"?io(parseFloat(t)/100):io(parseFloat(t))}function si(r,t,e){return e<0?e+=1:e>1&&(e-=1),e*6<1?r+(t-r)*e*6:e*2<1?t:e*3<2?r+(t-r)*(2/3-e)*6:r}function bt(r,t,e,n,i){return r[0]=t,r[1]=e,r[2]=n,r[3]=i,r}function ta(r,t){return r[0]=t[0],r[1]=t[1],r[2]=t[2],r[3]=t[3],r}var Ks=new za(20),Ve=null;function Br(r,t){Ve&&ta(Ve,t),Ve=Ks.put(r,Ve||t.slice())}function te(r,t){if(r){t=t||[];var e=Ks.get(r);if(e)return ta(t,e);r=r+"";var n=r.replace(/ /g,"").toLowerCase();if(n in no)return ta(t,no[n]),Br(r,t),t;var i=n.length;if(n.charAt(0)==="#"){if(i===4||i===5){var a=parseInt(n.slice(1,4),16);if(!(a>=0&&a<=4095)){bt(t,0,0,0,1);return}return bt(t,(a&3840)>>4|(a&3840)>>8,a&240|(a&240)>>4,a&15|(a&15)<<4,i===5?parseInt(n.slice(4),16)/15:1),Br(r,t),t}else if(i===7||i===9){var a=parseInt(n.slice(1,7),16);if(!(a>=0&&a<=16777215)){bt(t,0,0,0,1);return}return bt(t,(a&16711680)>>16,(a&65280)>>8,a&255,i===9?parseInt(n.slice(7),16)/255:1),Br(r,t),t}return}var o=n.indexOf("("),s=n.indexOf(")");if(o!==-1&&s+1===i){var l=n.substr(0,o),h=n.substr(o+1,s-(o+1)).split(","),f=1;switch(l){case"rgba":if(h.length!==4)return h.length===3?bt(t,+h[0],+h[1],+h[2],1):bt(t,0,0,0,1);f=ze(h.pop());case"rgb":if(h.length>=3)return bt(t,oi(h[0]),oi(h[1]),oi(h[2]),h.length===3?f:ze(h[3])),Br(r,t),t;bt(t,0,0,0,1);return;case"hsla":if(h.length!==4){bt(t,0,0,0,1);return}return h[3]=ze(h[3]),ao(h,t),Br(r,t),t;case"hsl":if(h.length!==3){bt(t,0,0,0,1);return}return ao(h,t),Br(r,t),t;default:return}}bt(t,0,0,0,1)}}function ao(r,t){var e=(parseFloat(r[0])%360+360)%360/360,n=ze(r[1]),i=ze(r[2]),a=i<=.5?i*(n+1):i+n-i*n,o=i*2-a;return t=t||[],bt(t,Se(si(o,a,e+1/3)*255),Se(si(o,a,e)*255),Se(si(o,a,e-1/3)*255),1),r.length===4&&(t[3]=r[3]),t}function If(r,t){if(!(!r||!r.length)){var e=r[0]+","+r[1]+","+r[2];return(t==="rgba"||t==="hsva"||t==="hsla")&&(e+=","+r[3]),t+"("+e+")"}}function Cn(r,t){var e=te(r);return e?(.299*e[0]+.587*e[1]+.114*e[2])*e[3]/255+(1-e[3])*t:0}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Rn=Math.round;function Le(r){var t;if(!r||r==="transparent")r="none";else if(typeof r=="string"&&r.indexOf("rgba")>-1){var e=te(r);e&&(r="rgb("+e[0]+","+e[1]+","+e[2]+")",t=e[3])}return{color:r,opacity:t??1}}var oo=1e-4;function lr(r){return r<oo&&r>-oo}function je(r){return Rn(r*1e3)/1e3}function ra(r){return Rn(r*1e4)/1e4}function Bf(r){return"matrix("+je(r[0])+","+je(r[1])+","+je(r[2])+","+je(r[3])+","+ra(r[4])+","+ra(r[5])+")"}var Ff={left:"start",right:"end",center:"middle",middle:"middle"};function Wf(r,t,e){return e==="top"?r+=t/2:e==="bottom"&&(r-=t/2),r}function Hf(r){return r&&(r.shadowBlur||r.shadowOffsetX||r.shadowOffsetY)}function Gf(r){var t=r.style,e=r.getGlobalScale();return[t.shadowColor,(t.shadowBlur||0).toFixed(2),(t.shadowOffsetX||0).toFixed(2),(t.shadowOffsetY||0).toFixed(2),e[0],e[1]].join(",")}function Qs(r){return r&&!!r.image}function Uf(r){return r&&!!r.svgElement}function ka(r){return Qs(r)||Uf(r)}function tl(r){return r.type==="linear"}function rl(r){return r.type==="radial"}function el(r){return r&&(r.type==="linear"||r.type==="radial")}function Gn(r){return"url(#"+r+")"}function nl(r){var t=r.getGlobalScale(),e=Math.max(t[0],t[1]);return Math.max(Math.ceil(Math.log(e)/Math.log(10)),1)}function il(r){var t=r.x||0,e=r.y||0,n=(r.rotation||0)*pn,i=j(r.scaleX,1),a=j(r.scaleY,1),o=r.skewX||0,s=r.skewY||0,l=[];return(t||e)&&l.push("translate("+t+"px,"+e+"px)"),n&&l.push("rotate("+n+")"),(i!==1||a!==1)&&l.push("scale("+i+","+a+")"),(o||s)&&l.push("skew("+Rn(o*pn)+"deg, "+Rn(s*pn)+"deg)"),l.join(" ")}var $f=function(){return lt.hasGlobalWindow&&Be(window.btoa)?function(r){return window.btoa(unescape(encodeURIComponent(r)))}:typeof Buffer<"u"?function(r){return Buffer.from(r).toString("base64")}:function(r){return rr("Base64 isn't natively supported in the current environment."),null}}();/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var ea=Array.prototype.slice;function Qt(r,t,e){return(t-r)*e+r}function li(r,t,e,n){for(var i=t.length,a=0;a<i;a++)r[a]=Qt(t[a],e[a],n);return r}function Xf(r,t,e,n){for(var i=t.length,a=i&&t[0].length,o=0;o<i;o++){r[o]||(r[o]=[]);for(var s=0;s<a;s++)r[o][s]=Qt(t[o][s],e[o][s],n)}return r}function Je(r,t,e,n){for(var i=t.length,a=0;a<i;a++)r[a]=t[a]+e[a]*n;return r}function so(r,t,e,n){for(var i=t.length,a=i&&t[0].length,o=0;o<i;o++){r[o]||(r[o]=[]);for(var s=0;s<a;s++)r[o][s]=t[o][s]+e[o][s]*n}return r}function Yf(r,t){for(var e=r.length,n=t.length,i=e>n?t:r,a=Math.min(e,n),o=i[a-1]||{color:[0,0,0,0],offset:0},s=a;s<Math.max(e,n);s++)i.push({offset:o.offset,color:o.color.slice()})}function qf(r,t,e){var n=r,i=t;if(!(!n.push||!i.push)){var a=n.length,o=i.length;if(a!==o){var s=a>o;if(s)n.length=o;else for(var l=a;l<o;l++)n.push(e===1?i[l]:ea.call(i[l]))}for(var h=n[0]&&n[0].length,l=0;l<n.length;l++)if(e===1)isNaN(n[l])&&(n[l]=i[l]);else for(var f=0;f<h;f++)isNaN(n[l][f])&&(n[l][f]=i[l][f])}}function vn(r){if(Yt(r)){var t=r.length;if(Yt(r[0])){for(var e=[],n=0;n<t;n++)e.push(ea.call(r[n]));return e}return ea.call(r)}return r}function gn(r){return r[0]=Math.floor(r[0])||0,r[1]=Math.floor(r[1])||0,r[2]=Math.floor(r[2])||0,r[3]=r[3]==null?1:r[3],"rgba("+r.join(",")+")"}function Zf(r){return Yt(r&&r[0])?2:1}var Ke=0,yn=1,al=2,ge=3,na=4,ia=5,lo=6;function ho(r){return r===na||r===ia}function Qe(r){return r===yn||r===al}var ae=[0,0,0,0],Vf=function(){function r(t){this.keyframes=[],this.discrete=!1,this._invalid=!1,this._needsSort=!1,this._lastFr=0,this._lastFrP=0,this.propName=t}return r.prototype.isFinished=function(){return this._finished},r.prototype.setFinished=function(){this._finished=!0,this._additiveTrack&&this._additiveTrack.setFinished()},r.prototype.needsAnimate=function(){return this.keyframes.length>=1},r.prototype.getAdditiveTrack=function(){return this._additiveTrack},r.prototype.addKeyframe=function(t,e,n){this._needsSort=!0;var i=this.keyframes,a=i.length,o=!1,s=lo,l=e;if(Yt(e)){var h=Zf(e);s=h,(h===1&&!be(e[0])||h===2&&!be(e[0][0]))&&(o=!0)}else if(be(e)&&!sf(e))s=Ke;else if(fr(e))if(!isNaN(+e))s=Ke;else{var f=te(e);f&&(l=f,s=ge)}else if(Ta(e)){var u=G({},l);u.colorStops=dt(e.colorStops,function(p){return{offset:p.offset,color:te(p.color)}}),tl(e)?s=na:rl(e)&&(s=ia),l=u}a===0?this.valType=s:(s!==this.valType||s===lo)&&(o=!0),this.discrete=this.discrete||o;var c={time:t,value:l,rawValue:e,percent:0};return n&&(c.easing=n,c.easingFunc=Be(n)?n:Xs[n]||Sa(n)),i.push(c),c},r.prototype.prepare=function(t,e){var n=this.keyframes;this._needsSort&&n.sort(function(g,y){return g.time-y.time});for(var i=this.valType,a=n.length,o=n[a-1],s=this.discrete,l=Qe(i),h=ho(i),f=0;f<a;f++){var u=n[f],c=u.value,p=o.value;u.percent=u.time/t,s||(l&&f!==a-1?qf(c,p,i):h&&Yf(c.colorStops,p.colorStops))}if(!s&&i!==ia&&e&&this.needsAnimate()&&e.needsAnimate()&&i===e.valType&&!e._finished){this._additiveTrack=e;for(var d=n[0].value,f=0;f<a;f++)i===Ke?n[f].additiveValue=n[f].value-d:i===ge?n[f].additiveValue=Je([],n[f].value,d,-1):Qe(i)&&(n[f].additiveValue=i===yn?Je([],n[f].value,d,-1):so([],n[f].value,d,-1))}},r.prototype.step=function(t,e){if(!this._finished){this._additiveTrack&&this._additiveTrack._finished&&(this._additiveTrack=null);var n=this._additiveTrack!=null,i=n?"additiveValue":"value",a=this.valType,o=this.keyframes,s=o.length,l=this.propName,h=a===ge,f,u=this._lastFr,c=Math.min,p,d;if(s===1)p=d=o[0];else{if(e<0)f=0;else if(e<this._lastFrP){var g=c(u+1,s-1);for(f=g;f>=0&&!(o[f].percent<=e);f--);f=c(f,s-2)}else{for(f=u;f<s&&!(o[f].percent>e);f++);f=c(f-1,s-2)}d=o[f+1],p=o[f]}if(p&&d){this._lastFr=f,this._lastFrP=e;var y=d.percent-p.percent,v=y===0?1:c((e-p.percent)/y,1);d.easingFunc&&(v=d.easingFunc(v));var m=n?this._additiveValue:h?ae:t[l];if((Qe(a)||h)&&!m&&(m=this._additiveValue=[]),this.discrete)t[l]=v<1?p.rawValue:d.rawValue;else if(Qe(a))a===yn?li(m,p[i],d[i],v):Xf(m,p[i],d[i],v);else if(ho(a)){var _=p[i],w=d[i],S=a===na;t[l]={type:S?"linear":"radial",x:Qt(_.x,w.x,v),y:Qt(_.y,w.y,v),colorStops:dt(_.colorStops,function(T,z){var C=w.colorStops[z];return{offset:Qt(T.offset,C.offset,v),color:gn(li([],T.color,C.color,v))}}),global:w.global},S?(t[l].x2=Qt(_.x2,w.x2,v),t[l].y2=Qt(_.y2,w.y2,v)):t[l].r=Qt(_.r,w.r,v)}else if(h)li(m,p[i],d[i],v),n||(t[l]=gn(m));else{var x=Qt(p[i],d[i],v);n?this._additiveValue=x:t[l]=x}n&&this._addToTarget(t)}}},r.prototype._addToTarget=function(t){var e=this.valType,n=this.propName,i=this._additiveValue;e===Ke?t[n]=t[n]+i:e===ge?(te(t[n],ae),Je(ae,ae,i,1),t[n]=gn(ae)):e===yn?Je(t[n],t[n],i,1):e===al&&so(t[n],t[n],i,1)},r}(),jf=function(){function r(t,e,n,i){if(this._tracks={},this._trackKeys=[],this._maxTime=0,this._started=0,this._clip=null,this._target=t,this._loop=e,e&&i){rr("Can' use additive animation on looped animation.");return}this._additiveAnimators=i,this._allowDiscrete=n}return r.prototype.getMaxTime=function(){return this._maxTime},r.prototype.getDelay=function(){return this._delay},r.prototype.getLoop=function(){return this._loop},r.prototype.getTarget=function(){return this._target},r.prototype.changeTarget=function(t){this._target=t},r.prototype.when=function(t,e,n){return this.whenWithKeys(t,e,q(e),n)},r.prototype.whenWithKeys=function(t,e,n,i){for(var a=this._tracks,o=0;o<n.length;o++){var s=n[o],l=a[s];if(!l){l=a[s]=new Vf(s);var h=void 0,f=this._getAdditiveTrack(s);if(f){var u=f.keyframes,c=u[u.length-1];h=c&&c.value,f.valType===ge&&h&&(h=gn(h))}else h=this._target[s];if(h==null)continue;t>0&&l.addKeyframe(0,vn(h),i),this._trackKeys.push(s)}l.addKeyframe(t,vn(e[s]),i)}return this._maxTime=Math.max(this._maxTime,t),this},r.prototype.pause=function(){this._clip.pause(),this._paused=!0},r.prototype.resume=function(){this._clip.resume(),this._paused=!1},r.prototype.isPaused=function(){return!!this._paused},r.prototype.duration=function(t){return this._maxTime=t,this._force=!0,this},r.prototype._doneCallback=function(){this._setTracksFinished(),this._clip=null;var t=this._doneCbs;if(t)for(var e=t.length,n=0;n<e;n++)t[n].call(this)},r.prototype._abortedCallback=function(){this._setTracksFinished();var t=this.animation,e=this._abortedCbs;if(t&&t.removeClip(this._clip),this._clip=null,e)for(var n=0;n<e.length;n++)e[n].call(this)},r.prototype._setTracksFinished=function(){for(var t=this._tracks,e=this._trackKeys,n=0;n<e.length;n++)t[e[n]].setFinished()},r.prototype._getAdditiveTrack=function(t){var e,n=this._additiveAnimators;if(n)for(var i=0;i<n.length;i++){var a=n[i].getTrack(t);a&&(e=a)}return e},r.prototype.start=function(t){if(!(this._started>0)){this._started=1;for(var e=this,n=[],i=this._maxTime||0,a=0;a<this._trackKeys.length;a++){var o=this._trackKeys[a],s=this._tracks[o],l=this._getAdditiveTrack(o),h=s.keyframes,f=h.length;if(s.prepare(i,l),s.needsAnimate())if(!this._allowDiscrete&&s.discrete){var u=h[f-1];u&&(e._target[s.propName]=u.rawValue),s.setFinished()}else n.push(s)}if(n.length||this._force){var c=new Of({life:i,loop:this._loop,delay:this._delay||0,onframe:function(p){e._started=2;var d=e._additiveAnimators;if(d){for(var g=!1,y=0;y<d.length;y++)if(d[y]._clip){g=!0;break}g||(e._additiveAnimators=null)}for(var y=0;y<n.length;y++)n[y].step(e._target,p);var v=e._onframeCbs;if(v)for(var y=0;y<v.length;y++)v[y](e._target,p)},ondestroy:function(){e._doneCallback()}});this._clip=c,this.animation&&this.animation.addClip(c),t&&c.setEasing(t)}else this._doneCallback();return this}},r.prototype.stop=function(t){if(this._clip){var e=this._clip;t&&e.onframe(1),this._abortedCallback()}},r.prototype.delay=function(t){return this._delay=t,this},r.prototype.during=function(t){return t&&(this._onframeCbs||(this._onframeCbs=[]),this._onframeCbs.push(t)),this},r.prototype.done=function(t){return t&&(this._doneCbs||(this._doneCbs=[]),this._doneCbs.push(t)),this},r.prototype.aborted=function(t){return t&&(this._abortedCbs||(this._abortedCbs=[]),this._abortedCbs.push(t)),this},r.prototype.getClip=function(){return this._clip},r.prototype.getTrack=function(t){return this._tracks[t]},r.prototype.getTracks=function(){var t=this;return dt(this._trackKeys,function(e){return t._tracks[e]})},r.prototype.stopTracks=function(t,e){if(!t.length||!this._clip)return!0;for(var n=this._tracks,i=this._trackKeys,a=0;a<t.length;a++){var o=n[t[a]];o&&!o.isFinished()&&(e?o.step(this._target,1):this._started===1&&o.step(this._target,0),o.setFinished())}for(var s=!0,a=0;a<i.length;a++)if(!n[i[a]].isFinished()){s=!1;break}return s&&this._abortedCallback(),s},r.prototype.saveTo=function(t,e,n){if(t){e=e||this._trackKeys;for(var i=0;i<e.length;i++){var a=e[i],o=this._tracks[a];if(!(!o||o.isFinished())){var s=o.keyframes,l=s[n?0:s.length-1];l&&(t[a]=vn(l.rawValue))}}}},r.prototype.__changeFinalValue=function(t,e){e=e||q(t);for(var n=0;n<e.length;n++){var i=e[n],a=this._tracks[i];if(a){var o=a.keyframes;if(o.length>1){var s=o.pop();a.addKeyframe(s.time,t[i]),a.prepare(this._maxTime,a.getAdditiveTrack())}}}},r}(),Ca=jf;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Jf=function(){function r(t,e){this.x=t||0,this.y=e||0}return r.prototype.copy=function(t){return this.x=t.x,this.y=t.y,this},r.prototype.clone=function(){return new r(this.x,this.y)},r.prototype.set=function(t,e){return this.x=t,this.y=e,this},r.prototype.equal=function(t){return t.x===this.x&&t.y===this.y},r.prototype.add=function(t){return this.x+=t.x,this.y+=t.y,this},r.prototype.scale=function(t){this.x*=t,this.y*=t},r.prototype.scaleAndAdd=function(t,e){this.x+=t.x*e,this.y+=t.y*e},r.prototype.sub=function(t){return this.x-=t.x,this.y-=t.y,this},r.prototype.dot=function(t){return this.x*t.x+this.y*t.y},r.prototype.len=function(){return Math.sqrt(this.x*this.x+this.y*this.y)},r.prototype.lenSquare=function(){return this.x*this.x+this.y*this.y},r.prototype.normalize=function(){var t=this.len();return this.x/=t,this.y/=t,this},r.prototype.distance=function(t){var e=this.x-t.x,n=this.y-t.y;return Math.sqrt(e*e+n*n)},r.prototype.distanceSquare=function(t){var e=this.x-t.x,n=this.y-t.y;return e*e+n*n},r.prototype.negate=function(){return this.x=-this.x,this.y=-this.y,this},r.prototype.transform=function(t){if(t){var e=this.x,n=this.y;return this.x=t[0]*e+t[2]*n+t[4],this.y=t[1]*e+t[3]*n+t[5],this}},r.prototype.toArray=function(t){return t[0]=this.x,t[1]=this.y,t},r.prototype.fromArray=function(t){this.x=t[0],this.y=t[1]},r.set=function(t,e,n){t.x=e,t.y=n},r.copy=function(t,e){t.x=e.x,t.y=e.y},r.len=function(t){return Math.sqrt(t.x*t.x+t.y*t.y)},r.lenSquare=function(t){return t.x*t.x+t.y*t.y},r.dot=function(t,e){return t.x*e.x+t.y*e.y},r.add=function(t,e,n){t.x=e.x+n.x,t.y=e.y+n.y},r.sub=function(t,e,n){t.x=e.x-n.x,t.y=e.y-n.y},r.scale=function(t,e,n){t.x=e.x*n,t.y=e.y*n},r.scaleAndAdd=function(t,e,n,i){t.x=e.x+n.x*i,t.y=e.y+n.y*i},r.lerp=function(t,e,n,i){var a=1-i;t.x=a*e.x+i*n.x,t.y=a*e.y+i*n.y},r}(),ht=Jf;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var tn=Math.min,rn=Math.max,dr=new ht,vr=new ht,gr=new ht,yr=new ht,oe=new ht,se=new ht,Kf=function(){function r(t,e,n,i){n<0&&(t=t+n,n=-n),i<0&&(e=e+i,i=-i),this.x=t,this.y=e,this.width=n,this.height=i}return r.prototype.union=function(t){var e=tn(t.x,this.x),n=tn(t.y,this.y);isFinite(this.x)&&isFinite(this.width)?this.width=rn(t.x+t.width,this.x+this.width)-e:this.width=t.width,isFinite(this.y)&&isFinite(this.height)?this.height=rn(t.y+t.height,this.y+this.height)-n:this.height=t.height,this.x=e,this.y=n},r.prototype.applyTransform=function(t){r.applyTransform(this,this,t)},r.prototype.calculateTransform=function(t){var e=this,n=t.width/e.width,i=t.height/e.height,a=Tn();return Va(a,a,[-e.x,-e.y]),yf(a,a,[n,i]),Va(a,a,[t.x,t.y]),a},r.prototype.intersect=function(t,e){if(!t)return!1;t instanceof r||(t=r.create(t));var n=this,i=n.x,a=n.x+n.width,o=n.y,s=n.y+n.height,l=t.x,h=t.x+t.width,f=t.y,u=t.y+t.height,c=!(a<l||h<i||s<f||u<o);if(e){var p=1/0,d=0,g=Math.abs(a-l),y=Math.abs(h-i),v=Math.abs(s-f),m=Math.abs(u-o),_=Math.min(g,y),w=Math.min(v,m);a<l||h<i?_>d&&(d=_,g<y?ht.set(se,-g,0):ht.set(se,y,0)):_<p&&(p=_,g<y?ht.set(oe,g,0):ht.set(oe,-y,0)),s<f||u<o?w>d&&(d=w,v<m?ht.set(se,0,-v):ht.set(se,0,m)):_<p&&(p=_,v<m?ht.set(oe,0,v):ht.set(oe,0,-m))}return e&&ht.copy(e,c?oe:se),c},r.prototype.contain=function(t,e){var n=this;return t>=n.x&&t<=n.x+n.width&&e>=n.y&&e<=n.y+n.height},r.prototype.clone=function(){return new r(this.x,this.y,this.width,this.height)},r.prototype.copy=function(t){r.copy(this,t)},r.prototype.plain=function(){return{x:this.x,y:this.y,width:this.width,height:this.height}},r.prototype.isFinite=function(){return isFinite(this.x)&&isFinite(this.y)&&isFinite(this.width)&&isFinite(this.height)},r.prototype.isZero=function(){return this.width===0||this.height===0},r.create=function(t){return new r(t.x,t.y,t.width,t.height)},r.copy=function(t,e){t.x=e.x,t.y=e.y,t.width=e.width,t.height=e.height},r.applyTransform=function(t,e,n){if(!n){t!==e&&r.copy(t,e);return}if(n[1]<1e-5&&n[1]>-1e-5&&n[2]<1e-5&&n[2]>-1e-5){var i=n[0],a=n[3],o=n[4],s=n[5];t.x=e.x*i+o,t.y=e.y*a+s,t.width=e.width*i,t.height=e.height*a,t.width<0&&(t.x+=t.width,t.width=-t.width),t.height<0&&(t.y+=t.height,t.height=-t.height);return}dr.x=gr.x=e.x,dr.y=yr.y=e.y,vr.x=yr.x=e.x+e.width,vr.y=gr.y=e.y+e.height,dr.transform(n),yr.transform(n),vr.transform(n),gr.transform(n),t.x=tn(dr.x,vr.x,gr.x,yr.x),t.y=tn(dr.y,vr.y,gr.y,yr.y);var l=rn(dr.x,vr.x,gr.x,yr.x),h=rn(dr.y,vr.y,gr.y,yr.y);t.width=l-t.x,t.height=h-t.y},r}(),Z=Kf;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Ra=12,ol="sans-serif",ur=Ra+"px "+ol,Qf=20,tu=100,ru="007LLmW'55;N0500LLLLLLLLLL00NNNLzWW\\\\WQb\\0FWLg\\bWb\\WQ\\WrWWQ000CL5LLFLL0LL**F*gLLLL5F0LF\\FFF5.5N";function eu(r){var t={};if(typeof JSON>"u")return t;for(var e=0;e<r.length;e++){var n=String.fromCharCode(e+32),i=(r.charCodeAt(e)-Qf)/tu;t[n]=i}return t}var nu=eu(ru),Un={createCanvas:function(){return typeof document<"u"&&document.createElement("canvas")},measureText:function(){var r,t;return function(e,n){if(!r){var i=Un.createCanvas();r=i&&i.getContext("2d")}if(r)return t!==n&&(t=r.font=n||ur),r.measureText(e);e=e||"",n=n||ur;var a=/(\d+)px/.exec(n),o=a&&+a[1]||Ra,s=0;if(n.indexOf("mono")>=0)s=o*e.length;else for(var l=0;l<e.length;l++){var h=nu[e[l]];s+=h==null?o:h*o}return{width:s}}}(),loadImage:function(r,t,e){var n=new Image;return n.onload=t,n.onerror=e,n.src=r,n}};/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var fo={};function wt(r,t){t=t||ur;var e=fo[t];e||(e=fo[t]=new za(500));var n=e.get(r);return n==null&&(n=Un.measureText(r,t).width,e.put(r,n)),n}function uo(r,t,e,n){var i=wt(r,t),a=$n(t),o=ye(0,i,e),s=Ur(0,a,n),l=new Z(o,s,i,a);return l}function iu(r,t,e,n){var i=((r||"")+"").split(`
`),a=i.length;if(a===1)return uo(i[0],t,e,n);for(var o=new Z(0,0,0,0),s=0;s<i.length;s++){var l=uo(i[s],t,e,n);s===0?o.copy(l):o.union(l)}return o}function ye(r,t,e){return e==="right"?r-=t:e==="center"&&(r-=t/2),r}function Ur(r,t,e){return e==="middle"?r-=t/2:e==="bottom"&&(r-=t),r}function $n(r){return wt("国",r)}function Ee(r,t){return typeof r=="string"?r.lastIndexOf("%")>=0?parseFloat(r)/100*t:parseFloat(r):r}function au(r,t,e){var n=t.position||"inside",i=t.distance!=null?t.distance:5,a=e.height,o=e.width,s=a/2,l=e.x,h=e.y,f="left",u="top";if(n instanceof Array)l+=Ee(n[0],e.width),h+=Ee(n[1],e.height),f=null,u=null;else switch(n){case"left":l-=i,h+=s,f="right",u="middle";break;case"right":l+=i+o,h+=s,u="middle";break;case"top":l+=o/2,h-=i,f="center",u="bottom";break;case"bottom":l+=o/2,h+=a+i,f="center";break;case"inside":l+=o/2,h+=s,f="center",u="middle";break;case"insideLeft":l+=i,h+=s,u="middle";break;case"insideRight":l+=o-i,h+=s,f="right",u="middle";break;case"insideTop":l+=o/2,h+=i,f="center";break;case"insideBottom":l+=o/2,h+=a-i,f="center",u="bottom";break;case"insideTopLeft":l+=i,h+=i;break;case"insideTopRight":l+=o-i,h+=i,f="right";break;case"insideBottomLeft":l+=i,h+=a-i,u="bottom";break;case"insideBottomRight":l+=o-i,h+=a-i,f="right",u="bottom";break}return r=r||{},r.x=l,r.y=h,r.align=f,r.verticalAlign=u,r}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var mt=1,me=2,$r=4;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var hi="__zr_normal__",fi=Pe.concat(["ignore"]),ou=Wn(Pe,function(r,t){return r[t]=!0,r},{ignore:!1}),Fr={},su=new Z(0,0,0,0),Pa=function(){function r(t){this.id=Fs(),this.animators=[],this.currentStates=[],this.states={},this._init(t)}return r.prototype._init=function(t){this.attr(t)},r.prototype.drift=function(t,e,n){switch(this.draggable){case"horizontal":e=0;break;case"vertical":t=0;break}var i=this.transform;i||(i=this.transform=[1,0,0,1,0,0]),i[4]+=t,i[5]+=e,this.decomposeTransform(),this.markRedraw()},r.prototype.beforeUpdate=function(){},r.prototype.afterUpdate=function(){},r.prototype.update=function(){this.updateTransform(),this.__dirty&&this.updateInnerText()},r.prototype.updateInnerText=function(t){var e=this._textContent;if(e&&(!e.ignore||t)){this.textConfig||(this.textConfig={});var n=this.textConfig,i=n.local,a=e.innerTransformable,o=void 0,s=void 0,l=!1;a.parent=i?this:null;var h=!1;if(a.copyTransform(e),n.position!=null){var f=su;n.layoutRect?f.copy(n.layoutRect):f.copy(this.getBoundingRect()),i||f.applyTransform(this.transform),this.calculateTextPosition?this.calculateTextPosition(Fr,n,f):au(Fr,n,f),a.x=Fr.x,a.y=Fr.y,o=Fr.align,s=Fr.verticalAlign;var u=n.origin;if(u&&n.rotation!=null){var c=void 0,p=void 0;u==="center"?(c=f.width*.5,p=f.height*.5):(c=Ee(u[0],f.width),p=Ee(u[1],f.height)),h=!0,a.originX=-a.x+c+(i?0:f.x),a.originY=-a.y+p+(i?0:f.y)}}n.rotation!=null&&(a.rotation=n.rotation);var d=n.offset;d&&(a.x+=d[0],a.y+=d[1],h||(a.originX=-d[0],a.originY=-d[1]));var g=n.inside==null?typeof n.position=="string"&&n.position.indexOf("inside")>=0:n.inside,y=this._innerTextDefaultStyle||(this._innerTextDefaultStyle={}),v=void 0,m=void 0,_=void 0;g&&this.canBeInsideText()?(v=n.insideFill,m=n.insideStroke,(v==null||v==="auto")&&(v=this.getInsideTextFill()),(m==null||m==="auto")&&(m=this.getInsideTextStroke(v),_=!0)):(v=n.outsideFill,m=n.outsideStroke,(v==null||v==="auto")&&(v=this.getOutsideFill()),(m==null||m==="auto")&&(m=this.getOutsideStroke(v),_=!0)),v=v||"#000",(v!==y.fill||m!==y.stroke||_!==y.autoStroke||o!==y.align||s!==y.verticalAlign)&&(l=!0,y.fill=v,y.stroke=m,y.autoStroke=_,y.align=o,y.verticalAlign=s,e.setDefaultTextStyle(y)),e.__dirty|=mt,l&&e.dirtyStyle(!0)}},r.prototype.canBeInsideText=function(){return!0},r.prototype.getInsideTextFill=function(){return"#fff"},r.prototype.getInsideTextStroke=function(t){return"#000"},r.prototype.getOutsideFill=function(){return this.__zr&&this.__zr.isDarkMode()?Zi:qi},r.prototype.getOutsideStroke=function(t){var e=this.__zr&&this.__zr.getBackgroundColor(),n=typeof e=="string"&&te(e);n||(n=[255,255,255,1]);for(var i=n[3],a=this.__zr.isDarkMode(),o=0;o<3;o++)n[o]=n[o]*i+(a?0:255)*(1-i);return n[3]=1,If(n,"rgba")},r.prototype.traverse=function(t,e){},r.prototype.attrKV=function(t,e){t==="textConfig"?this.setTextConfig(e):t==="textContent"?this.setTextContent(e):t==="clipPath"?this.setClipPath(e):t==="extra"?(this.extra=this.extra||{},G(this.extra,e)):this[t]=e},r.prototype.hide=function(){this.ignore=!0,this.markRedraw()},r.prototype.show=function(){this.ignore=!1,this.markRedraw()},r.prototype.attr=function(t,e){if(typeof t=="string")this.attrKV(t,e);else if(tr(t))for(var n=t,i=q(n),a=0;a<i.length;a++){var o=i[a];this.attrKV(o,t[o])}return this.markRedraw(),this},r.prototype.saveCurrentToNormalState=function(t){this._innerSaveToNormal(t);for(var e=this._normalState,n=0;n<this.animators.length;n++){var i=this.animators[n],a=i.__fromStateTransition;if(!(i.getLoop()||a&&a!==hi)){var o=i.targetName,s=o?e[o]:e;i.saveTo(s)}}},r.prototype._innerSaveToNormal=function(t){var e=this._normalState;e||(e=this._normalState={}),t.textConfig&&!e.textConfig&&(e.textConfig=this.textConfig),this._savePrimaryToNormal(t,e,fi)},r.prototype._savePrimaryToNormal=function(t,e,n){for(var i=0;i<n.length;i++){var a=n[i];t[a]!=null&&!(a in e)&&(e[a]=this[a])}},r.prototype.hasState=function(){return this.currentStates.length>0},r.prototype.getState=function(t){return this.states[t]},r.prototype.ensureState=function(t){var e=this.states;return e[t]||(e[t]={}),e[t]},r.prototype.clearStates=function(t){this.useState(hi,!1,t)},r.prototype.useState=function(t,e,n,i){var a=t===hi,o=this.hasState();if(!(!o&&a)){var s=this.currentStates,l=this.stateTransition;if(!(Ut(s,t)>=0&&(e||s.length===1))){var h;if(this.stateProxy&&!a&&(h=this.stateProxy(t)),h||(h=this.states&&this.states[t]),!h&&!a){rr("State "+t+" not exists.");return}a||this.saveCurrentToNormalState(h);var f=!!(h&&h.hoverLayer||i);f&&this._toggleHoverLayerFlag(!0),this._applyStateObj(t,h,this._normalState,e,!n&&!this.__inHover&&l&&l.duration>0,l);var u=this._textContent,c=this._textGuide;return u&&u.useState(t,e,n,f),c&&c.useState(t,e,n,f),a?(this.currentStates=[],this._normalState={}):e?this.currentStates.push(t):this.currentStates=[t],this._updateAnimationTargets(),this.markRedraw(),!f&&this.__inHover&&(this._toggleHoverLayerFlag(!1),this.__dirty&=~mt),h}}},r.prototype.useStates=function(t,e,n){if(!t.length)this.clearStates();else{var i=[],a=this.currentStates,o=t.length,s=o===a.length;if(s){for(var l=0;l<o;l++)if(t[l]!==a[l]){s=!1;break}}if(s)return;for(var l=0;l<o;l++){var h=t[l],f=void 0;this.stateProxy&&(f=this.stateProxy(h,t)),f||(f=this.states[h]),f&&i.push(f)}var u=i[o-1],c=!!(u&&u.hoverLayer||n);c&&this._toggleHoverLayerFlag(!0);var p=this._mergeStates(i),d=this.stateTransition;this.saveCurrentToNormalState(p),this._applyStateObj(t.join(","),p,this._normalState,!1,!e&&!this.__inHover&&d&&d.duration>0,d);var g=this._textContent,y=this._textGuide;g&&g.useStates(t,e,c),y&&y.useStates(t,e,c),this._updateAnimationTargets(),this.currentStates=t.slice(),this.markRedraw(),!c&&this.__inHover&&(this._toggleHoverLayerFlag(!1),this.__dirty&=~mt)}},r.prototype._updateAnimationTargets=function(){for(var t=0;t<this.animators.length;t++){var e=this.animators[t];e.targetName&&e.changeTarget(this[e.targetName])}},r.prototype.removeState=function(t){var e=Ut(this.currentStates,t);if(e>=0){var n=this.currentStates.slice();n.splice(e,1),this.useStates(n)}},r.prototype.replaceState=function(t,e,n){var i=this.currentStates.slice(),a=Ut(i,t),o=Ut(i,e)>=0;a>=0?o?i.splice(a,1):i[a]=e:n&&!o&&i.push(e),this.useStates(i)},r.prototype.toggleState=function(t,e){e?this.useState(t,!0):this.removeState(t)},r.prototype._mergeStates=function(t){for(var e={},n,i=0;i<t.length;i++){var a=t[i];G(e,a),a.textConfig&&(n=n||{},G(n,a.textConfig))}return n&&(e.textConfig=n),e},r.prototype._applyStateObj=function(t,e,n,i,a,o){var s=!(e&&i);e&&e.textConfig?(this.textConfig=G({},i?this.textConfig:n.textConfig),G(this.textConfig,e.textConfig)):s&&n.textConfig&&(this.textConfig=n.textConfig);for(var l={},h=!1,f=0;f<fi.length;f++){var u=fi[f],c=a&&ou[u];e&&e[u]!=null?c?(h=!0,l[u]=e[u]):this[u]=e[u]:s&&n[u]!=null&&(c?(h=!0,l[u]=n[u]):this[u]=n[u])}if(!a)for(var f=0;f<this.animators.length;f++){var p=this.animators[f],d=p.targetName;p.getLoop()||p.__changeFinalValue(d?(e||n)[d]:e||n)}h&&this._transitionState(t,l,o)},r.prototype._attachComponent=function(t){if(t.__zr&&!t.__hostTarget)throw new Error("Text element has been added to zrender.");if(t===this)throw new Error("Recursive component attachment.");var e=this.__zr;e&&t.addSelfToZr(e),t.__zr=e,t.__hostTarget=this},r.prototype._detachComponent=function(t){t.__zr&&t.removeSelfFromZr(t.__zr),t.__zr=null,t.__hostTarget=null},r.prototype.getClipPath=function(){return this._clipPath},r.prototype.setClipPath=function(t){this._clipPath&&this._clipPath!==t&&this.removeClipPath(),this._attachComponent(t),this._clipPath=t,this.markRedraw()},r.prototype.removeClipPath=function(){var t=this._clipPath;t&&(this._detachComponent(t),this._clipPath=null,this.markRedraw())},r.prototype.getTextContent=function(){return this._textContent},r.prototype.setTextContent=function(t){var e=this._textContent;if(e!==t){if(e&&e!==t&&this.removeTextContent(),t.__zr&&!t.__hostTarget)throw new Error("Text element has been added to zrender.");t.innerTransformable=new $s,this._attachComponent(t),this._textContent=t,this.markRedraw()}},r.prototype.setTextConfig=function(t){this.textConfig||(this.textConfig={}),G(this.textConfig,t),this.markRedraw()},r.prototype.removeTextConfig=function(){this.textConfig=null,this.markRedraw()},r.prototype.removeTextContent=function(){var t=this._textContent;t&&(t.innerTransformable=null,this._detachComponent(t),this._textContent=null,this._innerTextDefaultStyle=null,this.markRedraw())},r.prototype.getTextGuideLine=function(){return this._textGuide},r.prototype.setTextGuideLine=function(t){this._textGuide&&this._textGuide!==t&&this.removeTextGuideLine(),this._attachComponent(t),this._textGuide=t,this.markRedraw()},r.prototype.removeTextGuideLine=function(){var t=this._textGuide;t&&(this._detachComponent(t),this._textGuide=null,this.markRedraw())},r.prototype.markRedraw=function(){this.__dirty|=mt;var t=this.__zr;t&&(this.__inHover?t.refreshHover():t.refresh()),this.__hostTarget&&this.__hostTarget.markRedraw()},r.prototype.dirty=function(){this.markRedraw()},r.prototype._toggleHoverLayerFlag=function(t){this.__inHover=t;var e=this._textContent,n=this._textGuide;e&&(e.__inHover=t),n&&(n.__inHover=t)},r.prototype.addSelfToZr=function(t){if(this.__zr!==t){this.__zr=t;var e=this.animators;if(e)for(var n=0;n<e.length;n++)t.animation.addAnimator(e[n]);this._clipPath&&this._clipPath.addSelfToZr(t),this._textContent&&this._textContent.addSelfToZr(t),this._textGuide&&this._textGuide.addSelfToZr(t)}},r.prototype.removeSelfFromZr=function(t){if(this.__zr){this.__zr=null;var e=this.animators;if(e)for(var n=0;n<e.length;n++)t.animation.removeAnimator(e[n]);this._clipPath&&this._clipPath.removeSelfFromZr(t),this._textContent&&this._textContent.removeSelfFromZr(t),this._textGuide&&this._textGuide.removeSelfFromZr(t)}},r.prototype.animate=function(t,e,n){var i=t?this[t]:this;if(!i){rr('Property "'+t+'" is not existed in element '+this.id);return}var a=new Ca(i,e,n);return t&&(a.targetName=t),this.addAnimator(a,t),a},r.prototype.addAnimator=function(t,e){var n=this.__zr,i=this;t.during(function(){i.updateDuringAnimation(e)}).done(function(){var a=i.animators,o=Ut(a,t);o>=0&&a.splice(o,1)}),this.animators.push(t),n&&n.animation.addAnimator(t),n&&n.wakeUp()},r.prototype.updateDuringAnimation=function(t){this.markRedraw()},r.prototype.stopAnimation=function(t,e){for(var n=this.animators,i=n.length,a=[],o=0;o<i;o++){var s=n[o];!t||t===s.scope?s.stop(e):a.push(s)}return this.animators=a,this},r.prototype.animateTo=function(t,e,n){ui(this,t,e,n)},r.prototype.animateFrom=function(t,e,n){ui(this,t,e,n,!0)},r.prototype._transitionState=function(t,e,n,i){for(var a=ui(this,e,n,i),o=0;o<a.length;o++)a[o].__fromStateTransition=t},r.prototype.getBoundingRect=function(){return null},r.prototype.getPaintRect=function(){return null},r.initDefaultProps=function(){var t=r.prototype;t.type="element",t.name="",t.ignore=t.silent=t.isGroup=t.draggable=t.dragging=t.ignoreClip=t.__inHover=!1,t.__dirty=mt;var e={};function n(a,o,s){e[a+o+s]||(console.warn("DEPRECATED: '"+a+"' has been deprecated. use '"+o+"', '"+s+"' instead"),e[a+o+s]=!0)}function i(a,o,s,l){Object.defineProperty(t,a,{get:function(){if(n(a,s,l),!this[o]){var f=this[o]=[];h(this,f)}return this[o]},set:function(f){n(a,s,l),this[s]=f[0],this[l]=f[1],this[o]=f,h(this,f)}});function h(f,u){Object.defineProperty(u,0,{get:function(){return f[s]},set:function(c){f[s]=c}}),Object.defineProperty(u,1,{get:function(){return f[l]},set:function(c){f[l]=c}})}}Object.defineProperty&&(i("position","_legacyPos","x","y"),i("scale","_legacyScale","scaleX","scaleY"),i("origin","_legacyOrigin","originX","originY"))}(),r}();Ws(Pa,ee);Ws(Pa,$s);function ui(r,t,e,n,i){e=e||{};var a=[];sl(r,"",r,t,e,n,a,i);var o=a.length,s=!1,l=e.done,h=e.aborted,f=function(){s=!0,o--,o<=0&&(s?l&&l():h&&h())},u=function(){o--,o<=0&&(s?l&&l():h&&h())};o||l&&l(),a.length>0&&e.during&&a[0].during(function(d,g){e.during(g)});for(var c=0;c<a.length;c++){var p=a[c];f&&p.done(f),u&&p.aborted(u),e.force&&p.duration(e.duration),p.start(e.easing)}return a}function ci(r,t,e){for(var n=0;n<e;n++)r[n]=t[n]}function lu(r){return Yt(r[0])}function hu(r,t,e){if(Yt(t[e]))if(Yt(r[e])||(r[e]=[]),af(t[e])){var n=t[e].length;r[e].length!==n&&(r[e]=new t[e].constructor(n),ci(r[e],t[e],n))}else{var i=t[e],a=r[e],o=i.length;if(lu(i))for(var s=i[0].length,l=0;l<o;l++)a[l]?ci(a[l],i[l],s):a[l]=Array.prototype.slice.call(i[l]);else ci(a,i,o);a.length=i.length}else r[e]=t[e]}function fu(r,t){return r===t||Yt(r)&&Yt(t)&&uu(r,t)}function uu(r,t){var e=r.length;if(e!==t.length)return!1;for(var n=0;n<e;n++)if(r[n]!==t[n])return!1;return!0}function sl(r,t,e,n,i,a,o,s){for(var l=q(n),h=i.duration,f=i.delay,u=i.additive,c=i.setToFinal,p=!tr(a),d=r.animators,g=[],y=0;y<l.length;y++){var v=l[y],m=n[v];if(m!=null&&e[v]!=null&&(p||a[v]))if(tr(m)&&!Yt(m)&&!Ta(m)){if(t){s||(e[v]=m,r.updateDuringAnimation(t));continue}sl(r,v,e[v],m,i,a&&a[v],o,s)}else g.push(v);else s||(e[v]=m,r.updateDuringAnimation(t),g.push(v))}var _=g.length;if(!u&&_)for(var w=0;w<d.length;w++){var S=d[w];if(S.targetName===t){var x=S.stopTracks(g);if(x){var T=Ut(d,S);d.splice(T,1)}}}if(i.force||(g=Vi(g,function(P){return!fu(n[P],e[P])}),_=g.length),_>0||i.force&&!o.length){var z=void 0,C=void 0,k=void 0;if(s){C={},c&&(z={});for(var w=0;w<_;w++){var v=g[w];C[v]=e[v],c?z[v]=n[v]:e[v]=n[v]}}else if(c){k={};for(var w=0;w<_;w++){var v=g[w];k[v]=vn(e[v]),hu(e,n,v)}}var S=new Ca(e,!1,!1,u?Vi(d,function(E){return E.targetName===t}):null);S.targetName=t,i.scope&&(S.scope=i.scope),c&&z&&S.whenWithKeys(0,z,g),k&&S.whenWithKeys(0,k,g),S.whenWithKeys(h??500,s?C:n,g).delay(f||0),r.addAnimator(S,t),o.push(S)}}var ll=Pa;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var aa="__zr_style_"+Math.round(Math.random()*10),Or={shadowBlur:0,shadowOffsetX:0,shadowOffsetY:0,shadowColor:"#000",opacity:1,blend:"source-over"},Xn={style:{shadowBlur:!0,shadowOffsetX:!0,shadowOffsetY:!0,shadowColor:!0,opacity:!0}};Or[aa]=!0;var co=["z","z2","invisible"],cu=["invisible"],pu=function(r){U(t,r);function t(e){return r.call(this,e)||this}return t.prototype._init=function(e){for(var n=q(e),i=0;i<n.length;i++){var a=n[i];a==="style"?this.useStyle(e[a]):r.prototype.attrKV.call(this,a,e[a])}this.style||this.useStyle({})},t.prototype.beforeBrush=function(){},t.prototype.afterBrush=function(){},t.prototype.innerBeforeBrush=function(){},t.prototype.innerAfterBrush=function(){},t.prototype.shouldBePainted=function(e,n,i,a){var o=this.transform;if(this.ignore||this.invisible||this.style.opacity===0||this.culling&&du(this,e,n)||o&&!o[0]&&!o[3])return!1;if(i&&this.__clipPaths){for(var s=0;s<this.__clipPaths.length;++s)if(this.__clipPaths[s].isZeroArea())return!1}if(a&&this.parent)for(var l=this.parent;l;){if(l.ignore)return!1;l=l.parent}return!0},t.prototype.contain=function(e,n){return this.rectContain(e,n)},t.prototype.traverse=function(e,n){e.call(n,this)},t.prototype.rectContain=function(e,n){var i=this.transformCoordToLocal(e,n),a=this.getBoundingRect();return a.contain(i[0],i[1])},t.prototype.getPaintRect=function(){var e=this._paintRect;if(!this._paintRect||this.__dirty){var n=this.transform,i=this.getBoundingRect(),a=this.style,o=a.shadowBlur||0,s=a.shadowOffsetX||0,l=a.shadowOffsetY||0;e=this._paintRect||(this._paintRect=new Z(0,0,0,0)),n?Z.applyTransform(e,i,n):e.copy(i),(o||s||l)&&(e.width+=o*2+Math.abs(s),e.height+=o*2+Math.abs(l),e.x=Math.min(e.x,e.x+s-o),e.y=Math.min(e.y,e.y+l-o));var h=this.dirtyRectTolerance;e.isZero()||(e.x=Math.floor(e.x-h),e.y=Math.floor(e.y-h),e.width=Math.ceil(e.width+1+h*2),e.height=Math.ceil(e.height+1+h*2))}return e},t.prototype.setPrevPaintRect=function(e){e?(this._prevPaintRect=this._prevPaintRect||new Z(0,0,0,0),this._prevPaintRect.copy(e)):this._prevPaintRect=null},t.prototype.getPrevPaintRect=function(){return this._prevPaintRect},t.prototype.animateStyle=function(e){return this.animate("style",e)},t.prototype.updateDuringAnimation=function(e){e==="style"?this.dirtyStyle():this.markRedraw()},t.prototype.attrKV=function(e,n){e!=="style"?r.prototype.attrKV.call(this,e,n):this.style?this.setStyle(n):this.useStyle(n)},t.prototype.setStyle=function(e,n){return typeof e=="string"?this.style[e]=n:G(this.style,e),this.dirtyStyle(),this},t.prototype.dirtyStyle=function(e){e||this.markRedraw(),this.__dirty|=me,this._rect&&(this._rect=null)},t.prototype.dirty=function(){this.dirtyStyle()},t.prototype.styleChanged=function(){return!!(this.__dirty&me)},t.prototype.styleUpdated=function(){this.__dirty&=~me},t.prototype.createStyle=function(e){return Hn(Or,e)},t.prototype.useStyle=function(e){e[aa]||(e=this.createStyle(e)),this.__inHover?this.__hoverStyle=e:this.style=e,this.dirtyStyle()},t.prototype.isStyleObject=function(e){return e[aa]},t.prototype._innerSaveToNormal=function(e){r.prototype._innerSaveToNormal.call(this,e);var n=this._normalState;e.style&&!n.style&&(n.style=this._mergeStyle(this.createStyle(),this.style)),this._savePrimaryToNormal(e,n,co)},t.prototype._applyStateObj=function(e,n,i,a,o,s){r.prototype._applyStateObj.call(this,e,n,i,a,o,s);var l=!(n&&a),h;if(n&&n.style?o?a?h=n.style:(h=this._mergeStyle(this.createStyle(),i.style),this._mergeStyle(h,n.style)):(h=this._mergeStyle(this.createStyle(),a?this.style:i.style),this._mergeStyle(h,n.style)):l&&(h=i.style),h)if(o){var f=this.style;if(this.style=this.createStyle(l?{}:f),l)for(var u=q(f),c=0;c<u.length;c++){var p=u[c];p in h&&(h[p]=h[p],this.style[p]=f[p])}for(var d=q(h),c=0;c<d.length;c++){var p=d[c];this.style[p]=this.style[p]}this._transitionState(e,{style:h},s,this.getAnimationStyleProps())}else this.useStyle(h);for(var g=this.__inHover?cu:co,c=0;c<g.length;c++){var p=g[c];n&&n[p]!=null?this[p]=n[p]:l&&i[p]!=null&&(this[p]=i[p])}},t.prototype._mergeStates=function(e){for(var n=r.prototype._mergeStates.call(this,e),i,a=0;a<e.length;a++){var o=e[a];o.style&&(i=i||{},this._mergeStyle(i,o.style))}return i&&(n.style=i),n},t.prototype._mergeStyle=function(e,n){return G(e,n),e},t.prototype.getAnimationStyleProps=function(){return Xn},t.initDefaultProps=function(){var e=t.prototype;e.type="displayable",e.invisible=!1,e.z=0,e.z2=0,e.zlevel=0,e.culling=!1,e.cursor="pointer",e.rectHover=!1,e.incremental=!1,e._rect=null,e.dirtyRectTolerance=0,e.__dirty=mt|me}(),t}(ll),pi=new Z(0,0,0,0),di=new Z(0,0,0,0);function du(r,t,e){return pi.copy(r.getBoundingRect()),r.transform&&pi.applyTransform(r.transform),di.width=t,di.height=e,!pi.intersect(di)}var Yn=pu;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var zt=Math.min,kt=Math.max,vi=Math.sin,gi=Math.cos,mr=Math.PI*2,en=ne(),nn=ne(),an=ne();function po(r,t,e,n,i,a){i[0]=zt(r,e),i[1]=zt(t,n),a[0]=kt(r,e),a[1]=kt(t,n)}var vo=[],go=[];function vu(r,t,e,n,i,a,o,s,l,h){var f=Vs,u=et,c=f(r,e,i,o,vo);l[0]=1/0,l[1]=1/0,h[0]=-1/0,h[1]=-1/0;for(var p=0;p<c;p++){var d=u(r,e,i,o,vo[p]);l[0]=zt(d,l[0]),h[0]=kt(d,h[0])}c=f(t,n,a,s,go);for(var p=0;p<c;p++){var g=u(t,n,a,s,go[p]);l[1]=zt(g,l[1]),h[1]=kt(g,h[1])}l[0]=zt(r,l[0]),h[0]=kt(r,h[0]),l[0]=zt(o,l[0]),h[0]=kt(o,h[0]),l[1]=zt(t,l[1]),h[1]=kt(t,h[1]),l[1]=zt(s,l[1]),h[1]=kt(s,h[1])}function gu(r,t,e,n,i,a,o,s){var l=js,h=st,f=kt(zt(l(r,e,i),1),0),u=kt(zt(l(t,n,a),1),0),c=h(r,e,i,f),p=h(t,n,a,u);o[0]=zt(r,i,c),o[1]=zt(t,a,p),s[0]=kt(r,i,c),s[1]=kt(t,a,p)}function yu(r,t,e,n,i,a,o,s,l){var h=qr,f=Zr,u=Math.abs(i-a);if(u%mr<1e-4&&u>1e-4){s[0]=r-e,s[1]=t-n,l[0]=r+e,l[1]=t+n;return}if(en[0]=gi(i)*e+r,en[1]=vi(i)*n+t,nn[0]=gi(a)*e+r,nn[1]=vi(a)*n+t,h(s,en,nn),f(l,en,nn),i=i%mr,i<0&&(i=i+mr),a=a%mr,a<0&&(a=a+mr),i>a&&!o?a+=mr:i<a&&o&&(i+=mr),o){var c=a;a=i,i=c}for(var p=0;p<a;p+=Math.PI/2)p>i&&(an[0]=gi(p)*e+r,an[1]=vi(p)*n+t,h(s,an,s),f(l,an,l))}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var F={M:1,L:2,C:3,Q:4,A:5,Z:6,R:7},_r=[],wr=[],Bt=[],nr=[],Ft=[],Wt=[],yi=Math.min,mi=Math.max,xr=Math.cos,br=Math.sin,jt=Math.abs,oa=Math.PI,or=oa*2,_i=typeof Float32Array<"u",le=[];function wi(r){var t=Math.round(r/oa*1e8)/1e8;return t%2*oa}function mu(r,t){var e=wi(r[0]);e<0&&(e+=or);var n=e-r[0],i=r[1];i+=n,!t&&i-e>=or?i=e+or:t&&e-i>=or?i=e-or:!t&&e>i?i=e+(or-wi(e-i)):t&&e<i&&(i=e-(or-wi(i-e))),r[0]=e,r[1]=i}var _u=function(){function r(t){this.dpr=1,this._xi=0,this._yi=0,this._x0=0,this._y0=0,this._len=0,t&&(this._saveData=!1),this._saveData&&(this.data=[])}return r.prototype.increaseVersion=function(){this._version++},r.prototype.getVersion=function(){return this._version},r.prototype.setScale=function(t,e,n){n=n||0,n>0&&(this._ux=jt(n/bn/t)||0,this._uy=jt(n/bn/e)||0)},r.prototype.setDPR=function(t){this.dpr=t},r.prototype.setContext=function(t){this._ctx=t},r.prototype.getContext=function(){return this._ctx},r.prototype.beginPath=function(){return this._ctx&&this._ctx.beginPath(),this.reset(),this},r.prototype.reset=function(){this._saveData&&(this._len=0),this._pathSegLen&&(this._pathSegLen=null,this._pathLen=0),this._version++},r.prototype.moveTo=function(t,e){return this._drawPendingPt(),this.addData(F.M,t,e),this._ctx&&this._ctx.moveTo(t,e),this._x0=t,this._y0=e,this._xi=t,this._yi=e,this},r.prototype.lineTo=function(t,e){var n=jt(t-this._xi),i=jt(e-this._yi),a=n>this._ux||i>this._uy;if(this.addData(F.L,t,e),this._ctx&&a&&this._ctx.lineTo(t,e),a)this._xi=t,this._yi=e,this._pendingPtDist=0;else{var o=n*n+i*i;o>this._pendingPtDist&&(this._pendingPtX=t,this._pendingPtY=e,this._pendingPtDist=o)}return this},r.prototype.bezierCurveTo=function(t,e,n,i,a,o){return this._drawPendingPt(),this.addData(F.C,t,e,n,i,a,o),this._ctx&&this._ctx.bezierCurveTo(t,e,n,i,a,o),this._xi=a,this._yi=o,this},r.prototype.quadraticCurveTo=function(t,e,n,i){return this._drawPendingPt(),this.addData(F.Q,t,e,n,i),this._ctx&&this._ctx.quadraticCurveTo(t,e,n,i),this._xi=n,this._yi=i,this},r.prototype.arc=function(t,e,n,i,a,o){this._drawPendingPt(),le[0]=i,le[1]=a,mu(le,o),i=le[0],a=le[1];var s=a-i;return this.addData(F.A,t,e,n,n,i,s,0,o?0:1),this._ctx&&this._ctx.arc(t,e,n,i,a,o),this._xi=xr(a)*n+t,this._yi=br(a)*n+e,this},r.prototype.arcTo=function(t,e,n,i,a){return this._drawPendingPt(),this._ctx&&this._ctx.arcTo(t,e,n,i,a),this},r.prototype.rect=function(t,e,n,i){return this._drawPendingPt(),this._ctx&&this._ctx.rect(t,e,n,i),this.addData(F.R,t,e,n,i),this},r.prototype.closePath=function(){this._drawPendingPt(),this.addData(F.Z);var t=this._ctx,e=this._x0,n=this._y0;return t&&t.closePath(),this._xi=e,this._yi=n,this},r.prototype.fill=function(t){t&&t.fill(),this.toStatic()},r.prototype.stroke=function(t){t&&t.stroke(),this.toStatic()},r.prototype.len=function(){return this._len},r.prototype.setData=function(t){var e=t.length;!(this.data&&this.data.length===e)&&_i&&(this.data=new Float32Array(e));for(var n=0;n<e;n++)this.data[n]=t[n];this._len=e},r.prototype.appendPath=function(t){t instanceof Array||(t=[t]);for(var e=t.length,n=0,i=this._len,a=0;a<e;a++)n+=t[a].len();_i&&this.data instanceof Float32Array&&(this.data=new Float32Array(i+n));for(var a=0;a<e;a++)for(var o=t[a].data,s=0;s<o.length;s++)this.data[i++]=o[s];this._len=i},r.prototype.addData=function(t,e,n,i,a,o,s,l,h){if(this._saveData){var f=this.data;this._len+arguments.length>f.length&&(this._expandData(),f=this.data);for(var u=0;u<arguments.length;u++)f[this._len++]=arguments[u]}},r.prototype._drawPendingPt=function(){this._pendingPtDist>0&&(this._ctx&&this._ctx.lineTo(this._pendingPtX,this._pendingPtY),this._pendingPtDist=0)},r.prototype._expandData=function(){if(!(this.data instanceof Array)){for(var t=[],e=0;e<this._len;e++)t[e]=this.data[e];this.data=t}},r.prototype.toStatic=function(){if(this._saveData){this._drawPendingPt();var t=this.data;t instanceof Array&&(t.length=this._len,_i&&this._len>11&&(this.data=new Float32Array(t)))}},r.prototype.getBoundingRect=function(){Bt[0]=Bt[1]=Ft[0]=Ft[1]=Number.MAX_VALUE,nr[0]=nr[1]=Wt[0]=Wt[1]=-Number.MAX_VALUE;var t=this.data,e=0,n=0,i=0,a=0,o;for(o=0;o<this._len;){var s=t[o++],l=o===1;switch(l&&(e=t[o],n=t[o+1],i=e,a=n),s){case F.M:e=i=t[o++],n=a=t[o++],Ft[0]=i,Ft[1]=a,Wt[0]=i,Wt[1]=a;break;case F.L:po(e,n,t[o],t[o+1],Ft,Wt),e=t[o++],n=t[o++];break;case F.C:vu(e,n,t[o++],t[o++],t[o++],t[o++],t[o],t[o+1],Ft,Wt),e=t[o++],n=t[o++];break;case F.Q:gu(e,n,t[o++],t[o++],t[o],t[o+1],Ft,Wt),e=t[o++],n=t[o++];break;case F.A:var h=t[o++],f=t[o++],u=t[o++],c=t[o++],p=t[o++],d=t[o++]+p;o+=1;var g=!t[o++];l&&(i=xr(p)*u+h,a=br(p)*c+f),yu(h,f,u,c,p,d,g,Ft,Wt),e=xr(d)*u+h,n=br(d)*c+f;break;case F.R:i=e=t[o++],a=n=t[o++];var y=t[o++],v=t[o++];po(i,a,i+y,a+v,Ft,Wt);break;case F.Z:e=i,n=a;break}qr(Bt,Bt,Ft),Zr(nr,nr,Wt)}return o===0&&(Bt[0]=Bt[1]=nr[0]=nr[1]=0),new Z(Bt[0],Bt[1],nr[0]-Bt[0],nr[1]-Bt[1])},r.prototype._calculateLength=function(){var t=this.data,e=this._len,n=this._ux,i=this._uy,a=0,o=0,s=0,l=0;this._pathSegLen||(this._pathSegLen=[]);for(var h=this._pathSegLen,f=0,u=0,c=0;c<e;){var p=t[c++],d=c===1;d&&(a=t[c],o=t[c+1],s=a,l=o);var g=-1;switch(p){case F.M:a=s=t[c++],o=l=t[c++];break;case F.L:{var y=t[c++],v=t[c++],m=y-a,_=v-o;(jt(m)>n||jt(_)>i||c===e-1)&&(g=Math.sqrt(m*m+_*_),a=y,o=v);break}case F.C:{var w=t[c++],S=t[c++],y=t[c++],v=t[c++],x=t[c++],T=t[c++];g=Rf(a,o,w,S,y,v,x,T,10),a=x,o=T;break}case F.Q:{var w=t[c++],S=t[c++],y=t[c++],v=t[c++];g=Ef(a,o,w,S,y,v,10),a=y,o=v;break}case F.A:var z=t[c++],C=t[c++],k=t[c++],P=t[c++],E=t[c++],A=t[c++],L=A+E;c+=1,t[c++],d&&(s=xr(E)*k+z,l=br(E)*P+C),g=mi(k,P)*yi(or,Math.abs(A)),a=xr(L)*k+z,o=br(L)*P+C;break;case F.R:{s=a=t[c++],l=o=t[c++];var M=t[c++],R=t[c++];g=M*2+R*2;break}case F.Z:{var m=s-a,_=l-o;g=Math.sqrt(m*m+_*_),a=s,o=l;break}}g>=0&&(h[u++]=g,f+=g)}return this._pathLen=f,f},r.prototype.rebuildPath=function(t,e){var n=this.data,i=this._ux,a=this._uy,o=this._len,s,l,h,f,u,c,p=e<1,d,g,y=0,v=0,m,_=0,w,S;if(!(p&&(this._pathSegLen||this._calculateLength(),d=this._pathSegLen,g=this._pathLen,m=e*g,!m)))t:for(var x=0;x<o;){var T=n[x++],z=x===1;switch(z&&(h=n[x],f=n[x+1],s=h,l=f),T!==F.L&&_>0&&(t.lineTo(w,S),_=0),T){case F.M:s=h=n[x++],l=f=n[x++],t.moveTo(h,f);break;case F.L:{u=n[x++],c=n[x++];var C=jt(u-h),k=jt(c-f);if(C>i||k>a){if(p){var P=d[v++];if(y+P>m){var E=(m-y)/P;t.lineTo(h*(1-E)+u*E,f*(1-E)+c*E);break t}y+=P}t.lineTo(u,c),h=u,f=c,_=0}else{var A=C*C+k*k;A>_&&(w=u,S=c,_=A)}break}case F.C:{var L=n[x++],M=n[x++],R=n[x++],O=n[x++],$=n[x++],H=n[x++];if(p){var P=d[v++];if(y+P>m){var E=(m-y)/P;zn(h,L,R,$,E,_r),zn(f,M,O,H,E,wr),t.bezierCurveTo(_r[1],wr[1],_r[2],wr[2],_r[3],wr[3]);break t}y+=P}t.bezierCurveTo(L,M,R,O,$,H),h=$,f=H;break}case F.Q:{var L=n[x++],M=n[x++],R=n[x++],O=n[x++];if(p){var P=d[v++];if(y+P>m){var E=(m-y)/P;kn(h,L,R,E,_r),kn(f,M,O,E,wr),t.quadraticCurveTo(_r[1],wr[1],_r[2],wr[2]);break t}y+=P}t.quadraticCurveTo(L,M,R,O),h=R,f=O;break}case F.A:var X=n[x++],it=n[x++],W=n[x++],rt=n[x++],at=n[x++],yt=n[x++],Lt=n[x++],Zt=!n[x++],Et=W>rt?W:rt,tt=jt(W-rt)>.001,V=at+yt,D=!1;if(p){var P=d[v++];y+P>m&&(V=at+yt*(m-y)/P,D=!0),y+=P}if(tt&&t.ellipse?t.ellipse(X,it,W,rt,Lt,at,V,Zt):t.arc(X,it,Et,at,V,Zt),D)break t;z&&(s=xr(at)*W+X,l=br(at)*rt+it),h=xr(V)*W+X,f=br(V)*rt+it;break;case F.R:s=h=n[x],l=f=n[x+1],u=n[x++],c=n[x++];var N=n[x++],Vt=n[x++];if(p){var P=d[v++];if(y+P>m){var ct=m-y;t.moveTo(u,c),t.lineTo(u+yi(ct,N),c),ct-=N,ct>0&&t.lineTo(u+N,c+yi(ct,Vt)),ct-=Vt,ct>0&&t.lineTo(u+mi(N-ct,0),c+Vt),ct-=N,ct>0&&t.lineTo(u,c+mi(Vt-ct,0));break t}y+=P}t.rect(u,c,N,Vt);break;case F.Z:if(p){var P=d[v++];if(y+P>m){var E=(m-y)/P;t.lineTo(h*(1-E)+s*E,f*(1-E)+l*E);break t}y+=P}t.closePath(),h=s,f=l}}},r.prototype.clone=function(){var t=new r,e=this.data;return t.data=e.slice?e.slice():Array.prototype.slice.call(e),t._len=this._len,t},r.CMD=F,r.initDefaultProps=function(){var t=r.prototype;t._saveData=!0,t._ux=0,t._uy=0,t._pendingPtDist=0,t._version=0}(),r}(),qn=_u;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var sa=new za(50);function wu(r){if(typeof r=="string"){var t=sa.get(r);return t&&t.image}else return r}function La(r,t,e,n,i){if(r)if(typeof r=="string"){if(t&&t.__zrImageSrc===r||!e)return t;var a=sa.get(r),o={hostEl:e,cb:n,cbPayload:i};return a?(t=a.image,!Zn(t)&&a.pending.push(o)):(t=Un.loadImage(r,yo,yo),t.__zrImageSrc=r,sa.put(r,t.__cachedImgObj={image:t,pending:[o]})),t}else return r;else return t}function yo(){var r=this.__cachedImgObj;this.onload=this.onerror=this.__cachedImgObj=null;for(var t=0;t<r.pending.length;t++){var e=r.pending[t],n=e.cb;n&&n(this,e.cbPayload),e.hostEl.dirty()}r.pending.length=0}function Zn(r){return r&&r.width&&r.height}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function Wr(r,t,e,n,i,a,o){if(i===0)return!1;var s=i,l=0,h=r;if(o>t+s&&o>n+s||o<t-s&&o<n-s||a>r+s&&a>e+s||a<r-s&&a<e-s)return!1;if(r!==e)l=(t-n)/(r-e),h=(r*n-e*t)/(r-e);else return Math.abs(a-r)<=s/2;var f=l*a-o+h,u=f*f/(l*l+1);return u<=s/2*s/2}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function xu(r,t,e,n,i,a,o,s,l,h,f){if(l===0)return!1;var u=l;if(f>t+u&&f>n+u&&f>a+u&&f>s+u||f<t-u&&f<n-u&&f<a-u&&f<s-u||h>r+u&&h>e+u&&h>i+u&&h>o+u||h<r-u&&h<e-u&&h<i-u&&h<o-u)return!1;var c=Cf(r,t,e,n,i,a,o,s,h,f,null);return c<=u/2}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function bu(r,t,e,n,i,a,o,s,l){if(o===0)return!1;var h=o;if(l>t+h&&l>n+h&&l>a+h||l<t-h&&l<n-h&&l<a-h||s>r+h&&s>e+h&&s>i+h||s<r-h&&s<e-h&&s<i-h)return!1;var f=Lf(r,t,e,n,i,a,s,l,null);return f<=h/2}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var mo=Math.PI*2;function on(r){return r%=mo,r<0&&(r+=mo),r}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var he=Math.PI*2;function Tu(r,t,e,n,i,a,o,s,l){if(o===0)return!1;var h=o;s-=r,l-=t;var f=Math.sqrt(s*s+l*l);if(f-h>e||f+h<e)return!1;if(Math.abs(n-i)%he<1e-4)return!0;if(a){var u=n;n=on(i),i=on(u)}else n=on(n),i=on(i);n>i&&(i+=he);var c=Math.atan2(l,s);return c<0&&(c+=he),c>=n&&c<=i||c+he>=n&&c+he<=i}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function Tr(r,t,e,n,i,a){if(a>t&&a>n||a<t&&a<n||n===t)return 0;var o=(a-t)/(n-t),s=n<t?1:-1;(o===1||o===0)&&(s=n<t?.5:-.5);var l=o*(e-r)+r;return l===i?1/0:l>i?s:0}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var ir=qn.CMD,Sr=Math.PI*2,Su=1e-4;function zu(r,t){return Math.abs(r-t)<Su}var ft=[-1,-1,-1],Tt=[-1,-1];function ku(){var r=Tt[0];Tt[0]=Tt[1],Tt[1]=r}function Cu(r,t,e,n,i,a,o,s,l,h){if(h>t&&h>n&&h>a&&h>s||h<t&&h<n&&h<a&&h<s)return 0;var f=Zs(t,n,a,s,h,ft);if(f===0)return 0;for(var u=0,c=-1,p=void 0,d=void 0,g=0;g<f;g++){var y=ft[g],v=y===0||y===1?.5:1,m=et(r,e,i,o,y);m<l||(c<0&&(c=Vs(t,n,a,s,Tt),Tt[1]<Tt[0]&&c>1&&ku(),p=et(t,n,a,s,Tt[0]),c>1&&(d=et(t,n,a,s,Tt[1]))),c===2?y<Tt[0]?u+=p<t?v:-v:y<Tt[1]?u+=d<p?v:-v:u+=s<d?v:-v:y<Tt[0]?u+=p<t?v:-v:u+=s<p?v:-v)}return u}function Ru(r,t,e,n,i,a,o,s){if(s>t&&s>n&&s>a||s<t&&s<n&&s<a)return 0;var l=Pf(t,n,a,s,ft);if(l===0)return 0;var h=js(t,n,a);if(h>=0&&h<=1){for(var f=0,u=st(t,n,a,h),c=0;c<l;c++){var p=ft[c]===0||ft[c]===1?.5:1,d=st(r,e,i,ft[c]);d<o||(ft[c]<h?f+=u<t?p:-p:f+=a<u?p:-p)}return f}else{var p=ft[0]===0||ft[0]===1?.5:1,d=st(r,e,i,ft[0]);return d<o?0:a<t?p:-p}}function Pu(r,t,e,n,i,a,o,s){if(s-=t,s>e||s<-e)return 0;var l=Math.sqrt(e*e-s*s);ft[0]=-l,ft[1]=l;var h=Math.abs(n-i);if(h<1e-4)return 0;if(h>=Sr-1e-4){n=0,i=Sr;var f=a?1:-1;return o>=ft[0]+r&&o<=ft[1]+r?f:0}if(n>i){var u=n;n=i,i=u}n<0&&(n+=Sr,i+=Sr);for(var c=0,p=0;p<2;p++){var d=ft[p];if(d+r>o){var g=Math.atan2(s,d),f=a?1:-1;g<0&&(g=Sr+g),(g>=n&&g<=i||g+Sr>=n&&g+Sr<=i)&&(g>Math.PI/2&&g<Math.PI*1.5&&(f=-f),c+=f)}}return c}function hl(r,t,e,n,i){for(var a=r.data,o=r.len(),s=0,l=0,h=0,f=0,u=0,c,p,d=0;d<o;){var g=a[d++],y=d===1;switch(g===ir.M&&d>1&&(e||(s+=Tr(l,h,f,u,n,i))),y&&(l=a[d],h=a[d+1],f=l,u=h),g){case ir.M:f=a[d++],u=a[d++],l=f,h=u;break;case ir.L:if(e){if(Wr(l,h,a[d],a[d+1],t,n,i))return!0}else s+=Tr(l,h,a[d],a[d+1],n,i)||0;l=a[d++],h=a[d++];break;case ir.C:if(e){if(xu(l,h,a[d++],a[d++],a[d++],a[d++],a[d],a[d+1],t,n,i))return!0}else s+=Cu(l,h,a[d++],a[d++],a[d++],a[d++],a[d],a[d+1],n,i)||0;l=a[d++],h=a[d++];break;case ir.Q:if(e){if(bu(l,h,a[d++],a[d++],a[d],a[d+1],t,n,i))return!0}else s+=Ru(l,h,a[d++],a[d++],a[d],a[d+1],n,i)||0;l=a[d++],h=a[d++];break;case ir.A:var v=a[d++],m=a[d++],_=a[d++],w=a[d++],S=a[d++],x=a[d++];d+=1;var T=!!(1-a[d++]);c=Math.cos(S)*_+v,p=Math.sin(S)*w+m,y?(f=c,u=p):s+=Tr(l,h,c,p,n,i);var z=(n-v)*w/_+v;if(e){if(Tu(v,m,w,S,S+x,T,t,z,i))return!0}else s+=Pu(v,m,w,S,S+x,T,z,i);l=Math.cos(S+x)*_+v,h=Math.sin(S+x)*w+m;break;case ir.R:f=l=a[d++],u=h=a[d++];var C=a[d++],k=a[d++];if(c=f+C,p=u+k,e){if(Wr(f,u,c,u,t,n,i)||Wr(c,u,c,p,t,n,i)||Wr(c,p,f,p,t,n,i)||Wr(f,p,f,u,t,n,i))return!0}else s+=Tr(c,u,c,p,n,i),s+=Tr(f,p,f,u,n,i);break;case ir.Z:if(e){if(Wr(l,h,f,u,t,n,i))return!0}else s+=Tr(l,h,f,u,n,i);l=f,h=u;break}}return!e&&!zu(h,u)&&(s+=Tr(l,h,f,u,n,i)||0),s!==0}function Lu(r,t,e){return hl(r,0,!1,t,e)}function Eu(r,t,e,n){return hl(r,t,!0,e,n)}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Pn=Nr({fill:"#000",stroke:null,strokePercent:1,fillOpacity:1,strokeOpacity:1,lineDashOffset:0,lineWidth:1,lineCap:"butt",miterLimit:10,strokeNoScale:!1,strokeFirst:!1},Or),Au={style:Nr({fill:!0,stroke:!0,strokePercent:!0,fillOpacity:!0,strokeOpacity:!0,lineDashOffset:!0,lineWidth:!0,miterLimit:!0},Xn.style)},xi=Pe.concat(["invisible","culling","z","z2","zlevel","parent"]),Mu=function(r){U(t,r);function t(e){return r.call(this,e)||this}return t.prototype.update=function(){var e=this;r.prototype.update.call(this);var n=this.style;if(n.decal){var i=this._decalEl=this._decalEl||new t;i.buildPath===t.prototype.buildPath&&(i.buildPath=function(l){e.buildPath(l,e.shape)}),i.silent=!0;var a=i.style;for(var o in n)a[o]!==n[o]&&(a[o]=n[o]);a.fill=n.fill?n.decal:null,a.decal=null,a.shadowColor=null,n.strokeFirst&&(a.stroke=null);for(var s=0;s<xi.length;++s)i[xi[s]]=this[xi[s]];i.__dirty|=mt}else this._decalEl&&(this._decalEl=null)},t.prototype.getDecalElement=function(){return this._decalEl},t.prototype._init=function(e){var n=q(e);this.shape=this.getDefaultShape();var i=this.getDefaultStyle();i&&this.useStyle(i);for(var a=0;a<n.length;a++){var o=n[a],s=e[o];o==="style"?this.style?G(this.style,s):this.useStyle(s):o==="shape"?G(this.shape,s):r.prototype.attrKV.call(this,o,s)}this.style||this.useStyle({})},t.prototype.getDefaultStyle=function(){return null},t.prototype.getDefaultShape=function(){return{}},t.prototype.canBeInsideText=function(){return this.hasFill()},t.prototype.getInsideTextFill=function(){var e=this.style.fill;if(e!=="none"){if(fr(e)){var n=Cn(e,0);return n>.5?qi:n>.2?Kh:Zi}else if(e)return Zi}return qi},t.prototype.getInsideTextStroke=function(e){var n=this.style.fill;if(fr(n)){var i=this.__zr,a=!!(i&&i.isDarkMode()),o=Cn(e,0)<Yi;if(a===o)return n}},t.prototype.buildPath=function(e,n,i){},t.prototype.pathUpdated=function(){this.__dirty&=~$r},t.prototype.getUpdatedPathProxy=function(e){return!this.path&&this.createPathProxy(),this.path.beginPath(),this.buildPath(this.path,this.shape,e),this.path},t.prototype.createPathProxy=function(){this.path=new qn(!1)},t.prototype.hasStroke=function(){var e=this.style,n=e.stroke;return!(n==null||n==="none"||!(e.lineWidth>0))},t.prototype.hasFill=function(){var e=this.style,n=e.fill;return n!=null&&n!=="none"},t.prototype.getBoundingRect=function(){var e=this._rect,n=this.style,i=!e;if(i){var a=!1;this.path||(a=!0,this.createPathProxy());var o=this.path;(a||this.__dirty&$r)&&(o.beginPath(),this.buildPath(o,this.shape,!1),this.pathUpdated()),e=o.getBoundingRect()}if(this._rect=e,this.hasStroke()&&this.path&&this.path.len()>0){var s=this._rectStroke||(this._rectStroke=e.clone());if(this.__dirty||i){s.copy(e);var l=n.strokeNoScale?this.getLineScale():1,h=n.lineWidth;if(!this.hasFill()){var f=this.strokeContainThreshold;h=Math.max(h,f??4)}l>1e-10&&(s.width+=h/l,s.height+=h/l,s.x-=h/l/2,s.y-=h/l/2)}return s}return e},t.prototype.contain=function(e,n){var i=this.transformCoordToLocal(e,n),a=this.getBoundingRect(),o=this.style;if(e=i[0],n=i[1],a.contain(e,n)){var s=this.path;if(this.hasStroke()){var l=o.lineWidth,h=o.strokeNoScale?this.getLineScale():1;if(h>1e-10&&(this.hasFill()||(l=Math.max(l,this.strokeContainThreshold)),Eu(s,l/h,e,n)))return!0}if(this.hasFill())return Lu(s,e,n)}return!1},t.prototype.dirtyShape=function(){this.__dirty|=$r,this._rect&&(this._rect=null),this._decalEl&&this._decalEl.dirtyShape(),this.markRedraw()},t.prototype.dirty=function(){this.dirtyStyle(),this.dirtyShape()},t.prototype.animateShape=function(e){return this.animate("shape",e)},t.prototype.updateDuringAnimation=function(e){e==="style"?this.dirtyStyle():e==="shape"?this.dirtyShape():this.markRedraw()},t.prototype.attrKV=function(e,n){e==="shape"?this.setShape(n):r.prototype.attrKV.call(this,e,n)},t.prototype.setShape=function(e,n){var i=this.shape;return i||(i=this.shape={}),typeof e=="string"?i[e]=n:G(i,e),this.dirtyShape(),this},t.prototype.shapeChanged=function(){return!!(this.__dirty&$r)},t.prototype.createStyle=function(e){return Hn(Pn,e)},t.prototype._innerSaveToNormal=function(e){r.prototype._innerSaveToNormal.call(this,e);var n=this._normalState;e.shape&&!n.shape&&(n.shape=G({},this.shape))},t.prototype._applyStateObj=function(e,n,i,a,o,s){r.prototype._applyStateObj.call(this,e,n,i,a,o,s);var l=!(n&&a),h;if(n&&n.shape?o?a?h=n.shape:(h=G({},i.shape),G(h,n.shape)):(h=G({},a?this.shape:i.shape),G(h,n.shape)):l&&(h=i.shape),h)if(o){this.shape=G({},this.shape);for(var f={},u=q(h),c=0;c<u.length;c++){var p=u[c];typeof h[p]=="object"?this.shape[p]=h[p]:f[p]=h[p]}this._transitionState(e,{shape:f},s)}else this.shape=h,this.dirtyShape()},t.prototype._mergeStates=function(e){for(var n=r.prototype._mergeStates.call(this,e),i,a=0;a<e.length;a++){var o=e[a];o.shape&&(i=i||{},this._mergeStyle(i,o.shape))}return i&&(n.shape=i),n},t.prototype.getAnimationStyleProps=function(){return Au},t.prototype.isZeroArea=function(){return!1},t.extend=function(e){var n=function(a){U(o,a);function o(s){var l=a.call(this,s)||this;return e.init&&e.init.call(l,s),l}return o.prototype.getDefaultStyle=function(){return Dr(e.style)},o.prototype.getDefaultShape=function(){return Dr(e.shape)},o}(t);for(var i in e)typeof e[i]=="function"&&(n.prototype[i]=e[i]);return n},t.initDefaultProps=function(){var e=t.prototype;e.type="path",e.strokeContainThreshold=5,e.segmentIgnoreThreshold=0,e.subPixelOptimize=!1,e.autoBatch=!1,e.__dirty=mt|me|$r}(),t}(Yn),Q=Mu;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Ou=Nr({x:0,y:0},Or),Du={style:Nr({x:!0,y:!0,width:!0,height:!0,sx:!0,sy:!0,sWidth:!0,sHeight:!0},Xn.style)};function Nu(r){return!!(r&&typeof r!="string"&&r.width&&r.height)}var fl=function(r){U(t,r);function t(){return r!==null&&r.apply(this,arguments)||this}return t.prototype.createStyle=function(e){return Hn(Ou,e)},t.prototype._getSize=function(e){var n=this.style,i=n[e];if(i!=null)return i;var a=Nu(n.image)?n.image:this.__image;if(!a)return 0;var o=e==="width"?"height":"width",s=n[o];return s==null?a[e]:a[e]/a[o]*s},t.prototype.getWidth=function(){return this._getSize("width")},t.prototype.getHeight=function(){return this._getSize("height")},t.prototype.getAnimationStyleProps=function(){return Du},t.prototype.getBoundingRect=function(){var e=this.style;return this._rect||(this._rect=new Z(e.x||0,e.y||0,this.getWidth(),this.getHeight())),this._rect},t}(Yn);fl.prototype.type="image";var Fe=fl;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Iu=Nr({strokeFirst:!0,font:ur,x:0,y:0,textAlign:"left",textBaseline:"top",miterLimit:2},Pn),ul=function(r){U(t,r);function t(){return r!==null&&r.apply(this,arguments)||this}return t.prototype.hasStroke=function(){var e=this.style,n=e.stroke;return n!=null&&n!=="none"&&e.lineWidth>0},t.prototype.hasFill=function(){var e=this.style,n=e.fill;return n!=null&&n!=="none"},t.prototype.createStyle=function(e){return Hn(Iu,e)},t.prototype.setBoundingRect=function(e){this._rect=e},t.prototype.getBoundingRect=function(){var e=this.style;if(!this._rect){var n=e.text;n!=null?n+="":n="";var i=iu(n,e.font,e.textAlign,e.textBaseline);if(i.x+=e.x||0,i.y+=e.y||0,this.hasStroke()){var a=e.lineWidth;i.x-=a/2,i.y-=a/2,i.width+=a,i.height+=a}this._rect=i}return this._rect},t.initDefaultProps=function(){var e=t.prototype;e.dirtyRectTolerance=10}(),t}(Yn);ul.prototype.type="tspan";var Ln=ul;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function Bu(r,t){return!r||r==="solid"||!(t>0)?null:r==="dashed"?[4*t,2*t]:r==="dotted"?[t]:be(r)?[r]:Re(r)?r:null}function Ea(r){var t=r.style,e=t.lineDash&&t.lineWidth>0&&Bu(t.lineDash,t.lineWidth),n=t.lineDashOffset;if(e){var i=t.strokeNoScale&&r.getLineScale?r.getLineScale():1;i&&i!==1&&(e=dt(e,function(a){return a/i}),n/=i)}return[e,n]}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Fu=new qn(!0);function En(r){var t=r.stroke;return!(t==null||t==="none"||!(r.lineWidth>0))}function _o(r){return typeof r=="string"&&r!=="none"}function An(r){var t=r.fill;return t!=null&&t!=="none"}function wo(r,t){if(t.fillOpacity!=null&&t.fillOpacity!==1){var e=r.globalAlpha;r.globalAlpha=t.fillOpacity*t.opacity,r.fill(),r.globalAlpha=e}else r.fill()}function xo(r,t){if(t.strokeOpacity!=null&&t.strokeOpacity!==1){var e=r.globalAlpha;r.globalAlpha=t.strokeOpacity*t.opacity,r.stroke(),r.globalAlpha=e}else r.stroke()}function la(r,t,e){var n=La(t.image,t.__image,e);if(Zn(n)){var i=r.createPattern(n,t.repeat||"repeat");if(typeof DOMMatrix=="function"&&i&&i.setTransform){var a=new DOMMatrix;a.translateSelf(t.x||0,t.y||0),a.rotateSelf(0,0,(t.rotation||0)*pn),a.scaleSelf(t.scaleX||1,t.scaleY||1),i.setTransform(a)}return i}}function Wu(r,t,e,n){var i,a=En(e),o=An(e),s=e.strokePercent,l=s<1,h=!t.path;(!t.silent||l)&&h&&t.createPathProxy();var f=t.path||Fu,u=t.__dirty;if(!n){var c=e.fill,p=e.stroke,d=o&&!!c.colorStops,g=a&&!!p.colorStops,y=o&&!!c.image,v=a&&!!p.image,m=void 0,_=void 0,w=void 0,S=void 0,x=void 0;(d||g)&&(x=t.getBoundingRect()),d&&(m=u?Ki(r,c,x):t.__canvasFillGradient,t.__canvasFillGradient=m),g&&(_=u?Ki(r,p,x):t.__canvasStrokeGradient,t.__canvasStrokeGradient=_),y&&(w=u||!t.__canvasFillPattern?la(r,c,t):t.__canvasFillPattern,t.__canvasFillPattern=w),v&&(S=u||!t.__canvasStrokePattern?la(r,p,t):t.__canvasStrokePattern,t.__canvasStrokePattern=w),d?r.fillStyle=m:y&&(w?r.fillStyle=w:o=!1),g?r.strokeStyle=_:v&&(S?r.strokeStyle=S:a=!1)}var T=t.getGlobalScale();f.setScale(T[0],T[1],t.segmentIgnoreThreshold);var z,C;r.setLineDash&&e.lineDash&&(i=Ea(t),z=i[0],C=i[1]);var k=!0;(h||u&$r)&&(f.setDPR(r.dpr),l?f.setContext(null):(f.setContext(r),k=!1),f.reset(),t.buildPath(f,t.shape,n),f.toStatic(),t.pathUpdated()),k&&f.rebuildPath(r,l?s:1),z&&(r.setLineDash(z),r.lineDashOffset=C),n||(e.strokeFirst?(a&&xo(r,e),o&&wo(r,e)):(o&&wo(r,e),a&&xo(r,e))),z&&r.setLineDash([])}function Hu(r,t,e){var n=t.__image=La(e.image,t.__image,t,t.onload);if(!(!n||!Zn(n))){var i=e.x||0,a=e.y||0,o=t.getWidth(),s=t.getHeight(),l=n.width/n.height;if(o==null&&s!=null?o=s*l:s==null&&o!=null?s=o/l:o==null&&s==null&&(o=n.width,s=n.height),e.sWidth&&e.sHeight){var h=e.sx||0,f=e.sy||0;r.drawImage(n,h,f,e.sWidth,e.sHeight,i,a,o,s)}else if(e.sx&&e.sy){var h=e.sx,f=e.sy,u=o-h,c=s-f;r.drawImage(n,h,f,u,c,i,a,o,s)}else r.drawImage(n,i,a,o,s)}}function Gu(r,t,e){var n,i=e.text;if(i!=null&&(i+=""),i){r.font=e.font||ur,r.textAlign=e.textAlign,r.textBaseline=e.textBaseline;var a=void 0,o=void 0;r.setLineDash&&e.lineDash&&(n=Ea(t),a=n[0],o=n[1]),a&&(r.setLineDash(a),r.lineDashOffset=o),e.strokeFirst?(En(e)&&r.strokeText(i,e.x,e.y),An(e)&&r.fillText(i,e.x,e.y)):(An(e)&&r.fillText(i,e.x,e.y),En(e)&&r.strokeText(i,e.x,e.y)),a&&r.setLineDash([])}}var bo=["shadowBlur","shadowOffsetX","shadowOffsetY"],To=[["lineCap","butt"],["lineJoin","miter"],["miterLimit",10]];function cl(r,t,e,n,i){var a=!1;if(!n&&(e=e||{},t===e))return!1;if(n||t.opacity!==e.opacity){vt(r,i),a=!0;var o=Math.max(Math.min(t.opacity,1),0);r.globalAlpha=isNaN(o)?Or.opacity:o}(n||t.blend!==e.blend)&&(a||(vt(r,i),a=!0),r.globalCompositeOperation=t.blend||Or.blend);for(var s=0;s<bo.length;s++){var l=bo[s];(n||t[l]!==e[l])&&(a||(vt(r,i),a=!0),r[l]=r.dpr*(t[l]||0))}return(n||t.shadowColor!==e.shadowColor)&&(a||(vt(r,i),a=!0),r.shadowColor=t.shadowColor||Or.shadowColor),a}function So(r,t,e,n,i){var a=Ae(t,i.inHover),o=n?null:e&&Ae(e,i.inHover)||{};if(a===o)return!1;var s=cl(r,a,o,n,i);if((n||a.fill!==o.fill)&&(s||(vt(r,i),s=!0),_o(a.fill)&&(r.fillStyle=a.fill)),(n||a.stroke!==o.stroke)&&(s||(vt(r,i),s=!0),_o(a.stroke)&&(r.strokeStyle=a.stroke)),(n||a.opacity!==o.opacity)&&(s||(vt(r,i),s=!0),r.globalAlpha=a.opacity==null?1:a.opacity),t.hasStroke()){var l=a.lineWidth,h=l/(a.strokeNoScale&&t.getLineScale?t.getLineScale():1);r.lineWidth!==h&&(s||(vt(r,i),s=!0),r.lineWidth=h)}for(var f=0;f<To.length;f++){var u=To[f],c=u[0];(n||a[c]!==o[c])&&(s||(vt(r,i),s=!0),r[c]=a[c]||u[1])}return s}function Uu(r,t,e,n,i){return cl(r,Ae(t,i.inHover),e&&Ae(e,i.inHover),n,i)}function pl(r,t){var e=t.transform,n=r.dpr||1;e?r.setTransform(n*e[0],n*e[1],n*e[2],n*e[3],n*e[4],n*e[5]):r.setTransform(n,0,0,n,0,0)}function $u(r,t,e){for(var n=!1,i=0;i<r.length;i++){var a=r[i];n=n||a.isZeroArea(),pl(t,a),t.beginPath(),a.buildPath(t,a.shape),t.clip()}e.allClipped=n}function Xu(r,t){return r&&t?r[0]!==t[0]||r[1]!==t[1]||r[2]!==t[2]||r[3]!==t[3]||r[4]!==t[4]||r[5]!==t[5]:!(!r&&!t)}var zo=1,ko=2,Co=3,Ro=4;function Yu(r){var t=An(r),e=En(r);return!(r.lineDash||!(+t^+e)||t&&typeof r.fill!="string"||e&&typeof r.stroke!="string"||r.strokePercent<1||r.strokeOpacity<1||r.fillOpacity<1)}function vt(r,t){t.batchFill&&r.fill(),t.batchStroke&&r.stroke(),t.batchFill="",t.batchStroke=""}function Ae(r,t){return t&&r.__hoverStyle||r.style}function qu(r,t){Ar(r,t,{inHover:!1,viewWidth:0,viewHeight:0},!0)}function Ar(r,t,e,n){var i=t.transform;if(!t.shouldBePainted(e.viewWidth,e.viewHeight,!1,!1)){t.__dirty&=~mt,t.__isRendered=!1;return}var a=t.__clipPaths,o=e.prevElClipPaths,s=!1,l=!1;if((!o||pf(a,o))&&(o&&o.length&&(vt(r,e),r.restore(),l=s=!0,e.prevElClipPaths=null,e.allClipped=!1,e.prevEl=null),a&&a.length&&(vt(r,e),r.save(),$u(a,r,e),s=!0),e.prevElClipPaths=a),e.allClipped){t.__isRendered=!1;return}t.beforeBrush&&t.beforeBrush(),t.innerBeforeBrush();var h=e.prevEl;h||(l=s=!0);var f=t instanceof Q&&t.autoBatch&&Yu(t.style);s||Xu(i,h.transform)?(vt(r,e),pl(r,t)):f||vt(r,e);var u=Ae(t,e.inHover);t instanceof Q?(e.lastDrawType!==zo&&(l=!0,e.lastDrawType=zo),So(r,t,h,l,e),(!f||!e.batchFill&&!e.batchStroke)&&r.beginPath(),Wu(r,t,u,f),f&&(e.batchFill=u.fill||"",e.batchStroke=u.stroke||"")):t instanceof Ln?(e.lastDrawType!==Co&&(l=!0,e.lastDrawType=Co),So(r,t,h,l,e),Gu(r,t,u)):t instanceof Fe?(e.lastDrawType!==ko&&(l=!0,e.lastDrawType=ko),Uu(r,t,h,l,e),Hu(r,t,u)):t.getTemporalDisplayables&&(e.lastDrawType!==Ro&&(l=!0,e.lastDrawType=Ro),Zu(r,t,e)),f&&n&&vt(r,e),t.innerAfterBrush(),t.afterBrush&&t.afterBrush(),e.prevEl=t,t.__dirty=0,t.__isRendered=!0}function Zu(r,t,e){var n=t.getDisplayables(),i=t.getTemporalDisplayables();r.save();var a={prevElClipPaths:null,prevEl:null,allClipped:!1,viewWidth:e.viewWidth,viewHeight:e.viewHeight,inHover:e.inHover},o,s;for(o=t.getCursor(),s=n.length;o<s;o++){var l=n[o];l.beforeBrush&&l.beforeBrush(),l.innerBeforeBrush(),Ar(r,l,a,o===s-1),l.innerAfterBrush(),l.afterBrush&&l.afterBrush(),a.prevEl=l}for(var h=0,f=i.length;h<f;h++){var l=i[h];l.beforeBrush&&l.beforeBrush(),l.innerBeforeBrush(),Ar(r,l,a,h===f-1),l.innerAfterBrush(),l.afterBrush&&l.afterBrush(),a.prevEl=l}t.clearTemporalDisplayables(),t.notClear=!0,r.restore()}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function Po(r,t,e){var n=Un.createCanvas(),i=t.getWidth(),a=t.getHeight(),o=n.style;return o&&(o.position="absolute",o.left="0",o.top="0",o.width=i+"px",o.height=a+"px",n.setAttribute("data-zr-dom-id",r)),n.width=i*e,n.height=a*e,n}var Vu=function(r){U(t,r);function t(e,n,i){var a=r.call(this)||this;a.motionBlur=!1,a.lastFrameAlpha=.7,a.dpr=1,a.virtual=!1,a.config={},a.incremental=!1,a.zlevel=0,a.maxRepaintRectCount=5,a.__dirty=!0,a.__firstTimePaint=!0,a.__used=!1,a.__drawIndex=0,a.__startIndex=0,a.__endIndex=0,a.__prevStartIndex=null,a.__prevEndIndex=null;var o;i=i||bn,typeof e=="string"?o=Po(e,n,i):tr(e)&&(o=e,e=o.id),a.id=e,a.dom=o;var s=o.style;return s&&(Gs(o),o.onselectstart=function(){return!1},s.padding="0",s.margin="0",s.borderWidth="0"),a.painter=n,a.dpr=i,a}return t.prototype.getElementCount=function(){return this.__endIndex-this.__startIndex},t.prototype.afterBrush=function(){this.__prevStartIndex=this.__startIndex,this.__prevEndIndex=this.__endIndex},t.prototype.initContext=function(){this.ctx=this.dom.getContext("2d"),this.ctx.dpr=this.dpr},t.prototype.setUnpainted=function(){this.__firstTimePaint=!0},t.prototype.createBackBuffer=function(){var e=this.dpr;this.domBack=Po("back-"+this.id,this.painter,e),this.ctxBack=this.domBack.getContext("2d"),e!==1&&this.ctxBack.scale(e,e)},t.prototype.createRepaintRects=function(e,n,i,a){if(this.__firstTimePaint)return this.__firstTimePaint=!1,null;var o=[],s=this.maxRepaintRectCount,l=!1,h=new Z(0,0,0,0);function f(m){if(!(!m.isFinite()||m.isZero()))if(o.length===0){var _=new Z(0,0,0,0);_.copy(m),o.push(_)}else{for(var w=!1,S=1/0,x=0,T=0;T<o.length;++T){var z=o[T];if(z.intersect(m)){var C=new Z(0,0,0,0);C.copy(z),C.union(m),o[T]=C,w=!0;break}else if(l){h.copy(m),h.union(z);var k=m.width*m.height,P=z.width*z.height,E=h.width*h.height,A=E-k-P;A<S&&(S=A,x=T)}}if(l&&(o[x].union(m),w=!0),!w){var _=new Z(0,0,0,0);_.copy(m),o.push(_)}l||(l=o.length>=s)}}for(var u=this.__startIndex;u<this.__endIndex;++u){var c=e[u];if(c){var p=c.shouldBePainted(i,a,!0,!0),d=c.__isRendered&&(c.__dirty&mt||!p)?c.getPrevPaintRect():null;d&&f(d);var g=p&&(c.__dirty&mt||!c.__isRendered)?c.getPaintRect():null;g&&f(g)}}for(var u=this.__prevStartIndex;u<this.__prevEndIndex;++u){var c=n[u],p=c.shouldBePainted(i,a,!0,!0);if(c&&(!p||!c.__zr)&&c.__isRendered){var d=c.getPrevPaintRect();d&&f(d)}}var y;do{y=!1;for(var u=0;u<o.length;){if(o[u].isZero()){o.splice(u,1);continue}for(var v=u+1;v<o.length;)o[u].intersect(o[v])?(y=!0,o[u].union(o[v]),o.splice(v,1)):v++;u++}}while(y);return this._paintRects=o,o},t.prototype.debugGetPaintRects=function(){return(this._paintRects||[]).slice()},t.prototype.resize=function(e,n){var i=this.dpr,a=this.dom,o=a.style,s=this.domBack;o&&(o.width=e+"px",o.height=n+"px"),a.width=e*i,a.height=n*i,s&&(s.width=e*i,s.height=n*i,i!==1&&this.ctxBack.scale(i,i))},t.prototype.clear=function(e,n,i){var a=this.dom,o=this.ctx,s=a.width,l=a.height;n=n||this.clearColor;var h=this.motionBlur&&!e,f=this.lastFrameAlpha,u=this.dpr,c=this;h&&(this.domBack||this.createBackBuffer(),this.ctxBack.globalCompositeOperation="copy",this.ctxBack.drawImage(a,0,0,s/u,l/u));var p=this.domBack;function d(g,y,v,m){if(o.clearRect(g,y,v,m),n&&n!=="transparent"){var _=void 0;if(Ta(n)){var w=n.global||n.__width===v&&n.__height===m;_=w&&n.__canvasGradient||Ki(o,n,{x:0,y:0,width:v,height:m}),n.__canvasGradient=_,n.__width=v,n.__height=m}else of(n)&&(n.scaleX=n.scaleX||u,n.scaleY=n.scaleY||u,_=la(o,n,{dirty:function(){c.setUnpainted(),c.__painter.refresh()}}));o.save(),o.fillStyle=_||n,o.fillRect(g,y,v,m),o.restore()}h&&(o.save(),o.globalAlpha=f,o.drawImage(p,g,y,v,m),o.restore())}!i||h?d(0,0,s,l):i.length&&_t(i,function(g){d(g.x*u,g.y*u,g.width*u,g.height*u)})},t}(ee),bi=Vu;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var dl;dl=lt.hasGlobalWindow&&(window.requestAnimationFrame&&window.requestAnimationFrame.bind(window)||window.msRequestAnimationFrame&&window.msRequestAnimationFrame.bind(window)||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame)||function(r){return setTimeout(r,16)};var ha=dl;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Lo=1e5,zr=314159,sn=.01,ju=.001;function Ju(r){return r?r.__builtin__?!0:!(typeof r.resize!="function"||typeof r.refresh!="function"):!1}function Ku(r,t){var e=document.createElement("div");return e.style.cssText=["position:relative","width:"+r+"px","height:"+t+"px","padding:0","margin:0","border-width:0"].join(";")+";",e}var Qu=function(){function r(t,e,n,i){this.type="canvas",this._zlevelList=[],this._prevDisplayList=[],this._layers={},this._layerConfig={},this._needsManuallyCompositing=!1,this.type="canvas";var a=!t.nodeName||t.nodeName.toUpperCase()==="CANVAS";this._opts=n=G({},n||{}),this.dpr=n.devicePixelRatio||bn,this._singleCanvas=a,this.root=t;var o=t.style;o&&(Gs(t),t.innerHTML=""),this.storage=e;var s=this._zlevelList;this._prevDisplayList=[];var l=this._layers;if(a){var f=t,u=f.width,c=f.height;n.width!=null&&(u=n.width),n.height!=null&&(c=n.height),this.dpr=n.devicePixelRatio||1,f.width=u*this.dpr,f.height=c*this.dpr,this._width=u,this._height=c;var p=new bi(f,this,this.dpr);p.__builtin__=!0,p.initContext(),l[zr]=p,p.zlevel=zr,s.push(zr),this._domRoot=t}else{this._width=Yr(t,0,n),this._height=Yr(t,1,n);var h=this._domRoot=Ku(this._width,this._height);t.appendChild(h)}}return r.prototype.getType=function(){return"canvas"},r.prototype.isSingleCanvas=function(){return this._singleCanvas},r.prototype.getViewportRoot=function(){return this._domRoot},r.prototype.getViewportRootOffset=function(){var t=this.getViewportRoot();if(t)return{offsetLeft:t.offsetLeft||0,offsetTop:t.offsetTop||0}},r.prototype.refresh=function(t){var e=this.storage.getDisplayList(!0),n=this._prevDisplayList,i=this._zlevelList;this._redrawId=Math.random(),this._paintList(e,n,t,this._redrawId);for(var a=0;a<i.length;a++){var o=i[a],s=this._layers[o];if(!s.__builtin__&&s.refresh){var l=a===0?this._backgroundColor:null;s.refresh(l)}}return this._opts.useDirtyRect&&(this._prevDisplayList=e.slice()),this},r.prototype.refreshHover=function(){this._paintHoverList(this.storage.getDisplayList(!1))},r.prototype._paintHoverList=function(t){var e=t.length,n=this._hoverlayer;if(n&&n.clear(),!!e){for(var i={inHover:!0,viewWidth:this._width,viewHeight:this._height},a,o=0;o<e;o++){var s=t[o];s.__inHover&&(n||(n=this._hoverlayer=this.getLayer(Lo)),a||(a=n.ctx,a.save()),Ar(a,s,i,o===e-1))}a&&a.restore()}},r.prototype.getHoverLayer=function(){return this.getLayer(Lo)},r.prototype.paintOne=function(t,e){qu(t,e)},r.prototype._paintList=function(t,e,n,i){if(this._redrawId===i){n=n||!1,this._updateLayerStatus(t);var a=this._doPaintList(t,e,n),o=a.finished,s=a.needsRefreshHover;if(this._needsManuallyCompositing&&this._compositeManually(),s&&this._paintHoverList(t),o)this.eachLayer(function(h){h.afterBrush&&h.afterBrush()});else{var l=this;ha(function(){l._paintList(t,e,n,i)})}}},r.prototype._compositeManually=function(){var t=this.getLayer(zr).ctx,e=this._domRoot.width,n=this._domRoot.height;t.clearRect(0,0,e,n),this.eachBuiltinLayer(function(i){i.virtual&&t.drawImage(i.dom,0,0,e,n)})},r.prototype._doPaintList=function(t,e,n){for(var i=this,a=[],o=this._opts.useDirtyRect,s=0;s<this._zlevelList.length;s++){var l=this._zlevelList[s],h=this._layers[l];h.__builtin__&&h!==this._hoverlayer&&(h.__dirty||n)&&a.push(h)}for(var f=!0,u=!1,c=function(g){var y=a[g],v=y.ctx,m=o&&y.createRepaintRects(t,e,p._width,p._height),_=n?y.__startIndex:y.__drawIndex,w=!n&&y.incremental&&Date.now,S=w&&Date.now(),x=y.zlevel===p._zlevelList[0]?p._backgroundColor:null;if(y.__startIndex===y.__endIndex)y.clear(!1,x,m);else if(_===y.__startIndex){var T=t[_];(!T.incremental||!T.notClear||n)&&y.clear(!1,x,m)}_===-1&&(console.error("For some unknown reason. drawIndex is -1"),_=y.__startIndex);var z,C=function(A){var L={inHover:!1,allClipped:!1,prevEl:null,viewWidth:i._width,viewHeight:i._height};for(z=_;z<y.__endIndex;z++){var M=t[z];if(M.__inHover&&(u=!0),i._doPaintEl(M,y,o,A,L,z===y.__endIndex-1),w){var R=Date.now()-S;if(R>15)break}}L.prevElClipPaths&&v.restore()};if(m)if(m.length===0)z=y.__endIndex;else for(var k=p.dpr,P=0;P<m.length;++P){var E=m[P];v.save(),v.beginPath(),v.rect(E.x*k,E.y*k,E.width*k,E.height*k),v.clip(),C(E),v.restore()}else v.save(),C(),v.restore();y.__drawIndex=z,y.__drawIndex<y.__endIndex&&(f=!1)},p=this,d=0;d<a.length;d++)c(d);return lt.wxa&&_t(this._layers,function(g){g&&g.ctx&&g.ctx.draw&&g.ctx.draw()}),{finished:f,needsRefreshHover:u}},r.prototype._doPaintEl=function(t,e,n,i,a,o){var s=e.ctx;if(n){var l=t.getPaintRect();(!i||l&&l.intersect(i))&&(Ar(s,t,a,o),t.setPrevPaintRect(l))}else Ar(s,t,a,o)},r.prototype.getLayer=function(t,e){this._singleCanvas&&!this._needsManuallyCompositing&&(t=zr);var n=this._layers[t];return n||(n=new bi("zr_"+t,this,this.dpr),n.zlevel=t,n.__builtin__=!0,this._layerConfig[t]?de(n,this._layerConfig[t],!0):this._layerConfig[t-sn]&&de(n,this._layerConfig[t-sn],!0),e&&(n.virtual=e),this.insertLayer(t,n),n.initContext()),n},r.prototype.insertLayer=function(t,e){var n=this._layers,i=this._zlevelList,a=i.length,o=this._domRoot,s=null,l=-1;if(n[t]){rr("ZLevel "+t+" has been used already");return}if(!Ju(e)){rr("Layer of zlevel "+t+" is not valid");return}if(a>0&&t>i[0]){for(l=0;l<a-1&&!(i[l]<t&&i[l+1]>t);l++);s=n[i[l]]}if(i.splice(l+1,0,t),n[t]=e,!e.virtual)if(s){var h=s.dom;h.nextSibling?o.insertBefore(e.dom,h.nextSibling):o.appendChild(e.dom)}else o.firstChild?o.insertBefore(e.dom,o.firstChild):o.appendChild(e.dom);e.__painter=this},r.prototype.eachLayer=function(t,e){for(var n=this._zlevelList,i=0;i<n.length;i++){var a=n[i];t.call(e,this._layers[a],a)}},r.prototype.eachBuiltinLayer=function(t,e){for(var n=this._zlevelList,i=0;i<n.length;i++){var a=n[i],o=this._layers[a];o.__builtin__&&t.call(e,o,a)}},r.prototype.eachOtherLayer=function(t,e){for(var n=this._zlevelList,i=0;i<n.length;i++){var a=n[i],o=this._layers[a];o.__builtin__||t.call(e,o,a)}},r.prototype.getLayers=function(){return this._layers},r.prototype._updateLayerStatus=function(t){this.eachBuiltinLayer(function(u,c){u.__dirty=u.__used=!1});function e(u){a&&(a.__endIndex!==u&&(a.__dirty=!0),a.__endIndex=u)}if(this._singleCanvas)for(var n=1;n<t.length;n++){var i=t[n];if(i.zlevel!==t[n-1].zlevel||i.incremental){this._needsManuallyCompositing=!0;break}}var a=null,o=0,s,l;for(l=0;l<t.length;l++){var i=t[l],h=i.zlevel,f=void 0;s!==h&&(s=h,o=0),i.incremental?(f=this.getLayer(h+ju,this._needsManuallyCompositing),f.incremental=!0,o=1):f=this.getLayer(h+(o>0?sn:0),this._needsManuallyCompositing),f.__builtin__||rr("ZLevel "+h+" has been used by unkown layer "+f.id),f!==a&&(f.__used=!0,f.__startIndex!==l&&(f.__dirty=!0),f.__startIndex=l,f.incremental?f.__drawIndex=-1:f.__drawIndex=l,e(l),a=f),i.__dirty&mt&&!i.__inHover&&(f.__dirty=!0,f.incremental&&f.__drawIndex<0&&(f.__drawIndex=l))}e(l),this.eachBuiltinLayer(function(u,c){!u.__used&&u.getElementCount()>0&&(u.__dirty=!0,u.__startIndex=u.__endIndex=u.__drawIndex=0),u.__dirty&&u.__drawIndex<0&&(u.__drawIndex=u.__startIndex)})},r.prototype.clear=function(){return this.eachBuiltinLayer(this._clearLayer),this},r.prototype._clearLayer=function(t){t.clear()},r.prototype.setBackgroundColor=function(t){this._backgroundColor=t,_t(this._layers,function(e){e.setUnpainted()})},r.prototype.configLayer=function(t,e){if(e){var n=this._layerConfig;n[t]?de(n[t],e,!0):n[t]=e;for(var i=0;i<this._zlevelList.length;i++){var a=this._zlevelList[i];if(a===t||a===t+sn){var o=this._layers[a];de(o,n[t],!0)}}}},r.prototype.delLayer=function(t){var e=this._layers,n=this._zlevelList,i=e[t];i&&(i.dom.parentNode.removeChild(i.dom),delete e[t],n.splice(Ut(n,t),1))},r.prototype.resize=function(t,e){if(this._domRoot.style){var n=this._domRoot;n.style.display="none";var i=this._opts,a=this.root;if(t!=null&&(i.width=t),e!=null&&(i.height=e),t=Yr(a,0,i),e=Yr(a,1,i),n.style.display="",this._width!==t||e!==this._height){n.style.width=t+"px",n.style.height=e+"px";for(var o in this._layers)this._layers.hasOwnProperty(o)&&this._layers[o].resize(t,e);this.refresh(!0)}this._width=t,this._height=e}else{if(t==null||e==null)return;this._width=t,this._height=e,this.getLayer(zr).resize(t,e)}return this},r.prototype.clearLayer=function(t){var e=this._layers[t];e&&e.clear()},r.prototype.dispose=function(){this.root.innerHTML="",this.root=this.storage=this._domRoot=this._layers=null},r.prototype.getRenderedCanvas=function(t){if(t=t||{},this._singleCanvas&&!this._compositeManually)return this._layers[zr].dom;var e=new bi("image",this,t.pixelRatio||this.dpr);e.initContext(),e.clear(!1,t.backgroundColor||this._backgroundColor);var n=e.ctx;if(t.pixelRatio<=this.dpr){this.refresh();var i=e.dom.width,a=e.dom.height;this.eachLayer(function(u){u.__builtin__?n.drawImage(u.dom,0,0,i,a):u.renderToCanvas&&(n.save(),u.renderToCanvas(n),n.restore())})}else for(var o={inHover:!1,viewWidth:this._width,viewHeight:this._height},s=this.storage.getDisplayList(!0),l=0,h=s.length;l<h;l++){var f=s[l];Ar(n,f,o,l===h-1)}return e.dom},r.prototype.getWidth=function(){return this._width},r.prototype.getHeight=function(){return this._height},r}(),tc=Qu;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Ti=Math.sin,Si=Math.cos,vl=Math.PI,kr=Math.PI*2,rc=180/vl,ec=function(){function r(){}return r.prototype.reset=function(t){this._start=!0,this._d=[],this._str="",this._p=Math.pow(10,t||4)},r.prototype.moveTo=function(t,e){this._add("M",t,e)},r.prototype.lineTo=function(t,e){this._add("L",t,e)},r.prototype.bezierCurveTo=function(t,e,n,i,a,o){this._add("C",t,e,n,i,a,o)},r.prototype.quadraticCurveTo=function(t,e,n,i){this._add("Q",t,e,n,i)},r.prototype.arc=function(t,e,n,i,a,o){this.ellipse(t,e,n,n,0,i,a,o)},r.prototype.ellipse=function(t,e,n,i,a,o,s,l){var h=s-o,f=!l,u=Math.abs(h),c=lr(u-kr)||(f?h>=kr:-h>=kr),p=h>0?h%kr:h%kr+kr,d=!1;c?d=!0:lr(u)?d=!1:d=p>=vl==!!f;var g=t+n*Si(o),y=e+i*Ti(o);this._start&&this._add("M",g,y);var v=Math.round(a*rc);if(c){var m=1/this._p,_=(f?1:-1)*(kr-m);this._add("A",n,i,v,1,+f,t+n*Si(o+_),e+i*Ti(o+_)),m>.01&&this._add("A",n,i,v,0,+f,g,y)}else{var w=t+n*Si(s),S=e+i*Ti(s);this._add("A",n,i,v,+d,+f,w,S)}},r.prototype.rect=function(t,e,n,i){this._add("M",t,e),this._add("l",n,0),this._add("l",0,i),this._add("l",-n,0),this._add("Z")},r.prototype.closePath=function(){this._d.length>0&&this._add("Z")},r.prototype._add=function(t,e,n,i,a,o,s,l,h){for(var f=[],u=this._p,c=1;c<arguments.length;c++){var p=arguments[c];if(isNaN(p)){this._invalid=!0;return}f.push(Math.round(p*u)/u)}this._d.push(t+f.join(" ")),this._start=t==="Z"},r.prototype.generateStr=function(){this._str=this._invalid?"":this._d.join(""),this._d=[]},r.prototype.getStr=function(){return this._str},r}(),gl=ec;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var ke="none",nc=Math.round;function ic(r){var t=r.fill;return t!=null&&t!==ke}function ac(r){var t=r.stroke;return t!=null&&t!==ke}var fa=["lineCap","miterLimit","lineJoin"],oc=dt(fa,function(r){return"stroke-"+r.toLowerCase()});function sc(r,t,e,n){var i=t.opacity==null?1:t.opacity;if(e instanceof Fe){r("opacity",i);return}if(ic(t)){var a=Le(t.fill);r("fill",a.color);var o=t.fillOpacity!=null?t.fillOpacity*a.opacity*i:a.opacity*i;(n||o<1)&&r("fill-opacity",o)}else r("fill",ke);if(ac(t)){var s=Le(t.stroke);r("stroke",s.color);var l=t.strokeNoScale?e.getLineScale():1,h=l?(t.lineWidth||0)/l:0,f=t.strokeOpacity!=null?t.strokeOpacity*s.opacity*i:s.opacity*i,u=t.strokeFirst;if((n||h!==1)&&r("stroke-width",h),(n||u)&&r("paint-order",u?"stroke":"fill"),(n||f<1)&&r("stroke-opacity",f),t.lineDash){var c=Ea(e),p=c[0],d=c[1];p&&(d=nc(d||0),r("stroke-dasharray",p.join(",")),(d||n)&&r("stroke-dashoffset",d))}else n&&r("stroke-dasharray",ke);for(var g=0;g<fa.length;g++){var y=fa[g];if(n||t[y]!==Pn[y]){var v=t[y]||Pn[y];v&&r(oc[g],v)}}}else n&&r("stroke",ke)}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var lc=Math.log(2);function ua(r,t,e,n,i,a){var o=n+"-"+i,s=r.length;if(a.hasOwnProperty(o))return a[o];if(t===1){var l=Math.round(Math.log((1<<s)-1&~i)/lc);return r[e][l]}for(var h=n|1<<e,f=e+1;n&1<<f;)f++;for(var u=0,c=0,p=0;c<s;c++){var d=1<<c;d&i||(u+=(p%2?-1:1)*r[e][c]*ua(r,t-1,f,h,i|d,a),p++)}return a[o]=u,u}function Eo(r,t){var e=[[r[0],r[1],1,0,0,0,-t[0]*r[0],-t[0]*r[1]],[0,0,0,r[0],r[1],1,-t[1]*r[0],-t[1]*r[1]],[r[2],r[3],1,0,0,0,-t[2]*r[2],-t[2]*r[3]],[0,0,0,r[2],r[3],1,-t[3]*r[2],-t[3]*r[3]],[r[4],r[5],1,0,0,0,-t[4]*r[4],-t[4]*r[5]],[0,0,0,r[4],r[5],1,-t[5]*r[4],-t[5]*r[5]],[r[6],r[7],1,0,0,0,-t[6]*r[6],-t[6]*r[7]],[0,0,0,r[6],r[7],1,-t[7]*r[6],-t[7]*r[7]]],n={},i=ua(e,8,0,0,0,n);if(i!==0){for(var a=[],o=0;o<8;o++)for(var s=0;s<8;s++)a[s]==null&&(a[s]=0),a[s]+=((o+s)%2?-1:1)*ua(e,7,o===0?1:0,1<<o,1<<s,n)/i*t[o];return function(l,h,f){var u=h*a[6]+f*a[7]+1;l[0]=(h*a[0]+f*a[1]+a[2])/u,l[1]=(h*a[3]+f*a[4]+a[5])/u}}}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Ao="___zrEVENTSAVED";function hc(r,t,e,n,i){if(t.getBoundingClientRect&&lt.domSupported&&!yl(t)){var a=t[Ao]||(t[Ao]={}),o=fc(t,a),s=uc(o,a,i);if(s)return s(r,e,n),!0}return!1}function fc(r,t){var e=t.markers;if(e)return e;e=t.markers=[];for(var n=["left","right"],i=["top","bottom"],a=0;a<4;a++){var o=document.createElement("div"),s=o.style,l=a%2,h=(a>>1)%2;s.cssText=["position: absolute","visibility: hidden","padding: 0","margin: 0","border-width: 0","user-select: none","width:0","height:0",n[l]+":0",i[h]+":0",n[1-l]+":auto",i[1-h]+":auto",""].join("!important;"),r.appendChild(o),e.push(o)}return e}function uc(r,t,e){for(var n=e?"invTrans":"trans",i=t[n],a=t.srcCoords,o=[],s=[],l=!0,h=0;h<4;h++){var f=r[h].getBoundingClientRect(),u=2*h,c=f.left,p=f.top;o.push(c,p),l=l&&a&&c===a[u]&&p===a[u+1],s.push(r[h].offsetLeft,r[h].offsetTop)}return l&&i?i:(t.srcCoords=o,t[n]=e?Eo(s,o):Eo(o,s))}function yl(r){return r.nodeName.toUpperCase()==="CANVAS"}var cc=/([&<>"'])/g,pc={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function dc(r){return r==null?"":(r+"").replace(cc,function(t,e){return pc[e]})}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var ml="http://www.w3.org/2000/svg",_l="http://www.w3.org/1999/xlink",vc="http://www.w3.org/2000/xmlns/",gc="http://www.w3.org/XML/1998/namespace";function wl(r){return document.createElementNS(ml,r)}function K(r,t,e,n,i){return{tag:r,attrs:e||{},children:n,text:i,key:t}}function yc(r,t){var e=[];if(t)for(var n in t){var i=t[n],a=n;i!==!1&&(i!==!0&&i!=null&&(a+='="'+i+'"'),e.push(a))}return"<"+r+" "+e.join(" ")+">"}function mc(r){return"</"+r+">"}function Aa(r,t){t=t||{};var e=t.newline?`
`:"";function n(i){var a=i.children,o=i.tag,s=i.attrs,l=i.text;return yc(o,s)+(o!=="style"?dc(l):l||"")+(a?""+e+dt(a,function(h){return n(h)}).join(e)+e:"")+mc(o)}return n(r)}function _c(r,t,e){e=e||{};var n=e.newline?`
`:"",i=" {"+n,a=n+"}",o=dt(q(r),function(l){return l+i+dt(q(r[l]),function(h){return h+":"+r[l][h]+";"}).join(n)+a}).join(n),s=dt(q(t),function(l){return"@keyframes "+l+i+dt(q(t[l]),function(h){return h+i+dt(q(t[l][h]),function(f){var u=t[l][h][f];return f==="d"&&(u='path("'+u+'")'),f+":"+u+";"}).join(n)+a}).join(n)+a}).join(n);return!o&&!s?"":["<![CDATA[",o,s,"]]>"].join(n)}function ca(r){return{zrId:r,shadowCache:{},patternCache:{},gradientCache:{},clipPathCache:{},defs:{},cssNodes:{},cssAnims:{},cssClassIdx:0,cssAnimIdx:0,shadowIdx:0,gradientIdx:0,patternIdx:0,clipPathIdx:0}}function Mo(r,t,e,n){return K("svg","root",{width:r,height:t,xmlns:ml,"xmlns:xlink":_l,version:"1.1",baseProfile:"full",viewBox:n?"0 0 "+r+" "+t:!1},e)}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var wc=function(r){U(t,r);function t(){var e=r!==null&&r.apply(this,arguments)||this;return e.type="compound",e}return t.prototype._updatePathDirty=function(){for(var e=this.shape.paths,n=this.shapeChanged(),i=0;i<e.length;i++)n=n||e[i].shapeChanged();n&&this.dirtyShape()},t.prototype.beforeBrush=function(){this._updatePathDirty();for(var e=this.shape.paths||[],n=this.getGlobalScale(),i=0;i<e.length;i++)e[i].path||e[i].createPathProxy(),e[i].path.setScale(n[0],n[1],e[i].segmentIgnoreThreshold)},t.prototype.buildPath=function(e,n){for(var i=n.paths||[],a=0;a<i.length;a++)i[a].buildPath(e,i[a].shape,!0)},t.prototype.afterBrush=function(){for(var e=this.shape.paths||[],n=0;n<e.length;n++)e[n].pathUpdated()},t.prototype.getBoundingRect=function(){return this._updatePathDirty.call(this),Q.prototype.getBoundingRect.call(this)},t}(Q),xl=wc;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Oo={cubicIn:"0.32,0,0.67,0",cubicOut:"0.33,1,0.68,1",cubicInOut:"0.65,0,0.35,1",quadraticIn:"0.11,0,0.5,0",quadraticOut:"0.5,1,0.89,1",quadraticInOut:"0.45,0,0.55,1",quarticIn:"0.5,0,0.75,0",quarticOut:"0.25,1,0.5,1",quarticInOut:"0.76,0,0.24,1",quinticIn:"0.64,0,0.78,0",quinticOut:"0.22,1,0.36,1",quinticInOut:"0.83,0,0.17,1",sinusoidalIn:"0.12,0,0.39,0",sinusoidalOut:"0.61,1,0.88,1",sinusoidalInOut:"0.37,0,0.63,1",exponentialIn:"0.7,0,0.84,0",exponentialOut:"0.16,1,0.3,1",exponentialInOut:"0.87,0,0.13,1",circularIn:"0.55,0,1,0.45",circularOut:"0,0.55,0.45,1",circularInOut:"0.85,0,0.15,1"},Pr="transform-origin";function xc(r,t,e){var n=G({},r.shape);G(n,t),r.buildPath(e,n);var i=new gl;return i.reset(nl(r)),e.rebuildPath(i,1),i.generateStr(),i.getStr()}function bc(r,t){var e=t.originX,n=t.originY;(e||n)&&(r[Pr]=e+"px "+n+"px")}var Tc={fill:"fill",opacity:"opacity",lineWidth:"stroke-width",lineDashOffset:"stroke-dashoffset"};function bl(r,t){var e=t.zrId+"-ani-"+t.cssAnimIdx++;return t.cssAnims[e]=r,e}function Sc(r,t,e){var n=r.shape.paths,i={},a,o;if(_t(n,function(l){var h=ca(e.zrId);h.animation=!0,Vn(l,{},h,!0);var f=h.cssAnims,u=h.cssNodes,c=q(f),p=c.length;if(p){o=c[p-1];var d=f[o];for(var g in d){var y=d[g];i[g]=i[g]||{d:""},i[g].d+=y.d||""}for(var v in u){var m=u[v].animation;m.indexOf(o)>=0&&(a=m)}}}),!!a){t.d=!1;var s=bl(i,e);return a.replace(o,s)}}function Do(r){return fr(r)?Oo[r]?"cubic-bezier("+Oo[r]+")":Sa(r)?r:"":""}function Vn(r,t,e,n){var i=r.animators,a=i.length,o=[];if(r instanceof xl){var s=Sc(r,t,e);if(s)o.push(s);else if(!a)return}else if(!a)return;for(var l={},h=0;h<a;h++){var f=i[h],u=[f.getMaxTime()/1e3+"s"],c=Do(f.getClip().easing),p=f.getDelay();c?u.push(c):u.push("linear"),p&&u.push(p/1e3+"s"),f.getLoop()&&u.push("infinite");var d=u.join(" ");l[d]=l[d]||[d,[]],l[d][1].push(f)}function g(m){var _=m[1],w=_.length,S={},x={},T={},z="animation-timing-function";function C(Et,tt,V){for(var D=Et.getTracks(),N=Et.getMaxTime(),Vt=0;Vt<D.length;Vt++){var ct=D[Vt];if(ct.needsAnimate()){var Ua=ct.keyframes,Ge=ct.propName;if(V&&(Ge=V(Ge)),Ge)for(var ri=0;ri<Ua.length;ri++){var Ue=Ua[ri],$e=Math.round(Ue.time/N*100)+"%",$a=Do(Ue.easing),Xa=Ue.rawValue;(fr(Xa)||be(Xa))&&(tt[$e]=tt[$e]||{},tt[$e][Ge]=Ue.rawValue,$a&&(tt[$e][z]=$a))}}}}for(var k=0;k<w;k++){var P=_[k],E=P.targetName;E?E==="shape"&&C(P,x):!n&&C(P,S)}for(var A in S){var L={};Us(L,r),G(L,S[A]);var M=il(L),R=S[A][z];T[A]=M?{transform:M}:{},bc(T[A],L),R&&(T[A][z]=R)}var O,$=!0;for(var A in x){T[A]=T[A]||{};var H=!O,R=x[A][z];H&&(O=new qn);var X=O.len();O.reset(),T[A].d=xc(r,x[A],O);var it=O.len();if(!H&&X!==it){$=!1;break}R&&(T[A][z]=R)}if(!$)for(var A in T)delete T[A].d;if(!n)for(var k=0;k<w;k++){var P=_[k],E=P.targetName;E==="style"&&C(P,T,function(D){return Tc[D]})}for(var W=q(T),rt=!0,at,k=1;k<W.length;k++){var yt=W[k-1],Lt=W[k];if(T[yt][Pr]!==T[Lt][Pr]){rt=!1;break}at=T[yt][Pr]}if(rt&&at){for(var A in T)T[A][Pr]&&delete T[A][Pr];t[Pr]=at}if(Vi(W,function(Et){return q(T[Et]).length>0}).length){var Zt=bl(T,e);return Zt+" "+m[0]+" both"}}for(var y in l){var s=g(l[y]);s&&o.push(s)}if(o.length){var v=e.zrId+"-cls-"+e.cssClassIdx++;e.cssNodes["."+v]={animation:o.join(",")},t.class=v}}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var zi=/\{([a-zA-Z0-9_]+)\|([^}]*)\}/g;function zc(r,t,e,n,i){if(!t)return"";var a=(r+"").split(`
`);i=Tl(t,e,n,i);for(var o=0,s=a.length;o<s;o++)a[o]=Sl(a[o],i);return a.join(`
`)}function Tl(r,t,e,n){n=n||{};var i=G({},n);i.font=t,e=j(e,"..."),i.maxIterations=j(n.maxIterations,2);var a=i.minChar=j(n.minChar,0);i.cnCharWidth=wt("国",t);var o=i.ascCharWidth=wt("a",t);i.placeholder=j(n.placeholder,"");for(var s=r=Math.max(0,r-1),l=0;l<a&&s>=o;l++)s-=o;var h=wt(e,t);return h>s&&(e="",h=0),s=r-h,i.ellipsis=e,i.ellipsisWidth=h,i.contentWidth=s,i.containerWidth=r,i}function Sl(r,t){var e=t.containerWidth,n=t.font,i=t.contentWidth;if(!e)return"";var a=wt(r,n);if(a<=e)return r;for(var o=0;;o++){if(a<=i||o>=t.maxIterations){r+=t.ellipsis;break}var s=o===0?kc(r,i,t.ascCharWidth,t.cnCharWidth):a>0?Math.floor(r.length*i/a):0;r=r.substr(0,s),a=wt(r,n)}return r===""&&(r=t.placeholder),r}function kc(r,t,e,n){for(var i=0,a=0,o=r.length;a<o&&i<t;a++){var s=r.charCodeAt(a);i+=0<=s&&s<=127?e:n}return a}function Cc(r,t){r!=null&&(r+="");var e=t.overflow,n=t.padding,i=t.font,a=e==="truncate",o=$n(i),s=j(t.lineHeight,o),l=!!t.backgroundColor,h=t.lineOverflow==="truncate",f=t.width,u;f!=null&&(e==="break"||e==="breakAll")?u=r?zl(r,t.font,f,e==="breakAll",0).lines:[]:u=r?r.split(`
`):[];var c=u.length*s,p=j(t.height,c);if(c>p&&h){var d=Math.floor(p/s);u=u.slice(0,d)}if(r&&a&&f!=null)for(var g=Tl(f,i,t.ellipsis,{minChar:t.truncateMinChar,placeholder:t.placeholder}),y=0;y<u.length;y++)u[y]=Sl(u[y],g);for(var v=p,m=0,y=0;y<u.length;y++)m=Math.max(wt(u[y],i),m);f==null&&(f=m);var _=m;return n&&(v+=n[0]+n[2],_+=n[1]+n[3],f+=n[1]+n[3]),l&&(_=f),{lines:u,height:p,outerWidth:_,outerHeight:v,lineHeight:s,calculatedLineHeight:o,contentWidth:m,contentHeight:c,width:f}}var Rc=function(){function r(){}return r}(),No=function(){function r(t){this.tokens=[],t&&(this.tokens=t)}return r}(),Pc=function(){function r(){this.width=0,this.height=0,this.contentWidth=0,this.contentHeight=0,this.outerWidth=0,this.outerHeight=0,this.lines=[]}return r}();function Lc(r,t){var e=new Pc;if(r!=null&&(r+=""),!r)return e;for(var n=t.width,i=t.height,a=t.overflow,o=(a==="break"||a==="breakAll")&&n!=null?{width:n,accumWidth:0,breakAll:a==="breakAll"}:null,s=zi.lastIndex=0,l;(l=zi.exec(r))!=null;){var h=l.index;h>s&&ki(e,r.substring(s,h),t,o),ki(e,l[2],t,o,l[1]),s=zi.lastIndex}s<r.length&&ki(e,r.substring(s,r.length),t,o);var f=[],u=0,c=0,p=t.padding,d=a==="truncate",g=t.lineOverflow==="truncate";function y($,H,X){$.width=H,$.lineHeight=X,u+=X,c=Math.max(c,H)}t:for(var v=0;v<e.lines.length;v++){for(var m=e.lines[v],_=0,w=0,S=0;S<m.tokens.length;S++){var x=m.tokens[S],T=x.styleName&&t.rich[x.styleName]||{},z=x.textPadding=T.padding,C=z?z[1]+z[3]:0,k=x.font=T.font||t.font;x.contentHeight=$n(k);var P=j(T.height,x.contentHeight);if(x.innerHeight=P,z&&(P+=z[0]+z[2]),x.height=P,x.lineHeight=cn(T.lineHeight,t.lineHeight,P),x.align=T&&T.align||t.align,x.verticalAlign=T&&T.verticalAlign||"middle",g&&i!=null&&u+x.lineHeight>i){S>0?(m.tokens=m.tokens.slice(0,S),y(m,w,_),e.lines=e.lines.slice(0,v+1)):e.lines=e.lines.slice(0,v);break t}var E=T.width,A=E==null||E==="auto";if(typeof E=="string"&&E.charAt(E.length-1)==="%")x.percentWidth=E,f.push(x),x.contentWidth=wt(x.text,k);else{if(A){var L=T.backgroundColor,M=L&&L.image;M&&(M=wu(M),Zn(M)&&(x.width=Math.max(x.width,M.width*P/M.height)))}var R=d&&n!=null?n-w:null;R!=null&&R<x.width?!A||R<C?(x.text="",x.width=x.contentWidth=0):(x.text=zc(x.text,R-C,k,t.ellipsis,{minChar:t.truncateMinChar}),x.width=x.contentWidth=wt(x.text,k)):x.contentWidth=wt(x.text,k)}x.width+=C,w+=x.width,T&&(_=Math.max(_,x.lineHeight))}y(m,w,_)}e.outerWidth=e.width=j(n,c),e.outerHeight=e.height=j(i,u),e.contentHeight=u,e.contentWidth=c,p&&(e.outerWidth+=p[1]+p[3],e.outerHeight+=p[0]+p[2]);for(var v=0;v<f.length;v++){var x=f[v],O=x.percentWidth;x.width=parseInt(O,10)/100*e.width}return e}function ki(r,t,e,n,i){var a=t==="",o=i&&e.rich[i]||{},s=r.lines,l=o.font||e.font,h=!1,f,u;if(n){var c=o.padding,p=c?c[1]+c[3]:0;if(o.width!=null&&o.width!=="auto"){var d=Ee(o.width,n.width)+p;s.length>0&&d+n.accumWidth>n.width&&(f=t.split(`
`),h=!0),n.accumWidth=d}else{var g=zl(t,l,n.width,n.breakAll,n.accumWidth);n.accumWidth=g.accumWidth+p,u=g.linesWidths,f=g.lines}}else f=t.split(`
`);for(var y=0;y<f.length;y++){var v=f[y],m=new Rc;if(m.styleName=i,m.text=v,m.isLineHolder=!v&&!a,typeof o.width=="number"?m.width=o.width:m.width=u?u[y]:wt(v,l),!y&&!h){var _=(s[s.length-1]||(s[0]=new No)).tokens,w=_.length;w===1&&_[0].isLineHolder?_[0]=m:(v||!w||a)&&_.push(m)}else s.push(new No([m]))}}function Ec(r){var t=r.charCodeAt(0);return t>=32&&t<=591||t>=880&&t<=4351||t>=4608&&t<=5119||t>=7680&&t<=8303}var Ac=Wn(",&?/;] ".split(""),function(r,t){return r[t]=!0,r},{});function Mc(r){return Ec(r)?!!Ac[r]:!0}function zl(r,t,e,n,i){for(var a=[],o=[],s="",l="",h=0,f=0,u=0;u<r.length;u++){var c=r.charAt(u);if(c===`
`){l&&(s+=l,f+=h),a.push(s),o.push(f),s="",l="",h=0,f=0;continue}var p=wt(c,t),d=n?!1:!Mc(c);if(a.length?f+p>e:i+f+p>e){f?(s||l)&&(d?(s||(s=l,l="",h=0,f=h),a.push(s),o.push(f-h),l+=c,h+=p,s="",f=h):(l&&(s+=l,l="",h=0),a.push(s),o.push(f),s=c,f=p)):d?(a.push(l),o.push(h),l=c,h=p):(a.push(c),o.push(p));continue}f+=p,d?(l+=c,h+=p):(l&&(s+=l,l="",h=0),s+=c)}return!a.length&&!s&&(s=r,l="",h=0),l&&(s+=l),s&&(a.push(s),o.push(f)),a.length===1&&(f+=i),{accumWidth:f,lines:a,linesWidths:o}}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function Oc(r,t){var e=t.x,n=t.y,i=t.width,a=t.height,o=t.r,s,l,h,f;i<0&&(e=e+i,i=-i),a<0&&(n=n+a,a=-a),typeof o=="number"?s=l=h=f=o:o instanceof Array?o.length===1?s=l=h=f=o[0]:o.length===2?(s=h=o[0],l=f=o[1]):o.length===3?(s=o[0],l=f=o[1],h=o[2]):(s=o[0],l=o[1],h=o[2],f=o[3]):s=l=h=f=0;var u;s+l>i&&(u=s+l,s*=i/u,l*=i/u),h+f>i&&(u=h+f,h*=i/u,f*=i/u),l+h>a&&(u=l+h,l*=a/u,h*=a/u),s+f>a&&(u=s+f,s*=a/u,f*=a/u),r.moveTo(e+s,n),r.lineTo(e+i-l,n),l!==0&&r.arc(e+i-l,n+l,l,-Math.PI/2,0),r.lineTo(e+i,n+a-h),h!==0&&r.arc(e+i-h,n+a-h,h,0,Math.PI/2),r.lineTo(e+f,n+a),f!==0&&r.arc(e+f,n+a-f,f,Math.PI/2,Math.PI),r.lineTo(e,n+s),s!==0&&r.arc(e+s,n+s,s,Math.PI,Math.PI*1.5)}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Vr=Math.round;function Dc(r,t,e){if(t){var n=t.x1,i=t.x2,a=t.y1,o=t.y2;r.x1=n,r.x2=i,r.y1=a,r.y2=o;var s=e&&e.lineWidth;return s&&(Vr(n*2)===Vr(i*2)&&(r.x1=r.x2=jr(n,s,!0)),Vr(a*2)===Vr(o*2)&&(r.y1=r.y2=jr(a,s,!0))),r}}function Nc(r,t,e){if(t){var n=t.x,i=t.y,a=t.width,o=t.height;r.x=n,r.y=i,r.width=a,r.height=o;var s=e&&e.lineWidth;return s&&(r.x=jr(n,s,!0),r.y=jr(i,s,!0),r.width=Math.max(jr(n+a,s,!1)-r.x,a===0?0:1),r.height=Math.max(jr(i+o,s,!1)-r.y,o===0?0:1)),r}}function jr(r,t,e){if(!t)return r;var n=Vr(r*2);return(n+Vr(t))%2===0?n/2:(n+(e?1:-1))/2}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Ic=function(){function r(){this.x=0,this.y=0,this.width=0,this.height=0}return r}(),Bc={},kl=function(r){U(t,r);function t(e){return r.call(this,e)||this}return t.prototype.getDefaultShape=function(){return new Ic},t.prototype.buildPath=function(e,n){var i,a,o,s;if(this.subPixelOptimize){var l=Nc(Bc,n,this.style);i=l.x,a=l.y,o=l.width,s=l.height,l.r=n.r,n=l}else i=n.x,a=n.y,o=n.width,s=n.height;n.r?Oc(e,n):e.rect(i,a,o,s)},t.prototype.isZeroArea=function(){return!this.shape.width||!this.shape.height},t}(Q);kl.prototype.type="rect";var Cl=kl;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Io={fill:"#000"},Bo=2,Fc={style:Nr({fill:!0,stroke:!0,fillOpacity:!0,strokeOpacity:!0,lineWidth:!0,fontSize:!0,lineHeight:!0,width:!0,height:!0,textShadowColor:!0,textShadowBlur:!0,textShadowOffsetX:!0,textShadowOffsetY:!0,backgroundColor:!0,padding:!0,borderColor:!0,borderWidth:!0,borderRadius:!0},Xn.style)},Rl=function(r){U(t,r);function t(e){var n=r.call(this)||this;return n.type="text",n._children=[],n._defaultStyle=Io,n.attr(e),n}return t.prototype.childrenRef=function(){return this._children},t.prototype.update=function(){r.prototype.update.call(this),this.styleChanged()&&this._updateSubTexts();for(var e=0;e<this._children.length;e++){var n=this._children[e];n.zlevel=this.zlevel,n.z=this.z,n.z2=this.z2,n.culling=this.culling,n.cursor=this.cursor,n.invisible=this.invisible}},t.prototype.updateTransform=function(){var e=this.innerTransformable;e?(e.updateTransform(),e.transform&&(this.transform=e.transform)):r.prototype.updateTransform.call(this)},t.prototype.getLocalTransform=function(e){var n=this.innerTransformable;return n?n.getLocalTransform(e):r.prototype.getLocalTransform.call(this,e)},t.prototype.getComputedTransform=function(){return this.__hostTarget&&(this.__hostTarget.getComputedTransform(),this.__hostTarget.updateInnerText(!0)),r.prototype.getComputedTransform.call(this)},t.prototype._updateSubTexts=function(){this._childCursor=0,Gc(this.style),this.style.rich?this._updateRichTexts():this._updatePlainTexts(),this._children.length=this._childCursor,this.styleUpdated()},t.prototype.addSelfToZr=function(e){r.prototype.addSelfToZr.call(this,e);for(var n=0;n<this._children.length;n++)this._children[n].__zr=e},t.prototype.removeSelfFromZr=function(e){r.prototype.removeSelfFromZr.call(this,e);for(var n=0;n<this._children.length;n++)this._children[n].__zr=null},t.prototype.getBoundingRect=function(){if(this.styleChanged()&&this._updateSubTexts(),!this._rect){for(var e=new Z(0,0,0,0),n=this._children,i=[],a=null,o=0;o<n.length;o++){var s=n[o],l=s.getBoundingRect(),h=s.getLocalTransform(i);h?(e.copy(l),e.applyTransform(h),a=a||e.clone(),a.union(e)):(a=a||l.clone(),a.union(l))}this._rect=a||e}return this._rect},t.prototype.setDefaultTextStyle=function(e){this._defaultStyle=e||Io},t.prototype.setTextContent=function(e){throw new Error("Can't attach text on another text")},t.prototype._mergeStyle=function(e,n){if(!n)return e;var i=n.rich,a=e.rich||i&&{};return G(e,n),i&&a?(this._mergeRich(a,i),e.rich=a):a&&(e.rich=a),e},t.prototype._mergeRich=function(e,n){for(var i=q(n),a=0;a<i.length;a++){var o=i[a];e[o]=e[o]||{},G(e[o],n[o])}},t.prototype.getAnimationStyleProps=function(){return Fc},t.prototype._getOrCreateChild=function(e){var n=this._children[this._childCursor];return(!n||!(n instanceof e))&&(n=new e),this._children[this._childCursor++]=n,n.__zr=this.__zr,n.parent=this,n},t.prototype._updatePlainTexts=function(){var e=this.style,n=e.font||ur,i=e.padding,a=Xo(e),o=Cc(a,e),s=Ci(e),l=!!e.backgroundColor,h=o.outerHeight,f=o.outerWidth,u=o.contentWidth,c=o.lines,p=o.lineHeight,d=this._defaultStyle,g=e.x||0,y=e.y||0,v=e.align||d.align||"left",m=e.verticalAlign||d.verticalAlign||"top",_=g,w=Ur(y,o.contentHeight,m);if(s||i){var S=ye(g,f,v),x=Ur(y,h,m);s&&this._renderBackground(e,e,S,x,f,h)}w+=p/2,i&&(_=$o(g,v,i),m==="top"?w+=i[0]:m==="bottom"&&(w-=i[2]));for(var T=0,z=!1,C=Uo("fill"in e?e.fill:(z=!0,d.fill)),k=Go("stroke"in e?e.stroke:!l&&(!d.autoStroke||z)?(T=Bo,d.stroke):null),P=e.textShadowBlur>0,E=e.width!=null&&(e.overflow==="truncate"||e.overflow==="break"||e.overflow==="breakAll"),A=o.calculatedLineHeight,L=0;L<c.length;L++){var M=this._getOrCreateChild(Ln),R=M.createStyle();M.useStyle(R),R.text=c[L],R.x=_,R.y=w,v&&(R.textAlign=v),R.textBaseline="middle",R.opacity=e.opacity,R.strokeFirst=!0,P&&(R.shadowBlur=e.textShadowBlur||0,R.shadowColor=e.textShadowColor||"transparent",R.shadowOffsetX=e.textShadowOffsetX||0,R.shadowOffsetY=e.textShadowOffsetY||0),R.stroke=k,R.fill=C,k&&(R.lineWidth=e.lineWidth||T,R.lineDash=e.lineDash,R.lineDashOffset=e.lineDashOffset||0),R.font=n,Wo(R,e),w+=p,E&&M.setBoundingRect(new Z(ye(R.x,e.width,R.textAlign),Ur(R.y,A,R.textBaseline),u,A))}},t.prototype._updateRichTexts=function(){var e=this.style,n=Xo(e),i=Lc(n,e),a=i.width,o=i.outerWidth,s=i.outerHeight,l=e.padding,h=e.x||0,f=e.y||0,u=this._defaultStyle,c=e.align||u.align,p=e.verticalAlign||u.verticalAlign,d=ye(h,o,c),g=Ur(f,s,p),y=d,v=g;l&&(y+=l[3],v+=l[0]);var m=y+a;Ci(e)&&this._renderBackground(e,e,d,g,o,s);for(var _=!!e.backgroundColor,w=0;w<i.lines.length;w++){for(var S=i.lines[w],x=S.tokens,T=x.length,z=S.lineHeight,C=S.width,k=0,P=y,E=m,A=T-1,L=void 0;k<T&&(L=x[k],!L.align||L.align==="left");)this._placeToken(L,e,z,v,P,"left",_),C-=L.width,P+=L.width,k++;for(;A>=0&&(L=x[A],L.align==="right");)this._placeToken(L,e,z,v,E,"right",_),C-=L.width,E-=L.width,A--;for(P+=(a-(P-y)-(m-E)-C)/2;k<=A;)L=x[k],this._placeToken(L,e,z,v,P+L.width/2,"center",_),P+=L.width,k++;v+=z}},t.prototype._placeToken=function(e,n,i,a,o,s,l){var h=n.rich[e.styleName]||{};h.text=e.text;var f=e.verticalAlign,u=a+i/2;f==="top"?u=a+e.height/2:f==="bottom"&&(u=a+i-e.height/2);var c=!e.isLineHolder&&Ci(h);c&&this._renderBackground(h,n,s==="right"?o-e.width:s==="center"?o-e.width/2:o,u-e.height/2,e.width,e.height);var p=!!h.backgroundColor,d=e.textPadding;d&&(o=$o(o,s,d),u-=e.height/2-d[0]-e.innerHeight/2);var g=this._getOrCreateChild(Ln),y=g.createStyle();g.useStyle(y);var v=this._defaultStyle,m=!1,_=0,w=Uo("fill"in h?h.fill:"fill"in n?n.fill:(m=!0,v.fill)),S=Go("stroke"in h?h.stroke:"stroke"in n?n.stroke:!p&&!l&&(!v.autoStroke||m)?(_=Bo,v.stroke):null),x=h.textShadowBlur>0||n.textShadowBlur>0;y.text=e.text,y.x=o,y.y=u,x&&(y.shadowBlur=h.textShadowBlur||n.textShadowBlur||0,y.shadowColor=h.textShadowColor||n.textShadowColor||"transparent",y.shadowOffsetX=h.textShadowOffsetX||n.textShadowOffsetX||0,y.shadowOffsetY=h.textShadowOffsetY||n.textShadowOffsetY||0),y.textAlign=s,y.textBaseline="middle",y.font=e.font||ur,y.opacity=cn(h.opacity,n.opacity,1),Wo(y,h),S&&(y.lineWidth=cn(h.lineWidth,n.lineWidth,_),y.lineDash=j(h.lineDash,n.lineDash),y.lineDashOffset=n.lineDashOffset||0,y.stroke=S),w&&(y.fill=w);var T=e.contentWidth,z=e.contentHeight;g.setBoundingRect(new Z(ye(y.x,T,y.textAlign),Ur(y.y,z,y.textBaseline),T,z))},t.prototype._renderBackground=function(e,n,i,a,o,s){var l=e.backgroundColor,h=e.borderWidth,f=e.borderColor,u=l&&l.image,c=l&&!u,p=e.borderRadius,d=this,g,y;if(c||e.lineHeight||h&&f){g=this._getOrCreateChild(Cl),g.useStyle(g.createStyle()),g.style.fill=null;var v=g.shape;v.x=i,v.y=a,v.width=o,v.height=s,v.r=p,g.dirtyShape()}if(c){var m=g.style;m.fill=l||null,m.fillOpacity=j(e.fillOpacity,1)}else if(u){y=this._getOrCreateChild(Fe),y.onload=function(){d.dirtyStyle()};var _=y.style;_.image=l.image,_.x=i,_.y=a,_.width=o,_.height=s}if(h&&f){var m=g.style;m.lineWidth=h,m.stroke=f,m.strokeOpacity=j(e.strokeOpacity,1),m.lineDash=e.borderDash,m.lineDashOffset=e.borderDashOffset||0,g.strokeContainThreshold=0,g.hasFill()&&g.hasStroke()&&(m.strokeFirst=!0,m.lineWidth*=2)}var w=(g||y).style;w.shadowBlur=e.shadowBlur||0,w.shadowColor=e.shadowColor||"transparent",w.shadowOffsetX=e.shadowOffsetX||0,w.shadowOffsetY=e.shadowOffsetY||0,w.opacity=cn(e.opacity,n.opacity,1)},t.makeFont=function(e){var n="";return Ll(e)&&(n=[e.fontStyle,e.fontWeight,Pl(e.fontSize),e.fontFamily||"sans-serif"].join(" ")),n&&ve(n)||e.textFont||e.font},t}(Yn),Wc={left:!0,right:1,center:1},Hc={top:1,bottom:1,middle:1},Fo=["fontStyle","fontWeight","fontSize","fontFamily"];function Pl(r){return typeof r=="string"&&(r.indexOf("px")!==-1||r.indexOf("rem")!==-1||r.indexOf("em")!==-1)?r:isNaN(+r)?Ra+"px":r+"px"}function Wo(r,t){for(var e=0;e<Fo.length;e++){var n=Fo[e],i=t[n];i!=null&&(r[n]=i)}}function Ll(r){return r.fontSize!=null||r.fontFamily||r.fontWeight}function Gc(r){return Ho(r),_t(r.rich,Ho),r}function Ho(r){if(r){r.font=Rl.makeFont(r);var t=r.align;t==="middle"&&(t="center"),r.align=t==null||Wc[t]?t:"left";var e=r.verticalAlign;e==="center"&&(e="middle"),r.verticalAlign=e==null||Hc[e]?e:"top";var n=r.padding;n&&(r.padding=lf(r.padding))}}function Go(r,t){return r==null||t<=0||r==="transparent"||r==="none"?null:r.image||r.colorStops?"#000":r}function Uo(r){return r==null||r==="none"?null:r.image||r.colorStops?"#000":r}function $o(r,t,e){return t==="right"?r-e[1]:t==="center"?r+e[3]/2-e[1]/2:r+e[3]}function Xo(r){var t=r.text;return t!=null&&(t+=""),t}function Ci(r){return!!(r.backgroundColor||r.lineHeight||r.borderWidth&&r.borderColor)}var Uc=Rl;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Me=Math.round;function El(r){return r&&fr(r.src)}function Al(r){return r&&Be(r.toDataURL)}function Ma(r,t,e,n){sc(function(i,a){var o=i==="fill"||i==="stroke";o&&el(a)?Ol(t,r,i,n):o&&ka(a)?Dl(e,r,i,n):r[i]=a},t,e,!1),jc(e,r,n)}function Yo(r){return lr(r[0]-1)&&lr(r[1])&&lr(r[2])&&lr(r[3]-1)}function $c(r){return lr(r[4])&&lr(r[5])}function Oa(r,t,e){if(t&&!($c(t)&&Yo(t))){var n=e?10:1e4;r.transform=Yo(t)?"translate("+Me(t[4]*n)/n+" "+Me(t[5]*n)/n+")":Bf(t)}}function qo(r,t,e){for(var n=r.points,i=[],a=0;a<n.length;a++)i.push(Me(n[a][0]*e)/e),i.push(Me(n[a][1]*e)/e);t.points=i.join(" ")}function Zo(r){return!r.smooth}function Xc(r){var t=dt(r,function(e){return typeof e=="string"?[e,e]:e});return function(e,n,i){for(var a=0;a<t.length;a++){var o=t[a],s=e[o[0]];s!=null&&(n[o[1]]=Me(s*i)/i)}}}var Yc={circle:[Xc(["cx","cy","r"])],polyline:[qo,Zo],polygon:[qo,Zo]};function qc(r){for(var t=r.animators,e=0;e<t.length;e++)if(t[e].targetName==="shape")return!0;return!1}function Ml(r,t){var e=r.style,n=r.shape,i=Yc[r.type],a={},o=t.animation,s="path",l=r.style.strokePercent,h=t.compress&&nl(r)||4;if(i&&!t.willUpdate&&!(i[1]&&!i[1](n))&&!(o&&qc(r))&&!(l<1)){s=r.type;var f=Math.pow(10,h);i[0](n,a,f)}else{var u=!r.path||r.shapeChanged();r.path||r.createPathProxy();var c=r.path;u&&(c.beginPath(),r.buildPath(c,r.shape),r.pathUpdated());var p=c.getVersion(),d=r,g=d.__svgPathBuilder;(d.__svgPathVersion!==p||!g||l!==d.__svgPathStrokePercent)&&(g||(g=d.__svgPathBuilder=new gl),g.reset(h),c.rebuildPath(g,l),g.generateStr(),d.__svgPathVersion=p,d.__svgPathStrokePercent=l),a.d=g.getStr()}return Oa(a,r.transform),Ma(a,e,r,t),t.animation&&Vn(r,a,t),K(s,r.id+"",a)}function Zc(r,t){var e=r.style,n=e.image;if(n&&!fr(n)&&(El(n)?n=n.src:Al(n)&&(n=n.toDataURL())),!!n){var i=e.x||0,a=e.y||0,o=e.width,s=e.height,l={href:n,width:o,height:s};return i&&(l.x=i),a&&(l.y=a),Oa(l,r.transform),Ma(l,e,r,t),t.animation&&Vn(r,l,t),K("image",r.id+"",l)}}function Vc(r,t){var e=r.style,n=e.text;if(n!=null&&(n+=""),!(!n||isNaN(e.x)||isNaN(e.y))){var i=e.font||ur,a=e.x||0,o=Wf(e.y||0,$n(i),e.textBaseline),s=Ff[e.textAlign]||e.textAlign,l={"dominant-baseline":"central","text-anchor":s};if(Ll(e)){var h="",f=e.fontStyle,u=Pl(e.fontSize);if(!parseFloat(u))return;var c=e.fontFamily||ol,p=e.fontWeight;h+="font-size:"+u+";font-family:"+c+";",f&&f!=="normal"&&(h+="font-style:"+f+";"),p&&p!=="normal"&&(h+="font-weight:"+p+";"),l.style=h}else l.style="font: "+i;return n.match(/\s/)&&(l["xml:space"]="preserve"),a&&(l.x=a),o&&(l.y=o),Oa(l,r.transform),Ma(l,e,r,t),t.animation&&Vn(r,l,t),K("text",r.id+"",l,void 0,n)}}function Vo(r,t){if(r instanceof Q)return Ml(r,t);if(r instanceof Fe)return Zc(r,t);if(r instanceof Ln)return Vc(r,t)}function jc(r,t,e){var n=r.style;if(Hf(n)){var i=Gf(r),a=e.shadowCache,o=a[i];if(!o){var s=r.getGlobalScale(),l=s[0],h=s[1];if(!l||!h)return;var f=n.shadowOffsetX||0,u=n.shadowOffsetY||0,c=n.shadowBlur,p=Le(n.shadowColor),d=p.opacity,g=p.color,y=c/2/l,v=c/2/h,m=y+" "+v;o=e.zrId+"-s"+e.shadowIdx++,e.defs[o]=K("filter",o,{id:o,x:"-100%",y:"-100%",width:"300%",height:"300%"},[K("feDropShadow","",{dx:f/l,dy:u/h,stdDeviation:m,"flood-color":g,"flood-opacity":d})]),a[i]=o}t.filter=Gn(o)}}function Ol(r,t,e,n){var i=r[e],a,o={gradientUnits:i.global?"userSpaceOnUse":"objectBoundingBox"};if(tl(i))a="linearGradient",o.x1=i.x,o.y1=i.y,o.x2=i.x2,o.y2=i.y2;else if(rl(i))a="radialGradient",o.cx=j(i.x,.5),o.cy=j(i.y,.5),o.r=j(i.r,.5);else{rr("Illegal gradient type.");return}for(var s=i.colorStops,l=[],h=0,f=s.length;h<f;++h){var u=ra(s[h].offset)*100+"%",c=s[h].color,p=Le(c),d=p.color,g=p.opacity,y={offset:u};y["stop-color"]=d,g<1&&(y["stop-opacity"]=g),l.push(K("stop",h+"",y))}var v=K(a,"",o,l),m=Aa(v),_=n.gradientCache,w=_[m];w||(w=n.zrId+"-g"+n.gradientIdx++,_[m]=w,o.id=w,n.defs[w]=K(a,w,o,l)),t[e]=Gn(w)}function Dl(r,t,e,n){var i=r.style[e],a=r.getBoundingRect(),o={},s=i.repeat,l=s==="no-repeat",h=s==="repeat-x",f=s==="repeat-y",u;if(Qs(i)){var c=i.imageWidth,p=i.imageHeight,d=void 0,g=i.image;if(fr(g)?d=g:El(g)?d=g.src:Al(g)&&(d=g.toDataURL()),typeof Image>"u"){var y="Image width/height must been given explictly in svg-ssr renderer.";Za(c,y),Za(p,y)}else if(c==null||p==null){var v=function(k,P){if(k){var E=k.elm,A=c||P.width,L=p||P.height;k.tag==="pattern"&&(h?(L=1,A/=a.width):f&&(A=1,L/=a.height)),k.attrs.width=A,k.attrs.height=L,E&&(E.setAttribute("width",A),E.setAttribute("height",L))}},m=La(d,null,r,function(k){l||v(x,k),v(u,k)});m&&m.width&&m.height&&(c=c||m.width,p=p||m.height)}u=K("image","img",{href:d,width:c,height:p}),o.width=c,o.height=p}else i.svgElement&&(u=Dr(i.svgElement),o.width=i.svgWidth,o.height=i.svgHeight);if(u){var _,w;l?_=w=1:h?(w=1,_=o.width/a.width):f?(_=1,w=o.height/a.height):o.patternUnits="userSpaceOnUse",_!=null&&!isNaN(_)&&(o.width=_),w!=null&&!isNaN(w)&&(o.height=w);var S=il(i);S&&(o.patternTransform=S);var x=K("pattern","",o,[u]),T=Aa(x),z=n.patternCache,C=z[T];C||(C=n.zrId+"-p"+n.patternIdx++,z[T]=C,o.id=C,x=n.defs[C]=K("pattern",C,o,[u])),t[e]=Gn(C)}}function Jc(r,t,e){var n=e.clipPathCache,i=e.defs,a=n[r.id];if(!a){a=e.zrId+"-c"+e.clipPathIdx++;var o={id:a};n[r.id]=a,i[a]=K("clipPath",a,o,[Ml(r,e)])}t["clip-path"]=Gn(a)}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function jo(r){return document.createTextNode(r)}function Lr(r,t,e){r.insertBefore(t,e)}function Jo(r,t){r.removeChild(t)}function Ko(r,t){r.appendChild(t)}function Nl(r){return r.parentNode}function Il(r){return r.nextSibling}function Ri(r,t){r.textContent=t}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Qo=58,Kc=120,Qc=K("","");function pa(r){return r===void 0}function Gt(r){return r!==void 0}function tp(r,t,e){for(var n={},i=t;i<=e;++i){var a=r[i].key;a!==void 0&&(n[a]!=null&&console.error("Duplicate key "+a),n[a]=i)}return n}function _e(r,t){var e=r.key===t.key,n=r.tag===t.tag;return n&&e}function Oe(r){var t,e=r.children,n=r.tag;if(Gt(n)){var i=r.elm=wl(n);if(Da(Qc,r),Re(e))for(t=0;t<e.length;++t){var a=e[t];a!=null&&Ko(i,Oe(a))}else Gt(r.text)&&!tr(r.text)&&Ko(i,jo(r.text))}else r.elm=jo(r.text);return r.elm}function Bl(r,t,e,n,i){for(;n<=i;++n){var a=e[n];a!=null&&Lr(r,Oe(a),t)}}function Mn(r,t,e,n){for(;e<=n;++e){var i=t[e];if(i!=null)if(Gt(i.tag)){var a=Nl(i.elm);Jo(a,i.elm)}else Jo(r,i.elm)}}function Da(r,t){var e,n=t.elm,i=r&&r.attrs||{},a=t.attrs||{};if(i!==a){for(e in a){var o=a[e],s=i[e];s!==o&&(o===!0?n.setAttribute(e,""):o===!1?n.removeAttribute(e):e.charCodeAt(0)!==Kc?n.setAttribute(e,o):e==="xmlns:xlink"||e==="xmlns"?n.setAttributeNS(vc,e,o):e.charCodeAt(3)===Qo?n.setAttributeNS(gc,e,o):e.charCodeAt(5)===Qo?n.setAttributeNS(_l,e,o):n.setAttribute(e,o))}for(e in i)e in a||n.removeAttribute(e)}}function rp(r,t,e){for(var n=0,i=0,a=t.length-1,o=t[0],s=t[a],l=e.length-1,h=e[0],f=e[l],u,c,p,d;n<=a&&i<=l;)o==null?o=t[++n]:s==null?s=t[--a]:h==null?h=e[++i]:f==null?f=e[--l]:_e(o,h)?(Xr(o,h),o=t[++n],h=e[++i]):_e(s,f)?(Xr(s,f),s=t[--a],f=e[--l]):_e(o,f)?(Xr(o,f),Lr(r,o.elm,Il(s.elm)),o=t[++n],f=e[--l]):_e(s,h)?(Xr(s,h),Lr(r,s.elm,o.elm),s=t[--a],h=e[++i]):(pa(u)&&(u=tp(t,n,a)),c=u[h.key],pa(c)?Lr(r,Oe(h),o.elm):(p=t[c],p.tag!==h.tag?Lr(r,Oe(h),o.elm):(Xr(p,h),t[c]=void 0,Lr(r,p.elm,o.elm))),h=e[++i]);(n<=a||i<=l)&&(n>a?(d=e[l+1]==null?null:e[l+1].elm,Bl(r,d,e,i,l)):Mn(r,t,n,a))}function Xr(r,t){var e=t.elm=r.elm,n=r.children,i=t.children;r!==t&&(Da(r,t),pa(t.text)?Gt(n)&&Gt(i)?n!==i&&rp(e,n,i):Gt(i)?(Gt(r.text)&&Ri(e,""),Bl(e,null,i,0,i.length-1)):Gt(n)?Mn(e,n,0,n.length-1):Gt(r.text)&&Ri(e,""):r.text!==t.text&&(Gt(n)&&Mn(e,n,0,n.length-1),Ri(e,t.text)))}function ep(r,t){if(_e(r,t))Xr(r,t);else{var e=r.elm,n=Nl(e);Oe(t),n!==null&&(Lr(n,t.elm,Il(e)),Mn(n,[r],0,0))}return t}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var np=0,ip=function(){function r(t,e,n){if(this.type="svg",this.refreshHover=ts("refreshHover"),this.configLayer=ts("configLayer"),this.storage=e,this._opts=n=G({},n),this.root=t,this._id="zr"+np++,this._oldVNode=Mo(n.width,n.height),t&&!n.ssr){var i=this._viewport=document.createElement("div");i.style.cssText="position:relative;overflow:hidden";var a=this._svgDom=this._oldVNode.elm=wl("svg");Da(null,this._oldVNode),i.appendChild(a),t.appendChild(i)}this.resize(n.width,n.height)}return r.prototype.getType=function(){return this.type},r.prototype.getViewportRoot=function(){return this._viewport},r.prototype.getViewportRootOffset=function(){var t=this.getViewportRoot();if(t)return{offsetLeft:t.offsetLeft||0,offsetTop:t.offsetTop||0}},r.prototype.getSvgDom=function(){return this._svgDom},r.prototype.refresh=function(){if(this.root){var t=this.renderToVNode({willUpdate:!0});t.attrs.style="position:absolute;left:0;top:0;user-select:none",ep(this._oldVNode,t),this._oldVNode=t}},r.prototype.renderOneToVNode=function(t){return Vo(t,ca(this._id))},r.prototype.renderToVNode=function(t){t=t||{};var e=this.storage.getDisplayList(!0),n=this._width,i=this._height,a=ca(this._id);a.animation=t.animation,a.willUpdate=t.willUpdate,a.compress=t.compress;var o=[],s=this._bgVNode=ap(n,i,this._backgroundColor,a);s&&o.push(s);var l=t.compress?null:this._mainVNode=K("g","main",{},[]);this._paintList(e,a,l?l.children:o),l&&o.push(l);var h=dt(q(a.defs),function(c){return a.defs[c]});if(h.length&&o.push(K("defs","defs",{},h)),t.animation){var f=_c(a.cssNodes,a.cssAnims,{newline:!0});if(f){var u=K("style","stl",{},[],f);o.push(u)}}return Mo(n,i,o,t.useViewBox)},r.prototype.renderToString=function(t){return t=t||{},Aa(this.renderToVNode({animation:j(t.cssAnimation,!0),willUpdate:!1,compress:!0,useViewBox:j(t.useViewBox,!0)}),{newline:!0})},r.prototype.setBackgroundColor=function(t){this._backgroundColor=t},r.prototype.getSvgRoot=function(){return this._mainVNode&&this._mainVNode.elm},r.prototype._paintList=function(t,e,n){for(var i=t.length,a=[],o=0,s,l,h=0,f=0;f<i;f++){var u=t[f];if(!u.invisible){var c=u.__clipPaths,p=c&&c.length||0,d=l&&l.length||0,g=void 0;for(g=Math.max(p-1,d-1);g>=0&&!(c&&l&&c[g]===l[g]);g--);for(var y=d-1;y>g;y--)o--,s=a[o-1];for(var v=g+1;v<p;v++){var m={};Jc(c[v],m,e);var _=K("g","clip-g-"+h++,m,[]);(s?s.children:n).push(_),a[o++]=_,s=_}l=c;var w=Vo(u,e);w&&(s?s.children:n).push(w)}}},r.prototype.resize=function(t,e){var n=this._opts,i=this.root,a=this._viewport;if(t!=null&&(n.width=t),e!=null&&(n.height=e),i&&a&&(a.style.display="none",t=Yr(i,0,n),e=Yr(i,1,n),a.style.display=""),this._width!==t||this._height!==e){if(this._width=t,this._height=e,a){var o=a.style;o.width=t+"px",o.height=e+"px"}if(ka(this._backgroundColor))this.refresh();else{var s=this._svgDom;s&&(s.setAttribute("width",t),s.setAttribute("height",e));var l=this._bgVNode&&this._bgVNode.elm;l&&(l.setAttribute("width",t),l.setAttribute("height",e))}}},r.prototype.getWidth=function(){return this._width},r.prototype.getHeight=function(){return this._height},r.prototype.dispose=function(){this.root&&(this.root.innerHTML=""),this._svgDom=this._viewport=this.storage=this._oldVNode=this._bgVNode=this._mainVNode=null},r.prototype.clear=function(){this._svgDom&&(this._svgDom.innerHTML=null),this._oldVNode=null},r.prototype.toDataURL=function(t){var e=this.renderToString(),n="data:image/svg+xml;";return t?(e=$f(e),e&&n+"base64,"+e):n+"charset=UTF-8,"+encodeURIComponent(e)},r}();function ts(r){return function(){rr('In SVG mode painter not support method "'+r+'"')}}function ap(r,t,e,n){var i;if(e&&e!=="none")if(i=K("rect","bg",{width:r,height:t,x:"0",y:"0",id:"0"}),el(e))Ol({fill:e},i.attrs,"fill",n);else if(ka(e))Dl({style:{fill:e},dirty:Mr,getBoundingRect:function(){return{width:r,height:t}}},i.attrs,"fill",n);else{var a=Le(e),o=a.color,s=a.opacity;i.attrs.fill=o,s<1&&(i.attrs["fill-opacity"]=s)}return i}var op=ip;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */const nt=r=>{const{rotation:t=0,originX:e=0,originY:n=0,scaleX:i=1,scaleY:a=1,culling:o=!1,cursor:s="pointer",draggable:l=!1,invisible:h=!1,progressive:f=-1,rectHover:u=!1,silent:c=!1,z:p=0,z2:d=0,zlevel:g=0,...y}=r||{};return{common:{rotation:Math.PI/180*t,originX:e,originY:n,scaleX:i,scaleY:a,culling:o,cursor:s,draggable:l,invisible:h,progressive:f,rectHover:u,silent:c,z:p,z2:d,zlevel:g},other:y}};/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var sp={},lp=function(){function r(){this.x1=0,this.y1=0,this.x2=0,this.y2=0,this.percent=1}return r}(),Fl=function(r){U(t,r);function t(e){return r.call(this,e)||this}return t.prototype.getDefaultStyle=function(){return{stroke:"#000",fill:null}},t.prototype.getDefaultShape=function(){return new lp},t.prototype.buildPath=function(e,n){var i,a,o,s;if(this.subPixelOptimize){var l=Dc(sp,n,this.style);i=l.x1,a=l.y1,o=l.x2,s=l.y2}else i=n.x1,a=n.y1,o=n.x2,s=n.y2;var h=n.percent;h!==0&&(e.moveTo(i,a),h<1&&(o=i*(1-h)+o*h,s=a*(1-h)+s*h),e.lineTo(o,s))},t.prototype.pointAt=function(e){var n=this.shape;return[n.x1*(1-e)+n.x2*e,n.y1*(1-e)+n.y2*e]},t}(Q);Fl.prototype.type="line";var hp=Fl;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function rs(r){const{common:t,other:e}=nt(r),{x1:n=0,y1:i=0,x2:a=0,y2:o=0,percent:s=1,...l}=e;return new hp({...t,shape:{x1:n,y1:i,x2:a,y2:o,percent:s},style:{lineWidth:1,lineCap:"square",stroke:"#0f0",...l}})}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function fp(r){const{common:t,other:e}=nt(r),{x:n=0,y:i=0,width:a=0,height:o=0,...s}=e;return new Cl({...t,shape:{x:n,y:i,width:a,height:o},style:{fill:"none",stroke:"#fff",...s}})}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var up=function(){function r(){this.cx=0,this.cy=0,this.r=0}return r}(),Wl=function(r){U(t,r);function t(e){return r.call(this,e)||this}return t.prototype.getDefaultShape=function(){return new up},t.prototype.buildPath=function(e,n){e.moveTo(n.cx+n.r,n.cy),e.arc(n.cx,n.cy,n.r,0,Math.PI*2)},t}(Q);Wl.prototype.type="circle";var cp=Wl;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function pp(r){const{common:t,other:e}=nt(r),{r:n=0,cx:i=0,cy:a=0,...o}=e;return new cp({...t,shape:{cx:i,cy:a,r:n},style:{fill:"none",stroke:"#00f",...o}})}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var dp=function(){function r(){this.cx=0,this.cy=0,this.r=0,this.startAngle=0,this.endAngle=Math.PI*2,this.clockwise=!0}return r}(),Hl=function(r){U(t,r);function t(e){return r.call(this,e)||this}return t.prototype.getDefaultStyle=function(){return{stroke:"#000",fill:null}},t.prototype.getDefaultShape=function(){return new dp},t.prototype.buildPath=function(e,n){var i=n.cx,a=n.cy,o=Math.max(n.r,0),s=n.startAngle,l=n.endAngle,h=n.clockwise,f=Math.cos(s),u=Math.sin(s);e.moveTo(f*o+i,u*o+a),e.arc(i,a,o,s,l,!h)},t}(Q);Hl.prototype.type="arc";var vp=Hl;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function gp(r){const{common:t,other:e}=nt(r),{r:n=0,cx:i=0,cy:a=0,startAngle:o=0,endAngle:s=360,clockwise:l=!0,...h}=e;return new vp({...t,shape:{cx:i,cy:a,r:n,startAngle:Math.PI/180*o,endAngle:Math.PI/180*s,clockwise:l},style:{fill:"none",stroke:"#fff",...h}})}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function yp(r,t,e,n){var i=[],a=[],o=[],s=[],l,h,f,u;if(n){f=[1/0,1/0],u=[-1/0,-1/0];for(var c=0,p=r.length;c<p;c++)qr(f,f,r[c]),Zr(u,u,r[c]);qr(f,f,n[0]),Zr(u,u,n[1])}for(var c=0,p=r.length;c<p;c++){var d=r[c];if(e)l=r[c?c-1:p-1],h=r[(c+1)%p];else if(c===0||c===p-1){i.push(_f(r[c]));continue}else l=r[c-1],h=r[c+1];wf(a,h,l),ni(a,a,t);var g=Qi(d,l),y=Qi(d,h),v=g+y;v!==0&&(g/=v,y/=v),ni(o,a,-g),ni(s,a,y);var m=ja([],d,o),_=ja([],d,s);n&&(Zr(m,m,f),qr(m,m,u),Zr(_,_,f),qr(_,_,u)),i.push(m),i.push(_)}return e&&i.push(i.shift()),i}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function Gl(r,t,e){var n=t.smooth,i=t.points;if(i&&i.length>=2){if(n){var a=yp(i,n,e,t.smoothConstraint);r.moveTo(i[0][0],i[0][1]);for(var o=i.length,s=0;s<(e?o:o-1);s++){var l=a[s*2],h=a[s*2+1],f=i[(s+1)%o];r.bezierCurveTo(l[0],l[1],h[0],h[1],f[0],f[1])}}else{r.moveTo(i[0][0],i[0][1]);for(var s=1,u=i.length;s<u;s++)r.lineTo(i[s][0],i[s][1])}e&&r.closePath()}}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var mp=function(){function r(){this.points=null,this.smooth=0,this.smoothConstraint=null}return r}(),Ul=function(r){U(t,r);function t(e){return r.call(this,e)||this}return t.prototype.getDefaultShape=function(){return new mp},t.prototype.buildPath=function(e,n){Gl(e,n,!0)},t}(Q);Ul.prototype.type="polygon";var $l=Ul;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var _p=function(){function r(){this.points=null,this.percent=1,this.smooth=0,this.smoothConstraint=null}return r}(),Xl=function(r){U(t,r);function t(e){return r.call(this,e)||this}return t.prototype.getDefaultStyle=function(){return{stroke:"#000",fill:null}},t.prototype.getDefaultShape=function(){return new _p},t.prototype.buildPath=function(e,n){Gl(e,n,!1)},t}(Q);Xl.prototype.type="polyline";var Yl=Xl;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function wp(r){const{common:t,other:e}=nt(r),{paths:n=[],isClose:i=!0,...a}=e,o=i?$l:Yl;return new xl({...t,shape:{paths:[new o({shape:{points:n}})]},style:{fill:"none",stroke:"#fff",...a}})}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function xp(r){const{common:t,other:e}=nt(r),{points:n=[]}=e;return new $l({...t,shape:{points:n},style:{fill:"none",stroke:"#0f0",...r}})}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function bp(r){const{common:t,other:e}=nt(r),{points:n=[]}=e;return new Yl({...t,shape:{points:n},style:{fill:"none",stroke:"#0f0",...r}})}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function Tp(r){const{common:t,other:e}=nt(r),{text:n,x:i=0,y:a=0,...o}=e;return new Uc({...t,style:{x:i,y:a,text:n,fill:"#fff",stroke:"none",fontSize:16,fontWeight:400,...o}})}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var pt=[],Sp=function(){function r(){this.x1=0,this.y1=0,this.x2=0,this.y2=0,this.cpx1=0,this.cpy1=0,this.percent=1}return r}();function es(r,t,e){var n=r.cpx2,i=r.cpy2;return n!=null||i!=null?[(e?ro:et)(r.x1,r.cpx1,r.cpx2,r.x2,t),(e?ro:et)(r.y1,r.cpy1,r.cpy2,r.y2,t)]:[(e?eo:st)(r.x1,r.cpx1,r.x2,t),(e?eo:st)(r.y1,r.cpy1,r.y2,t)]}var ql=function(r){U(t,r);function t(e){return r.call(this,e)||this}return t.prototype.getDefaultStyle=function(){return{stroke:"#000",fill:null}},t.prototype.getDefaultShape=function(){return new Sp},t.prototype.buildPath=function(e,n){var i=n.x1,a=n.y1,o=n.x2,s=n.y2,l=n.cpx1,h=n.cpy1,f=n.cpx2,u=n.cpy2,c=n.percent;c!==0&&(e.moveTo(i,a),f==null||u==null?(c<1&&(kn(i,l,o,c,pt),l=pt[1],o=pt[2],kn(a,h,s,c,pt),h=pt[1],s=pt[2]),e.quadraticCurveTo(l,h,o,s)):(c<1&&(zn(i,l,f,o,c,pt),l=pt[1],f=pt[2],o=pt[3],zn(a,h,u,s,c,pt),h=pt[1],u=pt[2],s=pt[3]),e.bezierCurveTo(l,h,f,u,o,s)))},t.prototype.pointAt=function(e){return es(this.shape,e,!1)},t.prototype.tangentAt=function(e){var n=es(this.shape,e,!0);return Tf(n,n)},t}(Q);ql.prototype.type="bezier-curve";var zp=ql;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function kp(r){const{common:t,other:e}=nt(r),{x1:n,y1:i,x2:a,y2:o,cpx1:s,cpy1:l,cpx2:h,cpy2:f,percent:u=1,...c}=e;return new zp({...t,shape:{x1:n,y1:i,x2:a,y2:o,cpx1:s,cpy1:l,cpx2:h,cpy2:f,percent:u},style:{fill:"none",stroke:"#0f0",...c}})}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Zl=Math.PI,Pi=Zl*2,Cr=Math.sin,Hr=Math.cos,Cp=Math.acos,ot=Math.atan2,ns=Math.abs,Ce=Math.sqrt,we=Math.max,Ht=Math.min,Mt=1e-4;function Rp(r,t,e,n,i,a,o,s){var l=e-r,h=n-t,f=o-i,u=s-a,c=u*l-f*h;if(!(c*c<Mt))return c=(f*(t-a)-u*(r-i))/c,[r+c*l,t+c*h]}function ln(r,t,e,n,i,a,o){var s=r-e,l=t-n,h=(o?a:-a)/Ce(s*s+l*l),f=h*l,u=-h*s,c=r+f,p=t+u,d=e+f,g=n+u,y=(c+d)/2,v=(p+g)/2,m=d-c,_=g-p,w=m*m+_*_,S=i-a,x=c*g-d*p,T=(_<0?-1:1)*Ce(we(0,S*S*w-x*x)),z=(x*_-m*T)/w,C=(-x*m-_*T)/w,k=(x*_+m*T)/w,P=(-x*m+_*T)/w,E=z-y,A=C-v,L=k-y,M=P-v;return E*E+A*A>L*L+M*M&&(z=k,C=P),{cx:z,cy:C,x0:-f,y0:-u,x1:z*(i/S-1),y1:C*(i/S-1)}}function Pp(r){var t;if(Re(r)){var e=r.length;if(!e)return r;e===1?t=[r[0],r[0],0,0]:e===2?t=[r[0],r[0],r[1],r[1]]:e===3?t=r.concat(r[2]):t=r}else t=[r,r,r,r];return t}function Lp(r,t){var e,n=we(t.r,0),i=we(t.r0||0,0),a=n>0,o=i>0;if(!(!a&&!o)){if(a||(n=i,i=0),i>n){var s=n;n=i,i=s}var l=t.startAngle,h=t.endAngle;if(!(isNaN(l)||isNaN(h))){var f=t.cx,u=t.cy,c=!!t.clockwise,p=ns(h-l),d=p>Pi&&p%Pi;if(d>Mt&&(p=d),!(n>Mt))r.moveTo(f,u);else if(p>Pi-Mt)r.moveTo(f+n*Hr(l),u+n*Cr(l)),r.arc(f,u,n,l,h,!c),i>Mt&&(r.moveTo(f+i*Hr(h),u+i*Cr(h)),r.arc(f,u,i,h,l,c));else{var g=void 0,y=void 0,v=void 0,m=void 0,_=void 0,w=void 0,S=void 0,x=void 0,T=void 0,z=void 0,C=void 0,k=void 0,P=void 0,E=void 0,A=void 0,L=void 0,M=n*Hr(l),R=n*Cr(l),O=i*Hr(h),$=i*Cr(h),H=p>Mt;if(H){var X=t.cornerRadius;X&&(e=Pp(X),g=e[0],y=e[1],v=e[2],m=e[3]);var it=ns(n-i)/2;if(_=Ht(it,v),w=Ht(it,m),S=Ht(it,g),x=Ht(it,y),C=T=we(_,w),k=z=we(S,x),(T>Mt||z>Mt)&&(P=n*Hr(h),E=n*Cr(h),A=i*Hr(l),L=i*Cr(l),p<Zl)){var W=Rp(M,R,A,L,P,E,O,$);if(W){var rt=M-W[0],at=R-W[1],yt=P-W[0],Lt=E-W[1],Zt=1/Cr(Cp((rt*yt+at*Lt)/(Ce(rt*rt+at*at)*Ce(yt*yt+Lt*Lt)))/2),Et=Ce(W[0]*W[0]+W[1]*W[1]);C=Ht(T,(n-Et)/(Zt+1)),k=Ht(z,(i-Et)/(Zt-1))}}}if(!H)r.moveTo(f+M,u+R);else if(C>Mt){var tt=Ht(v,C),V=Ht(m,C),D=ln(A,L,M,R,n,tt,c),N=ln(P,E,O,$,n,V,c);r.moveTo(f+D.cx+D.x0,u+D.cy+D.y0),C<T&&tt===V?r.arc(f+D.cx,u+D.cy,C,ot(D.y0,D.x0),ot(N.y0,N.x0),!c):(tt>0&&r.arc(f+D.cx,u+D.cy,tt,ot(D.y0,D.x0),ot(D.y1,D.x1),!c),r.arc(f,u,n,ot(D.cy+D.y1,D.cx+D.x1),ot(N.cy+N.y1,N.cx+N.x1),!c),V>0&&r.arc(f+N.cx,u+N.cy,V,ot(N.y1,N.x1),ot(N.y0,N.x0),!c))}else r.moveTo(f+M,u+R),r.arc(f,u,n,l,h,!c);if(!(i>Mt)||!H)r.lineTo(f+O,u+$);else if(k>Mt){var tt=Ht(g,k),V=Ht(y,k),D=ln(O,$,P,E,i,-V,c),N=ln(M,R,A,L,i,-tt,c);r.lineTo(f+D.cx+D.x0,u+D.cy+D.y0),k<z&&tt===V?r.arc(f+D.cx,u+D.cy,k,ot(D.y0,D.x0),ot(N.y0,N.x0),!c):(V>0&&r.arc(f+D.cx,u+D.cy,V,ot(D.y0,D.x0),ot(D.y1,D.x1),!c),r.arc(f,u,i,ot(D.cy+D.y1,D.cx+D.x1),ot(N.cy+N.y1,N.cx+N.x1),c),tt>0&&r.arc(f+N.cx,u+N.cy,tt,ot(N.y1,N.x1),ot(N.y0,N.x0),!c))}else r.lineTo(f+O,u+$),r.arc(f,u,i,h,l,c)}r.closePath()}}}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Ep=function(){function r(){this.cx=0,this.cy=0,this.r0=0,this.r=0,this.startAngle=0,this.endAngle=Math.PI*2,this.clockwise=!0,this.cornerRadius=0}return r}(),Vl=function(r){U(t,r);function t(e){return r.call(this,e)||this}return t.prototype.getDefaultShape=function(){return new Ep},t.prototype.buildPath=function(e,n){Lp(e,n)},t.prototype.isZeroArea=function(){return this.shape.startAngle===this.shape.endAngle||this.shape.r===this.shape.r0},t}(Q);Vl.prototype.type="sector";var Ap=Vl;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function Mp(r){const{common:t,other:e}=nt(r),{r:n=0,cx:i=0,cy:a=0,r0:o=0,startAngle:s=0,endAngle:l=0,clockwise:h=!0,...f}=e;return new Ap({...t,shape:{cx:i,cy:a,r:n,r0:o,startAngle:Math.PI/180*s,endAngle:Math.PI/180*l,clockwise:h},style:{fill:"none",stroke:"none",...f}})}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function Op(r){const{common:t,other:e}=nt(r),{x:n=0,y:i=0,width:a=0,height:o=0,image:s="",...l}=e;return new Fe({...t,style:{x:n,y:i,width:a,height:o,image:s,...l}})}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Dp=function(){function r(){this.cx=0,this.cy=0,this.width=0,this.height=0}return r}(),jl=function(r){U(t,r);function t(e){return r.call(this,e)||this}return t.prototype.getDefaultShape=function(){return new Dp},t.prototype.buildPath=function(e,n){var i=n.cx,a=n.cy,o=n.width,s=n.height;e.moveTo(i,a+o),e.bezierCurveTo(i+o,a+o,i+o*3/2,a-o/3,i,a-s),e.bezierCurveTo(i-o*3/2,a-o/3,i-o,a+o,i,a+o),e.closePath()},t}(Q);jl.prototype.type="droplet";var Np=jl;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function Ip(r){const{common:t,other:e}=nt(r),{cx:n=0,cy:i=0,width:a=0,height:o=0,...s}=e;return new Np({...t,shape:{cx:n,cy:i,width:a,height:o},style:{fill:"none",stroke:"#fff",...s}})}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Bp=function(){function r(){this.cx=0,this.cy=0,this.rx=0,this.ry=0}return r}(),Jl=function(r){U(t,r);function t(e){return r.call(this,e)||this}return t.prototype.getDefaultShape=function(){return new Bp},t.prototype.buildPath=function(e,n){var i=.5522848,a=n.cx,o=n.cy,s=n.rx,l=n.ry,h=s*i,f=l*i;e.moveTo(a-s,o),e.bezierCurveTo(a-s,o-f,a-h,o-l,a,o-l),e.bezierCurveTo(a+h,o-l,a+s,o-f,a+s,o),e.bezierCurveTo(a+s,o+f,a+h,o+l,a,o+l),e.bezierCurveTo(a-h,o+l,a-s,o+f,a-s,o),e.closePath()},t}(Q);Jl.prototype.type="ellipse";var Fp=Jl;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function Wp(r){const{common:t,other:e}=nt(r),{cx:n=0,cy:i=0,rx:a=0,ry:o=0,...s}=e;return new Fp({...t,shape:{cx:n,cy:i,rx:a,ry:o},style:{fill:"none",stroke:"#fff",...s}})}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Hp=function(){function r(){this.cx=0,this.cy=0,this.width=0,this.height=0}return r}(),Kl=function(r){U(t,r);function t(e){return r.call(this,e)||this}return t.prototype.getDefaultShape=function(){return new Hp},t.prototype.buildPath=function(e,n){var i=n.cx,a=n.cy,o=n.width,s=n.height;e.moveTo(i,a),e.bezierCurveTo(i+o/2,a-s*2/3,i+o*2,a+s/3,i,a+s),e.bezierCurveTo(i-o*2,a+s/3,i-o/2,a-s*2/3,i,a)},t}(Q);Kl.prototype.type="heart";var Gp=Kl;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function Up(r){const{common:t,other:e}=nt(r),{cx:n=0,cy:i=0,width:a=0,height:o=0,...s}=e;return new Gp({...t,shape:{cx:n,cy:i,width:a,height:o},style:{fill:"none",stroke:"#fff",...s}})}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var is=Math.PI,as=Math.sin,os=Math.cos,$p=function(){function r(){this.x=0,this.y=0,this.r=0,this.n=0}return r}(),Ql=function(r){U(t,r);function t(e){return r.call(this,e)||this}return t.prototype.getDefaultShape=function(){return new $p},t.prototype.buildPath=function(e,n){var i=n.n;if(!(!i||i<2)){var a=n.x,o=n.y,s=n.r,l=2*is/i,h=-is/2;e.moveTo(a+s*os(h),o+s*as(h));for(var f=0,u=i-1;f<u;f++)h+=l,e.lineTo(a+s*os(h),o+s*as(h));e.closePath()}},t}(Q);Ql.prototype.type="isogon";var Xp=Ql;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function Yp(r){const{common:t,other:e}=nt(r),{x:n=0,y:i=0,r:a=0,n:o=0,...s}=e;return new Xp({...t,shape:{x:n,y:i,r:a,n:o},style:{fill:"none",stroke:"#fff",...s}})}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Li=Math.sin,qp=Math.cos,hn=Math.PI/180,Zp=function(){function r(){this.cx=0,this.cy=0,this.r=[],this.k=0,this.n=1}return r}(),th=function(r){U(t,r);function t(e){return r.call(this,e)||this}return t.prototype.getDefaultStyle=function(){return{stroke:"#000",fill:null}},t.prototype.getDefaultShape=function(){return new Zp},t.prototype.buildPath=function(e,n){var i=n.r,a=n.k,o=n.n,s=n.cx,l=n.cy,h,f,u;e.moveTo(s,l);for(var c=0,p=i.length;c<p;c++){u=i[c];for(var d=0;d<=360*o;d++)h=u*Li(a/o*d%360*hn)*qp(d*hn)+s,f=u*Li(a/o*d%360*hn)*Li(d*hn)+l,e.lineTo(h,f)}},t}(Q);th.prototype.type="rose";var Vp=th;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function jp(r){const{common:t,other:e}=nt(r),{cx:n=0,cy:i=0,r:a=[],n:o=1,k:s=0,...l}=e;return new Vp({...t,shape:{cx:n,cy:i,n:o,r:a,k:s},style:{fill:"none",stroke:"#fff",...l}})}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var fn=Math.PI,un=Math.cos,ss=Math.sin,Jp=function(){function r(){this.cx=0,this.cy=0,this.n=3,this.r=0}return r}(),rh=function(r){U(t,r);function t(e){return r.call(this,e)||this}return t.prototype.getDefaultShape=function(){return new Jp},t.prototype.buildPath=function(e,n){var i=n.n;if(!(!i||i<2)){var a=n.cx,o=n.cy,s=n.r,l=n.r0;l==null&&(l=i>4?s*un(2*fn/i)/un(fn/i):s/3);var h=fn/i,f=-fn/2,u=a+s*un(f),c=o+s*ss(f);f+=h,e.moveTo(u,c);for(var p=0,d=i*2-1,g=void 0;p<d;p++)g=p%2===0?l:s,e.lineTo(a+g*un(f),o+g*ss(f)),f+=h;e.closePath()}},t}(Q);rh.prototype.type="star";var Kp=rh;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function Qp(r){const{common:t,other:e}=nt(r),{cx:n=0,cy:i=0,r:a=0,n:o=3,r0:s=0,...l}=e;return new Kp({...t,shape:{cx:n,cy:i,n:o,r:a,r0:s},style:{fill:"none",stroke:"#fff",...l}})}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var eh=(r=>(r[r.left=0]="left",r[r.middle=1]="middle",r[r.right=2]="right",r))(eh||{});function td(r,t,e){const{scaleMin:n=.5,scaleMax:i=100}=e||{};r.on("mousewheel",a=>{a.event.preventDefault();const{scaleX:o,scaleY:s}=t,l=1+a.wheelDelta/5;l<n||l>i||t.animateTo({scaleX:o*l,scaleY:s*l},{duration:100,delay:0,done:()=>{e!=null&&e.callback&&e.callback({scale:t.scaleX,x:t.x,y:t.y})}})})}const rd=r=>{var t;const e=((t=r.dom)==null?void 0:t.getElementsByTagName("canvas"))||[];Array.from(e).forEach(i=>{i.oncontextmenu=a=>{a.preventDefault(),a.stopPropagation()}})};function ed(r,t,e){const n={startX:0,startY:0,canTranslate:!1},{mouse:i="left"}=e||{};r.on("mousedown",o=>{const{clientX:s,clientY:l}=o.event;n.startX=s,n.startY=l,n.canTranslate=o.event.button===eh[i],i==="right"&&rd(r)});function a(o){if(!n.canTranslate)return;const{clientX:s,clientY:l}=o.event,h=s-n.startX,f=l-n.startY,u=t.x+h,c=t.y+f;t.animateTo({x:u,y:c},{duration:100,delay:0,done:()=>{e!=null&&e.callback&&e.callback({scale:t.scaleX,x:t.x,y:t.y})}})}r.on("mouseup",o=>{a(o),n.canTranslate=!1})}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Gr=function(){function r(t,e){this.target=t,this.topTarget=e&&e.topTarget}return r}(),nd=function(){function r(t){this.handler=t,t.on("mousedown",this._dragStart,this),t.on("mousemove",this._drag,this),t.on("mouseup",this._dragEnd,this)}return r.prototype._dragStart=function(t){for(var e=t.target;e&&!e.draggable;)e=e.parent||e.__hostTarget;e&&(this._draggingTarget=e,e.dragging=!0,this._x=t.offsetX,this._y=t.offsetY,this.handler.dispatchToElement(new Gr(e,t),"dragstart",t.event))},r.prototype._drag=function(t){var e=this._draggingTarget;if(e){var n=t.offsetX,i=t.offsetY,a=n-this._x,o=i-this._y;this._x=n,this._y=i,e.drift(a,o,t),this.handler.dispatchToElement(new Gr(e,t),"drag",t.event);var s=this.handler.findHover(n,i,e).target,l=this._dropTarget;this._dropTarget=s,e!==s&&(l&&s!==l&&this.handler.dispatchToElement(new Gr(l,t),"dragleave",t.event),s&&s!==l&&this.handler.dispatchToElement(new Gr(s,t),"dragenter",t.event))}},r.prototype._dragEnd=function(t){var e=this._draggingTarget;e&&(e.dragging=!1),this.handler.dispatchToElement(new Gr(e,t),"dragend",t.event),this._dropTarget&&this.handler.dispatchToElement(new Gr(this._dropTarget,t),"drop",t.event),this._draggingTarget=null,this._dropTarget=null},r}(),id=nd;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var ad=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,Ei=[],od=lt.browser.firefox&&+lt.browser.version.split(".")[0]<39;function da(r,t,e,n){return e=e||{},n?ls(r,t,e):od&&t.layerX!=null&&t.layerX!==t.offsetX?(e.zrX=t.layerX,e.zrY=t.layerY):t.offsetX!=null?(e.zrX=t.offsetX,e.zrY=t.offsetY):ls(r,t,e),e}function ls(r,t,e){if(lt.domSupported&&r.getBoundingClientRect){var n=t.clientX,i=t.clientY;if(yl(r)){var a=r.getBoundingClientRect();e.zrX=n-a.left,e.zrY=i-a.top;return}else if(hc(Ei,r,n,i)){e.zrX=Ei[0],e.zrY=Ei[1];return}}e.zrX=e.zrY=0}function Na(r){return r||window.event}function Ot(r,t,e){if(t=Na(t),t.zrX!=null)return t;var n=t.type,i=n&&n.indexOf("touch")>=0;if(i){var o=n!=="touchend"?t.targetTouches[0]:t.changedTouches[0];o&&da(r,o,t,e)}else{da(r,t,t,e);var a=sd(t);t.zrDelta=a?a/120:-(t.detail||0)/3}var s=t.button;return t.which==null&&s!==void 0&&ad.test(t.type)&&(t.which=s&1?1:s&2?3:s&4?2:0),t}function sd(r){var t=r.wheelDelta;if(t)return t;var e=r.deltaX,n=r.deltaY;if(e==null||n==null)return t;var i=Math.abs(n!==0?n:e),a=n>0?-1:n<0?1:e>0?-1:1;return 3*i*a}function ld(r,t,e,n){r.addEventListener(t,e,n)}function hd(r,t,e,n){r.removeEventListener(t,e,n)}var fd=function(r){r.preventDefault(),r.stopPropagation(),r.cancelBubble=!0};/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var ud=function(){function r(){this._track=[]}return r.prototype.recognize=function(t,e,n){return this._doTrack(t,e,n),this._recognize(t)},r.prototype.clear=function(){return this._track.length=0,this},r.prototype._doTrack=function(t,e,n){var i=t.touches;if(i){for(var a={points:[],touches:[],target:e,event:t},o=0,s=i.length;o<s;o++){var l=i[o],h=da(n,l,{});a.points.push([h.zrX,h.zrY]),a.touches.push(l)}this._track.push(a)}},r.prototype._recognize=function(t){for(var e in Ai)if(Ai.hasOwnProperty(e)){var n=Ai[e](this._track,t);if(n)return n}},r}();function hs(r){var t=r[1][0]-r[0][0],e=r[1][1]-r[0][1];return Math.sqrt(t*t+e*e)}function cd(r){return[(r[0][0]+r[1][0])/2,(r[0][1]+r[1][1])/2]}var Ai={pinch:function(r,t){var e=r.length;if(e){var n=(r[e-1]||{}).points,i=(r[e-2]||{}).points||n;if(i&&i.length>1&&n&&n.length>1){var a=hs(n)/hs(i);!isFinite(a)&&(a=1),t.pinchScale=a;var o=cd(n);return t.pinchX=o[0],t.pinchY=o[1],{type:"pinch",target:r[0].target,event:t}}}}};/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var nh="silent";function pd(r,t,e){return{type:r,event:e,target:t.target,topTarget:t.topTarget,cancelBubble:!1,offsetX:e.zrX,offsetY:e.zrY,gestureEvent:e.gestureEvent,pinchX:e.pinchX,pinchY:e.pinchY,pinchScale:e.pinchScale,wheelDelta:e.zrDelta,zrByTouch:e.zrByTouch,which:e.which,stop:dd}}function dd(){fd(this.event)}var vd=function(r){U(t,r);function t(){var e=r!==null&&r.apply(this,arguments)||this;return e.handler=null,e}return t.prototype.dispose=function(){},t.prototype.setCursor=function(){},t}(ee),fe=function(){function r(t,e){this.x=t,this.y=e}return r}(),gd=["click","dblclick","mousewheel","mouseout","mouseup","mousedown","mousemove","contextmenu"],Mi=new Z(0,0,0,0),ih=function(r){U(t,r);function t(e,n,i,a,o){var s=r.call(this)||this;return s._hovered=new fe(0,0),s.storage=e,s.painter=n,s.painterRoot=a,s._pointerSize=o,i=i||new vd,s.proxy=null,s.setHandlerProxy(i),s._draggingMgr=new id(s),s}return t.prototype.setHandlerProxy=function(e){this.proxy&&this.proxy.dispose(),e&&(_t(gd,function(n){e.on&&e.on(n,this[n],this)},this),e.handler=this),this.proxy=e},t.prototype.mousemove=function(e){var n=e.zrX,i=e.zrY,a=ah(this,n,i),o=this._hovered,s=o.target;s&&!s.__zr&&(o=this.findHover(o.x,o.y),s=o.target);var l=this._hovered=a?new fe(n,i):this.findHover(n,i),h=l.target,f=this.proxy;f.setCursor&&f.setCursor(h?h.cursor:"default"),s&&h!==s&&this.dispatchToElement(o,"mouseout",e),this.dispatchToElement(l,"mousemove",e),h&&h!==s&&this.dispatchToElement(l,"mouseover",e)},t.prototype.mouseout=function(e){var n=e.zrEventControl;n!=="only_globalout"&&this.dispatchToElement(this._hovered,"mouseout",e),n!=="no_globalout"&&this.trigger("globalout",{type:"globalout",event:e})},t.prototype.resize=function(){this._hovered=new fe(0,0)},t.prototype.dispatch=function(e,n){var i=this[e];i&&i.call(this,n)},t.prototype.dispose=function(){this.proxy.dispose(),this.storage=null,this.proxy=null,this.painter=null},t.prototype.setCursorStyle=function(e){var n=this.proxy;n.setCursor&&n.setCursor(e)},t.prototype.dispatchToElement=function(e,n,i){e=e||{};var a=e.target;if(!(a&&a.silent)){for(var o="on"+n,s=pd(n,e,i);a&&(a[o]&&(s.cancelBubble=!!a[o].call(a,s)),a.trigger(n,s),a=a.__hostTarget?a.__hostTarget:a.parent,!s.cancelBubble););s.cancelBubble||(this.trigger(n,s),this.painter&&this.painter.eachOtherLayer&&this.painter.eachOtherLayer(function(l){typeof l[o]=="function"&&l[o].call(l,s),l.trigger&&l.trigger(n,s)}))}},t.prototype.findHover=function(e,n,i){var a=this.storage.getDisplayList(),o=new fe(e,n);if(fs(a,o,e,n,i),this._pointerSize&&!o.target){for(var s=[],l=this._pointerSize,h=l/2,f=new Z(e-h,n-h,l,l),u=a.length-1;u>=0;u--){var c=a[u];c!==i&&!c.ignore&&!c.ignoreCoarsePointer&&(!c.parent||!c.parent.ignoreCoarsePointer)&&(Mi.copy(c.getBoundingRect()),c.transform&&Mi.applyTransform(c.transform),Mi.intersect(f)&&s.push(c))}if(s.length)for(var p=4,d=Math.PI/12,g=Math.PI*2,y=0;y<h;y+=p)for(var v=0;v<g;v+=d){var m=e+y*Math.cos(v),_=n+y*Math.sin(v);if(fs(s,o,m,_,i),o.target)return o}}return o},t.prototype.processGesture=function(e,n){this._gestureMgr||(this._gestureMgr=new ud);var i=this._gestureMgr;n==="start"&&i.clear();var a=i.recognize(e,this.findHover(e.zrX,e.zrY,null).target,this.proxy.dom);if(n==="end"&&i.clear(),a){var o=a.type;e.gestureEvent=o;var s=new fe;s.target=a.target,this.dispatchToElement(s,o,a.event)}},t}(ee);_t(["click","mousedown","mouseup","mousewheel","dblclick","contextmenu"],function(r){ih.prototype[r]=function(t){var e=t.zrX,n=t.zrY,i=ah(this,e,n),a,o;if((r!=="mouseup"||!i)&&(a=this.findHover(e,n),o=a.target),r==="mousedown")this._downEl=o,this._downPoint=[t.zrX,t.zrY],this._upEl=o;else if(r==="mouseup")this._upEl=o;else if(r==="click"){if(this._downEl!==this._upEl||!this._downPoint||Sf(this._downPoint,[t.zrX,t.zrY])>4)return;this._downPoint=null}this.dispatchToElement(a,r,t)}});function yd(r,t,e){if(r[r.rectHover?"rectContain":"contain"](t,e)){for(var n=r,i=void 0,a=!1;n;){if(n.ignoreClip&&(a=!0),!a){var o=n.getClipPath();if(o&&!o.contain(t,e))return!1;n.silent&&(i=!0)}var s=n.__hostTarget;n=s||n.parent}return i?nh:!0}return!1}function fs(r,t,e,n,i){for(var a=r.length-1;a>=0;a--){var o=r[a],s=void 0;if(o!==i&&!o.ignore&&(s=yd(o,e,n))&&(!t.topTarget&&(t.topTarget=o),s!==nh)){t.target=o;break}}}function ah(r,t,e){var n=r.painter;return t<0||t>n.getWidth()||e<0||e>n.getHeight()}var md=ih;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var oh=32,ue=7;function _d(r){for(var t=0;r>=oh;)t|=r&1,r>>=1;return r+t}function us(r,t,e,n){var i=t+1;if(i===e)return 1;if(n(r[i++],r[t])<0){for(;i<e&&n(r[i],r[i-1])<0;)i++;wd(r,t,i)}else for(;i<e&&n(r[i],r[i-1])>=0;)i++;return i-t}function wd(r,t,e){for(e--;t<e;){var n=r[t];r[t++]=r[e],r[e--]=n}}function cs(r,t,e,n,i){for(n===t&&n++;n<e;n++){for(var a=r[n],o=t,s=n,l;o<s;)l=o+s>>>1,i(a,r[l])<0?s=l:o=l+1;var h=n-o;switch(h){case 3:r[o+3]=r[o+2];case 2:r[o+2]=r[o+1];case 1:r[o+1]=r[o];break;default:for(;h>0;)r[o+h]=r[o+h-1],h--}r[o]=a}}function Oi(r,t,e,n,i,a){var o=0,s=0,l=1;if(a(r,t[e+i])>0){for(s=n-i;l<s&&a(r,t[e+i+l])>0;)o=l,l=(l<<1)+1,l<=0&&(l=s);l>s&&(l=s),o+=i,l+=i}else{for(s=i+1;l<s&&a(r,t[e+i-l])<=0;)o=l,l=(l<<1)+1,l<=0&&(l=s);l>s&&(l=s);var h=o;o=i-l,l=i-h}for(o++;o<l;){var f=o+(l-o>>>1);a(r,t[e+f])>0?o=f+1:l=f}return l}function Di(r,t,e,n,i,a){var o=0,s=0,l=1;if(a(r,t[e+i])<0){for(s=i+1;l<s&&a(r,t[e+i-l])<0;)o=l,l=(l<<1)+1,l<=0&&(l=s);l>s&&(l=s);var h=o;o=i-l,l=i-h}else{for(s=n-i;l<s&&a(r,t[e+i+l])>=0;)o=l,l=(l<<1)+1,l<=0&&(l=s);l>s&&(l=s),o+=i,l+=i}for(o++;o<l;){var f=o+(l-o>>>1);a(r,t[e+f])<0?l=f:o=f+1}return l}function xd(r,t){var e=ue,n,i,a=0;r.length;var o=[];n=[],i=[];function s(p,d){n[a]=p,i[a]=d,a+=1}function l(){for(;a>1;){var p=a-2;if(p>=1&&i[p-1]<=i[p]+i[p+1]||p>=2&&i[p-2]<=i[p]+i[p-1])i[p-1]<i[p+1]&&p--;else if(i[p]>i[p+1])break;f(p)}}function h(){for(;a>1;){var p=a-2;p>0&&i[p-1]<i[p+1]&&p--,f(p)}}function f(p){var d=n[p],g=i[p],y=n[p+1],v=i[p+1];i[p]=g+v,p===a-3&&(n[p+1]=n[p+2],i[p+1]=i[p+2]),a--;var m=Di(r[y],r,d,g,0,t);d+=m,g-=m,g!==0&&(v=Oi(r[d+g-1],r,y,v,v-1,t),v!==0&&(g<=v?u(d,g,y,v):c(d,g,y,v)))}function u(p,d,g,y){var v=0;for(v=0;v<d;v++)o[v]=r[p+v];var m=0,_=g,w=p;if(r[w++]=r[_++],--y===0){for(v=0;v<d;v++)r[w+v]=o[m+v];return}if(d===1){for(v=0;v<y;v++)r[w+v]=r[_+v];r[w+y]=o[m];return}for(var S=e,x,T,z;;){x=0,T=0,z=!1;do if(t(r[_],o[m])<0){if(r[w++]=r[_++],T++,x=0,--y===0){z=!0;break}}else if(r[w++]=o[m++],x++,T=0,--d===1){z=!0;break}while((x|T)<S);if(z)break;do{if(x=Di(r[_],o,m,d,0,t),x!==0){for(v=0;v<x;v++)r[w+v]=o[m+v];if(w+=x,m+=x,d-=x,d<=1){z=!0;break}}if(r[w++]=r[_++],--y===0){z=!0;break}if(T=Oi(o[m],r,_,y,0,t),T!==0){for(v=0;v<T;v++)r[w+v]=r[_+v];if(w+=T,_+=T,y-=T,y===0){z=!0;break}}if(r[w++]=o[m++],--d===1){z=!0;break}S--}while(x>=ue||T>=ue);if(z)break;S<0&&(S=0),S+=2}if(e=S,e<1&&(e=1),d===1){for(v=0;v<y;v++)r[w+v]=r[_+v];r[w+y]=o[m]}else{if(d===0)throw new Error;for(v=0;v<d;v++)r[w+v]=o[m+v]}}function c(p,d,g,y){var v=0;for(v=0;v<y;v++)o[v]=r[g+v];var m=p+d-1,_=y-1,w=g+y-1,S=0,x=0;if(r[w--]=r[m--],--d===0){for(S=w-(y-1),v=0;v<y;v++)r[S+v]=o[v];return}if(y===1){for(w-=d,m-=d,x=w+1,S=m+1,v=d-1;v>=0;v--)r[x+v]=r[S+v];r[w]=o[_];return}for(var T=e;;){var z=0,C=0,k=!1;do if(t(o[_],r[m])<0){if(r[w--]=r[m--],z++,C=0,--d===0){k=!0;break}}else if(r[w--]=o[_--],C++,z=0,--y===1){k=!0;break}while((z|C)<T);if(k)break;do{if(z=d-Di(o[_],r,p,d,d-1,t),z!==0){for(w-=z,m-=z,d-=z,x=w+1,S=m+1,v=z-1;v>=0;v--)r[x+v]=r[S+v];if(d===0){k=!0;break}}if(r[w--]=o[_--],--y===1){k=!0;break}if(C=y-Oi(r[m],o,0,y,y-1,t),C!==0){for(w-=C,_-=C,y-=C,x=w+1,S=_+1,v=0;v<C;v++)r[x+v]=o[S+v];if(y<=1){k=!0;break}}if(r[w--]=r[m--],--d===0){k=!0;break}T--}while(z>=ue||C>=ue);if(k)break;T<0&&(T=0),T+=2}if(e=T,e<1&&(e=1),y===1){for(w-=d,m-=d,x=w+1,S=m+1,v=d-1;v>=0;v--)r[x+v]=r[S+v];r[w]=o[_]}else{if(y===0)throw new Error;for(S=w-(y-1),v=0;v<y;v++)r[S+v]=o[v]}}return{mergeRuns:l,forceMergeRuns:h,pushRun:s}}function bd(r,t,e,n){e||(e=0),n||(n=r.length);var i=n-e;if(!(i<2)){var a=0;if(i<oh){a=us(r,e,n,t),cs(r,e,n,e+a,t);return}var o=xd(r,t),s=_d(i);do{if(a=us(r,e,n,t),a<s){var l=i;l>s&&(l=s),cs(r,e,e+l,e+a,t),a=l}o.pushRun(e,a),o.mergeRuns(),i-=a,e+=a}while(i!==0);o.forceMergeRuns()}}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var ps=!1;function Ni(){ps||(ps=!0,console.warn("z / z2 / zlevel of displayable is invalid, which may cause unexpected errors"))}function ds(r,t){return r.zlevel===t.zlevel?r.z===t.z?r.z2-t.z2:r.z-t.z:r.zlevel-t.zlevel}var Td=function(){function r(){this._roots=[],this._displayList=[],this._displayListLen=0,this.displayableSortFunc=ds}return r.prototype.traverse=function(t,e){for(var n=0;n<this._roots.length;n++)this._roots[n].traverse(t,e)},r.prototype.getDisplayList=function(t,e){e=e||!1;var n=this._displayList;return(t||!n.length)&&this.updateDisplayList(e),n},r.prototype.updateDisplayList=function(t){this._displayListLen=0;for(var e=this._roots,n=this._displayList,i=0,a=e.length;i<a;i++)this._updateAndAddDisplayable(e[i],null,t);n.length=this._displayListLen,bd(n,ds)},r.prototype._updateAndAddDisplayable=function(t,e,n){if(!(t.ignore&&!n)){t.beforeUpdate(),t.update(),t.afterUpdate();var i=t.getClipPath();if(t.ignoreClip)e=null;else if(i){e?e=e.slice():e=[];for(var a=i,o=t;a;)a.parent=o,a.updateTransform(),e.push(a),o=a,a=a.getClipPath()}if(t.childrenRef){for(var s=t.childrenRef(),l=0;l<s.length;l++){var h=s[l];t.__dirty&&(h.__dirty|=mt),this._updateAndAddDisplayable(h,e,n)}t.__dirty=0}else{var f=t;e&&e.length?f.__clipPaths=e:f.__clipPaths&&f.__clipPaths.length>0&&(f.__clipPaths=[]),isNaN(f.z)&&(Ni(),f.z=0),isNaN(f.z2)&&(Ni(),f.z2=0),isNaN(f.zlevel)&&(Ni(),f.zlevel=0),this._displayList[this._displayListLen++]=f}var u=t.getDecalElement&&t.getDecalElement();u&&this._updateAndAddDisplayable(u,e,n);var c=t.getTextGuideLine();c&&this._updateAndAddDisplayable(c,e,n);var p=t.getTextContent();p&&this._updateAndAddDisplayable(p,e,n)}},r.prototype.addRoot=function(t){t.__zr&&t.__zr.storage===this||this._roots.push(t)},r.prototype.delRoot=function(t){if(t instanceof Array){for(var e=0,n=t.length;e<n;e++)this.delRoot(t[e]);return}var i=Ut(this._roots,t);i>=0&&this._roots.splice(i,1)},r.prototype.delAllRoots=function(){this._roots=[],this._displayList=[],this._displayListLen=0},r.prototype.getRoots=function(){return this._roots},r.prototype.dispose=function(){this._displayList=null,this._roots=null},r}(),Sd=Td;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */function Jr(){return new Date().getTime()}var zd=function(r){U(t,r);function t(e){var n=r.call(this)||this;return n._running=!1,n._time=0,n._pausedTime=0,n._pauseStart=0,n._paused=!1,e=e||{},n.stage=e.stage||{},n}return t.prototype.addClip=function(e){e.animation&&this.removeClip(e),this._head?(this._tail.next=e,e.prev=this._tail,e.next=null,this._tail=e):this._head=this._tail=e,e.animation=this},t.prototype.addAnimator=function(e){e.animation=this;var n=e.getClip();n&&this.addClip(n)},t.prototype.removeClip=function(e){if(e.animation){var n=e.prev,i=e.next;n?n.next=i:this._head=i,i?i.prev=n:this._tail=n,e.next=e.prev=e.animation=null}},t.prototype.removeAnimator=function(e){var n=e.getClip();n&&this.removeClip(n),e.animation=null},t.prototype.update=function(e){for(var n=Jr()-this._pausedTime,i=n-this._time,a=this._head;a;){var o=a.next,s=a.step(n,i);s&&(a.ondestroy(),this.removeClip(a)),a=o}this._time=n,e||(this.trigger("frame",i),this.stage.update&&this.stage.update())},t.prototype._startLoop=function(){var e=this;this._running=!0;function n(){e._running&&(ha(n),!e._paused&&e.update())}ha(n)},t.prototype.start=function(){this._running||(this._time=Jr(),this._pausedTime=0,this._startLoop())},t.prototype.stop=function(){this._running=!1},t.prototype.pause=function(){this._paused||(this._pauseStart=Jr(),this._paused=!0)},t.prototype.resume=function(){this._paused&&(this._pausedTime+=Jr()-this._pauseStart,this._paused=!1)},t.prototype.clear=function(){for(var e=this._head;e;){var n=e.next;e.prev=e.next=e.animation=null,e=n}this._head=this._tail=null},t.prototype.isFinished=function(){return this._head==null},t.prototype.animate=function(e,n){n=n||{},this.start();var i=new Ca(e,n.loop);return this.addAnimator(i),i},t}(ee),kd=zd;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var Cd=300,Ii=lt.domSupported,Bi=function(){var r=["click","dblclick","mousewheel","wheel","mouseout","mouseup","mousedown","mousemove","contextmenu"],t=["touchstart","touchend","touchmove"],e={pointerdown:1,pointerup:1,pointermove:1,pointerout:1},n=dt(r,function(i){var a=i.replace("mouse","pointer");return e.hasOwnProperty(a)?a:i});return{mouse:r,touch:t,pointer:n}}(),vs={mouse:["mousemove","mouseup"],pointer:["pointermove","pointerup"]},gs=!1;function va(r){var t=r.pointerType;return t==="pen"||t==="touch"}function Rd(r){r.touching=!0,r.touchTimer!=null&&(clearTimeout(r.touchTimer),r.touchTimer=null),r.touchTimer=setTimeout(function(){r.touching=!1,r.touchTimer=null},700)}function Fi(r){r&&(r.zrByTouch=!0)}function Pd(r,t){return Ot(r.dom,new Ld(r,t),!0)}function sh(r,t){for(var e=t,n=!1;e&&e.nodeType!==9&&!(n=e.domBelongToZr||e!==t&&e===r.painterRoot);)e=e.parentNode;return n}var Ld=function(){function r(t,e){this.stopPropagation=Mr,this.stopImmediatePropagation=Mr,this.preventDefault=Mr,this.type=e.type,this.target=this.currentTarget=t.dom,this.pointerType=e.pointerType,this.clientX=e.clientX,this.clientY=e.clientY}return r}(),Dt={mousedown:function(r){r=Ot(this.dom,r),this.__mayPointerCapture=[r.zrX,r.zrY],this.trigger("mousedown",r)},mousemove:function(r){r=Ot(this.dom,r);var t=this.__mayPointerCapture;t&&(r.zrX!==t[0]||r.zrY!==t[1])&&this.__togglePointerCapture(!0),this.trigger("mousemove",r)},mouseup:function(r){r=Ot(this.dom,r),this.__togglePointerCapture(!1),this.trigger("mouseup",r)},mouseout:function(r){r=Ot(this.dom,r);var t=r.toElement||r.relatedTarget;sh(this,t)||(this.__pointerCapturing&&(r.zrEventControl="no_globalout"),this.trigger("mouseout",r))},wheel:function(r){gs=!0,r=Ot(this.dom,r),this.trigger("mousewheel",r)},mousewheel:function(r){gs||(r=Ot(this.dom,r),this.trigger("mousewheel",r))},touchstart:function(r){r=Ot(this.dom,r),Fi(r),this.__lastTouchMoment=new Date,this.handler.processGesture(r,"start"),Dt.mousemove.call(this,r),Dt.mousedown.call(this,r)},touchmove:function(r){r=Ot(this.dom,r),Fi(r),this.handler.processGesture(r,"change"),Dt.mousemove.call(this,r)},touchend:function(r){r=Ot(this.dom,r),Fi(r),this.handler.processGesture(r,"end"),Dt.mouseup.call(this,r),+new Date-+this.__lastTouchMoment<Cd&&Dt.click.call(this,r)},pointerdown:function(r){Dt.mousedown.call(this,r)},pointermove:function(r){va(r)||Dt.mousemove.call(this,r)},pointerup:function(r){Dt.mouseup.call(this,r)},pointerout:function(r){va(r)||Dt.mouseout.call(this,r)}};_t(["click","dblclick","contextmenu"],function(r){Dt[r]=function(t){t=Ot(this.dom,t),this.trigger(r,t)}});var ga={pointermove:function(r){va(r)||ga.mousemove.call(this,r)},pointerup:function(r){ga.mouseup.call(this,r)},mousemove:function(r){this.trigger("mousemove",r)},mouseup:function(r){var t=this.__pointerCapturing;this.__togglePointerCapture(!1),this.trigger("mouseup",r),t&&(r.zrEventControl="only_globalout",this.trigger("mouseout",r))}};function Ed(r,t){var e=t.domHandlers;lt.pointerEventsSupported?_t(Bi.pointer,function(n){mn(t,n,function(i){e[n].call(r,i)})}):(lt.touchEventsSupported&&_t(Bi.touch,function(n){mn(t,n,function(i){e[n].call(r,i),Rd(t)})}),_t(Bi.mouse,function(n){mn(t,n,function(i){i=Na(i),t.touching||e[n].call(r,i)})}))}function Ad(r,t){lt.pointerEventsSupported?_t(vs.pointer,e):lt.touchEventsSupported||_t(vs.mouse,e);function e(n){function i(a){a=Na(a),sh(r,a.target)||(a=Pd(r,a),t.domHandlers[n].call(r,a))}mn(t,n,i,{capture:!0})}}function mn(r,t,e,n){r.mounted[t]=e,r.listenerOpts[t]=n,ld(r.domTarget,t,e,n)}function Wi(r){var t=r.mounted;for(var e in t)t.hasOwnProperty(e)&&hd(r.domTarget,e,t[e],r.listenerOpts[e]);r.mounted={}}var ys=function(){function r(t,e){this.mounted={},this.listenerOpts={},this.touching=!1,this.domTarget=t,this.domHandlers=e}return r}(),Md=function(r){U(t,r);function t(e,n){var i=r.call(this)||this;return i.__pointerCapturing=!1,i.dom=e,i.painterRoot=n,i._localHandlerScope=new ys(e,Dt),Ii&&(i._globalHandlerScope=new ys(document,ga)),Ed(i,i._localHandlerScope),i}return t.prototype.dispose=function(){Wi(this._localHandlerScope),Ii&&Wi(this._globalHandlerScope)},t.prototype.setCursor=function(e){this.dom.style&&(this.dom.style.cursor=e||"default")},t.prototype.__togglePointerCapture=function(e){if(this.__mayPointerCapture=null,Ii&&+this.__pointerCapturing^+e){this.__pointerCapturing=e;var n=this._globalHandlerScope;e?Ad(this,n):Wi(n)}},t}(ee),Od=Md;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */var lh=function(r){U(t,r);function t(e){var n=r.call(this)||this;return n.isGroup=!0,n._children=[],n.attr(e),n}return t.prototype.childrenRef=function(){return this._children},t.prototype.children=function(){return this._children.slice()},t.prototype.childAt=function(e){return this._children[e]},t.prototype.childOfName=function(e){for(var n=this._children,i=0;i<n.length;i++)if(n[i].name===e)return n[i]},t.prototype.childCount=function(){return this._children.length},t.prototype.add=function(e){if(e&&(e!==this&&e.parent!==this&&(this._children.push(e),this._doAdd(e)),e.__hostTarget))throw"This elemenet has been used as an attachment";return this},t.prototype.addBefore=function(e,n){if(e&&e!==this&&e.parent!==this&&n&&n.parent===this){var i=this._children,a=i.indexOf(n);a>=0&&(i.splice(a,0,e),this._doAdd(e))}return this},t.prototype.replace=function(e,n){var i=Ut(this._children,e);return i>=0&&this.replaceAt(n,i),this},t.prototype.replaceAt=function(e,n){var i=this._children,a=i[n];if(e&&e!==this&&e.parent!==this&&e!==a){i[n]=e,a.parent=null;var o=this.__zr;o&&a.removeSelfFromZr(o),this._doAdd(e)}return this},t.prototype._doAdd=function(e){e.parent&&e.parent.remove(e),e.parent=this;var n=this.__zr;n&&n!==e.__zr&&e.addSelfToZr(n),n&&n.refresh()},t.prototype.remove=function(e){var n=this.__zr,i=this._children,a=Ut(i,e);return a<0?this:(i.splice(a,1),e.parent=null,n&&e.removeSelfFromZr(n),n&&n.refresh(),this)},t.prototype.removeAll=function(){for(var e=this._children,n=this.__zr,i=0;i<e.length;i++){var a=e[i];n&&a.removeSelfFromZr(n),a.parent=null}return e.length=0,this},t.prototype.eachChild=function(e,n){for(var i=this._children,a=0;a<i.length;a++){var o=i[a];e.call(n,o,a)}return this},t.prototype.traverse=function(e,n){for(var i=0;i<this._children.length;i++){var a=this._children[i],o=e.call(n,a);a.isGroup&&!o&&a.traverse(e,n)}return this},t.prototype.addSelfToZr=function(e){r.prototype.addSelfToZr.call(this,e);for(var n=0;n<this._children.length;n++){var i=this._children[n];i.addSelfToZr(e)}},t.prototype.removeSelfFromZr=function(e){r.prototype.removeSelfFromZr.call(this,e);for(var n=0;n<this._children.length;n++){var i=this._children[n];i.removeSelfFromZr(e)}},t.prototype.getBoundingRect=function(e){for(var n=new Z(0,0,0,0),i=e||this._children,a=[],o=null,s=0;s<i.length;s++){var l=i[s];if(!(l.ignore||l.invisible)){var h=l.getBoundingRect(),f=l.getLocalTransform(a);f?(Z.applyTransform(n,h,f),o=o||n.clone(),o.union(n)):(o=o||h.clone(),o.union(h))}}return o||n},t}(ll);lh.prototype.type="group";var hh=lh;/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 *//*!
* ZRender, a high performance 2d drawing library.
*
* Copyright (c) 2013, Baidu Inc.
* All rights reserved.
*
* LICENSE
* https://github.com/ecomfe/zrender/blob/master/LICENSE.txt
*/var xe={},fh={};function Dd(r){delete fh[r]}function Nd(r){if(!r)return!1;if(typeof r=="string")return Cn(r,1)<Yi;if(r.colorStops){for(var t=r.colorStops,e=0,n=t.length,i=0;i<n;i++)e+=Cn(t[i].color,1);return e/=n,e<Yi}return!1}var Id=function(){function r(t,e,n){var i=this;this._sleepAfterStill=10,this._stillFrameAccum=0,this._needsRefresh=!0,this._needsRefreshHover=!0,this._darkMode=!1,n=n||{},this.dom=e,this.id=t;var a=new Sd,o=n.renderer||"canvas";if(xe[o]||(o=q(xe)[0]),!xe[o])throw new Error("Renderer '"+o+"' is not imported. Please import it first.");n.useDirtyRect=n.useDirtyRect==null?!1:n.useDirtyRect;var s=new xe[o](e,a,n,t),l=n.ssr||s.ssrOnly;this.storage=a,this.painter=s;var h=!lt.node&&!lt.worker&&!l?new Od(s.getViewportRoot(),s.root):null,f=n.useCoarsePointer,u=f==null||f==="auto"?lt.touchEventsSupported:!!f,c=44,p;u&&(p=j(n.pointerSize,c)),this.handler=new md(a,s,h,s.root,p),this.animation=new kd({stage:{update:l?null:function(){return i._flush(!0)}}}),l||this.animation.start()}return r.prototype.add=function(t){t&&(this.storage.addRoot(t),t.addSelfToZr(this),this.refresh())},r.prototype.remove=function(t){t&&(this.storage.delRoot(t),t.removeSelfFromZr(this),this.refresh())},r.prototype.configLayer=function(t,e){this.painter.configLayer&&this.painter.configLayer(t,e),this.refresh()},r.prototype.setBackgroundColor=function(t){this.painter.setBackgroundColor&&this.painter.setBackgroundColor(t),this.refresh(),this._backgroundColor=t,this._darkMode=Nd(t)},r.prototype.getBackgroundColor=function(){return this._backgroundColor},r.prototype.setDarkMode=function(t){this._darkMode=t},r.prototype.isDarkMode=function(){return this._darkMode},r.prototype.refreshImmediately=function(t){t||this.animation.update(!0),this._needsRefresh=!1,this.painter.refresh(),this._needsRefresh=!1},r.prototype.refresh=function(){this._needsRefresh=!0,this.animation.start()},r.prototype.flush=function(){this._flush(!1)},r.prototype._flush=function(t){var e,n=Jr();this._needsRefresh&&(e=!0,this.refreshImmediately(t)),this._needsRefreshHover&&(e=!0,this.refreshHoverImmediately());var i=Jr();e?(this._stillFrameAccum=0,this.trigger("rendered",{elapsedTime:i-n})):this._sleepAfterStill>0&&(this._stillFrameAccum++,this._stillFrameAccum>this._sleepAfterStill&&this.animation.stop())},r.prototype.setSleepAfterStill=function(t){this._sleepAfterStill=t},r.prototype.wakeUp=function(){this.animation.start(),this._stillFrameAccum=0},r.prototype.refreshHover=function(){this._needsRefreshHover=!0},r.prototype.refreshHoverImmediately=function(){this._needsRefreshHover=!1,this.painter.refreshHover&&this.painter.getType()==="canvas"&&this.painter.refreshHover()},r.prototype.resize=function(t){t=t||{},this.painter.resize(t.width,t.height),this.handler.resize()},r.prototype.clearAnimation=function(){this.animation.clear()},r.prototype.getWidth=function(){return this.painter.getWidth()},r.prototype.getHeight=function(){return this.painter.getHeight()},r.prototype.setCursorStyle=function(t){this.handler.setCursorStyle(t)},r.prototype.findHover=function(t,e){return this.handler.findHover(t,e)},r.prototype.on=function(t,e,n){return this.handler.on(t,e,n),this},r.prototype.off=function(t,e){this.handler.off(t,e)},r.prototype.trigger=function(t,e){this.handler.trigger(t,e)},r.prototype.clear=function(){for(var t=this.storage.getRoots(),e=0;e<t.length;e++)t[e]instanceof hh&&t[e].removeSelfFromZr(this);this.storage.delAllRoots(),this.painter.clear()},r.prototype.dispose=function(){this.animation.stop(),this.clear(),this.storage.dispose(),this.painter.dispose(),this.handler.dispose(),this.animation=this.storage=this.painter=this.handler=null,Dd(this.id)},r}();function Bd(r,t){var e=new Id(Fs(),r,t);return fh[e.id]=e,e}function uh(r,t){xe[r]=t}/*!
 * name: auto-drawing
 * version: v1.2.0
 * description: auto-drawing based zrender
 * author: xiaofei
 * copyright: xiaofei
 * license: MIT
 */uh("canvas",tc);uh("svg",op);function It(r,t={}){var e;const n=r instanceof HTMLElement?r:document.getElementById(r),i=window.devicePixelRatio,a=window.innerHeight*i,o=window.innerWidth*i,s=Bd(n,{renderer:"canvas",devicePixelRatio:i,width:o,height:a,...t});return(e=s==null?void 0:s.painter)==null||e.setBackgroundColor("#000"),s}function gt(r){return new hh(r)}function ch(r,t){const{type:e,x1:n,y1:i,x2:a,y2:o,x:s,y:l,cx:h,cy:f,cpx1:u,cpy1:c,rx:p,ry:d,cpx2:g,cpy2:y,width:v,height:m,r:_,r0:w,n:S,k:x,points:T,startAngle:z,endAngle:C,text:k,data:P,id:E,paths:A,image:L,params:M={},...R}=r;let O,$=[],H;switch(e){case"line":O=rs({x1:n,y1:i,x2:a,y2:o,...R});break;case"circle":O=pp({cx:h,cy:f,r:_,...R});break;case"rect":O=fp({x:s,y:l,width:v,height:m,...R});break;case"polygon":O=xp({points:T,...R});break;case"polyline":O=bp({points:T,...R});break;case"arc":O=gp({cx:h,cy:f,r:_,startAngle:z,endAngle:C,...R});break;case"text":O=Tp({x:s,y:l,text:k,...R});break;case"sector":O=Mp({cx:h,cy:f,r:_,r0:w,startAngle:z,endAngle:C,...R});break;case"image":O=Op({x:s,y:l,width:v,height:m,image:L,...R});break;case"droplet":O=Ip({cx:h,cy:f,width:v,height:m,...R});break;case"ellipse":O=Wp({cx:h,cy:f,rx:p,ry:d,...R});break;case"heart":O=Up({cx:h,cy:f,width:v,height:m,...R});break;case"isogon":O=Yp({x:s,y:l,r:_,n:S,...R});break;case"rose":O=jp({cx:h,cy:f,n:S,r:_,k:x,...R});break;case"star":O=Qp({cx:h,cy:f,n:S,r:_,r0:w,...R});break;case"compoundPath":O=wp({paths:A,...R});break;case"bezierCurve":O=kp({x1:n,y1:i,x2:a,y2:o,cpx1:u,cpy1:c,cpx2:g,cpy2:y,...R});break;case"group":P&&P.length&&($=P.map(X=>ch(X)),H=gt(),E&&(H.id=E),M&&Reflect.set(H,"params",M),$==null||$.forEach(X=>H.add(X)),O=H);break;default:O=rs({x1:n,y1:i,x2:a,y2:o,...R})}return M&&O&&Reflect.set(O,"params",M),O}function ut(r,t,e,n){var i,a;const o=(i=n==null?void 0:n.translate)!=null?i:!1,s=(a=n==null?void 0:n.scale)!=null?a:!1;e.map((h,f)=>ch(h)).forEach(h=>h&&t.add(h)),o&&ed(r,t,{callback:n==null?void 0:n.callback,mouse:n==null?void 0:n.mouse}),s&&td(r,t,{callback:n==null?void 0:n.callback}),r.add(t)}const Fd={id:"div0",class:"canvas-wrapper"},Wd={__name:"RectSector",setup(r){return Nt(()=>{const n=It("div0",{width:688,height:400}),a=gt({x:200,y:140});ut(n,a,[{type:"line",zlevel:1,x1:32,y1:62,x2:168,y2:62,stroke:"#f8f8b8"},{type:"line",zlevel:1,x1:168,y1:62,x2:168,y2:139,stroke:"#f8f8b8"},{type:"line",zlevel:1,x1:168,y1:139,x2:32,y2:139,stroke:"#f8f8b8"},{type:"line",zlevel:1,x1:32,y1:139,x2:32,y2:62,stroke:"#f8f8b8"},{type:"rect",zlevel:0,x:135,y:76,width:40,height:50,fill:"#00ff01",stroke:"#00ff01"},{type:"sector",cx:100,cy:96,r:100,r0:0,startAngle:0,endAngle:90,fill:"yellow",clockwise:!0}],{scale:!0,translate:!0})}),(t,e)=>(Rt(),Pt("div",Fd))}},Hd={id:"div1",class:"canvas-wrapper"},Gd={__name:"ElectronicComponents1",setup(r){return Nt(()=>{const n=It("div1",{width:688,height:300}),i={x:688/2,y:300/2},a=gt(i);ut(n,a,[{type:"group",data:[{type:"rect",zlevel:1,x:43.8405,y:-35.6235,width:90.519,height:71.247,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-134.3595,y:-35.6235,width:90.519,height:71.247,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"polyline",points:[[75.405,-62.865],[75.405,-52.8],[46.2,-52.8],[46.2,52.8],[75.405,52.8],[75.405,62.865],[-75.405,62.865],[-75.405,52.8],[-46.2,52.8],[-46.2,-52.8],[-75.405,-52.8],[-75.405,-62.865],[75.405,-62.865],[75.405,-62.865]],stroke:"green",lineWidth:.5,zlevel:10}]},{type:"line",zlevel:1,x1:-10,y1:0,x2:10,y2:0,stroke:"green"},{type:"line",zlevel:1,x1:0,y1:10,x2:0,y2:-10,stroke:"green"}],{scale:!0,translate:!0})}),(t,e)=>(Rt(),Pt("div",Hd))}},Ud={id:"div2",class:"canvas-wrapper"},$d={__name:"ElectronicComponents2",setup(r){return Nt(()=>{const n=It("div2",{width:688,height:300}),i={x:688/2,y:300/2},a=gt(i);ut(n,a,[{type:"group",data:[{type:"rect",zlevel:1,x:-75.856,y:31.344,width:32.512,height:32.512,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:43.344,y:31.344,width:32.512,height:32.512,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:43.344,y:-63.856,width:32.512,height:32.512,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-75.856,y:-63.856,width:32.512,height:32.512,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"polyline",points:[[-81.28,-70.096],[81.28,-70.096],[81.28,70.096],[-81.28,70.096],[-81.28,8],[-75.2,8],[-75.2,8],[-75.2,8],[-72.464,7.52],[-70.048,6.128],[-68.272,4],[-67.312,1.392],[-67.312,-1.392],[-68.272,-4],[-70.048,-6.128],[-72.464,-7.52],[-75.2,-8],[-81.28,-8],[-81.28,-70.096],[-81.28,-70.096]],stroke:"green",lineWidth:.5,zlevel:10}]},{type:"line",zlevel:100,x1:-10,y1:0,x2:10,y2:0,stroke:"green"},{type:"line",zlevel:100,x1:0,y1:10,x2:0,y2:-10,stroke:"green"}],{scale:!0,translate:!0})}),(t,e)=>(Rt(),Pt("div",Ud))}},Xd={id:"div3",class:"canvas-wrapper"},Yd={__name:"ElectronicComponents3",setup(r){return Nt(()=>{const n=It("div3",{width:688,height:300}),i={x:688/2,y:300/2},a=gt(i);ut(n,a,[{type:"group",data:[{type:"rect",zlevel:1,x:-107.46,y:52.14,width:30.48,height:15.24,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-107.46,y:22.26,width:30.48,height:15.24,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-107.46,y:-7.62,width:30.48,height:15.24,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-107.46,y:-37.5,width:30.48,height:15.24,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-107.46,y:-67.38,width:30.48,height:15.24,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:76.98,y:-67.38,width:30.48,height:15.24,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:76.98,y:-37.5,width:30.48,height:15.24,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:76.98,y:-7.62,width:30.48,height:15.24,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:76.98,y:22.26,width:30.48,height:15.24,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:76.98,y:52.14,width:30.48,height:15.24,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"polyline",points:[[72,-81.6],[72,81.6],[-60,81.6],[-72,69.6],[-72,-81.6],[72,-81.6],[72,-81.6]],stroke:"green",lineWidth:.5,zlevel:10}]},{type:"line",zlevel:1,x1:-10,y1:0,x2:10,y2:0,stroke:"green"},{type:"line",zlevel:1,x1:0,y1:10,x2:0,y2:-10,stroke:"green"}],{scale:!0,translate:!0})}),(t,e)=>(Rt(),Pt("div",Xd))}},qd={id:"div4"},Zd={__name:"ElectronicComponents4",setup(r){return Nt(()=>{const n=It("div4",{width:688,height:300}),i={x:688/2,y:300/2},a=gt(i);ut(n,a,[{type:"group",data:[{type:"rect",zlevel:1,x:-78.375,y:96.206,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-67.375,y:96.206,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-56.375,y:96.206,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-45.375,y:96.206,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-34.375,y:96.206,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-23.375,y:96.206,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-12.375,y:96.206,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-1.375,y:96.206,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:9.625,y:96.206,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:20.625,y:96.206,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:31.625,y:96.206,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:42.625,y:96.206,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:81.125,y:57.706,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:81.125,y:46.706,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:81.125,y:35.706,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:81.125,y:24.706,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:81.125,y:13.706,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:81.125,y:2.706,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:81.125,y:-8.294,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:81.125,y:-19.294,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:81.125,y:-30.294,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:81.125,y:-41.294,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:81.125,y:-52.294,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:81.125,y:-63.294,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:42.625,y:-101.794,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:31.625,y:-101.794,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:20.625,y:-101.794,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:9.625,y:-101.794,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-1.375,y:-101.794,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-12.375,y:-101.794,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-23.375,y:-101.794,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-34.375,y:-101.794,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-45.375,y:-101.794,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-56.375,y:-101.794,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-67.375,y:-101.794,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-78.375,y:-101.794,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-116.875,y:-63.294,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-116.875,y:-52.294,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-116.875,y:-41.294,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-116.875,y:-30.294,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-116.875,y:-19.294,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-116.875,y:-8.294,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-116.875,y:2.706,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-116.875,y:13.706,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-116.875,y:24.706,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-116.875,y:35.706,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-116.875,y:46.706,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1,x:-116.875,y:57.706,width:35.75,height:5.588,fill:"green",stroke:"green"}]},{type:"group",data:[{type:"polyline",points:[[-77,66],[-77,-77],[77,-77],[77,77],[-66,77],[-77,66],[-77,66]],stroke:"red",lineWidth:.5,zlevel:10}]},{type:"line",zlevel:1,x1:-10,y1:0,x2:10,y2:0,stroke:"red"},{type:"line",zlevel:1,x1:0,y1:10,x2:0,y2:-10,stroke:"red"}],{scale:!0,translate:!0})}),(t,e)=>(Rt(),Pt("div",qd))}},Vd={id:"div5"},jd={__name:"ElectronicComponents5",setup(r){return Nt(()=>{const n=It("div5",{width:688,height:400}),i={x:688/2,y:400/2,scaleX:1.5,scaleY:1.5},a=gt(i);ut(n,a,[{type:"group",data:[{type:"rect",zlevel:1e3,x:-57.6,y:-96,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-50.1,y:-96,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-42.6,y:-96,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-35.1,y:-96,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-27.6,y:-96,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-20.1,y:-96,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-12.6,y:-96,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-5.1,y:-96,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:2.4,y:-96,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:9.9,y:-96,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:17.4,y:-96,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:24.9,y:-96,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:32.4,y:-96,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:39.9,y:-96,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:47.4,y:-96,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:54.9,y:-96,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:54.9,y:75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:47.4,y:75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:39.9,y:75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:32.4,y:75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:24.9,y:75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:17.4,y:75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:9.9,y:75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:2.4,y:75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-5.1,y:75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-12.6,y:75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-20.1,y:75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-27.6,y:75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-35.1,y:75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-42.6,y:75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-50.1,y:75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-57.6,y:75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:84.15,y:-66.75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:84.15,y:-59.25,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:84.15,y:-51.75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:84.15,y:-44.25,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:84.15,y:-36.75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:84.15,y:-29.25,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:84.15,y:-21.75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:84.15,y:-14.25,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:84.15,y:-6.75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:84.15,y:.75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:84.15,y:8.25,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:84.15,y:15.75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:84.15,y:23.25,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:84.15,y:30.75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:84.15,y:38.25,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:84.15,y:45.75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-86.85,y:45.75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-86.85,y:38.25,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-86.85,y:30.75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-86.85,y:23.25,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-86.85,y:15.75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-86.85,y:8.25,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-86.85,y:.75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-86.85,y:-6.75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-86.85,y:-14.25,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-86.85,y:-21.75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-86.85,y:-29.25,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-86.85,y:-36.75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-86.85,y:-44.25,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-86.85,y:-51.75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-86.85,y:-59.25,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"group",data:[{type:"rect",zlevel:1e3,x:-86.85,y:-66.75,width:2.7,height:21,fill:"none",lineWidth:1,stroke:"green"}]},{type:"line",zlevel:100,x1:-10,y1:0,x2:10,y2:0,stroke:"red"},{type:"line",zlevel:100,x1:0,y1:10,x2:0,y2:-10,stroke:"red"},{type:"rect",x:-75,y:-75,width:150,height:150,stroke:"#fff",lineWidth:.5,zlevel:100,lineDash:"dashed"},{type:"circle",zlevel:1500,cx:-60,cy:60,r:7.5,fill:"red",stroke:"red",opacity:.5}],{scale:!0,translate:!0})}),(t,e)=>(Rt(),Pt("div",Vd))}},Hi=(r,t,e={title:"",pointType:""})=>({type:"circle",cx:r,cy:t,r:8,fill:"#fa8423",stroke:"#fa8423",zlevel:1,params:{...e}}),ms=(r,t,e,n)=>({type:"line",x1:r,y1:t,x2:e,y2:n,stroke:"#000",fill:"#000"}),_s=(r,t,e)=>({type:"text",x:r,y:t,text:e,fontSize:14,fontWeight:400,stroke:"#000",fill:"#000",zlevel:10}),Jd={class:"container"},Kd=Ne({__name:"Fishbone",props:{width:{type:Number,default:688},height:{type:Number,default:400}},setup(r){Os(o=>({f3fd939e:a.height,"0527bf7c":a.width}));const t=r,e=Ms({zr:null,group:null,clickGroup:null}),n=Dn(null),i={x:t.width/2,y:t.height/2};Nt(()=>{e.zr=It(n.value),e.group=gt(i),e.clickGroup=gt(i),e.zr.setBackgroundColor("#fff");const o=[...new Array(30)].map((L,M)=>String(M)),s=40,l=t.width/20,h=(t.height/2-s)/2,f=t.width/2-s,u=o.slice(0,2),c=o.slice(2),p=c.slice(0,Math.ceil(c.length/2)),d=c.slice(Math.ceil(c.length/2)),g=Math.max(p.length,d.length),y=(t.width-s*2)/(g+1),v=[...new Array(g)].map((L,M)=>[-f+(M+1)*y,0]),m=(L,M,R)=>{const O=R==="top"?-1:1,$=-1,[H,X]=v[M],it={start:v[M],end:[H+l*$,h*O],title:L,pointType:"basicPoint",tag:"start"},W=Hi(H,X,it),[rt,at]=W.params.start,[yt,Lt]=W.params.end,Zt=Hi(yt,Lt,{...W.params,pointType:"endpoint",tag:"end"}),Et=ms(rt,at,yt,Lt),tt=O===-1?-24:14,V=_s(yt-10,Lt+tt,W.params.title);return{type:"group",data:[W,Zt,Et,V],params:it}},_=p.map((L,M)=>m(L,M,"top")),w=d.map((L,M)=>m(L,M,"bottom")),S=u.map((L,M)=>{const R=M===0?-f:f,O=0,$=L,H={title:L,cx:R,cy:O,pointType:"endpoint",point:[R,O]},X=Hi(R,0,H),it=R-6,W=O-24,rt=_s(it,W,$);return{type:"group",data:[X,rt],params:H}}),x=S.map(L=>L.params.point),[[T,z],[C,k]]=x,P=ms(T,z,C,k),A=[...[...S,P],..._,...w];ut(e.zr,e.group,A,{scale:!0,translate:!0}),ut(e.zr,e.clickGroup,[],{scale:!0,translate:!0}),e.zr.on("click",L=>{var H,X;const{shape:M,type:R}=(L==null?void 0:L.target)||{},O=((H=L==null?void 0:L.target)==null?void 0:H.params)||{};if(!M||R!=="circle"||O.pointType!=="endpoint")return;const $={type:"circle",...M,stroke:"red",fill:"red",zlevel:2};(X=e.clickGroup)==null||X.removeAll(),ut(e.zr,e.clickGroup,[$],{scale:!0,translate:!0}),setTimeout(()=>{alert("点了我："+O.title)})})}),Nn(()=>{e.zr&&e.zr.dispose()});const a=Ie({width:t.width+"px",height:t.height+"px"});return(o,s)=>(Rt(),Pt("div",Jd,[B("div",{ref_key:"mainElementRef",ref:n,class:"main-element"},null,512)]))}});const Qd=In(Kd,[["__scopeId","data-v-cd1a4120"]]),tv={class:"container"},rv=40,ev=Ne({__name:"DotChart",props:{width:{type:Number,default:688},height:{type:Number,default:400}},setup(r){Os(o=>({cbf77316:a.height,"501f96b8":a.width}));const t=r,e=Ms({zr:null,group:null,clickGroup:null}),n=Dn(null),i={x:t.width/2,y:t.height/2};Nt(()=>{e.zr=It(n.value),e.group=gt(i),e.clickGroup=gt(i);const o=t.height/2-rv,s={type:"circle",cx:0,cy:0,r:o,fill:"#ccc",stroke:"#ccc",zlevel:1},l=[...new Array(50)].map((f,u)=>{const c=[1,-1],p=()=>c.at(Math.floor(Math.random()*2)),d=(Math.random()*o*Math.sqrt(2)/2-12)*p(),g=(Math.random()*o*Math.sqrt(2)/2-12)*p();return{type:"group",params:{title:u,pointType:"endpoint"},data:[{type:"circle",cx:d,cy:g,r:12,fill:"green",stroke:"green",zlevel:1},{type:"circle",cx:d,cy:g,r:8,fill:"blue",stroke:"blue",zlevel:2},{type:"circle",cx:d,cy:g,r:4,fill:"#ccc",stroke:"#ccc",zlevel:2}]}}),h=[s,...l];ut(e.zr,e.group,h,{scale:!0,translate:!0}),ut(e.zr,e.clickGroup,[],{scale:!0,translate:!0}),e.zr.on("click",f=>{var y;const{shape:u,type:c,parent:p}=(f==null?void 0:f.target)||{},d=(p==null?void 0:p.params)||{};if(!u||c!=="circle"||d.pointType!=="endpoint")return;const g={type:"circle",...u,r:12,stroke:"red",fill:"red",zlevel:2};(y=e.clickGroup)==null||y.removeAll(),ut(e.zr,e.clickGroup,[g],{scale:!0,translate:!0}),setTimeout(()=>{alert("点了我："+d.title)})})}),Nn(()=>{e.zr&&e.zr.dispose()});const a=Ie({width:t.width+"px",height:t.height+"px"});return(o,s)=>(Rt(),Pt("div",tv,[B("div",{ref_key:"mainElementRef",ref:n,class:"main-element"},null,512)]))}});const nv=In(ev,[["__scopeId","data-v-aabf96f1"]]);function ph(r,t){return function(){return r.apply(t,arguments)}}const{toString:iv}=Object.prototype,{getPrototypeOf:Ia}=Object,jn=(r=>t=>{const e=iv.call(t);return r[e]||(r[e]=e.slice(8,-1).toLowerCase())})(Object.create(null)),qt=r=>(r=r.toLowerCase(),t=>jn(t)===r),Jn=r=>t=>typeof t===r,{isArray:ie}=Array,De=Jn("undefined");function av(r){return r!==null&&!De(r)&&r.constructor!==null&&!De(r.constructor)&&Ct(r.constructor.isBuffer)&&r.constructor.isBuffer(r)}const dh=qt("ArrayBuffer");function ov(r){let t;return typeof ArrayBuffer<"u"&&ArrayBuffer.isView?t=ArrayBuffer.isView(r):t=r&&r.buffer&&dh(r.buffer),t}const sv=Jn("string"),Ct=Jn("function"),vh=Jn("number"),Kn=r=>r!==null&&typeof r=="object",lv=r=>r===!0||r===!1,_n=r=>{if(jn(r)!=="object")return!1;const t=Ia(r);return(t===null||t===Object.prototype||Object.getPrototypeOf(t)===null)&&!(Symbol.toStringTag in r)&&!(Symbol.iterator in r)},hv=qt("Date"),fv=qt("File"),uv=qt("Blob"),cv=qt("FileList"),pv=r=>Kn(r)&&Ct(r.pipe),dv=r=>{let t;return r&&(typeof FormData=="function"&&r instanceof FormData||Ct(r.append)&&((t=jn(r))==="formdata"||t==="object"&&Ct(r.toString)&&r.toString()==="[object FormData]"))},vv=qt("URLSearchParams"),gv=r=>r.trim?r.trim():r.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"");function We(r,t,{allOwnKeys:e=!1}={}){if(r===null||typeof r>"u")return;let n,i;if(typeof r!="object"&&(r=[r]),ie(r))for(n=0,i=r.length;n<i;n++)t.call(null,r[n],n,r);else{const a=e?Object.getOwnPropertyNames(r):Object.keys(r),o=a.length;let s;for(n=0;n<o;n++)s=a[n],t.call(null,r[s],s,r)}}function gh(r,t){t=t.toLowerCase();const e=Object.keys(r);let n=e.length,i;for(;n-- >0;)if(i=e[n],t===i.toLowerCase())return i;return null}const yh=(()=>typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:global)(),mh=r=>!De(r)&&r!==yh;function ya(){const{caseless:r}=mh(this)&&this||{},t={},e=(n,i)=>{const a=r&&gh(t,i)||i;_n(t[a])&&_n(n)?t[a]=ya(t[a],n):_n(n)?t[a]=ya({},n):ie(n)?t[a]=n.slice():t[a]=n};for(let n=0,i=arguments.length;n<i;n++)arguments[n]&&We(arguments[n],e);return t}const yv=(r,t,e,{allOwnKeys:n}={})=>(We(t,(i,a)=>{e&&Ct(i)?r[a]=ph(i,e):r[a]=i},{allOwnKeys:n}),r),mv=r=>(r.charCodeAt(0)===65279&&(r=r.slice(1)),r),_v=(r,t,e,n)=>{r.prototype=Object.create(t.prototype,n),r.prototype.constructor=r,Object.defineProperty(r,"super",{value:t.prototype}),e&&Object.assign(r.prototype,e)},wv=(r,t,e,n)=>{let i,a,o;const s={};if(t=t||{},r==null)return t;do{for(i=Object.getOwnPropertyNames(r),a=i.length;a-- >0;)o=i[a],(!n||n(o,r,t))&&!s[o]&&(t[o]=r[o],s[o]=!0);r=e!==!1&&Ia(r)}while(r&&(!e||e(r,t))&&r!==Object.prototype);return t},xv=(r,t,e)=>{r=String(r),(e===void 0||e>r.length)&&(e=r.length),e-=t.length;const n=r.indexOf(t,e);return n!==-1&&n===e},bv=r=>{if(!r)return null;if(ie(r))return r;let t=r.length;if(!vh(t))return null;const e=new Array(t);for(;t-- >0;)e[t]=r[t];return e},Tv=(r=>t=>r&&t instanceof r)(typeof Uint8Array<"u"&&Ia(Uint8Array)),Sv=(r,t)=>{const n=(r&&r[Symbol.iterator]).call(r);let i;for(;(i=n.next())&&!i.done;){const a=i.value;t.call(r,a[0],a[1])}},zv=(r,t)=>{let e;const n=[];for(;(e=r.exec(t))!==null;)n.push(e);return n},kv=qt("HTMLFormElement"),Cv=r=>r.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,function(e,n,i){return n.toUpperCase()+i}),ws=(({hasOwnProperty:r})=>(t,e)=>r.call(t,e))(Object.prototype),Rv=qt("RegExp"),_h=(r,t)=>{const e=Object.getOwnPropertyDescriptors(r),n={};We(e,(i,a)=>{let o;(o=t(i,a,r))!==!1&&(n[a]=o||i)}),Object.defineProperties(r,n)},Pv=r=>{_h(r,(t,e)=>{if(Ct(r)&&["arguments","caller","callee"].indexOf(e)!==-1)return!1;const n=r[e];if(Ct(n)){if(t.enumerable=!1,"writable"in t){t.writable=!1;return}t.set||(t.set=()=>{throw Error("Can not rewrite read-only method '"+e+"'")})}})},Lv=(r,t)=>{const e={},n=i=>{i.forEach(a=>{e[a]=!0})};return ie(r)?n(r):n(String(r).split(t)),e},Ev=()=>{},Av=(r,t)=>(r=+r,Number.isFinite(r)?r:t),Gi="abcdefghijklmnopqrstuvwxyz",xs="0123456789",wh={DIGIT:xs,ALPHA:Gi,ALPHA_DIGIT:Gi+Gi.toUpperCase()+xs},Mv=(r=16,t=wh.ALPHA_DIGIT)=>{let e="";const{length:n}=t;for(;r--;)e+=t[Math.random()*n|0];return e};function Ov(r){return!!(r&&Ct(r.append)&&r[Symbol.toStringTag]==="FormData"&&r[Symbol.iterator])}const Dv=r=>{const t=new Array(10),e=(n,i)=>{if(Kn(n)){if(t.indexOf(n)>=0)return;if(!("toJSON"in n)){t[i]=n;const a=ie(n)?[]:{};return We(n,(o,s)=>{const l=e(o,i+1);!De(l)&&(a[s]=l)}),t[i]=void 0,a}}return n};return e(r,0)},Nv=qt("AsyncFunction"),Iv=r=>r&&(Kn(r)||Ct(r))&&Ct(r.then)&&Ct(r.catch),b={isArray:ie,isArrayBuffer:dh,isBuffer:av,isFormData:dv,isArrayBufferView:ov,isString:sv,isNumber:vh,isBoolean:lv,isObject:Kn,isPlainObject:_n,isUndefined:De,isDate:hv,isFile:fv,isBlob:uv,isRegExp:Rv,isFunction:Ct,isStream:pv,isURLSearchParams:vv,isTypedArray:Tv,isFileList:cv,forEach:We,merge:ya,extend:yv,trim:gv,stripBOM:mv,inherits:_v,toFlatObject:wv,kindOf:jn,kindOfTest:qt,endsWith:xv,toArray:bv,forEachEntry:Sv,matchAll:zv,isHTMLForm:kv,hasOwnProperty:ws,hasOwnProp:ws,reduceDescriptors:_h,freezeMethods:Pv,toObjectSet:Lv,toCamelCase:Cv,noop:Ev,toFiniteNumber:Av,findKey:gh,global:yh,isContextDefined:mh,ALPHABET:wh,generateString:Mv,isSpecCompliantForm:Ov,toJSONObject:Dv,isAsyncFn:Nv,isThenable:Iv};function I(r,t,e,n,i){Error.call(this),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack,this.message=r,this.name="AxiosError",t&&(this.code=t),e&&(this.config=e),n&&(this.request=n),i&&(this.response=i)}b.inherits(I,Error,{toJSON:function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:b.toJSONObject(this.config),code:this.code,status:this.response&&this.response.status?this.response.status:null}}});const xh=I.prototype,bh={};["ERR_BAD_OPTION_VALUE","ERR_BAD_OPTION","ECONNABORTED","ETIMEDOUT","ERR_NETWORK","ERR_FR_TOO_MANY_REDIRECTS","ERR_DEPRECATED","ERR_BAD_RESPONSE","ERR_BAD_REQUEST","ERR_CANCELED","ERR_NOT_SUPPORT","ERR_INVALID_URL"].forEach(r=>{bh[r]={value:r}});Object.defineProperties(I,bh);Object.defineProperty(xh,"isAxiosError",{value:!0});I.from=(r,t,e,n,i,a)=>{const o=Object.create(xh);return b.toFlatObject(r,o,function(l){return l!==Error.prototype},s=>s!=="isAxiosError"),I.call(o,r.message,t,e,n,i),o.cause=r,o.name=r.name,a&&Object.assign(o,a),o};const Bv=null;function ma(r){return b.isPlainObject(r)||b.isArray(r)}function Th(r){return b.endsWith(r,"[]")?r.slice(0,-2):r}function bs(r,t,e){return r?r.concat(t).map(function(i,a){return i=Th(i),!e&&a?"["+i+"]":i}).join(e?".":""):t}function Fv(r){return b.isArray(r)&&!r.some(ma)}const Wv=b.toFlatObject(b,{},null,function(t){return/^is[A-Z]/.test(t)});function Qn(r,t,e){if(!b.isObject(r))throw new TypeError("target must be an object");t=t||new FormData,e=b.toFlatObject(e,{metaTokens:!0,dots:!1,indexes:!1},!1,function(g,y){return!b.isUndefined(y[g])});const n=e.metaTokens,i=e.visitor||f,a=e.dots,o=e.indexes,l=(e.Blob||typeof Blob<"u"&&Blob)&&b.isSpecCompliantForm(t);if(!b.isFunction(i))throw new TypeError("visitor must be a function");function h(d){if(d===null)return"";if(b.isDate(d))return d.toISOString();if(!l&&b.isBlob(d))throw new I("Blob is not supported. Use a Buffer instead.");return b.isArrayBuffer(d)||b.isTypedArray(d)?l&&typeof Blob=="function"?new Blob([d]):Buffer.from(d):d}function f(d,g,y){let v=d;if(d&&!y&&typeof d=="object"){if(b.endsWith(g,"{}"))g=n?g:g.slice(0,-2),d=JSON.stringify(d);else if(b.isArray(d)&&Fv(d)||(b.isFileList(d)||b.endsWith(g,"[]"))&&(v=b.toArray(d)))return g=Th(g),v.forEach(function(_,w){!(b.isUndefined(_)||_===null)&&t.append(o===!0?bs([g],w,a):o===null?g:g+"[]",h(_))}),!1}return ma(d)?!0:(t.append(bs(y,g,a),h(d)),!1)}const u=[],c=Object.assign(Wv,{defaultVisitor:f,convertValue:h,isVisitable:ma});function p(d,g){if(!b.isUndefined(d)){if(u.indexOf(d)!==-1)throw Error("Circular reference detected in "+g.join("."));u.push(d),b.forEach(d,function(v,m){(!(b.isUndefined(v)||v===null)&&i.call(t,v,b.isString(m)?m.trim():m,g,c))===!0&&p(v,g?g.concat(m):[m])}),u.pop()}}if(!b.isObject(r))throw new TypeError("data must be an object");return p(r),t}function Ts(r){const t={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\0"};return encodeURIComponent(r).replace(/[!'()~]|%20|%00/g,function(n){return t[n]})}function Ba(r,t){this._pairs=[],r&&Qn(r,this,t)}const Sh=Ba.prototype;Sh.append=function(t,e){this._pairs.push([t,e])};Sh.toString=function(t){const e=t?function(n){return t.call(this,n,Ts)}:Ts;return this._pairs.map(function(i){return e(i[0])+"="+e(i[1])},"").join("&")};function Hv(r){return encodeURIComponent(r).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}function zh(r,t,e){if(!t)return r;const n=e&&e.encode||Hv,i=e&&e.serialize;let a;if(i?a=i(t,e):a=b.isURLSearchParams(t)?t.toString():new Ba(t,e).toString(n),a){const o=r.indexOf("#");o!==-1&&(r=r.slice(0,o)),r+=(r.indexOf("?")===-1?"?":"&")+a}return r}class Gv{constructor(){this.handlers=[]}use(t,e,n){return this.handlers.push({fulfilled:t,rejected:e,synchronous:n?n.synchronous:!1,runWhen:n?n.runWhen:null}),this.handlers.length-1}eject(t){this.handlers[t]&&(this.handlers[t]=null)}clear(){this.handlers&&(this.handlers=[])}forEach(t){b.forEach(this.handlers,function(n){n!==null&&t(n)})}}const Ss=Gv,kh={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1},Uv=typeof URLSearchParams<"u"?URLSearchParams:Ba,$v=typeof FormData<"u"?FormData:null,Xv=typeof Blob<"u"?Blob:null,Yv={isBrowser:!0,classes:{URLSearchParams:Uv,FormData:$v,Blob:Xv},protocols:["http","https","file","blob","url","data"]},Ch=typeof window<"u"&&typeof document<"u",qv=(r=>Ch&&["ReactNative","NativeScript","NS"].indexOf(r)<0)(typeof navigator<"u"&&navigator.product),Zv=(()=>typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope&&typeof self.importScripts=="function")(),Vv=Object.freeze(Object.defineProperty({__proto__:null,hasBrowserEnv:Ch,hasStandardBrowserEnv:qv,hasStandardBrowserWebWorkerEnv:Zv},Symbol.toStringTag,{value:"Module"})),Xt={...Vv,...Yv};function jv(r,t){return Qn(r,new Xt.classes.URLSearchParams,Object.assign({visitor:function(e,n,i,a){return Xt.isNode&&b.isBuffer(e)?(this.append(n,e.toString("base64")),!1):a.defaultVisitor.apply(this,arguments)}},t))}function Jv(r){return b.matchAll(/\w+|\[(\w*)]/g,r).map(t=>t[0]==="[]"?"":t[1]||t[0])}function Kv(r){const t={},e=Object.keys(r);let n;const i=e.length;let a;for(n=0;n<i;n++)a=e[n],t[a]=r[a];return t}function Rh(r){function t(e,n,i,a){let o=e[a++];if(o==="__proto__")return!0;const s=Number.isFinite(+o),l=a>=e.length;return o=!o&&b.isArray(i)?i.length:o,l?(b.hasOwnProp(i,o)?i[o]=[i[o],n]:i[o]=n,!s):((!i[o]||!b.isObject(i[o]))&&(i[o]=[]),t(e,n,i[o],a)&&b.isArray(i[o])&&(i[o]=Kv(i[o])),!s)}if(b.isFormData(r)&&b.isFunction(r.entries)){const e={};return b.forEachEntry(r,(n,i)=>{t(Jv(n),i,e,0)}),e}return null}function Qv(r,t,e){if(b.isString(r))try{return(t||JSON.parse)(r),b.trim(r)}catch(n){if(n.name!=="SyntaxError")throw n}return(e||JSON.stringify)(r)}const Fa={transitional:kh,adapter:["xhr","http"],transformRequest:[function(t,e){const n=e.getContentType()||"",i=n.indexOf("application/json")>-1,a=b.isObject(t);if(a&&b.isHTMLForm(t)&&(t=new FormData(t)),b.isFormData(t))return i&&i?JSON.stringify(Rh(t)):t;if(b.isArrayBuffer(t)||b.isBuffer(t)||b.isStream(t)||b.isFile(t)||b.isBlob(t))return t;if(b.isArrayBufferView(t))return t.buffer;if(b.isURLSearchParams(t))return e.setContentType("application/x-www-form-urlencoded;charset=utf-8",!1),t.toString();let s;if(a){if(n.indexOf("application/x-www-form-urlencoded")>-1)return jv(t,this.formSerializer).toString();if((s=b.isFileList(t))||n.indexOf("multipart/form-data")>-1){const l=this.env&&this.env.FormData;return Qn(s?{"files[]":t}:t,l&&new l,this.formSerializer)}}return a||i?(e.setContentType("application/json",!1),Qv(t)):t}],transformResponse:[function(t){const e=this.transitional||Fa.transitional,n=e&&e.forcedJSONParsing,i=this.responseType==="json";if(t&&b.isString(t)&&(n&&!this.responseType||i)){const o=!(e&&e.silentJSONParsing)&&i;try{return JSON.parse(t)}catch(s){if(o)throw s.name==="SyntaxError"?I.from(s,I.ERR_BAD_RESPONSE,this,null,this.response):s}}return t}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:Xt.classes.FormData,Blob:Xt.classes.Blob},validateStatus:function(t){return t>=200&&t<300},headers:{common:{Accept:"application/json, text/plain, */*","Content-Type":void 0}}};b.forEach(["delete","get","head","post","put","patch"],r=>{Fa.headers[r]={}});const Wa=Fa,t0=b.toObjectSet(["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"]),r0=r=>{const t={};let e,n,i;return r&&r.split(`
`).forEach(function(o){i=o.indexOf(":"),e=o.substring(0,i).trim().toLowerCase(),n=o.substring(i+1).trim(),!(!e||t[e]&&t0[e])&&(e==="set-cookie"?t[e]?t[e].push(n):t[e]=[n]:t[e]=t[e]?t[e]+", "+n:n)}),t},zs=Symbol("internals");function ce(r){return r&&String(r).trim().toLowerCase()}function wn(r){return r===!1||r==null?r:b.isArray(r)?r.map(wn):String(r)}function e0(r){const t=Object.create(null),e=/([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;let n;for(;n=e.exec(r);)t[n[1]]=n[2];return t}const n0=r=>/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(r.trim());function Ui(r,t,e,n,i){if(b.isFunction(n))return n.call(this,t,e);if(i&&(t=e),!!b.isString(t)){if(b.isString(n))return t.indexOf(n)!==-1;if(b.isRegExp(n))return n.test(t)}}function i0(r){return r.trim().toLowerCase().replace(/([a-z\d])(\w*)/g,(t,e,n)=>e.toUpperCase()+n)}function a0(r,t){const e=b.toCamelCase(" "+t);["get","set","has"].forEach(n=>{Object.defineProperty(r,n+e,{value:function(i,a,o){return this[n].call(this,t,i,a,o)},configurable:!0})})}class ti{constructor(t){t&&this.set(t)}set(t,e,n){const i=this;function a(s,l,h){const f=ce(l);if(!f)throw new Error("header name must be a non-empty string");const u=b.findKey(i,f);(!u||i[u]===void 0||h===!0||h===void 0&&i[u]!==!1)&&(i[u||l]=wn(s))}const o=(s,l)=>b.forEach(s,(h,f)=>a(h,f,l));return b.isPlainObject(t)||t instanceof this.constructor?o(t,e):b.isString(t)&&(t=t.trim())&&!n0(t)?o(r0(t),e):t!=null&&a(e,t,n),this}get(t,e){if(t=ce(t),t){const n=b.findKey(this,t);if(n){const i=this[n];if(!e)return i;if(e===!0)return e0(i);if(b.isFunction(e))return e.call(this,i,n);if(b.isRegExp(e))return e.exec(i);throw new TypeError("parser must be boolean|regexp|function")}}}has(t,e){if(t=ce(t),t){const n=b.findKey(this,t);return!!(n&&this[n]!==void 0&&(!e||Ui(this,this[n],n,e)))}return!1}delete(t,e){const n=this;let i=!1;function a(o){if(o=ce(o),o){const s=b.findKey(n,o);s&&(!e||Ui(n,n[s],s,e))&&(delete n[s],i=!0)}}return b.isArray(t)?t.forEach(a):a(t),i}clear(t){const e=Object.keys(this);let n=e.length,i=!1;for(;n--;){const a=e[n];(!t||Ui(this,this[a],a,t,!0))&&(delete this[a],i=!0)}return i}normalize(t){const e=this,n={};return b.forEach(this,(i,a)=>{const o=b.findKey(n,a);if(o){e[o]=wn(i),delete e[a];return}const s=t?i0(a):String(a).trim();s!==a&&delete e[a],e[s]=wn(i),n[s]=!0}),this}concat(...t){return this.constructor.concat(this,...t)}toJSON(t){const e=Object.create(null);return b.forEach(this,(n,i)=>{n!=null&&n!==!1&&(e[i]=t&&b.isArray(n)?n.join(", "):n)}),e}[Symbol.iterator](){return Object.entries(this.toJSON())[Symbol.iterator]()}toString(){return Object.entries(this.toJSON()).map(([t,e])=>t+": "+e).join(`
`)}get[Symbol.toStringTag](){return"AxiosHeaders"}static from(t){return t instanceof this?t:new this(t)}static concat(t,...e){const n=new this(t);return e.forEach(i=>n.set(i)),n}static accessor(t){const n=(this[zs]=this[zs]={accessors:{}}).accessors,i=this.prototype;function a(o){const s=ce(o);n[s]||(a0(i,o),n[s]=!0)}return b.isArray(t)?t.forEach(a):a(t),this}}ti.accessor(["Content-Type","Content-Length","Accept","Accept-Encoding","User-Agent","Authorization"]);b.reduceDescriptors(ti.prototype,({value:r},t)=>{let e=t[0].toUpperCase()+t.slice(1);return{get:()=>r,set(n){this[e]=n}}});b.freezeMethods(ti);const er=ti;function $i(r,t){const e=this||Wa,n=t||e,i=er.from(n.headers);let a=n.data;return b.forEach(r,function(s){a=s.call(e,a,i.normalize(),t?t.status:void 0)}),i.normalize(),a}function Ph(r){return!!(r&&r.__CANCEL__)}function He(r,t,e){I.call(this,r??"canceled",I.ERR_CANCELED,t,e),this.name="CanceledError"}b.inherits(He,I,{__CANCEL__:!0});function o0(r,t,e){const n=e.config.validateStatus;!e.status||!n||n(e.status)?r(e):t(new I("Request failed with status code "+e.status,[I.ERR_BAD_REQUEST,I.ERR_BAD_RESPONSE][Math.floor(e.status/100)-4],e.config,e.request,e))}const s0=Xt.hasStandardBrowserEnv?{write(r,t,e,n,i,a){const o=[r+"="+encodeURIComponent(t)];b.isNumber(e)&&o.push("expires="+new Date(e).toGMTString()),b.isString(n)&&o.push("path="+n),b.isString(i)&&o.push("domain="+i),a===!0&&o.push("secure"),document.cookie=o.join("; ")},read(r){const t=document.cookie.match(new RegExp("(^|;\\s*)("+r+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove(r){this.write(r,"",Date.now()-864e5)}}:{write(){},read(){return null},remove(){}};function l0(r){return/^([a-z][a-z\d+\-.]*:)?\/\//i.test(r)}function h0(r,t){return t?r.replace(/\/?\/$/,"")+"/"+t.replace(/^\/+/,""):r}function Lh(r,t){return r&&!l0(t)?h0(r,t):t}const f0=Xt.hasStandardBrowserEnv?function(){const t=/(msie|trident)/i.test(navigator.userAgent),e=document.createElement("a");let n;function i(a){let o=a;return t&&(e.setAttribute("href",o),o=e.href),e.setAttribute("href",o),{href:e.href,protocol:e.protocol?e.protocol.replace(/:$/,""):"",host:e.host,search:e.search?e.search.replace(/^\?/,""):"",hash:e.hash?e.hash.replace(/^#/,""):"",hostname:e.hostname,port:e.port,pathname:e.pathname.charAt(0)==="/"?e.pathname:"/"+e.pathname}}return n=i(window.location.href),function(o){const s=b.isString(o)?i(o):o;return s.protocol===n.protocol&&s.host===n.host}}():function(){return function(){return!0}}();function u0(r){const t=/^([-+\w]{1,25})(:?\/\/|:)/.exec(r);return t&&t[1]||""}function c0(r,t){r=r||10;const e=new Array(r),n=new Array(r);let i=0,a=0,o;return t=t!==void 0?t:1e3,function(l){const h=Date.now(),f=n[a];o||(o=h),e[i]=l,n[i]=h;let u=a,c=0;for(;u!==i;)c+=e[u++],u=u%r;if(i=(i+1)%r,i===a&&(a=(a+1)%r),h-o<t)return;const p=f&&h-f;return p?Math.round(c*1e3/p):void 0}}function ks(r,t){let e=0;const n=c0(50,250);return i=>{const a=i.loaded,o=i.lengthComputable?i.total:void 0,s=a-e,l=n(s),h=a<=o;e=a;const f={loaded:a,total:o,progress:o?a/o:void 0,bytes:s,rate:l||void 0,estimated:l&&o&&h?(o-a)/l:void 0,event:i};f[t?"download":"upload"]=!0,r(f)}}const p0=typeof XMLHttpRequest<"u",d0=p0&&function(r){return new Promise(function(e,n){let i=r.data;const a=er.from(r.headers).normalize();let{responseType:o,withXSRFToken:s}=r,l;function h(){r.cancelToken&&r.cancelToken.unsubscribe(l),r.signal&&r.signal.removeEventListener("abort",l)}let f;if(b.isFormData(i)){if(Xt.hasStandardBrowserEnv||Xt.hasStandardBrowserWebWorkerEnv)a.setContentType(!1);else if((f=a.getContentType())!==!1){const[g,...y]=f?f.split(";").map(v=>v.trim()).filter(Boolean):[];a.setContentType([g||"multipart/form-data",...y].join("; "))}}let u=new XMLHttpRequest;if(r.auth){const g=r.auth.username||"",y=r.auth.password?unescape(encodeURIComponent(r.auth.password)):"";a.set("Authorization","Basic "+btoa(g+":"+y))}const c=Lh(r.baseURL,r.url);u.open(r.method.toUpperCase(),zh(c,r.params,r.paramsSerializer),!0),u.timeout=r.timeout;function p(){if(!u)return;const g=er.from("getAllResponseHeaders"in u&&u.getAllResponseHeaders()),v={data:!o||o==="text"||o==="json"?u.responseText:u.response,status:u.status,statusText:u.statusText,headers:g,config:r,request:u};o0(function(_){e(_),h()},function(_){n(_),h()},v),u=null}if("onloadend"in u?u.onloadend=p:u.onreadystatechange=function(){!u||u.readyState!==4||u.status===0&&!(u.responseURL&&u.responseURL.indexOf("file:")===0)||setTimeout(p)},u.onabort=function(){u&&(n(new I("Request aborted",I.ECONNABORTED,r,u)),u=null)},u.onerror=function(){n(new I("Network Error",I.ERR_NETWORK,r,u)),u=null},u.ontimeout=function(){let y=r.timeout?"timeout of "+r.timeout+"ms exceeded":"timeout exceeded";const v=r.transitional||kh;r.timeoutErrorMessage&&(y=r.timeoutErrorMessage),n(new I(y,v.clarifyTimeoutError?I.ETIMEDOUT:I.ECONNABORTED,r,u)),u=null},Xt.hasStandardBrowserEnv&&(s&&b.isFunction(s)&&(s=s(r)),s||s!==!1&&f0(c))){const g=r.xsrfHeaderName&&r.xsrfCookieName&&s0.read(r.xsrfCookieName);g&&a.set(r.xsrfHeaderName,g)}i===void 0&&a.setContentType(null),"setRequestHeader"in u&&b.forEach(a.toJSON(),function(y,v){u.setRequestHeader(v,y)}),b.isUndefined(r.withCredentials)||(u.withCredentials=!!r.withCredentials),o&&o!=="json"&&(u.responseType=r.responseType),typeof r.onDownloadProgress=="function"&&u.addEventListener("progress",ks(r.onDownloadProgress,!0)),typeof r.onUploadProgress=="function"&&u.upload&&u.upload.addEventListener("progress",ks(r.onUploadProgress)),(r.cancelToken||r.signal)&&(l=g=>{u&&(n(!g||g.type?new He(null,r,u):g),u.abort(),u=null)},r.cancelToken&&r.cancelToken.subscribe(l),r.signal&&(r.signal.aborted?l():r.signal.addEventListener("abort",l)));const d=u0(c);if(d&&Xt.protocols.indexOf(d)===-1){n(new I("Unsupported protocol "+d+":",I.ERR_BAD_REQUEST,r));return}u.send(i||null)})},_a={http:Bv,xhr:d0};b.forEach(_a,(r,t)=>{if(r){try{Object.defineProperty(r,"name",{value:t})}catch{}Object.defineProperty(r,"adapterName",{value:t})}});const Cs=r=>`- ${r}`,v0=r=>b.isFunction(r)||r===null||r===!1,Eh={getAdapter:r=>{r=b.isArray(r)?r:[r];const{length:t}=r;let e,n;const i={};for(let a=0;a<t;a++){e=r[a];let o;if(n=e,!v0(e)&&(n=_a[(o=String(e)).toLowerCase()],n===void 0))throw new I(`Unknown adapter '${o}'`);if(n)break;i[o||"#"+a]=n}if(!n){const a=Object.entries(i).map(([s,l])=>`adapter ${s} `+(l===!1?"is not supported by the environment":"is not available in the build"));let o=t?a.length>1?`since :
`+a.map(Cs).join(`
`):" "+Cs(a[0]):"as no adapter specified";throw new I("There is no suitable adapter to dispatch the request "+o,"ERR_NOT_SUPPORT")}return n},adapters:_a};function Xi(r){if(r.cancelToken&&r.cancelToken.throwIfRequested(),r.signal&&r.signal.aborted)throw new He(null,r)}function Rs(r){return Xi(r),r.headers=er.from(r.headers),r.data=$i.call(r,r.transformRequest),["post","put","patch"].indexOf(r.method)!==-1&&r.headers.setContentType("application/x-www-form-urlencoded",!1),Eh.getAdapter(r.adapter||Wa.adapter)(r).then(function(n){return Xi(r),n.data=$i.call(r,r.transformResponse,n),n.headers=er.from(n.headers),n},function(n){return Ph(n)||(Xi(r),n&&n.response&&(n.response.data=$i.call(r,r.transformResponse,n.response),n.response.headers=er.from(n.response.headers))),Promise.reject(n)})}const Ps=r=>r instanceof er?r.toJSON():r;function re(r,t){t=t||{};const e={};function n(h,f,u){return b.isPlainObject(h)&&b.isPlainObject(f)?b.merge.call({caseless:u},h,f):b.isPlainObject(f)?b.merge({},f):b.isArray(f)?f.slice():f}function i(h,f,u){if(b.isUndefined(f)){if(!b.isUndefined(h))return n(void 0,h,u)}else return n(h,f,u)}function a(h,f){if(!b.isUndefined(f))return n(void 0,f)}function o(h,f){if(b.isUndefined(f)){if(!b.isUndefined(h))return n(void 0,h)}else return n(void 0,f)}function s(h,f,u){if(u in t)return n(h,f);if(u in r)return n(void 0,h)}const l={url:a,method:a,data:a,baseURL:o,transformRequest:o,transformResponse:o,paramsSerializer:o,timeout:o,timeoutMessage:o,withCredentials:o,withXSRFToken:o,adapter:o,responseType:o,xsrfCookieName:o,xsrfHeaderName:o,onUploadProgress:o,onDownloadProgress:o,decompress:o,maxContentLength:o,maxBodyLength:o,beforeRedirect:o,transport:o,httpAgent:o,httpsAgent:o,cancelToken:o,socketPath:o,responseEncoding:o,validateStatus:s,headers:(h,f)=>i(Ps(h),Ps(f),!0)};return b.forEach(Object.keys(Object.assign({},r,t)),function(f){const u=l[f]||i,c=u(r[f],t[f],f);b.isUndefined(c)&&u!==s||(e[f]=c)}),e}const Ah="1.6.5",Ha={};["object","boolean","number","function","string","symbol"].forEach((r,t)=>{Ha[r]=function(n){return typeof n===r||"a"+(t<1?"n ":" ")+r}});const Ls={};Ha.transitional=function(t,e,n){function i(a,o){return"[Axios v"+Ah+"] Transitional option '"+a+"'"+o+(n?". "+n:"")}return(a,o,s)=>{if(t===!1)throw new I(i(o," has been removed"+(e?" in "+e:"")),I.ERR_DEPRECATED);return e&&!Ls[o]&&(Ls[o]=!0,console.warn(i(o," has been deprecated since v"+e+" and will be removed in the near future"))),t?t(a,o,s):!0}};function g0(r,t,e){if(typeof r!="object")throw new I("options must be an object",I.ERR_BAD_OPTION_VALUE);const n=Object.keys(r);let i=n.length;for(;i-- >0;){const a=n[i],o=t[a];if(o){const s=r[a],l=s===void 0||o(s,a,r);if(l!==!0)throw new I("option "+a+" must be "+l,I.ERR_BAD_OPTION_VALUE);continue}if(e!==!0)throw new I("Unknown option "+a,I.ERR_BAD_OPTION)}}const wa={assertOptions:g0,validators:Ha},ar=wa.validators;class On{constructor(t){this.defaults=t,this.interceptors={request:new Ss,response:new Ss}}request(t,e){typeof t=="string"?(e=e||{},e.url=t):e=t||{},e=re(this.defaults,e);const{transitional:n,paramsSerializer:i,headers:a}=e;n!==void 0&&wa.assertOptions(n,{silentJSONParsing:ar.transitional(ar.boolean),forcedJSONParsing:ar.transitional(ar.boolean),clarifyTimeoutError:ar.transitional(ar.boolean)},!1),i!=null&&(b.isFunction(i)?e.paramsSerializer={serialize:i}:wa.assertOptions(i,{encode:ar.function,serialize:ar.function},!0)),e.method=(e.method||this.defaults.method||"get").toLowerCase();let o=a&&b.merge(a.common,a[e.method]);a&&b.forEach(["delete","get","head","post","put","patch","common"],d=>{delete a[d]}),e.headers=er.concat(o,a);const s=[];let l=!0;this.interceptors.request.forEach(function(g){typeof g.runWhen=="function"&&g.runWhen(e)===!1||(l=l&&g.synchronous,s.unshift(g.fulfilled,g.rejected))});const h=[];this.interceptors.response.forEach(function(g){h.push(g.fulfilled,g.rejected)});let f,u=0,c;if(!l){const d=[Rs.bind(this),void 0];for(d.unshift.apply(d,s),d.push.apply(d,h),c=d.length,f=Promise.resolve(e);u<c;)f=f.then(d[u++],d[u++]);return f}c=s.length;let p=e;for(u=0;u<c;){const d=s[u++],g=s[u++];try{p=d(p)}catch(y){g.call(this,y);break}}try{f=Rs.call(this,p)}catch(d){return Promise.reject(d)}for(u=0,c=h.length;u<c;)f=f.then(h[u++],h[u++]);return f}getUri(t){t=re(this.defaults,t);const e=Lh(t.baseURL,t.url);return zh(e,t.params,t.paramsSerializer)}}b.forEach(["delete","get","head","options"],function(t){On.prototype[t]=function(e,n){return this.request(re(n||{},{method:t,url:e,data:(n||{}).data}))}});b.forEach(["post","put","patch"],function(t){function e(n){return function(a,o,s){return this.request(re(s||{},{method:t,headers:n?{"Content-Type":"multipart/form-data"}:{},url:a,data:o}))}}On.prototype[t]=e(),On.prototype[t+"Form"]=e(!0)});const xn=On;class Ga{constructor(t){if(typeof t!="function")throw new TypeError("executor must be a function.");let e;this.promise=new Promise(function(a){e=a});const n=this;this.promise.then(i=>{if(!n._listeners)return;let a=n._listeners.length;for(;a-- >0;)n._listeners[a](i);n._listeners=null}),this.promise.then=i=>{let a;const o=new Promise(s=>{n.subscribe(s),a=s}).then(i);return o.cancel=function(){n.unsubscribe(a)},o},t(function(a,o,s){n.reason||(n.reason=new He(a,o,s),e(n.reason))})}throwIfRequested(){if(this.reason)throw this.reason}subscribe(t){if(this.reason){t(this.reason);return}this._listeners?this._listeners.push(t):this._listeners=[t]}unsubscribe(t){if(!this._listeners)return;const e=this._listeners.indexOf(t);e!==-1&&this._listeners.splice(e,1)}static source(){let t;return{token:new Ga(function(i){t=i}),cancel:t}}}const y0=Ga;function m0(r){return function(e){return r.apply(null,e)}}function _0(r){return b.isObject(r)&&r.isAxiosError===!0}const xa={Continue:100,SwitchingProtocols:101,Processing:102,EarlyHints:103,Ok:200,Created:201,Accepted:202,NonAuthoritativeInformation:203,NoContent:204,ResetContent:205,PartialContent:206,MultiStatus:207,AlreadyReported:208,ImUsed:226,MultipleChoices:300,MovedPermanently:301,Found:302,SeeOther:303,NotModified:304,UseProxy:305,Unused:306,TemporaryRedirect:307,PermanentRedirect:308,BadRequest:400,Unauthorized:401,PaymentRequired:402,Forbidden:403,NotFound:404,MethodNotAllowed:405,NotAcceptable:406,ProxyAuthenticationRequired:407,RequestTimeout:408,Conflict:409,Gone:410,LengthRequired:411,PreconditionFailed:412,PayloadTooLarge:413,UriTooLong:414,UnsupportedMediaType:415,RangeNotSatisfiable:416,ExpectationFailed:417,ImATeapot:418,MisdirectedRequest:421,UnprocessableEntity:422,Locked:423,FailedDependency:424,TooEarly:425,UpgradeRequired:426,PreconditionRequired:428,TooManyRequests:429,RequestHeaderFieldsTooLarge:431,UnavailableForLegalReasons:451,InternalServerError:500,NotImplemented:501,BadGateway:502,ServiceUnavailable:503,GatewayTimeout:504,HttpVersionNotSupported:505,VariantAlsoNegotiates:506,InsufficientStorage:507,LoopDetected:508,NotExtended:510,NetworkAuthenticationRequired:511};Object.entries(xa).forEach(([r,t])=>{xa[t]=r});const w0=xa;function Mh(r){const t=new xn(r),e=ph(xn.prototype.request,t);return b.extend(e,xn.prototype,t,{allOwnKeys:!0}),b.extend(e,t,null,{allOwnKeys:!0}),e.create=function(i){return Mh(re(r,i))},e}const J=Mh(Wa);J.Axios=xn;J.CanceledError=He;J.CancelToken=y0;J.isCancel=Ph;J.VERSION=Ah;J.toFormData=Qn;J.AxiosError=I;J.Cancel=J.CanceledError;J.all=function(t){return Promise.all(t)};J.spread=m0;J.isAxiosError=_0;J.mergeConfig=re;J.AxiosHeaders=er;J.formToJSON=r=>Rh(b.isHTMLForm(r)?new FormData(r):r);J.getAdapter=Eh.getAdapter;J.HttpStatusCode=w0;J.default=J;const Oh=J;const x0={class:"container"},b0=688,Es=400,Jt=50,T0=Ne({__name:"Room1",setup(r){const t=(s,l,h,f,u)=>({type:"arc",cx:s,cy:l,startAngle:f,endAngle:u,r:h,fill:"none",stroke:"green",zlevel:1}),e=(s,l,h,f,u="#fff")=>({type:"line",x1:s,y1:l,x2:h,y2:f,stroke:u,fill:"#fff"}),n=(s,l,h)=>({type:"text",x:s,y:l,text:h,fontSize:6,fontWeight:400,stroke:"#fff",fill:"#fff",zlevel:10}),i=Ie({zr:null,group:null,loading:!0}),a=Dn(null),o={x:260,y:Es-100};return Nt(()=>{i.zr=It(a.value,{width:b0,height:Es}),i.group=gt(o),Oh.get("https://xf-1252186245.cos.ap-chengdu.myqcloud.com/room.json").then(s=>{const h=s.data.data.map(f=>{if(f.名称==="直线"){const u=Number(f.起点X)/Jt,c=-Number(f.起点Y)/Jt,p=Number(f.端点X)/Jt,d=-Number(f.端点Y)/Jt,g=f.图层,v={标注:"red",0:"yellow",墙线:"#fff",轴线:"green",楼梯:"#ccc",门窗:"#eee"}[g]||"#fff";return e(u,c,p,d,v)}if(f.名称==="圆弧"){const u=Number(f.中心X)/Jt,c=-Number(f.中心Y)/Jt,p=Number(f.半径)/Jt,d=Number(f.起点角度),g=d+Number(f.总角度);return t(u,c,p,d,g)}if(f.名称==="多行文字"){const u=Number(f.位置X)/Jt,c=-Number(f.位置Y)/Jt,p=f.内容;return n(u,c,p)}return{type:"group",data:[]}});ut(i.zr,i.group,h,{translate:!0,scale:!0}),i.loading=!1})}),Nn(()=>{i.zr&&i.zr.dispose()}),(s,l)=>(Rt(),Pt("div",x0,[B("div",{ref_key:"mainElementRef",ref:a,class:"main"},null,512)]))}});const S0=In(T0,[["__scopeId","data-v-60278ed8"]]),z0={class:"container"},k0=688,As=400,Kt=60,C0=Ne({__name:"Room2",setup(r){const t=(s,l,h,f,u)=>({type:"arc",cx:s,cy:l,startAngle:f,endAngle:u,r:h,fill:"none",stroke:"green",zlevel:1}),e=(s,l,h,f,u="#fff")=>({type:"line",x1:s,y1:l,x2:h,y2:f,stroke:u,fill:"#fff"}),n=(s,l,h)=>({type:"text",x:s,y:l,text:h,fontSize:6,fontWeight:400,stroke:"#fff",fill:"#fff",zlevel:10}),i=Ie({zr:null,group:null,loading:!0}),a=Dn(null),o={x:160,y:As-40};return Nt(()=>{i.zr=It(a.value,{width:k0,height:As}),i.group=gt(o),Oh.get("https://xf-1252186245.cos.ap-chengdu.myqcloud.com/room1.json").then(s=>{const h=s.data.data.map(f=>{if(f.名称==="直线"){const u=Number(f.起点X)/Kt,c=-Number(f.起点Y)/Kt,p=Number(f.端点X)/Kt,d=-Number(f.端点Y)/Kt,g=f.图层,v={标注:"red",0:"yellow",墙线:"#fff",轴线:"green",楼梯:"#ccc",门窗:"#eee"}[g]||"#fff";return e(u,c,p,d,v)}if(f.名称==="圆弧"){const u=Number(f.中心X)/Kt,c=-Number(f.中心Y)/Kt,p=Number(f.半径)/Kt,d=Number(f.起点角度),g=d+Number(f.总角度);return t(u,c,p,d,g)}if(f.名称==="多行文字"){const u=Number(f.位置X)/Kt,c=-Number(f.位置Y)/Kt,p=f.内容;return n(u,c,p)}return{type:"group",data:[]}});ut(i.zr,i.group,h,{translate:!0,scale:!0}),i.loading=!1})}),Nn(()=>{i.zr&&i.zr.dispose()}),(s,l)=>(Rt(),Pt("div",z0,[B("div",{ref_key:"mainElementRef",ref:a,class:"main"},null,512)]))}});const R0=In(C0,[["__scopeId","data-v-223664be"]]);var pe=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},P0={exports:{}};(function(r,t){(function(e,n){n()})(pe,function(){function e(h,f){return typeof f>"u"?f={autoBom:!1}:typeof f!="object"&&(console.warn("Deprecated: Expected third argument to be a object"),f={autoBom:!f}),f.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(h.type)?new Blob(["\uFEFF",h],{type:h.type}):h}function n(h,f,u){var c=new XMLHttpRequest;c.open("GET",h),c.responseType="blob",c.onload=function(){l(c.response,f,u)},c.onerror=function(){console.error("could not download file")},c.send()}function i(h){var f=new XMLHttpRequest;f.open("HEAD",h,!1);try{f.send()}catch{}return 200<=f.status&&299>=f.status}function a(h){try{h.dispatchEvent(new MouseEvent("click"))}catch{var f=document.createEvent("MouseEvents");f.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),h.dispatchEvent(f)}}var o=typeof window=="object"&&window.window===window?window:typeof self=="object"&&self.self===self?self:typeof pe=="object"&&pe.global===pe?pe:void 0,s=o.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),l=o.saveAs||(typeof window!="object"||window!==o?function(){}:"download"in HTMLAnchorElement.prototype&&!s?function(h,f,u){var c=o.URL||o.webkitURL,p=document.createElement("a");f=f||h.name||"download",p.download=f,p.rel="noopener",typeof h=="string"?(p.href=h,p.origin===location.origin?a(p):i(p.href)?n(h,f,u):a(p,p.target="_blank")):(p.href=c.createObjectURL(h),setTimeout(function(){c.revokeObjectURL(p.href)},4e4),setTimeout(function(){a(p)},0))}:"msSaveOrOpenBlob"in navigator?function(h,f,u){if(f=f||h.name||"download",typeof h!="string")navigator.msSaveOrOpenBlob(e(h,u),f);else if(i(h))n(h,f,u);else{var c=document.createElement("a");c.href=h,c.target="_blank",setTimeout(function(){a(c)})}}:function(h,f,u,c){if(c=c||open("","_blank"),c&&(c.document.title=c.document.body.innerText="downloading..."),typeof h=="string")return n(h,f,u);var p=h.type==="application/octet-stream",d=/constructor/i.test(o.HTMLElement)||o.safari,g=/CriOS\/[\d]+/.test(navigator.userAgent);if((g||p&&d||s)&&typeof FileReader<"u"){var y=new FileReader;y.onloadend=function(){var _=y.result;_=g?_:_.replace(/^data:[^;]*;/,"data:attachment/file;"),c?c.location.href=_:location=_,c=null},y.readAsDataURL(h)}else{var v=o.URL||o.webkitURL,m=v.createObjectURL(h);c?c.location=m:location.href=m,c=null,setTimeout(function(){v.revokeObjectURL(m)},4e4)}});o.saveAs=l.saveAs=l,r.exports=l})})(P0);const L0={id:"sharePost",class:"canvas-wrapper"},E0=Ne({__name:"SharePost",setup(r){const t=Ie({zr:null,gp:null});return Nt(()=>{t.zr=It("sharePost",{width:375,height:592}),t.zr.setBackgroundColor("#ff6e0b"),t.gp=gt();const i=[{type:"image",x:0,y:0,width:375,height:592,image:"https://auto-drawing-doc-1252186245.cos.ap-beijing.myqcloud.com/post.png"},{type:"image",x:40,y:20,width:50,height:50,image:"https://auto-drawing-doc-1252186245.cos.ap-beijing.myqcloud.com/avatar.png",zlevel:1},{type:"text",x:98,y:24,text:"我的店铺",fontSize:16,fill:"#fff"},{type:"text",x:98,y:50,text:"邀请你共享优惠",fontSize:12,fill:"#ffd3a2"},{type:"text",x:50,y:400,text:"￥99.9",fontSize:32,fill:"#f00"},{type:"text",x:150,y:410,text:"￥1999.9",fontSize:12,fill:"#999"},{type:"line",x1:158,y1:414,x2:200,y2:414,stroke:"#999"},{type:"text",x:60,y:440,text:"自营",fontSize:12,backgroundColor:"#fa4f00",padding:2,borderRadius:5},{type:"text",x:96,y:440,text:"30天最低价",fontSize:12,fill:"#805609",backgroundColor:"#faf5d9",padding:2},{type:"text",x:168,y:440,text:"包邮",fontSize:12,fill:"#805609",backgroundColor:"#faf5d9",padding:2},{type:"text",x:200,y:440,text:"满减优惠",fontSize:12,fill:"#805609",backgroundColor:"#faf5d9",padding:2},{type:"text",x:55,y:480,text:"精美兔子毛绒",fontSize:24,fill:"#000"},{type:"text",x:55,y:510,text:"玩具，回家必备。",fontSize:24,fill:"#000"},{type:"image",x:250,y:472,width:70,height:70,image:"https://auto-drawing-doc-1252186245.cos.ap-beijing.myqcloud.com/code.jpg"},{type:"text",x:320,y:210,text:"兔 年 快 乐",fontSize:20,fill:"#fa4f00",rotation:-90,originX:320,originY:210}];ut(t.zr,t.gp,i)}),(e,n)=>(Rt(),Pt("div",L0))}});const A0=B("h1",{id:"示例",tabindex:"-1"},[xt("示例 "),B("a",{class:"header-anchor",href:"#示例","aria-label":'Permalink to "示例"'},"​")],-1),M0=B("h2",{id:"分销海报",tabindex:"-1"},[xt("分销海报 "),B("a",{class:"header-anchor",href:"#分销海报","aria-label":'Permalink to "分销海报"'},"​")],-1),O0=B("h2",{id:"线段矩形扇形",tabindex:"-1"},[xt("线段矩形扇形 "),B("a",{class:"header-anchor",href:"#线段矩形扇形","aria-label":'Permalink to "线段矩形扇形"'},"​")],-1),D0=B("h2",{id:"户型图-1",tabindex:"-1"},[xt("户型图-1 "),B("a",{class:"header-anchor",href:"#户型图-1","aria-label":'Permalink to "户型图-1"'},"​")],-1),N0=B("h2",{id:"户型图-2",tabindex:"-1"},[xt("户型图-2 "),B("a",{class:"header-anchor",href:"#户型图-2","aria-label":'Permalink to "户型图-2"'},"​")],-1),I0=B("h2",{id:"示例-1",tabindex:"-1"},[xt("示例-1 "),B("a",{class:"header-anchor",href:"#示例-1","aria-label":'Permalink to "示例-1"'},"​")],-1),B0=B("h2",{id:"示例-2",tabindex:"-1"},[xt("示例-2 "),B("a",{class:"header-anchor",href:"#示例-2","aria-label":'Permalink to "示例-2"'},"​")],-1),F0=B("h2",{id:"示例-3",tabindex:"-1"},[xt("示例-3 "),B("a",{class:"header-anchor",href:"#示例-3","aria-label":'Permalink to "示例-3"'},"​")],-1),W0=B("h2",{id:"示例-4",tabindex:"-1"},[xt("示例-4 "),B("a",{class:"header-anchor",href:"#示例-4","aria-label":'Permalink to "示例-4"'},"​")],-1),H0=B("h2",{id:"示例-5",tabindex:"-1"},[xt("示例-5 "),B("a",{class:"header-anchor",href:"#示例-5","aria-label":'Permalink to "示例-5"'},"​")],-1),G0=B("h2",{id:"鱼骨图",tabindex:"-1"},[xt("鱼骨图 "),B("a",{class:"header-anchor",href:"#鱼骨图","aria-label":'Permalink to "鱼骨图"'},"​")],-1),U0=B("h2",{id:"圆点图",tabindex:"-1"},[xt("圆点图 "),B("a",{class:"header-anchor",href:"#圆点图","aria-label":'Permalink to "圆点图"'},"​")],-1),$0=B("h2",{id:"更多示例",tabindex:"-1"},[B("a",{href:"https://github.com/l-x-f/auto-drawing/tree/main/tests",target:"_blank",rel:"noreferrer"},"更多示例"),xt(),B("a",{class:"header-anchor",href:"#更多示例","aria-label":'Permalink to "[更多示例](https://github.com/l-x-f/auto-drawing/tree/main/tests)"'},"​")],-1),q0=JSON.parse('{"title":"示例","description":"","frontmatter":{},"headers":[],"relativePath":"example/example.md","filePath":"example/example.md"}'),X0={name:"example/example.md"},Z0=Object.assign(X0,{setup(r){return Dh("components-raw",Object.assign({"../components/CircuitBoard.vue":Ih,"../components/DotChart.vue":Bh,"../components/ElectronicComponents1.vue":Fh,"../components/ElectronicComponents2.vue":Wh,"../components/ElectronicComponents3.vue":Hh,"../components/ElectronicComponents4.vue":Gh,"../components/ElectronicComponents5.vue":Uh,"../components/Fishbone.vue":$h,"../components/RectSector.vue":Xh,"../components/Room1.vue":Yh,"../components/Room2.vue":qh,"../components/SharePost.vue":Zh})),(e,n)=>{const i=Nh("CodeCard");return Rt(),Pt("div",null,[A0,M0,Y(i,{fileName:"SharePost",title:"分销海报(下载可以拿到海报blob base64数据)"},{default:At(()=>[Y(E0)]),_:1}),O0,Y(i,{fileName:"RectSector",title:"线段矩形扇形"},{default:At(()=>[Y(Wd)]),_:1}),D0,Y(i,{fileName:"Room1",title:"户型图"},{default:At(()=>[Y(S0)]),_:1}),N0,Y(i,{fileName:"Room2",title:"户型图"},{default:At(()=>[Y(R0)]),_:1}),I0,Y(i,{fileName:"ElectronicComponents1",title:"示例"},{default:At(()=>[Y(Gd)]),_:1}),B0,Y(i,{fileName:"ElectronicComponents2",title:"示例"},{default:At(()=>[Y($d)]),_:1}),F0,Y(i,{fileName:"ElectronicComponents3",title:"示例"},{default:At(()=>[Y(Yd)]),_:1}),W0,Y(i,{fileName:"ElectronicComponents4",title:"示例"},{default:At(()=>[Y(Zd)]),_:1}),H0,Y(i,{fileName:"ElectronicComponents5",title:"示例"},{default:At(()=>[Y(jd)]),_:1}),G0,Y(i,{fileName:"Fishbone",title:"鱼骨图"},{default:At(()=>[Y(Qd)]),_:1}),U0,Y(i,{fileName:"DotChart",title:"圆点图"},{default:At(()=>[Y(nv)]),_:1}),$0])}}});export{q0 as __pageData,Z0 as default};
