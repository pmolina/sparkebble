// ------------------------------------
// Pebble integration v0.2 #HackDisrupt
// ------------------------------------

// Each led represents a different door
int led1 = D0; // house
int led2 = D1; // car
int led3 = D2; // fridge

int door1 = D7;
int door2 = D6;
int door3 = D5;

// Assuming all doors are closed
int doorOpen1 = 0;
int doorOpen2 = 0;
int doorOpen3 = 0;

int allDoors = 0;

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

    pinMode(door1, INPUT);
    pinMode(door2, INPUT);
    pinMode(door3, INPUT);
}

// This routine loops forever
void loop() {
    // See https://en.wikipedia.org/wiki/Bitwise_operations_in_C
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
        digitalWrite(led3, HIGH);
        allDoors |= (1 << 0);
    } else {
        digitalWrite(led3, LOW);
        allDoors &= ~(1 << 0);
    }
}