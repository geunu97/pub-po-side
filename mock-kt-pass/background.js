// Background Script - 웹페이지에 스크립트 주입 담당

// 상수 정의
const MESSAGE_TYPES = {
  INJECT_PASS_SCRIPT: 'INJECT_PASS_SCRIPT',
  SET_STATUS: 'SET_STATUS'
};

// PASS 스크립트 주입 함수
function injectPassScript(simulatorSettings = {}) {
  try {
    // Navigator 설정 함수
    function configureNavigator() {
      try {
        const USER_AGENT = 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36;PASS';
        
        const NAVIGATOR_CONFIG = {
          platform: 'Linux armv8l',
          vendor: 'Google Inc.',
          maxTouchPoints: 5,
          appVersion: '5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
        };
        
        // userAgent 설정
        Object.defineProperty(navigator, 'userAgent', {
          get: () => USER_AGENT,
          configurable: true
        });
        
        // platform 설정
        Object.defineProperty(navigator, 'platform', {
          get: () => NAVIGATOR_CONFIG.platform,
          configurable: true
        });
        
        // vendor 설정
        Object.defineProperty(navigator, 'vendor', {
          get: () => NAVIGATOR_CONFIG.vendor,
          configurable: true
        });
        
        // maxTouchPoints 설정
        Object.defineProperty(navigator, 'maxTouchPoints', {
          get: () => NAVIGATOR_CONFIG.maxTouchPoints,
          configurable: true
        });
        
        // appVersion 설정
        Object.defineProperty(navigator, 'appVersion', {
          get: () => NAVIGATOR_CONFIG.appVersion,
          configurable: true
        });
        
        console.log('✅ Navigator 설정 완료: android');
        
      } catch (e) {
        console.error('❌ Navigator 조작 실패:', e);
      }
    }
    
    // Android PASS 앱 함수들 (내부에 정의)
    function handleRequestFreeJoin() {
      console.log('[Android PASS앱 호출] requestFreeJoin()');
      console.log('[규격] 4.9 오피스도우미 무료가입 요청');
      console.log('[Web → App] 요청 전송');
      
      // 전달받은 simulatorSettings에서 응답 타입 확인
      const responseType = simulatorSettings?.freeJoinResponse || 'success';
      
      if (responseType === 'cancel') {
        console.log('❌ [Android PASS앱 취소] - 응답 없음');
        return; // 취소일 때는 응답하지 않음
      }
      
      const isSuccess = responseType === 'success';
      if (isSuccess) {
          const data = {
            success: true,
            data: {
              joinType: 10,
              steps: [
                {
                  step: '2. KT 암호화',
                  result: {
                    encryptedPassAppId: 'mock-pass-app-id-1234',
                    encryptedPhoneNo: '01012345678',
                    encryptedUserNm: '홍길동',
                    encryptedBirthday: '19900101',
                    encryptedGender: 'M'
                  }
                },
                {
                  step: '3. KT 토큰 발급',
                  result: {
                    token: 'mock-kt-token-abcdefg'
                  }
                },
                {
                  step: '4. SDK 회원가입',
                  request: {
                    appVersion: '1.0.0',
                    OS: 'iOS',
                    model: 'iPhone15,2',
                    terms: [
                      { termID: 'TOS', termYn: 'Y' },
                      { termID: 'PRIVACY', termYn: 'Y' }
                    ]
                  }
                }
              ]
            }
          };

          if (data && data.success && data.data && data.data.steps) {
            const joinType = data.data.joinType;

            const ktEncryptionStep = data.data.steps.find(step => step.step === '2. KT 암호화');
            const encryptedPassAppId = ktEncryptionStep?.result?.encryptedPassAppId;
            const phoneNo = ktEncryptionStep?.result?.encryptedPhoneNo;
            const userNm = ktEncryptionStep?.result?.encryptedUserNm;
            const birthday = ktEncryptionStep?.result?.encryptedBirthday;
            const gender = ktEncryptionStep?.result?.encryptedGender;

            const ktTokenStep = data.data.steps.find(step => step.step === '3. KT 토큰 발급');
            const token = ktTokenStep?.result?.token;

            const sdkJoinStep = data.data.steps.find(step => step.step === '4. SDK 회원가입');
            const appVersion = sdkJoinStep?.request?.appVersion;
            const OS = sdkJoinStep?.request?.OS;
            const model = sdkJoinStep?.request?.model;
            const telecomType = 'KT';
            const terms = sdkJoinStep?.request?.terms?.map(term => { return { termsCode: term.termID, termsVersion: term.termID, termsYn: term.termYn } });

            const responseData = {
              method: 'receiveFreeJoin',
              isSuccess: true,
              passAppId: encryptedPassAppId,
              token: token,
              phoneNo: phoneNo,
              joinType: joinType,
              userNm: userNm,
              birthday: birthday,
              gender: gender,
              appVersion: appVersion,
              OS: OS,
              model: model,
              telecomType: telecomType,
              terms: terms
            };

            if (typeof window.receiveFreeJoin === 'function') {
              console.log('✅ [Android PASS앱 성공 응답]');
              console.log('📤 App → Web: 성공 응답 전송');
              window.receiveFreeJoin(
                responseData.isSuccess,
                responseData.passAppId,
                responseData.token
              );
            } else {
              console.log('⚠️ window.receiveFreeJoin 함수가 정의되지 않음');
            }
          }
        } else {
        console.log('📤 App → Web: 실패 응답 전송');
        if (typeof window.receiveFreeJoin === 'function') {
          window.receiveFreeJoin(
            false, 
            null, 
            null
          );
        } else {
          console.log('⚠️ window.receiveFreeJoin 함수가 정의되지 않음');
        }
      }
    }
    
    function handleRequestCustomerInfo() {
      console.log('[iOS PASS앱 호출] requestCustomerInfo()');
      console.log('[규격] 4.10 고객 정보 요청');
      console.log('[Web → App] 요청 전송');
      
      // 전달받은 simulatorSettings에서 응답 타입 확인
      const responseType = simulatorSettings?.customerInfoResponse || 'success';
      
      setTimeout(() => {
        if (responseType === 'cancel') {
          console.log('❌ [Android PASS앱 취소] - 응답 없음');
          return; // 취소일 때는 응답하지 않음
        }
        
        const isSuccess = responseType === 'success';
        if (isSuccess) {
          const responseData = {
            method: 'receiveCustomerInfo',
            isSuccess: isSuccess,
            joinType: isSuccess ? '00' : null,
            passAppId: isSuccess ? 'fido.sw.asm.api' : null,
            phoneNo: isSuccess ? '01012345678' : null,
            userNm: isSuccess ? '홍길동' : null,
            birthday: isSuccess ? '19900101' : null,
            gender: isSuccess ? 'M' : null,
            termsList: isSuccess ? [
              {"termsVersion":"1.00","termsYn":"Y","termsCode":"service"},
              {"termsVersion":"1.00","termsYn":"N","termsCode":"personal"}
            ] : null
          };

          if (typeof window.receiveCustomerInfo === 'function') {
            window.receiveCustomerInfo(
              responseData.isSuccess,
              responseData.joinType,
              responseData.passAppId,
              responseData.phoneNo,
              responseData.userNm,
              responseData.birthday,
              responseData.gender,
              responseData.termsList
            );
          } else {
            console.log('⚠️ window.receiveCustomerInfo 함수가 정의되지 않음');
          }
        } else {
          console.log('📤 App → Web: 실패 응답 전송');
          if (typeof window.receiveCustomerInfo === 'function') {
            window.receiveCustomerInfo(
              false, 
              null, 
              null,
              null,
              null,
              null,
              null,
              null
            );
          } else {
            console.log('⚠️ window.receiveFreeJoin 함수가 정의되지 않음');
          }
        }
      }, 1000);
    }
    
    function handleRequestCallOfficeSdk() {
      console.log('[Android PASS앱 호출] requestCallOfficeSdk()');
      console.log('[규격] 4.11 오피스도우미 SDK 호출');
      console.log('[Web → App] 요청 전송');
      
      // 전달받은 simulatorSettings에서 응답 타입 확인
      const responseType = simulatorSettings?.sdkCallResponse || 'success';
      
      setTimeout(() => {
        if (responseType === 'cancel') {
          console.log('❌ [Android PASS앱 취소] - 응답 없음');
          return; // 취소일 때는 응답하지 않음
        }
        
        const isSuccess = responseType === 'success';
        if (isSuccess) {
          const responseData = {
            method: 'receiveCallOfficeSdk',
            isSuccess: isSuccess,
            passAppId: isSuccess ? 'fido.sw.asm.api' : null,
            appVersion: isSuccess ? '02.01.41' : null,
            OS: isSuccess ? 'Android' : null,
            model: isSuccess ? 'Galaxy24' : null,
            joinType: isSuccess ? '00' : null,
            token: isSuccess ? 'XE9RwH6E0IDgss3x60uruQGta456Y1h6LPQWE/UM5M5GevQx+GjurzSvzcibP04PDJ3scjSOYBLbHBoOHj8u9A1ZjynyqYZmdrU6r7UvIdzX6LYMZJlJZFv2PKg8VbQ+K+AqkYot0Xwe0MQSG9WM0e6RZOQA4v4kKoV+fDaG2y0SxeJ0NTdpL+PFI4VlwP9c' : null
          };

          if (typeof window.receiveCallOfficeSdk === 'function') {
            window.receiveCallOfficeSdk(
              responseData.isSuccess,
              responseData.passAppId,
              responseData.appVersion,
              responseData.OS,
              responseData.model,
              responseData.joinType,
              responseData.token
            );
          } else {
            console.log('⚠️ window.receiveCallOfficeSdk 함수가 정의되지 않음');
          }
        } else {
          console.log('📤 App → Web: 실패 응답 전송');
          if (typeof window.receiveCallOfficeSdk === 'function') {
            window.receiveCallOfficeSdk(
              false, 
              null, 
              null,
              null,
              null,
              null,
              null
            );
          } else {
            console.log('⚠️ window.receiveCallOfficeSdk 함수가 정의되지 않음');
          }
        } 
      }, 1000);
    }
    
    function handleRequestWebviewFinish() {
       console.log('[Android PASS앱 호출] requestWebviewFinish()');
       console.log('[규격] 4.12 웹뷰 종료 요청');
       console.log('[Web → App] 요청 전송');
       
       // 전달받은 simulatorSettings에서 응답 타입 확인
       const responseType = simulatorSettings?.webviewFinishResponse || 'success';
       
       setTimeout(() => {
         if (responseType === 'cancel') {
           console.log('❌ [Android PASS앱 취소] - 응답 없음');
           return; // 취소일 때는 응답하지 않음
         }
         
         const isSuccess = responseType === 'success';
         if (isSuccess) {
          alert('무료가입성공');
         } else {
          alert('무료가입실패');
         }
       }, 500);
     }
    
    // OfficeHelperKTPassCall 객체 생성 함수
    function createOfficeHelperKTPassCall() {
      window.OfficeHelperKTPassCall = {                  
        requestFreeJoin: function() {
          handleRequestFreeJoin();
        },
        
        requestCustomerInfo: function() {
          handleRequestCustomerInfo();
        },
        
        requestCallOfficeSdk: function() {
          handleRequestCallOfficeSdk();
        },
        
        requestWebviewFinish: function() {
          handleRequestWebviewFinish();
        }
      };
      console.log('🔒 OfficeHelperKTPassCall이 웹페이지 window에 주입됨');
    }    

    // Navigator 설정
    configureNavigator();
    
    // OfficeHelperKTPassCall 객체 생성
    createOfficeHelperKTPassCall();

    console.log('✅ PASS 스크립트 INJECTION 완료');
  } catch (error) {
    console.error('❌ PASS 스크립트 INJECTION 실패:', error);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // content.js로부터 PASS 스크립트 INJECTION 요청 받음
  if (message.type === MESSAGE_TYPES.INJECT_PASS_SCRIPT) {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        try {          
          chrome.storage.local.get(['simulatorSettings'], (data) => {
            const simulatorSettings = data.simulatorSettings || {};
            
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              world: "MAIN",
              func: injectPassScript,
              args: [simulatorSettings]
            }).then(() => {
              sendResponse({ success: true });
            }).catch((error) => {
              sendResponse({ success: false, error: error.message });
            });
          });
          
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
      } else {
        sendResponse({ success: false, error: 'No active tab found' });
      }
    });
    
    return true;
  }
}); 