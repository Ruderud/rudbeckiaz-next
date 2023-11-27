const calcTimeDiff = (isoDateString: string | undefined) => {
  if (!isoDateString) return 'unknown';
  // 주어진 날짜 문자열을 Date 객체로 변환
  const isoDate = new Date(isoDateString);

  // 현재 시간을 가져오기
  const currentDate = new Date();

  // 두 날짜 사이의 시간 차이(밀리초) 계산
  const timeDifference = currentDate.getTime() - isoDate.getTime();

  // 시간 차이를 초, 분, 시간, 일로 변환
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds}초 전`;
  } else if (minutes < 60) {
    return `${minutes}분 전`;
  } else if (hours < 24) {
    return `${hours}시간 전`;
  } else {
    // 날짜를 YYYY-MM-DD 형식으로 포맷팅
    const year = isoDate.getFullYear();
    const month = String(isoDate.getMonth() + 1).padStart(2, '0');
    const day = String(isoDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
};

export default calcTimeDiff;
