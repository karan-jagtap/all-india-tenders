"""
Feedback & Contact Us API Routes
Accepts user feedback, stores in SQLite database, and triggers notification to kmessilj@gmail.com.
"""

import re
from fastapi import APIRouter, HTTPException, Query, Response, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List
from app.services.feedback_service import save_feedback, list_recent_feedback

router = APIRouter(tags=["Feedback & Contact Us"])

class FeedbackSubmissionRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=120, description="User full name")
    email: str = Field(..., min_length=3, max_length=150, description="User email address")
    phone: Optional[str] = Field(None, max_length=50, description="Optional contact or WhatsApp number")
    subject: Optional[str] = Field(None, max_length=150, description="Subject or topic of inquiry")
    message: str = Field(..., min_length=1, max_length=10000, description="Detailed feedback or message")


@router.post("/feedback", status_code=status.HTTP_201_CREATED)
async def submit_feedback(payload: FeedbackSubmissionRequest):
    """
    Submits user feedback / contact inquiry.
    Stores record in SQLite database and dispatches notification to kmessilj@gmail.com.
    """
    # Basic email format validation
    email_regex = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
    if not re.match(email_regex, payload.email.strip()):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Please provide a valid email address."
        )

    try:
        result = save_feedback(
            name=payload.name,
            email=payload.email,
            phone=payload.phone,
            subject=payload.subject,
            message=payload.message
        )
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "status": "success",
                "message": "Thank you! Your submission has been received successfully.",
                "submission_id": result["id"],
                "created_at": result["created_at"]
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to process feedback submission: {str(e)}"
        )


@router.get("/feedback/submissions")
async def get_feedback_submissions(limit: int = Query(50, ge=1, le=200)):
    """
    Returns recent feedback submissions from the database.
    """
    try:
        submissions = list_recent_feedback(limit=limit)
        return JSONResponse(content={"total": len(submissions), "submissions": submissions})
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to retrieve submissions: {str(e)}"
        )
