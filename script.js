// Inisialisasi Blockly
var workspace = Blockly.inject('blocklyDiv', {
  toolbox: document.getElementById('toolbox'),
  grid: {
    spacing: 20,
    length: 3,
    colour: '#ccc',
    snap: true
  },
  zoom: {
    controls: true,
    wheel: true,
    startScale: 1.0,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2
  }
});

// Definisi blok-blok ESP32
Blockly.Blocks['blink_led'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Blink LED pada pin")
      .appendField(new Blockly.FieldNumber(2, 0, 40), "PIN")
      .appendField("dengan delay")
      .appendField(new Blockly.FieldNumber(1000, 100, 5000), "DELAY")
      .appendField("ms");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("Blink LED di ESP32");
  }
};

// Blok untuk mengatur LED
Blockly.Blocks['set_led'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Set LED pin")
      .appendField(new Blockly.FieldNumber(2, 0, 40), "PIN")
      .appendField("ke")
      .appendField(new Blockly.FieldDropdown([
        ["HIGH", "HIGH"],
        ["LOW", "LOW"]
      ]), "STATE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("Mengatur LED menjadi ON/OFF");
  }
};

// Blok untuk delay
Blockly.Blocks['delay_ms'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Delay")
      .appendField(new Blockly.FieldNumber(1000, 0), "DELAY")
      .appendField("ms");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("Menunda program dalam milidetik");
  }
};

// Blok untuk membaca sensor analog
Blockly.Blocks['read_analog'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Baca analog pin")
      .appendField(new Blockly.FieldNumber(36, 32, 39), "PIN");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Membaca nilai analog dari pin GPIO (32-39)");
  }
};

// Blok untuk menghubungkan ke WiFi
Blockly.Blocks['wifi_connect'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Hubungkan ke WiFi SSID")
      .appendField(new Blockly.FieldTextInput("nama_wifi"), "SSID")
      .appendField("password")
      .appendField(new Blockly.FieldTextInput("password"), "PASS");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Menghubungkan ESP32 ke jaringan WiFi");
  }
};

// Blok untuk membaca sensor DHT
Blockly.Blocks['dht_sensor'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Baca sensor DHT")
      .appendField(new Blockly.FieldDropdown([
        ["DHT11", "DHT11"],
        ["DHT22", "DHT22"]
      ]), "TYPE")
      .appendField("pin")
      .appendField(new Blockly.FieldNumber(4, 0, 40), "PIN")
      .appendField("baca")
      .appendField(new Blockly.FieldDropdown([
        ["suhu", "TEMP"],
        ["kelembaban", "HUM"]
      ]), "READING");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Membaca suhu atau kelembaban dari sensor DHT");
  }
};

// Blok untuk mengontrol servo
Blockly.Blocks['servo_control'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Set servo pin")
      .appendField(new Blockly.FieldNumber(13, 0, 40), "PIN")
      .appendField("ke sudut")
      .appendField(new Blockly.FieldNumber(90, 0, 180), "ANGLE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("Mengontrol servo motor");
  }
};

// Blok untuk membaca jarak ultrasonic
Blockly.Blocks['ultrasonic_read'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Baca jarak ultrasonic")
      .appendField("TRIG pin")
      .appendField(new Blockly.FieldNumber(5, 0, 40), "TRIG")
      .appendField("ECHO pin")
      .appendField(new Blockly.FieldNumber(6, 0, 40), "ECHO");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Membaca jarak dari sensor ultrasonic HC-SR04");
  }
};

// Blok untuk menghubungkan ke MQTT broker
Blockly.Blocks['mqtt_connect'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Hubungkan ke MQTT broker")
      .appendField(new Blockly.FieldTextInput("broker.mqtt.com"), "BROKER")
      .appendField("port")
      .appendField(new Blockly.FieldNumber(1883, 0), "PORT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("Menghubungkan ke MQTT broker");
  }
};

// Blok untuk publish pesan ke MQTT
Blockly.Blocks['mqtt_publish'] = {
  init: function () {
    this.appendValueInput("MESSAGE")
      .setCheck(null)
      .appendField("Publish ke topic")
      .appendField(new Blockly.FieldTextInput("esp/data"), "TOPIC");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("Publish pesan ke MQTT topic");
  }
};

// Generator kode untuk setiap blok
javascript.javascriptGenerator.forBlock['set_led'] = function (block) {
  var pin = block.getFieldValue('PIN');
  var state = block.getFieldValue('STATE');
  return `digitalWrite(${pin}, ${state});\n`;
};

javascript.javascriptGenerator.forBlock['delay_ms'] = function (block) {
  var delay_time = block.getFieldValue('DELAY');
  return `delay(${delay_time});\n`;
};

javascript.javascriptGenerator.forBlock['read_analog'] = function (block) {
  var pin = block.getFieldValue('PIN');
  return [`analogRead(${pin})`, Blockly.JavaScript.ORDER_ATOMIC];
};

// Generator kode Arduino untuk ESP32
javascript.javascriptGenerator.forBlock['blink_led'] = function (block) {
  var pin = block.getFieldValue('PIN');
  var delay = block.getFieldValue('DELAY');
  var code = `
  digitalWrite(${pin}, HIGH);
  delay(${delay});
  digitalWrite(${pin}, LOW);
  delay(${delay});\n`;
  return code;
};

// Generator kode untuk blok-blok baru
javascript.javascriptGenerator.forBlock['wifi_connect'] = function (block) {
  var ssid = block.getFieldValue('SSID');
  var pass = block.getFieldValue('PASS');
  return `WiFi.begin("${ssid}", "${pass}");\n` +
    `while (WiFi.status() != WL_CONNECTED) {\n` +
    `  delay(500);\n` +
    `}\n`;
};

javascript.javascriptGenerator.forBlock['dht_sensor'] = function (block) {
  var type = block.getFieldValue('TYPE');
  var pin = block.getFieldValue('PIN');
  var reading = block.getFieldValue('READING');
  var code = `dht.${reading === 'TEMP' ? 'readTemperature()' : 'readHumidity()'}`;
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

javascript.javascriptGenerator.forBlock['servo_control'] = function (block) {
  var pin = block.getFieldValue('PIN');
  var angle = block.getFieldValue('ANGLE');
  return `servo${pin}.write(${angle});\n`;
};

javascript.javascriptGenerator.forBlock['ultrasonic_read'] = function (block) {
  var trig = block.getFieldValue('TRIG');
  var echo = block.getFieldValue('ECHO');
  var code = `readUltrasonic(${trig}, ${echo})`;
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

javascript.javascriptGenerator.forBlock['mqtt_connect'] = function (block) {
  var broker = block.getFieldValue('BROKER');
  var port = block.getFieldValue('PORT');
  return `mqttClient.connect("${broker}", ${port});\n`;
};

javascript.javascriptGenerator.forBlock['mqtt_publish'] = function (block) {
  var topic = block.getFieldValue('TOPIC');
  var message = Blockly.JavaScript.valueToCode(block, 'MESSAGE',
    Blockly.JavaScript.ORDER_ATOMIC) || '""';
  return `mqttClient.publish("${topic}", String(${message}));\n`;
};

// Fungsi untuk menampilkan kode
function runCode() {
  var code = Blockly.JavaScript.workspaceToCode(workspace);
  document.getElementById('codeOutput').textContent = code;
}

// Fungsi untuk upload kode via OTA
async function uploadOTA() {
  const ipAddress = document.getElementById('espIpAddress').value;
  if (!ipAddress) {
    alert('Masukkan IP Address ESP32!');
    return;
  }

  const code = Blockly.JavaScript.workspaceToCode(workspace);

  // Buat file dari kode
  const file = new Blob([code], { type: 'text/plain' });
  const formData = new FormData();
  formData.append('update', file, 'sketch.ino');

  try {
    const response = await fetch(`http://${ipAddress}/update`, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      alert('✅ Kode berhasil diupload ke ESP32!\nESP32 akan restart dalam beberapa detik.');
    } else {
      throw new Error('Upload gagal');
    }
  } catch (error) {
    alert('❌ Gagal upload: ' + error.message + '\nPastikan:\n1. IP Address benar\n2. ESP32 terhubung ke WiFi\n3. Komputer dan ESP32 dalam jaringan yang sama');
  }
}

// Fungsi untuk reset workspace
function resetBlockly() {
  workspace.clear();
  document.getElementById('codeOutput').textContent = '';
}

// Fungsi untuk generate kode dalam berbagai format
function generateCode(format = 'arduino') {
  const code = Blockly.JavaScript.workspaceToCode(workspace);
  let formattedCode = '';

  // Template dasar untuk Arduino
  const arduinoTemplate = `
#include <WiFi.h>
#include <ESPmDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
#include <DHT.h>
#include <ESP32Servo.h>
#include <PubSubClient.h>

// Inisialisasi objek
WiFiClient espClient;
PubSubClient mqttClient(espClient);
${getDHTInitCode()}
${getServoInitCode()}

void setup() {
  Serial.begin(115200);
  
  // Inisialisasi pin
  ${getInitPinCode()}
  
  // Setup sensor dan aktuator
  ${getSetupCode()}
}

void loop() {
  ${code}
}`;

  switch (format) {
    case 'cpp':
      formattedCode = convertToCpp(arduinoTemplate);
      break;
    case 'python':
      formattedCode = convertToPython(code);
      break;
    case 'binary':
      // Untuk binary, kita hanya mengembalikan kode Arduino
      formattedCode = arduinoTemplate;
      break;
    default:
      formattedCode = arduinoTemplate;
  }

  document.getElementById('codeOutput').textContent = formattedCode;
}

// Helper function untuk mendapatkan inisialisasi pin
function getInitPinCode() {
  const blocks = workspace.getAllBlocks();
  const pins = new Set();

  blocks.forEach(block => {
    if (block.type === 'blink_led' || block.type === 'set_led') {
      pins.add(block.getFieldValue('PIN'));
    }
  });

  return Array.from(pins).map(pin => `pinMode(${pin}, OUTPUT);`).join('\n  ');
}

// Konversi ke C++
function convertToCpp(code) {
  // Hapus include Arduino-specific
  return code.replace('#include <Arduino.h>', '')
    .replace('void loop()', 'int main()');
}

// Konversi ke Python
function convertToPython(code) {
  return `
from machine import Pin, PWM
import time

${code.replace('void setup()', 'def setup():')
      .replace('void loop()', 'def loop():')
      .replace('digitalWrite', 'Pin')
      .replace('delay', 'time.sleep_ms')}

if __name__ == "__main__":
    setup()
    while True:
        loop()
`;
}

// Fungsi Process OTA yang lebih sederhana
async function processOTA() {
  const format = document.querySelector('.tab-button.active').dataset.format;
  const code = document.getElementById('codeOutput').textContent;

  try {
    // Buat file sesuai format
    const filename = format === 'binary' ? 'esp32_code.ino' :
      format === 'arduino' ? 'esp32_code.ino' :
        format === 'python' ? 'esp32_code.py' :
          `esp32_code.${format}`;

    // Simpan file
    const blob = new Blob([code], { type: 'text/plain' });
    saveAs(blob, filename);

    // Tampilkan instruksi untuk binary
    if (format === 'binary') {
      alert(`File Arduino telah didownload sebagai ${filename}\n\n` +
        'Untuk mengkompilasi ke binary:\n' +
        '1. Buka Arduino IDE\n' +
        '2. Load file yang baru didownload\n' +
        '3. Pilih Tools > ESP32 Sketch Data Upload\n' +
        '4. Atau compile dan gunakan hasil binary dari folder build');
      return;
    }

    // Proses upload untuk format lain
    const ipAddress = document.getElementById('espIpAddress').value;
    if (!ipAddress) {
      throw new Error('IP Address tidak boleh kosong');
    }

    const formData = new FormData();
    formData.append('update', blob, 'sketch.ino');

    const response = await fetch(`http://${ipAddress}/update`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    alert('✅ Kode berhasil diupload ke ESP32!\nESP32 akan restart dalam beberapa detik.');
  } catch (error) {
    console.error('Upload error:', error);
    alert(`❌ Gagal upload: ${error.message}\nPastikan:\n1. IP Address benar\n2. ESP32 terhubung ke WiFi\n3. Komputer dan ESP32 dalam jaringan yang sama`);
  }
}

// Fungsi download kode
function downloadCode() {
  const format = document.querySelector('.tab-button.active').dataset.format;
  const code = document.getElementById('codeOutput').textContent;
  const blob = new Blob([code], { type: 'text/plain' });
  const filename = format === 'binary' ? 'esp32_code.bin' : format === 'arduino' ? 'esp32_code.ino' : `esp32_code.${format}`;
  saveAs(blob, filename);
}

// Event listener untuk tab buttons
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', (e) => {
    document.querySelectorAll('.tab-button').forEach(btn =>
      btn.classList.remove('active'));
    e.target.classList.add('active');
    generateCode(e.target.dataset.format);
  });
});

// Fungsi untuk mengecek koneksi ESP32
async function checkConnection() {
  const ipAddress = document.getElementById('espIpAddress').value;
  if (!ipAddress) return;

  try {
    const response = await fetch(`http://${ipAddress}/status`);
    if (response.ok) {
      updateConnectionStatus(true);
    } else {
      updateConnectionStatus(false);
    }
  } catch (error) {
    updateConnectionStatus(false);
  }
}

// Update status indikator
function updateConnectionStatus(connected) {
  const indicator = document.querySelector('.status-indicator');
  const statusText = document.getElementById('connectionStatus');

  if (connected) {
    indicator.className = 'status-indicator status-connected';
    statusText.textContent = 'Connected';
  } else {
    indicator.className = 'status-indicator status-disconnected';
    statusText.textContent = 'Disconnected';
  }
}

// Check connection setiap 5 detik
setInterval(checkConnection, 5000);

// Helper functions untuk generate kode setup
function getDHTInitCode() {
  const blocks = workspace.getAllBlocks();
  const dhtBlocks = blocks.filter(block => block.type === 'dht_sensor');
  if (dhtBlocks.length === 0) return '';

  const dhtPins = new Set(dhtBlocks.map(block => block.getFieldValue('PIN')));
  return Array.from(dhtPins).map(pin =>
    `DHT dht${pin}(${pin}, DHT11);`
  ).join('\n');
}

function getServoInitCode() {
  const blocks = workspace.getAllBlocks();
  const servoBlocks = blocks.filter(block => block.type === 'servo_control');
  if (servoBlocks.length === 0) return '';

  const servoPins = new Set(servoBlocks.map(block => block.getFieldValue('PIN')));
  return Array.from(servoPins).map(pin =>
    `Servo servo${pin};`
  ).join('\n');
}

function getSetupCode() {
  const blocks = workspace.getAllBlocks();
  let setupCode = '';

  // Setup untuk DHT
  blocks.filter(block => block.type === 'dht_sensor')
    .forEach(block => {
      const pin = block.getFieldValue('PIN');
      setupCode += `dht${pin}.begin();\n  `;
    });

  // Setup untuk Servo
  blocks.filter(block => block.type === 'servo_control')
    .forEach(block => {
      const pin = block.getFieldValue('PIN');
      setupCode += `servo${pin}.attach(${pin});\n  `;
    });

  // Setup untuk Ultrasonic
  blocks.filter(block => block.type === 'ultrasonic_read')
    .forEach(block => {
      const trig = block.getFieldValue('TRIG');
      const echo = block.getFieldValue('ECHO');
      setupCode += `pinMode(${trig}, OUTPUT);\n  `;
      setupCode += `pinMode(${echo}, INPUT);\n  `;
    });

  return setupCode;
}