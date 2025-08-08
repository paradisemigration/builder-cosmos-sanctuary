#!/usr/bin/env node

// Quick backup trigger for TheVisaBay.com
// Run this to create backup immediately

import fetch from "node-fetch";

async function createBackupNow() {
  console.log("🚀 TheVisaBay.com - Creating Backup Now!");
  console.log("=".repeat(50));

  try {
    // Try local API first
    console.log("📡 Triggering backup via API...");
    const response = await fetch(
      "http://localhost:3001/api/admin/create-complete-backup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Backup created successfully!");
      console.log(JSON.stringify(result, null, 2));
    } else {
      throw new Error(`API Error: ${response.status}`);
    }
  } catch (apiError) {
    console.log("⚠️  API not available, creating backup directly...");

    // Import and run backup system directly
    const { default: BackupSystem } = await import("./server/backup-system.js");
    const backupSystem = new BackupSystem();
    const result = await backupSystem.createCompleteBackup();

    console.log("✅ Direct backup completed!");
    console.log("📦 Backup Details:");
    console.log(`📍 Location: ${result.backupLocation}`);
    console.log(`📁 Archive: ${result.archiveLocation}`);
    console.log("🎯 Components backed up:");
    result.components.forEach((comp) => console.log(`  ✓ ${comp}`));
  }
}

createBackupNow().catch(console.error);
