require("isomorphic-form-data");
require("isomorphic-fetch");

var stdin = process.stdin,
    stdout = process.stdout,
    inputChunks = "";

stdin.setEncoding("utf8");
stdin.on("readable", () => {
    var chunk = process.stdin.read();
    if (chunk !== null) {
        inputChunks += chunk;
    }
});

stdin.on("end", function() {
    var input = JSON.parse(inputChunks);

    global.SITE = input.site;
    global.COOKIES = input.cookies;

    var server = require("./Server");
    var output = server.render(input.url);
    output.then((output) => {
        stdout.write(JSON.stringify(output));
        stdout.write("\n");
    }, (error) => {
        console.log(error)
    });
})
