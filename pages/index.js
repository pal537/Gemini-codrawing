import { useState, useRef, useEffect } from "react";
import { SendHorizontal, LoaderCircle, Trash2, Key, Palette, Undo, Download } from "lucide-react";
import Head from "next/head";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Image from "next/image";

export default function Home() {
  const confettiRef = useRef(null);
  const canvasRef = useRef(null);
  const backgroundImageRef = useRef(null);
  const colorInputRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState("#000000");
  const [prompt, setPrompt] = useState("");
  const [canvasHistory, setCanvasHistory] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyError, setApiKeyError] = useState("");

  // **异步加载 confetti 库**
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadConfetti = () => {
      if (window.confetti) {
        confettiRef.current = window.confetti;
        return;
      }

      const script = document.createElement("script");
      script.src = "/confetti.min.js";
      script.async = true;
      script.onload = () => {
        confettiRef.current = window.confetti;
      };
      script.onerror = () => {
        console.error("Failed to load confetti.min.js");
      };
      document.body.appendChild(script);
    };

    loadConfetti();

    return () => {
      confettiRef.current = null;
    };
  }, []);

  // **显示 confetti 效果**
  const showConfetti = () => {
    if (!confettiRef.current || typeof confettiRef.current !== 'function') {
      console.warn("Confetti library not loaded yet");
      return;
    }

    const colors = ["#FF6B6B", "#4ECDC4", "#FFD166", "#9C59FF", "#7AE582", "#4CC9F0"];
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      try {
        if (!confettiRef.current) return;

        const confettiConfig = {
          particleCount: 2,
          spread: 55,
          colors: colors,
          zIndex: 100
        };

        confettiRef.current({
          ...confettiConfig,
          angle: 60,
          origin: { x: 0, y: 0.7 }
        });

        confettiRef.current({
          ...confettiConfig,
          angle: 120,
          origin: { x: 1, y: 0.7 }
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      } catch (error) {
        console.warn("Confetti effect failed:", error);
      }
    };

    frame();
  };

  // **检查 localStorage 中的 API 密钥**
  useEffect(() => {
    const storedApiKey = localStorage.getItem("geminiApiKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      setShowApiKeyModal(true);
    }
  }, []);

  // **保存 API 密钥到 localStorage**
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("geminiApiKey", apiKey);
    }
  }, [apiKey]);

  // **加载生成的图片到画布**
  useEffect(() => {
    if (generatedImage && canvasRef.current) {
      const img = new window.Image();
      img.onload = () => {
        backgroundImageRef.current = img;
        drawImageToCanvas();
      };
      img.src = generatedImage;
    }
  }, [generatedImage]);

  // **初始化画布为白色背景**
  useEffect(() => {
    if (canvasRef.current) {
      initializeCanvas();
    }
  }, []);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const drawImageToCanvas = () => {
    if (!canvasRef.current || !backgroundImageRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImageRef.current, 0, 0, canvas.width, canvas.height);
  };

  // **获取鼠标或触摸坐标**
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.nativeEvent.offsetX || (e.nativeEvent.touches?.[0]?.clientX - rect.left)) * scaleX,
      y: (e.nativeEvent.offsetY || (e.nativeEvent.touches?.[0]?.clientY - rect.top)) * scaleY,
    };
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCoordinates(e);
    if (e.type === "touchstart") {
      e.preventDefault();
    }
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    if (e.type === "touchmove") {
      e.preventDefault();
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCoordinates(e);
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = penColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL();
      setCanvasHistory((prev) => [...prev, imageData]);
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    setShowDeleteConfirm(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setGeneratedImage(null);
    backgroundImageRef.current = null;
    setCanvasHistory([]);
  };

  const undoLastDraw = () => {
    if (canvasHistory.length > 1) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new window.Image();
      img.onload = () => {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      const previousState = canvasHistory[canvasHistory.length - 2];
      img.src = previousState;
      setCanvasHistory((prev) => prev.slice(0, -1));
    } else if (canvasHistory.length === 1) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setCanvasHistory([]);
    }
  };

  const handleColorChange = (e) => {
    setPenColor(e.target.value);
  };

  const openColorPicker = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      openColorPicker();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }
    setIsLoading(true);
    try {
      const canvas = canvasRef.current;
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.fillStyle = "#FFFFFF";
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(canvas, 0, 0);
      const drawingData = tempCanvas.toDataURL("image/png").split(",")[1];
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp-image-generation",
        generationConfig: {
          responseModalities: ["Text", "Image"],
        },
      });
      const imagePart = {
        inlineData: {
          data: drawingData,
          mimeType: "image/png",
        },
      };
      const generationContent = [
        imagePart,
        { text: prompt ? `${prompt}. Keep the same minimal line doodle style.` : "Add something new to this drawing, in the same style." },
      ];
      console.log("Calling Gemini API directly from browser...");
      const response = await model.generateContent(generationContent);
      console.log("Gemini API response received");
      let imageData = null;
      for (const part of response.response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageData = part.inlineData.data;
          console.log("Received image data, length:", imageData.length);
        }
      }
      if (imageData) {
        const imageUrl = `data:image/png;base64,${imageData}`;
        setGeneratedImage(imageUrl);
      } else {
        console.error("No image data in response");
        alert("Failed to generate image. Please try again.");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      alert(`Error: ${error.message || "Failed to generate image. Please check your API key."}`);
    } finally {
      setIsLoading(false);
    }
  };

  // **防止触摸设备的默认行为**
  useEffect(() => {
    const preventTouchDefault = (e) => {
      if (isDrawing) {
        e.preventDefault();
      }
    };
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("touchstart", preventTouchDefault, { passive: false });
      canvas.addEventListener("touchmove", preventTouchDefault, { passive: false });
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener("touchstart", preventTouchDefault);
        canvas.removeEventListener("touchmove", preventTouchDefault);
      }
    };
  }, [isDrawing]);

  const handleSaveApiKey = () => {
    if (!apiKey || apiKey.trim() === "") {
      setApiKeyError("Please enter a valid API key");
      return;
    }
    setApiKeyError("");
    setShowApiKeyModal(false);
  };

  const openApiKeyModal = () => {
    setShowApiKeyModal(true);
  };

  return (
    <>
      <Head>
        <title>Gemini Ai儿童画图乐园</title>
        <meta name="description" content="Gemini Ai儿童画图乐园 - 一个有趣的AI绘画工具" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="paper-container paper-edge p-6 md:p-8 max-w-md w-full rounded-3xl border-4 border-cartoon-primary bg-white">
            <h2 className="text-2xl md:text-3xl font-bold text-cartoon-primary mb-6 text-center">确定要清除画布吗？</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="cartoon-button bubble-button bg-cartoon-secondary text-white px-6 py-3 text-xl font-bold rounded-2xl bounce-hover"
              >
                取消
              </button>
              <button
                onClick={clearCanvas}
                className="cartoon-button bubble-button bg-cartoon-primary text-white px-6 py-3 text-xl font-bold rounded-2xl bounce-hover"
              >
                确定清除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API 密钥弹窗 */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="paper-container paper-edge p-6 md:p-8 max-w-md w-full rounded-3xl border-4 border-cartoon-purple bg-white">
            <div className="flex items-center mb-5">
              <Image src="/cartoon-magic-wand.svg" width={40} height={40} alt="Magic Wand" className="mr-4 bounce-hover" />
              <h2 className="text-2xl md:text-3xl font-bold text-cartoon-purple" style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.1)" }}>
                ✨ 输入你的魔法钥匙 ✨
              </h2>
            </div>
            <p className="text-gray-700 mb-6 text-lg md:text-xl font-medium">
              你可以在这里获取魔法钥匙：{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cartoon-purple font-bold underline wiggle-hover inline-block"
              >
                Google AI Studio 🪄
              </a>
            </p>
            <div className="mb-6">
              <label htmlFor="apiKey" className="block text-xl font-bold text-cartoon-secondary mb-3">
                🔑 魔法钥匙
              </label>
              <input
                type="text"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSyA..."
                className="cartoon-input w-full px-5 py-4 text-lg border-cartoon-secondary"
              />
              {apiKeyError && <p className="mt-2 text-cartoon-primary font-bold text-lg">{apiKeyError}</p>}
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleSaveApiKey}
                className="cartoon-button bubble-button bg-cartoon-accent text-black px-8 py-4 text-xl font-bold rounded-2xl bounce-hover"
              >
                ✨ 开始神奇冒险！ ✨
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen notebook-paper-bg text-gray-900 flex flex-col justify-start items-center">
        <main className="container mx-auto px-3 sm:px-6 py-5 sm:py-10 pb-32 max-w-5xl w-full">
          {/* 头部标题和工具栏 */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-4 sm:mb-8 gap-3">
            <div className="flex items-center">
              <Image src="/cartoon-rainbow.svg" width={60} height={60} alt="Rainbow" className="mr-4 wiggle-hover hidden sm:block" />
              <div>
                <h1
                  className="text-3xl sm:text-5xl font-bold mb-0 leading-tight font-mega rainbow-text drop-shadow-md"
                  style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.2)" }}
                >
                  Gemini Ai儿童画图乐园
                </h1>
                <p className="text-base sm:text-xl text-cartoon-purple mt-2 font-bold" style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.1)" }}>
                  ✨ 画一画，说一说，看看AI能变出什么神奇的画面！✨
                </p>
              </div>
            </div>
            <menu className="flex items-center gap-2 bg-cartoon-secondary/20 rounded-xl p-2 shadow-sm self-start sm:self-auto border-2 border-cartoon-secondary">
              <button
                type="button"
                className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border-4 border-black shadow-lg transition-transform hover:scale-110 bounce-hover cartoon-button relative"
                onClick={openColorPicker}
                onKeyDown={handleKeyDown}
                aria-label="选择颜色"
                style={{ backgroundColor: penColor }}
              >
                <Palette className="w-7 h-7 text-white drop-shadow-md" />
                <input
                  ref={colorInputRef}
                  type="color"
                  value={penColor}
                  onChange={handleColorChange}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  aria-label="选择颜色"
                />
              </button>
              <button
                type="button"
                onClick={undoLastDraw}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-cartoon-secondary text-white shadow-lg transition-all hover:scale-110 bounce-hover cartoon-button"
                aria-label="撤销"
                disabled={canvasHistory.length === 0}
                style={{ opacity: canvasHistory.length === 0 ? 0.5 : 1 }}
              >
                <Undo className="w-7 h-7 drop-shadow-md" />
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-cartoon-primary text-white shadow-lg transition-all hover:scale-110 bounce-hover cartoon-button"
                aria-label="清除画布"
              >
                <Trash2 className="w-7 h-7 drop-shadow-md" />
              </button>
              <button
                type="button"
                onClick={() => {
                  openApiKeyModal();
                  showConfetti();
                }}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-cartoon-accent shadow-lg transition-all hover:scale-110 bounce-hover cartoon-button"
                title="设置API密钥"
                aria-label="设置API密钥"
              >
                <Key className="w-7 h-7 text-black drop-shadow-md" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const canvas = canvasRef.current;
                  if (!canvas) return;
                  const link = document.createElement('a');
                  link.download = '我的画作.png';
                  link.href = canvas.toDataURL('image/png');
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-cartoon-green text-white shadow-lg transition-all hover:scale-110 bounce-hover cartoon-button"
                title="下载画作"
                aria-label="下载画作"
              >
                <Download className="w-7 h-7 drop-shadow-md" />
              </button>
            </menu>
          </div>

          {/* 画布区域 */}
          <div className="w-full mb-6">
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="border-4 border-dashed border-cartoon-primary rounded-3xl w-full hover:cursor-crosshair h-[75vh] min-h-[320px] bg-white/95 touch-none shadow-lg paper-shadow paper-edge"
            />
          </div>

          {/* 输入表单 */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="告诉AI你想要什么神奇的画面..."
                className="cartoon-input flex-1 p-3 sm:p-4 text-sm sm:text-base border-3 border-cartoon-purple bg-white text-gray-800 focus:outline-none transition-all font-medium"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="cartoon-button bubble-button flex items-center justify-center p-2 rounded-xl bg-cartoon-accent text-black hover:cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed transition-all w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
              >
                {isLoading ? (
                  <LoaderCircle className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" aria-label="加载中" />
                ) : (
                  <SendHorizontal className="w-5 h-5 sm:w-6 sm:h-6" aria-label="提交" />
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}