# SyncSpace
A real-time collaborative whiteboard and code editor powered by WebSockets and CRDTs (Yjs) for conflict-free concurrent editing
# SyncSpace 🌌

> A real-time collaborative whiteboard and code editor built for distributed engineering teams and technical interviews.

SyncSpace solves the complex problem of concurrent multi-user editing. By moving away from standard request/response models and implementing Conflict-free Replicated Data Types (CRDTs) over WebSockets, this platform ensures that multiple users can draw on a canvas or type code at the exact same millisecond without race conditions, lag, or data overwriting.

## 🚀 Features

* **Real-Time Code Editor:** Embedded Monaco Editor (the engine powering VS Code) synced instantly across all clients.
* **Interactive Whiteboard:** A high-performance 2D canvas for drawing architecture diagrams, shapes, and text.
* **Zero-Conflict Syncing:** Mathematical conflict resolution handles simultaneous edits on the same line of code or canvas object without breaking the document state.
* **Low-Latency Communication:** Bi-directional data flow ensures instant updates across distributed clients.

## 🛠 Tech Stack

| Module | Technology |
| :--- | :--- |
| **Frontend Framework** | React |
| **Real-Time Engine** | WebSockets (Socket.io) |
| **State Synchronization** | Yjs (CRDT Implementation) |
| **Code Editor** | Monaco Editor |
| **Canvas API** | Konva.js / Fabric.js |
| **Backend** | Node.js / Express |

## 🧠 System Architecture & CRDTs

Standard state management fails when multiple users edit the same document concurrently. SyncSpace relies on **Yjs**, a high-performance CRDT framework. 

Instead of locking the document or overwriting states, Yjs treats the code editor and the whiteboard as mathematical sets. When Client A and Client B make simultaneous changes, the WebSockets broadcast the operations, and the CRDT algorithm merges the states peer-to-peer. This guarantees that all clients eventually converge on the exact same state without requiring a central, authoritative database lock.

## 💻 Getting Started

### Prerequisites
* Node.js (v16 or higher)
* npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/SyncSpace.git](https://github.com/yourusername/SyncSpace.git)
   cd SyncSpace
2.  cd server
npm install
3.  cd ../client
npm install
4.  cd server
npm run dev
