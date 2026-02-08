from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from database import get_session
from models.task_model import Tag, TagCreate, TagRead
from utils.error_formatter import format_error, format_success

router = APIRouter()


@router.post("/tags", response_model=TagRead, status_code=201)
def create_tag(tag_data: TagCreate, session: Session = Depends(get_session)):
    """Create a new tag"""
    try:
        # Check if tag already exists
        existing_tag = session.exec(select(Tag).where(Tag.name == tag_data.name)).first()
        if existing_tag:
            raise HTTPException(status_code=400, detail=f"Tag with name '{tag_data.name}' already exists")
        
        tag = Tag(name=tag_data.name)
        session.add(tag)
        session.commit()
        session.refresh(tag)
        return tag
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create tag")


@router.get("/tags", response_model=List[TagRead])
def get_tags(session: Session = Depends(get_session)):
    """Get all tags"""
    try:
        tags = session.exec(select(Tag)).all()
        return tags
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to retrieve tags")


@router.get("/tags/{id}", response_model=TagRead)
def get_tag(id: int, session: Session = Depends(get_session)):
    """Get a specific tag by ID"""
    try:
        tag = session.get(Tag, id)
        if not tag:
            raise HTTPException(status_code=404, detail="Tag not found")
        return tag
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to retrieve tag")


@router.delete("/tags/{id}", status_code=204)
def delete_tag(id: int, session: Session = Depends(get_session)):
    """Delete a specific tag by ID"""
    try:
        tag = session.get(Tag, id)
        if not tag:
            raise HTTPException(status_code=404, detail="Tag not found")
        
        session.delete(tag)
        session.commit()
        return {"message": "Tag deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to delete tag")