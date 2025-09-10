# PASS Webview Mock Extension

PASS 앱 웹뷰 시뮬레이션을 위한 Chrome 확장프로그램입니다.

## 📁 파일 구조

```
mock-kt-pass/
├── manifest.json              # 확장프로그램 설정
├── popup.html                 # 팝업 UI
├── popup.css                  # 팝업 스타일
├── popup.js                   # 팝업 로직
├── content.js                 # 웹페이지 주입 스크립트
├── background.js              # 백그라운드 서비스
└── README.md                  # 프로젝트 문서
```

## 🏗️ 아키텍처

### 1. **Background Script** (`background.js`)

- 확장프로그램의 메인 서비스 워커
- Content Script와 Popup 간의 메시지 중계
- 웹페이지에 PASS 스크립트 주입 관리
- Navigator 객체 조작 (Android 환경 시뮬레이션)
- PASS 앱 함수들 구현 (`requestFreeJoin`, `requestCustomerInfo`, `requestCallOfficeSdk`, `requestWebviewFinish`)

### 2. **Content Script** (`content.js`)

- 웹페이지에 직접 주입되는 스크립트
- React 앱 로드 감지 및 헤더 UI 생성
- 팝업에서 설정 변경 시 메시지 수신
- Background Script에 PASS 스크립트 주입 요청

### 3. **Popup UI** (`popup.js`, `popup.html`, `popup.css`)

- 사용자 설정 인터페이스
- PASS 앱 통신 시뮬레이션 설정 (성공/오류/취소)
- 설정 저장 및 복원 기능
- Content Script에 설정 변경 알림

## 🔄 데이터 흐름

```
Popup → Background → Content → React App
   ↓        ↓         ↓         ↓
설정 변경 → 스크립트 주입 → 헤더 UI 생성 → PASS 앱 호출
```

## 🚀 설치 및 실행

1. **확장프로그램 로드**

   ```
   chrome://extensions/ → 개발자 모드 → 압축해제된 확장프로그램 로드
   ```

2. **React 앱 실행**

   ```bash
   npm start  # localhost:3000
   ```

3. **확장프로그램 활성화**
   - 팝업에서 PASS 앱 통신 시뮬레이션 설정
   - React 앱 새로고침

## 📱 지원 기능

### 플랫폼 시뮬레이션

- **Android 환경**: Navigator 객체를 Android 환경으로 설정
  - `navigator.platform = 'Linux armv8l'`
  - `navigator.userAgent` Android 기반으로 설정
  - `navigator.maxTouchPoints = 5`

### PASS 앱 통신 시뮬레이션

- `requestFreeJoin()` - 무료가입 요청 (성공/오류/취소 시뮬레이션)
- `requestCustomerInfo()` - 고객 정보 요청 (성공/오류/취소 시뮬레이션)
- `requestCallOfficeSdk()` - SDK 호출 (성공/오류/취소 시뮬레이션)
- `requestWebviewFinish()` - 웹뷰 종료 (성공/오류/취소 시뮬레이션)

### UI 기능

- React 앱 로드 감지 및 헤더 UI 자동 생성
- URL 경로에 따른 헤더 색상 및 텍스트 변경
- 팝업에서 실시간 시뮬레이션 설정 변경

## 🔧 개발 가이드

### 새로운 기능 추가

1. `background.js`에서 새로운 PASS 앱 함수 구현
2. `popup.html`에 시뮬레이션 설정 UI 추가
3. `popup.js`에서 설정 변경 이벤트 처리
4. `content.js`에서 필요시 헤더 UI 수정

### 디버깅

- Chrome DevTools → Console에서 로그 확인
- React 앱에서 `window.OfficeHelperKTPassCall` 객체 확인
- 팝업에서 시뮬레이션 설정 변경 후 콘솔 로그 확인

## 📋 변경 이력

### v1.0.0

- ✅ PASS 앱 웹뷰 시뮬레이션 기능 구현
- ✅ Android 환경 Navigator 객체 조작
- ✅ PASS 앱 통신 함수들 구현 (무료가입, 고객정보, SDK호출, 웹뷰종료)
- ✅ 팝업 UI를 통한 시뮬레이션 설정 관리
- ✅ React 앱 로드 감지 및 헤더 UI 자동 생성
- ✅ 실시간 설정 변경 및 스크립트 재주입
