export const panelVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vObjNormal;
  varying vec3 vView;

  void main() {
    vUv = uv;
    vObjNormal = normal;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

export const panelFragmentShader = /* glsl */ `
  uniform float uSweep;
  uniform float uSeed;
  uniform vec3 uHighlight;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vObjNormal;
  varying vec3 vView;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed) * 43758.5453);
  }

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vView);
    float fres = pow(1.0 - clamp(abs(dot(n, v)), 0.0, 1.0), 3.0);

    // Side faces: brushed aluminium edge
    if (abs(vObjNormal.y) < 0.5) {
      vec3 alu = mix(vec3(0.20, 0.23, 0.25), vec3(0.55, 0.60, 0.63), fres + 0.15);
      gl_FragColor = vec4(alu, 1.0);
      return;
    }

    // Top face: frame + cells (box is 1.18 x 0.78 in world units)
    vec2 world = vec2(vUv.x * 1.18, vUv.y * 0.78);
    vec2 edge = min(world, vec2(1.18, 0.78) - world);
    float frame = 1.0 - smoothstep(0.028, 0.034, min(edge.x, edge.y));

    vec2 cells = vec2(vUv.x * 6.0, vUv.y * 10.0);
    vec2 id = floor(cells);
    vec2 f = fract(cells);
    float gridLine = 1.0 - smoothstep(0.0, 0.05, min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y)));
    float busbar = 1.0 - smoothstep(0.0, 0.02, abs(f.x - 0.5) - 0.0);
    busbar *= 0.35;

    float tone = hash(id) * 0.12;
    vec3 deep = vec3(0.025, 0.075, 0.140);
    vec3 light = vec3(0.075, 0.215, 0.360);
    vec3 col = mix(deep, light, clamp(vUv.y * 0.7 + tone + 0.1, 0.0, 1.0));

    col = mix(col, vec3(0.45, 0.58, 0.70), gridLine * 0.32);
    col += vec3(0.50, 0.62, 0.72) * busbar * 0.14;

    // Sky reflection toward grazing angles, warm at the horizon
    vec3 sky = mix(vec3(0.13, 0.27, 0.44), vec3(0.96, 0.82, 0.55), fres);
    col += sky * fres * 0.85;

    // Soft travelling highlight
    float diag = (vUv.x * 0.7 + vUv.y * 0.9) / 1.6;
    float sweep = smoothstep(0.22, 0.0, abs(diag - uSweep));
    col += uHighlight * sweep * 0.32;

    col = mix(col, vec3(0.62, 0.67, 0.70), frame);

    gl_FragColor = vec4(col, 1.0);
  }
`;
