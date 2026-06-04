# 👋 Gestensensor MG – MakeCode Erweiterung

Diese Erweiterung hilft dir dabei, mit einem **Grove Gestensensor** Handbewegungen zu erkennen.
Damit kannst du Programme steuern – ganz ohne Knöpfe zu drücken ✨

Der Sensor erkennt Bewegungen wie **rechts, links, oben, unten oder Winken**.

---

## 🔌 So funktioniert der Sensor

Der Gestensensor erkennt Bewegungen deiner Hand über Infrarot-Sensoren.
Wenn du deine Hand vor dem Sensor bewegst, wertet der Sensor die Richtung aus.

👉 Dadurch kannst du Programme mit Gesten steuern – fast wie Zauberei 🪄

---

## 🚀 Grundfunktionen

### 🔧 Sensor starten

Gestensensor an A0 initialisieren

➡️ Startet den Sensor und bereitet ihn für die Verwendung vor.

---

### 👋 Geste erkennen

Geste erkennen

➡️ Liest die aktuell erkannte Bewegung aus.

Erkannte Gesten:

* Rechts
* Links
* Oben
* Unten
* Vorwärts
* Rückwärts
* Uhrzeigersinn
* Gegen den Uhrzeigersinn
* Winken

---

### ✅ Prüfen ob eine Geste erkannt wurde

Ist Geste **Rechts** erkannt

➡️ Gibt **WAHR** zurück, wenn die gewünschte Bewegung erkannt wurde.

---

### ⏳ Auf eine Geste warten

Warte auf Geste **Winken**

➡️ Das Programm wartet, bis die gewünschte Bewegung erkannt wird.

---

### ⚡ Aktion bei einer Geste ausführen

Wenn Geste **Links** erkannt

➡️ Führt automatisch Programmcode aus, sobald die Geste erkannt wird.

---

## 🧠 Erweiterungen (Extra-Funktionen)

### 📌 Letzte erkannte Geste

Letzte Geste

➡️ Gibt die zuletzt erkannte Bewegung zurück, ohne erneut zu messen.

---

### 🔍 Sensorstatus prüfen

Sensor initialisiert?

➡️ Prüft, ob der Sensor korrekt gestartet wurde.

---

### 🎛️ Gesten auswählen

Gestenauswahl

➡️ Einfaches Auswahlfeld für alle verfügbaren Gesten.

Verfügbare Gesten:

* Keine
* Rechts
* Links
* Oben
* Unten
* Vorwärts
* Rückwärts
* Uhrzeigersinn
* Gegen Uhrzeigersinn
* Winken

---

## 📋 Unterstützte Gesten

| Geste        | Beschreibung                          |
| ------------ | ------------------------------------- |
| ➡️ Rechts    | Bewegung nach rechts                  |
| ⬅️ Links     | Bewegung nach links                   |
| ⬆️ Oben      | Bewegung nach oben                    |
| ⬇️ Unten     | Bewegung nach unten                   |
| ↗️ Vorwärts  | Hand zum Sensor bewegen               |
| ↙️ Rückwärts | Hand vom Sensor weg bewegen           |
| 🔄 Uhr       | Kreisbewegung im Uhrzeigersinn        |
| 🔁 Gegen Uhr | Kreisbewegung gegen den Uhrzeigersinn |
| 👋 Winken    | Winken vor dem Sensor                 |

---

## ⚠️ Hinweise

* Sensor vor Nutzung immer initialisieren
* Winken und Kreisbewegungen sind etwas ungenauer
* Handbewegungen langsam und deutlich ausführen
* Zwischen Sensor und Hand ca. 5–20 cm Abstand halten

---

## 🎮 Ideen

* Berührungslose Steuerung bauen
* Spiele mit Handbewegungen steuern
* Menüs durch Wischen bedienen
* Roboter per Gesten steuern
* Musiksteuerung mit Handbewegungen
* Zauberstab-Projekte bauen 🪄
