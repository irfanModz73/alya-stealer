// lib/stealer.js

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dns = require('dns').promises;
const { extractHost, getServerName, formatBytes, colors } = require('./utils');

class WebStealer {
    constructor(options = {}) {
        this.timeout = options.timeout || 30000;
        this.userAgent = options.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36';
        this.savePath = options.savePath || process.cwd();
    }

    async getIP(hostname) {
        try {
            const addresses = await dns.lookup(hostname);
            return addresses.address;
        } catch {
            return '-';
        }
    }

    async steal(url) {
        console.log(`\n${colors.yellow}[+] otw steal bang ke: ${url}${colors.reset}`);

        const startTime = Date.now();

        try {
            const headers = {
                'User-Agent': this.userAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
            };

            const response = await axios.get(url, {
                headers: headers,
                timeout: this.timeout,
                maxRedirects: 5
            });

            const responseTime = Date.now() - startTime;
            const hostname = extractHost(url);
            const ip = await this.getIP(hostname);
            
            const resHeaders = response.headers;
            const server = resHeaders['server'] || '-';
            const serverName = getServerName(server);
            
            const headersInfo = {
                statusCode: response.status,
                statusText: response.statusText,
                responseTime: `${responseTime} ms`,
                host: hostname,
                ip: ip,
                server: server,
                contentType: resHeaders['content-type'] || '-',
                contentLength: resHeaders['content-length'] || response.data.length || '-',
                accessControlAllowOrigin: resHeaders['access-control-allow-origin'] || '-',
                age: resHeaders['age'] || '-',
                cacheControl: resHeaders['cache-control'] || '-',
                contentDisposition: resHeaders['content-disposition'] || '-',
                date: resHeaders['date'] || '-',
                etag: resHeaders['etag'] || '-',
                lastModified: resHeaders['last-modified'] || '-',
                strictTransportSecurity: resHeaders['strict-transport-security'] || '-',
                xServerCache: resHeaders[`x-${serverName}-cache`] || resHeaders['x-cache'] || resHeaders['x-cache-status'] || '-',
                xServerId: resHeaders[`x-${serverName}-id`] || resHeaders['x-id'] || resHeaders['x-request-id'] || '-',
                transferEncoding: resHeaders['transfer-encoding'] || resHeaders['content-encoding'] || '-'
            };

            // save source code
            const fileName = `steal_${hostname}_${Date.now()}.html`;
            const filePath = path.join(this.savePath, fileName);
            fs.writeFileSync(filePath, response.data, 'utf-8');

            const fileSize = formatBytes(response.data.length);

            const result = {
                success: true,
                url: url,
                hostname: hostname,
                headers: headersInfo,
                file: {
                    path: filePath,
                    name: fileName,
                    size: response.data.length,
                    sizeFormatted: fileSize
                },
                sourceCode: response.data
            };

            return result;

        } catch (error) {
            return {
                success: false,
                url: url,
                error: error.message,
                statusCode: error.response?.status || null,
                statusText: error.response?.statusText || null
            };
        }
    }

    printInfo(result) {
        if (!result.success) {
            console.log(`\n${colors.red}[ ERROR ]${colors.reset}`);
            console.log(`${colors.red}error:${colors.reset} ${result.error}`);
            if (result.statusCode) {
                console.log(`${colors.red}statuscode:${colors.reset} ${result.statusCode}`);
                console.log(`${colors.red}statustext:${colors.reset} ${result.statusText}`);
            }
            return;
        }

        const h = result.headers;
        
        console.log(`\n${colors.cyan}[ ALYA-STEALER | INFO ]${colors.reset}`);
        console.log(`${colors.green}statuscode:${colors.reset} ${h.statusCode}`);
        console.log(`${colors.green}statustext:${colors.reset} ${h.statusText}`);
        console.log(`${colors.green}responsetime:${colors.reset} ${h.responseTime}`);
        console.log(`${colors.green}host:${colors.reset} ${h.host}`);
        console.log(`${colors.green}ip:${colors.reset} ${h.ip}`);
        console.log(`${colors.green}server:${colors.reset} ${h.server}`);
        console.log(`${colors.green}content_type:${colors.reset} ${h.contentType}`);
        console.log(`${colors.green}content_length:${colors.reset} ${h.contentLength}`);
        console.log(`${colors.green}access-control-allow-origin:${colors.reset} ${h.accessControlAllowOrigin}`);
        console.log(`${colors.green}age:${colors.reset} ${h.age}`);
        console.log(`${colors.green}cache-control:${colors.reset} ${h.cacheControl}`);
        console.log(`${colors.green}content-disposition:${colors.reset} ${h.contentDisposition}`);
        console.log(`${colors.green}date:${colors.reset} ${h.date}`);
        console.log(`${colors.green}etag:${colors.reset} ${h.etag}`);
        console.log(`${colors.green}last_modified:${colors.reset} ${h.lastModified}`);
        console.log(`${colors.green}strict-transport-security:${colors.reset} ${h.strictTransportSecurity}`);
        console.log(`${colors.green}x-${h.server.split('/')[0].toLowerCase() || 'server'}-cache:${colors.reset} ${h.xServerCache}`);
        console.log(`${colors.green}x-${h.server.split('/')[0].toLowerCase() || 'server'}-id:${colors.reset} ${h.xServerId}`);
        console.log(`${colors.green}transfer-encoding:${colors.reset} ${h.transferEncoding}`);

        console.log(`\n${colors.yellow}[ RESULT ]${colors.reset}`);
        console.log(`${colors.green}[+] Source code saved to:${colors.reset} ${result.file.path}`);
        console.log(`${colors.green}[+] File size:${colors.reset} ${result.file.sizeFormatted}`);
        console.log(`${colors.green}[+] succes steal:${colors.reset} ${result.hostname} terimakasih telah memakai tools irfan`);
    }
}

module.exports = WebStealer;
