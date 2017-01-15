var grpc = require('grpc');
var path = require('path').join(__dirname,'../','proto');
const proto = grpc.load({root:path,file:'work_leave.proto'})

const client = new proto.work_leave.EmployeeLeaveDayService('localhost:50050',grpc.credentials.createInsecure());

const employees = {
  valid:{
    employee_id:1,
    name: 'John',
    requested_leave_days: 4,
    accrued_leave_days: 10
  },
  ineligible:{
    employee_id:1,
    name: 'John',
    accrued_leave_days:10,
    requested_leave_days: 20
  },
  invalid: {
    employee_id: 1,
    name: 'John',
    accrued_leave_days: 10,
    requested_leave_days: -1
  },
  illegal: {
    foo: 'bar'
  }
}

client.eligibleForLeave(employees.valid,(error,response)=>{
  if(!error){
    if(response.eligible){
      client.grantLeave(employees.valid,(error,response)=>{
        console.log(response);
      })
    } else {
      console.log("you are currently ineligible for leave days");
    }
  } else {
    console.log("Error: ",error.message);
  }
});
