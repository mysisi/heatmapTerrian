varying vec2 v_uv;

uniform float u_opacity;
uniform sampler2D u_map;
uniform sampler2D u_old_map;
uniform float u_time;

void main () {
  vec4 color = texture2D(u_map, vec2(v_uv.s, v_uv.t));
  if (u_time < 1.0) {
    color = mix(texture2D(u_old_map, vec2(v_uv.s, v_uv.t)), color, u_time);
  }
  gl_FragColor = color;
  gl_FragColor.a *= u_opacity;
}