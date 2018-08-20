import vs from './terrian.vs'
import fs from './terrian.fs'

const INIT_BASEMAP = Symbol('INIT_BASEMAP')
const INIT_HEATMAP = Symbol('INIT_HEATMAP')

const HeatmapOptions = {
  radius: 100,
  maxOpacity: 0.8,
  minOpacity: 0.1,
  blur: 1,
  gradient: { 
    0.1: "rgb(0,120,255)",
    0.25: "#00ffff",
    0.45: "rgb(0,255,0)",
    0.75: "#ffff00",
    0.95: "rgb(255,0,0)"
  }
}

const GrayHeatmapOptions = {
  radius: 50,
  maxOpacity: 1,
  minOpacity: 0,
  blur: 1,
  gradient: { 
    0: "#000000",
    1.0: "#ffffff"
  }
}

class Terrian extends THREE.Object3D {
  constructor (opt) {
    super()
    let def = {
      width: 800,
      height: 600,
      planeImage: null
    }
    this.options = Object.assign({}, def, opt)
    this[INIT_BASEMAP]()
    this[INIT_HEATMAP]()
  }
  [ INIT_BASEMAP ] () {
    var plane = new THREE.Mesh(
      new THREE.PlaneGeometry(this.options.width, this.options.height),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(this.options.planeImage),
        color: '#6699ff',
        side: THREE.DoubleSide
      })
    )
    plane.position.x = this.options.width / 2
    this.add(plane)
  }
  [ INIT_HEATMAP ] () {
    let geometry = new THREE.PlaneBufferGeometry(this.options.width, this.options.height, 100, 100)

    this.heatmap = this.createHeatmap(HeatmapOptions)

    this.oldHeatmap = this.createHeatmap(HeatmapOptions)

    this.grayHeightmap = this.createHeatmap(GrayHeatmapOptions)

    this.oldGrayHeightmap = this.createHeatmap(GrayHeatmapOptions)

    let texture = new THREE.CanvasTexture(this.heatmap._renderer.canvas)
    let oldTexture = new THREE.CanvasTexture(this.oldHeatmap._renderer.canvas)

    let grayTexture = new THREE.CanvasTexture(this.grayHeightmap._renderer.canvas)
    let oldGrayTexture = new THREE.CanvasTexture(this.oldGrayHeightmap._renderer.canvas)

    let material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        u_map: {
          value: texture
        },
        u_old_map: {
          value: oldTexture
        },
        u_height_map: {
          value: grayTexture
        },
        u_old_height_map: {
          value: oldGrayTexture
        },
        u_max_height: {
          value: 100
        },
        u_opacity: {
          value: 1
        },
        u_time: {
          value: this.time
        }
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      wireframe: false,
      blending: THREE.AdditiveBlending
    })
    this.plane = new THREE.Mesh(
      geometry,
      material
    )
    this.plane.position.z = 10
    this.plane.position.x = this.options.width / 2
    this.add(this.plane)
  }

  createHeatmap (opt) {
    let div = document.createElement('div')
    div.style.width = this.options.width + 'px'
    div.style.height = this.options.height + 'px'
    document.body.appendChild(div)
    let options = Object
    let heatmap = h337.create(Object.assign({}, {container: div}, opt))
    document.body.removeChild(div)
    return heatmap
  }

  setData (data) {
    let newData = JSON.parse(JSON.stringify(data))

    this.plane.material.uniforms.u_time.value = 0
    if (this.data) {
      this.oldData = this.data
    }
    this.data = newData

    this.heatmap.setData(newData)
    this.grayHeightmap.setData(newData)
    this.oldData && this.oldHeatmap.setData(this.oldData)
    this.oldData && this.oldGrayHeightmap.setData(this.oldData)

    this.plane.material.uniforms.u_map.value.needsUpdate = true
    this.plane.material.uniforms.u_old_map.value.needsUpdate = true
    this.plane.material.uniforms.u_height_map.value.needsUpdate = true
    this.plane.material.uniforms.u_old_height_map.value.needsUpdate = true
  }

  update ({delta}) {
    this.plane.material.uniforms.u_time.value += delta
  }
}

export default Terrian
