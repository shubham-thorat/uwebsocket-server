// On both the client and server:
var sp = require('./schemapack');
let statsDclient = require('./statsD')

var playerSchema = sp.build({
  ts: 'string',
  c: 'uint32',
  txnTyp: 'string',
  exch: 'string',
  qty: 'uint32',
  sym: 'string',
  prc: 'float32',
  odTyp: 'string',
  tag: 'string',
  source: 'string',
  mktType: 'string',
  val: 'string',
  segmt: 'string',
  trprc: 'float32',
  var: 'string',
  pdt: 'string',
  disqty: 'int16',
  tarprc: 'float32',
  start: 'string',
  received: 'string'
});

const { DEDICATED_COMPRESSOR_3KB, DEDICATED_COMPRESSOR_16KB, DEDICATED_COMPRESSOR_256KB } = require('uWebSockets.js');


const enable_schemapack = true;

var users = 0
let counters = [0,0,0,0]
let totalActive = [0,0,0,0]

setInterval(() => {
  console.log(`Counters : ${JSON.stringify(counters)}`)
  // console.log("SUM : ",counters)
},1000)

require('uWebSockets.js').App({

  /* There are more SSL options, cut for brevity */

}).ws('/*', {

  /* There are many common helper features */
  idleTimeout: 32,
  // maxBackpressure: 2**20,
  maxBackpressure: 1024,
  maxPayloadLength: 512,
  // maxPayloadLength: 2**15,
  compression: DEDICATED_COMPRESSOR_3KB,
  open: (ws) => {
    // users += 1

    counters[parseInt(process.env.pm_id)] += 1
    // totalActive[parseInt(process.env.pm_id)] += 1
    // console.log(`Counters : ${JSON.stringify(counters)}`)

    // console.log(process.env.pm_id)
    // maxUsers = Math.max(users,maxUsers)
    // console.log(`Total connected clients ${users} maxUsers: ${maxUsers}`)

  },
  close: (ws) => {
    // totalActive[parseInt(process.env.pm_id)] -= 1
    // users -= 1
    // console.log(`Client closed Total users: ${users} maxUsers: ${maxUsers}`)
  },
  /* For brevity we skip the other events (upgrade, open, ping, pong, close) */
  message: (ws, message, isBinary) => {

    /* You can do app.publish('sensors/home/temperature', '22C') kind of pub/sub as well */
    /* Here we echo the message back, using compression if available */
    //    async function func(rdata, startTime) {
    try {
      //        statsDclient.timing('websocket_message_received_ws', 1)
      // const startTime = Date.now()
      if (enable_schemapack) {
        let data = playerSchema.decode(message);
        // console.log('decode',data)
        // data.received = startTime.toString()
        // ws.send(message, true, true);
        ws.send(playerSchema.encode(data), true, true);
        // ws.send(message, true, true);

      } else {
        const bufferData = Buffer.from(message)
        let data = JSON.parse(bufferData.toString('utf8'))
        data['received'] = startTime.toString()
        ws.send(JSON.stringify(data), false, true)
      }

    } catch (error) {
      console.error(`ERROR IN func METHOD : ${JSON.stringify(error)}`)
      // ws.send({},true,true)
    }

    //   }
    //   func(message, Date.now());
    //let ok = ws.send(message, isBinary, true);
  }

}).listen(8080, (listenSocket) => {

  if (listenSocket) {
    console.log('Listening to port 9001');
  }

});
