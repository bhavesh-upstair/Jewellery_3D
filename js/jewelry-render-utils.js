import * as THREE from 'three';

export const METALS = {
  white:  { color: 0xECECEC, metalness: 1, roughness: 0.10, envMapIntensity: 2.0 },
  yellow: { color: 0xFCEA9F, metalness: 1, roughness: 0.07, envMapIntensity: 2.0 },
  rose:   { color: 0xFFD0B7, metalness: 1, roughness: 0.08, envMapIntensity: 2.0 },
};

export const GEM = {
  color: 0xbbbbbb,
  metalness: 0,
  roughness: 0.02,
  transmission: 0,
  ior: 2.42,
  dispersion: 0.035,
  thickness: 0,
  attenuationColor: 0xffffff,
  attenuationDistance: 3,
  envMapIntensity: 2.0,
  clearcoat: 1,
  clearcoatRoughness: 0,
  specularIntensity: 1,
  reflectivity: 1,
  transparent: false,
  opacity: 1,
};

export const CAM_PRESETS = {
  front: new THREE.Vector3(0.00, 0.60, 0.50),
  angle: new THREE.Vector3(0.50, 0.38, 0.82),
  top:   new THREE.Vector3(0.00, 1.15, 0.18),
};

const sparkleSprites = [];

export function createDiamondMaterial(overrides = {}) {
  return new THREE.MeshPhysicalMaterial({
    ...GEM,
    flatShading: true,
    side: THREE.FrontSide,
    ...overrides,
  });
}

export function createFacetedDiamondMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uLight: { value: new THREE.Vector3(-0.35, 0.78, 0.52).normalize() },
      uView:  { value: new THREE.Vector3(0.18, 0.28, 1.0).normalize() },
      uBase:  { value: new THREE.Color(0xbbbbbb) },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorld;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorld = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec3 vNormal;
      varying vec3 vWorld;
      uniform vec3 uLight;
      uniform vec3 uView;
      uniform vec3 uBase;

      float bands(float v) {
        return floor(v * 7.0) / 7.0;
      }

      void main() {
        vec3 n = normalize(vNormal);
        float l = max(dot(n, uLight), 0.0);
        float v = max(dot(n, uView), 0.0);
        float edge = pow(1.0 - abs(dot(n, vec3(0.0, 0.0, 1.0))), 1.4);
        float facet = bands(l * 0.62 + v * 0.34 + edge * 0.32);
        vec3 cool = uBase * vec3(0.72, 0.80, 0.92);
        vec3 ice = vec3(0.86, 0.91, 0.96);
        vec3 white = vec3(1.0);
        vec3 color = mix(cool, ice, facet);
        color = mix(color, white, smoothstep(0.78, 1.0, facet));
        float fire = pow(max(dot(reflect(-uLight, n), uView), 0.0), 42.0);
        gl_FragColor = vec4(color + fire * vec3(0.65, 0.78, 1.0), 1.0);
      }
    `,
  });
}

function createSparkleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.22, 'rgba(255,255,255,0.9)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  ctx.strokeStyle = 'rgba(255,255,255,0.95)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(32, 6); ctx.lineTo(32, 58);
  ctx.moveTo(6, 32); ctx.lineTo(58, 32);
  ctx.stroke();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const sparkleTexture = createSparkleTexture();

export function addDiamondSparkles(mesh, count = 10) {
  mesh.geometry.computeBoundingBox();
  const box = mesh.geometry.boundingBox;
  if (!box) return;

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const radius = Math.max(size.x, size.y, size.z) * 0.5;

  for (let i = 0; i < count; i++) {
    const material = new THREE.SpriteMaterial({
      map: sparkleTexture,
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });
    const sprite = new THREE.Sprite(material);
    const a = (i / count) * Math.PI * 2 + Math.random() * 0.35;
    const r = radius * (0.18 + Math.random() * 0.62);
    sprite.position.set(
      center.x + Math.cos(a) * r,
      center.y + (Math.random() - 0.5) * size.y * 0.35,
      center.z + Math.sin(a) * r * 0.55
    );
    const s = radius * (0.045 + Math.random() * 0.045);
    sprite.scale.set(s, s, s);
    sprite.userData.phase = Math.random() * Math.PI * 2;
    sprite.userData.speed = 1.7 + Math.random() * 2.3;
    sprite.userData.baseScale = s;
    mesh.add(sprite);
    sparkleSprites.push(sprite);
  }
}

export function addDiamondFacetCore(mesh) {
  const core = new THREE.Mesh(mesh.geometry, createFacetedDiamondMaterial());
  core.scale.setScalar(0.985);
  core.renderOrder = 2;
  core.userData.skipMaterial = true;
  core.userData.isFacetCore = true;
  mesh.add(core);
}

export function updateDiamondSparkles(timeSeconds) {
  for (let i = sparkleSprites.length - 1; i >= 0; i--) {
    const s = sparkleSprites[i];
    if (!s.parent) {
      sparkleSprites.splice(i, 1);
      continue;
    }
    const pulse = Math.max(0, Math.sin(timeSeconds * s.userData.speed + s.userData.phase));
    s.material.opacity = pulse * pulse * 0.18;
    const scale = s.userData.baseScale * (0.75 + pulse * 0.35);
    s.scale.set(scale, scale, scale);
  }
}

export function createContactShadow(targetSize) {
  const texture = (() => {
    const s = 128;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = s;
    const ctx = canvas.getContext('2d');
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(0,0,0,0.24)');
    g.addColorStop(0.32, 'rgba(0,0,0,0.11)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    return new THREE.CanvasTexture(canvas);
  })();

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      opacity: 0.72,
    })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -targetSize * 0.285;

  function update(objects) {
    const box = new THREE.Box3();
    const tmp = new THREE.Box3();
    let hasBounds = false;

    objects.forEach(obj => {
      if (!obj) return;
      obj.updateMatrixWorld(true);
      tmp.setFromObject(obj);
      if (tmp.isEmpty()) return;
      hasBounds ? box.union(tmp) : box.copy(tmp);
      hasBounds = true;
    });

    if (!hasBounds) return;
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const footprint = Math.max(size.x, size.z) * 2.05;
    mesh.position.set(center.x, box.min.y - Math.max(size.y * 0.018, 0.004), center.z);
    mesh.scale.set(footprint, footprint, 1);
  }

  return { mesh, update };
}
