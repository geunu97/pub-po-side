/** pop.js
 * popup.html과 상호작용
 * 로컬 스토리지에서 데이터 불러오는 역할
 */

/* 분 단위의 시간을 '00시간 00분' 형식의 문자열로 변환 */
const convertMinutesToTime = (minutes) => {
  const absMinutes = Math.abs(minutes);
  const hours = Math.floor(absMinutes / 60);
  const remainingMinutes = absMinutes % 60;
  const sign = minutes < 0 ? "-" : "+";
  return `${sign}${String(hours).padStart(2, "0")}시간 ${String(
    remainingMinutes
  ).padStart(2, "0")}분`;
};

/* Popup이 열릴 때 로컬 스토리지에서 데이터 불러오기 */
chrome.storage.local.get("data", (result) => {
  if (result.data) {
    const { mileage } = result.data;
    const mileageFormatted = convertMinutesToTime(mileage);
    const month = new Date().getMonth() + 1;

    // 데이터를 popup.html의 요소에 삽입
    document.getElementById(
      "result"
    ).innerText = `${month}월 마일리지: ${mileageFormatted}`;
  } else {
    document.getElementById("result").innerText = "데이터 없음";
  }
});
