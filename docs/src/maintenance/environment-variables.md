# Environment Variables

The following are the environment variables necessary to make the app run.

## Google Authentication

| Variable               | Information                                                       |
| ---------------------- | ----------------------------------------------------------------- |
| `GOOGLE_CLIENT_ID`     | The client ID provided by Google for OAuth 2.0 authentication     |
| `GOOGLE_CLIENT_SECRET` | The client secret provided by Google for OAuth 2.0 authentication |

## Application Server

| Variable   | Information                                       |
| ---------- | ------------------------------------------------- |
| `APP_PORT` | The port number for the application's main server |

## Rust Server

| Variable       | Information                                                         |
| -------------- | ------------------------------------------------------------------- |
| `BACKEND_PORT` | The port number for the Rust server (responsible for notifications) |

## Database

| Variable            | Information                                             |
| ------------------- | ------------------------------------------------------- |
| `DATABASE_PORT`     | The port number for the database server                 |
| `DATABASE_HOSTNAME` | The hostname of the database server                     |
| `DATABASE_NAME`     | The name of the database (_subaybay_ by default)        |
| `DATABASE_USERNAME` | The username of the account used to access the database |
| `DATABASE_PASSWORD` | The password to the database                            |

## Manual

| Variable    | Information                             |
| ----------- | --------------------------------------- |
| `DOCS_PORT` | The port for the manual to be hosted on |

## Email

| Variable                 | Information                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| `GOOGLE_SENDER_EMAIL`    | The email used to automatically notify requesters that their request is done being processed   |
| `GOOGLE_SENDER_PASSWORD` | The password to the email used to notify requesters that their request is done being processed. You can get this from [here](https://myaccount.google.com/apppasswords). |
