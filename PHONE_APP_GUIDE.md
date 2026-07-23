# Khayubdi Phone App Guide

## Open on a phone in the same Wi-Fi

1. Double-click `START_PHONE_APP.bat`.
2. Keep the black server window open.
3. The computer will open:

```text
http://localhost:3010/phone
```

4. On the phone, connect to the same Wi-Fi as this computer.
5. Open the `Phone:` URL shown in the server window or on `/phone`, for example:

```text
http://192.168.1.38:3010/
```

If it does not open, allow Node.js through Windows Firewall for Private networks.

## Open from mobile internet outside the house

The local computer URL cannot be reached from 4G/5G by itself. To use the app from anywhere, deploy the app to a public HTTPS server, for example:

- Render, Railway, Fly.io, or a VPS for the Node backend
- A real domain name with HTTPS
- Environment variables from `.env`

Apple Health, Google Fit, Apple ID login, Facebook login, and Google login also require a real HTTPS public URL before production use.

## Render deployment

This project includes `render.yaml`.

1. Push the project to GitHub.
2. Create a new Render Blueprint from that repository.
3. Add the secret environment variables requested by Render.
4. Deploy.

The app stores data in the persistent disk mounted at `/var/data` through `DATA_DIR=/var/data`.
