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
    this.sprite.position.z = -this.getProperty('size')
    this.sprite.scale.x = this.getProperty('size')
    this.sprite.scale.y = this.getProperty('size')
    this.sprite.scale.z = this.getProperty('size')
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
    let texture = new THREE.TextureLoader().load('/static/image/paopao2.png')
    var spriteMaterial = new THREE.SpriteMaterial( { map: texture, color: '#00aaff' } )
    this.sprite = new THREE.Sprite( spriteMaterial )
    this.sprite.scale.x = 0
    this.sprite.scale.z = 0
    this.sprite.scale.y = 0
    this.add(this.sprite)
  }
  update ({delta}) {
    this.setProperty('elapsed', this.getProperty('elapsed') + delta)
    this.sprite.position.z += this.getProperty('speed')
    // this.sprite.material.rotation += 0.04
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