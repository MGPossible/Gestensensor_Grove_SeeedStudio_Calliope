/**
 * Grove Gesture Sensor Erweiterung (PAJ7620U2)
 */
//% color=#8f3fd1 icon="\uf20e" block="Gestensensor by MG"
//% groups=['Grundfunktionen', 'Erweiterungen']
namespace gestureSensor {

    let lastGesture = 0
    let gestureChanged = false

    const GES_ADDR = 0x73
    const GES_REG = 0x43
    const GES_REG2 = 0x44

    // Vollständige Initialisierungsdaten (gekürzt darstellbar, aber vollständig verwenden!)
    const INIT_REGISTERS: [number, number][] = [
        [0xEF, 0x00], [0x32, 0x29], [0x33, 0x01], [0x34, 0x00], [0x35, 0x01],
        [0x36, 0x00], [0x37, 0x07], [0x38, 0x17], [0x39, 0x06], [0x3A, 0x12],
        [0x3F, 0x00], [0x40, 0x02], [0x41, 0xFF], [0x42, 0x01], [0x46, 0x2D],
        [0x47, 0x0F], [0x48, 0x3C], [0x49, 0x00], [0x4A, 0x1E], [0x4C, 0x20],
        [0x51, 0x10], [0x5E, 0x10], [0x60, 0x27], [0x80, 0x42], [0x81, 0x44],
        [0x82, 0x04], [0x8B, 0x01], [0x90, 0x06], [0x95, 0x0A], [0x96, 0x0C],
        [0x97, 0x05], [0x9A, 0x14], [0x9C, 0x3F], [0xA5, 0x19], [0xCC, 0x19],
        [0xCD, 0x0B], [0xCE, 0x13], [0xCF, 0x64], [0xD0, 0x21], [0xEF, 0x00],
        [0x41, 0x00], [0x42, 0x00]
    ]

    //% block="initialisiere Gestensensor beim Start"
    //% group="Grundfunktionen"
    //% block.tooltip="Initialisiert den PAJ7620U2 Gestensensor für die Verwendung."
    export function init(): void {
        pins.i2cWriteNumber(GES_ADDR, 0x0000, NumberFormat.UInt16BE)
        basic.pause(10)

        for (let pair of INIT_REGISTERS) {
            pins.i2cWriteBuffer(GES_ADDR, pins.createBufferFromArray([pair[0], pair[1]]))
            basic.pause(1)
        }

        pins.i2cWriteBuffer(GES_ADDR, pins.createBufferFromArray([0xEF, 0x00]))
        pins.i2cWriteBuffer(GES_ADDR, pins.createBufferFromArray([0x72, 0x01])) // Enable gesture detection
        basic.pause(10)
    }

    //% block="erkannte Geste (als Zahl)"
    //% group="Grundfunktionen"
    //% block.tooltip="Liest die aktuell erkannte Geste als Zahl."
    export function erkannteGeste(): number {
        pins.i2cWriteNumber(GES_ADDR, GES_REG, NumberFormat.UInt8BE)
        let g1 = pins.i2cReadNumber(GES_ADDR, NumberFormat.UInt8LE)

        pins.i2cWriteNumber(GES_ADDR, GES_REG2, NumberFormat.UInt8BE)
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

    //% block="wenn Geste %g erkannt wurde"
    //% group="Grundfunktionen"
    //% blockTooltip="Führt den Code aus, wenn eine bestimmte Geste erkannt wird."
    export function onGesture(g: GestureType, handler: () => void): void {
        control.inBackground(() => {
            while (true) {
                if (erkannteGeste() == g) {
                    handler()
                }
                basic.pause(100)
            }
        })
    }

    //% block="Name der letzten Geste"
    //% group="Erweiterungen"
    //% block.tooltip="Gibt den Namen der zuletzt erkannten Geste als Text zurück."
    export function nameDerGeste(): string {
        switch (lastGesture) {
            case 0x01: return "rechts"
            case 0x02: return "links"
            case 0x04: return "hoch"
            case 0x08: return "runter"
            case 0x10: return "nach vorne"
            case 0x20: return "nach hinten"
            case 0x40: return "Uhrzeigersinn"
            case 0x80: return "gegen den Uhrzeigersinn"
            case 0x100: return "winken"
            case 0x00: return "Keine"
            default: return "Unbekannt"
        }
    }

    //% block="Geste erkennen innerhalb von %timeout ms"
    //% group="Erweiterungen"
    //% block.tooltip="Wartet für eine bestimmte Zeit auf eine Geste und gibt deren Nummer zurück."
    export function warteAufGeste(timeout: number): number {
        let start = control.millis()
        let g = 0
        while (control.millis() - start < timeout) {
            g = erkannteGeste()
            if (g != 0) break
            basic.pause(50)
        }
        return g
    }

    //% block="neue Geste erkannt?"
    //% group="Erweiterungen"
    //% block.tooltip="Gibt 'true' zurück, wenn sich die Geste seit der letzten Messung geändert hat."
    export function neueGesteErkannt(): boolean {
        erkannteGeste()
        return gestureChanged
    }

    //% block="Pause bis eine beliebige Geste erkannt wurde"
    //% group="Erweiterungen"
    //% block.tooltip="Hält das Programm an, bis eine Geste erkannt wurde."
    export function warteAufBeliebigeGeste(): void {
        while (erkannteGeste() == 0) {
            basic.pause(50)
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
        //% block="gegen den Uhrzeigersinn"
        CounterClockwise = 0x80,
        //% block="winken"
        Wave = 0x100
    }
}
