# Subaybay

Internal Document Tracker for the Office of the University Registrar of the
University of the Philippines Baguio

## Running

We use `Makefile` to automate tasks. Invoke the following command to run the
client and initialize the database on **development** mode.

```bash
make run
```

To run the application in **production**, invoke

```bash
make run MODE=prod
```

## Notes

This application makes use of Google Authentication, as such it expects the
environment variables `GOOGLE_CLIENT_SECRET` and `GOOGLE_CLIENT_ID` to be
defined in a file `.env` in the root directory.
