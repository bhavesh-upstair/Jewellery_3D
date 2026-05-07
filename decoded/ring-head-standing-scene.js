// Decoded excerpt from downloaded 3D Jewelry Viewer bundle.
// Source lines: 7385-7510
// Kept as reference only; do not paste this engine code into production.
    class RingHeadStandingScene extends Scene {
        static async create(e) {
            const [t,r,n,i,a] = await Promise.all([Ring.create({
                stores: e.stores,
                ringDescription: ring1_description,
                metalType: e.stateProxy.state.metalColor
            }), e.stores.cubeMaps.get(ECubeMap.BASIC_REFRACTION), e.stores.envMaps.get(EEnvMap.DARK), e.stores.metalTypes.loadAll(), e.stores.gemTypes.loadAll()]);
            return new RingHeadStandingScene({
                ...e,
                ring: t,
                gemsEnvMap: r,
                metalEnvMap: n,
                stores: {
                    metalTypes: i,
                    gemTypes: a
                }
            })
        }
        constructor(e) {
            super({
                stateProxy: e.stateProxy,
                name: "ring-head-standing-scene"
            }),
            this.cameraMovement = null,
            this.backgroundColor = 16185078,
            this.parameters = {
                metal: {
                    envMapIntensity: 2,
                    rawColor: 16777215
                },
                gems: {
                    rawColor: 12303291,
                    type: EGemType.DIAMOND_WHITE,
                    refractionIndex: 2.42,
                    dispersion: .035
                }
            },
            this.stores = e.stores,
            this.ring = e.ring,
            this.ring.ringPosition = ERingPosition.STANDING,
            this.scene.add(this.ring.object3D);
            const t = new external_THREE_namespaceObject.PerspectiveCamera;
            this.ring.update(e.renderer, t),
            this.groundShadow = new GroundShadow(this.ring.object3D),
            this.groundShadow.intensity = .4,
            this.groundShadow.decay = .8,
            this.groundShadow.lightPosition.set(1, Math.PI / 4, 3 * Math.PI / 4),
            this.groundShadow.update(e.renderer),
            this.scene.add(this.groundShadow.container),
            this.scene.translateY(-.6),
            this.ring.gemsEnvMap = e.gemsEnvMap,
            this.ring.metalEnvMap = e.metalEnvMap;
            const r = () => {
                const t = e.stores.gemTypes.get(this.parameters.gems.type);
                this.parameters.gems.rawColor = t.color,
                this.parameters.gems.refractionIndex = t.refractionIndex,
                this.updateGui()
            }
            ;
            if (this.gui = e.gui,
            this.gui) {
                {
                    const e = this.gui.addFolder("Metal");
                    e.add(this.parameters.metal, "envMapIntensity", 0, 3, .01),
                    e.addColor(this.parameters.metal, "rawColor"),
                    e.open()
                }
                {
                    const e = this.gui.addFolder("Gems");
                    e.addColor(this.parameters.gems, "rawColor"),
                    e.add(this.parameters.gems, "type", Object.values(EGemType)).onChange(r),
                    e.open()
                }
            }
            r(),
            this.applyMetal(),
            this.applyRingHead();
            const n = this.ring.transitionTime;
            this.ring.transitionTime = 0,
            this.updateRingStyle(),
            this.ring.transitionTime = n
        }
        update(e, t) {
            this.updateRingStyle(),
            this.ring.update(e, t)
        }
        initializeCamera(e) {
            e.enablePan = !1,
            e.minDistance = .5,
            e.maxDistance = 3,
            e.maxPolarAngle = 1.5,
            this.cameraMovement = {
                fromSpherical: (new external_THREE_namespaceObject.Spherical).setFromVector3(new external_THREE_namespaceObject.Vector3(0,2,0)),
                toSpherical: (new external_THREE_namespaceObject.Spherical).setFromVector3(new external_THREE_namespaceObject.Vector3(0,.6,.5)),
                transition: new Transition(1e3)
            }
        }
        hideGui() {
            var e;
            null === (e = this.gui) || void 0 === e || e.hide()
        }
        showGui() {
            var e, t;
            null === (e = this.gui) || void 0 === e || e.open(),
            null === (t = this.gui) || void 0 === t || t.show()
        }
        applyStateChange(e) {
            void 0 !== e.metalColor && this.applyMetal(),
            void 0 !== e.ringHead && this.applyRingHead()
        }
        applyMetal() {
            this.parameters.metal.rawColor = this.stores.metalTypes.get(this.state.metalColor).color,
            this.updateGui()
        }
        applyRingHead() {
            this.ring.ringHead = this.state.ringHead
        }
        updateRingStyle() {
            this.ring.metalEnvMapIntensity = this.parameters.metal.envMapIntensity,
            this.ring.metalType = this.state.metalColor,
            this.ring.gemsColor = new external_THREE_namespaceObject.Color(this.parameters.gems.rawColor),
            this.ring.gemsDispersion = this.parameters.gems.dispersion,
            this.ring.gemsRefractionIndex = this.parameters.gems.refractionIndex
        }
        updateGui() {
            if (this.gui)