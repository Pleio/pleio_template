"use strict";

require("isomorphic-form-data");
require("isomorphic-fetch");
//require("babel-register");

var stdin = process.stdin,
    stdout = process.stdout,
    inputChunks = "";

stdin.setEncoding("utf8");
stdin.on("readable", function () {
    var chunk = process.stdin.read();
    if (chunk !== null) {
        inputChunks += chunk;
    }
});

stdin.on("end", function () {
    var input = JSON.parse(inputChunks);

    global.SITE = input.site;
    global.COOKIES = input.cookies;

    var server = require("./src/js/Server");
    var output = server.render(input.url);
    output.then(function (output) {
        stdout.write(JSON.stringify(output));
        stdout.write("\n");
    }, function (error) {
        console.log(error);
    });
});
