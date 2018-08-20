import Terrian from './terrian/Terrian'

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
      height: 600,
      alpha: false
    }
    this.options = Object.assign({}, def, opt)
    this[ INIT ]()
    this[ INIT_PLANE ]()
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
    this.camera.position.z = 600

    this.cameraControl = new THREE.TrackballControls(this.camera, this.renderer.domElement)

    let renderScene = new THREE.RenderPass(this.scene, this.camera)

    let effectFXAA = new THREE.ShaderPass( THREE.FXAAShader )
    effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight )

    //resolution, strength, radius, threshold 
    var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2( window.innerWidth, window.innerHeight ), 
      1.4,
      2,
      0.7)
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
    this.plane1 = new Terrian({
      width: 925,
      height: 400,
      planeImage: '/static/image/floor1_sm.png'
    })
    this.scene.add(this.plane1)

    this.plane3 = new Terrian({
      width: 325,
      height: 400,
      planeImage: '/static/image/floor3_sm.png'
    })
    this.plane3.position.z = 300
    this.scene.add(this.plane3)

    this.plane4 = new Terrian({
      width: 543,
      height: 400,
      planeImage: '/static/image/floor4_sm.png'
    })
    this.plane4.position.z = 600
    this.scene.add(this.plane4)
  }

  setData (data) {
    this.plane1.setData(data[1])
    this.plane3.setData(data[3])
    this.plane4.setData(data[4])
  }

  update () {
    let delta = this.clock.getDelta()
    this.plane1.update({delta})
    this.plane3.update({delta})
    this.plane4.update({delta})
  }

  render () {
    this.composer.render()
    // this.renderer.render(this.scene, this.camera)
    this.cameraControl.update()
  }

  _render () {
    this.update()
    this.render()
    window.requestAnimationFrame(this._render.bind(this))
  }
}

export default HeatmapTerrian
