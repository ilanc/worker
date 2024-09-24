# workers

- Can you share state between worker and main?
  - no - pass messages back/forth, no shared state
- Do you need custom serialize/deserialize rules to send data between worker and main?
  - no - `postMessage()` will handle all types for you automatically

## how to run

```sh
npm run dev &
xdg-open http://127.0.0.1:8080/ &
# no open dev console and check messages
```