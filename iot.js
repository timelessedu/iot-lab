// 加速度サービスUUID
const ACCELEROMETER_SERVICE_UUID = 'e95d0753-251d-470a-a062-fa1922dfa9a8';
// 加速度キャラクタリスティックUUID
const ACCELEROMETER_CHARACTERISTICS_UUID = 'e95dca4b-251d-470a-a062-fa1922dfa9a8';

// ボタンサービス
const BUTTON_SERVICE_UUID          = 'e95d9882-251d-470a-a062-fa1922dfa9a8';
const BUTTON_A_CHARACTERISTIC_UUID = 'e95dda90-251d-470a-a062-fa1922dfa9a8';
const BUTTON_B_CHARACTERISTIC_UUID = 'e95dda91-251d-470a-a062-fa1922dfa9a8';



let microbit = null;
let angle = null;
let timer = null;
let accelX = null;
let accelY = null;
let accelZ = null;
let buttonA = false;
let rgb = null;

//ボタンに応じて操作
function onClickStartButton() {
  if (!navigator.bluetooth) {
    showModal("Web Bluetooth is not supported.")
    return;
  }

  connect();
}

function onClickStopButton() {
  if (!navigator.bluetooth) {
    showModal("Web Bluetooth is not supported.")
    return;
  }

  disconnect();
}
/* -----------------------------------------------
 * IoT 実験室API
----------------------------------------------- */
function sendCommand(param)
{
  //var url = "https://api.github.com/zen"
  var url = 'http://172.29.16.10/api/v1/'  // for Hiroshima Kokusai Gakuin
  var bulbPrefix = "bulbs/HUE40"
  var id = "01"
  var api = url + bulbPrefix + id + '/statuses';

  var xhr = new XMLHttpRequest();
  //xhr.onreadystatechange = handleStateChange; // Implemented elsewhere.
  xhr.open("PUT", api, true);
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.onreadystatechange = function(){
    // 本番用
    if (xhr.readyState === 4 && xhr.status === 200){
      $('.sensor').html(xhr.responseText);
    }
    // ローカルファイル用
    if (xhr.readyState === 4 && xhr.status === 0){
      $('.sensor').html(xhr.responseText);
    }
  };
  xhr.send();
}

/* -----------------------------------------------
 * 描画関数
----------------------------------------------- */
function drawSensor()
{
  timer = setInterval(function()
	{
    document.body.style.backgroundColor = rgb;
    $('#ValueRGB').html(rgb);
    $('#ValueX').html(accelX);
    $('#ValueY').html(accelY);
    $('#ValueZ').html(accelZ);
    $('.buttonB').html("<p></p>");
    //$('.block').html("<p>" + rgb + "</p>");
  }, 1000);
}

/* -----------------------------------------------
 * 描画停止関数
----------------------------------------------- */
function stopDraw()
{
	clearInterval(timer);
	timer = null;

}

/* -----------------------------------------------
 * ペアリング開始
----------------------------------------------- */
function connect()
{
	console.log('connect');

	// BLEデバイスをスキャンする
	navigator.bluetooth.requestDevice({
		//acceptAllDevices: true,
		filters: [{
			namePrefix: 'BBC micro:bit',
		}],
		//optionalServices: [ACCELEROMETER_SERVICE_UUID, BUTTON_SERVICE_UUID]
	})
	// デバイス接続する
	.then(device => {
		console.log(device);
		microbit = device;
		return device.gatt.connect();
	})
	// 加速度センササービスを取得する
	.then(server => {
		console.log(server.getPrimaryService(BUTTON_SERVICE_UUID));
		return Promise.all([server.getPrimaryService(ACCELEROMETER_SERVICE_UUID),
      server.getPrimaryService(BUTTON_SERVICE_UUID)
    ]);
	})
	// キャラクタリスティックを取得する
	.then(service => {
		console.log(service);
		return Promise.all([service[0].getCharacteristic(ACCELEROMETER_CHARACTERISTICS_UUID),
      service[1].getCharacteristic(BUTTON_A_CHARACTERISTIC_UUID),
      service[1].getCharacteristic(BUTTON_B_CHARACTERISTIC_UUID)
    ]);
	})
	// 加速度が変化したら指定したメソッドを呼び出す
	.then(chara => {
		console.log(chara);
		chara[0].startNotifications();
		chara[0].addEventListener('characteristicvaluechanged', accelerometerChanged);

    chara[1].startNotifications();
    chara[1].addEventListener('characteristicvaluechanged', changeABtnEvent);

    chara[2].startNotifications();
    chara[2].addEventListener('characteristicvaluechanged', changeBBtnEvent);

		// 描画スタート
		drawSensor();
	})
	.catch(error => {
		showModal(error);
	});
}

/* -----------------------------------------------
 * ペアリング解除
----------------------------------------------- */
function disconnect()
{
	console.log('disconnect');

	if (!microbit || !microbit.gatt.connected)
	{
		return;
	}
	microbit.gatt.disconnect();

	// 描画ストップ
	stopDraw();
}

/* -----------------------------------------------
 * 加速度センサの値を0から255の数値にマップする
----------------------------------------------- */
function conv(val)
{
  return ('00' + parseInt(val/8 + 128).toString(16).toUpperCase()).slice(-2)
}

/* -----------------------------------------------
 * 加速度センサの値が変化したら呼び出される
----------------------------------------------- */
function accelerometerChanged(event)
{
	// 加速度X  mg
	accelX = event.target.value.getInt16(0, true);
	// 加速度Y
	accelY = event.target.value.getInt16(2, true);
	// 加速度Z
	accelZ = event.target.value.getInt16(4, true);

  // RGB
  rgb = '#' + conv(accelX) + conv(accelY) + conv(accelZ)

	// 角度
	angle = Math.atan2(accelZ, accelX) * (180.0 / Math.PI);
	if (accelZ > 0)
	{
		angle = 360.0 - angle;
	}
	angle = Math.abs(angle);

}

//Aボタンが押された際の処理
function changeABtnEvent(event) {
  var value = event.currentTarget.value.getInt8(0);
  if (value) {
    buttonA = !buttonA;
  }

  if (buttonA) {
    sendCommand("on=true")
    $('#buttonA').html("<p>オン</p>");
  } else {
    sendCommand("on=false")
    $('#buttonA').html("<p>オフ</p>");
  }

}
//Bボタンが押された際の処理
function changeBBtnEvent(evnet) {
  var value = event.currentTarget.value.getInt8(0);
  if (value) {
    var x = parseInt(accelX/8 + 128).toString()
    var y = parseInt(accelY/8 + 128).toString()
    var z = parseInt(accelZ/8 + 128).toString()

    sendCommand("rgb=[" + x + ',' + y + ',' + z + ']')
    $('#buttonB').html("<p>色を変更</p>");
  } else {
    $('#buttonB').html("<p></p>");
  }
}

//  モーダルビューの表示
function showModal(message) {
  $("#modal-message").html(message);
  $("#myModal").modal("show");
}
