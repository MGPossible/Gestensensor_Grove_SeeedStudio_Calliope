/**
 * Grove Gesture Sensor Erweiterung (PAJ7620U2)
 */
//% color=#8f3fd1 icon="\uf20e" block="Gestensensor MG"
//% groups=['Grundfunktionen', 'Erweiterungen']
namespace gestureSensor {

    let lastGesture = 0
    let gestureChanged = false
    const gestureEventId = 3100 

    const GES_ADDR = 0x73
    const GES_REG = 0x43
    const GES_REG2 = 0x44

    const INIT_REGISTERS: number[] = [
        0xEF, 0x00, 0x32, 0x29, 0x33, 0x01, 0x34, 0x00, 0x35, 0x01,
        0x36, 0x00, 0x37, 0x07, 0x38, 0x17, 0x39, 0x06, 0x3A, 0x12,
        0x3F, 0x00, 0x40, 0x02, 0x41, 0xFF, 0x42, 0x01, 0x46, 0x2D,
        0x47, 0x0F, 0x48, 0x3C, 0x49, 0x00, 0x4A, 0x1E, 0x4C, 0x20,
        0x51, 0x10, 0x5E, 0x10, 0x60, 0x27, 0x80, 0x42, 0x81, 0x44,
        0x82, 0x04, 0x8B, 0x01, 0x90, 0x06, 0x95, 0x0A, 0x96, 0x0C,
        0x97, 0x05, 0x9A, 0x14, 0x9C, 0x3F, 0xA5, 0x19, 0xCC, 0x19,
        0xCD, 0x0B, 0xCE, 0x13, 0xCF, 0x64, 0xD0, 0x21, 0xEF, 0x00,
        0x41, 0x00, 0x42, 0x00
    ]

    /**
     * Initialisiert den Gestensensor.
     */
    //% block="Initialisiere Gestensensor an Port A0"
    //% group="Grundfunktionen"
    //% block.tooltip="Initialisiert den PAJ7620U2 Gestensensor."
    export function init(): void {
        pins.i2cWriteBuffer(GES_ADDR, pins.createBufferFromArray([0xEF, 0x00]))
        basic.pause(10)

        for (let i = 0; i < INIT_REGISTERS.length; i += 2) {
            let buf = pins.createBuffer(2)
            buf[0] = INIT_REGISTERS[i]
            buf[1] = INIT_REGISTERS[i + 1]
            
            pins.i2cWriteBuffer(GES_ADDR, buf)
            basic.pause(1)
        }

        pins.i2cWriteBuffer(GES_ADDR, pins.createBufferFromArray([0xEF, 0x00]))
        pins.i2cWriteBuffer(GES_ADDR, pins.createBufferFromArray([0x72, 0x01]))
        basic.pause(10)
    }

    /**
     * Liest die aktuell erkannte Geste.
     */
    function leseGeste(): number {
        let buf = pins.createBuffer(1)
        buf[0] = GES_REG
        pins.i2cWriteBuffer(GES_ADDR, buf)

        let g1 = pins.i2cReadNumber(GES_ADDR, NumberFormat.UInt8LE)

        buf[0] = GES_REG2
        pins.i2cWriteBuffer(GES_ADDR, buf)

        let g2 = pins.i2cReadNumber(GES_ADDR, NumberFormat.UInt8LE)

        let gesture = g1 != 0 ? g1 : (g2 == 0x01 ? 0x100 : 0)

        if (gesture != lastGesture) {
            gestureChanged = true
            lastGesture = gesture
        } else {
            gestureChanged = false
        }

        return gesture
    }

    /**
     * Erkannte Geste als Zahlwert.
     */
    //% block="erkannte Geste als Zahlwert"
    //% group="Grundfunktionen"
    //% block.tooltip="Gibt die erkannte Geste als Zahl zurück."
    export function erkannteGesteAlsZahl(): number {
        return leseGeste()
    }

    /**
     * Erkannte Geste als Name.
     */
    //% block="erkannte Geste als Name"
    //% group="Grundfunktionen"
    //% block.tooltip="Gibt die erkannte Geste als Text zurück."
    export function erkannteGesteAlsName(): string {
        leseGeste()
        return nameVonGeste(lastGesture)
    }

    /**
     * Wenn bestimmte Geste erkannt wurde.
     */
    //% block="wenn Geste %g erkannt wurde"
    //% group="Grundfunktionen"
    //% block.tooltip="Führt den Code aus wenn die gewählte Geste erkannt wurde."
    export function onGesture(
        g: GestureType,
        handler: () => void
    ) {
        control.onEvent(gestureEventId, g, handler)
        
        control.inBackground(() => {
            while (true) {
                let aktuelle = leseGeste()
                
                if (aktuelle != lastGesture) {
                    lastGesture = aktuelle
                    control.raiseEvent(gestureEventId, aktuelle)
                }
                
                basic.pause(50)
            }
        })
    }

    /**
     * Pause bis beliebige Geste erkannt wurde.
     */
    //% block="Pause bis beliebige Geste erkannt wurde"
    //% group="Erweiterungen"
    //% block.tooltip="Wartet bis irgendeine Geste erkannt wurde."
    export function warteAufBeliebigeGeste(): void {
        while (leseGeste() == 0) {
            basic.pause(50)
        }
    }

    /**
     * Pause bis bestimmte Geste erkannt wurde.
     */
    //% block="Pause bis Geste %g erkannt wurde"
    //% group="Erweiterungen"
    //% block.tooltip="Wartet bis die gewählte Geste erkannt wurde."
    export function warteAufGeste(g: GestureType): void {
        while (leseGeste() != g) {
            basic.pause(50)
        }
    }

    /**
     * Neue Geste erkannt?
     */
    //% block="neue Geste erkannt?"
    //% group="Erweiterungen"
    //% block.tooltip="Gibt 'true' zurück wenn eine neue Geste erkannt wurde."
    export function neueGesteErkannt(): boolean {
        leseGeste()
        return gestureChanged
    }

    /**
     * Geste erkennen innerhalb von X ms.
     */
    //% block="Geste erkennen innerhalb von %timeout ms"
    //% group="Erweiterungen"
    //% block.tooltip="Wartet eine bestimmte Zeit auf eine Geste."
    export function erkenneGesteInnerhalb(timeout: number): number {
        let start = control.millis()
        let g = 0

        while (control.millis() - start < timeout) {
            g = leseGeste()
            
            if (g != 0) {
                break
            }
            
            basic.pause(50)
        }

        return g
    }

    /**
     * Name der letzten erkannten Geste.
     */
    //% block="Name der letzten erkannten Geste"
    //% group="Erweiterungen"
    //% block.tooltip="Gibt den Namen der letzten erkannten Geste zurück."
    export function letzteGesteName(): string {
        return nameVonGeste(lastGesture)
    }

    /**
     * Wandelt Gestenwert in Namen um.
     */
    function nameVonGeste(g: number): string {
        switch (g) {
            case 0x01: return "rechts"
            case 0x02: return "links"
            case 0x04: return "hoch"
            case 0x08: return "runter"
            case 0x10: return "vorwärts"
            case 0x20: return "rückwärts"
            case 0x40: return "im Uhrzeigersinn"
            case 0x80: return "gegen Uhrzeigersinn"
            case 0x100: return "winken"
            case 0x00: return "keine"
            default: return "unbekannt"
        }
    }

    /**
     * Mögliche Gesten
     */
    //% blockId=gesture_enum block="Geste"
    export enum GestureType {
        //% block="keine"
        None = 0,
        //% block="rechts"
        Right = 0x01,
        //% block="links"
        Left = 0x02,
        //% block="hoch"
        Up = 0x04,
        //% block="runter"
        Down = 0x08,
        //% block="vorwärts"
        Forward = 0x10,
        //% block="rückwärts"
        Backward = 0x20,
        //% block="im Uhrzeigersinn"
        Clockwise = 0x40,
        //% block="gegen Uhrzeigersinn"
        CounterClockwise = 0x80,
        //% block="winken"
        Wave = 0x100
    }
}
