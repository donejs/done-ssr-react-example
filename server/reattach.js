var Readable = require("stream").Readable;

module.exports = function(response){
  return function(data){
    function getMainScript() {
      var doc = data.document;
      var scripts = Array.from(doc.getElementsByTagName("script"));

      // TODO Probably should check for data-main or something
      var main = scripts[scripts.length - 1];

      return main;
    }

    function getAttachment(pathToMain, pageURL) {
      var iframe = data.document.createElement("iframe");
      iframe.setAttribute("style", "display: none;");
      iframe.setAttribute("src", pageURL);
      iframe.setAttribute("data-remainindom", "");
      return iframe;
    }

    return {
      afterRun: function(){
        var main = getMainScript();
        var url = `/_donessr_reattach/${Date.now()}`;

        var stream = response.push(url, {
          status: 200,
          method: "GET",
          request: { accept: "*/*" },
          response: { "content-type": "text/html" }
        });

        var doc = data.document.documentElement.cloneNode(true);
        Array.from(doc.getElementsByTagName("script")).forEach(el => {
          el.parentNode.removeChild(el);
        });
        // TODO PUSH my own script here
        var html = doc.outerHTML;

        var s = new Readable();
        s._read = Function.prototype; // noop
        s.push(html);
        s.push(null);
        s.pipe(stream);

        var reattach = getAttachment(main.src, url);
        data.document.head.insertBefore(reattach, data.document.head.firstChild);
      }
    }
  };
};
