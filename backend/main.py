from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os

from database.supabase_client import get_supabase_client

app = FastAPI(title="CRUD API", version="1.0.0")

# CORS middleware to allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ItemCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class Item(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

# CRUD endpoints
@app.get("/")
async def root():
    return {"message": "FastAPI CRUD API is running"}

@app.get("/api/items", response_model=List[Item])
async def get_items(supabase=Depends(get_supabase_client)):
    """Get all items"""
    try:
        response = supabase.table("items").select("*").order("created_at", desc=True).execute()
        items = response.data
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/items/{item_id}", response_model=Item)
async def get_item(item_id: int, supabase=Depends(get_supabase_client)):
    """Get a single item by ID"""
    try:
        response = supabase.table("items").select("*").eq("id", item_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Item not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/items", response_model=Item, status_code=201)
async def create_item(item: ItemCreate, supabase=Depends(get_supabase_client)):
    """Create a new item"""
    try:
        response = supabase.table("items").insert({
            "name": item.name,
            "description": item.description
        }).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to create item")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/items/{item_id}", response_model=Item)
async def update_item(item_id: int, item: ItemUpdate, supabase=Depends(get_supabase_client)):
    """Update an existing item"""
    try:
        # Check if item exists
        check_response = supabase.table("items").select("id").eq("id", item_id).execute()
        if not check_response.data:
            raise HTTPException(status_code=404, detail="Item not found")
        
        # Build update dict (only include provided fields)
        update_data = {}
        if item.name is not None:
            update_data["name"] = item.name
        if item.description is not None:
            update_data["description"] = item.description
        
        response = supabase.table("items").update(update_data).eq("id", item_id).execute()
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/items/{item_id}", status_code=204)
async def delete_item(item_id: int, supabase=Depends(get_supabase_client)):
    """Delete an item"""
    try:
        # Check if item exists
        check_response = supabase.table("items").select("id").eq("id", item_id).execute()
        if not check_response.data:
            raise HTTPException(status_code=404, detail="Item not found")
        
        supabase.table("items").delete().eq("id", item_id).execute()
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
