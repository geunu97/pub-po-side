/* Webview UI 관리 클래스 */

// 상수 정의
const MESSAGE_TYPES = {
  INJECT_PASS_SCRIPT: 'INJECT_PASS_SCRIPT',
  SET_STATUS: 'SET_STATUS'
};

class WebviewUIManager {
  constructor() {}

  init() {
    this.ensureStyleAfterReact();
    this.setupMessageListener();
    this.requestInjectionOnLoad();
  }

  /* React 앱 로드 후 스타일 적용 */
  ensureStyleAfterReact() {
    // React 앱이 로드된 후 실행
    const checkReactLoaded = () => {
      if (document.querySelector('#root') || document.querySelector('[data-reactroot]')) {
        this.createHeader();
      } else {
        setTimeout(checkReactLoaded, 100);
      }
    };
    
    checkReactLoaded();
  }

  /* Header 생성 */
  createHeader() {
    const header = document.createElement('div');
    header.id = 'pass-sdk-header';
    
    // URL에 따른 헤더 내용 설정
    const currentUrl = window.location.pathname;
    let headerText = 'PASS Webview Mock Extension';
    let headerBackgroundColor = '#007bff'; // 기본 파란색
    
    if (currentUrl.startsWith('/webview/kt/intro')) {
      headerText = '📱 PASS앱 웹뷰 - 소개 페이지';
      headerBackgroundColor = '#dc3545'; // 빨간색
    } else if (currentUrl.startsWith('/webview/kt/pricing')) {
      headerText = '🔧 SDK앱 웹뷰 - 가격 페이지';
      headerBackgroundColor = '#007bff'; // 파란색
    }
    
    header.textContent = headerText;
    
    const headerStyles = {
      backgroundColor: headerBackgroundColor,
      padding: '12px 16px',
      boxSizing: 'border-box',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '16px',
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      zIndex: '10000',
      textAlign: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };
    Object.assign(header.style, headerStyles);
    
    document.body.appendChild(header);
    
    // 헤더 높이만큼 body에 padding-top 추가
    const headerHeight = header.offsetHeight;
    document.body.style.paddingTop = headerHeight + 'px';
  }

  /* popup에서 설정 변경 시 수신 */
  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      // background.js에 새로운 설정으로 PASS 스크립트 재주입 요청
      if (message.type === MESSAGE_TYPES.SET_STATUS) {        
        chrome.runtime.sendMessage({
          type: MESSAGE_TYPES.INJECT_PASS_SCRIPT,
          simulatorSettings: message.simulatorSettings
        }, (response) => {
          if (response && response.success) {
            console.log('✅ Content Script: 새로운 설정으로 PASS 스크립트 재주입 완료');
          } else {
            console.error('❌ Content Script: PASS 스크립트 재주입 실패:', response?.error);
          }
        });
      }
    });
  }

  /* 페이지 로드시 1회 PASS 스크립트 주입 요청 */
  requestInjectionOnLoad() {
    chrome.storage.local.get(['simulatorSettings'], (data) => {
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPES.INJECT_PASS_SCRIPT,
        simulatorSettings: data?.simulatorSettings || {}
      }, (response) => {
        if (response && response.success) {
          console.log('✅ Content Script: 초기 PASS 스크립트 주입 완료');
        } else {
          console.error('❌ Content Script: 초기 PASS 스크립트 주입 실패:', response?.error);
        }
      });
    });
  }
}

const webviewUIManager = new WebviewUIManager();
webviewUIManager.init();