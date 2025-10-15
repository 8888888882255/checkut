import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
      host: 'localhost',
      clientPort: 5173,
      timeout: 30000
    },
    watch: {
      usePolling: true,
      interval: 1000
    },
    proxy: {
      '/api': {
        target: 'http://backend_container:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
        timeout: 30000,
        proxyTimeout: 30000,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // For PUT/POST requests, explicitly set content-length
            if (req.body) {
              const bodyData = JSON.stringify(req.body);
              proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
              proxyReq.setHeader('Content-Type', 'application/json');
              // Write body data
              proxyReq.write(bodyData);
            }

            console.log('Proxy Request:', {
              method: proxyReq.method,
              path: proxyReq.path,
              headers: proxyReq.getHeaders()
            });
          });

          proxy.on('proxyRes', (proxyRes, req, res) => {
            let responseBody = '';
            proxyRes.on('data', function(chunk) {
              responseBody += chunk;
            });
            proxyRes.on('end', function() {
              console.log('Proxy Response:', {
                statusCode: proxyRes.statusCode,
                headers: proxyRes.headers,
                body: responseBody
              });
            });
          });

          proxy.on('error', (err, req, res) => {
            console.error('Proxy Error:', {
              message: err.message,
              code: err.code,
              stack: err.stack
            });
            
            if (!res.headersSent) {
              res.writeHead(500, {
                'Content-Type': 'application/json'
              });
              res.end(JSON.stringify({
                error: 'Proxy Error',
                message: err.message,
                code: err.code
              }));
            }
          });
        }
      }
    }
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['fsevents']
  }
});