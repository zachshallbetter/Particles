# Security Policy

## Reporting a vulnerability

Please report security issues privately rather than opening a public issue. Use GitHub private vulnerability
reporting: <https://github.com/zachshallbetter/Particles/security/advisories/new>.

Include:

- a description of the issue and its impact,
- steps to reproduce (a minimal example is ideal),
- the affected commit or version.

This is a solo-maintained project. Responses and fixes are best-effort, with no SLA and no guaranteed response time.
Please give a reasonable window to ship a fix before any public disclosure.

## Scope

Particles is a client-side React and Vite application that renders particle and wave animations on a canvas. It has no server component of its own. Reports about vulnerable or malicious dependencies in `package.json`, or about unsafe handling of input in the browser, are in scope.

## Supported versions

While the version is 0.x (`package.json` declares 0.1.0), only the latest commit on `main` receives fixes. No versions are tagged or released yet.
