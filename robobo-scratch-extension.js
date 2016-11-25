
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

(function(ext) {
    // Cleanup function when the extension is unloaded
    var rem;
    var commandid = 0;
    var newcolor = false;
    var lastIrChange = "";

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
    //Connection Block
    ext.connectToRobobo = function(ip) {
        rem = new Remote(ip);
        rem.connect(ip);
        rem.registerCallback("onNewColor",ext.onNewColor);
        rem.registerCallback("onIrChanged",ext.onIrChanged);

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

    //Pan movement function
    ext.movePanRobobo = function(degrees, speed){
      rem.movePan(degrees,speed);
    };

    //Tilt movement function
    ext.moveTiltRobobo = function(degrees,speed){
      rem.moveTilt(degrees,speed);
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

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
          [' ', 'connect ROBOBO at %s','connectToRobobo','192.168.0.110'],
          [' ', 'close connection','disconnect'],
          [' ', 'say %s','talkRobobo','hello world'],
          [' ', 'move wheel %m.wheels by %s %m.mtype at speed %s','moveRobobo','both','1','seconds','50'],
          [' ', 'move wheel left at speed %s and wheel right at speed %s for %s seconds','moveRoboboWheels','50','50','1000'],
          [' ', 'move pan to %s at speed %s','movePanRobobo','180','5'],
          [' ', 'move tilt to %s at speed %s','moveTiltRobobo','90','5'],
          [' ', 'change emotion to %m.emotions','changeEmotion','normal'],
          [' ', 'set led %m.leds color to %m.colors','setLedColor','all','blue'],
          [' ', 'set led %m.leds %m.status','changeLedStatus','all', 'off'],
          ['r', 'read IR %m.ir value','readIrValue','1'],
          ['r', 'read color detected','readCol'],
          ['h', 'when color is detected','newCol'],
          ['h', 'when ir %m.ir changed','changedIr'],

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
        },
    };


    // Register the extension
    ScratchExtensions.register('Robobo Extension', descriptor, ext);
})({});
