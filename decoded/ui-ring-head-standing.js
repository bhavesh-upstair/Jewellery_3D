// Decoded excerpt from downloaded 3D Jewelry Viewer bundle.
// Source lines: 820-900
// Kept as reference only; do not paste this engine code into production.
                if (e === P.PREVIOUS)
                    for (const e of this.onPrevious)
                        e();
                else {
                    if (e !== P.NEXT)
                        throw new Error(e);
                    for (const e of this.onNext)
                        e()
                }
            }
            )
        }
    }
    class V extends v {
        constructor(e, t, s) {
            super(),
            this.ringControl = new B,
            this.MetalTypesControl = new T,
            this.gemTypeControl = new H,
            this.applyState(e),
            this.ringControl.onNext.push(t),
            this.ringControl.onPrevious.push(s),
            this.MetalTypesControl.onChange.push( () => {
                this.onChange({
                    metalType: this.MetalTypesControl.selected
                })
            }
            ),
            this.gemTypeControl.onChange.push( () => {
                this.onChange({
                    gemsType: this.gemTypeControl.selected
                })
            }
            )
        }
        attach() {
            this.ringControl.attachBottom(),
            this.MetalTypesControl.attachBottom(),
            this.gemTypeControl.attachBottom()
        }
        detach() {
            this.ringControl.detach(),
            this.MetalTypesControl.detach(),
            this.gemTypeControl.detach()
        }
        applyState(e) {
            this.MetalTypesControl.selected = e.metalType,
            this.gemTypeControl.selected = e.gemsType
        }
    }
    V.initialState = {
        wantedRingId: 0,
        metalType: A.SILVER,
        gemsType: f.DIAMOND_WHITE
    },
    function(e) {
        e.RING_HEAD = "ring-head",
        e.RING_HEAD_STANDING = "ring-head-standing",
        e.RINGS = "rings",
        e.JEWELRY = "jewelry",
        e.GEMS = "gems"
    }(k || (k = {}));
    const Y = new Map([[k.RING_HEAD, {
        svgIcon: {
            path: "scenes/ring.svg"
        },
        label: k.RING_HEAD
    }], [k.RING_HEAD_STANDING, {
        svgIcon: {
            path: "scenes/ring.svg"
        },
        label: k.RING_HEAD_STANDING
    }], [k.RINGS, {
        svgIcon: {
            path: "scenes/ring.svg"
        },
        label: k.RINGS
    }], [k.JEWELRY, {
        svgIcon: {
            path: "scenes/ring.svg"
        },