# n8n-nodes-beszel

An [n8n](https://n8n.io) community node for **[Beszel](https://beszel.dev)** — read your monitored systems and alerts from the Beszel hub.

## Installation
In n8n: **Settings → Community Nodes → Install** → `n8n-nodes-beszel`.

## Credentials
**Beszel API** (the hub runs on PocketBase):
- **Base URL** — e.g. `http://beszel:8090`
- **Email** / **Password** — a Beszel user

n8n exchanges these for a session token automatically.

## Operations
| Resource | Operations |
|----------|------------|
| **System** | Get Many, Get (by ID) |
| **Alert** | Get Many |

Each system record includes status, host info and latest stats.

## Usage example
Schedule **System → Get Many**, then IF any system's `status` is `down` → send a notification.

## Resources
- [Beszel](https://beszel.dev)
- [n8n community nodes](https://docs.n8n.io/integrations/community-nodes/)

## License
[MIT](LICENSE.md)
