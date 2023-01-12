#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

/*const char* ssid = "Welwitschia Mirabilis";
const char* password = "tigre?2018@";*/
const char* ssid = "TPLINK";
const char* password = "gregorio@2012";

WiFiClientSecure client;
HTTPClient sender;

/////////////
// setup() //
/////////////
void setup(){

  Serial.begin(115200); // serial monitoring
  
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED){
      delay(200);
      Serial.print(".");
  }

  Serial.println(F("\nConnected to WIFI!"));

  // url do servidor nodejs hospedado no site render
  const char *host_url = "https://servidor-nodejs.onrender.com/arqsjson";
  uint16_t porta = 443;

  client.setInsecure();
  client.connect(host_url, porta);
  
  if (sender.begin(client, host_url)){
    
    uint16_t httpCode = sender.GET();

    if (httpCode > 0) 
    {
      if (httpCode == HTTP_CODE_OK){
        String payload = sender.getString();        
        Serial.println(payload);
      }
      else{
        Serial.printf("HTTP-Error: %s\n", sender.errorToString(httpCode).c_str());
      }
    }
  }
  else{
    Serial.println(F("Other HTTP error"));
    sender.end();
  }
}


////////////
// loop() //
////////////
void loop(){
  
}