// Decoded excerpt from downloaded 3D Jewelry Viewer bundle.
// Source lines: 2184-2354
// Kept as reference only; do not paste this engine code into production.
    class GroundShadow {
        get center() {
            return this.ground.position.clone()
        }
        constructor(e) {
            this.three = dependencies_getThree(),
            this.decay = 1.2,
            this.gap = 0,
            this.blurriness = 1,
            this.fullscreenQuad = createFullscreenQuad("position");
            const t = this.three;
            this.container = new t.Object3D,
            this.container.name = "ground-shadow",
            this.colorUniform = {
                value: new t.Color(0)
            },
            this.scene = e,
            this.lightPosition = new t.Spherical(1,0,0);
            const r = 512;
            this.renderTarget1 = new t.WebGLRenderTarget(r,r,{
                minFilter: t.LinearFilter,
                magFilter: t.LinearFilter,
                generateMipmaps: !1,
                depthBuffer: !0,
                colorSpace: t.SRGBColorSpace,
                samples: 4
            }),
            this.renderTarget2 = new t.WebGLRenderTarget(r,r,{
                minFilter: t.LinearFilter,
                magFilter: t.LinearFilter,
                generateMipmaps: !1,
                depthBuffer: !1,
                colorSpace: t.SRGBColorSpace
            }),
            this.shadowCamera = new t.OrthographicCamera(-1,1,1,-1,0,1),
            this.shadowCamera.rotation.set(Math.PI / 2, 0, Math.PI),
            this.container.add(this.shadowCamera),
            this.sphere = new t.Mesh(new t.SphereGeometry,new t.MeshBasicMaterial({
                color: 65280,
                wireframe: !0
            })),
            this.shadowIntensityUniform = {
                value: .4
            },
            this.groundModelToShadowMapUniform = {
                value: new t.Matrix4
            };
            const n = {
                value: null
            }
              , i = {
                value: new t.Vector2
            };
            this.blurPass = {
                uDiffuse: n,
                uD: i,
                material: new t.ShaderMaterial({
                    uniforms: {
                        uDiffuse: n,
                        uD: i
                    },
                    vertexShader: "\n                    varying vec2 vUv;\n                    void main() {\n                        gl_Position = vec4(position.xy, 0, 1);\n                        vUv = 0.5 * position.xy + 0.5;\n                    }",
                    fragmentShader: "\n                    uniform sampler2D uDiffuse;\n                    uniform vec2 uD;\n\n                    varying vec2 vUv;\n\n                    float blurChannel(const vec4 channel, const float factor) {\n                        float sum = 0.0;\n                        sum += dot(channel, texture2D(uDiffuse, vUv - factor * 4.0 * uD) * 0.051);\n                        sum += dot(channel, texture2D(uDiffuse, vUv - factor * 3.0 * uD) * 0.0918);\n                        sum += dot(channel, texture2D(uDiffuse, vUv - factor * 2.0 * uD) * 0.12245);\n                        sum += dot(channel, texture2D(uDiffuse, vUv - factor * 1.0 * uD) * 0.1531);\n                        sum += dot(channel, texture2D(uDiffuse, vUv) * 0.1633);\n                        sum += dot(channel, texture2D(uDiffuse, vUv + factor * 1.0 * uD) * 0.1531);\n                        sum += dot(channel, texture2D(uDiffuse, vUv + factor * 2.0 * uD) * 0.12245);\n                        sum += dot(channel, texture2D(uDiffuse, vUv + factor * 3.0 * uD) * 0.0918);\n                        sum += dot(channel, texture2D(uDiffuse, vUv + factor * 4.0 * uD) * 0.051);\n                        return sum;\n                    }\n\n                    void main() {\n                        gl_FragColor = vec4(\n                            blurChannel(vec4(1, 0, 0, 0), 1.0),\n                            blurChannel(vec4(0, 1, 0, 0), 0.5),\n                            blurChannel(vec4(0, 0, 1, 0), 0.2),\n                            1\n                        );\n                    }",
                    blending: t.NoBlending,
                    depthTest: !1,
                    depthWrite: !1
                })
            };
            const a = {
                value: 0
            }
              , s = {
                value: 1
            };
            this.depthPass = {
                uGroundY: a,
                uYScaling: s,
                material: new t.ShaderMaterial({
                    uniforms: {
                        uGroundY: a,
                        uYScaling: s
                    },
                    vertexShader: "\n                    out vec4 vWorldPosition;\n                    void main() {\n                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);\n                        vWorldPosition = modelMatrix * vec4(position, 1);\n\n                    }",
                    fragmentShader: "\n                    uniform float uGroundY;\n                    uniform float uYScaling;\n                    in vec4 vWorldPosition;\n                    void main() {\n                        float y = vWorldPosition.y / vWorldPosition.w;\n                        float value = 1.0 - uYScaling * (y - uGroundY);\n                        value = max(0.0, value);\n                        value = pow(value, 4.0);\n                        gl_FragColor = vec4(vec3(value), 1);\n                    }"
                })
            },
            this.ground = new t.Mesh(new t.PlaneGeometry,new t.ShaderMaterial({
                glslVersion: "300 es",
                uniforms: {
                    uTexture: {
                        value: this.renderTarget1.texture
                    },
                    uIntensity: this.shadowIntensityUniform,
                    uModelToShadowmap: this.groundModelToShadowMapUniform
                },
                vertexShader: "\n                    uniform mat4 uModelToShadowmap;\n\n                    out vec3 vShadowUv;\n\n                    void main() {\n                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);\n                        \n                        vec4 shadowPosition = uModelToShadowmap * vec4(position, 1);\n                        shadowPosition.xyz /= shadowPosition.w;\n                        vShadowUv = vec3(\n                            0.5 * shadowPosition.xy + 0.5,\n                            0.5 * shadowPosition.z\n                        );\n                    }",
                fragmentShader: "\n                    precision mediump float;\n                \n                    uniform sampler2D uTexture;\n                    uniform float uIntensity;\n\n                    in vec3 vShadowUv;\n                    out vec4 fragColor;\n        \n                    float sampleShadow() {\n                        if (vShadowUv.x < 0.0 || vShadowUv.x > 1.0 || vShadowUv.y < 0.0 || vShadowUv.y > 1.0) {\n                            return 0.0;\n                        }\n\n                        vec4 sampled = texture(uTexture, vShadowUv.xy);\n                        float blurFactor = clamp(-vShadowUv.z, 0.0, 1.0);\n                        vec3 contributions = clamp(1.0 - abs(3.0 * blurFactor - vec3(2.0, 1.0, 0.0)), 0.0, 1.0);\n                        return dot(sampled.rgb, contributions);\n                    }\n\n                    void main() {\n                        float shadow = uIntensity * sampleShadow();\n                        if (shadow < 0.0001) {\n                            discard;\n                        }\n                        fragColor = vec4(0, 0, 0, shadow);\n                    }\n                    ",
                transparent: !0
            })),
            this.ground.castShadow = !1,
            this.ground.receiveShadow = !1,
            this.ground.rotation.set(-Math.PI / 2, 0, 0),
            this.container.add(this.ground)
        }
        update(e) {
            const t = this.three;
            this.lightPosition.radius = 1;
            const r = (new t.Vector3).setFromSpherical(this.lightPosition)
              , n = (new t.Box3).setFromObject(this.scene, !0)
              , i = n.getBoundingSphere(new t.Sphere);
            this.sphere.scale.set(i.radius, i.radius, i.radius),
            this.sphere.position.copy(i.center);
            const a = 10 * i.radius;
            this.ground.scale.set(a, a, 1),
            this.ground.position.set(i.center.x, n.min.y - this.gap * (n.max.y - n.min.y), i.center.z),
            this.ground.updateMatrixWorld(!0),
            this.depthPass.uGroundY.value = this.ground.position.y,
            this.depthPass.uYScaling.value = this.decay / (2 * i.radius);
            const s = 4 * i.radius;
            this.shadowCamera.left = -.5 * s,
            this.shadowCamera.right = .5 * s,
            this.shadowCamera.bottom = -.5 * s,
            this.shadowCamera.top = .5 * s,
            this.shadowCamera.near = 0,
            this.shadowCamera.far = 2.2 * i.radius,
            this.shadowCamera.updateProjectionMatrix(),
            this.shadowCamera.position.copy(i.center.clone().addScaledVector(r, -1.1 * i.radius)),
            this.shadowCamera.lookAt(i.center),
            this.shadowCamera.updateMatrixWorld(!0),
            this.groundModelToShadowMapUniform.value.identity(),
            this.groundModelToShadowMapUniform.value.premultiply(this.ground.matrixWorld),
            this.groundModelToShadowMapUniform.value.premultiply(this.shadowCamera.matrixWorldInverse),
            this.groundModelToShadowMapUniform.value.premultiply(this.shadowCamera.projectionMatrix),
            e.getClearColor(this.colorUniform.value);
            const o = {
                autoClear: e.autoClear,
                clearColor: e.getClearColor(new t.Color),
                clearAlpha: e.getClearAlpha(),
                renderTarget: e.getRenderTarget(),
                sortObjects: e.sortObjects
            }
              , c = new Map;
            this.scene.traverseVisible(e => {
                isMesh(e) && (c.set(e, e.material),
                e.material = this.depthPass.material)
            }
            ),
            e.autoClear = !1,
            e.setRenderTarget(this.renderTarget1),
            e.sortObjects = !1,
            e.setClearColor(0, 0),
            e.clear(!0, !0),
            this.container.visible = !1,
            e.render(this.scene.parent, this.shadowCamera),
            this.container.visible = !0;
            for (const [e,t] of c.entries())
                e.material = t;
            this.blur(e, 4 * this.blurriness),
            this.blur(e, .7 * this.blurriness),
            e.setRenderTarget(o.renderTarget),
            e.autoClear = o.autoClear,
            e.sortObjects = o.sortObjects,
            e.setClearColor(o.clearColor, o.clearAlpha)
        }
        get intensity() {
            return this.shadowIntensityUniform.value
        }
        set intensity(e) {
            this.shadowIntensityUniform.value = e
        }
        blur(e, t) {