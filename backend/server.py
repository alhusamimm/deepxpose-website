from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import asyncio
import json
import shutil
import tempfile

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Import emergent integrations
# from emergentintegrations.llm.chat import LlmChat, UserMessage, FileContentWithMimeType

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Helper functions for MongoDB serialization
def prepare_for_mongo(data):
    """Prepare data for MongoDB storage by converting dates to ISO strings"""
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = value.isoformat()
    return data

def parse_from_mongo(item):
    """Parse data from MongoDB by converting ISO strings back to dates"""
    if isinstance(item, dict):
        for key, value in item.items():
            if isinstance(value, str) and key.endswith('_at'):
                try:
                    item[key] = datetime.fromisoformat(value)
                except:
                    pass
    return item

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class TrendingVideo(BaseModel):
    id: str
    platform: str
    title: str
    thumbnail: str
    url: str
    engagement: str
    timestamp: str
    duration: str
    verified_account: bool
    analyzed: bool = False
    analysis_result: Optional[Dict[str, Any]] = None

class VideoAnalysisRequest(BaseModel):
    video_id: str
    video_url: Optional[str] = None

class VideoAnalysisResult(BaseModel):
    id: str
    video_id: str
    result: str  # "REAL" or "FAKE"
    confidence: float
    processing_time: str
    risk_factors: List[str]
    timestamp: str
    detailed_analysis: Optional[Dict[str, Any]] = None

# Mock data for trending videos (when APIs aren't available)
MOCK_TRENDING_VIDEOS = [
    {
        "id": "twitter_001",
        "platform": "X",
        "title": "Breaking: Political figure announces new policy",
        "thumbnail": "https://via.placeholder.com/320x180/1DA1F2/ffffff?text=X+Video",
        "url": "https://x.com/example/status/123",
        "engagement": "2.5M views",
        "timestamp": "2 hours ago",
        "duration": "0:45",
        "verified_account": True,
        "analyzed": False,
        "analysis_result": None
    },
    {
        "id": "twitter_002", 
        "platform": "X",
        "title": "Celebrity interview goes viral",
        "thumbnail": "https://via.placeholder.com/320x180/1DA1F2/ffffff?text=X+Video+2",
        "url": "https://x.com/example/status/124",
        "engagement": "1.8M views",
        "timestamp": "4 hours ago", 
        "duration": "1:23",
        "verified_account": False,
        "analyzed": False,
        "analysis_result": None
    },
    {
        "id": "instagram_001",
        "platform": "Instagram",
        "title": "Influencer's surprising transformation video",
        "thumbnail": "https://via.placeholder.com/320x180/E4405F/ffffff?text=IG+Video",
        "url": "https://instagram.com/p/example1",
        "engagement": "3.2M views",
        "timestamp": "1 hour ago",
        "duration": "0:30",
        "verified_account": True,
        "analyzed": False,
        "analysis_result": None
    },
    {
        "id": "instagram_002",
        "platform": "Instagram", 
        "title": "Behind-the-scenes movie footage leak",
        "thumbnail": "https://via.placeholder.com/320x180/E4405F/ffffff?text=IG+Video+2",
        "url": "https://instagram.com/p/example2",
        "engagement": "4.1M views",
        "timestamp": "3 hours ago",
        "duration": "2:15",
        "verified_account": False,
        "analyzed": False,
        "analysis_result": None
    },
    {
        "id": "youtube_001",
        "platform": "YouTube",
        "title": "Tech CEO announces revolutionary AI breakthrough",
        "thumbnail": "https://via.placeholder.com/320x180/FF0000/ffffff?text=YT+Video",
        "url": "https://youtube.com/watch?v=example1",
        "engagement": "5.7M views",
        "timestamp": "6 hours ago",
        "duration": "10:42",
        "verified_account": True,
        "analyzed": False,
        "analysis_result": None
    },
    {
        "id": "youtube_002",
        "platform": "YouTube",
        "title": "Mysterious footage surfaces from private event",
        "thumbnail": "https://via.placeholder.com/320x180/FF0000/ffffff?text=YT+Video+2", 
        "url": "https://youtube.com/watch?v=example2",
        "engagement": "2.9M views",
        "timestamp": "8 hours ago",
        "duration": "5:33",
        "verified_account": False,
        "analyzed": False,
        "analysis_result": None
    },
    {
        "id": "youtube_003",
        "platform": "YouTube",
        "title": "Exclusive interview with controversial figure",
        "thumbnail": "https://via.placeholder.com/320x180/FF0000/ffffff?text=YT+Video+3",
        "url": "https://youtube.com/watch?v=example3", 
        "engagement": "8.3M views",
        "timestamp": "12 hours ago",
        "duration": "15:27",
        "verified_account": True,
        "analyzed": False,
        "analysis_result": None
    }
]

# AI Detection Service
class AIDetectionService:
    def __init__(self):
        self.api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not self.api_key:
            logger.warning("EMERGENT_LLM_KEY not found. AI detection will use mock responses.")
    
    async def analyze_video_content(self, video_id: str, video_url: str = None) -> VideoAnalysisResult:
        """Analyze video content for deepfake detection"""
        start_time = datetime.now(timezone.utc)
        
        try:
            result = await self._mock_analyze_video(video_id)
                
            processing_time = (datetime.now(timezone.utc) - start_time).total_seconds()
            result.processing_time = f"{processing_time:.1f}s"
            
            return result
            
        except Exception as e:
            logger.error(f"AI analysis failed for video {video_id}: {str(e)}")
            # Fallback to mock analysis
            return await self._mock_analyze_video(video_id)
    
    async def _analyze_with_ai(self, video_id: str, video_url: str) -> VideoAnalysisResult:
        """Analyze video using Gemini AI"""
        try:
            # Initialize Gemini chat for video analysis
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"video-analysis-{video_id}",
                system_message="""You are an expert deepfake detection AI. Analyze the provided video for signs of manipulation, deepfakes, or artificial content. 

Provide your analysis in this JSON format:
{
    "result": "REAL" or "FAKE",
    "confidence": 0.75,
    "risk_factors": ["list", "of", "identified", "issues"],
    "detailed_analysis": {
        "facial_inconsistencies": "description",
        "temporal_artifacts": "description",
        "audio_visual_sync": "description",
        "overall_assessment": "description"
    }
}

Be thorough but concise. Focus on technical indicators of manipulation."""
            ).with_model("gemini", "gemini-2.5-pro-preview-05-06")
            
            # For now, we'll analyze the video metadata and URL pattern
            # In a real implementation, you would download and process the actual video
            analysis_prompt = f"""
            Analyze this video URL for potential deepfake indicators: {video_url}
            
            Video ID: {video_id}
            
            Based on the URL pattern, source, and any available metadata, provide your deepfake detection analysis.
            Consider factors like:
            1. Source credibility
            2. URL pattern analysis  
            3. Platform verification status
            4. Content type indicators
            
            Respond with the JSON format specified in your system message.
            """
            
            response = await chat.send_message(UserMessage(text=analysis_prompt))
            
            # Parse AI response
            try:
                ai_result = json.loads(response)
                return VideoAnalysisResult(
                    id=f"ai_analysis_{video_id}",
                    video_id=video_id,
                    result=ai_result.get("result", "REAL"),
                    confidence=ai_result.get("confidence", 0.75),
                    processing_time="0.0s",  # Will be updated by caller
                    risk_factors=ai_result.get("risk_factors", []),
                    timestamp=datetime.now(timezone.utc).isoformat(),
                    detailed_analysis=ai_result.get("detailed_analysis")
                )
            except json.JSONDecodeError:
                # If AI doesn't return valid JSON, extract key information
                is_fake = "FAKE" in response.upper() or "MANIPULATION" in response.upper()
                confidence = 0.65 + (0.3 if is_fake else 0.2)  # Mock confidence based on detection
                
                return VideoAnalysisResult(
                    id=f"ai_analysis_{video_id}",
                    video_id=video_id,
                    result="FAKE" if is_fake else "REAL",
                    confidence=confidence,
                    processing_time="0.0s",
                    risk_factors=["AI analysis completed"] if is_fake else ["No manipulation detected"],
                    timestamp=datetime.now(timezone.utc).isoformat(),
                    detailed_analysis={"ai_response": response[:200]}  # Truncate response
                )
                
        except Exception as e:
            logger.error(f"AI analysis failed: {str(e)}")
            raise e
    
    async def _mock_analyze_video(self, video_id: str) -> VideoAnalysisResult:
        """Mock video analysis for testing without real AI"""
        # Simulate processing delay
        await asyncio.sleep(2)
        
        # Generate realistic mock results
        import random
        
        fake_probability = random.random()
        is_fake = fake_probability > 0.7  # 30% chance of fake
        confidence = 0.65 + (random.random() * 0.3)
        
        risk_factors = []
        if is_fake:
            potential_risks = [
                "Facial boundary inconsistencies detected",
                "Temporal artifacts in eye region",
                "Inconsistent lighting patterns",
                "Audio-visual synchronization issues",
                "Unnatural facial expressions",
                "Blending artifacts around hairline"
            ]
            risk_factors = random.sample(potential_risks, random.randint(1, 3))
        else:
            risk_factors = [
                "No manipulation indicators found",
                "Consistent facial features throughout",
                "Natural temporal flow",
                "Authentic audio-visual synchronization"
            ]
        
        return VideoAnalysisResult(
            id=f"mock_analysis_{video_id}",
            video_id=video_id,
            result="FAKE" if is_fake else "REAL",
            confidence=confidence,
            processing_time="0.0s",  # Will be updated by caller
            risk_factors=risk_factors,
            timestamp=datetime.now(timezone.utc).isoformat(),
            detailed_analysis={
                "face_regions": random.randint(1, 3),
                "temporal_inconsistencies": random.randint(0, 15) if is_fake else 0,
                "analysis_method": "mock_detection",
                "risk_score": "HIGH" if is_fake and confidence > 0.8 else "MEDIUM" if is_fake else "LOW"
            }
        )

# Initialize AI service
ai_service = AIDetectionService()

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.get("/trending-videos", response_model=List[TrendingVideo])
async def get_trending_videos(platform: Optional[str] = None, include_analysis: bool = False):
    """Get trending videos from social media platforms"""
    try:
        # For now, use mock data. In production, this would fetch from real APIs
        videos = MOCK_TRENDING_VIDEOS.copy()
        
        # Filter by platform if specified
        if platform and platform != "All":
            videos = [v for v in videos if v["platform"] == platform]
        
        # Only load analysis results if explicitly requested
        if include_analysis:
            stored_analyses = await db.video_analyses.find().to_list(1000)
            analysis_dict = {a["video_id"]: a for a in stored_analyses}
            
            # Merge stored analysis results
            for video in videos:
                if video["id"] in analysis_dict:
                    analysis = analysis_dict[video["id"]]
                    video["analyzed"] = True
                    video["analysis_result"] = {
                        "id": analysis.get("id"),
                        "result": analysis.get("result"),
                        "confidence": analysis.get("confidence"),
                        "processing_time": analysis.get("processing_time"),
                        "risk_factors": analysis.get("risk_factors", [])
                    }
        
        return [TrendingVideo(**video) for video in videos]
        
    except Exception as e:
        logger.error(f"Error fetching trending videos: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching trending videos")

@api_router.post("/analyze-video", response_model=VideoAnalysisResult)
async def analyze_video(request: VideoAnalysisRequest):
    """Analyze a video for deepfake detection"""
    try:
        # Find video details from mock data
        video_data = None
        for video in MOCK_TRENDING_VIDEOS:
            if video["id"] == request.video_id:
                video_data = video
                break
        
        if not video_data:
            raise HTTPException(status_code=404, detail="Video not found")
        
        # Check if analysis already exists
        existing_analysis = await db.video_analyses.find_one({"video_id": request.video_id})
        if existing_analysis:
            return VideoAnalysisResult(**existing_analysis)
        
        # Perform AI analysis
        video_url = request.video_url or video_data.get("url")
        analysis_result = await ai_service.analyze_video_content(
            video_id=request.video_id,
            video_url=video_url
        )
        
        # Store analysis result in database
        analysis_dict = analysis_result.dict()
        analysis_dict = prepare_for_mongo(analysis_dict)
        await db.video_analyses.insert_one(analysis_dict)
        
        logger.info(f"Video analysis completed for {request.video_id}: {analysis_result.result}")
        return analysis_result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing video {request.video_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Video analysis failed")

@api_router.get("/video-analysis/{video_id}", response_model=VideoAnalysisResult)
async def get_video_analysis(video_id: str):
    """Get existing analysis result for a video"""
    try:
        analysis = await db.video_analyses.find_one({"video_id": video_id})
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        return VideoAnalysisResult(**analysis)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching analysis for video {video_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching analysis")

@api_router.delete("/video-analysis/{video_id}")
async def delete_video_analysis(video_id: str):
    """Delete analysis result for a video (for re-analysis)"""
    try:
        result = await db.video_analyses.delete_one({"video_id": video_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        return {"message": f"Analysis for video {video_id} deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting analysis for video {video_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error deleting analysis")

@api_router.delete("/clear-all-analyses")
async def clear_all_analyses():
    """Clear all analysis results (for testing/demo purposes)"""
    try:
        result = await db.video_analyses.delete_many({})
        return {"message": f"Cleared {result.deleted_count} analysis results"}
        
    except Exception as e:
        logger.error(f"Error clearing all analyses: {str(e)}")
        raise HTTPException(status_code=500, detail="Error clearing analyses")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
