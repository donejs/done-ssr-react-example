const Readable = require('stream').Readable;

module.exports = function(app){
  app.get('/api/perks', (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' })

    var chunks = [
      {item:'One'},
      {item:'Two'},
      {item:'Three'},
      {item:'Four'},
      {item:'Five'},
      {item:'Six'},
      {item:'Seven'},
      {item:'Eight'},
      {item:'Nine'},
      {item:'Ten'}
    ];

    var r = new Readable({
      read() {
        setTimeout(() => {
          var item = chunks.shift();
          if(item) {
            this.push(JSON.stringify(item) + "\n");
          } else {
            this.push(null);
          }
        }, 500);
      }
    });

    r.pipe(response);
  });
};
