import vs from './terrian.vs'
import fs from './terrian.fs'

const THREE = window.THREE

const INIT = Symbol('INIT')
const INIT_PLANE = Symbol('INIT_PLANE')

function getStyle (el, name) {
  if (window.getComputedStyle) {
    return window.getComputedStyle(el, null)[name]
  } else {
    return el.currentStyle[name]
  }
}

class HeatmapTerrian {
  constructor (el, opt) {
    this.el = el
    let def = {
      width: 800,
      height: 600
    }
    this.options = Object.assign({}, def, opt)
    // this.words = words
    this[ INIT ]()
    this[ INIT_PLANE ]()
    // this[ BIND_EVENTS ]()
    this._render()
  }
  [INIT] () {
    this.time = 0
    this.clock = new THREE.Clock()
    this.width = parseInt(getStyle(this.el, 'width'))
    this.height = parseInt(getStyle(this.el, 'height'))

    this.scene = new THREE.Scene()

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(this.width, this.height)
    this.el.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 5, 5000)
    this.camera.position.z = 600

    this.cameraControl = new THREE.TrackballControls(this.camera, this.renderer.domElement)

    // var plane = new THREE.Mesh(
    //   new THREE.PlaneGeometry(this.options.width, this.options.height),
    //   new THREE.MeshBasicMaterial({
    //     map: new THREE.TextureLoader().load('/static/image/test_2.png'),
    //     color: '#0066ff'
    //   })
    // )
    // this.scene.add(plane)
  }
  [INIT_PLANE] () {
    let geometry = new THREE.PlaneBufferGeometry(this.options.width, this.options.height, 100, 100)

    let div = document.createElement('div')
    div.style.width = this.options.width * 2 + 'px'
    div.style.height = this.options.height * 2 + 'px'
    document.body.appendChild(div)
    this.heatmap = h337.create({
        container: div,
        radius: 100,
        maxOpacity: 1,
        minOpacity: 0,
        blur: 1,
        gradient: { 
          0.25: "rgb(0,120,255)",
          0.55: "rgb(0,255,0)",
          0.85: "yellow",
          1.0: "rgb(255,0,0)"
        }
      })
    document.body.removeChild(div)

    let div0 = document.createElement('div')
    div0.style.width = this.options.width * 2 + 'px'
    div0.style.height = this.options.height * 2 + 'px'
    document.body.appendChild(div0)
    this.oldHeatmap = h337.create({
        container: div0,
        radius: 100,
        maxOpacity: 1,
        minOpacity: 0,
        blur: 1,
        gradient: { 
          0.25: "rgb(0,120,255)",
          0.55: "rgb(0,255,0)",
          0.85: "yellow",
          1.0: "rgb(255,0,0)"
        }
      })
    document.body.removeChild(div0)

    let div2 = document.createElement('div')
    div2.style.width = this.options.width * 2 + 'px'
    div2.style.height = this.options.height * 2 + 'px'
    document.body.appendChild(div2)
    this.grayHeightmap = h337.create({
        container: div2,
        radius: 100,
        maxOpacity: 1,
        minOpacity: 0,
        blur: 1,
        gradient: { 
          0: "#000000",
          1.0: "#ffffff"
        }
      })
    document.body.removeChild(div2)

    let div3 = document.createElement('div')
    div3.style.width = this.options.width * 2 + 'px'
    div3.style.height = this.options.height * 2 + 'px'
    document.body.appendChild(div3)
    this.oldGrayHeightmap = h337.create({
        container: div3,
        radius: 100,
        maxOpacity: 1,
        minOpacity: 0,
        blur: 1,
        gradient: { 
          0: "#000000",
          1.0: "#ffffff"
        }
      })
    document.body.removeChild(div3)

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
          value: 30
        },
        u_opacity: {
          value: 1.0
        },
        u_time: {
          value: this.time
        }
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true
    })
    this.plane = new THREE.Mesh(
      geometry,
      material
    )
    this.plane.position.z = 1
    this.scene.add(this.plane)
  }

  setData (data) {
    this.plane.material.uniforms.u_time.value = 0
    if (this.data) {
      this.oldData = this.data
    }
    this.data = data
    this.heatmap.setData(data)
    this.grayHeightmap.setData(data)
    this.oldData && this.oldHeatmap.setData(this.oldData)
    this.oldData && this.oldGrayHeightmap.setData(this.oldData)
    this.plane.material.uniforms.u_map.value.needsUpdate = true
    this.plane.material.uniforms.u_old_map.value.needsUpdate = true
    this.plane.material.uniforms.u_height_map.value.needsUpdate = true
    this.plane.material.uniforms.u_old_height_map.value.needsUpdate = true
  }

  update () {
    this.plane.material.uniforms.u_time.value += this.clock.getDelta() / 2
  }

  render () {
    this.renderer.render(this.scene, this.camera)
    this.cameraControl.update()
  }

  _render () {
    this.update()
    this.render()
    window.requestAnimationFrame(this._render.bind(this))
  }
}

export default HeatmapTerrian
