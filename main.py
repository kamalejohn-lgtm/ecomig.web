from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# API routes
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# Serve React static files
# Ensure the 'dist' directory exists (built by npm run build)
if os.path.exists("dist"):
    app.mount("/", StaticFiles(directory="dist", html=True), name="static")

@app.get("/{full_path:path}")
async def serve_react(full_path: str):
    # Fallback to index.html for SPA routing
    dist_path = os.path.join(os.getcwd(), "dist", "index.html")
    if os.path.exists(dist_path):
        return FileResponse(dist_path)
    return {"error": "Frontend not built. Please run 'npm run build' first."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
