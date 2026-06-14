// Mock data for DeepXpose - AI Deepfake Detection Platform

export const mockAnalysisResults = [
  {
    id: "analysis_001",
    filename: "suspicious_video_1.mp4",
    timestamp: "2025-01-27T10:30:00Z",
    result: "FAKE",
    confidence: 0.94,
    processing_time: "2.3s",
    file_size: "15.2 MB",
    duration: "00:00:45",
    thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjY4IiB2aWV3Qm94PSIwIDAgMTIwIDY4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNjgiIGZpbGw9IiMxYjNhNGIiLz48cGF0aCBkPSJNNDUgMjVMNzUgNDJMNDUgNTlWMjVaIiBmaWxsPSIjMDA2NDY2Ii8+PC9zdmc+",
    detailed_analysis: {
      face_regions: 3,
      temporal_inconsistencies: 12,
      artifacts_detected: ["Blending artifacts", "Temporal flickering", "Inconsistent lighting"],
      risk_score: "HIGH"
    }
  },
  {
    id: "analysis_002", 
    filename: "press_conference.mp4",
    timestamp: "2025-01-27T09:15:00Z",
    result: "REAL",
    confidence: 0.87,
    processing_time: "3.1s",
    file_size: "28.7 MB",
    duration: "00:02:15",
    thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjY4IiB2aWV3Qm94PSIwIDAgMTIwIDY4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNjgiIGZpbGw9IiMxNDQ1NTIiLz48cGF0aCBkPSJNNDUgMjVMNzUgNDJMNDUgNTlWMjVaIiBmaWxsPSIjMDA2NDY2Ii8+PC9zdmc+",
    detailed_analysis: {
      face_regions: 1,
      temporal_inconsistencies: 0,
      artifacts_detected: [],
      risk_score: "LOW"
    }
  },
  {
    id: "analysis_003",
    filename: "social_media_clip.mp4", 
    timestamp: "2025-01-27T08:45:00Z",
    result: "FAKE",
    confidence: 0.76,
    processing_time: "1.8s",
    file_size: "8.9 MB",
    duration: "00:00:30",
    thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjY4IiB2aWV3Qm94PSIwIDAgMTIwIDY4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNjgiIGZpbGw9IiMyNzI2NDAiLz48cGF0aCBkPSJNNDUgMjVMNzUgNDJMNDUgNTlWMjVaIiBmaWxsPSIjMDA2NDY2Ii8+PC9zdmc+",
    detailed_analysis: {
      face_regions: 2,
      temporal_inconsistencies: 7,
      artifacts_detected: ["Audio-visual mismatch", "Facial boundary artifacts"],
      risk_score: "MEDIUM"
    }
  }
];

export const mockUserProfiles = [
  {
    id: "user_001",
    name: "Dr. Sarah Chen",
    email: "sarah.chen@forensics.gov",
    role: "INVESTIGATOR",
    organization: "Digital Forensics Unit",
    avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzAwNjQ2NiIvPjx0ZXh0IHg9IjIwIiB5PSIyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI0ZGRkZGRiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0Ij5TQzwvdGV4dD48L3N2Zz4=",
    subscription: "PRO",
    analyses_remaining: 847,
    last_login: "2025-01-27T10:30:00Z"
  },
  {
    id: "user_002",
    name: "Ahmed Al-Rashid",
    email: "ahmed.rashid@newsverify.com",
    role: "END_USER", 
    organization: "Independent Journalist",
    avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzMxMjI0NCIvPjx0ZXh0IHg9IjIwIiB5PSIyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI0ZGRkZGRiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0Ij5BQTwvdGV4dD48L3N2Zz4=",
    subscription: "BASIC",
    analyses_remaining: 23,
    last_login: "2025-01-27T09:15:00Z"
  }
];

export const mockDemoAnalysis = {
  id: "demo_001",
  filename: "demo_video.mp4",
  result: "FAKE",
  confidence: 0.89,
  processing_time: "2.1s",
  file_size: "12.4 MB",
  duration: "00:01:23",
  analysis_steps: [
    { step: "Video preprocessing", status: "completed", time: "0.3s" },
    { step: "Face detection and tracking", status: "completed", time: "0.8s" },
    { step: "Temporal consistency analysis", status: "completed", time: "0.6s" },
    { step: "Deepfake probability calculation", status: "completed", time: "0.4s" }
  ],
  detailed_findings: {
    face_regions: 1,
    temporal_inconsistencies: 15,
    artifacts_detected: [
      "Facial boundary inconsistencies detected at 00:00:12-00:00:18",
      "Temporal flickering in eye region from 00:00:25-00:00:31", 
      "Inconsistent lighting direction changes at 00:00:45"
    ],
    risk_assessment: "HIGH PROBABILITY OF MANIPULATION"
  }
};

export const mockPricingPlans = [
  {
    id: "basic",
    name: "Basic",
    price: "$5",
    period: "/month",
    features: [
      "Up to 50 video analyses per month",
      "Basic detection reports", 
      "Standard processing speed",
      "Email support",
      "Web dashboard access"
    ],
    analyses_included: 50,
    suitable_for: "Individual users and small organizations"
  },
  {
    id: "pro", 
    name: "Professional",
    price: "$10", 
    period: "/month",
    features: [
      "Up to 200 video analyses per month",
      "Detailed forensic reports with exports",
      "Priority processing (2x faster)",
      "Advanced temporal analysis",
      "API access",
      "Priority support"
    ],
    analyses_included: 200,
    suitable_for: "Investigators and media organizations",
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise", 
    price: "Custom",
    period: "pricing",
    features: [
      "Unlimited video analyses",
      "Custom integration support",
      "On-premise deployment options",
      "24/7 dedicated support",
      "Advanced API access",
      "Custom reporting formats"
    ],
    analyses_included: "Unlimited",
    suitable_for: "Large organizations and government agencies"
  }
];

export const mockFAQs = [
  {
    id: "faq_001",
    question: "How accurate is DeepXpose in detecting deepfakes?",
    answer: "DeepXpose achieves 96.8% accuracy on standard benchmarks using state-of-the-art transformer models. Our system combines facial analysis, temporal consistency checks, and audio-visual synchronization to provide comprehensive detection."
  },
  {
    id: "faq_002", 
    question: "What video formats are supported?",
    answer: "We support all major video formats including MP4, MOV, AVI, MKV, and WebM. Maximum file size is 500MB for Basic plan, 2GB for Professional plan, and unlimited for Enterprise."
  },
  {
    id: "faq_003",
    question: "How long does analysis take?",
    answer: "Analysis time depends on video length and plan type. Basic plan: ~3-5 seconds per minute of video. Professional plan: ~1-2 seconds per minute with priority processing."
  },
  {
    id: "faq_004",
    question: "Is my data secure and private?",
    answer: "Yes, all uploaded videos are processed securely and automatically deleted after 30 days. We use end-to-end encryption and comply with international privacy standards including GDPR."
  },
  {
    id: "faq_005",
    question: "Can I integrate DeepXpose with my existing systems?",
    answer: "Professional and Enterprise plans include API access for seamless integration. We provide comprehensive documentation and support for custom integrations."
  }
];

// Mock function to simulate video analysis
export const analyzeVideo = async (file) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // Return mock analysis result
  const fakeProb = Math.random();
  const isFake = fakeProb > 0.4;
  
  return {
    id: `analysis_${Date.now()}`,
    filename: file.name,
    result: isFake ? "FAKE" : "REAL", 
    confidence: isFake ? 0.75 + (Math.random() * 0.24) : 0.60 + (Math.random() * 0.39),
    processing_time: `${(2.0 + Math.random() * 2).toFixed(1)}s`,
    file_size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    timestamp: new Date().toISOString(),
    detailed_analysis: {
      face_regions: Math.floor(Math.random() * 4) + 1,
      temporal_inconsistencies: isFake ? Math.floor(Math.random() * 20) + 5 : Math.floor(Math.random() * 3),
      artifacts_detected: isFake ? 
        ["Facial boundary artifacts", "Temporal flickering", "Inconsistent lighting"].slice(0, Math.floor(Math.random() * 3) + 1) :
        [],
      risk_score: isFake ? (Math.random() > 0.5 ? "HIGH" : "MEDIUM") : "LOW"
    }
  };
};

// Mock Trending Videos Data
export const mockTrendingVideos = [
  // Twitter/X Videos
  {
    id: "twitter_001",
    platform: "X",
    title: "Breaking: Political figure announces new policy",
    thumbnail: "https://via.placeholder.com/320x180/1DA1F2/ffffff?text=X+Video",
    url: "https://x.com/example/status/123",
    engagement: "2.5M views",
    timestamp: "2 hours ago",
    duration: "0:45",
    verified_account: true,
    analyzed: false,
    analysis_result: null
  },
  {
    id: "twitter_002", 
    platform: "X",
    title: "Celebrity interview goes viral",
    thumbnail: "https://via.placeholder.com/320x180/1DA1F2/ffffff?text=X+Video+2",
    url: "https://x.com/example/status/124",
    engagement: "1.8M views",
    timestamp: "4 hours ago", 
    duration: "1:23",
    verified_account: false,
    analyzed: false,
    analysis_result: null
  },
  // Instagram Videos
  {
    id: "instagram_001",
    platform: "Instagram",
    title: "Influencer's surprising transformation video",
    thumbnail: "https://via.placeholder.com/320x180/E4405F/ffffff?text=IG+Video",
    url: "https://instagram.com/p/example1",
    engagement: "3.2M views",
    timestamp: "1 hour ago",
    duration: "0:30",
    verified_account: true,
    analyzed: false,
    analysis_result: null
  },
  {
    id: "instagram_002",
    platform: "Instagram", 
    title: "Behind-the-scenes movie footage leak",
    thumbnail: "https://via.placeholder.com/320x180/E4405F/ffffff?text=IG+Video+2",
    url: "https://instagram.com/p/example2",
    engagement: "4.1M views",
    timestamp: "3 hours ago",
    duration: "2:15",
    verified_account: false,
    analyzed: false,
    analysis_result: null
  },
  // YouTube Videos
  {
    id: "youtube_001",
    platform: "YouTube",
    title: "Tech CEO announces revolutionary AI breakthrough",
    thumbnail: "https://via.placeholder.com/320x180/FF0000/ffffff?text=YT+Video",
    url: "https://youtube.com/watch?v=example1",
    engagement: "5.7M views",
    timestamp: "6 hours ago",
    duration: "10:42",
    verified_account: true,
    analyzed: false,
    analysis_result: null
  },
  {
    id: "youtube_002",
    platform: "YouTube",
    title: "Mysterious footage surfaces from private event",
    thumbnail: "https://via.placeholder.com/320x180/FF0000/ffffff?text=YT+Video+2", 
    url: "https://youtube.com/watch?v=example2",
    engagement: "2.9M views",
    timestamp: "8 hours ago",
    duration: "5:33",
    verified_account: false,
    analyzed: false,
    analysis_result: null
  },
  {
    id: "youtube_003",
    platform: "YouTube",
    title: "Exclusive interview with controversial figure",
    thumbnail: "https://via.placeholder.com/320x180/FF0000/ffffff?text=YT+Video+3",
    url: "https://youtube.com/watch?v=example3", 
    engagement: "8.3M views",
    timestamp: "12 hours ago",
    duration: "15:27",
    verified_account: true,
    analyzed: false,
    analysis_result: null
  }
];

// Mock function to analyze trending video
export const analyzeTrendingVideo = async (videoId) => {
  // Simulate AI analysis
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const fakeProb = Math.random();
  const isFake = fakeProb > 0.6; // 40% chance of fake for trending videos
  
  return {
    id: `trending_analysis_${videoId}`,
    video_id: videoId,
    result: isFake ? "FAKE" : "REAL",
    confidence: isFake ? 0.75 + (Math.random() * 0.24) : 0.65 + (Math.random() * 0.34),
    processing_time: `${(2.0 + Math.random() * 3).toFixed(1)}s`,
    risk_factors: isFake ? 
      ["Facial inconsistencies detected", "Temporal artifacts present", "Audio-visual mismatch"] :
      ["No manipulation indicators", "Consistent facial features", "Natural temporal flow"],
    timestamp: new Date().toISOString()
  };
};

// Mock function to generate AI reports 
export const generateAnalysisReport = async (analysisId) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const analysis = mockAnalysisResults.find(a => a.id === analysisId);
  if (!analysis) return null;
  
  return {
    report_id: `report_${analysisId}`,
    analysis_id: analysisId,
    generated_at: new Date().toISOString(),
    executive_summary: `Comprehensive analysis of ${analysis.filename} reveals ${analysis.result.toLowerCase()} content with ${(analysis.confidence * 100).toFixed(1)}% confidence. The video exhibits ${analysis.detailed_analysis.temporal_inconsistencies} temporal inconsistencies across ${analysis.detailed_analysis.face_regions} detected face regions.`,
    technical_findings: analysis.detailed_analysis.artifacts_detected,
    recommendations: analysis.result === "FAKE" ? 
      ["Further verification recommended", "Consider source authentication", "Cross-reference with original media"] :
      ["Content appears authentic", "Standard verification protocols satisfied", "No significant manipulation indicators found"],
    risk_assessment: analysis.detailed_analysis.risk_score,
    report_format: "PDF_FORENSIC"
  };
};