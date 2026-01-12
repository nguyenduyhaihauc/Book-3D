import React, { useEffect, useRef } from 'react'
import Stage from './utils/Stage'
import MyMath from './utils/MyMath'
import fscreen from './utils/fscreen'
import './Fireworks.css'

// Import script.js logic - we'll load it dynamically
let scriptLoaded = false

/**
 * Component Fireworks - Hiệu ứng pháo hoa chúc mừng năm mới
 * 
 * @component
 * @example
 * import Fireworks from './fireworks/Fireworks'
 * 
 * function App() {
 *   return (
 *     <div>
 *       <Fireworks />
 *     </div>
 *   )
 * }
 */
function Fireworks() {
  const containerRef = useRef(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return

    // Make Stage, MyMath, fscreen available globally for script.js
    window.Stage = Stage
    window.MyMath = MyMath
    window.fscreen = fscreen

    // Load and execute script.js
    const loadScript = () => {
      if (scriptLoaded) return

      // Load script.js as a regular script tag
      const script = document.createElement('script')
      script.src = '/js/script.js'
      script.type = 'text/javascript'
      script.onload = () => {
        scriptLoaded = true
      }
      script.onerror = () => {
        console.error('Error loading script.js')
      }
      document.body.appendChild(script)
    }

    // Wait a bit for DOM to be ready
    setTimeout(() => {
      loadScript()
    }, 100)
    
    initializedRef.current = true

    // Cleanup function
    return () => {
      // Optional: cleanup if needed
    }
  }, [])

  return (
    <div
      className="fireworks-container fixed inset-0 z-50 w-screen h-screen overflow-hidden bg-black"
      ref={containerRef}
    >
      {/* SVG Spritesheet */}
      <div style={{ height: 0, width: 0, position: 'absolute', visibility: 'hidden' }}>
        <svg xmlns="http://www.w3.org/2000/svg">
          <symbol id="icon-play" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </symbol>
          <symbol id="icon-pause" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </symbol>
          <symbol id="icon-close" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </symbol>
          <symbol id="icon-settings" viewBox="0 0 24 24">
            <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
          </symbol>
          <symbol id="icon-sound-on" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </symbol>
          <symbol id="icon-sound-off" viewBox="0 0 24 24">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </symbol>
          <symbol id="icon-stop-wishes" viewBox="0 0 24 24">
            <path d="M6 6h12v12H6z" />
          </symbol>
        </svg>
      </div>

      {/* App Container */}
      <div className="stage-container remove">
        {/* Layer lời chúc bay trên trời */}
        <div className="wishes-layer" id="wishes-layer"></div>
        <div className="canvas-container">
          <canvas id="trails-canvas"></canvas>
          <canvas id="main-canvas"></canvas>
        </div>
        <div className="controls">
          <div className="btn pause-btn">
            <svg fill="white" width="24" height="24">
              <use href="#icon-pause" xlinkHref="#icon-pause"></use>
            </svg>
          </div>
          <div className="btn sound-btn">
            <svg fill="white" width="24" height="24">
              <use href="#icon-sound-off" xlinkHref="#icon-sound-off"></use>
            </svg>
          </div>
          <div className="btn stop-wishes-btn">
            <svg fill="white" width="24" height="24">
              <use href="#icon-stop-wishes" xlinkHref="#icon-stop-wishes"></use>
            </svg>
          </div>
          <div className="btn settings-btn">
            <svg fill="white" width="24" height="24">
              <use href="#icon-settings" xlinkHref="#icon-settings"></use>
            </svg>
          </div>
        </div>
        <div className="menu hide">
          <div className="menu__inner-wrap">
            <div className="btn btn--bright close-menu-btn">
              <svg fill="white" width="24" height="24">
                <use href="#icon-close" xlinkHref="#icon-close"></use>
              </svg>
            </div>
            <div className="menu__header">Cài đặt</div>
            <div className="menu__subheader">Để biết thêm thông tin hãy nhấp vào bất kỳ nhãn nào</div>
            <form>
              <div className="form-option form-option--select">
                <label className="shell-type-label"> Loại pháo hoa </label>
                <select className="shell-type"></select>
              </div>
              <div className="form-option form-option--select">
                <label className="shell-size-label"> Kích thước pháo hoa </label>
                <select className="shell-size"></select>
              </div>
              <div className="form-option form-option--select">
                <label className="quality-ui-label"> Chất lượng hiển thị </label>
                <select className="quality-ui"></select>
              </div>
              <div className="form-option form-option--select">
                <label className="sky-lighting-label"> Độ sáng bầu trời </label>
                <select className="sky-lighting"></select>
              </div>
              <div className="form-option form-option--select">
                <label className="scaleFactor-label"> Thu phóng </label>
                <select className="scaleFactor"></select>
              </div>
              <div className="form-option form-option--checkbox">
                <label className="word-shell-label"> Pháo hoa chữ </label>
                <input className="word-shell" type="checkbox" />
              </div>
              <div className="form-option form-option--checkbox">
                <label className="auto-launch-label"> Tự động bắn pháo </label>
                <input className="auto-launch" type="checkbox" />
              </div>
              <div className="form-option form-option--checkbox form-option--finale-mode">
                <label className="finale-mode-label"> Bắn nhiều pháo hoa cùng lúc </label>
                <input className="finale-mode" type="checkbox" />
              </div>
              <div className="form-option form-option--checkbox">
                <label className="hide-controls-label"> Ẩn nút điều khiển </label>
                <input className="hide-controls" type="checkbox" />
              </div>
              <div className="form-option form-option--checkbox form-option--fullscreen">
                <label className="fullscreen-label"> Toàn màn hình </label>
                <input className="fullscreen" type="checkbox" />
              </div>
              <div className="form-option form-option--checkbox">
                <label className="long-exposure-label"> Giữ vệt sáng pháo hoa </label>
                <input className="long-exposure" type="checkbox" />
              </div>
            </form>
            <div className="credits">
              <p className="copyright">
                {(() => {
                  const mydate = new Date()
                  return `Copyright © 2021 - ${mydate.getFullYear()} <a target="_blank" href="https://www.nianbroken.top/">碎念_Nian</a><br />All Rights Reserved`
                })()}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="help-modal">
        <div className="help-modal__overlay"></div>
        <div className="help-modal__dialog">
          <div className="help-modal__header"></div>
          <div className="help-modal__body"></div>
          <button type="button" className="help-modal__close-btn">Đóng</button>
        </div>
      </div>
    </div>
  )
}

export default Fireworks
