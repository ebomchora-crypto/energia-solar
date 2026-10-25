export const panelVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const panelFragmentShader = /* glsl */ `
  uniform float uSweep;
  uniform float uTime;
  uniform vec3 uBase;
  uniform vec3 uCell;
  uniform vec3 uHighlight;

  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vec2 grid = fract(vUv * vec2(4.0, 7.0));
    float lineX = smoothstep(0.0, 0.035, grid.x) * smoothstep(1.0, 0.965, grid.x);
    float lineY = smoothstep(0.0, 0.03, grid.y) * smoothstep(1.0, 0.97, grid.y);
    float cellMask = lineX * lineY;

    vec3 color = mix(uCell, uBase, cellMask);

    float diag = (vUv.x + vUv.y) * 0.5;
    float sweep = smoothstep(0.08, 0.0, abs(diag - uSweep));
    color += uHighlight * sweep * 0.9;

    float fresnel = pow(1.0 - clamp(vNormal.z, 0.0, 1.0), 2.0);
    color += uHighlight * fresnel * 0.12;

    gl_FragColor = vec4(color, 1.0);
  }
`;
