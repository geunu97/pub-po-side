/** contentscript.js
 * 사용자가 방문하는 페이지의 DOM을 읽어와서 작동하는 스크립트
 * serviceworker.js로 데이터 전송
 */

/* 문자열 형식(00시간 00분)의 시간을 분으로 변환 */
const parseTimeToMinutes = (timeString) => {
  const timePattern = /(\d+)\s*시간\s*(\d+)\s*분/;
  const match = timeString.match(timePattern);

  if (match) {
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    return hours * 60 + minutes;
  }
  return 0;
};

/* DOM에서 데이터를 추출하여 분 단위로 변환 */
const extractAndSendData = () => {
  const infoSpan = document.querySelector(".list-view-wrap > span");
  const rows = document.querySelectorAll(".monthlyTable tbody tr");

  const firstRowCells = rows.length > 0 ? rows[0].querySelectorAll("td") : [];
  const secondRowCells = rows.length > 1 ? rows[1].querySelectorAll("td") : [];

  const monthlyRequiredHours =
    firstRowCells.length > 1 ? firstRowCells[1].textContent.trim() : null;
  const currentMonthlyHours =
    secondRowCells.length > 1 ? secondRowCells[1].textContent.trim() : null;

  if (infoSpan || (monthlyRequiredHours && currentMonthlyHours)) {
    clearInterval(checkInterval);

    const infoText = infoSpan ? infoSpan.textContent : "";
    const remainingDaysPattern = /잔여 영업일 (\d+)일/;

    const remainingDaysMatch = infoText.match(remainingDaysPattern);

    const remainingDays = remainingDaysMatch
      ? parseInt(remainingDaysMatch[1], 10)
      : 0;

    const monthlyRequiredMinutes = monthlyRequiredHours
      ? parseTimeToMinutes(monthlyRequiredHours)
      : 0;
    const currentMonthlyMinutes = currentMonthlyHours
      ? parseTimeToMinutes(currentMonthlyHours)
      : 0;

    // 필요한 시간 = 일 평균 근로시간 * 잔여 영업일
    const totalRequiredMinutes = 480 * remainingDays;
    // 부족한 시간 = 월 필수 근로시간 - 현재 소정 근로시간
    const deficitMinutes = monthlyRequiredMinutes - currentMonthlyMinutes;

    const data = {
      mileage: totalRequiredMinutes - deficitMinutes,
    };

    // Service Worker로 데이터 전송
    chrome.runtime.sendMessage({
      type: "data",
      data: data,
    });
  }
};

/* 1초마다 DOM을 체크 */
const checkInterval = setInterval(extractAndSendData, 1000);
