#include <WiFi.h>
// This file is .gitignore:ed
#include "constants.h"

#define PIN_LED 15
#define PORT 8933

WiFiServer server(PORT);

void setup()
{
  // initialize digital pin PIN_LED as an output.
  pinMode(PIN_LED, OUTPUT);

  Serial.begin(115200);
  Serial.printf("\nConnecting to ");
  Serial.println(ssid_Router);
  WiFi.disconnect();
  WiFi.begin(ssid_Router, password_Router);
  delay(1000);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.printf("IP port: %d\n", PORT);
  server.begin(PORT);
  WiFi.setAutoReconnect(true);
}

void loop() {
  WiFiClient client = server.accept();              // listen for incoming clients

  if (client) {                                     // if you get a client,
    Serial.println("Client connected.");

    // We're looping as long as the client is connected
    while (client.connected()) {
      // Check if there are any bytes to read
      if (client.available()) {
        String msg = client.readStringUntil('\n');
        Serial.println(msg);

        if (msg == "LED_ON") {
          Serial.println("Turn LED on");
          digitalWrite(PIN_LED, 1);
        } else if (msg == "LED_OFF") {
          Serial.println("Turn LED off");
          digitalWrite(PIN_LED, 0);
        } else if (msg == "LED_TOGGLE") {
          Serial.println("Toggle LED");
          digitalWrite(PIN_LED, !digitalRead(PIN_LED));
        }

        // clear the wifi receive area cache
        while (client.read() > 0);
      }

      // Check if there are bytes to read from the serial monitor
      if (Serial.available()) {
        // print it to the client
        client.print(Serial.readStringUntil('\n'));

        // clear the wifi receive area cache
        while (Serial.read() > 0);
      }
    }

    client.stop();
    Serial.println("Client Disconnected.");
  }
}
