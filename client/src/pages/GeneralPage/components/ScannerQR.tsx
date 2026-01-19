import { BrowserMultiFormatReader } from "@zxing/browser";
import { Result } from "@zxing/library";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCamera, FiUpload } from "react-icons/fi";
import { Button } from "~/components/ui/Button";
import { Spinner } from "~/components/ui";
interface IScannerQRProps {
  onScanSuccess: (result: string) => void;
  defaultMode?: "camera" | "upload";
  showModeSwitch?: boolean;
}
type ScanMode = "camera" | "upload";
const ScannerQR = ({
  onScanSuccess,
  defaultMode = "camera",
  showModeSwitch = true,
}: IScannerQRProps) => {
  const { t } = useTranslation("settings_page");
  const [mode, setMode] = useState<ScanMode>(defaultMode);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [hasImage, setHasImage] = useState(false);
  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();
    return () => {
      stopScanning();
    };
  }, []);
  const stopScanning = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    setIsScanning(false);
  }, []);
  const startCameraScanning = useCallback(async () => {
    if (!videoRef.current || !readerRef.current) return;
    try {
      setError(null);
      setIsScanning(true);
      const controls = await readerRef.current.decodeFromVideoDevice(
        undefined, 
        videoRef.current,
        (result: Result | null | undefined) => {
          if (result) {
            const text = result.getText();
            if (text) {
              stopScanning();
              onScanSuccess(text);
            }
          }
        },
      );
      controlsRef.current = controls;
    } catch (err: unknown) {
      console.error("Camera error:", err);
      let errorMessage = t("scanner.errors.camera_access");
      if (err instanceof Error) {
        if (
          err.name === "NotAllowedError" ||
          err.name === "PermissionDeniedError"
        ) {
          errorMessage = t("scanner.errors.permission_denied");
        } else if (
          err.name === "NotFoundError" ||
          err.name === "DevicesNotFoundError"
        ) {
          errorMessage = t("scanner.errors.no_camera");
        } else if (err.name === "NotSupportedError") {
          errorMessage = t("scanner.errors.not_supported");
        } else if (
          err.name === "NotReadableError" ||
          err.name === "TrackStartError"
        ) {
          errorMessage = t("scanner.errors.camera_in_use");
        }
      }
      setError(errorMessage);
      setIsScanning(false);
    }
  }, [onScanSuccess, stopScanning, t]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const loadImageForPreview = async (imageSource: File | Blob) => {
    if (!imgRef.current || !canvasRef.current) return;
    try {
      setError(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(imageSource);
      setPreviewUrl(url);
      imgRef.current.src = url;
      await new Promise((resolve, reject) => {
        if (!imgRef.current) {
          reject(new Error("Image ref not available"));
          return;
        }
        imgRef.current.onload = resolve;
        imgRef.current.onerror = reject;
      });
      const ctx = canvasRef.current.getContext("2d");
      if (ctx && imgRef.current) {
        canvasRef.current.width = imgRef.current.width;
        canvasRef.current.height = imgRef.current.height;
        ctx.drawImage(imgRef.current, 0, 0);
        setHasImage(true);
      }
    } catch (err) {
      console.error("Load image error:", err);
      setError(t("scanner.errors.invalid_file"));
    }
  };
  const confirmAndScan = async () => {
    if (!readerRef.current || !imgRef.current) return;
    try {
      setError(null);
      setIsScanning(true);
      const result = await readerRef.current.decodeFromImageElement(
        imgRef.current,
      );
      const text = result.getText();
      if (text) {
        onScanSuccess(text);
      }
    } catch (err) {
      console.error("Decode error:", err);
      setError(t("scanner.errors.no_qr_found"));
    } finally {
      setIsScanning(false);
    }
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(t("scanner.errors.invalid_file"));
      return;
    }
    await loadImageForPreview(file);
  };
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();
        if (blob) {
          await loadImageForPreview(blob);
          break;
        }
      }
    }
  };
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(t("scanner.errors.invalid_file"));
      return;
    }
    await loadImageForPreview(file);
  };
  useEffect(() => {
    if (mode === "camera") {
      startCameraScanning();
    } else {
      stopScanning();
    }
    return () => {
      stopScanning();
    };
  }, [mode, startCameraScanning, stopScanning]);
  return (
    <div className="w-full max-w-md space-y-4">
      {/* Hidden image element for decoding */}
      <img ref={imgRef} className="hidden" alt="QR code source" />
      {/* Mode Switch Tabs */}
      {showModeSwitch && (
        <div className="flex gap-2 rounded-lg bg-muted p-1">
          <button
            onClick={() => setMode("camera")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              mode === "camera"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FiCamera size={18} />
            {t("scanner.modes.camera")}
          </button>
          <button
            onClick={() => setMode("upload")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              mode === "upload"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FiUpload size={18} />
            {t("scanner.modes.upload")}
          </button>
        </div>
      )}
      {/* Scanner Area */}
      <div className="relative overflow-hidden rounded-lg border border-border bg-card">
        {mode === "camera" ? (
          <div className="relative aspect-square w-full">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              playsInline
              muted
            />
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-48 w-48 rounded-lg border-4 border-primary shadow-lg" />
              </div>
            )}
          </div>
        ) : (
          <div
            onPaste={handlePaste}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative flex aspect-square w-full flex-col items-center justify-center gap-4 p-8 transition-colors ${
              dragActive
                ? "border-2 border-dashed border-primary bg-primary/5"
                : ""
            }`}
          >
            {/* Canvas always in DOM but hidden when no image */}
            <canvas
              ref={canvasRef}
              className={`max-h-full max-w-full object-contain ${hasImage ? "" : "hidden"}`}
            />
            {hasImage ? (
              <div className="mt-4 flex flex-col items-center gap-3">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={confirmAndScan}
                  disabled={isScanning}
                  className="gap-2"
                >
                  {isScanning ? (
                    <>
                      <Spinner size="sm" />
                      {t("scanner.original_text.Scanning")}
                    </>
                  ) : (
                    <>{t("scanner.original_text.Start Scanning")}</>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setHasImage(false);
                    setError(null);
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(null);
                    }
                    if (canvasRef.current) {
                      const ctx = canvasRef.current.getContext("2d");
                      ctx?.clearRect(
                        0,
                        0,
                        canvasRef.current.width,
                        canvasRef.current.height,
                      );
                      canvasRef.current.width = 0;
                      canvasRef.current.height = 0;
                    }
                    fileInputRef.current?.click();
                  }}
                  disabled={isScanning}
                  className="gap-2"
                >
                  <FiUpload size={16} />
                  {t("scanner.original_text.Choose Another")}
                </Button>
              </div>
            ) : (
              <>
                <FiUpload
                  size={48}
                  className="text-muted-foreground opacity-50"
                />
                <div className="text-center">
                  <p className="mb-2 text-sm font-medium text-foreground">
                    {t("scanner.upload.title")}
                  </p>
                  <p className="mb-4 text-xs text-muted-foreground">
                    {t("scanner.upload.subtitle")}
                  </p>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <FiUpload size={16} />
                    {t("scanner.upload.button")}
                  </Button>
                </div>
              </>
            )}
            {/* Input always in DOM */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}
        {/* Loading Overlay */}
        {isScanning && mode === "upload" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Spinner size="lg" />
          </div>
        )}
      </div>
      {/* Error Message with Instructions */}
      {error && (
        <div className="space-y-3">
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
            <p className="mb-2 text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
            {/* Camera permission help */}
            {error === t("scanner.errors.permission_denied") && (
              <div className="mt-3 space-y-2 border-t border-red-500/20 pt-3 text-xs text-red-600/80 dark:text-red-400/80">
                <p className="font-medium">{t("scanner.help.title")}</p>
                <ol className="ml-4 list-decimal space-y-1">
                  <li>{t("scanner.help.step1")}</li>
                  <li>{t("scanner.help.step2")}</li>
                  <li>{t("scanner.help.step3")}</li>
                </ol>
                <div className="mt-3 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="light"
                    onClick={() => setMode("upload")}
                    className="text-xs"
                  >
                    {t("scanner.help.use_upload")}
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    onClick={() => {
                      setError(null);
                      startCameraScanning();
                    }}
                    className="text-xs"
                  >
                    {t("scanner.help.retry")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Hints */}
      {mode === "camera" && !error && (
        <p className="text-center text-xs text-muted-foreground">
          {t("scanner.hints.camera")}
        </p>
      )}
      {mode === "upload" && !error && (
        <p className="text-center text-xs text-muted-foreground">
          {t("scanner.hints.upload")}
        </p>
      )}
    </div>
  );
};
export default ScannerQR;