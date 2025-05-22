// main.ts

/**
 * Grove Gesture Sensor Erweiterung (PAJ7620U2)
 */
//% color=#8f3fd1 icon="\uf20e" block="Gestensensor by MG"
//% groups=['Grundfunktionen', 'Erweiterungen']
namespace gestureSensor {

    let lastGesture = 0;
    let gestureChanged = false;

    const GES_ADDR = 0x73;
    const GES_REG = 0x43;

    //% block="initialisiere Gestensensor"
    //% group="Grundfunktionen"
    //% block.tooltip="Initialisiert den PAJ7620U2 Gestensensor für die Verwendung."
    export function init(): void {
        pins.i2cWriteNumber(GES_ADDR, 0xEF01, NumberFormat.UInt16BE);
        basic.pause(10);
        // (vereinfachte Initialisierung für PAJ7620U2)
    }

    //% block="erkannte Geste (als Zahl)"
    //% group="Grundfunktionen"
    //% block.tooltip="Liest die aktuell erkannte Geste als Zahl."
    export function erkannteGeste(): number {
        let g = pins.i2cReadNumber(GES_ADDR, NumberFormat.UInt8LE);
        if (g != lastGesture) {
            gestureChanged = true;
            lastGesture = g;
        } else {
            gestureChanged = false;
        }
        return g;
    }

    //% block="wenn Geste %g erkannt wurde"
    //% group="Grundfunktionen"
    //% blockTooltip="Führt den Code aus, wenn eine bestimmte Geste erkannt wird."
    export function onGesture(g: GestureType, handler: () => void): void {
        control.inBackground(() => {
            while (true) {
                if (erkannteGeste() == g) {
                    handler();
                }
                basic.pause(100);
            }
        });
    }

    //% block="Name der letzten Geste"
    //% group="Erweiterungen"
    //% block.tooltip="Gibt den Namen der zuletzt erkannten Geste als Text zurück."
    export function nameDerGeste(): string {
        switch (lastGesture) {
            case 0x01: return "rechts";
            case 0x02: return "links";
            case 0x04: return "hoch";
            case 0x08: return "runter";
            case 0x10: return "nach vorne";
            case 0x20: return "nach hinten";
            case 0x40: return "Uhrzeigersinn";
            case 0x80: return "gegen den Uhrzeigersinn";
            case 0x00: return "Keine";
            default: return "Unbekannt";
        }
    }

    //% block="Geste erkennen innerhalb von %timeout ms"
    //% group="Erweiterungen"
    //% block.tooltip="Wartet für eine bestimmte Zeit auf eine Geste und gibt deren Nummer zurück."
    export function warteAufGeste(timeout: number): number {
        let start = control.millis();
        let g = 0;
        while (control.millis() - start < timeout) {
            g = erkannteGeste();
            if (g != 0) break;
            basic.pause(50);
        }
        return g;
    }

    //% block="neue Geste erkannt?"
    //% group="Erweiterungen"
    //% block.tooltip="Gibt 'true' zurück, wenn sich die Geste seit der letzten Messung geändert hat."
    export function neueGesteErkannt(): boolean {
        erkannteGeste();
        return gestureChanged;
    }

    //% block="Pause bis eine beliebige Geste erkannt wurde"
    //% group="Erweiterungen"
    //% block.tooltip="Hält das Programm an, bis eine Geste erkannt wurde."
    export function warteAufBeliebigeGeste(): void {
        while (erkannteGeste() == 0) {
            basic.pause(50);
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
        CounterClockwise = 0x80
    }
}
