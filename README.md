# <img src="./app/src/lib/assets//UP.png" width="28"/> UPB Subaybay

UPB Subaybay is an internal document request tracker for the Office of the University Registrar (OUR) of the
University of the Philippines Baguio.

This project was developed as part of our CMSC 128 (Software Engineering) course at UP Baguio.
For the installation process, please see [Installation section](#installation).

<!-- idk if [text](#id) works in github MD-->

## Motivation

The OUR previously relied on manual tracking of documents, which can be prone to errors and delays.
UPB Subaybay was developed to help the OUR manage and track requests more efficiently.

### Developers

<details>
    <summary>
        <b>
            Team ZEBrA
        </b>
    </summary>
    <blockquote>
        <ul>
            <li>Zedrick</li>
            <li>Grandemir</li>
            <li>Brymer</li>
            <li><a href="https://github.com/AndreBryant">Andre Bryant Bagalso</a></li>
        </ul>
        <details>
            <summary>
                Note to team
            </summary>
            <blockquote>
            <p>Push a commit with your full names added (if you don't mind your full names showing here).</p>
            <p>- Andre (Best Project manager)</p>
            </blockquote>
        </details>
    </blockquote>
</details>

## Features

- **Authorized Access only** – only authorized accounts (managed by those with admin roles) can log in via Google OAuth.

- **Request Tracking** – monitor requests, with clear details of who submitted them and what stage they are in.

- **In-App Notifications** – users get updated in real time whenever a document status changes within the office, if it concerns them.

- **Admin Dashboard** – overview for administrators to manage users and requests efficiently.

- **Excel Report Generation** – export data for reporting and record-keeping.

- **Email Notifications** – option to automatically notify students once their requested document is ready for pickup.

- **Built-in Chat** – enable easier communication among office staff without leaving the system.

- **Manual** - an intuitive and easy to understand guide on how to use the software.

## Tech Stack

### App

<!-- Add links -->

- [SvelteKit](https://svelte.dev)
- [TailwindCSS](https://tailwindcss.com)
- [shadcn-svelte](https://shadcn-svelte.com)

### Backend

- [Rust](https://www.rust-lang.org)

### Docs (Manual)

- [Vitepress](https://vitepress.dev)

### Other tools and technologies

- [Node.js](https://nodejs.org/en) runtime environment
- [MongoDB](https://www.mongodb.com)
- [Docker](https://www.docker.com)

## Installation

### Prerequisites

- Git ([installation guide](https://github.com/git-guides/install-git))
- [Node.js](https://nodejs.org/en) (with `npm`)
- [Docker](https://www.docker.com) & Docker Compose
- [Make](https://www.gnu.org/software/make)

### Cloning the repo:

```
git clone https://github.com/brymer-meneses/Subaybay
cd Subaybay
```

#### If git is not installed on your machine:

1. Click the green **Code** button at the top of the repository page.

2. Select **Download ZIP**.

3. Extract the contents of the ZIP file.

4. Open a terminal in the extracted `Subaybay` folder.

<!-- UNchanged -->

### Running the software

We used a `Makefile` to automate tasks.

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

### Notes

This application makes use of Google Authentication, as such it expects the
environment variables `GOOGLE_CLIENT_SECRET` and `GOOGLE_CLIENT_ID` to be
defined in a file `.env` in the root directory.
