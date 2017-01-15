var grpc = require('grpc');
const proto = grpc.load('proto/work_leave.proto');
const server = new grpc.Server();

server.addProtoService(proto.work_leave.EmployeeLeaveDayService.service,{

  //check if the employee is eligible for leave
  eligibleForLeave(call,callback){
    if(call.request.requested_leave_days>0){
      if(call.request.accrued_leave_days > call.request.requested_leave_days){
        callback(null,{eligible:true})
      } else {
        callback(null,{eligible: false})
      }
    } else {
      callback(new Error('Invalid requested days'))
    }
  },
  grantLeave(call,callback){
    let granted_leave_days = call.request.requested_leave_days;
    var accrued_leave_days = Number(call.request.accrued_leave_days) - Number(call.request.requested_leave_days);

    callback(null,{
      granted: true,
      accrued_leave_days,
      granted_leave_days
    });
  }
})

server.bind('0.0.0.0:50050',grpc.ServerCredentials.createInsecure());

server.start();
console.log('grpc server running at port: '+'0.0.0.0:50050');
