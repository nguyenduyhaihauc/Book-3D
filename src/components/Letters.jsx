import { useState, useEffect, useRef } from "react";
import Fireworks from "../Fireworks";

export const Letters = () => {
  const [showLetter, setShowLetter] = useState(false);
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [displayedContent, setDisplayedContent] = useState("");
  const [showSignature, setShowSignature] = useState(false);
  const [showFireworksIcon, setShowFireworksIcon] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const letterContainerRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const signatureRef = useRef(null);
  const fireworksIconRef = useRef(null);

  const title = "Gửi Tới Em Người Anh Yêu";
  const content = `Em à,

Khi năm cũ khép lại, anh chỉ muốn nói một điều xuất phát từ tận đáy lòng: cảm ơn em vì đã cùng anh đi hết một năm vừa qua.

Năm mới này, anh mong rằng chúng ta sẽ tiếp tục sánh bước bên nhau, cùng nhau vun đắp tình yêu bằng sự thấu hiểu và sẻ chia. Dù tương lai có nhiều thử thách, anh vẫn muốn cùng em đi qua tất cả.

Chúc cho chúng ta một năm mới thật nhiều yêu thương và nhiều năm sau nữa, vẫn là “chúng ta”.`;

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

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/bg_tet_1.jpg')",
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
            <div className="absolute w-96 h-96 rounded-full animate-envelope-glow-large"></div>
            {/* Glow effect nhỏ */}
            <div className="absolute w-80 h-80 rounded-full animate-envelope-glow-small"></div>

            {/* Sparkles xung quanh */}
            {[...Array(16)].map((_, i) => {
              const angle = i * 22.5 * (Math.PI / 180);
              const radius = 140;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
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
                  className="absolute w-3 h-3 rounded-full animate-envelope-sparkle"
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
                  className="absolute w-1 h-40 animate-light-ray"
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
              className="w-48 h-48 md:w-64 md:h-64 cursor-pointer hover:scale-110 transition-transform duration-300 mx-auto animate-envelope-float"
              onClick={() => setShowLetter(true)}
              style={{
                filter:
                  "drop-shadow(0 0 20px rgba(255, 215, 0, 0.5)) drop-shadow(0 0 40px rgba(255, 107, 107, 0.3))",
              }}
            />
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div
            ref={letterContainerRef}
            className="relative bg-white/10 backdrop-blur-xl rounded-lg shadow-2xl max-w-2xl w-full p-8 md:p-12 max-h-[90vh] overflow-y-auto border border-white/20 scrollbar-hide"
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
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
            >
              ×
            </button>

            {/* Tiêu đề màu vàng may mắn ở giữa */}
            <h1
              ref={titleRef}
              className="text-center text-4xl md:text-5xl font-bold mb-8 animate-text-glow"
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
                className="text-lg md:text-xl leading-relaxed mb-8 whitespace-pre-line animate-text-glow-subtle"
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
                className="text-right text-2xl md:text-3xl italic animate-fade-in animate-text-glow-subtle"
                style={{
                  color: "#FFE4B5",
                  fontFamily: "Dancing Script",
                  textShadow:
                    "0 0 8px rgba(255, 228, 181, 0.8), 0 0 15px rgba(255, 228, 181, 0.5), 0 0 25px rgba(255, 215, 0, 0.3)",
                }}
              >
                Gửi em thế giới nhỏ trong anh,
                <br />
                <span className="mt-2 inline-block">An Nguyễn</span>
              </div>
            )}

            {/* Icon fireworks với ánh sáng xung quanh */}
            {showFireworksIcon && (
              <div
                ref={fireworksIconRef}
                className="flex justify-center mt-8 mb-4 animate-fade-in relative"
              >
                {/* Ánh sáng xung quanh */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Glow effect */}
                  <div className="absolute w-20 h-20 md:w-24 md:h-24 rounded-full animate-glow-pulse"></div>
                  <div className="absolute w-16 h-16 md:w-20 md:h-20 rounded-full animate-glow-pulse-delayed"></div>

                  {/* Sparkles */}
                  {[...Array(12)].map((_, i) => {
                    const angle = i * 30 * (Math.PI / 180);
                    const radius = 30;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    const delay = i * 0.1;
                    return (
                      <div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full animate-sparkle"
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
                    className="w-12 h-12 md:w-16 md:h-16 cursor-pointer animate-fireworks-magic hover:scale-110 transition-transform duration-300"
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
