import { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

export const CameraCapture = ({ onCapture, onClose }) => {
  const { language } = useLanguage();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [hasPermission, setHasPermission] = useState(null);
  const [error, setError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' or 'environment'

  const getErrorMessage = (err) => {
    if (language === 'it') {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        return 'Permesso fotocamera negato. Per favore, abilita l\'accesso alla fotocamera nelle impostazioni del browser.';
      }
      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        return 'Nessuna fotocamera trovata. Usa il pulsante "Carica Foto" per selezionare un\'immagine.';
      }
      if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        return 'La fotocamera è in uso da un\'altra applicazione. Chiudi le altre app e riprova.';
      }
      return 'Errore nell\'accesso alla fotocamera. Usa il pulsante "Carica Foto" come alternativa.';
    } else {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        return 'Camera permission denied. Please enable camera access in your browser settings.';
      }
      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        return 'No camera found. Use the "Upload Photo" button to select an image.';
      }
      if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        return 'Camera is being used by another application. Close other apps and try again.';
      }
      return 'Error accessing camera. Use the "Upload Photo" button as an alternative.';
    }
  };

  const startCamera = async () => {
    try {
      setError(null);
      setIsCameraActive(true);

      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported');
      }

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setHasPermission(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError(getErrorMessage(err));
      setHasPermission(false);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const switchCamera = async () => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setTimeout(() => startCamera(), 100);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Force JPEG format with explicit MIME type
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    stopCamera();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Force JPEG MIME type for consistency
        const base64Data = reader.result.split(',')[1];
        const forcedJpegDataUrl = `data:image/jpeg;base64,${base64Data}`;
        onCapture(forcedJpegDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background border-b-4 border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-10 h-10 rounded-xl bg-card border-2 border-border shadow-cartoon-sm flex items-center justify-center hover:scale-110 transition-transform"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-display font-bold">
            📸 {language === 'it' ? 'Scansiona Ingredienti' : 'Scan Ingredients'}
          </h2>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-5 min-h-[calc(100vh-80px)]">
        {!isCameraActive && !capturedImage && (
          <div className="w-full max-w-md space-y-4">
            {/* Error Message */}
            {error && (
              <div className="card-cartoon bg-destructive/10 border-destructive/50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-foreground leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {/* Camera Button */}
            <button
              onClick={startCamera}
              className="w-full h-16 btn-cartoon-primary flex items-center justify-center gap-3"
            >
              <Camera className="w-6 h-6" />
              {language === 'it' ? 'Apri Fotocamera' : 'Open Camera'}
            </button>

            {/* Upload Fallback */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground font-bold">
                  {language === 'it' ? 'Oppure' : 'Or'}
                </span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-16 btn-cartoon-secondary flex items-center justify-center gap-3"
            >
              <Upload className="w-6 h-6" />
              {language === 'it' ? 'Carica Foto' : 'Upload Photo'}
            </button>

            {/* Help Text */}
            <p className="text-center text-sm text-muted-foreground font-medium">
              {language === 'it' 
                ? 'Scatta una foto degli ingredienti o carica un\'immagine dalla galleria'
                : 'Take a photo of ingredients or upload an image from gallery'}
            </p>
          </div>
        )}

        {/* Camera View */}
        {isCameraActive && !capturedImage && (
          <div className="w-full max-w-2xl space-y-4">
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border-4 border-border shadow-cartoon">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Camera Controls Overlay */}
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
                <button
                  onClick={switchCamera}
                  className="w-12 h-12 rounded-full bg-secondary/90 backdrop-blur flex items-center justify-center border-2 border-border shadow-cartoon hover:scale-110 transition-transform"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full bg-primary border-4 border-primary-dark shadow-cartoon-primary hover:scale-110 transition-transform"
                >
                  <Camera className="w-6 h-6 text-primary-foreground mx-auto" />
                </button>
                <div className="w-12" /> {/* Spacer */}
              </div>
            </div>
          </div>
        )}

        {/* Preview Captured Image */}
        {capturedImage && (
          <div className="w-full max-w-2xl space-y-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden border-4 border-border shadow-cartoon">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={retakePhoto}
                className="flex-1 h-14 btn-cartoon-secondary flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                {language === 'it' ? 'Rifai' : 'Retake'}
              </button>
              <button
                onClick={confirmPhoto}
                className="flex-1 h-14 btn-cartoon-primary flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                {language === 'it' ? 'Usa Foto' : 'Use Photo'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
