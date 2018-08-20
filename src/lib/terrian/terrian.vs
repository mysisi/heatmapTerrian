uniform float u_max_height;
uniform sampler2D u_height_map;
uniform sampler2D u_old_height_map;
uniform float u_time;

varying vec2 v_uv;
varying vec3 v_position;
varying vec3 v_normal;

void main () {
  v_uv = uv;
  vec4 height_color = texture2D(u_height_map, vec2(uv.s, uv.t));
  vec3 newPosition = position.xyz;
  float height = height_color.r;
  if (u_time < 1.0) {
    vec4 old_height_color = texture2D(u_old_height_map, vec2(uv.s, uv.t));
    height = mix(old_height_color.r, height_color.r, u_time);
  }
  newPosition.z = pow(height, 1.5) * u_max_height;// height * u_max_height;//
  v_normal = normalize(normalMatrix * newPosition);
  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
  v_position = mvPosition.xyz / mvPosition.w;
  gl_Position = projectionMatrix * mvPosition;
}