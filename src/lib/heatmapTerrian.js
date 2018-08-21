import Terrian from './terrian/Terrian'
import Paopao from './paopao/Paopao'

const THREE = window.THREE

const INIT = Symbol('INIT')
const INIT_PLANE = Symbol('INIT_PLANE')
const INIT_PAOPAO = Symbol('INIT_PAOPAO')

const PLANE1_WIDTH = 925
const PLANE3_WIDTH = 325
const PLANE4_WIDTH = 543
const PLANE1_HEIGHT = 400
const PLANE3_HEIGHT = 400
const PLANE4_HEIGHT = 400


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
      height: 600,
      alpha: false
    }
    this.options = Object.assign({}, def, opt)
    this[ INIT ]()
    this[ INIT_PLANE ]()
    this[ INIT_PAOPAO ]()
    this._render()
  }
  [INIT] () {
    this.time = 0
    this.clock = new THREE.Clock()
    this.width = parseInt(getStyle(this.el, 'width'))
    this.height = parseInt(getStyle(this.el, 'height'))

    this.scene = new THREE.Scene()

    this.renderer = new THREE.WebGLRenderer({
      alpha: this.options.alpha,
      antialias: true
    })
    this.renderer.setClearAlpha(!this.options.alpha)
    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.el.appendChild(this.renderer.domElement)
    this.renderer.toneMappingExposure = Math.pow( 1.05, 4.0 )

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 5, 5000)
    this.camera.position.z = 100
    this.camera.position.y = -1000

    this.cameraControl = new THREE.TrackballControls(this.camera, this.renderer.domElement)

    let renderScene = new THREE.RenderPass(this.scene, this.camera)

    let effectFXAA = new THREE.ShaderPass( THREE.FXAAShader )
    effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight )

    //resolution, strength, radius, threshold 
    var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2( window.innerWidth, window.innerHeight ), 
      1.4,
      2,
      0.8)
    bloomPass.renderToScreen = true

    this.composer = new THREE.EffectComposer(this.renderer)
    this.composer.setSize( window.innerWidth, window.innerHeight )
    this.composer.addPass( renderScene )
    this.composer.addPass( effectFXAA )
    this.composer.addPass( bloomPass )
    this.renderer.gammaInput = true
    this.renderer.gammaOutput = true

  }
  [INIT_PLANE] () {
    this.group1 = new THREE.Group()
    this.group3 = new THREE.Group()
    this.group4 = new THREE.Group()
    this.group1.position.x = PLANE1_WIDTH / 2 - PLANE1_WIDTH / 2
    this.group1.position.z = -250

    this.group3.position.x = PLANE3_WIDTH / 2 - PLANE1_WIDTH / 2
    this.group3.position.z = 0
    this.group3.position.y = 200

    this.group4.position.x = PLANE4_WIDTH / 2 - PLANE1_WIDTH / 2
    this.group4.position.z = 250
    this.group4.position.y = 350

    this.scene.add(this.group1, this.group3, this.group4)

    this.plane1 = new Terrian({
      width: PLANE1_WIDTH,
      height: PLANE1_HEIGHT,
      planeImage: '/static/image/floor1_sm.png'
    })

    this.plane3 = new Terrian({
      width: PLANE3_WIDTH,
      height: PLANE3_HEIGHT,
      planeImage: '/static/image/floor3_sm.png'
    })

    this.plane4 = new Terrian({
      width: PLANE4_WIDTH,
      height: PLANE4_HEIGHT,
      planeImage: '/static/image/floor4_sm.png'
    })
    this.group1.add(this.plane1)
    this.group3.add(this.plane3)
    this.group4.add(this.plane4)

  }
  [ INIT_PAOPAO ] () {
    this.paopao1 = new Paopao()
    this.paopao3 = new Paopao()
    this.paopao4 = new Paopao()
    this.group1.add(this.paopao1)
    this.group3.add(this.paopao3)
    this.group4.add(this.paopao4)
  }
  setHeatmapData (data) {
    this.plane1.setData(data[1])
    this.plane3.setData(data[3])
    this.plane4.setData(data[4])
  }

  setPaopaoData (data) {
    this.paopao1.setData(data[1])
    this.paopao3.setData(data[3])
    this.paopao4.setData(data[4])
  }

  update () {
    let delta = this.clock.getDelta()
    this.plane1.update({delta})
    this.plane3.update({delta})
    this.plane4.update({delta})
    this.paopao1.update({delta})
    this.paopao3.update({delta})
    this.paopao4.update({delta})
  }

  render () {
    // this.composer.render()
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
