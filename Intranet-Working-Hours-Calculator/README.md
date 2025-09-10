# Intranet Working Hours Calculator

Polaris Office 인트라넷의 월별 근무시간 정보를 자동으로 계산하고 표시하는 Chrome 확장프로그램입니다.

## 📁 파일 구조

```
Intranet-Working-Hours-Calculator/
├── manifest.json              # 확장프로그램 설정
├── popup.html                 # 팝업 UI
├── popup.css                  # 팝업 스타일
├── popup.js                   # 팝업 로직
├── contentscript.js           # 웹페이지 주입 스크립트
├── serviceworker.js           # 백그라운드 서비스 워커
├── Polaris_Office_logo.png    # 확장프로그램 아이콘
├── refresh.png                # 새로고침 아이콘
└── README.md                  # 프로젝트 문서
```

## 🏗️ 아키텍처

### 1. **Content Script** (`contentscript.js`)

- Polaris Office 인트라넷 페이지의 DOM을 모니터링
- 월별 근무시간 테이블에서 데이터 추출
- 잔여 영업일, 월 필수 근로시간, 현재 소정 근로시간 계산
- Service Worker로 계산된 데이터 전송

### 2. **Service Worker** (`serviceworker.js`)

- Content Script에서 받은 데이터를 로컬 스토리지에 저장
- 데이터 업데이트 시 기존 데이터 교체
- Popup과 Content Script 간의 데이터 중계 역할

### 3. **Popup UI** (`popup.js`, `popup.html`, `popup.css`)

- 로컬 스토리지에서 데이터를 불러와 표시
- 현재 월의 마일리지(부족/초과 시간) 표시
- Polaris Office 인트라넷으로 이동하는 링크 제공
- 그라데이션 텍스트 애니메이션 효과

## 🔄 데이터 흐름

```
Polaris Office 인트라넷 → Content Script → Service Worker → Local Storage → Popup UI
        ↓                    ↓                ↓              ↓           ↓
   DOM 모니터링          데이터 추출      데이터 저장    데이터 조회   결과 표시
```

## 🚀 설치 및 실행

1. **확장프로그램 로드**

   ```
   chrome://extensions/ → 개발자 모드 → 압축해제된 확장프로그램 로드
   ```

2. **Polaris Office 인트라넷 접속**

   ```
   https://www.polarisoffice.net/#!/monthlyWorkInfo
   ```

3. **확장프로그램 사용**
   - 인트라넷 페이지에서 자동으로 데이터 수집
   - 확장프로그램 아이콘 클릭하여 결과 확인

## 📱 지원 기능

### 자동 데이터 수집

- 월별 근무시간 테이블 자동 감지
- 잔여 영업일 정보 추출
- 월 필수 근로시간 및 현재 소정 근로시간 계산

### 마일리지 계산

- **마일리지 = (일 평균 근로시간 × 잔여 영업일) - (월 필수 근로시간 - 현재 소정 근로시간)**
- 부족한 시간은 음수(-), 초과한 시간은 양수(+)로 표시
- '00시간 00분' 형식으로 직관적 표시

### UI 기능

- 그라데이션 텍스트 애니메이션
- 새로고침 아이콘 호버 효과
- Polaris Office 인트라넷으로 바로 이동하는 링크

## 🔧 개발 가이드

### 새로운 기능 추가

1. `contentscript.js`에서 DOM 선택자 수정
2. `popup.js`에서 데이터 표시 로직 수정
3. `popup.css`에서 UI 스타일 조정

### 디버깅

- Chrome DevTools → Console에서 로그 확인
- Content Script의 DOM 선택자 확인
- Service Worker의 데이터 저장/조회 로그 확인

## 📋 계산 로직

### 데이터 추출

- `.list-view-wrap > span`: 잔여 영업일 정보
- `.monthlyTable tbody tr`: 월별 근무시간 테이블
- 첫 번째 행: 월 필수 근로시간
- 두 번째 행: 현재 소정 근로시간

### 마일리지 공식

```
마일리지 = (480분 × 잔여영업일) - (월필수근로시간 - 현재소정근로시간)
```

- **480분**: 일 평균 근로시간 (8시간)
- **잔여영업일**: 남은 근무일 수
- **월필수근로시간**: 해당 월에 근무해야 하는 총 시간
- **현재소정근로시간**: 현재까지 근무한 시간

## 📋 변경 이력

### v1.0.0

- ✅ Polaris Office 인트라넷 자동 데이터 수집
- ✅ 월별 근무시간 마일리지 계산
- ✅ 실시간 데이터 업데이트
- ✅ 직관적인 UI 및 애니메이션 효과
- ✅ 로컬 스토리지를 통한 데이터 관리
