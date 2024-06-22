const log = console.log;

console.log = function () {
    let first_parameter = arguments[0];
    let other_parameters = Array.prototype.slice.call(arguments, 1);

    function formatConsoleDate (date) {
        let hour = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let milliseconds = date.getMilliseconds();

        return '[' +
            ((hour < 10) ? '0' + hour: hour) +
            ':' +
            ((minutes < 10) ? '0' + minutes: minutes) +
            ':' +
            ((seconds < 10) ? '0' + seconds: seconds) +
            '.' +
            ('00' + milliseconds).slice(-3) +
            '] ';
    }

    log.apply(console, [formatConsoleDate(new Date()) + first_parameter].concat(other_parameters));
};

const express = require('express');
const config = require("./config");
const obfuscator = require("javascript-obfuscator");
const obfuscatorConfig = require("./obfuscator-config")

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// create a route for the app
app.get('/ping', (req, res) => {
    res.send('Hello World\n')
});

// create a route for the app
app.post('/obfuscateJS', (req, res) => {
    if(!verifiedSignal(req.body.sig)){
        res.status(403).send("Forbidden")
    }else{
        const code = req.body.code
        const jsRes = obfuscator.obfuscate(code, obfuscatorConfig)
        res.status(200).send(jsRes.getObfuscatedCode())
    }
});

// make the server listen to requests
app.listen(config.PORT, () => {
    console.log(`Server running at: http://localhost:${config.PORT}/`);
});

const verifiedSignal = sig => {
    console.log(sig)
    return sig === '2032690d8a3bdf6d'
}

const buildMessage = obj => {
    return JSON.stringify(obj)
}

