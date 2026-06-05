// index.js

const WebStealer = require('./lib/stealer');
const { colors, formatBytes } = require('./lib/utils');

class AlyaStealer {
    constructor(options = {}) {
        this.options = options;
        this.stealer = new WebStealer(options);
    }

    async steal(url) {
        // validasi URL
        let finalUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            finalUrl = 'https://' + url;
        }
        
        const result = await this.stealer.steal(finalUrl);
        this.stealer.printInfo(result);
        return result;
    }

    // banner
    static banner() {
        console.log(`\n${colors.cyan}[ ALYA-STEALER LIB ]${colors.reset}`);
        console.log(`${colors.cyan}[ VERSION 1.0 ]${colors.reset}`);
    }
}

module.exports = AlyaStealer;
