
/*******************************************************************************
 * Copyright 2016 Mytech Ingenieria Aplicada <http://www.mytechia.com>
 * Copyright 2016 Luis Llamas <luis.llamas@mytechia.com>
 * <p>
 * This file is part of Robobo Scratch Extension.
 * <p>
 * Robobo Scratch Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * <p>
 * Robobo Scratch Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * <p>
 * You should have received a copy of the GNU Lesser General Public License
 * along with Robobo Scratch Extension.  If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/
//Remote library version 0.1.0
//Constructor of the remote control object
function Remote(ip){
  this.ip = ip;
  this.port = 40404;
  //WebSocket to stablish the connection
  this.ws = undefined;
  //Unique command id sent to the server
  this.commandid = 0;
  //Map of statuses
  this.statusmap = new Map();
  //Map of last relevant statuses, for comparations
  this.laststatusmap = new Map();
  //Map of callbacks registered by the extension
  this.callbackmap = new Map();
  //First execution mark
  this.firstime = true;
//END OF REMOTE OBJECT
};

Remote.prototype = {


  registerCallback: function (name,callback) {
    this.callbackmap.set(name,callback);
    //END OF REGISTERCALLBACK FUNCTION
  },
  connect :function() {
    this.ws = new WebSocket("ws://"+this.ip+":"+this.port);

    this.ws.onopen = function() {
      console.log("Connection Stablished");

    }

    this.ws.addEventListener('message', function(evt) {
      var received_msg = evt.data;
      this.handleMessage(received_msg);

    }.bind(this));

    this.ws.onclose = function() {
      console.log("Connection Closed");
    }

    //END OF CONNECT FUNCTION
  },

  closeConnection: function() {
    this.ws.close()
    //END OF CLOSECONNECTION METHOD
  },

  sendMessage: function(message) {
    this.commandid = this.commandid +1;
    this.ws.send(message);

    //END OF SENDMESSAGE FUNCTION
  },

  handleMessage: function(message) {

    var jsonmsg = JSON.parse(message)
    //console.log(typeof(jsonmsg.name) == 'string');
    if (typeof(jsonmsg.name) == 'string'){
      this.manageStatus(jsonmsg);
    }else if (typeof(jsonmsg.commandid) != "undefined") {
      this.manageResponse(jsonmsg);
    }

    //END OF HANDLEMESSAGE FUNCTION
  },


  //MOVEMENT

  moveWheelsByDegree: function(wheel,degrees,speed) {
    var message = JSON.stringify({
        "name": "MOVEBYDEGREES",
        "parameters": {
            wheel: wheel,
            degrees: degrees,
            speed:speed
        },
        "id": this.commandid
    });
    this.sendMessage(message)
    //END OF MOVEDEGREE FUNCTION
  },

  moveWheelsByTime: function(wheel,time,speed) {
    var message = JSON.stringify({
        "name": "MOVEBYTIME",
        "parameters": {
            wheel: wheel,
            time: time,
            speed:speed
        },
        "id": this.commandid
    });
    this.sendMessage(message)
    //END OF MOVETIME FUNCTION
  },

  moveWheelsSeparated: function(lSpeed,rSpeed,time) {
    var message = JSON.stringify({
        "name": "MOVETWOWHEELS",
        "parameters": {
            lspeed: lSpeed,
            rspeed: rSpeed,
            time:time
        },
        "id": this.commandid
    });
    this.sendMessage(message)
    //END OF MOVETWOWHEELS FUNCTION
  },

  turnInPlace: function(degrees) {
    var message = JSON.stringify({
        "name": "TURNINPLACE",
        "parameters": {
            degrees: degrees
        },
        "id": this.commandid
    });
    this.sendMessage(message)
    //END OF TURNINPLACE FUNCTION
  },

  movePan: function(pos, vel) {
    var message = JSON.stringify({
        "name": "MOVEPAN",
        "parameters": {
            pos: pos,
            speed:vel
        },
        "id": this.commandid
    });
    this.sendMessage(message)
    //END OF MOVEPAN FUNCTION
  },

  moveTilt: function (pos, vel) {
    var message = JSON.stringify({
        "name": "MOVETILT",
        "parameters": {
            pos: pos,
            speed:vel
        },
        "id": this.commandid
    });
    this.sendMessage(message)
    //END OF MOVETILT FUNCTION
  },

  //ENDMOVEMENT

  //HRI
  talk : function (speech) {
    var message = JSON.stringify({
        "name": "TALK",
        "parameters": {
            text: speech
        },
        "id": this.commandid
    });
    this.sendMessage(message)
    //END OF TALK FUNCTION
  },

  changeEmotion : function (emotion) {
    var message = JSON.stringify({
        "name": "CHANGEEMOTION",
        "parameters": {
            emotion: emotion
        },
        "id": this.commandid
    });
    this.sendMessage(message)
    //END OF CHANGEEMOTION FUNCTION
  },

  setLedColor: function (led,color) {
    var message = JSON.stringify({
        "name": "LEDCOLOR",
        "parameters": {
            led:led,
            color:color
        },
        "id": this.commandid
    });
    this.sendMessage(message)
    //END OF CHANGECOLOR FUNCTION
  },

  //ENDHRI

  //SENSING
  getLightBrightness: function () {
    var message = JSON.stringify({
        "name": "GETBRIGHTNESS",
        "parameters": {},
        "id": this.commandid
    });
    this.sendMessage(message)
    //END OF GETLIGHTBRIGHTNESS FUNCTION
  },

  brightnessChanged: function (callback) {
    callback();

    //END OF BRIGHTNESSCHANGED FUNCTION
  },

  consultIR : function (irnumber) {
    console.log("ASDF");

    console.log(this.statusmap.get("IRSensorStatus"+irnumber).value);
    return this.statusmap.get("IRSensorStatus"+irnumber).value;
    //END OF GETLIGHTBRIGHTNESS FUNCTION
  },

  mirarIr : function (irnumber) {
    return this.statusmap.get("IRSensorStatus"+irnumber);
    //END OF MIRARIR FUNCTION
  },

  //ENDSENSING

  //VISION

  colorDetected : function (callback) {
    callback();
  },

  getColor : function () {
    return this.statusmap.get("color");
    //END OF GETCOLOR FUNCTION
  },

  //ENDVISION


  manageStatus : function (msg) {


    //console.log(msg.name);

    if (msg.name == "TapNumber"){
      console.log(msg.value);
    }
    if (msg.name == "NEWCOLOR"){
      (this.callbackmap.get("onNewColor"))();
      console.log("NEWCOLOR");
      //console.log(msg.value["color"]);
      this.statusmap.set("color",msg.value["color"]);
      console.log(this.statusmap.get("color"));
    }

    if (msg.name == "IRSTATUS"){

      for (var key in msg.value) {
        //console.log(key);


          this.statusmap.set(key,parseInt(msg.value[key]));
          //console.log(this.statusmap);
          if (this.firstime){
            this.laststatusmap.set(key,parseInt(msg.value[key]));
          }else{
            var now = parseInt(msg.value[key]);
            var then = this.laststatusmap.get(key);
            //console.log(key+" now: "+now);
            //console.log(key+" then: "+then);
            if (now>then){
              if (((now/then))>3){
                this.laststatusmap.set(key,now);
                this.callbackmap.get("onIrChanged")(parseInt(key.slice(-1)));
              }
            }else if (((then/now))>5){
              this.laststatusmap.set(key,now);
              this.callbackmap.get("onIrChanged")(parseInt(key.slice(-1)));
            }
          }


        //  console.log(msg.value[key]);

      }
      this.firstime = false;
    }
    //END MANAGESTATUS FUNCTION
  },

  manageResponse : function (msg) {
      console.log(JSON.stringify(msg));

    //END MANAGERESPONSE FUNCTION
  }

}
