varying vec2 vUv;
uniform float u_scale;

void main () {
  vUv = uv;
  float rotation = 0.0;

  vec3 alignedPosition = vec3(position * u_scale);
  vec2 pos = alignedPosition.xy;
  vec2 rotatedPosition;
  rotatedPosition.x = cos( rotation ) * pos.x - sin( rotation ) * pos.y;
  rotatedPosition.y = sin( rotation ) * pos.x + cos( rotation ) * pos.y;

  vec4 finalPosition;
  finalPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
  finalPosition.xy += rotatedPosition;
  finalPosition = projectionMatrix * finalPosition;

  gl_Position = finalPosition;
}