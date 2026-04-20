"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Play, 
  Save, 
  RefreshCw, 
  Image as ImageIcon, 
  Upload, 
  Wand2, 
  Loader2, 
  ChevronLeft,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface VideoAsset {
  id: string;
  scene_number: number;
  script_text: string;
  image_url: string;
  voice_url: string | null;
  captions_json: any;
}

interface VideoData {
  id: string;
  series_id: string;
  title: string;
  status: string;
  video_assets: VideoAsset[];
}

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params.videoId as string;

  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeScene, setActiveScene] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegeneratingAll, setIsRegeneratingAll] = useState(false);
  
  // Local state for the active scene
  const [localScriptText, setLocalScriptText] = useState("");
  const [isUpdatingScript, setIsUpdatingScript] = useState(false);
  
  const [imagePrompt, setImagePrompt] = useState("");
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchReviewData();
    
    // Setup polling if the video is still generating
    const interval = setInterval(() => {
      setVideo((prev) => {
        if (prev?.status === 'generating') {
          fetchReviewData(false); // fetch without showing main loading spinner
        }
        return prev;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [videoId]);

  const fetchReviewData = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const res = await fetch(`/api/videos/${videoId}/review`);
      const data = await res.json();
      if (data.success) {
        setVideo(data.data);
        if (data.data.video_assets?.length > 0) {
          const firstScene = data.data.video_assets[0];
          setLocalScriptText(firstScene.script_text || "");
          setActiveScene(firstScene.scene_number);
        }
      } else {
        toast.error("Failed to load review data");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleSceneChange = (sceneNum: number) => {
    // If there's unsaved script text for current scene, it will be lost unless we auto-save or prompt.
    // Keeping it simple: user must click "Save Script"
    const newScene = video?.video_assets.find(a => a.scene_number === sceneNum);
    if (newScene) {
      setActiveScene(sceneNum);
      setLocalScriptText(newScene.script_text || "");
      setImagePrompt("");
    }
  };

  const handleSaveScript = async () => {
    if (!video) return;
    setIsUpdatingScript(true);
    try {
      const res = await fetch(`/api/videos/${videoId}/review/script`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scene_number: activeScene,
          script_text: localScriptText,
          series_id: video.series_id
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Script updated & Voice synchronized!");
        // Update local object
        setVideo(prev => {
          if(!prev) return prev;
          const assets = prev.video_assets.map(a => 
            a.scene_number === activeScene ? { ...a, script_text: localScriptText, voice_url: data.data.voice_url } : a
          );
          return { ...prev, video_assets: assets };
        });
      } else {
        toast.error(data.error || "Failed to update script");
      }
    } catch (err) {
      toast.error("Error updating script");
    } finally {
      setIsUpdatingScript(false);
    }
  };

  const handleImageGenerate = async () => {
    if (!video || !imagePrompt) return;
    setIsUpdatingImage(true);
    try {
      const res = await fetch(`/api/videos/${videoId}/review/image`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          scene_number: activeScene,
          prompt: imagePrompt,
          series_id: video.series_id
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Image regenerated successfully!");
        setVideo(prev => {
          if(!prev) return prev;
          const assets = prev.video_assets.map(a => 
            a.scene_number === activeScene ? { ...a, image_url: data.data.image_url } : a
          );
          return { ...prev, video_assets: assets };
        });
        setImagePrompt("");
      } else {
        toast.error(data.error || "Failed to regenerate image");
      }
    } catch (err) {
      toast.error("Error generating image");
    } finally {
      setIsUpdatingImage(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !video) return;

    setIsUpdatingImage(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const res = await fetch(`/api/videos/${videoId}/review/image`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "upload",
            scene_number: activeScene,
            image_base64: base64,
            series_id: video.series_id
          })
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Image uploaded successfully!");
          setVideo(prev => {
            if(!prev) return prev;
            const assets = prev.video_assets.map(a => 
              a.scene_number === activeScene ? { ...a, image_url: data.data.image_url } : a
            );
            return { ...prev, video_assets: assets };
          });
        } else {
          toast.error(data.error || "Failed to upload image");
        }
      } catch (err) {
        toast.error("Error uploading image");
      } finally {
        setIsUpdatingImage(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRegenerateAll = async () => {
    if (!confirm("Are you sure? This will delete all current scenes and start generating a completely fresh version.")) return;
    setIsRegeneratingAll(true);
    try {
      const res = await fetch(`/api/videos/${videoId}/regenerate`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Regeneration started!");
        router.push("/dashboard/videos");
      } else {
        toast.error(data.error || "Failed to regenerate series");
      }
    } catch (err) {
      toast.error("Error regenerating series");
    } finally {
      setIsRegeneratingAll(false);
    }
  };

  const handleFinalApprove = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/videos/${videoId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Video Approved! Starting Final Render Pipeline.");
        router.push("/dashboard/videos");
      } else {
        toast.error(data.error || "Failed to approve video");
      }
    } catch (err) {
      toast.error("Error approving video");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !video) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="flex flex-col items-center gap-4 text-purple-600">
          <Loader2 className="h-10 w-10 animate-spin" />
          <span className="font-semibold text-zinc-600">Loading your generated content...</span>
        </div>
      </div>
    );
  }

  // If we have video data but it's still being generated in the background
  if (video && video.status === 'generating') {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center -mx-4 -mt-4 bg-zinc-50/50">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="mx-auto w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center relative">
            <Loader2 className="w-10 h-10 text-purple-600 animate-spin relative z-10" />
            <div className="absolute inset-0 border-4 border-t-purple-600 border-r-purple-300 border-b-purple-100 border-l-purple-50 rounded-full animate-spin [animation-duration:3s]"></div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Crafting Your Story...</h2>
            <p className="text-zinc-500 mt-2 font-medium text-sm leading-relaxed">
              Our AI is currently generating the script, casting the AI voice, and illustrating your scenes. This usually takes around 30 to 60 seconds.
            </p>
          </div>

          <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100 flex items-center gap-3 text-left">
            <Wand2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <p className="text-xs text-zinc-600 font-semibold">
              Please wait right here. You will be able to review and regenerate the assets exactly on this screen once it is ready.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentScene = video.video_assets.find(a => a.scene_number === activeScene);
  const isScriptModified = currentScene && currentScene.script_text !== localScriptText;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col -mx-4 -mt-4 bg-zinc-50/50">
      {/* Top Bar */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/videos">
            <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-500">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Review & Edit</h1>
            <p className="text-sm font-medium text-zinc-500 mt-0.5">{video.title || "Generated Story"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            disabled={isRegeneratingAll}
            onClick={handleRegenerateAll}
            className="h-10 px-4 rounded-xl bg-white border border-rose-200 text-rose-600 flex items-center gap-2 hover:bg-rose-50 font-semibold transition-colors disabled:opacity-50"
          >
            {isRegeneratingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Regenerate Full Series
          </button>
          <button 
            disabled={isSaving}
            onClick={handleFinalApprove}
            className="h-10 px-5 rounded-xl bg-purple-600 text-white flex items-center gap-2 hover:bg-purple-700 font-semibold transition-colors shadow-sm disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Save & Generate Video
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Scene List */}
        <div className="w-80 bg-white border-r border-zinc-200 flex flex-col h-full z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative">
          <div className="p-4 border-b border-zinc-100 bg-zinc-50/80 backdrop-blur-md">
             <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Scenes ({video.video_assets.length})</h2>
             <p className="text-xs text-zinc-500 leading-relaxed font-medium">Select a scene to review its specific text & visual.</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 relative">
            {video.video_assets.map((asset) => (
              <button
                key={asset.id}
                onClick={() => handleSceneChange(asset.scene_number)}
                className={`w-full text-left flex gap-3 p-3 rounded-xl transition-all border ${
                  activeScene === asset.scene_number
                    ? "bg-purple-50/50 border-purple-200 shadow-sm ring-1 ring-purple-100 relative"
                    : "bg-white border-white hover:border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                <div className="h-16 w-12 flex-shrink-0 rounded-md overflow-hidden bg-zinc-100 border border-zinc-200">
                  {asset.image_url ? (
                    <img src={asset.image_url} className="w-full h-full object-cover" alt={`Scene ${asset.scene_number}`} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300">
                       <ImageIcon className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col pt-1">
                  <h4 className={`text-sm font-bold mb-1 ${activeScene === asset.scene_number ? 'text-purple-900' : 'text-zinc-700'}`}>Scene {asset.scene_number}</h4>
                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{asset.script_text}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center Content - Edit View */}
        <div className="flex-1 overflow-y-auto bg-zinc-50/50 relative">
          {currentScene ? (
            <div className="max-w-4xl mx-auto p-8 lg:p-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
              
              {/* Voiceover Editor */}
              <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm relative overflow-hidden group">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                      <Wand2 className="w-5 h-5 text-purple-600" />
                      Narration Script
                   </h3>
                   {isScriptModified && (
                     <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-md flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Unsaved Changes
                     </span>
                   )}
                 </div>
                 <textarea
                   value={localScriptText}
                   onChange={(e) => setLocalScriptText(e.target.value)}
                   className="w-full min-h-[120px] rounded-2xl bg-zinc-50 border-0 ring-1 ring-zinc-200 focus:ring-2 focus:ring-purple-600 p-5 text-zinc-700 text-base leading-relaxed resize-y transition-all hover:ring-zinc-300"
                   placeholder="Type the voiceover script for this scene..."
                 />
                 <div className="mt-4 flex justify-end">
                   <button 
                     onClick={handleSaveScript}
                     disabled={isUpdatingScript || !isScriptModified}
                     className="px-6 py-2.5 bg-zinc-900 text-white font-semibold text-sm rounded-xl hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm"
                   >
                     {isUpdatingScript ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                     Save & Sync Audio
                   </button>
                 </div>
              </div>

              {/* Visual Editor */}
              <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2 mb-6">
                   <ImageIcon className="w-5 h-5 text-blue-600" />
                   Scene Visual
                </h3>
                
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Current Image */}
                  <div className="w-full md:w-64 flex-shrink-0">
                    <div className="aspect-[9/16] w-full rounded-2xl bg-zinc-100 border border-zinc-200 overflow-hidden relative group/image shadow-sm">
                      {isUpdatingImage ? (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                          <span className="text-xs font-bold text-zinc-600">Processing...</span>
                        </div>
                      ) : null}
                      
                      {currentScene.image_url ? (
                        <img src={currentScene.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105" alt="Scene" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400 font-medium text-sm">
                           No Image
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Edit Controls */}
                  <div className="flex-1 flex flex-col gap-6">
                    <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 relative overflow-hidden">
                       <h4 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
                          <Wand2 className="w-4 h-4 text-emerald-600" /> AI Regenerate
                       </h4>
                       <textarea
                         value={imagePrompt}
                         onChange={(e) => setImagePrompt(e.target.value)}
                         placeholder="Describe a new visual for this scene (e.g. 'cinematic shot of a wolf howling...' )"
                         className="w-full h-24 p-4 rounded-xl border-0 ring-1 ring-zinc-200 focus:ring-2 focus:ring-emerald-500 bg-white text-sm text-zinc-700 resize-none transition-all shadow-sm"
                       />
                       <div className="mt-3 flex justify-end">
                         <button 
                           disabled={isUpdatingImage || !imagePrompt.trim()}
                           onClick={handleImageGenerate}
                           className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                         >
                           {isUpdatingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                           Generate Image
                         </button>
                       </div>
                    </div>

                    <div className="relative text-center">
                       <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200"></div></div>
                       <span className="relative bg-white px-4 text-xs font-bold text-zinc-400 tracking-widest uppercase">Or</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
                       <h4 className="text-sm font-bold text-zinc-900 mb-1 flex items-center gap-2">
                          <Upload className="w-4 h-4 text-blue-600" /> Upload Custom Image
                       </h4>
                       <p className="text-xs text-zinc-500 mb-4 font-medium">Use your own design (9:16 portrait recommended)</p>
                       
                       <input 
                         type="file" 
                         accept="image/*"
                         className="hidden" 
                         ref={fileInputRef}
                         onChange={handleImageUpload}
                       />
                       <button 
                         disabled={isUpdatingImage}
                         onClick={() => fileInputRef.current?.click()}
                         className="w-full h-11 border border-dashed border-zinc-300 hover:border-blue-500 hover:bg-blue-50/50 rounded-xl text-sm font-semibold text-zinc-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                       >
                         <Upload className="w-4 h-4" /> Choose File
                       </button>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400 font-medium">Select a scene to edit</div>
          )}
        </div>
      </div>
    </div>
  );
}
