import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Image, FileText, Upload, Check, X, Camera, StopCircle, Play } from 'lucide-react';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase/client';
import { uploadFile } from '@/lib/supabase/storage';
import { sanitizeContent } from '@/lib/safety/child-safety';

type SubmissionType = 'video' | 'image' | 'note' | null;

interface PortfolioSubmissionProps {
  studentId: string;
  studentName: string;
  challengeId?: string;
  challengeTitle?: string;
  questId?: string;
  onComplete?: () => void;
}

export default function PortfolioSubmission({
  studentId,
  studentName,
  challengeId,
  challengeTitle,
  questId,
  onComplete,
}: PortfolioSubmissionProps) {
  const [submissionType, setSubmissionType] = useState<SubmissionType>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  
  const [notes, setNotes] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sanitize URL to prevent XSS attacks
  const sanitizeUrl = (url: string | null): string | undefined => {
    if (!url) return undefined;
    // Only allow blob: and https: URLs
    if (url.startsWith('blob:') || url.startsWith('https:')) {
      return DOMPurify.sanitize(url, { ALLOWED_URI_REGEXP: /^(?:https:|blob:)/ });
    }
    return undefined;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [videoPreviewUrl, imagePreviewUrl]);

  // Start video recording with countdown
  const startRecording = async () => {
    try {
      // Show countdown first
      setCountdown(3);
      await new Promise<void>((resolve) => {
        let count = 3;
        const countdownInterval = setInterval(() => {
          count--;
          setCountdown(count);
          if (count === 0) {
            clearInterval(countdownInterval);
            setCountdown(null);
            resolve();
          }
        }, 1000);
      });

      // Request camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 },
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus',
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedVideo(blob);
        const url = URL.createObjectURL(blob);
        setVideoPreviewUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          // Auto-stop at 2 minutes (neurodivergent-friendly: not too long)
          if (prev >= 120) {
            stopRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);

      toast.success('Recording started! 🎥');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not access camera. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const retakeVideo = () => {
    setRecordedVideo(null);
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl(null);
    }
    setRecordingTime(0);
  };

  // Handle image upload
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image too large! Please choose a file under 10MB.');
        return;
      }

      // Check file type - only allow safe image formats (no SVG to prevent XSS)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a safe image file (PNG, JPG, or WebP only). SVG files are not allowed for security reasons.');
        return;
      }

      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      // Validate that the URL is a blob URL (starts with blob:)
      if (!url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
        toast.error('Invalid image source');
        return;
      }
      setImagePreviewUrl(url);
      toast.success('Image selected! ✨');
    }
  };

  // Upload to Supabase Storage and save to database
  const submitPortfolioItem = async () => {
    if (!submissionType) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Sanitize notes to prevent XSS attacks
      const sanitizedNotes = sanitizeContent(notes);

      // Simulate upload progress for now
      // TODO: Implement actual Supabase Storage upload
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // TODO: Upload file to Supabase Storage
      // const { data: fileData } = await uploadFile(bucket, path, file);

      // TODO: Save to Supabase database with sanitized content
      // const { data, error } = await supabase.from('portfolio_items').insert({
      //   ...
      //   notes: sanitizedNotes,
      // });

      toast.success('Portfolio item saved! 🎉', {
        description: 'Great work! Your learning has been documented.',
      });

      // Reset form
      setSubmissionType(null);
      setRecordedVideo(null);
      setVideoPreviewUrl(null);
      setSelectedImage(null);
      setImagePreviewUrl(null);
      setNotes('');
      setUploadProgress(0);
      setIsUploading(false);

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error uploading portfolio item:', error);
      toast.error('Upload failed. Please try again.');
      setIsUploading(false);
    }
  };

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-calm-surface rounded-2xl border-2 border-calm-border p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl mb-2">📁 Add to Your Portfolio</h2>
        <p className="text-muted-foreground">
          Show what you learned! Record a video, upload a picture, or write notes.
        </p>
      </div>

      {/* Type Selection */}
      {!submissionType && (
        <div className="grid md:grid-cols-3 gap-4">
          <motion.button
            onClick={() => setSubmissionType('video')}
            className="bg-gradient-to-br from-pink-500 to-purple-600 text-white p-6 rounded-xl hover:opacity-90 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Video className="w-12 h-12 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-1">Record Video</h3>
            <p className="text-sm opacity-90">Explain what you built or learned</p>
          </motion.button>

          <motion.button
            onClick={() => setSubmissionType('image')}
            className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-xl hover:opacity-90 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image className="w-12 h-12 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-1">Upload Image</h3>
            <p className="text-sm opacity-90">Share a screenshot or photo</p>
          </motion.button>

          <motion.button
            onClick={() => setSubmissionType('note')}
            className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 rounded-xl hover:opacity-90 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText className="w-12 h-12 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-1">Write Notes</h3>
            <p className="text-sm opacity-90">Reflect on what you did</p>
          </motion.button>
        </div>
      )}

      {/* Video Recording */}
      {submissionType === 'video' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
            {countdown !== null && countdown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
                <motion.div
                  key={countdown}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-white text-9xl font-bold"
                >
                  {countdown}
                </motion.div>
              </div>
            )}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={isRecording}
              src={sanitizeUrl(videoPreviewUrl)}
              className="w-full h-full object-cover"
            />

            {isRecording && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 animate-pulse">
                <div className="w-3 h-3 bg-white rounded-full" />
                <span className="font-semibold">{formatTime(recordingTime)}</span>
              </div>
            )}

            {isRecording && (
              <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black bg-opacity-50 py-2">
                💡 Explain what you built or learned! (Max 2 minutes)
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-center">
            {!isRecording && !recordedVideo && (
              <Button
                onClick={startRecording}
                size="lg"
                className="reward-bg text-white"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Recording
              </Button>
            )}

            {isRecording && (
              <Button
                onClick={stopRecording}
                size="lg"
                variant="destructive"
              >
                <StopCircle className="w-5 h-5 mr-2" />
                Stop Recording
              </Button>
            )}

            {recordedVideo && (
              <>
                <Button
                  onClick={retakeVideo}
                  size="lg"
                  variant="outline"
                >
                  <X className="w-5 h-5 mr-2" />
                  Retake
                </Button>
                <Button
                  onClick={() => {
                    // Move to notes step
                  }}
                  size="lg"
                  className="bg-success text-white"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Looks Good!
                </Button>
              </>
            )}

            <Button
              onClick={() => {
                setSubmissionType(null);
                retakeVideo();
              }}
              size="lg"
              variant="ghost"
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Image Upload */}
      {submissionType === 'image' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {!imagePreviewUrl ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-calm-border rounded-xl p-12 text-center cursor-pointer hover:border-calm-primary transition-colors"
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Upload Your Work</h3>
              <p className="text-muted-foreground mb-4">
                Share a screenshot of your Roblox build, code, or project!
              </p>
              <Button className="reward-bg text-white">
                Choose Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border-2 border-calm-border">
                {imagePreviewUrl && (
                  <img
                    src={sanitizeUrl(imagePreviewUrl)}
                    alt="Preview"
                    className="w-full h-auto"
                  />
                )}
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => {
                    setSelectedImage(null);
                    if (imagePreviewUrl) {
                      URL.revokeObjectURL(imagePreviewUrl);
                      setImagePreviewUrl(null);
                    }
                  }}
                  variant="outline"
                >
                  <X className="w-5 h-5 mr-2" />
                  Choose Different Image
                </Button>
                <Button
                  onClick={() => setSubmissionType(null)}
                  variant="ghost"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Notes Section (shown for all types) */}
      {submissionType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <label className="block">
            <span className="text-lg font-semibold mb-2 block">
              ✍️ Add Notes (Optional)
            </span>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you learn? What was challenging? What are you proud of?"
              className="min-h-[120px] bg-white border-2 border-calm-border rounded-xl p-4 resize-none"
              maxLength={500}
            />
            <p className="text-sm text-muted-foreground mt-2">
              {notes.length}/500 characters
            </p>
          </label>
        </motion.div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <p className="text-center font-semibold">Uploading your work... ⏳</p>
          <Progress value={uploadProgress} className="h-3" />
          <p className="text-center text-sm text-muted-foreground">
            {Math.round(uploadProgress)}%
          </p>
        </motion.div>
      )}

      {/* Submit Button */}
      {submissionType && !isUploading && (recordedVideo || selectedImage || notes.trim()) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center pt-4"
        >
          <Button
            onClick={submitPortfolioItem}
            size="lg"
            className="reward-bg text-white px-8"
          >
            <Check className="w-5 h-5 mr-2" />
            Save to Portfolio
          </Button>
        </motion.div>
      )}
    </div>
  );
}