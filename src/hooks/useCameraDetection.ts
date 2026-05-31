/**
 * useCameraDetection — Detección de dispositivos de grabación con IA
 *
 * IDEA ORIGINAL del proyecto: usa la cámara frontal para detectar si hay
 * otro teléfono u óptica apuntando a la pantalla.
 *
 * Flujo:
 *   1. Se activa la cámara frontal de forma silenciosa (sin preview visible)
 *   2. Se captura un frame cada 2 segundos
 *   3. Se pasa por un modelo de detección de objetos (MobileNet / YOLO nano)
 *   4. Si detecta "cell phone", "camera", "laptop" apuntando → alerta
 *
 * Fase actual: interfaz preparada, modelo de IA se integrará en Fase 2
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { Platform } from 'react-native';

interface DetectionResult {
  deviceDetected: boolean;
  confidence: number;       // 0.0 a 1.0
  detectedClass?: string;   // "cell phone", "camera", etc.
}

interface UseCameraDetectionOptions {
  onDeviceDetected?: (result: DetectionResult) => void;
  enabled?: boolean;
  sensitivityThreshold?: number; // 0.0-1.0, default 0.7
}

export function useCameraDetection({
  onDeviceDetected,
  enabled = false, // Desactivado por defecto, el usuario lo activa
  sensitivityThreshold = 0.7,
}: UseCameraDetectionOptions = {}) {
  const [isActive, setIsActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // TODO Fase 2: Inicializar modelo TensorFlow Lite / ONNX
  // El modelo será un YOLOv8 nano (~6MB) especializado en detectar:
  // - Smartphones sostenidos
  // - Cámaras fotográficas
  // - Webcams y cámaras integradas en laptops

  const analyzeFrame = useCallback(async (): Promise<DetectionResult> => {
    // TODO Fase 2: Capturar frame de cámara frontal y pasarlo al modelo
    // Por ahora devuelve resultado simulado
    return {
      deviceDetected: false,
      confidence: 0,
    };
  }, [sensitivityThreshold]);

  const startDetection = useCallback(async () => {
    if (!enabled || !hasPermission) return;

    setIsActive(true);
    intervalRef.current = setInterval(async () => {
      const result = await analyzeFrame();
      if (result.deviceDetected && result.confidence >= sensitivityThreshold) {
        onDeviceDetected?.(result);
      }
    }, 2000); // Analiza cada 2 segundos (balance entre precisión y batería)
  }, [enabled, hasPermission, analyzeFrame, sensitivityThreshold, onDeviceDetected]);

  const stopDetection = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      startDetection();
    } else {
      stopDetection();
    }
    return stopDetection;
  }, [enabled, startDetection, stopDetection]);

  return {
    isActive,
    hasPermission,
  };
}
