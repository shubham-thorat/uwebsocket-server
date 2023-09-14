const { WebSocketServer } = require('ws')
//const RedisClient = require('./redis/redisClient')
const statsDclient = require('./statsD')
const express = require('express')
const app = express()
app.listen(8000, () => {
  console.log('running')
})

app.get('/health', (req, res) => {
  res.send('success')
})

var sp = require('./schemapack');

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
  tarprc: 'float32'
});

const wss = new WebSocketServer({
  port: 8080
  //	skipUTF8Validation: true,
  //	perMessageDeflate: {
  //	zlibDeflateOptions: {
  // See zlib defaults.
  //      chunkSize: 1024,
  //      memLevel: 7,
  //      level: 3
  //    },
  //    zlibInflateOptions: {
  //      chunkSize: 10 * 1024
  //    },
  // Other options settable:
  //    clientNoContextTakeover: true, // Defaults to negotiated value.
  //    serverNoContextTakeover: true, // Defaults to negotiated value.
  //    serverMaxWindowBits: 10, // Defaults to negotiated value.
  // Below options specified as default values.
  //    concurrencyLimit: 10, // Limits zlib concurrency for perf.
  //    threshold: 1024 // Size (in bytes) below which messages
  // should not be compressed if context takeover is disabled.
  //  }
});



//class Count {
// static request_count = 0;
// static setInitial() {
//   this.request_count = 0;
// }
// static increment() {
//   this.request_count = this.request_count + 1
//   return this.request_count
// }
// static getCount() {
//   return this.request_count
// }
//}



wss.on('connection', function connection(ws) {
  ws.on('message', function message(rdata) {
    statsDclient.timing('request_received',1)

    const startTime = Date.now()

    if(enable_schemapack) {

    }
    //	  async function func(rdata, startTime) {
    //   const bufferData = Buffer.from(rdata)
    // let data = JSON.parse(bufferData.toString('utf8'))
    let data = playerSchema.decode(rdata);
    //const startTime = Date.now()
    //statsDclient.timing('websocket_message_received_ws', 1)
    //Count.increment();
    //console.log(`Message received count = ${JSON.stringify(data)}`)
    //    const key = data && data.key ? data.key : 'DEFAUTL_KEY'
    //    const value = data && data.value ? data.value : 'DEFAUTL_VALUE'
    //console.log("data : ", data)
    //   const c = data && data.c ? data.c : 0

    //RedisClient.setKey(key, value).then(response => {
    //   const endTime = Date.now()
    //statsDclient.timing('websocket_message_send_ws', 1)
    //statsDclient.timing('websocket_message_response_ws', endTime - startTime)
    //		  data.ts = startTime.toString();
    data.ts = startTime.toString()
    //	  console.log(data);
    ws.send(playerSchema.encode(data));
    //      ws.send(JSON.stringify(data))
    //}
    //   func(rdata, Date.now());

  });

  // setInterval(() => {
  //   count += 1
  // }, 2000);
});
