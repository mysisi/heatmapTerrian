import vs from './Paopao.vs'
import fs from './Paopao.fs'

const INIT = Symbol('INIT')
const FILL = Symbol('FILL')
const PUSH = Symbol('PUSH')
const POP = Symbol('POP')
const POOL_SIZE = 10

const BASIC_CONFIG = {
  times: 1,
  elapsed: 0,
  during: 2,
  delay: 0,
  x: 0,
  y: 0,
  z: 0,
  speed: 1,
  size: 10,
  title: ''
}

class Paopao extends THREE.Object3D {
  constructor () {
    super()
    this[INIT]()
    this.properties = new Map()
    this.resetPropeties()
    return this
  }
  setProperties (props) {
    let keys = Object.keys(props)
    keys.forEach((key) => {
      let value = props[key]
      this.setProperty(key, value)
    })
    this.sprite.position.x = this.getProperty('x')
    this.sprite.position.y = this.getProperty('y')
    this.sprite.position.z = this.getProperty('z')
    this.sprite.material.uniforms.u_scale.value = this.getProperty('size')
    this.updateCanvas()
  }
  resetPropeties () {
    let keys = Object.keys(BASIC_CONFIG)
    keys.forEach((key) => {
      let value = BASIC_CONFIG[key]
      this.properties.set(key, value)
    })
  }
  getProperty (key) {
    return this.properties.get(key)
  }
  setProperty (key, value) {
    this.properties.set(key, value)
  }
  [ INIT ] () {
    this.canvas = this.getCanvas()
    var geometry = new THREE.PlaneGeometry( 1, 1, 2, 2 )
    var texture = new THREE.TextureLoader().load('/static/image/chat2.png')
    var textTexture = new THREE.Texture(this.canvas)
    textTexture.needsUpdate = true
    var material = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: vs,
      fragmentShader: fs,
      uniforms: {
        u_color: { value: new THREE.Color('#0055aa') },
        u_map: {value: texture},
        u_text: {value: textTexture},
        u_scale: {value: 0},
        u_opacity: {value: 0.7}
      }
    })
    this.sprite = new THREE.Mesh( geometry, material )
    this.add(this.sprite)
  }
  updateCanvas () {
    let title = this.getProperty('title')
    let length = title.length
    const totalWidth = 180
    let fontSize = ~~(totalWidth / length) + 'px'
    var ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, 256, 256)
    ctx.font = 'normal normal ' + fontSize + ' 微软雅黑'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(title, 40, 90)
    this.sprite.material.uniforms.u_text.value.needsUpdate = true
  }
  getCanvas () {
    const width = 256
    const height = 256
    var canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    var ctx = canvas.getContext('2d')
    ctx.font = 'normal normal 30px 微软雅黑'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText('我只是是个测', 40, 90)
    return canvas
  }
  update ({delta}) {
    this.setProperty('elapsed', this.getProperty('elapsed') + delta)
    let during = this.getProperty('during')
    let delay = this.getProperty('delay')
    let elapsed = this.getProperty('elapsed')
    let size = this.getProperty('size')
    let percent =  (Math.max((elapsed - delay), 0) % during) / during

    this.sprite.position.z += this.getProperty('speed')
    this.sprite.material.uniforms.u_scale.value = size + Math.sin(percent * Math.PI) * size / 2
  }
}

class PaopaoAngine extends THREE.Object3D {
  constructor () {
    super()
    this.pool = []
    this[FILL]()
  }
  [ FILL ] () {
    for (let i = 0; i < POOL_SIZE; i++) {
      let paopao = new Paopao()
      paopao.visible = false
      this[PUSH](paopao)
    }
  }
  [ PUSH ] (obj) {
    this.pool.push(obj)
  }
  [ POP ] () {
    if (!this.pool.length) {
      this[ FILL ]()
    }
    return this.pool.shift()
  }
  setData (data = []) {
    data.forEach(properties => {
      let anime = this[POP]()
      anime.setProperties(properties)
      this.add(anime)
      return anime
    })
  }
  update ({delta}) {
    this.children.forEach(paopao => {
      paopao.update({delta})
      let during = paopao.getProperty('during')
      let times = paopao.getProperty('times')
      let delay = paopao.getProperty('delay')
      let elapsed = paopao.getProperty('elapsed')
      if (delay > elapsed) {
        paopao.visible = false
      } else if (during * times + delay <= elapsed) {
        this.remove(paopao)
      } else {
        if (!paopao.visible) {
          paopao.visible = true
        }
      }
    })
  }
}

export default PaopaoAngine