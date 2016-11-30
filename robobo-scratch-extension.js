
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
//Scratch extension version 0.1.1
(function(ext) {
    // Cleanup function when the extension is unloaded
    var rem;
    var commandid = 0;
    var newcolor = false;
    var newface = false;
    var lastIrChange = "";
    var lastFall = "";
    var lastGap = "";
    var lowbattery = false;
    var tap = false;

    $.getScript("https://mytechia.github.io/robobo-scratch-extension/remote-library/remotelib.js", function(){



    });

    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    //Callback for color
    ext.onNewColor = function () {
      newcolor = true;
    }
    //Callback for ir changes
    ext.onIrChanged = function (ir) {
      lastIrChange = ir;
    }

    ext.onFall = function (fall) {
      lastFall = fall;
    }

    ext.onGap = function (gap) {
      lastGap = gap;
    }

    ext.onNewFace = function () {
      newface = true;
    }

    ext.onLowBatt = function () {
      lowbattery = true;
    }

    ext.onNewTap = function () {
      tap = true;
    }
    //Connection Block
    ext.connectToRobobo = function(ip) {
        rem = new Remote(ip);
        rem.connect(ip);
        rem.registerCallback("onNewColor",ext.onNewColor);
        rem.registerCallback("onIrChanged",ext.onIrChanged);
        rem.registerCallback("onNewFace",ext.onNewFace);
        rem.registerCallback("onFall",ext.onFall);
        rem.registerCallback("onGap",ext.onGap);
        rem.registerCallback("onLowBatt",ext.onLowBatt);
        rem.registerCallback("onNewTap",ext.onNewTap)

    };

    //Close connection
    ext.disconnect = function () {
      rem.closeConnection();
    }

    //Speech production function
    ext.talkRobobo = function(text){
        rem.talk(text);
    };

    //Movement function
    ext.moveRobobo = function(wheel,quantity,mtype,speed){
      if (mtype=='degrees'){
        rem.moveWheelsByDegree(wheel,quantity,speed);
      }else {
        rem.moveWheelsByTime(wheel,quantity,speed);
      }

    };

    //Two wheels movement function
    ext.moveRoboboWheels = function(lSpeed,rSpeed,time){
      rem.moveWheelsSeparated(lSpeed,rSpeed,time);
    };

    //Pan movement function (absolute)
    ext.movePanRobobo = function(degrees, speed){
      rem.movePan(degrees,speed);
    };

    //Pan movement function (relative)
    ext.movePanRoboboDegree =function (degrees,speed) {
      rem.movePanByDegrees(degrees,speed);
    };

    //Tilt movement function (absolute)
    ext.moveTiltRobobo = function(degrees,speed){
      rem.moveTilt(degrees,speed);
    };

    //Tilt movement function (relative)
    ext.moveTiltRoboboDegree =function (degrees,speed) {
      rem.moveTiltByDegrees(degrees,speed);
    };

    //Function  to change the displayed emotion
    ext.changeEmotion = function(emotion){
      rem.changeEmotion(emotion);
    };

    //Function to change the led color
    ext.setLedColor = function(led,color){
      rem.setLedColor(led, color);
    };

    //Function to turn on and off the leds
    ext.changeLedStatus = function(led,status){
      rem.setLedColor(led,status);
    };

    //Movement function to rotate on the place
    ext.turnInPlace = function(degrees) {
      rem.turnInPlace(degrees);
    };

    //Hat function that checks for new colors
    ext.newCol = function() {
      if (newcolor){
        newcolor = false;
        return true;
      }else {
        return false;
      }
    };

    //Reporter function to get the last detected color
    ext.readCol = function() {
      var value = 0;
      value =rem.getColor();
      console.log("Value: "+value);
      return value;
    };

    //Hat function that checks for ir changes
    ext.changedIr = function(irname) {
      if (lastIrChange == irname){
        return true;
      }else {
        lastIrChange = "";
        return false;
      }
    };

    //Reporter function to get the ir values
    ext.readIrValue = function(ir) {
      var value = 0;
      value = rem.mirarIr(ir);
      return value;
    };

    //Reporter function to get the battery level
    ext.readBatteryLevel = function () {
      var value = 0;
      value = rem.checkBatt();
      return value;
    };

    //Reporter function to get the detected face coordinates
    ext.readFaceCoord = function (axis) {
      var value = 0;
      value = rem.getFaceCoord(axis);
      return value;
    };

    //Reporter function to get the detected face distance
    ext.readFaceDist= function () {
      var value = 0;
      value = rem.getFaceDist();
      return value;
    };

    //Hat function that checks for new faces
    ext.newFace = function() {
      if (newface){
        newface = false;
        return true;
      }else {
        return false;
      }
    };

    //Hat function that checks falls
    ext.changedFalls= function(fallpos) {
      if (fallpos == lastFall){
        return true;
      }else {
        lastFall = "";
        return false;
      }
    };

    //Hat function that checks gaps
    ext.changedGaps= function(gappos) {
      if (gappos == lastGap){
        return true;
      }else {
        lastGap = "";
        return false;
      }
    };

    //Reporter function that checks falls
    ext.readFall = function (fall) {
      return rem.checkFall(fall);
    };

    //Reporter function that checks gaps
    ext.readGap = function (gap) {
      return rem.checkFall(gap);
    };

    //Hat function that checks the battery
    ext.lowBatt = function(gappos) {
      if (lowbattery){
        return true;
      }else {
        return false;
      }
    };

    //Hat function that checks taps
    ext.newTap = function(gappos) {
      if (tap==true){
        tap = false
        return true;
      }else {
        return false;
      }
    };

    //Reporter function to get the detected face coordinates
    ext.readTapCoord = function (axis) {
      var value = 0;
      value = rem.getTapCoord(axis);
      return value;
    };
    //Emergency stop
    ext.stop = function () {
      ext.movePanRobobo(0,0);
      ext.moveTiltRobobo(0,0);
      ext.moveRoboboWheels(0,0,1);
    }




    // Block and block menu descriptions
    var descriptor = {
        blocks: [
          [' ', 'connect ROBOBO at %s','connectToRobobo','192.168.0.110'],
          [' ', 'close connection','disconnect'],
          [' ', 'stop','stop'],
          [' ', 'say %s','talkRobobo','hello world'],
          [' ', 'move wheel %m.wheels by %s %m.mtype at speed %s','moveRobobo','both','1','seconds','50'],
          [' ', 'move wheel left at speed %s and wheel right at speed %s for %s seconds','moveRoboboWheels','50','50','1000'],
          [' ', 'move pan to %s at speed %s','movePanRobobo','180','5'],
          [' ', 'move tilt to %s at speed %s','moveTiltRobobo','90','5'],
          [' ', 'move pan %s degrees at speed %s','movePanRoboboDegree','5','5'],//v
          [' ', 'move tilt %s degrees at speed %s','moveTiltRoboboDegree','5','5'],//v
          [' ', 'change emotion to %m.emotions','changeEmotion','normal'],
          [' ', 'set led %m.leds color to %m.colors','setLedColor','all','blue'],
          [' ', 'set led %m.leds %m.status','changeLedStatus','all', 'off'],
          ['r', 'read IR %m.ir value','readIrValue','1'],
          ['r', 'read battery level','readBatteryLevel'],//v
          ['r', 'read color detected','readCol'],
          ['r', 'read face distance','readFaceDist'],//v
          ['r', 'read face position at %m.axis axis','readFaceCoord','x'],//v
          ['r', 'read tap position at %m.axis axis','readTapCoord','x'],//v
          ['r', 'read fall at %m.falls','readFall'],//v
          ['r', 'read gap at %m.gaps','readGap'],//v
          ['h', 'when color is detected','newCol'],
          ['h', 'when face is detected','newFace'],//v
          ['h', 'when ir %m.ir changed','changedIr'],
          ['h', 'when battery level is low','lowBatt'],//v
          ['h', 'when tap detected','newTap'],//v
          ['h', 'when fall is detected at %m.falls','changedFalls'],//v
          ['h', 'when gap is detected at %m.gaps','changedGaps'],//v

        ],
        menus: {
          motorDirection: ['forward', 'backward'],
          wheels: ['right', 'left','both'],
          mtype: ['seconds','degrees'],
          emotions: ['happy','laughting','sad','angry','surprised','normal'],
          colors: ['white','red','blue','cyan','magenta','yellow','green','orange'],
          status: ['on','off'],
          leds: ['1','2','3','4','5','6','7','8','9','all'],
          ir: ['1','2','3','4','5','6','7','8','9'],
          falls: ['Fall1','Fall2','Fall3','Fall4'],
          gaps: ['Gap1','Gap2','Gap3','Gap4'],
          axis: ['x','y'],
        },
    };


    // Register the extension
    ScratchExtensions.register('Robobo Extension', descriptor, ext);
})({});
