nodejs-stresstest
=================

這是一套利用 Node JS 開發的壓力測試工具，

可以先在 clientIPInfo.txt 內填入你要操控的 agent 資訊(IP,username, password)，

資料格入如下:

172.168.0.1,user1,passwd01
172.168.0.2,user2,passwd02
172.168.0.3,user3,passwd03

接下來介紹幾支目前開發的工具

1. manager.js

利用他可以讓你連進在 clientIPInfo.txt 裡面所填寫的主機下指令

2. cur_get.js

利用他來操控 linux 上的 curl 工具，以達到去訪問網站的效果

3. run.js

這支工具需要填入 2 個參數 url 及 client 個數

例如 node run.js --url example.com -c 50

這樣 run.js 會利用 ssh 登入你填寫在 clientIPInfo.txt 內的主機，

並且透過 curl_get.js 去連你所指定的網站 example.com 50 個連線

然後會回傳他們所得到的資訊(連線時間)

經過算計後，顯示出來。


註:請在利用 run.js 去下指令前，確認您的 client 主機上，是否有 /stresstest/curl_get.js 這支程式

當然您可以利用 manager.js 來在 client 主要列表上的所有主機佈署。
