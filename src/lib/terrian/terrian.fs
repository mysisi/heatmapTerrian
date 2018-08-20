uniform float u_opacity;
uniform sampler2D u_map;
uniform sampler2D u_old_map;
uniform float u_time;

varying vec2 v_uv;
varying vec3 v_position;
varying vec3 v_normal;

void main () {
  vec4 color = texture2D(u_map, vec2(v_uv.s, v_uv.t));
  if (u_time < 1.0) {
    color = mix(texture2D(u_old_map, vec2(v_uv.s, v_uv.t)), color, u_time);
  }
  
  // vec3 N = normalize(v_normal);
  // vec3 L = normalize(vec3(-1.0, 1.0, -1.0));

  // float u_Idiff = 1.0;
  // float u_Kd = 1.0;
  // vec3 u_LightColor = vec3(0.2);
  // float i_diff = max(dot(N, L), 0.0) * u_Idiff ;
  // vec3 diffuseColor = u_Kd * i_diff * u_LightColor;
  
  // gl_FragColor = vec4(diffuseColor, color.a) + color;

  gl_FragColor = color;

  gl_FragColor.a *= u_opacity;
}