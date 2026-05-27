import React, { useState, useRef, useEffect } from 'react';
import { Tv, Circle, StopCircle, Play, ExternalLink, Shield, Volume2, VolumeX, RotateCw, Camera, Download, Trash2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { BrandHeader } from '../common/BrandHeader';
import { VideoEvent } from '../../types';

export const EcomigTV: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [recordTime, setRecordTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const animationRef = useRef<number | null>(null);
  
  const [recordedEvents, setRecordedEvents] = useState<VideoEvent[]>([]);
  const [snappedPhotos, setSnappedPhotos] = useState<{ id: string; title: string; date: string; url: string }[]>([]);
  const [activeArchiveTab, setActiveArchiveTab] = useState<'videos' | 'photos'>('videos');
  const [flashActive, setFlashActive] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{ id: string; title: string; date: string; url: string } | null>(null);

  // Recording Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordTime((prev: number) => prev + 1);
      }, 1000);
    } else {
      setRecordTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const initCamera = async (mode: 'user' | 'environment') => {
    // Stop any active stream to safely release the camera resource
    if (stream) {
      stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = "";
    }

    try {
      // In production video stream should be HD / Full HD (ideal 1920x1080)
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: mode, 
          width: { ideal: 1920, min: 1280 }, 
          height: { ideal: 1080, min: 720 },
          frameRate: { ideal: 30, max: 60 }
        }, 
        audio: true 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          console.log("Broadcast video metadata loaded");
          videoRef.current?.play()
            .then(() => setIsVideoPlaying(true))
            .catch((e) => {
              console.warn("Autoplay blocked, waiting for manual interaction", e);
              setIsVideoPlaying(false);
            });
        };
      }
    } catch (err) {
      console.warn("Hardware camera failed, using secure military tactical loop fallback:", err);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.oncanplay = () => {
          console.log("Fallback loop can play");
          videoRef.current?.play()
            .then(() => setIsVideoPlaying(true))
            .catch((e) => {
              console.warn("Fallback autoplay blocked", e);
              setIsVideoPlaying(false);
            });
        };
        videoRef.current.src = "https://assets.mixkit.co/videos/preview/mixkit-security-camera-of-a-parking-lot-at-night-34440-large.mp4";
        videoRef.current.loop = true;
        videoRef.current.muted = true;
      }
      setStream(null);
    }
  };

  // Auto-initialize secure live feed on mount so video is active at the end point
  useEffect(() => {
    initCamera(facingMode);
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const activeStream = videoRef.current.srcObject as MediaStream;
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleSwitchCamera = async () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    if (isLive) {
      await initCamera(nextMode);
    }
  };

  const toggleStream = async () => {
    if (isLive) {
      if (isRecording) {
        stopRecording();
      }
      if (stream) {
        stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = "";
        videoRef.current.onloadedmetadata = null;
        videoRef.current.oncanplay = null;
      }
      setStream(null);
      setIsLive(false);
      setIsVideoPlaying(false);
    } else {
      setIsLive(true);
      await initCamera(facingMode);
    }
  };

  const manualPlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => setIsVideoPlaying(true))
        .catch(err => console.error("Manual play failed:", err));
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const startRecording = () => {
    try {
      chunksRef.current = [];
      const startTimeRef = Date.now();
      
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error("Could not acquire 2D context from canvas");
      }

      const drawFrames = () => {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Render single stream (from videoRef)
        if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillStyle = '#0d1a0d';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#00853F';
          ctx.font = 'bold 24px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('CAMERA BROADCAST FEED OFFLINE', canvas.width / 2, canvas.height / 2);
        }

        // Draw Tactical HUD overlay on the recorded footage
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(40, 40, 500, 100);
        ctx.strokeStyle = '#00853F';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 40, 500, 100);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('ECOMIG HQ SECURE BROADCAST RECORDER', 60, 68);
        ctx.fillStyle = '#00a651';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('POS: YUNDUM-AIR // 13.3330° N, 16.6522° W', 60, 90);
        ctx.fillStyle = '#ef4444';
        ctx.fillText(`TIME: ${new Date().toISOString()} [SECURE_LINK]`, 60, 112);

        // Flashing Recording Indicator on screen
        if (Math.floor(Date.now() / 500) % 2 === 0) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(60, 134, 5, 0, 2 * Math.PI);
          ctx.fill();
        }
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('LIVE RECORDING ACTIVE', 75, 138);

        animationRef.current = requestAnimationFrame(drawFrames);
      };

      // Start the canvas drawing loop
      drawFrames();

      // Capture stream from canvas at 30 FPS
      // @ts-ignore
      const canvasStream = canvas.captureStream ? canvas.captureStream(30) : (canvas as any).captureStream(30);
      
      const recordingStream = new MediaStream();
      canvasStream.getVideoTracks().forEach((track: MediaStreamTrack) => recordingStream.addTrack(track));

      // Append audio track if available from live stream
      if (stream && stream.getAudioTracks().length > 0) {
        stream.getAudioTracks().forEach((track: MediaStreamTrack) => recordingStream.addTrack(track));
      }

      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4'
      ];
      
      const supportedType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type));
      if (!supportedType) {
        throw new Error("No supported MediaRecorder mime types found");
      }

      const mediaRecorder = new MediaRecorder(recordingStream, { mimeType: supportedType });
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Stop animation loop
        if (animationRef.current !== null) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }

        const blob = new Blob(chunksRef.current, { type: supportedType });
        const url = URL.createObjectURL(blob);
        const elapsedSeconds = Math.round((Date.now() - startTimeRef) / 1000);
        const finalTime = formatTime(elapsedSeconds === 0 ? 1 : elapsedSeconds);
        
        const newEvent: VideoEvent = {
          id: Date.now().toString(),
          title: `Secure Cam Footage - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          date: new Date().toLocaleDateString('en-GB'),
          duration: finalTime,
          thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400',
          videoUrl: url
        };
        setRecordedEvents(prev => [newEvent, ...prev]);
      };
      
      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (e) {
      console.error("Recording failed to start:", e);
      setIsRecording(false);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const playRecording = (url: string) => {
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = null;
      videoRef.current.oncanplay = null;
      
      setIsLive(true);
      setIsVideoPlaying(false);
      
      if (stream) {
        stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        setStream(null);
        videoRef.current.srcObject = null;
      }
      
      videoRef.current.src = url;
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.loop = false;
      
      videoRef.current.oncanplay = () => {
        videoRef.current?.play()
          .then(() => setIsVideoPlaying(true))
          .catch((e) => {
            console.warn("Replay blocked", e);
            setIsVideoPlaying(false);
          });
      };
    }
  };

  const toggleRecording = () => {
    if (!isLive) return;
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const snapPicture = () => {
    if (!videoRef.current || !isVideoPlaying) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 1920;
      canvas.height = videoRef.current.videoHeight || 1080;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        // Military tactical hud watermark on photo
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(40, 40, 500, 100);
        ctx.strokeStyle = '#00853F';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 40, 500, 100);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('ECOMIG HQ SECURE BROADCAST SNAPSHOT', 60, 68);
        ctx.fillStyle = '#00a651';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('POS: YUNDUM-AIR // 13.3330° N, 16.6522° W', 60, 90);
        ctx.fillStyle = '#ef4444';
        ctx.fillText(`TIME: ${new Date().toISOString()} [SECURE_PHOTO_LOCK]`, 60, 112);

        const url = canvas.toDataURL('image/jpeg', 0.95);
        const newPhoto = {
          id: Date.now().toString(),
          title: `Secure Snap - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`,
          date: new Date().toLocaleDateString('en-GB'),
          url: url
        };
        setSnappedPhotos(prev => [newPhoto, ...prev]);
        setActiveArchiveTab('photos');
        
        // Trigger subtle high quality white flash feedback
        setFlashActive(true);
        setTimeout(() => setFlashActive(false), 200);
      }
    } catch (err) {
      console.error("Failed to snap picture:", err);
    }
  };

  return (
    <div className="p-1 sm:p-3 md:p-6 max-w-7xl mx-auto min-h-screen w-full">
      <div className="space-y-4 p-2 sm:p-4 md:p-6 bg-[#00853F] border-4 sm:border-[6px] border-[#006b32] rounded-2xl shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Outer Bevel Frame */}
        <div className="absolute inset-0 border-t-2 border-l-2 border-white/20 pointer-events-none" />
        <div className="absolute inset-0 border-b-2 border-r-2 border-black/40 pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4 relative z-10 px-2 md:px-0">
          <div className="relative">
            <BrandHeader title="ECOMIG TV" subtitle="MISSION SECURE FEED" />
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-red-600 px-2 py-0.5 flex items-center gap-1.5 border-b border-r border-red-900">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[8px] font-black text-white tracking-widest uppercase">LIVE FEED</span>
              </div>
              <span className="text-[8px] font-black text-white tracking-[0.2em] uppercase italic">MISSION SECURE BROADCAST</span>
            </div>
            
            <h2 className="text-2xl md:text-5xl font-bold italic uppercase tracking-tighter text-white leading-none drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)] font-display">
              ECOMIG <span className="bg-white text-[#00853F] px-2 md:px-3">TV</span>
            </h2>
          </div>

          <div className="flex gap-2">
            <div className="bg-[#006b32] border-2 border-[#004d24] p-2 text-center min-w-[80px] shadow-md relative">
               <div className="absolute inset-x-0 top-0 h-[1px] bg-white/10" />
               <p className="text-[7px] font-black text-white/40 tracking-widest uppercase mb-0.5">SIGNAL STATUS</p>
               <p className="text-[9px] font-black text-white uppercase tracking-tighter italic">ENCRYPTED</p>
            </div>
            <div className="bg-[#006b32] border-2 border-[#004d24] p-2 text-center min-w-[70px] shadow-md relative">
               <div className="absolute inset-x-0 top-0 h-[1px] bg-white/10" />
               <p className="text-[7px] font-black text-white/40 tracking-widest uppercase mb-0.5">MHQ-LINK</p>
               <p className="text-[9px] font-black text-white uppercase tracking-tighter italic">ACTIVE</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
          <div className="lg:col-span-3 space-y-4">
            <div className="aspect-video bg-black overflow-hidden relative shadow-2xl border-[6px] border-gray-300 group">
              {/* Bevel for TV Screen Frame */}
              <div className="absolute inset-0 border-t-2 border-l-2 border-white pointer-events-none z-30" />
              <div className="absolute inset-0 border-b-2 border-r-2 border-gray-500 pointer-events-none z-30" />
              
              {/* Camera snap white flash effect */}
              {flashActive && (
                <motion.div 
                  initial={{ opacity: 0.95 }} 
                  animate={{ opacity: 0 }} 
                  transition={{ duration: 0.2, ease: "easeOut" }} 
                  className="absolute inset-0 bg-white z-50 pointer-events-none" 
                />
              )}
              
              {/* Single screen camera view */}
              <div className={`w-full h-full relative bg-neutral-950 duration-500 transition-opacity ${isLive ? 'opacity-100' : 'opacity-0'}`}>
                <video 
                  ref={videoRef} autoPlay playsInline muted={isMuted}
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                  onPlaying={() => setIsVideoPlaying(true)}
                  onWaiting={() => setIsVideoPlaying(false)}
                  className="w-full h-full object-cover"
                />
              </div>

              {isLive && !isVideoPlaying && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 z-40">
                  <motion.button 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={manualPlay}
                    className="group relative flex flex-col items-center gap-4"
                  >
                    <div className="w-16 h-16 bg-[#00853F] rounded-full flex items-center justify-center border-2 border-white shadow-lg group-hover:bg-[#00a651] transition-all">
                      <Play size={32} fill="white" className="text-white ml-1" />
                    </div>
                    <div className="text-center">
                      <h5 className="text-white font-black text-lg tracking-tighter uppercase italic">ACTIVATE LIVE BROADCAST</h5>
                      <p className="text-white/40 text-[8px] font-black tracking-[0.3em] mt-1">TAP TO INITIALIZE SECURE SIGNAL</p>
                    </div>
                  </motion.button>
                </div>
              )}

              {!isLive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d1a0d]">
                  <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleStream}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-[#00853F]/20 rounded-full flex items-center justify-center border border-[#00853F]/40 mb-4 group-hover:bg-[#00853F]/40 transition-all">
                      <Tv size={36} strokeWidth={1} className="text-[#00853F] animate-pulse" />
                    </div>
                    <div className="text-center">
                      <h4 className="text-[#00853F] font-bold text-xl italic uppercase tracking-tighter mb-2 font-display group-hover:text-white transition-colors">ACTIVATE LIVE BROADCAST</h4>
                      <p className="text-white/20 font-bold tracking-[0.3em] text-[8px] group-hover:text-white/60">TAP TO INITIALIZE UPLINK</p>
                    </div>
                  </motion.button>
                </div>
              )}

              {isLive && (
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end gap-3 pointer-events-none z-20">
                  {/* Tactical HUD Overlay Bounds (Always covers full screen) */}
                  <div className="absolute inset-0 border border-[#00853F]/20 m-4 flex flex-col justify-between p-2 pointer-events-none">
                    <div className="flex justify-between items-start">
                      <div className="w-6 h-6 border-t-2 border-l-2 border-[#00853F]" />
                      <div className="w-6 h-6 border-t-2 border-r-2 border-[#00853F]" />
                    </div>
                    
                    {/* Center Crosshair */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-40">
                      <div className="relative">
                        <div className="w-10 h-[1.5px] bg-[#00853F]" />
                        <div className="h-10 w-[1.5px] bg-[#00853F] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="w-6 h-6 border-b-2 border-l-2 border-[#00853F]" />
                      <div className="w-6 h-6 border-b-2 border-r-2 border-[#00853F]" />
                    </div>
                  </div>

                  {/* Bottom Information / Control Bar: Cohesive single-row at the baseline to prevent face block */}
                  <div className="flex flex-wrap items-end justify-between gap-3 pointer-events-auto mt-auto">
                     {/* Left: Combined Position Info Card & Live Badges Side-By-Side */}
                     <div className="flex flex-wrap items-center gap-2.5">
                       {/* Compact Location Coordinates Card */}
                       <div className="bg-black/90 backdrop-blur-md px-2.5 py-1.5 rounded border border-white/10 text-left shadow-2xl">
                         <p className="text-[7px] font-black text-[#00853F] tracking-widest mb-0.5 italic">POS // YUNDUM-AIR</p>
                         <p className="text-[10px] font-black text-white italic tracking-tighter font-mono leading-none">13.3330° N, 16.6522° W</p>
                       </div>

                       {/* Interactive Broadcast Status Badges Column */}
                       <div className="flex flex-col gap-1">
                         {/* Compact Broadcast Active Badge */}
                         <div className="bg-red-600 flex items-center gap-1 px-2 py-0.5 rounded text-white font-black text-[7px] tracking-wider shadow-lg uppercase leading-none">
                           <Circle size={6} fill="white" className="animate-pulse" /> BROADCAST ACTIVE
                         </div>

                         {/* Compact Feed direction Badge */}
                         <div className="bg-black/85 px-2 py-0.5 rounded text-[7px] font-black text-[#00853F] border border-[#00853F]/25 uppercase tracking-wider flex items-center gap-1 shadow-lg leading-none">
                           <span className="w-1 h-1 rounded-full bg-[#00853F] animate-ping" />
                           FEED: {facingMode === 'user' ? 'INWARD' : 'OUTWARD'}
                         </div>

                         {/* Recording alert pill */}
                         {isRecording && (
                           <div className="bg-white px-2 py-0.5 rounded text-red-600 font-black text-[7px] tracking-wider flex items-center gap-1 shadow-md uppercase leading-none">
                             <div className="w-1 h-1 bg-red-600 rounded-full animate-pulse" /> REC {formatTime(recordTime)}
                           </div>
                         )}
                       </div>
                     </div>
                     
                     {/* Right: Controls & Signal Feed System Info */}
                     <div className="flex flex-col items-end gap-1.5">
                        <button 
                          type="button"
                          onClick={toggleMute}
                          className="bg-black/80 p-1.5 rounded border border-white/20 text-white hover:bg-white/10 transition-colors cursor-pointer shadow-lg"
                        >
                          {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                        </button>
                        <div className="text-[7px] font-black text-white/40 tracking-widest uppercase italic bg-black/55 px-1.5 py-0.5 rounded border border-white/5">SIGNAL: OMNI-LINK 07 // SECURE</div>
                     </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-[#006b32] border-2 border-[#004d24] flex flex-wrap items-center justify-center gap-3 shadow-xl relative">
               <div className="absolute inset-0 border-t border-l border-white/10 pointer-events-none" />
               <button 
                onClick={toggleStream}
                disabled={isLive}
                className={`flex items-center gap-2 px-4 py-2 font-black text-[10px] tracking-wider uppercase transition-all shadow-md active:translate-y-0.5 border-b-2 border-r-2 ${
                  isLive ? 'bg-gray-600 text-white border-gray-800' : 'bg-[#00853F] text-white border-[#004d24] hover:bg-[#009e4b] shadow-[0_0_10px_rgba(0,133,63,0.3)] animate-pulse'
                }`}
               >
                  <Play size={12} fill="currentColor" /> ACTIVATE TRANSMISSION
               </button>

               <button 
                onClick={handleSwitchCamera}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white border-b-2 border-r-2 border-amber-800 font-black text-[10px] tracking-wider uppercase transition-all shadow-md active:translate-y-0.5"
               >
                  <RotateCw size={12} /> SWITCH CAMERA
               </button>

               <button 
                onClick={snapPicture}
                disabled={!isLive || !isVideoPlaying}
                className={`flex items-center gap-2 px-4 py-2 font-black text-[10px] tracking-wider uppercase transition-all shadow-md active:translate-y-0.5 border-b-2 border-r-2 ${
                  (!isLive || !isVideoPlaying) ? 'bg-gray-600 text-white border-gray-800 opacity-50 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-900 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                }`}
               >
                  <Camera size={12} /> SNAP PICTURE
               </button>

               <button 
                onClick={toggleRecording}
                disabled={!isLive}
                className={`flex items-center gap-2 px-4 py-2 font-black text-[10px] tracking-wider uppercase transition-all shadow-md active:translate-y-0.5 border-b-2 border-r-2 ${
                  !isLive ? 'bg-gray-600 text-white border-gray-800' : 
                  isRecording ? 'bg-white text-red-600 border-gray-300' : 'bg-red-600 text-white border-red-900 hover:bg-red-500'
                }`}
               >
                  {isRecording ? <StopCircle size={12} /> : <Circle size={12} fill="currentColor" />}
                  {isRecording ? 'STOP RECORDING' : 'RECORD EVENTS'}
               </button>

               <button 
                onClick={toggleStream}
                disabled={!isLive}
                className={`flex items-center gap-2 px-4 py-2 font-black text-[10px] tracking-wider uppercase transition-all shadow-md active:translate-y-0.5 border-b-2 border-r-2 ${
                  !isLive ? 'bg-gray-600 text-white border-gray-800' : 'bg-black text-white border-gray-950 hover:bg-gray-900'
                }`}
               >
                  <StopCircle size={12} /> DISCONNECT SIGNAL
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-white border-4 border-gray-200 p-4 relative">
                  <div className="absolute inset-0 border-t border-l border-white pointer-events-none" />
                  <h5 className="text-[8px] font-black text-gray-400 tracking-[0.22em] uppercase mb-2 italic">SIGNAL CHANNELS</h5>
                  <div className="space-y-1">
                     {['SECURE HD LIVE STREAM', 'BARRA CROSSING CAM', 'LOGISTICS HUB MONITOR', 'TACTICAL AIR COY'].map((ch, i) => (
                       <div key={ch} className={`p-2 font-black text-[8px] tracking-wider cursor-pointer transition-all flex items-center justify-between border-b border-r ${i === 0 ? 'bg-[#00853F] text-white border-[#004d24]' : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-white'}`}>
                          {ch}
                          {i === 0 && <ExternalLink size={10} />}
                       </div>
                     ))}
                  </div>
               </div>

               <div className="md:col-span-2 bg-white border-4 border-gray-200 p-4 flex flex-col justify-center relative">
                  <div className="absolute inset-0 border-t border-l border-white pointer-events-none" />
                  <div className="flex items-center gap-3 mb-2">
                     <div className="w-10 h-10 bg-[#00853F] border-b-2 border-r-2 border-[#004d24] flex items-center justify-center shrink-0">
                        <Shield size={20} className="text-white" />
                     </div>
                     <div>
                        <h3 className="text-sm font-black text-black italic tracking-tighter uppercase leading-none">Operational Mandate (TM-112-BCST Guide Synchronized)</h3>
                        <p className="text-[7px] font-black text-[#00853F] tracking-widest uppercase mt-1">SECURE PROTOCOL ALPHA-9</p>
                     </div>
                  </div>
                  <p className="text-black/60 font-bold italic text-xs leading-relaxed">
                    "Mission protocol: Broadcasts are restricted to authorized channels. The synchronized live camera stream is stored securely and relayed via ECOWAS tactical satellite nodes."
                  </p>
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 px-1">
               <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveArchiveTab('videos')}
                    className={`text-[8px] font-black tracking-widest uppercase px-2 py-1 transition-all rounded-sm ${
                      activeArchiveTab === 'videos' ? 'bg-white text-[#00853F]' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    VIDEOS ({recordedEvents.length})
                  </button>
                  <button 
                    onClick={() => setActiveArchiveTab('photos')}
                    className={`text-[8px] font-black tracking-widest uppercase px-2 py-1 transition-all rounded-sm ${
                      activeArchiveTab === 'photos' ? 'bg-white text-[#00853F]' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    PHOTOS ({snappedPhotos.length})
                  </button>
               </div>
            </div>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              {activeArchiveTab === 'videos' ? (
                recordedEvents.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-white/10 rounded-lg text-white/30">
                    <p className="text-[10px] font-mono font-bold">NO SECURE VIDEO RECS FOUND</p>
                  </div>
                ) : (
                  recordedEvents.map((event: VideoEvent) => (
                    <div 
                      key={event.id} 
                      onClick={() => event.videoUrl && playRecording(event.videoUrl)}
                      className="p-2 bg-white border-4 border-gray-200 hover:bg-gray-50 transition-all flex flex-col gap-2 cursor-pointer group relative"
                    >
                      <div className="absolute inset-0 border-t border-l border-white pointer-events-none" />
                      <div className="absolute top-1 right-1 p-1 opacity-10 group-hover:opacity-100 transition-opacity">
                         <Play size={16} className="text-[#00853F]" />
                      </div>
                      <div className="w-full aspect-video overflow-hidden relative border border-gray-100">
                         <img 
                           src={event.thumbnail} 
                           alt={event.title} 
                           referrerPolicy="no-referrer"
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                         />
                         <div className="absolute bottom-1 right-1 bg-black text-[8px] font-black text-white px-1 py-0.5">
                           {event.duration}
                         </div>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-black uppercase leading-tight group-hover:text-[#00853F]">{event.title}</p>
                         <p className="text-[8px] font-bold text-gray-300 mt-0.5 uppercase italic tracking-widest">{event.date}</p>
                      </div>
                    </div>
                  ))
                )
              ) : (
                snappedPhotos.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-white/10 rounded-lg text-white/30">
                    <p className="text-[10px] font-mono font-bold">NO SECURE PHOTOS SNAPPED</p>
                    <p className="text-[8px] font-mono mt-1 text-white/20">TAP "SNAP PICTURE" CONTROLLER</p>
                  </div>
                ) : (
                  snappedPhotos.map((photo) => (
                    <div 
                      key={photo.id} 
                      onClick={() => setSelectedPhoto(photo)}
                      className="p-2 bg-white border-4 border-gray-200 hover:bg-gray-50 transition-all flex flex-col gap-2 cursor-pointer group relative"
                    >
                      <div className="absolute inset-0 border-t border-l border-white pointer-events-none" />
                      <div className="absolute top-1 right-1 p-1 flex gap-1 z-10">
                        <a 
                          href={photo.url} 
                          download={`${photo.id}.jpg`} 
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 bg-black/60 rounded text-white hover:bg-emerald-600 transition-colors"
                          title="Download Image"
                        >
                          <Download size={10} />
                        </a>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSnappedPhotos(prev => prev.filter(p => p.id !== photo.id));
                          }}
                          className="p-1 bg-black/60 rounded text-white hover:bg-red-650 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                      <div className="w-full aspect-video overflow-hidden relative border border-gray-100 bg-black flex items-center justify-center">
                         <img 
                           src={photo.url} 
                           alt={photo.title} 
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                         />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-black uppercase leading-tight group-hover:text-[#00853F]">{photo.title}</p>
                         <p className="text-[8px] font-bold text-gray-300 mt-0.5 uppercase italic tracking-widest">{photo.date}</p>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-4xl bg-[#00853F] p-4 text-white border-4 border-white rounded-xl shadow-2xl relative"
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="font-mono font-black text-xs uppercase tracking-wider">{selectedPhoto.title}</h4>
                <p className="text-[10px] text-white/55 font-mono">CAPTURED: {selectedPhoto.date} // HQ MISSION LOCK</p>
              </div>
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="bg-black/60 text-white hover:bg-red-600 font-black font-mono text-xs px-3 py-1 rounded-sm border border-white/20 transition-colors"
              >
                CLOSE [X]
              </button>
            </div>
            
            <div className="border-[6px] border-white/10 rounded overflow-hidden aspect-video relative bg-black flex items-center justify-center">
              <img src={selectedPhoto.url} className="w-full h-full object-contain" alt="HD Broadcast Capture" />
              
              {/* Tactical overlay indicators on premium view */}
              <div className="absolute top-2 left-2 bg-black/75 border border-[#00853F] px-2 py-0.5 font-mono text-[9px] text-[#00853F]">
                RESOLUTION: 1920 x 1080 (HD_INTEL_SYSTEMS)
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-4">
              <a 
                href={selectedPhoto.url} 
                download={`${selectedPhoto.id}.jpg`}
                className="flex items-center gap-2 bg-white text-black hover:bg-gray-100 font-bold text-[10px] tracking-widest px-4 py-2 uppercase rounded-sm transition-all"
              >
                <Download size={12} /> DOWNLOAD INTEL FILE
              </a>
              <button 
                onClick={() => {
                  setSnappedPhotos(prev => prev.filter(p => p.id !== selectedPhoto.id));
                  setSelectedPhoto(null);
                }}
                className="flex items-center gap-2 bg-red-650 hover:bg-red-500 font-bold text-[10px] tracking-widest px-4 py-2 uppercase rounded-sm transition-all"
              >
                <Trash2 size={12} /> PURGE FILE
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
