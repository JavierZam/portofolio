import express from 'express';
import serveStatic from 'serve-static';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(serveStatic(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
