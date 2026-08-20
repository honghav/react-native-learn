const http = require('http');

const PORT = 3001;

http.createServer((req, res) => {
    // Enable CORS for local web browser development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
        try {
            const targetUrl = 'https://cutluy.com' + req.url;
            const cutluyRes = await fetch(targetUrl, {
                method: req.method,
                headers: {
                    'Authorization': req.headers['authorization'] || '',
                    'Content-Type': 'application/json',
                },
                body: req.method !== 'GET' && body ? body : undefined,
            });

            const data = await cutluyRes.text();
            res.writeHead(cutluyRes.status, { 'Content-Type': 'application/json' });
            res.end(data);
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
    });
}).listen(PORT, () => {
    console.log(`CORS Proxy running on http://localhost:${PORT}`);
});
