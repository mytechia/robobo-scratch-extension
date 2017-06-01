
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
//Scratch extension version 0.1.3-dev
(function(ext) {



    // Block and block menu descriptions
    var descriptor = {
        blocks: [
          ['h', 'CONNECTION BLOCKS','dummyFun'],

          [' ', 'connect to ROBOBO at %s ','connectToRobobo','192.168.0.110'],
          [' ', 'end connection','disconnect'],
          



          ['h', 'ROB ACTUATION BLOCKS','dummyFun'],
          [' ', 'stop %m.stop motors','stopFun','all'],
          ['w', 'move wheels at speed R %s L %s for %s %m.mtype','newMovementT','30','30','1','seconds'],
          ['w', 'move pan to %s at speed %s %m.block','movePanRoboboNew','180','5','blocking'],
          ['w', 'move tilt to %s at speed %s %m.block','moveTiltRoboboNew','90','5','blocking'],
          ['w', 'pan to %s and move tilt to %s at speed %s %m.block','moveTiltRoboboNew','180', '90','5','blocking'],
          ['w', 'turn %s degrees at speed %s %m.block','moveTiltRoboboNew','180','5','blocking'],

        //  [' ', 'move pan to %s at speed %s','movePanRoboboT','180','5'],
        //  [' ', 'move tilt to %s at speed %s','moveTiltRobobo','90','5'],
          [' ', 'set led %m.leds color to %m.colors','setLedColor','all','blue'],



//          move wheels L 'X' and R 'Y' for 'Z' 'non-stop|seconds|degrees|centimeters'
//          ['w', 'move wheels L %s and R %s for %s %m.mtype','newMovement','50','50','1','seconds'],
//          [' ', 'move pan %s degrees at speed %s','movePanRoboboDegree','5','5'],//v
//          [' ', 'move tilt %s degrees at speed %s','moveTiltRoboboDegree','5','5'],//v

          ['h', 'ROB SENSING BLOCKS','dummyFun'],
          [' ','reset sensor %m.sensors','resetSensor','all'],

          ['w', 'play note %d.note for %n seconds', 'playNote', 60, 0.5],

        //  ['r', 'pan position','readPan'],//v
        //  ['r', 'tilt position','readTilt'],//v

          ['r', 'obstacle at sensor %m.ir','readObstacle'],//v
        //  ['h', 'when obstacle is detected','detectedObstacle'],//v

          ['r', 'gap at %m.gaps','readGap','Gap1'],//v
          ['h', 'when gap is detected','changedGaps'],//v

          ['r', 'ROB battery level','readBatteryLevel'],//v

          ['h', 'OBO ACTUATION BLOCKS','dummyFun'],
          [' ', 'set emotion to %m.emotions','changeEmotion','normal'],
          [' ', 'say %s','talkRobobo','hello world'],
          [' ', 'play %m.sounds sound','playSound', 'moan'],

          ['h', 'OBO SENSING BLOCKS','dummyFun'],

          ['r', 'face distance','readFaceDist'],//v
          ['r', 'face position at %m.axis axis','readFaceCoord','x'],//v
          ['r', '%m.shape at %m.axis axis','readFaceCoord','blob','x'],//v
          ['r', '%m.shape area','readFaceCoord','blob'],//v


        //  ['h', 'when face is detected','newFaceFun'],//v
        //  ['h', 'when face is lost','lostFace'],//v

          ['r', 'color at %m.colorchan channel','measureColor'],//v
          ['r', 'read clap counter','readClap'],//v


          ['r', 'orientation at %m.orientation axis','readOrientation','yaw'],//v

          ['r', 'fling angle','readFlingAngle'],//v
          ['r', 'tap at %m.body','readTapCoord','eye'],//v
        //  ['h', 'when tap detected','newTap'],//v
        //  ['h', 'when fling detected','newFling'],//v

          ['r', 'acceleration at %m.axis3d axis','readAcceleration','x'],//v

          ['r', 'brightness','readBrightnessLevel'],//v
          ['r', 'OBO battery level','readOboBatteryLevel'],//v

          ['h', 'ROBOBO OPERATORS','dummyFun'],
          ['r', 'is %s %m.range %s - %s','rangeFun','','between','',''],



          //NEW RESET BLOCK


          //BLOCKS-TO-BE-REMOVED
//          [' ', 'move wheel %m.wheels by %s %m.mtype at speed %s','moveRobobo','both','1','seconds','50'],
//          [' ', 'move wheel left at speed %s and wheel right at speed %s for %s seconds','moveRoboboWheels','50','50','1000'],
//          [' ', 'set left motor to %m.motorDirectionBis and right motor to %m.motorDirectionBis at speed %s','setMotorsOn','forward','forward','100'],
//          ['w', '(blocking) move wheel left at speed %s and wheel right at speed %s for %s seconds and wait','moveRoboboWheelsWait','50','50','1'],

          //END BLOCKS-TO-BE-REMOVED





          //BLOCKS-TO-BE-REMOVED
//          [' ', 'set led %m.leds %m.status','changeLedStatus','all', 'off'],
          //END BLOCKS-TO-BE-REMOVED





          //BLOCKS-TO-BE-REMOVED
//          [' ', 'reset last voice order','resetPhrase'],//v
//          ['r', 'read last voice order','readPhrase'],//v
//          ['h', 'when voice order detected','detectedVoice'],//v
          //END BLOCKS-TO-BE-REMOVED




          //BLOCKS-TO-BE-REMOVED
//          ['h', 'when acceleration detected','newAcceleration'],//v
          //END BLOCKS-TO-BE-REMOVED



          //BLOCKS-TO-BE-REMOVED
//          ['h', 'when a brightness change is detected','changedBrightness'],//v
          //END BLOCKS-TO-BE-REMOVED


          //BLOCKS-TO-BE-REMOVED
  //        ['h', 'when OBO battery level is low','lowBatt'],//v
          //END BLOCKS-TO-BE-REMOVED



          //BLOCKS-TO-BE-REMOVED
//          ['h', 'when ROB battery level is low','lowBatt'],//v
          //END BLOCKS-TO-BE-REMOVED

          //BLOCKS-TO-BE-REMOVED
//          ['r', 'read error','readErrorFun'],//v
//          ['h', 'on error','errorFun'],//v
          //END BLOCKS-TO-BE-REMOVED

          //[' ', 'unblock','unblockFun'],
          //['w', 'block','blockFun'],


        ],
        menus: {
          motorDirection: ['forward', 'backward'],
          motorDirectionBis: ['forward', 'backward','off'],
          wheels: ['right', 'left','both'],
          mtype: ['non-stop','seconds'],
          orientation: ['yaw','pitch','roll'],
          emotions: ['happy','laughting','sad','angry','surprised','normal'],
          colors: ['off','white','red','blue','cyan','magenta','yellow','green','orange'],
          status: ['on','off'],
          leds: ['F1','F2','F3','F4','F5','L1','L2','R1','R2'],
          ir: ['F1','F2','F3','F4','F5','L1','L2','R1','R2'],
          falls: ['Fall1','Fall2','Fall3','Fall4'],
          gaps: ['Gap1','Gap2','Gap3','Gap4'],
          axis: ['x','y'],
          axis3d: ['x','y','z'],
          sounds: ['moan','purr',"angry","approve","disapprove","discomfort","doubtful","laugh","likes","mumble","ouch","thinking","various"],
          colorchan: ['red','green','blue'],
          sensors: ['all','acceleration','brighness','claps','face','fling','gaps','obstacles','pan','orientation','tap','tilt'],
          block: ['blocking','non-blocking'],
          range: ['between', 'out'],
          body: ['eye','mouth','forehead','left','right'],
          stop: ['all','wheels','pan','tilt'],
          shape: ['ball','square','blob']
        },
    };


    // Register the extension
    ScratchExtensions.register('Robobo Interface', descriptor, ext);
})({});
