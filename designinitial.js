"use strict";

var Cylon = require('cylon');
var savedata=require('./designsql');
var findid=require('./sqlope');
var register=require('./register');
var datapost=require('./dataPost');

Cylon.robot({

  connections: {
    server: { adaptor: 'mqtt', host:"mqtt://localhost:1883" }
  },
  
  work: function(my){
    savedata.inisave();
    my.server.subscribe('/cylon/dev/first');
    my.server.subscribe('/cylon/sensor/info');
    //my.server.subscribe('hello');
    my.server.on('message',function(topic,data){
      console.log(topic+":"+data);

      if(topic=="/cylon/dev/first"){
        var alldata=eval('('+data+')');
        var datasize=alldata.length;
        var idreturn=new Array();
        var devdata=alldata[0];
        var registertime;
        registertime=new Date();
        register.devRegister(devdata.devname,devdata.devdescription,registertime);
        var devid=findid.selectdevid(devdata.devname,registertime);
        idreturn[0]=devid;
        var sensordata;
        for(var x=1;x<datasize;x++){
          sensordata=alldata[x];
          registertime=new Date();
          register.senRegister(devid,sensordata.sensorname,sensordata.sensordescription,sensordata.sensorunit,sensordata.sensorsymbol,registertime);
          idreturn[x]=findid.selectsensorid(devid,sensordata.sensorname,registertime);
        }
        my.server.publish('ensureid',JSON.stringify(idreturn));
      }
      
      if(topic=="/cylon/sensor/info"){
        var sensordata=eval('('+data+')');
        var x=sensordata.length;
        for(var y=0;y<x;y++){
          var monitordata=sensordata[y];
          var monitordata=JSON.stringigy(monitordata);
          var sensorname=monitordata.split(":")[0].replace(/\s+/g,"");
          var sensordata=monitordata.split(":")[1].replace(/\s+/g,"").substring(1,sensordata.length-1);
          var devid=sensorname.split(".")[0].substring(1);
          var sensorid=sensorname.split(".")[1].substring(0,sensorid.length-1);
          datapost.dataPost(devid,sensorid,sensordata);
        }
      }
    });
  }
}).start();
