<img src="nodes/Beszel/beszel.svg" width="90" align="right" alt="Beszel" />

# n8n-nodes-beszel

[![npm version](https://img.shields.io/npm/v/n8n-nodes-beszel.svg)](https://www.npmjs.com/package/n8n-nodes-beszel)
[![npm downloads](https://img.shields.io/npm/dm/n8n-nodes-beszel.svg)](https://www.npmjs.com/package/n8n-nodes-beszel)
[![License: MIT](https://img.shields.io/npm/l/n8n-nodes-beszel.svg)](./LICENSE)
[![n8n verified](https://img.shields.io/badge/n8n-verified%20community%20node-EA4B71)](https://docs.n8n.io/integrations/community-nodes/installation/verified-install/)

Community node for **n8n** to interact with **Beszel**. It lets you automate
Beszel directly from your n8n workflows using a secure stored credential.

> ✅ **Verified community node** — installable directly from the n8n node panel
> (self-hosted **and** n8n Cloud).

## Installation

This is a **verified** community node: in n8n click **+ (Add node)**, search for
**Beszel**, and add it — no manual install needed.

<details>
<summary>Manual install (older n8n, or as an unverified package)</summary>

Go to **Settings → Community Nodes → Install** and enter `n8n-nodes-beszel`.
</details>

## Operations

| Operation | Description |
|---|---|
| **Get** | Get a system by ID |
| **Get Many** | Get all monitored systems |
| **Get Many** | Get all alerts |

## Authentication

This node uses the **Beszel API** credential. In n8n, go to **Credentials → New**, pick
**Beszel API**, and fill in:

- **Base URL** — the address of your instance, e.g. `http://beszel:8090` (no trailing slash).
- **Password** — your account password.
- **Email** — your account email.

The node logs in with your username/password to obtain a session token, then reuses it automatically.

**Where to find it:** See the service documentation: https://beszel.dev

The credential's **Test** button verifies the connection before you save.

## Usage

1. Add the **Beszel** node to a workflow (after a trigger such as *When clicking 'Test workflow'* or a Schedule Trigger).
2. Select your **Beszel API** credential.
3. Pick an **Operation** and run the workflow — the response is returned as JSON for the next node.

## Compatibility

Requires n8n **1.0** or newer. Built and linted with the official `@n8n/node-cli`, and
published to npm with a build-provenance attestation.

## Resources

- [Beszel](https://beszel.dev)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](./LICENSE)
