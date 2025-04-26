require('dotenv').config();
const path = require('path');
const express = require('express');

const http = require('http');
const cors    = require('cors');
const { faker } = require('@faker-js/faker');

const { Worker } = require('worker_threads');

const WebSocket = require('ws');
const workerPath = path.resolve(__dirname, 'worker.js');

const { DATA, SEARCH_TRIE, COUNTRIES, HOBBIES, HOBBIES_PROFILES, COUNTRIES_PROFILES } = require('./data');
const { getProfilesMatchesAllHobbies, getProfilesMatchesAllCountries } = require('./utils');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const API_VERSION = process.env.API_VERSION || 'v1';
const FRONTEND_ORIGIN = process.env.ORIGIN || 'http://localhost:5173';
const PORT = parseInt(process.env.PORT, 10) || 3001;

// Allow all origins (or restrict to your front‑end)
app.use(cors({
  origin: FRONTEND_ORIGIN
}));

// Middleware
app.use(express.json());


// MOCK API List of routes
app.get('/', (_, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Mock API Server</title>
      <style>
        body { font-family: sans-serif; padding: 20px; }
        h1 { color: #333; }
        ul { line-height: 1.6; }
      </style>
    </head>
    <body>
      <h1>Mock API Server <small style="font-size:0.6em;color:#666;">${API_VERSION}</small></h1>
      <p>Running on port <strong>${PORT}</strong></p>
      <p>Available endpoints:</p>
      <ul>
        <li><a href="${`/${API_VERSION}/profiles?size=&lt;n&gt;&cursor=&lt;token&gt;&prefix=&lt;q&gt;&hobby=&lt;h1,h2&gt;&nationality=&lt;n1,n2&gt;`}">
          GET /${API_VERSION}/profiles?…</a>
        </li>
        <li><a href="/${API_VERSION}/prefetch-filter/hobbies">
          GET /${API_VERSION}/prefetch-filter/hobbies</a>
        </li>
        <li><a href="/${API_VERSION}/prefetch-filter/nationality">
          GET /${API_VERSION}/prefetch-filter/nationality</a>
        </li>
        <li><a href="/${API_VERSION}/profiles?prefix=Alex">
          GET /${API_VERSION}/profiles?prefix=Alex</a>
        </li>
        <li><a href="/${API_VERSION}/stream-text">
          GET /${API_VERSION}/stream-text</a>
        </li>
        <li><a href="/${API_VERSION}/queue">
          POST /${API_VERSION}/queue</a>
        </li>
      </ul>
    </body>
    </html>
  `);
});



// =========================
// TASK 1
// =========================

// GET: Prefetch-filter: hobbies
app.get(`/${API_VERSION}/prefetch-filter/hobbies`, (_, res) => res.json({ results: HOBBIES }));

// GET: Prefetch-filter: nationality
app.get(`/${API_VERSION}/prefetch-filter/nationality`, (_, res) => res.json({ results: COUNTRIES }));

// Main API - process showing profiles as:
// - default - all profiles
// - search by name & last name
// - filter out by nationality & hobbies
app.get(`/${API_VERSION}/profiles`, (req, res) => {
  let filteredIds = new Set();
  let isEmpty = false;
  // 1) Search via Trie if prefix provided
  if (req.query.prefix) {
    const term = String(req.query.prefix).toLowerCase();
    if (term.length < 3) {
      return res.status(400).json({ error: 'Search term must be at least 3 characters' });
    }
    filteredIds = new Set(SEARCH_TRIE.startsWith(term));

    if (!filteredIds.size) isEmpty = true;
  }


  // 2) Parse filter DSL
  const filterRaw = req.query.filter;
  const filters = {};
  if (filterRaw && !isEmpty) {
    const rules = String(filterRaw).split(';').map(r => r.trim()).filter(Boolean);
    for (const rule of rules) {
      const [key, csv] = rule.split(':', 2);
      if (!key || !csv) continue;
      filters[key] = csv.split(',').map(v => v.trim()).filter(Boolean);
    }
  }


  // 3) Filter by hobbies
  if (filters.hobbies && !isEmpty) {
    let listProfilesIdx = new Set();
    for (const hobby of filters.hobbies) {
        const hobbyIdx = Number(hobby);
        listProfilesIdx = new Set([...listProfilesIdx, ...(HOBBIES_PROFILES.get(hobbyIdx) || [])]); // Set
    }
    
    if (!listProfilesIdx?.size) isEmpty = true;

    const relevantListProfilesIdx = getProfilesMatchesAllHobbies(listProfilesIdx, filters.hobbies);
    
    if (!relevantListProfilesIdx?.size) isEmpty = true;

    if (relevantListProfilesIdx?.size && filteredIds.size) {
        const nextFilteredIdx = new Set();
        for (const filteredProfileIdx of filteredIds) {
          if (!relevantListProfilesIdx.has(filteredProfileIdx)) continue;
          nextFilteredIdx.add(filteredProfileIdx);
        }

        filteredIds = nextFilteredIdx;
      }
      if (relevantListProfilesIdx?.size && !filteredIds.size) {
        filteredIds = relevantListProfilesIdx;
      }
    }


    // 4) Filter by nationalities
    if (filters.nationalities && !isEmpty) {
      let listProfilesIdx = new Set();
    for (const nationality of filters.nationalities) {
        const nationalityIdx = String(nationality);
        listProfilesIdx = new Set([...listProfilesIdx, ...(COUNTRIES_PROFILES.get(nationalityIdx) || [])]); // Set
    }


    if (!listProfilesIdx?.size) isEmpty = true;

    const relevantListProfilesIdx = getProfilesMatchesAllCountries(listProfilesIdx, filters.nationalities, filteredIds);
    
    if (!relevantListProfilesIdx?.size) isEmpty = true;

    if (relevantListProfilesIdx?.size && filteredIds.size) {
        const nextFilteredIdx = new Set();
        for (const filteredProfileIdx of filteredIds) {
          if (!relevantListProfilesIdx.has(filteredProfileIdx)) continue;
          nextFilteredIdx.add(filteredProfileIdx);
        }
    
        filteredIds = nextFilteredIdx;
    }

    if (relevantListProfilesIdx?.size && !filteredIds.size) {
      filteredIds = relevantListProfilesIdx;
    }
  }

  let results = [];
  
  // 5) Filter get full(profile) data of filtered out ids
  if (!isEmpty) {
    results = filteredIds?.size
      ? DATA.filter(p => filteredIds.has(p.id))
      : [...DATA];
  }

  // 6) Cursor-based pagination
  const size = parseInt(req.query.size, 10) || 20;
  let startIndex = 0;
  if (req.query.cursor) {
    try {
      const decoded = Buffer.from(req.query.cursor, 'base64').toString('utf-8');
      const [, lastId] = decoded.split(':');
      const idx = results.findIndex(p => p.id === lastId);
      if (idx !== -1) startIndex = idx + 1;
    } catch {
      startIndex = 0;
    }
  }

  // 7) Create next_cursor
  const pageItems = results.slice(startIndex, startIndex + size);
  let next_cursor = null;
  if (startIndex + size < results.length) {
    const last = pageItems[pageItems.length - 1];
    next_cursor = Buffer.from(`id:${last.id}`).toString('base64');
  }  

  // 8) Response
  res.json({
    pagination: { size, next_cursor },
    results: pageItems,
  });
});

// =========================
// TASK 2
// =========================

// GET: Stream Text
app.get(`/${API_VERSION}/stream-text`, async (_, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  const longText = faker.lorem.paragraph(32);

  for (let letter of longText) {
    res.write(letter);
    await new Promise(resolve => setTimeout(() => resolve(), 10));
  }

  res.end();
});

// =========================
// TASK 3
// =========================

// init in-memory queue
let queue = [];

const workers = [];
const WORKER_POOL_SIZE = 4;

for (let i = 0; i < WORKER_POOL_SIZE; i++) {
  const worker = new Worker(workerPath);
  worker.busy = false;
  workers.push(worker);
  
  worker.on('message', ({ id, result }) => {
    worker.busy = false;

    for (const wsClient of wss.clients) {
      if (wsClient.readyState === WebSocket.OPEN) {
        wsClient.send(JSON.stringify({ id, result }));
      }
    }

    processQueue();
  });
}

// processing queue
function processQueue() {
  if (queue.length === 0) return;

  for (const worker of workers) {
    if (!worker.busy && queue.length > 0) {
      const id = queue.shift();
      worker.busy = true;
      worker.postMessage({ id });
    }
  }
}

// POST: Queue Requests
app.post(`/${API_VERSION}/queue`, (req, res) => {
  const { id } = req.body;
  if (typeof id !== 'number') {
    return res.status(400).json({ error: 'Missing numeric id' })
  };

  queue.push(id);
  res.json({ id, status: 'pending' });
  
  processQueue();
});

// terminate all workers
async function shutdownWorkers() {
  console.log('all workers are terminated');
  for (const worker of workers) {
    await worker.terminate(); 
  }
  console.log('✅ All workers terminated');
}

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await shutdownWorkers();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await shutdownWorkers();
  process.exit(0);
});
