import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

interface IScannerQRProps {
  onScanSuccess: (result: string) => void;
}

const scannerTranslator = () => {
  const traducciones = [
    {
      original: "QR code parse error, error =",
      traduccion: "Lỗi phân tích mã QR, lỗi =",
    },
    {
      original: "Error getting userMedia, error =",
      traduccion: "Lỗi khi lấy userMedia, lỗi =",
    },
    {
      original:
        "The device doesn't support navigator.mediaDevices , only supported cameraIdOrConfig in this case is deviceId parameter (string).",
      traduccion:
        "Thiết bị không hỗ trợ navigator.mediaDevices, trong trường hợp này chỉ hỗ trợ cameraIdOrConfig với tham số deviceId (chuỗi).",
    },
    {
      original: "Camera streaming not supported by the browser.",
      traduccion: "Trình duyệt không hỗ trợ phát trực tuyến từ camera.",
    },
    {
      original: "Unable to query supported devices, unknown error.",
      traduccion:
        "Không thể truy vấn các thiết bị được hỗ trợ, lỗi không xác định.",
    },
    {
      original:
        "Camera access is only supported in secure context like https or localhost.",
      traduccion:
        "Chỉ hỗ trợ truy cập camera trong môi trường an toàn như https hoặc localhost.",
    },
    { original: "Scanner paused", traduccion: "Máy quét đã tạm dừng" },

    { original: "Scanning", traduccion: "Đang quét" },
    { original: "Idle", traduccion: "Đang chờ" },
    { original: "Error", traduccion: "Lỗi" },
    { original: "Permission", traduccion: "Quyền" },
    { original: "No Cameras", traduccion: "Không có camera" },
    { original: "Last Match:", traduccion: "Kết quả cuối:" },
    { original: "Code Scanner", traduccion: "Máy quét mã" },
    {
      original: "Request Camera Permissions",
      traduccion: "Yêu cầu quyền truy cập camera",
    },
    {
      original: "Requesting camera permissions...",
      traduccion: "Đang yêu cầu quyền truy cập camera...",
    },
    { original: "No camera found", traduccion: "Không tìm thấy camera" },
    { original: "Stop Scanning", traduccion: "Dừng quét" },
    { original: "Start Scanning", traduccion: "Bắt đầu quét" },
    { original: "Switch On Torch", traduccion: "Bật đèn pin" },
    { original: "Switch Off Torch", traduccion: "Tắt đèn pin" },
    {
      original: "Failed to turn on torch",
      traduccion: "Không bật được đèn pin",
    },
    {
      original: "Failed to turn off torch",
      traduccion: "Không tắt được đèn pin",
    },
    { original: "Launching Camera...", traduccion: "Đang mở camera..." },
    { original: "Scan an Image File", traduccion: "Quét tệp hình ảnh" },
    {
      original: "Scan using camera directly",
      traduccion: "Quét trực tiếp bằng camera",
    },
    { original: "Select Camera", traduccion: "Chọn camera" },
    { original: "Choose Image", traduccion: "Chọn hình ảnh" },
    { original: "Choose Another", traduccion: "Chọn cái khác" },
    { original: "No image choosen", traduccion: "Không có hình ảnh được chọn" },
    { original: "Anonymous Camera", traduccion: "Camera ẩn danh" },
    {
      original: "Or drop an image to scan",
      traduccion: "Hoặc kéo thả hình ảnh để quét",
    },
    {
      original: "Or drop an image to scan (other files not supported)",
      traduccion:
        "Hoặc kéo thả hình ảnh để quét (các tệp khác không được hỗ trợ)",
    },
    { original: "zoom", traduccion: "phóng to" },
    { original: "Loading image...", traduccion: "Đang tải hình ảnh..." },
    { original: "Camera based scan", traduccion: "Quét bằng camera" },
    { original: "Fule based scan", traduccion: "Quét từ tệp" },
    { original: "Powered by ", traduccion: "Được cung cấp bởi " },
    { original: "Report issues", traduccion: "Báo cáo vấn đề" },
    {
      original: "NotAllowedError: Permission denied",
      traduccion: "Lỗi: Quyền bị từ chối để truy cập camera",
    },
  ];

  const traducirTexto = (texto: string | null) => {
    if (!texto) return texto;
    const traduccion = traducciones.find((t) => t.original === texto.trim());
    return traduccion ? traduccion.traduccion : texto;
  };

  const traducirNodosDeTexto = (nodo: Node) => {
    if (nodo.nodeType === Node.TEXT_NODE) {
      nodo.textContent = traducirTexto(nodo.textContent);
    } else {
      nodo.childNodes.forEach(traducirNodosDeTexto);
    }
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(traducirNodosDeTexto);
      }
    });
  });

  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);

  traducirNodosDeTexto(document.body);
};

const ScannerQR = ({ onScanSuccess }: IScannerQRProps) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: { width: 250, height: 250 },
        fps: 10,
      },
      false,
    );

    let isScanning = true;

    const success = (result: string) => {
      if (isScanning) {
        scanner.clear().catch((error) => console.warn(error));
        onScanSuccess(result);
        isScanning = false;
      }
    };

    const error = (err: string) => {
      console.warn(err);
    };

    scanner.render(success, error);

    scannerTranslator();

    return () => {
      scanner.clear().catch((error) => console.warn(error));
    };
  }, [onScanSuccess]);

  return (
    <div className="flex items-center justify-center">
      <div id="reader"></div>
    </div>
  );
};

export default ScannerQR;
