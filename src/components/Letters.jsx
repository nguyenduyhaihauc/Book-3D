import { useState, useEffect, useRef } from "react";

export const Letters = () => {
  const [showLetter, setShowLetter] = useState(false);
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [displayedContent, setDisplayedContent] = useState("");
  const [showSignature, setShowSignature] = useState(false);
  const [showFireworksIcon, setShowFireworksIcon] = useState(false);
  const letterContainerRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const signatureRef = useRef(null);
  const fireworksIconRef = useRef(null);

  const title = "Chúc Mừng Năm Mới";
  const content = `Kính gửi những người thân yêu,

Năm mới đã đến, mang theo những hy vọng và ước mơ mới. Chúng ta cùng nhau bước vào một hành trình mới với tinh thần lạc quan và quyết tâm.

Chúc mọi người một năm mới tràn đầy niềm vui, sức khỏe dồi dào, và thành công trong mọi lĩnh vực. Hãy luôn giữ cho mình một trái tim ấm áp và một tinh thần tích cực.

Mong rằng năm mới này sẽ mang đến cho tất cả chúng ta những khoảnh khắc đáng nhớ và những kỷ niệm đẹp đẽ.`;

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
        <div className="text-center">
          <img
            src="/images/greeting-card.png"
            alt="Greeting Card"
            className="w-48 h-48 md:w-64 md:h-64 cursor-pointer hover:scale-110 transition-transform duration-300 mx-auto"
            onClick={() => setShowLetter(true)}
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div
            ref={letterContainerRef}
            className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 md:p-12 max-h-[90vh] overflow-y-auto"
          >
            {/* Nút đóng */}
            <button
              onClick={() => setShowLetter(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
            >
              ×
            </button>

            {/* Tiêu đề màu đỏ tết ở giữa */}
            <h1
              ref={titleRef}
              className="text-center text-4xl md:text-5xl font-bold mb-8"
              style={{ color: "#DC143C", fontFamily: "Dancing Script" }}
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
                className="text-lg md:text-xl leading-relaxed mb-8 whitespace-pre-line"
                style={{
                  color: "#D2B48C",
                  fontFamily: "Dancing Script",
                  lineHeight: "1.8",
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
                className="text-right text-2xl md:text-3xl italic animate-fade-in"
                style={{ color: "#D2B48C", fontFamily: "Dancing Script" }}
              >
                Với tình yêu thương,
                <br />
                <span className="mt-2 inline-block">Your Name</span>
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
                      // Có thể thêm logic chuyển trang ở đây nếu cần
                      console.log("Fireworks clicked!");
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
