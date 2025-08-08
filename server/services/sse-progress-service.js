import { EventEmitter } from "events";

class SSEProgressService extends EventEmitter {
  constructor() {
    super();
    this.clients = new Map();
    this.clientIdCounter = 0;
  }

  addClient(res) {
    const clientId = ++this.clientIdCounter;

    // Configure SSE headers
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    });

    // Store client
    this.clients.set(clientId, res);

    console.log(`📡 SSE Client ${clientId} connected`);

    // Send welcome message
    this.sendToClient(clientId, "connected", {
      clientId,
      message: "Connected to Ultra-Fast S3 Sync progress stream",
      timestamp: new Date().toISOString(),
    });

    // Handle client disconnect
    res.on("close", () => {
      this.clients.delete(clientId);
      console.log(`📡 SSE Client ${clientId} disconnected`);
    });

    return clientId;
  }

  sendToClient(clientId, event, data) {
    const client = this.clients.get(clientId);
    if (client) {
      try {
        client.write(`event: ${event}\n`);
        client.write(`data: ${JSON.stringify(data)}\n\n`);
      } catch (error) {
        console.error(`Failed to send to client ${clientId}:`, error);
        this.clients.delete(clientId);
      }
    }
  }

  broadcast(event, data) {
    const message = {
      ...data,
      timestamp: new Date().toISOString(),
    };

    for (const [clientId, client] of this.clients) {
      this.sendToClient(clientId, event, message);
    }

    console.log(`📡 Broadcasted '${event}' to ${this.clients.size} clients`);
  }

  // Sync Engine Event Handlers
  onSyncStarted(data) {
    this.broadcast("syncStarted", {
      message: "Ultra-Fast S3 Sync started",
      ...data,
    });
  }

  onProgress(data) {
    this.broadcast("progress", {
      message: `Processing batch ${data.batch}/${data.totalBatches}`,
      ...data,
    });
  }

  onSyncCompleted(data) {
    this.broadcast("syncCompleted", {
      message: "Ultra-Fast S3 Sync completed successfully",
      ...data,
    });
  }

  onSyncError(data) {
    this.broadcast("syncError", {
      message: "Ultra-Fast S3 Sync encountered an error",
      ...data,
    });
  }

  onSyncStopped(data) {
    this.broadcast("syncStopped", {
      message: "Ultra-Fast S3 Sync was stopped",
      ...data,
    });
  }

  getStats() {
    return {
      connectedClients: this.clients.size,
      totalClients: this.clientIdCounter,
    };
  }
}

// Export singleton instance
const sseService = new SSEProgressService();
export default sseService;
