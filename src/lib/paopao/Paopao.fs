uniform sampler2D u_map;
uniform sampler2D u_text;
uniform float u_opacity;
uniform vec3 u_color;
varying vec2 vUv;

void main () {
  vec4 t_color =  texture2D( u_map, vUv.st );
  vec4 font_color =  texture2D( u_text, vUv.st );
  vec4 color = font_color.a > 0.5 ? font_color : t_color * vec4(u_color, u_opacity);
  gl_FragColor = color;
  // gl_FragColor.a *= u_opacity;
}