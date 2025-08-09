# Fixed Domain Setup Commands

## The fly.toml file is now fixed! ✅

Try these commands again:

## Step 1: Add SSL Certificates

```bash
fly certs create thevisabay.com --app thevisabay
fly certs create www.thevisabay.com --app thevisabay
```

## Step 2: Get IP Address

```bash
fly ips list --app thevisabay
```

## Step 3: Check Certificate Status

```bash
fly certs list --app thevisabay
```

## Step 4: DNS Records (Add these at your domain registrar)

Use the IP from Step 2:

```
Type: A, Name: @, Value: [YOUR_FLY_IP]
Type: A, Name: www, Value: [YOUR_FLY_IP]
```

## Alternative: Use Your Existing Working App

Your app is already working at:
https://a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev/

You can add the domain to this existing app instead:

```bash
# First find the exact app name
fly apps list

# Then add domain to existing working app
fly certs create thevisabay.com --app [EXISTING_APP_NAME]
fly certs create www.thevisabay.com --app [EXISTING_APP_NAME]
```

The fly.toml error is now fixed!
