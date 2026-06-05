// lib/utils.js

// 
const colors = {
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

// extract host dari URL
function extractHost(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch {
        return '-';
    }
}

// extract server name buat header
function getServerName(serverHeader) {
    if (serverHeader === '-' || !serverHeader || serverHeader === 'N/A') return 'server';
    return serverHeader.split('/')[0].toLowerCase();
}

// format bytes to human readable
function formatBytes(bytes) {
    if (bytes === '-') return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

module.exports = {
    colors,
    extractHost,
    getServerName,
    formatBytes
};
