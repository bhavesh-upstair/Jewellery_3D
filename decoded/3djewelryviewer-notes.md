# 3D Jewelry Viewer Reference Notes

Extracted from:
- C:\Users\Bhavesh_Patel\Downloads\main-engine.min.js
- C:\Users\Bhavesh_Patel\Downloads\main-ui.min.js

Useful settings found:
- Ring-head-standing scene background: 16185078 (#F6F6F6)
- Metal env map: DARK
- Gem env/cube map: BASIC_REFRACTION
- Metal envMapIntensity: 2
- Diamond raw color: 12303291 (#BBBBBB)
- Diamond refractionIndex: 2.42
- Diamond dispersion: 0.035
- GroundShadow intensity: 0.4
- GroundShadow decay: 0.8
- GroundShadow lightPosition: spherical(1, PI / 4, 3 * PI / 4)
- Camera target motion: from Vector3(0, 2, 0) to Vector3(0, 0.6, 0.5)
- Orbit: enablePan false, minDistance 0.5, maxDistance 3, maxPolarAngle 1.5

Implementation choice in this repo:
- Use the settings and rendering approach as guidance.
- Do not copy the protected/minified engine wholesale.
- Keep the local viewer based on Three.js + our GLB model switching architecture.
