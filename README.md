# Subaybay

Internal Document Tracker for the Office of the University Registrar of the
University of the Philippines Baguio

## Running

We use a `Makefile` to automate tasks. 

```bash
# run all the services
make start
```
Invoking `make start` will run all the services defined `compose.yaml`, this is
not ideal since we want hot-reloading while debugging the svelte-kit app. Instead, we
can selectively run the services as follows:

```bash
make start SERVICES="docs backend"
cd app
npm run dev
```

## Notes

This application makes use of Google Authentication, as such it expects the
environment variables `GOOGLE_CLIENT_SECRET` and `GOOGLE_CLIENT_ID` to be
defined in a file `.env` in the root directory.
