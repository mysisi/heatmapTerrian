<template>
  <div ref="points" class="full">
  </div>
</template>

<script>
import HT from '../lib/heatmapTerrian.js'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted () {
    let ht = new HT(this.$refs.points)

    const MAX = 100
    const positionList = [
      [450, 730],
      [450, 1530],
      [450, 2400],
      [2100, 1200],
      [2100, 2000],
      [2100, 2800],
      [4300, 1000],
      [4300, 1300],
      [4300, 1670],
      [4300, 2500],
      [5520, 1210],
      [5520, 1860],
      [5520, 2544],
      [6080, 1210],
      [6080, 1860],
      [6080, 2544],
      [6596, 1210],
      [6596, 1860],
      [6596, 2544],
      [7100, 1210],
      [7100, 1860],
      [7100, 2544],
      [7630, 1210],
      [7630, 1860],
      [7630, 2544],
    ]

    function makeData (width, height, floor = 1) {

      let data
      if (floor === 1) {
        data = positionList.map((pos, index) => {
          return {
            x: (pos[0] + 500) / 10,
            y: pos[1] / 10,
            value: Math.random() * 75 + 25
          }
        })
      } else if (floor === 3) {
        data = positionList.filter((d, i) => {
          return i < 6
        }).map((pos, index) => {
          return {
            x: (pos[0] + 500) / 10,
            y: pos[1] / 10,
            value: Math.random() * 75 + 25
          }
        })
      } else {
        data = positionList.filter((d, i) => {
          return i > 5
        }).map((pos, index) => {
        
          return {
            x: (pos[0] - 3500) / 10,
            y: pos[1] / 10,
            value: Math.random() * 75 + 25
          }
        })
      }

      let mesh = []
      for (let i = 0; i < width; i += 75) {
        for (let j = 0; j < height; j+= 75) {
          mesh.push({
            x: i,
            y: j,
            value: 10 * Math.random()
          })
        }
      }

      // return data
      return data.concat(mesh)
      // let i = ~~(Math.random() * 500)
      // return new Array(i).fill(1).map(d => {
      //   return {
      //     x: ~~(Math.random() * 800 * 2),
      //     y: ~~(Math.random() * 600 * 2),
      //     value: Math.random() * MAX
      //   }
      // })
    }

    function makePaopaoData (width, height, floor = 1) {
      return new Array(5).fill(1).map((d, i) => {
        let title = '我只是个测试' + i
        return {
          x: (Math.random() - 0.5) * width,
          y: (Math.random() - 0.5) * height,
          size: title.length * 10,
          speed: Math.random() * 0.5 + 0.5,
          delay: Math.random() * 2,
          title: title
        }
      })
    }

    ht.setHeatmapData({
      1: {
        max: MAX,
        data: makeData(925, 400, 1)
      },
      3: {
        max: MAX,
        data: makeData(325, 400, 3)
      },
      4: {
        max: MAX,
        data: makeData(543, 400, 4)
      }
    })

    ht.setPaopaoData({
      1: makePaopaoData(925, 400, 1),
      3: makePaopaoData(325, 400, 3),
      4: makePaopaoData(543, 400, 4)
    })

    setInterval(() => {
      ht.setHeatmapData({
        1: {
          max: MAX,
          data: makeData(925, 400, 1)
        },
        3: {
          max: MAX,
          data: makeData(325, 400, 3)
        },
        4: {
          max: MAX,
          data: makeData(543, 400, 4)
        }
      })
      ht.setPaopaoData({
        1: makePaopaoData(925, 400, 1),
        3: makePaopaoData(325, 400, 3),
        4: makePaopaoData(543, 400, 4)
      })
    }, 3000)

    // let div = document.createElement('div')
    // div.style.width = '800px'
    // div.style.height = '600px'
    // this.$refs.points.appendChild(div)

    // let heatmap = h337.create({
    //   container: div
    // })
    
    // heatmap.setData({
    //   max: MAX,
    //   data: makeData()
    // })
  }
}
</script>
<style>

</style>
