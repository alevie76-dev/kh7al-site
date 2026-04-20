---
title: Raspberry Pi (Pi-top) for APRS Viewer
date: 2019-08-26
categories: ["sota"]
tags: ["#hamradio", "Hiking", "Summits On The Air", "APRS", "SOTA"]
heroImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg3jWu-pkeX2Lwt4wKADevdl3EZOQjs5xW_0F3Yxo2sRaMntRIWlgWL9PIz9Ziu4ABPNiLh5bvhg9Q0A0qH5jpsgLNZdNeNw-iqYzAucstVkX0GNwy7IRaXN0qQWdAWpfCfvWDRlw7vEgfy/s320/IMG_2069.jpg"
excerpt: ""
---

This post skirts the fringe of this blog's the[](<https://www.blogger.com/>)me as I explain how I reused an old laptop screen to build a Raspberry Pi computer (Pi-top), with the main purpose of displaying an Automated Packet Reporting System ([APRS](<https://aprs.fi/>)) map or other ham related web pages.

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg3jWu-pkeX2Lwt4wKADevdl3EZOQjs5xW_0F3Yxo2sRaMntRIWlgWL9PIz9Ziu4ABPNiLh5bvhg9Q0A0qH5jpsgLNZdNeNw-iqYzAucstVkX0GNwy7IRaXN0qQWdAWpfCfvWDRlw7vEgfy/s320/IMG_2069.jpg)](<https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg3jWu-pkeX2Lwt4wKADevdl3EZOQjs5xW_0F3Yxo2sRaMntRIWlgWL9PIz9Ziu4ABPNiLh5bvhg9Q0A0qH5jpsgLNZdNeNw-iqYzAucstVkX0GNwy7IRaXN0qQWdAWpfCfvWDRlw7vEgfy/s1600/IMG_2069.jpg>)  
---  
Raspberry Pi 4  
  
I got this idea from listening to the [ARRL](<http://www.arrl.org/>) "So Now What" podcast where the host hinted in one of the episodes about a similar build he made. With my interests piqued and a neglected, broken laptop at home I decided to give it a go.

  


###  Why a Pi dedicated to APRS?

Often I go hiking by myself to participate in Summits On The Air ([SOTA](<https://www.sota.org.uk/>)). As a precaution I always tell my family where I'm going and when I expect to return. As an added assurance I almost always utilize the APRS function of my handheld ham radio while on the trail. How this works is that my radio also has a built in GPS receiver. At preset intervals my location information is encoded (via an internal Terminal Node Controller (TNC)) and sent over amateur radio frequency as a beacon. Other stations pick up my transmission and either re-transmit it (as a repeater) or process the information and upload it to the APRS internet database for near-real-time monitoring.

With a dedicated display in our house, my plan is to fire up the Pi before I leave the for the trail head. This way my family can see where I'm at along my hikes as sometimes the APRS signal can get out even when there is no cell coverage available.

###  The Build

After a quick scrub of the internet I learned I would need at least two things:

1) A video controller for the laptop's old screen

2) A Raspberry Pi microcomputer 

  


  


The first fun part was dismantling my wife's old laptop. A chore that is always more enjoyable knowing I would not have to reassemble the many parts. It took about twenty minutes but I finally had the display removed in one piece. On the back of the screen I took note of the model information and searched on Amazon for a compatible video controller. Don't forget to also get a power adapter if not included with the controller. Those two items I was able to purchase for just under $35.

  


There are many versions of Raspberry Pi but the latest as of this post is the Raspberry Pi 4, that includes on-board Bluetooth and WiFi. You can order these with or without a micro-SD card pre-loaded with the appropriate operating system. I bought my Pi without an SD card for about $65, that included a power supply and a mini-HDMI to HDMI cable adapter.

Don't forget to order a spare keyboard and mouse if you need it. I bought a wireless set for about $27 that is rechargeable and it worked without a hitch on the first boot up. Speaking of booting up...

####  Operating System

  You can use a plethora of Linux based operating systems available for the Pi. I'm not a Linux guru by any means so by simply following the instructions included in the Raspberry Pi box and online tutorials I downloaded the operating system installer called NOOBS from the Raspberry Pi [website](<https://www.raspberrypi.org/>) onto a new micro-SD card. I chose the NOOBS Lite which is a network installer and thereby a smaller file to initially download and install on the card. With everything connected and the SD card installed into the Pi I powered it up and was delighted to see the display turn on and it began the installation process. Now what do I put this all in to make it presentable..?  

###  A Case Like No Others

With my 11-year-old son's help, we put our heads together to come up with a plan on how to enclose this new computer. We quickly settled on building a simple wood frame to mount all the components. With my meager carpentry skills I repurposed a few spare 3" x 3/4" boards that were in our garage. On the back side we used pieces of 1 3/4" x 1/2" board on the two sides to provide enough standoff from the wall for all the components on the back. A few cuts, screws and a healthy application of wood glue and it was ready for sanding and a paint job.

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgxTs0j4tF32YVLdSArKUZDHTt01EKdFY4ISrDRrrvBLwDUx-Gvbs9_o6tch81i-Ko9D-uMr_IoW0-_OGNgoKCJ4mwxxHLxPg1Ev-hIAJkig0ok-IgMzAeXP8Gk3g_FBSytZ8vn3ssEgbcK/s400/IMG_2058.jpg)](<https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgxTs0j4tF32YVLdSArKUZDHTt01EKdFY4ISrDRrrvBLwDUx-Gvbs9_o6tch81i-Ko9D-uMr_IoW0-_OGNgoKCJ4mwxxHLxPg1Ev-hIAJkig0ok-IgMzAeXP8Gk3g_FBSytZ8vn3ssEgbcK/s1600/IMG_2058.jpg>)  
---  
The completed frame ready for sanding and some paint.  
  
[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhHtZ5dPVlEhGSifEqDDz12ia3pwE48MK1bpLKLfN1Jwmee_TUj9Eg5x0brDXPQF-EMmJVExYsZEYl6mYCIzJ-vcmgu34KKx6ebHTrPr7uAAeTqqGbYAOc7wgvrjk061bRwKoCOKfyVScsK/s400/IMG_2060.jpg)](<https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhHtZ5dPVlEhGSifEqDDz12ia3pwE48MK1bpLKLfN1Jwmee_TUj9Eg5x0brDXPQF-EMmJVExYsZEYl6mYCIzJ-vcmgu34KKx6ebHTrPr7uAAeTqqGbYAOc7wgvrjk061bRwKoCOKfyVScsK/s1600/IMG_2060.jpg>)  
---  
View of the back with components installed.  
[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgLbTlSAa-XKL5675aYq-rSCDTlX2pIszUsmKbm4xLyRAduCDN33WJFqOPvVP1QgJkspzSVcXjMphfvPfCtZaDjLjZEdt4krC2sARj4umcdE90JeZfiKSOMSqdXp05tzar4lWMdieHOAcwR/s400/IMG_2062.JPG)](<https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgLbTlSAa-XKL5675aYq-rSCDTlX2pIszUsmKbm4xLyRAduCDN33WJFqOPvVP1QgJkspzSVcXjMphfvPfCtZaDjLjZEdt4krC2sARj4umcdE90JeZfiKSOMSqdXp05tzar4lWMdieHOAcwR/s1600/IMG_2062.JPG>)  
---  
 After a couple coats of grey spray paint.  
  
[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiFjgNNEw_KwOoLt8bf7Wz36nJHd5PiYuhm532xg3D06Qan2AdBIAmKIf9N16GhBCOumnLqtK4mbSwXXMSf_GlVvnq6YS3exbgTi_om_beA44IhyEkba99Xo5Ub0GhxkB0AJZkbKxhbP8of/s400/IMG_2067.jpg)](<https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiFjgNNEw_KwOoLt8bf7Wz36nJHd5PiYuhm532xg3D06Qan2AdBIAmKIf9N16GhBCOumnLqtK4mbSwXXMSf_GlVvnq6YS3exbgTi_om_beA44IhyEkba99Xo5Ub0GhxkB0AJZkbKxhbP8of/s1600/IMG_2067.jpg>)  
---  
Mounted in the living room. The backlight providing some ambiance.   
  
  
Other uses of this Raspberry Pi:

\- Controlling our home media server via PLEX

\- Rotating photo display via PLEX

\- Displaying local weather info 

\- Displaying HF/Solar condition pages in my ham shack  
  
Get Tinkering!  
  
---  
73,

KH7AL ~ AL