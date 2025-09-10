/* 팝업 UI 관리 클래스 */

// 상수 정의
const MESSAGE_TYPES = {
  INJECT_PASS_SCRIPT: 'INJECT_PASS_SCRIPT',
  SET_STATUS: 'SET_STATUS'
};

/** 웹브라우저 진입시 & 팝업 열릴 때 실행되는 기능
 * storage에 저장된 설정 불러오기 - 버튼 selected 상태 업데이트
 * 버튼 이벤트 리스너 설정 - storage에 저장, 버튼 UI 반영, content.js에 상태 전달
 */

class PopupUIManager {
  /* 팝업 열릴 때 초기화 */
  constructor() {
    this.elements = this.initializeElements();
    this.init();
  }

  /* DOM 요소 초기화 */
  initializeElements() {
    return {
      simulatorSelects: document.querySelectorAll('#communication-simulator select')
    };
  }

  init() {
    this.loadSavedSettings();
    this.setupEventListeners();
  }

  /* storage에 저장된 설정 불러오기 */
  loadSavedSettings() {
    chrome.storage.local.get(['simulatorSettings'], (data) => {
      this.restoreSimulatorSettings(data);
    });
  }

  /* simulatorSettings값 가져와서 버튼 selected 상태 업데이트 */
  restoreSimulatorSettings(data) {
    if (data.simulatorSettings) {
      this.elements.simulatorSelects.forEach(select => {
        const settingKey = this.convertToCamelCase(select.id.replace('-response', '')) + 'Response';
        if (data.simulatorSettings[settingKey]) {
          select.value = data.simulatorSettings[settingKey];
        }
      });
    }
  }

  /* 이벤트 리스너 설정 */
  setupEventListeners() {
    // 시뮬레이터 설정 변경 이벤트
    this.elements.simulatorSelects.forEach(select => {
      select.addEventListener('change', () => {
        this.handleSimulatorSettingChange();
      });
    });
  }

  /* 시뮬레이터 설정 변경 처리 */
  handleSimulatorSettingChange() {
    this.saveSimulatorSettings();
    this.sendStatusToContentScript();
  }

  /* 시뮬레이터 설정 저장 */
  saveSimulatorSettings() {
    const settings = {};
    this.elements.simulatorSelects.forEach(select => {
      const settingKey = this.convertToCamelCase(select.id.replace('-response', '')) + 'Response';
      settings[settingKey] = select.value;
    });
    chrome.storage.local.set({ simulatorSettings: settings });
  }

  /* content.js에 상태 전달 - 팝업에서 설정 변경 시 */
  sendStatusToContentScript() {
    chrome.storage.local.get(['simulatorSettings'], (data) => {
      const message = {
        type: MESSAGE_TYPES.SET_STATUS, // 메시지 타입 구분을 위해
        simulatorSettings: data.simulatorSettings
      };

      this.sendMessageToActiveTab(message);
    });
  }

  /* content.js에 상태 전달 - 팝업에서 설정 변경 시 */
  sendMessageToActiveTab(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, message);
      }
    });
  }

  /* kebab-case를 camelCase로 변환 */
  convertToCamelCase(str) {
    const result = str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    return result;
  }
}

const popupUIManager = new PopupUIManager();