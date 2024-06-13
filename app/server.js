import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { handler } from './build/handler.js';
import dotenv from "dotenv";

dotenv.config();

const app = express();

const backendUrl = `backend:${process.env.BACKEND_PORT}`;  
const docsUrl = `docs:${process.env.DOCS_PORT}`; 
const port = 3000;

app.use('/notifications/events', createProxyMiddleware({
  target: `http://${backendUrl}/notifications/events`,
  changeOrigin: true,
  pathRewrite: (path, _) => path.replace(/^\/notifications\/events/, ''),
}));


app.use('/socket', createProxyMiddleware({
  target: `ws://${backendUrl}`,
  changeOrigin: true,
  ws: true,
  pathRewrite: (path, _) => path.replace(/^\/socket/, ''),
}));

app.use('/docs', createProxyMiddleware({
  target: `http://${docsUrl}/`,
  changeOrigin: true,
  pathRewrite: (path, _) => path.replace(/^\/docs/, ''),
}));

app.use(handler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
