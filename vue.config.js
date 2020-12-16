module.exports = {
    devServer: {
        host: '0.0.0.0',
        port: 3002,
        open: true,
        proxy: {
            '/': {
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    }
}