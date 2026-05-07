// Decoded excerpt from downloaded 3D Jewelry Viewer bundle.
// Source lines: 2512-2560
// Kept as reference only; do not paste this engine code into production.
    class Metal {
        constructor(e) {
            this.material = new external_THREE_namespaceObject.MeshPhysicalMaterial,
            this.dissolveMaterial = new DissolveMaterial(new external_THREE_namespaceObject.MeshPhysicalMaterial),
            this.flatMaterial = new external_THREE_namespaceObject.MeshBasicMaterial,
            this.dissolveFlatMaterial = new DissolveMaterial(new external_THREE_namespaceObject.MeshBasicMaterial),
            this.properties = defaultMetalProperties(),
            this.container = e.object,
            e.properties && this.setProperties(e.properties),
            this.applyProperties()
        }
        setProperties(e) {
            mergeMetalProperties(this.properties, e) && this.applyProperties()
        }
        reapplyMaterial() {
            const e = this.meshes;
            if (this.properties.dissolveRatio < 1) {
                for (const t of e)
                    t.visible = !0;
                let t;
                t = this.properties.dissolveRatio > 0 ? (this.properties.isFlat ? this.dissolveFlatMaterial : this.dissolveMaterial).material : this.properties.isFlat ? this.flatMaterial : this.material;
                for (const r of e)
                    r.material = t
            } else
                for (const t of e)
                    t.visible = !1
        }
        applyProperties() {
            for (const e of [this.dissolveMaterial, this.dissolveFlatMaterial])
                e.dissolveRatio = this.properties.dissolveRatio;
            for (const e of [this.material, this.dissolveMaterial.material])
                e.envMap = this.properties.envMap,
                e.envMapIntensity = this.properties.envMapIntensity,
                e.metalness = this.properties.metalness,
                e.roughness = this.properties.roughness,
                e.iridescence = this.properties.iridescence,
                e.iridescenceIOR = this.properties.iridescenceIOR;
            for (const e of [this.material, this.dissolveMaterial.material, this.flatMaterial, this.dissolveFlatMaterial.material])
                e.color = this.properties.color;
            this.reapplyMaterial()
        }
        get meshes() {
            const e = [];
            return this.container.traverse(t => {
                isMesh(t) && e.push(t)
            }
            ),
            e
        }