---
title: Remote Setup Option for the Icom IC-7300
date: 2022-12-10
categories: ["sota"]
tags: ["#remote ham radio", "#icom", "#ic-7300", "#SOTA", "Antennas", "#raspberrypi"]
heroImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhgOfcZRuvi88MM7Yx-PlNUYbE18dkztAZGzVdkeLdZrG4RBYxH5-MJqgTJ8EdyKzvutm5R0thmXKNCMelhq7ewuneE6dlBKOcJrg-dR6-VmF-T1ghEvszxSUyZ4ySb4OHJPugkpEooneE4qUVlFHZeD42mNOuYZ4rn0Zd1R5zYisMWoKujeD0D0dv2_Q/s320/Screenshot%202022-12-09%2019.02.31.png"
excerpt: ""
---

While I have my SOTA gear pretty well dialed in for activating in the field, over the years I have struggled with my home station's setup. I had gotten used to temporary setups, while in the military, knowing it was only a matter of time until that next move.

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhgOfcZRuvi88MM7Yx-PlNUYbE18dkztAZGzVdkeLdZrG4RBYxH5-MJqgTJ8EdyKzvutm5R0thmXKNCMelhq7ewuneE6dlBKOcJrg-dR6-VmF-T1ghEvszxSUyZ4ySb4OHJPugkpEooneE4qUVlFHZeD42mNOuYZ4rn0Zd1R5zYisMWoKujeD0D0dv2_Q/s320/Screenshot%202022-12-09%2019.02.31.png)](<https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhgOfcZRuvi88MM7Yx-PlNUYbE18dkztAZGzVdkeLdZrG4RBYxH5-MJqgTJ8EdyKzvutm5R0thmXKNCMelhq7ewuneE6dlBKOcJrg-dR6-VmF-T1ghEvszxSUyZ4ySb4OHJPugkpEooneE4qUVlFHZeD42mNOuYZ4rn0Zd1R5zYisMWoKujeD0D0dv2_Q/s776/Screenshot%202022-12-09%2019.02.31.png>)  
---  
\- RemoteTX Web Interface -   
  
Now that we are settled in Montana I finally have an antenna permanently mounted, and RF cables properly grounded and routed into our home. I finally feel like I can chase SOTA (and POTA) like a professional ham(?). I just faced two new problems. 1) My shack is in our unheated garage (did I mention we live in Montana?). 2) My new job has me traveling around the state. Both of those issues of inconvenience have kept me off HF while at home for too long. 

  


What to do?  There are a few off-the-shelf solutions that allow you the ability to control your rig from anywhere in the world, all with varying degress of complexity. After much research and debate I settled on a company called RemoteTX ([https://www.remotetx.net](<https://www.remotetx.net>)). The key component to using their service is integrating an inexpensive RaspberryPi microcomputer to interface with the radio. The cost for their service is about $6 per month depending if you go with a six-month or twelve-month subscription. It currently works on several Icom and Electraft radios, as wells as the Yeasu FT-991.

  


Setup. I happened to have a spare RaspberryPi in my shack that I was able to recycle for this project to use with my Icom IC-7300. All I had to do was download and install the operating system and product key onto a microSD card, plug it in the Pi, power on and away it went (no mouse, keyboard, or monitor required). It can work with a wired or wireless connection (wireless just takes a little more setup). All the controls and audio are handled through a USB connection between the radio and the Pi making setup a snap. It really was amazingly easy, something I do not find myself ever saying about things in our hobby. 

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj98SjARMeZfalYydpnzBtHd9uhHOskO38vgQUG1DTFz77os_9qZ3OG4DkNNMfzlLgv6znZlVrpmnvyb6smEP4EmFGiRv03AqZdl7GuNjDUFgTQDOGjrtYtTwdOTCbPG_y8klfXOwYvPCBCSQ61u9cjG_P9mkB_TPvPkJFyak1FVsBGEJTlKnxrmmJKkg/s320/IMG_7679.JPG)](<https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj98SjARMeZfalYydpnzBtHd9uhHOskO38vgQUG1DTFz77os_9qZ3OG4DkNNMfzlLgv6znZlVrpmnvyb6smEP4EmFGiRv03AqZdl7GuNjDUFgTQDOGjrtYtTwdOTCbPG_y8klfXOwYvPCBCSQ61u9cjG_P9mkB_TPvPkJFyak1FVsBGEJTlKnxrmmJKkg/s4032/IMG_7679.JPG>)  
---  
 \- RaspberryPi -  
  
Online Access. You interface with the radio via a web page link that RemoteTX creates for you, along with a secure login. So all you need is a Chrome, Safari or other suitable internet browser to control your radio; assuming you have a microphone and speakers. That means it also works from your phone or tablet if you have a decent data/WiFi connection. The web interface allows you to utilize the majority of the radio controls. It just took me a few minutes to orientate myself on how to adjust the power, RX level and filters. RemoteTX even allows you to send CW with pre-set exchanges or you can type in directly what you would like to send at the speed you want. Additionally, it can also be set up to control auxiliary items in your shack with a little extra homework and using the GPIO pins on the Pi. Features coming in the future include: rotator control, amplifier control, and more radios.

To adjust the VFO you can either use the up/down buttons or if you have a mouse with a roller, you just hover over the digits and adjust the frequency with the roller. I found using the mouse made changing frequency even more convenient than from the front of the radio. Changing the bands or the mode is a simple mouse click. A new feature added since I tried a demo of this system six months ago, RemoteTX can now display the waterfall view from the rig.

  


Getting on the air. On my first attempt to use this I heard a POTA activator on the air in Missouri. I hit the PTT button, put out my call, and to my relief they came back to me with a 59 report. The next day I was chasing SOTA and POTA activations using my laptop at the kitchen table. I saw a spot on SOTAwatch3 of an activator in Japan on 17M CW. Listening carefully, I could just make out his CQ and callsign. I used the pre-programmed CW macros to send my call a couple times. To my surprise he responded and using the text to transmit function I landed my first QSO with Japan from Montana on 30W and my EFHW pointed in his direction. 

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj_xuqyb7lmvJ3K7mIUBUI7otZ7iCoBi7AYqggaz_dSWl4UT1ptQWO0FeFQUJvLEriAwTogsjNrbnjFTnyP8VwmjMGV6Eh3Mwc41qi-iKaL-mapNvqSt11GQFaMJp67vRZPT73BJhU_n635hRi-CPo67WY-CzByKP5m5Ph9hMaKSGSzu_4jqxpViVxzPw/w452-h105/Screenshot%202022-12-09%2019.04.08.png)](<https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj_xuqyb7lmvJ3K7mIUBUI7otZ7iCoBi7AYqggaz_dSWl4UT1ptQWO0FeFQUJvLEriAwTogsjNrbnjFTnyP8VwmjMGV6Eh3Mwc41qi-iKaL-mapNvqSt11GQFaMJp67vRZPT73BJhU_n635hRi-CPo67WY-CzByKP5m5Ph9hMaKSGSzu_4jqxpViVxzPw/s582/Screenshot%202022-12-09%2019.04.08.png>)  
---  
\- CW keyer and editable macros -   
  
Safety net. As required by FCC Part 97, if there is a malfunction the radio is programmed to stop transmitting after three minutes. Additionally, I intend to purchase a  power supply that can connect over the internet so I also have control of the radio’s and the Pi's power supplies.

  


So far I am very happy with this system. I might actually start logging again, who knows. If you have any questions about the setup, I am happy to try and answer any questions. I recommend you check out [https://www.remotetx.net](<https://remotetx.net >) for more information as well.

  


73 & happy activating and hunting,

Al ~ KH7AL

  
  
[RemoteTX Amazon site](<https://www.amazon.com/hz/wishlist/genericItemsPage/EKHJ3C740GCN?type=wishlist&filter=all&sort=default&viewType=list>) for their setup essentials