# IoT実験室用 Microbit 接続プログラム

## Google Chromeの設定

1. Google Chrome で下記をアドレスバーに入力してください。

chrome://flags/#enable-experimental-web-platform-features

2. Chrome の設定で Experimental Web Platform features を Enabled に変更してください

![Chrome](https://github.com/timelessedu/iot-lab/blob/master/figs/chrome.png)


## Microbit の設定

1. 拡張機能で Bluetooth を追加します]

![AddBluetooth](https://github.com/timelessedu/iot-lab/blob/master/figs/add-bluetooth.png)

2. プロジェクトの設定で "No Pairing Required: Anyone can connect via Bluetooth.　"を設定します

![Bluetooth](https://github.com/timelessedu/iot-lab/blob/master/figs/bluetooth-setting.png)

3. プログラムを作成します。「Bluetooth UART 文字列を書き出す」の番号は電球番号の下二桁を書いてください。

![Microbit](https://github.com/timelessedu/iot-lab/blob/master/figs/program.png)

4. Microbit にプログラムを書き込みます。

## HTMLファイルを準備

1. このサイトからファイルをダウンロードします。"Clone or download" のボタンを押し、"Download ZIP" のボタンを押すと zip ファイルをダウンロードできます。

![Microbit](https://github.com/timelessedu/iot-lab/blob/master/figs/download.png)


2. ZIPファイルを開き、index.html のファイルを Chrome で開きます

![index](https://github.com/timelessedu/iot-lab/blob/master/figs/start.png)


## 使い方

1. Microbit に電源を入れると、ハートマークが表示されます。この状態でサイトの［接続］ボタンを押すと、Bluetooth のペアリングの画面が表示されます。

![connect](https://github.com/timelessedu/iot-lab/blob/master/figs/win-connect.png)

2. 接続するとmicrobitの向きによって画面の色が変わります。Micro:bit をふると電球番号が設定されます。また、Aボタンを押すとライト（初期設定は1番）をオンオフできます。Bボタンを押すと画面の色に近い色のランプに色が変わります。

![exec](https://github.com/timelessedu/iot-lab/blob/master/figs/view.png)
