varying vec2 v_uv;
uniform float u_max_height;
uniform sampler2D u_height_map;
uniform sampler2D u_old_height_map;
uniform float u_time;

void main () {
  v_uv = uv;
  vec4 height_color = texture2D(u_height_map, vec2(uv.s, uv.t));
  vec3 newPosition = position.xyz;
  if (u_time < 1.0) {
    vec4 old_height_color = texture2D(u_old_height_map, vec2(uv.s, uv.t));
    newPosition.z = mix(old_height_color.r, height_color.r, u_time) * u_max_height;
  } else {
    newPosition.z = height_color.r * u_max_height;
  }
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}