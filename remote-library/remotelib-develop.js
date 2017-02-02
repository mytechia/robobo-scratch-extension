
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
//Remote library version 0.1.2-dev
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
    if (this.ws != undefined){
      console.log("Closing previous connection");
      this.ws.close();
    }
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
    this.sendMessage(message);
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
    this.sendMessage(message);
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
    this.sendMessage(message);
    //END OF MOVETWOWHEELS FUNCTION
  },

  motorsOn: function(lMotor,rMotor,speed) {
    var message = JSON.stringify({
        "name": "MOTORSON",
        "parameters": {
            lmotor: lMotor,
            rmotor: rMotor,
            speed:speed
        },
        "id": this.commandid
    });
    this.sendMessage(message);
    //END OF MOTORSON FUNCTION
  },


  turnInPlace: function(degrees) {
    var message = JSON.stringify({
        "name": "TURNINPLACE",
        "parameters": {
            degrees: degrees
        },
        "id": this.commandid
    });
    this.sendMessage(message);
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
    if (vel > 0){
      this.statusmap.set("panPos",pos);
    }
    this.sendMessage(message);
    //END OF MOVEPAN FUNCTION
  },

  movePanByDegrees (degrees, speed) {
    console.log("movePanByDegrees");
    var actual = this.statusmap.get("panPos");
    if (actual==undefined){
      actual = 180;
    }
    var newpos = parseInt(actual) + parseInt(degrees)
    if (newpos > 339){
      newpos = 339;
    }
    if (newpos < 27){
      newpos = 27;
    }
    console.log(newpos);

    this.statusmap.set("panPos",parseInt(newpos));
    this.movePan(newpos, speed);
    //END OF MOVEPANBYDEGREES FUNCTION
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
    if (vel > 0){
      this.statusmap.set("tiltPos",parseInt(pos));
    }
    this.sendMessage(message);
    //END OF MOVETILT FUNCTION
  },

  moveTiltByDegrees (degrees, speed) {
    console.log("moveTiltByDegrees");
    var actual = this.statusmap.get("tiltPos");
    if (actual==undefined){
      actual = 90;
    }
    var newpos = parseInt(actual) + parseInt(degrees)
    if (newpos > 109){
      newpos = 109;
    }
    if (newpos < 26){
      newpos = 26;
    }
    console.log(newpos);
    this.statusmap.set("tiltPos",newpos);
    this.moveTilt(newpos, speed);
    //END OF MOVETILTBYDEGREES FUNCTION
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
    this.sendMessage(message);
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
    this.sendMessage(message);
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
    this.sendMessage(message);
    //END OF CHANGECOLOR FUNCTION
  },

  playEmotionSound : function (sound) {
    var message = JSON.stringify({
        "name": "SOUND",
        "parameters": {
            sound:sound
        },
        "id": this.commandid
    });
    this.sendMessage(message);
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
    this.sendMessage(message);
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

  checkBatt : function () {
    return this.statusmap.get("batterylevel");
    //END OF CHECKBATT FUNCTION
  },

  checkOboBatt : function () {
    return this.statusmap.get("obobatterylevel");
    //END OF CHECKBATT FUNCTION
  },

  checkFall : function (fall) {
    return this.statusmap.get(fall);
    //END OF CHECKFALL FUNCTION
  },

  checkFlingAngle : function () {
    return this.statusmap.get("flingangle");
    //END OF CHECKFLING ANGLE
  },

  checkGap : function (gap) {
    return this.statusmap.get(gap);
    //END OF CHECKFALL FUNCTION
  },

  getBrightness : function () {
    return this.statusmap.get("brightness");
  },


  //ENDSENSING

  //VISION

  getColor : function () {
    return this.statusmap.get("color");
    //END OF GETCOLOR FUNCTION
  },

  getFaceCoord :function(axis) {
    if (axis=="x") {
      return this.statusmap.get("facex");

    }else{
      return this.statusmap.get("facey");
    }
    //END OF GETFACECOORD FUNCTION
  },

  getTapCoord :function(axis) {
    if (axis=="x") {
      return this.statusmap.get("tapx");

    }else{
      return this.statusmap.get("tapy");
    }
    //END OF GETFACECOORD FUNCTION
  },

  getOrientation :function(axis) {
    if (axis=="yaw") {
      return this.statusmap.get("yaw");

    }else if (axis=="pitch") {
      return this.statusmap.get("pitch");

    }else{
      return this.statusmap.get("roll");
    }
    //END OF GETORIENTATION FUNCTION
  },

  getAcceleration :function(axis) {
    if (axis=="x") {
      return this.statusmap.get("xaccel");

    }else if (axis=="y") {
      return this.statusmap.get("yaccel");

    }else{
      return this.statusmap.get("zaccel");
    }
    //END OF GETORIENTATION FUNCTION
  },

  getMeasuredColor:function(channel) {
    if (channel=="red") {
      return this.statusmap.get("colorr");

    }else if (channel=="green") {
      return this.statusmap.get("colorg");

    }if (channel=="blue") {
      return this.statusmap.get("colorb");

    }
    //END OF GETMEASUREDCOLOR FUNCTION
  },

  getFaceDist : function () {
    return this.statusmap.get("facedist");
  },

  getObstacle : function () {
    return this.statusmap.get("obstacle");
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

    else if (msg.name == "IRSTATUS"){

      for (var key in msg.value) {
        //console.log(key);


          this.statusmap.set(key,parseInt(msg.value[key]));
          //console.log(this.statusmap);
          if (this.firstime){
            this.laststatusmap.set(key,parseInt(msg.value[key]));
          }else{
            var now = parseInt(msg.value[key]);
            if (parseInt(msg.value[key])>130) {
              this.statusmap.set("obstacle",parseInt(key.slice(-1)));

              this.callbackmap.get("onObstacle")();
            }
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

    else if (msg.name == "BATTLEV") {
      this.statusmap.set("batterylevel",parseInt(msg.value["level"]));
      if (parseInt(msg.value["level"])<20){
        this.callbackmap.get("onLowBatt")();
      }
    }

    else if (msg.name == "OBOBATTLEV") {
      this.statusmap.set("obobatterylevel",parseInt(msg.value["level"]));
      if (parseInt(msg.value["level"])<20){
        this.callbackmap.get("onLowOboBatt")();
      }
    }

    else if (msg.name == "NEWFACE") {
      this.statusmap.set("facex",parseInt(msg.value["coordx"]));
      this.statusmap.set("facey",parseInt(msg.value["coordy"]));
      this.statusmap.set("facedist",parseInt(msg.value["distance"]));
      (this.callbackmap.get("onNewFace"))();
    }

    else if (msg.name == "FALLSTATUS"){
      //console.log(msg);
      for (var key in msg.value) {
        //console.log(key);
          this.statusmap.set(key,(msg.value[key] == "true"));
          if(this.statusmap.get(key)){
            console.log("OnFall");
            (this.callbackmap.get("onFall"))(key);
          }
      }
    }

    else if (msg.name == "GAPSTATUS"){
      //console.log(msg);
      for (var key in msg.value) {
        //console.log(key+" "+msg.value[key]+" "+(msg.value[key] == "true"));
          this.statusmap.set(key,(msg.value[key] == "true"));
          if((this.statusmap.get(key))){
            //console.log("OnGap");
            (this.callbackmap.get("onGap"))(key);
          }

      }

    }

    else if (msg.name == "TAP") {
      //console.log(msg);
      this.statusmap.set("tapx",parseInt(msg.value["coordx"]));
      this.statusmap.set("tapy",parseInt(msg.value["coordy"]));
      (this.callbackmap.get("onNewTap"))();
    }

    else if (msg.name == "FLING") {

      this.statusmap.set("flingangle",parseInt(msg.value["angle"]));
      this.statusmap.set("flingtime",parseInt(msg.value["time"]));
      this.statusmap.set("flingdistance",parseInt(msg.value["distance"]));

      (this.callbackmap.get("onNewFling"))();
    }

    else if (msg.name == "CLAP") {

      (this.callbackmap.get("onNewClap"))();
    }

    else if (msg.name == "BRIGHTNESS") {
      this.statusmap.set("brightness",parseInt(msg.value["level"]));

    }

    else if (msg.name == "BRIGHTNESSCHANGED") {

      (this.callbackmap.get("onBrightnessChanged"))();
    }

    else if (msg.name == "ORIENTATION") {

      this.statusmap.set("yaw",parseInt(msg.value["yaw"]));
      this.statusmap.set("pitch",parseInt(msg.value["pitch"]));
      this.statusmap.set("roll",parseInt(msg.value["roll"]));
    }

    else if (msg.name == "ACCELERATION") {
      //console.log(msg);
      this.statusmap.set("xaccel",parseInt(msg.value["xaccel"]));
      this.statusmap.set("yaccel",parseInt(msg.value["yaccel"]));
      this.statusmap.set("zaccel",parseInt(msg.value["zaccel"]));

    }

    else if (msg.name == "COLORMEASURED") {
      //console.log(msg);
      this.statusmap.set("colorr",parseInt(msg.value["R"]));
      this.statusmap.set("colorg",parseInt(msg.value["G"]));
      this.statusmap.set("colorb",parseInt(msg.value["B"]));

    }

    else if (msg.name == "ACCELCHANGED") {

      (this.callbackmap.get("onAccelChanged"))();
    }

    else if (msg.name == "DIE") {
      console.log("Die message");
      this.closeConnection();
    }

    else {
      console.log('Lost status '+ msg.name);
    }
    //END MANAGESTATUS FUNCTION
  },

  manageResponse : function (msg) {
      console.log(JSON.stringify(msg));

    //END MANAGERESPONSE FUNCTION
  }

}
