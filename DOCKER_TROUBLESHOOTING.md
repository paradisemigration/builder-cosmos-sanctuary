# 🔧 Docker Build Troubleshooting Guide

## Current Issue

`npm ci --verbose` failing during Fly.io deployment with exit code 1

## Solutions Applied

### Solution 1: Enhanced Dockerfile (Current)

- Switched from `npm ci` to `npm install --legacy-peer-deps`
- Added comprehensive system dependencies
- Cleared npm cache before installation
- Removed strict production pruning

### Solution 2: Simple Dockerfile (Alternative)

If the enhanced version fails, you can try the simpler approach:

```bash
# Rename current Dockerfile
mv Dockerfile Dockerfile.enhanced

# Use the simple version
mv Dockerfile.simple Dockerfile

# Deploy
flyctl deploy --app thevisabay
```

## Common Causes & Fixes

### 1. Native Dependencies

**Problem**: SQLite packages require compilation  
**Fix**: Added build tools and SQLite development headers

### 2. Package Lock Conflicts

**Problem**: package-lock.json version mismatches  
**Fix**: Use `npm install` instead of `npm ci`

### 3. Peer Dependency Issues

**Problem**: Conflicting dependency versions  
**Fix**: Added `--legacy-peer-deps` flag

### 4. Memory Issues

**Problem**: Build runs out of memory  
**Fix**: Use smaller base image or increase memory

## Deploy Commands

**Try Enhanced Version:**

```bash
cd code
flyctl deploy --app thevisabay
```

**If fails, try Simple Version:**

```bash
cd code
mv Dockerfile Dockerfile.enhanced
mv Dockerfile.simple Dockerfile
flyctl deploy --app thevisabay
```

## Fallback Options

1. **Remove problematic packages** temporarily
2. **Use Docker multi-stage build**
3. **Pre-build on compatible system**
4. **Switch to different base image** (ubuntu instead of alpine)

The enhanced Dockerfile should resolve most native dependency issues!
