/** serviceworker.js
 * 백그라운드에서 동작
 * contentscript.js에서 데이터를 받아서, popup.js로 전달하는 역할
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "data") {
    chrome.storage.local.get("data", (result) => {
      if (result.data) {
        // 기존 데이터가 있을 경우 제거
        chrome.storage.local.remove("data", () => {
          console.log("Previous data removed from storage");

          // 새 데이터를 로컬 스토리지에 저장
          chrome.storage.local.set({ data: request.data }, () => {
            console.log("New data saved to storage");
          });
        });
      } else {
        // 기존 데이터가 없을 경우 바로 새 데이터를 저장
        chrome.storage.local.set({ data: request.data }, () => {
          console.log("New data saved to storage");
        });
      }
    });
  }
});
