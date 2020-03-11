var PORT = 55555;
var HOST = '127.0.0.1';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
const edge = require('edge-js');

server.on('listening', function () {
  var address = server.address();
  console.log('UDP Server listening on ' + address.address + ':' + address.port);
});

var getVerify = edge.func(function () {/*
  async (msg) => {
      byte[] buffer = (byte[]) msg;
      ulong uint64 = BitConverter.ToUInt64(buffer, 16);
      return (int) ((long) (uint64 >> 20) & 31L);
  }
*/});

var getYear = edge.func(function () {/*
  async (msg) => {
      byte[] buffer = (byte[]) msg;
      ulong uint64 = BitConverter.ToUInt64(buffer, 16);
      return (int) ((long) uint64 & (long) sbyte.MaxValue) + 2000;
  }
*/});

var getMonth = edge.func(function () {/*
  async (msg) => {
      byte[] buffer = (byte[]) msg;
      ulong uint64 = BitConverter.ToUInt64(buffer, 16);
      return (int) ((long) (uint64 >> 7) & 15L);
  }
*/});

var getDay = edge.func(function () {/*
  async (msg) => {
      byte[] buffer = (byte[]) msg;
      ulong uint64 = BitConverter.ToUInt64(buffer, 16);
      return (int) ((long) (uint64 >> 11) & 31L);
  }
*/});

var getHour = edge.func(function () {/*
  async (msg) => {
      byte[] buffer = (byte[]) msg;
      ulong uint64 = BitConverter.ToUInt64(buffer, 16);
      return (int) ((long) (uint64 >> 47) & 31L);
  }
*/});

var getMin = edge.func(function () {/*
  async (msg) => {
      byte[] buffer = (byte[]) msg;
      ulong uint64 = BitConverter.ToUInt64(buffer, 16);
      return (int) ((long) (uint64 >> 52) & 63L);
  }
*/});

var getSec = edge.func(function () {/*
  async (msg) => {
      byte[] buffer = (byte[]) msg;
      ulong uint64 = BitConverter.ToUInt64(buffer, 16);
      return (int) ((long) (uint64 >> 58) & 63L);
  }
*/});

var getUserID = edge.func(function () {/*
  async (msg) => {
      byte[] buffer = (byte[]) msg;
      ulong uint64 = BitConverter.ToUInt64(buffer, 8);
      return uint64.ToString();
  }
*/});

const setVal = (msg, func, name) => {
  func(msg, function(e, r){
    if (e) throw error;
    console.log(name, r);
    return r
  })
}

server.on('message', (data, remote) => {
  let year, month, day, hour, min, sec, UserID;
  console.log('=======================');
  setVal(data, getUserID, 'User: ');
  console.log('----------');
  setVal(data, getYear, 'YYYY: ');
  setVal(data, getMonth, 'M: ');
  setVal(data, getDay, 'D: ');
  console.log('----------');
  setVal(data, getHour, 'HH: ');
  setVal(data, getMin, 'mm: ');
  setVal(data, getSec, 'ss: ');
  console.log('=======================');

  // var uint64 = new Uint64BE(message, 16);
  // const year = (uint64 & 127) + 2000;
  // console.log(year); // "90a0b0c0d0e0f10"
  //(int) ((long) uint64 & (long) 127) + 2000;
  // console.log(remote.address + ':' + remote.port + ' - ' + message);
});

server.bind(PORT);