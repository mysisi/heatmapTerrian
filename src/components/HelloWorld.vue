<template>
  <div ref="points" style="width: 800; height: 600px">
  <!-- <div ref="points" class="full"> -->
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

    function makeData () {
      let i = ~~(Math.random() * 500)
      return new Array(i).fill(1).map(d => {
        return {
          x: ~~(Math.random() * 800 * 2),
          y: ~~(Math.random() * 600 * 2),
          value: Math.random() * MAX
        }
      })
    }

    let data = makeData()
    ht.setData({
      max: MAX,
      data: data
    })

    setInterval(() => {
      ht.setData({
        max: MAX,
        data: makeData()
      })
    }, 5000)

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
