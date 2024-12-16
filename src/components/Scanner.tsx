import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, X } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { addBusinessCard } from '../db/database';
import { parseBusinessCardText } from '../utils/cardParser';

interface ScannerProps {
  onClose: () => void;
  onScanComplete: () => void;
}

export default function Scanner({ onClose, onScanComplete }: ScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const [processing, setProcessing] = useState(false);

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;
    
    setProcessing(true);
    const imageSrc = webcamRef.current.getScreenshot();
    
    if (imageSrc) {
      try {
        const worker = await createWorker('jpn');
        const { data: { text } } = await worker.recognize(imageSrc);
        
        const parsedData = parseBusinessCardText(text);
        await addBusinessCard({
          ...parsedData,
          imageUrl: imageSrc,
          createdAt: new Date().toISOString()
        });
        
        await worker.terminate();
        onScanComplete();
        onClose();
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
    setProcessing(false);
  }, [webcamRef, onClose, onScanComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">名刺スキャン</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="relative">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full rounded"
          />
          <button
            onClick={capture}
            disabled={processing}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2 disabled:bg-gray-400"
          >
            <Camera size={20} />
            {processing ? '処理中...' : '撮影'}
          </button>
        </div>
      </div>
    </div>
  );
}