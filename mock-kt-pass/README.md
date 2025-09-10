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
├── api.js                     # API 호출 관리
├── utils/
│   ├── constants.js           # 상수 정의
│   └── navigator-manipulator.js # Navigator 조작 로직
└── services/
    └── pass-script-injector.js # PASS 스크립트 주입 서비스
```

## 🏗️ 아키텍처

### 1. **Background Script** (`background.js`)
- 확장프로그램의 메인 서비스 워커
- Content Script와 Popup 간의 메시지 중계
- 웹페이지에 스크립트 주입 관리

### 2. **Content Script** (`content.js`)
- 웹페이지에 직접 주입되는 스크립트
- Navigator 객체 조작
- React 앱 로드 감지 및 UI 생성

### 3. **Popup UI** (`popup.js`, `popup.html`)
- 사용자 설정 인터페이스
- 플랫폼 선택 (Android/iOS)
- 시뮬레이터 설정 관리
- API 테스트 기능

### 4. **Utils** (`utils/`)
- **constants.js**: 상수 정의 (플랫폼, 메시지 타입 등)
- **navigator-manipulator.js**: Navigator 객체 조작 로직

### 5. **API Manager** (`api.js`)
- **fetch 기반 API 호출 관리 (userInfo 관련 기능 제거됨)**

### 6. **Services** (`services/`)
- **pass-script-injector.js**: PASS 스크립트 주입 및 관리

## 🔄 데이터 흐름

```
Popup → Background → Content → React App
   ↓        ↓         ↓         ↓
설정 변경 → 메시지 전달 → Navigator 조작 → PASS 앱 호출
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
   - 팝업에서 플랫폼 선택 (Android/iOS)
   - React 앱 새로고침

## 📱 지원 기능

### 플랫폼 시뮬레이션
- **Android**: `navigator.platform = 'Linux armv8l'`
- **iOS**: `navigator.platform = 'iPhone'`

### PASS 앱 통신
- `requestFreeJoin()` - 무료가입 요청
- `requestCustomerInfo()` - 고객 정보 요청
- `requestCallOfficeSdk()` - SDK 호출
- `requestWebviewFinish()` - 웹뷰 종료

### API 호출 기능
_(userInfo 관련 기능은 제거되었습니다)_

## 🔧 개발 가이드

### 새로운 기능 추가
1. `utils/constants.js`에 상수 추가
2. `services/`에 관련 로직 추가
3. `background.js`에서 메시지 처리
4. `popup.js`에서 UI 업데이트

### 디버깅
- Chrome DevTools → Console에서 로그 확인
- React 앱에서 `window.OfficeHelperKTPassCall` 객체 확인

## 📋 변경 이력

### v1.1.0
- ✅ fetch 기반 API Manager 추가
- ✅ axios와 동일한 기능의 API 호출 로직
- ✅ 팝업에 API 테스트 기능 추가 (현재 userInfo 관련 기능 제거됨)

### v1.0.0
- ✅ 모듈화된 파일 구조
- ✅ 역할별 코드 분리
- ✅ Android/iOS 플랫폼 지원
- ✅ React 앱 통합
- ✅ 실시간 상태 모니터링