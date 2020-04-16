const http = require("http");
const fs = require("fs");

const httpServer = http.createServer((req, res) => {
  const htmlGenerator = returnHTML();
  const url = req.url;

  if (url === "/") {
    res.write(htmlGenerator.formBody());
    return res.end();
  }

  if (url === "/message" && req.method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    
    req.on("end", () => {
      const parseBody = Buffer.concat(body).toString();
      const message = parseBody.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }

  res.setHeader("content-type", "text/html");
  res.write(htmlGenerator.welcomeMessage());
  res.end();
});

const returnHTML = () => {
  function html(body) {
    return `<html>
        <head>
            <title>NodeJS Server</title>
        </head>
        <body>
        ${body}
        </body>
    </html>
    `;
  }

  return {
    formBody: function () {
      const htmlCode = `
        <form method="POST" action="/message">
        <input type="text" name="message" />
        <button type="submit">Send</button>
        </button>
        `;
      return html(htmlCode);
    },
    welcomeMessage: function () {
      return html("<h1>Welcome to NodeJS</h1>");
    },
    emptyBody: function () {
      return html("");
    },
  };
};
httpServer.listen("3005");
