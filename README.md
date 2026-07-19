"scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
   
    "start": "node dist/server.js",
      "stripe:webhook": "stripe listen --forward-to localhost:5000/api/payments/webhook"
  },//