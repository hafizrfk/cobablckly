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
#include <WiFi.h>
#include <ArduinoOTA.h>

const char* ssid = "Iroschool";
const char* password = "D1866VBV";

void setup() {
    Serial.begin(115200);
    pinMode(${pin}, OUTPUT);

    // Koneksi ke WiFi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\\n✅ Terhubung ke WiFi");

    // Setup OTA
    ArduinoOTA.onStart([]() {
        Serial.println("🚀 Mulai OTA...");
    });

    ArduinoOTA.onEnd([]() {
        Serial.println("\\n✅ OTA Selesai!");
    });

    ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
        Serial.printf("📦 Progress: %u%%\\r", (progress / (total / 100)));
    });

    ArduinoOTA.onError([](ota_error_t error) {
        Serial.printf("❌ Error[%u]: ", error);
    });

    ArduinoOTA.begin();
    Serial.println("📡 OTA Siap!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
}

void loop() {
    ArduinoOTA.handle();
    
    digitalWrite(${pin}, HIGH);
    delay(${delay});
    digitalWrite(${pin}, LOW);
    delay(${delay});
}
`;
  return code;
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
  let formattedCode = code;

  switch (format) {
    case 'cpp':
      formattedCode = convertToCpp(code);
      break;
    case 'python':
      formattedCode = convertToPython(code);
      break;
    case 'binary':
      formattedCode = convertToBinary(code);
      break;
  }

  document.getElementById('codeOutput').textContent = formattedCode;
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

// Konversi ke Binary
function convertToBinary(code) {
  return btoa(code); // Base64 encoding sebagai contoh
}

// Fungsi Process OTA
async function processOTA() {
  // Ambil format kode
  const format = document.querySelector('.tab-button.active').dataset.format;
  const code = document.getElementById('codeOutput').textContent;
  const blob = new Blob([code], { type: 'application/octet-stream' }); // Menggunakan tipe biner
  // const filename = format === 'binary' ? 'firmware.bin' : format === 'python' ? 'esp32_code.py' : `esp32_code.${format}`; // Pastikan format Python adalah .py
  const filename = format === 'binary' ? 'esp32_code.bin' : format === 'arduino' ? 'esp32_code.ino' : format === 'python' ? 'esp32_code.py': `esp32_code.${format}`;
  // Simpan Blob dalam variabel sementara untuk digunakan kembali saat upload
  const savedBlob = blob;

  // Unduh file ke komputer
  saveAs(blob, filename);

  // Tunggu sejenak sebelum melanjutkan upload
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mulai proses upload menggunakan blob yang telah disimpan
  const ipAddress = document.getElementById('espIpAddress').value;
  if (!ipAddress) {
    alert('Masukkan IP Address ESP32!');
    return;
  }

  const formData = new FormData();
  formData.append('update', savedBlob, 'firmware.bin'); // Nama file diubah menjadi firmware.bin untuk OTA

  try {
    const response = await fetch(`http://${ipAddress}/update`, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      alert('✅ Firmware berhasil diupload ke ESP32!\nESP32 akan restart dalam beberapa detik.');
    } else {
      throw new Error('Upload gagal');
    }
  } catch (error) {
    alert('❌ Gagal upload: ' + error.message + '\nPastikan:\n1. IP Address benar\n2. ESP32 terhubung ke WiFi\n3. Komputer dan ESP32 dalam jaringan yang sama');
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