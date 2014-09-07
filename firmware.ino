// ------------------------------------
// Pebble integration v0.3 #HackDisrupt
// ------------------------------------

// Each led represents a different door
int led1 = D0;
int led2 = D1;
int led3 = D2;

int door1 = D7;
int door2 = D6;
int door3 = D5;

int doorOpen1 = 0;
int doorOpen2 = 0;
int doorOpen3 = 0;

int allDoors = 0;

unsigned long lastTimeOpened = 0UL; // Used for fridge (door3)
unsigned long fridgeTolerate = 5000UL; // 1000UL = 1 second

// Used for fridge led blinking
int ledState = LOW;
unsigned long previousMillis = 0UL;
unsigned long interval = 100UL;

// This routine runs only once upon reset
void setup() {
    // This variable returns an integer that should be converted to binary
    // e.g.: 7 equals to 111, which means door 1, 2 and 3 are open.
    Spark.variable("allDoors", &allDoors, INT);
    
    pinMode(led1, OUTPUT);
    pinMode(led2, OUTPUT);
    pinMode(led3, OUTPUT);

    digitalWrite(led1, HIGH);
    digitalWrite(led2, HIGH);
    digitalWrite(led3, HIGH);

    pinMode(door1, INPUT_PULLUP);
    pinMode(door2, INPUT_PULLUP);
    pinMode(door3, INPUT_PULLUP);
}

// This routine loops forever
void loop() {
    doorOpen1 = digitalRead(door1);
    if (doorOpen1) {
        digitalWrite(led1, HIGH);
        allDoors |= (1 << 2);
    } else {
        digitalWrite(led1, LOW);
        allDoors &= ~(1 << 2);
    }
    
    doorOpen2 = digitalRead(door2);
    if (doorOpen2) {
        digitalWrite(led2, HIGH);
        allDoors |= (1 << 1);
    } else {
        digitalWrite(led2, LOW);
        allDoors &= ~(1 << 1);
    }
    
    doorOpen3 = digitalRead(door3);
    if (doorOpen3) {
        if (lastTimeOpened == 0UL) {
            lastTimeOpened = millis();
        }
        unsigned long delta = millis() - lastTimeOpened;
        if (delta > fridgeTolerate) {
            // Fridge is open beyond toleration!
            digitalWrite(led3, HIGH);
            allDoors |= (1 << 0);
        }
        else {
            // Fridge is open but we're under the toleration period. Blinking led
            unsigned long currentMillis = millis();
            if (currentMillis - previousMillis > interval) {
                previousMillis = currentMillis;
                if (ledState == LOW) {
                    ledState = HIGH;
                }
                else {
                    ledState = LOW;
                }
                digitalWrite(led3, ledState);
            }
        }
    } else {
        lastTimeOpened = 0UL;
        digitalWrite(led3, LOW);
        allDoors &= ~(1 << 0);
    }
}
