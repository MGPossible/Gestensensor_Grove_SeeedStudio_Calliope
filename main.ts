/**
 * Grove Gesture Sensor Erweiterung (PAJ7620U2)
 */
//% color=#8f3fd1 icon="\uf20e" block="Gestensensor MG"
//% groups=['Grundfunktionen', 'Erweiterungen']
namespace gestureSensor {

    let lastGesture = 0
    let gestureChanged = false
    let initialized = false
    let backgroundStarted = false

    const gestureEventId = 3100

    const GES_ADDR = 0x73
    const GES_REG = 0x43
    const GES_REG2 = 0x44

    const INIT_REGISTERS: number[] = [
    
        0xEF,0x00,0x32,0x29,0x33,0x01,0x34,0x00,0x35,0x01,0x36,0x00,0x37,0x07,
        0x38,0x17,0x39,0x06,0x3A,0x12,0x3F,0x00,0x40,0x02,0x41,0xFF,0x42,0x01,
        0x46,0x2D,0x47,0x0F,0x48,0x3C,0x49,0x00,0x4A,0x1E,0x4B,0x00,0x4C,0x20,
        0x4D,0x00,0x4E,0x1A,0x4F,0x14,0x50,0x00,0x51,0x10,0x52,0x00,0x5C,0x02,
        0x5D,0x00,0x5E,0x10,0x5F,0x3F,0x60,0x27,0x61,0x28,0x62,0x00,0x63,0x03,
        0x64,0xF7,0x65,0x03,0x66,0xD9,0x67,0x03,0x68,0x01,0x69,0xC8,0x6A,0x40,
        0x6D,0x04,0x6E,0x00,0x6F,0x00,0x70,0x80,0x71,0x00,0x72,0x00,0x73,0x00,
        0x74,0xF0,0x75,0x00,0x80,0x42,0x81,0x44,0x82,0x04,0x83,0x20,0x84,0x20,
        0x85,0x00,0x86,0x10,0x87,0x00,0x88,0x05,0x89,0x18,0x8A,0x10,0x8B,0x01,
        0x8C,0x37,0x8D,0x00,0x8E,0xF0,0x8F,0x81,0x90,0x06,0x91,0x06,0x92,0x1E,
        0x93,0x0D,0x94,0x0A,0x95,0x0A,0x96,0x0C,0x97,0x05,0x98,0x0A,0x99,0x41,
        0x9A,0x14,0x9B,0x0A,0x9C,0x3F,0x9D,0x33,0x9E,0xAE,0x9F,0xF9,0xA0,0x48,
        0xA1,0x13,0xA2,0x10,0xA3,0x08,0xA4,0x30,0xA5,0x19,0xA6,0x10,0xA7,0x08,
        0xA8,0x24,0xA9,0x04,0xAA,0x1E,0xAB,0x1E,0xCC,0x19,0xCD,0x0B,0xCE,0x13,
        0xCF,0x64,0xD0,0x21,0xD1,0x0F,0xD2,0x88,0xE0,0x01,0xE1,0x04,0xE2,0x41,
        0xE3,0xD6,0xE4,0x00,0xE5,0x0C,0xE6,0x0A,0xE7,0x00,0xE8,0x00,0xE9,0x00,
        0xEE,0x07,0xEF,0x01,0x00,0x1E,0x01,0x1E,0x02,0x0F,0x03,0x10,0x04,0x02,
        0x05,0x00,0x06,0xB0,0x07,0x04,0x08,0x0D,0x09,0x0E,0x0A,0x9C,0x0B,0x04,
        0x0C,0x05,0x0D,0x0F,0x0E,0x02,0x0F,0x12,0x10,0x02,0x11,0x02,0x12,0x00,
        0x13,0x01,0x14,0x05,0x15,0x07,0x16,0x05,0x17,0x07,0x18,0x01,0x19,0x04,
        0x1A,0x05,0x1B,0x0C,0x1C,0x2A,0x1D,0x01,0x1E,0x00
        ]

    function writeReg(reg: number, value: number): void {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(GES_ADDR, buf)
    }

    function readReg(reg: number): number {
        let buf = pins.createBuffer(1)
        buf[0] = reg

        pins.i2cWriteBuffer(GES_ADDR, buf)

        let result = pins.i2cReadBuffer(
            GES_ADDR,
            1
        )

        return result[0]
    }

    function selectBank(bank: number): void {
        writeReg(0xEF, bank)
    }

    export function init(): void {

        if (initialized)
            return

        basic.pause(10)

        selectBank(0)

        let sensorID =
            readReg(0x00)

        if (sensorID != 0x20) {
            return
        }

        for (
            let i = 0;
            i < INIT_REGISTERS.length;
            i += 2
        ) {

            writeReg(
                INIT_REGISTERS[i],
                INIT_REGISTERS[i + 1]
            )

            basic.pause(1)
        }

        selectBank(0)

        initialized = true

        basic.pause(200)
    }

    function leseGeste(): number {

        if (!initialized)
            init()

        let g1 = readReg(GES_REG)
        let g2 = readReg(GES_REG2)

        let gesture = 0

        if (g1 != 0)
            gesture = g1
        else if (g2 == 0x01)
            gesture = 0x100

        gestureChanged =
            (
                gesture != 0 &&
                gesture != lastGesture
            )

        if (gesture != 0)
            lastGesture = gesture

        return gesture
    }

    export function erkannteGesteAlsZahl(): number {
        return leseGeste()
    }

    export function erkannteGesteAlsName(): string {
        leseGeste()
        return nameVonGeste(lastGesture)
    }

    export function onGesture(
        g: GestureType,
        handler: () => void
    ) {

        control.onEvent(
            gestureEventId,
            g,
            handler
        )

        if (backgroundStarted)
            return

        backgroundStarted = true

        control.inBackground(() => {

            let previous = 0

            while (true) {

                let current =
                    leseGeste()

                if (
                    current != 0 &&
                    current != previous
                ) {

                    previous =
                        current

                    control.raiseEvent(
                        gestureEventId,
                        current
                    )
                }

                basic.pause(50)
            }
        })
    }

    export function warteAufBeliebigeGeste(): void {
        while (leseGeste() == 0) {
            basic.pause(50)
        }
    }

    export function warteAufGeste(
        g: GestureType
    ): void {

        while (
            leseGeste() != g
        ) {
            basic.pause(50)
        }
    }

    export function neueGesteErkannt(): boolean {

        leseGeste()

        return gestureChanged
    }

    export function erkenneGesteInnerhalb(
        timeout: number
    ): number {

        let start =
            control.millis()

        let g = 0

        while (
            control.millis() - start <
            timeout
        ) {

            g = leseGeste()

            if (g != 0)
                break

            basic.pause(50)
        }

        return g
    }

    export function letzteGesteName(): string {
        return nameVonGeste(
            lastGesture
        )
    }

    function nameVonGeste(
        g: number
    ): string {

        switch (g) {

            case 0x01:
                return "rechts"

            case 0x02:
                return "links"

            case 0x04:
                return "hoch"

            case 0x08:
                return "runter"

            case 0x10:
                return "vorwärts"

            case 0x20:
                return "rückwärts"

            case 0x40:
                return "im Uhrzeigersinn"

            case 0x80:
                return "gegen Uhrzeigersinn"

            case 0x100:
                return "winken"

            case 0x00:
                return "keine"

            default:
                return "unbekannt"
        }
    }

    export enum GestureType {

        None = 0,

        Right = 0x01,

        Left = 0x02,

        Up = 0x04,

        Down = 0x08,

        Forward = 0x10,

        Backward = 0x20,

        Clockwise = 0x40,

        CounterClockwise = 0x80,

        Wave = 0x100
    }
}
