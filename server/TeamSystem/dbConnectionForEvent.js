const mysql = module.require("mysql");
const dbHost = '127.0.0.1';                 // localhost for dev
const dbUser = 'root';                      // root for dev
const dbPassword = '123456';                // plain text password? Really?
const dbPort = '3306';                      // port for dev
const dbName = 'teamsystem';
const eventInsertSQL = 'INSERT INTO test_event (startTime, endTime, title, location, specification,launchTime,recentEditTime,postList) VALUES(?,?,?,?,?,?,?,?)';
const eventUpdateSQL = 'UPDATE test_event SET startTime=?, endTime=?, title=?, location=?, specification=?,recentEditTime=?,postList=? WHERE eventID = ?';
const eventQuerySQL = 'SELECT * FROM test_event';
const eventQueryByID = 'SELECT * FROM test_event WHERE eventID = ?';
const eventDeleteSQL = 'DELETE FROM test_event WHERE eventID=?';


var eventSystemPool = undefined;

module.exports = {
getDBTime : function getDBTime(){
    var date = new Date(Date.now());
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+ (date.getMonth()+1) : (date.getMonth()+1)) + '-';
    var D = (date.getDate() < 10 ? '0'+ date.getDate() : date.getDate()) + ' ';
    var h = date.getHours() + ':';
    var m = (date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
    return (Y+M+D+h+m+s);
  },


establishPool : function createPool(){
    if(eventSystemPool !== undefined) return;
    try{
       eventSystemPool = mysql.createPool({
         connectionLimit : 100,
         host : dbHost,
         user : dbUser,
         password : dbPassword,
         port : dbPort,
         database : dbName
       },(err)=>{
         if(err){
           throw new Error("[DB Connection Error] -" + err);
         }
       });
      }
      catch(err){
        console.log(err);           //err可以以这种方式输出么
        return null;
      }
      return eventSystemPool;
  },


askEventInfo : function askEventInfo(eventID,callback){
    var eventQueryByID_Params = [eventID];
    eventSystemPool.query(eventQueryByID,eventQueryByID_Params,(err,rows,fields)=>{
      if(err) {
        var newErr = new Error("[DB Query Error] -" + err);
        callback(newErr,null,null);
      }
      else{
        for(let i = 0; i < rows.length; i++){
          rows[i].postList = JSON.parse(rows[i].postList);
        }
        callback(null,rows,fields);
      }
    });
},                    //成品


insertNewEvent : function insertNewEvent(newevent,callback){
  console.log(4);
  console.log(newevent);
  newevent.launchTime = this.getDBTime();
  newevent.recentEditTime = newevent.launchTime;
  var eventInsertSQL_Params = [newevent.startTime, newevent.endTime, newevent.title, newevent.location, newevent.specification,newevent.launchTime,newevent.recentEditTime,JSON.stringify(newevent.postList)];
  eventSystemPool.query(eventInsertSQL,eventInsertSQL_Params,(err,result) =>{
    if(err){
      var newErr = new Error("[DB Insert Error] -" + err);
      callback(newErr,null);
    }
    else{
      callback(null,result);
    }
  });
},           //成品


updateEventInfo: function updateEventInfo(eventToBeUpdated, callback){
  eventToBeUpdated.recentEditTime = this.getDBTime();
  var eventUpdate_Params = [eventToBeUpdated.startTime, eventToBeUpdated.endTime, eventToBeUpdated.title, eventToBeUpdated.location, eventToBeUpdated.specification,eventToBeUpdated.recentEditTime,JSON.stringify(eventToBeUpdated.postList),eventToBeUpdated.eventID];
  eventSystemPool.query(eventUpdateSQL,eventUpdate_Params,(err,result) =>{
    if(err){
      var newErr = new Error("[DB Update Error] -" + err);
      callback(newErr,null);
    }
    else{
      callback(null,result);
    }
  });
},         //成品


deleteEvent: function deleteEvent(eventID,callback){
  var deleteEvent_Params = [eventID];
  eventSystemPool.query(eventDeleteSQL,deleteEvent_Params,(err,result) =>{
    if(err){
      var newErr = new Error("[DB Update Error] -" + err);
      callback(newErr,null);
    }
    else{
      callback(null,result);
    }
  });
}
}
