import { useState, useEffect, useRef } from "react";
import Fireworks from "../Fireworks";

export const Letters = () => {
  const [showLetter, setShowLetter] = useState(false);
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [displayedContent, setDisplayedContent] = useState("");
  const [showSignature, setShowSignature] = useState(false);
  const [showFireworksIcon, setShowFireworksIcon] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [deviceType, setDeviceType] = useState('desktop'); // 'mobile', 'tablet', 'desktop'
  const letterContainerRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const signatureRef = useRef(null);
  const fireworksIconRef = useRef(null);

  // Kiểm tra kích thước màn hình
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDeviceType('mobile'); // < 640px: điện thoại
      } else if (width >= 640 && width < 1024) {
        setDeviceType('tablet'); // 640px - 1024px: iPad
      } else {
        setDeviceType('desktop'); // >= 1024px: laptop/desktop
      }
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);

    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  const title = "Gửi Tới Em Người Anh Yêu";
  const content = `Em à,
 nhiều năm sau nữa, vẫn là “chúng ta”.`;

  useEffect(() => {
    if (!showLetter) {
      // Reset khi đóng thư
      setDisplayedTitle("");
      setDisplayedContent("");
      setShowSignature(false);
      setShowFireworksIcon(false);
      return;
    }

    let titleIndex = 0;
    let contentIndex = 0;
    let titleInterval;
    let contentInterval;

    // Hàm scroll đến element
    const scrollToElement = (elementRef) => {
      if (elementRef.current && letterContainerRef.current) {
        const container = letterContainerRef.current;
        const element = elementRef.current;
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        // Tính toán vị trí scroll
        const scrollTop = container.scrollTop;
        const elementTop = elementRect.top - containerRect.top + scrollTop;
        const elementHeight = elementRect.height;
        const containerHeight = containerRect.height;

        // Scroll để element ở giữa container
        const targetScroll =
          elementTop - containerHeight / 2 + elementHeight / 2;

        container.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      }
    };

    // Viết tiêu đề trước
    const startTitle = () => {
      titleInterval = setInterval(() => {
        if (titleIndex < title.length) {
          setDisplayedTitle(title.substring(0, titleIndex + 1));
          titleIndex++;
          // Scroll đến tiêu đề mỗi vài ký tự
          if (titleIndex % 3 === 0) {
            setTimeout(() => scrollToElement(titleRef), 10);
          }
        } else {
          clearInterval(titleInterval);
          // Sau khi viết xong tiêu đề, đợi một chút rồi viết nội dung
          setTimeout(() => {
            startContent();
          }, 500);
        }
      }, 100); // Tốc độ viết: 100ms mỗi ký tự
    };

    // Viết nội dung
    const startContent = () => {
      contentInterval = setInterval(() => {
        if (contentIndex < content.length) {
          setDisplayedContent(content.substring(0, contentIndex + 1));
          contentIndex++;
          // Scroll đến nội dung đang viết mỗi vài ký tự
          if (contentIndex % 5 === 0) {
            setTimeout(() => {
              if (contentRef.current && letterContainerRef.current) {
                // Scroll đến cuối của nội dung đang hiển thị
                const container = letterContainerRef.current;
                const contentElement = contentRef.current;
                const contentBottom =
                  contentElement.offsetTop + contentElement.scrollHeight;
                const containerHeight = container.clientHeight;
                const scrollTop = container.scrollTop;

                // Nếu nội dung vượt quá viewport, scroll xuống
                if (contentBottom > scrollTop + containerHeight - 50) {
                  container.scrollTo({
                    top: contentBottom - containerHeight + 100,
                    behavior: "smooth",
                  });
                }
              }
            }, 10);
          }
        } else {
          clearInterval(contentInterval);
          // Sau khi viết xong nội dung, hiển thị chữ ký
          setTimeout(() => {
            setShowSignature(true);
            setTimeout(() => {
              scrollToElement(signatureRef);
              // Sau khi hiển thị chữ ký, hiển thị icon fireworks
              setTimeout(() => {
                setShowFireworksIcon(true);
                setTimeout(() => {
                  if (fireworksIconRef.current && letterContainerRef.current) {
                    const container = letterContainerRef.current;
                    const iconElement = fireworksIconRef.current;
                    const iconBottom =
                      iconElement.offsetTop + iconElement.scrollHeight;
                    const containerHeight = container.clientHeight;
                    const scrollTop = container.scrollTop;

                    container.scrollTo({
                      top: iconBottom - containerHeight + 100,
                      behavior: "smooth",
                    });
                  }
                }, 100);
              }, 800);
            }, 100);
          }, 500);
        }
      }, 50); // Tốc độ viết: 50ms mỗi ký tự
    };

    // Bắt đầu viết tiêu đề sau một chút delay
    setTimeout(() => {
      startTitle();
    }, 300);

    return () => {
      clearInterval(titleInterval);
      clearInterval(contentInterval);
    };
  }, [showLetter]);

  // Format nội dung để hiển thị với line breaks
  const formatContent = (text) => {
    return text.split("\n").map((line, index, array) => (
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));
  };

  // Chọn background dựa trên loại thiết bị
  const getBackgroundImage = () => {
    switch (deviceType) {
      case 'mobile':
        return "url('/images/Bg_thu_dien_thoai.png')";
      case 'tablet':
        return "url('/images/Bg_thu_ipad.png')";
      case 'desktop':
      default:
        return "url('/images/Bg_thu_tet.png')";
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: getBackgroundImage(),
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {!showLetter ? (
        <div className="text-center relative flex items-center justify-center">
          {/* Ánh sáng xung quanh phong thư */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Glow effect lớn */}
            <div className="absolute w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full animate-envelope-glow-large"></div>
            {/* Glow effect nhỏ */}
            <div className="absolute w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full animate-envelope-glow-small"></div>

            {/* Sparkles xung quanh */}
            {[...Array(16)].map((_, i) => {
              const angle = i * 22.5 * (Math.PI / 180);
              const baseRadius = typeof window !== 'undefined' && window.innerWidth < 768 ? 100 : 140;
              const x = Math.cos(angle) * baseRadius;
              const y = Math.sin(angle) * baseRadius;
              const delay = i * 0.15;
              const colors = [
                "#FFD700",
                "#FF6B6B",
                "#4ECDC4",
                "#FFA500",
                "#FF1493",
                "#00CED1",
              ];
              return (
                <div
                  key={i}
                  className="absolute w-2 h-2 md:w-3 md:h-3 rounded-full animate-envelope-sparkle"
                  style={{
                    "--sparkle-x": `${x}px`,
                    "--sparkle-y": `${y}px`,
                    animationDelay: `${delay}s`,
                    background: `radial-gradient(circle, 
                      ${colors[i % colors.length]} 0%, 
                      transparent 70%)`,
                    boxShadow: `0 0 10px ${colors[i % colors.length]}`,
                  }}
                ></div>
              );
            })}

            {/* Light rays */}
            {[...Array(8)].map((_, i) => {
              const rotation = i * 45;
              return (
                <div
                  key={`ray-${i}`}
                  className="absolute w-1 h-28 md:h-36 lg:h-40 animate-light-ray"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(255, 215, 0, 0.3), transparent)",
                    transformOrigin: "center",
                    transform: `rotate(${rotation}deg)`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                ></div>
              );
            })}
          </div>

          {/* Phong thư */}
          <div className="relative z-10">
            <img
              src="/images/phong_thu.png"
              alt="Phong thư"
              className="w-36 h-36 sm:w-44 sm:h-44 md:w-56 md:h-56 lg:w-64 lg:h-64 cursor-pointer hover:scale-110 transition-transform duration-300 mx-auto animate-envelope-float"
              onClick={() => setShowLetter(true)}
              style={{
                filter:
                  "drop-shadow(0 0 20px rgba(255, 215, 0, 0.5)) drop-shadow(0 0 40px rgba(255, 107, 107, 0.3))",
              }}
            />
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 md:p-6">
          <div
            ref={letterContainerRef}
            className="relative bg-white/10 backdrop-blur-xl rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl p-4 sm:p-6 md:p-8 lg:p-12 h-auto min-h-[280px] sm:min-h-[320px] md:min-h-[400px] lg:min-h-[450px] max-h-[70vh] sm:max-h-[65vh] md:max-h-[70vh] lg:max-h-[70vh] overflow-y-auto border border-white/20 scrollbar-hide"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
              boxShadow:
                "0 8px 32px 0 rgba(255, 215, 0, 0.2), 0 0 80px rgba(255, 107, 107, 0.15)",
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE and Edge
            }}
          >
            {/* Nút đóng */}
            <button
              onClick={() => setShowLetter(false)}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 text-white hover:text-gray-300 text-3xl sm:text-4xl md:text-3xl font-bold z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
              style={{
                textShadow: "0 0 10px rgba(255, 215, 0, 0.8)"
              }}
            >
              ×
            </button>

            {/* Tiêu đề màu vàng may mắn ở giữa */}
            <h1
              ref={titleRef}
              className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 animate-text-glow px-2"
              style={{
                color: "#FFD700",
                fontFamily: "Dancing Script",
                textShadow:
                  "0 0 10px rgba(255, 215, 0, 0.9), 0 0 20px rgba(255, 215, 0, 0.7), 0 0 30px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 165, 0, 0.4), 0 0 50px rgba(255, 140, 0, 0.3)",
              }}
            >
              {displayedTitle}
              {displayedTitle.length < title.length && (
                <span className="animate-pulse">|</span>
              )}
            </h1>

            {/* Nội dung thư màu nâu nhạt */}
            {displayedTitle === title && (
              <div
                ref={contentRef}
                className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mb-4 sm:mb-6 md:mb-8 whitespace-pre-line animate-text-glow-subtle px-2"
                style={{
                  color: "#FFE4B5",
                  fontFamily: "Dancing Script",
                  lineHeight: "1.8",
                  textShadow:
                    "0 0 8px rgba(255, 228, 181, 0.8), 0 0 15px rgba(255, 228, 181, 0.5), 0 0 25px rgba(255, 215, 0, 0.3)",
                }}
              >
                {formatContent(displayedContent)}
                {displayedContent.length < content.length && (
                  <span className="animate-pulse">|</span>
                )}
              </div>
            )}

            {/* Chữ ký ở góc phải */}
            {showSignature && (
              <div
                ref={signatureRef}
                className="text-right text-lg sm:text-xl md:text-2xl lg:text-3xl italic animate-fade-in animate-text-glow-subtle px-2"
                style={{
                  color: "#FFE4B5",
                  fontFamily: "Dancing Script",
                  textShadow:
                    "0 0 8px rgba(255, 228, 181, 0.8), 0 0 15px rgba(255, 228, 181, 0.5), 0 0 25px rgba(255, 215, 0, 0.3)",
                }}
              >
                Gửi em thế giới nhỏ trong anh,
                <br />
                <span className="mt-1 sm:mt-2 inline-block">An Nguyễn</span>
              </div>
            )}

            {/* Icon fireworks với ánh sáng xung quanh */}
            {showFireworksIcon && (
              <div
                ref={fireworksIconRef}
                className="flex justify-center mt-4 sm:mt-6 md:mt-8 mb-2 sm:mb-3 md:mb-4 animate-fade-in relative px-2"
              >
                {/* Ánh sáng xung quanh */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Glow effect */}
                  <div className="absolute w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full animate-glow-pulse"></div>
                  <div className="absolute w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full animate-glow-pulse-delayed"></div>

                  {/* Sparkles */}
                  {[...Array(12)].map((_, i) => {
                    const angle = i * 30 * (Math.PI / 180);
                    const baseRadius = typeof window !== 'undefined' && window.innerWidth < 640 ? 22 : 30;
                    const x = Math.cos(angle) * baseRadius;
                    const y = Math.sin(angle) * baseRadius;
                    const delay = i * 0.1;
                    return (
                      <div
                        key={i}
                        className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full animate-sparkle"
                        style={{
                          "--sparkle-x": `${x}px`,
                          "--sparkle-y": `${y}px`,
                          animationDelay: `${delay}s`,
                          background: `radial-gradient(circle, 
                            ${
                              i % 3 === 0
                                ? "#FFD700"
                                : i % 3 === 1
                                ? "#FF6B6B"
                                : "#4ECDC4"
                            } 0%, 
                            transparent 70%)`,
                        }}
                      ></div>
                    );
                  })}
                </div>

                {/* Icon fireworks */}
                <div className="relative z-10">
                  <img
                    src="/images/fireworks.png"
                    alt="Fireworks"
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 cursor-pointer animate-fireworks-magic hover:scale-110 active:scale-95 transition-transform duration-300"
                    onClick={() => {
                      setShowFireworks(true);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Màn hình bắn pháo hoa */}
      {showFireworks && <Fireworks />}
    </div>
  );
};
