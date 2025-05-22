// main.ts

/**
 * Grove Gesture Sensor Erweiterung (PAJ7620U2)
 */
//% color=#8f3fd1 icon="\uf20e" block="Gestensensor by MG"
//% groups=['Grundfunktionen', 'Erweiterungen']
namespace gesten {

    let letzteGeste = GroveGesture.None;

    /**
     * Initialisiert den Gestensensor (PAJ7620U2).
     */
    //% group="Grundfunktionen"
    //% block="Gestensensor initialisieren"
    //% block.tooltip="Initialisiert den Gestensensor für die Erkennung von Bewegungen."
    export function initialisieren(): void {
        grove.initGesture()
    }

    /**
     * Gibt die zuletzt erkannte Geste zurück.
     */
    //% group="Grundfunktionen"
    //% block="zuletzt erkannte Geste"
    //% block.tooltip="Gibt die zuletzt erkannte Geste als Wert zurück."
    export function erkannteGeste(): number {
        letzteGeste = grove.getGestureModel()
        return letzteGeste
    }

    /**
     * Führt einen Codeblock aus, wenn eine bestimmte Geste erkannt wird.
     * @param g die zu erkennende Geste
     * @param handler der auszuführende Code
     */
    //% group="Grundfunktionen"
    //% block="wenn Geste %g erkannt"
    //% block.tooltip="Führt den angegebenen Code aus, wenn die ausgewählte Geste erkannt wird."
    export function wennGeste(g: GroveGesture, handler: () => void): void {
        grove.onGesture(g, handler);
    }

    /**
     * Zeigt die erkannte Geste auf dem Display an.
     */
    //% group="Erweiterungen"
    //% block="zeige erkannte Geste auf Display"
    //% block.tooltip="Zeigt eine Textbeschreibung der erkannten Geste auf dem Display."
    export function zeigeGeste(): void {
        let g = erkannteGeste();
        let name = ""
        switch (g) {
            case GroveGesture.Up: name = "Oben"; break;
            case GroveGesture.Down: name = "Unten"; break;
            case GroveGesture.Left: name = "Links"; break;
            case GroveGesture.Right: name = "Rechts"; break;
            case GroveGesture.Forward: name = "Vor"; break;
            case GroveGesture.Backward: name = "Zurück"; break;
            case GroveGesture.Clockwise: name = "Im Uhrzeiger"; break;
            case GroveGesture.Anticlockwise: name = "Gegen Uhr"; break;
            case GroveGesture.Wave: name = "Winken"; break;
            default: name = "Keine"; break;
        }
        basic.showString(name);
    }

    /**
     * Gibt true zurück, wenn die letzte Geste gleich der angegebenen ist.
     */
    //% group="Erweiterungen"
    //% block="letzte Geste war %g"
    //% block.tooltip="Prüft, ob die zuletzt erkannte Geste der angegebenen entspricht."
    export function istGeste(g: GroveGesture): boolean {
        return erkannteGeste() == g;
    }
}  
