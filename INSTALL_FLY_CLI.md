# Install Fly CLI in Codespace

## Method 1: Direct Installation
```bash
# Download and install Fly CLI
curl -L https://fly.io/install.sh | sh

# Add to PATH (add this to your ~/.bashrc to make it permanent)
echo 'export PATH="$HOME/.fly/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verify installation
fly --version
```

## Method 2: If Method 1 Fails
```bash
# Download binary directly
wget -O fly.tar.gz https://github.com/superfly/flyctl/releases/latest/download/flyctl_Linux_x86_64.tar.gz

# Extract and install
tar -xzf fly.tar.gz
sudo mv flyctl /usr/local/bin/fly

# Verify
fly --version
```

## Method 3: Using Package Manager
```bash
# Install via snap (if available)
sudo snap install flyctl

# Or via apt (Ubuntu/Debian)
curl -L https://fly.io/install.sh | sh
```

## After Installation
```bash
# Login to Fly.io
fly auth login

# List your apps
fly apps list
```

## Next Steps After Installation
Once Fly CLI is installed, continue with:

1. **Login**: `fly auth login`
2. **Find app name**: `fly apps list`
3. **Add AWS secrets**: 
```bash
fly secrets set AWS_ACCESS_KEY_ID=AKIAZ6UGK7KX2BFFZHGO --app YOUR_APP_NAME
fly secrets set AWS_SECRET_ACCESS_KEY=yWGu4E12n/OtJXk3zn4YTdMMGV24A3teg1hkZVpn --app YOUR_APP_NAME
```

Try Method 1 first - if it doesn't work, try Method 2!
