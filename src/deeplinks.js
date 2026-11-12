/**
 * 딥링크 메타서치 엔진 (JapanFly)
 * 사용자 검색 조건 → 각 플랫폼의 실시간 검색 URL로 자동 변환
 */

// 날짜 포맷 헬퍼: "2026-11-20" → "20261120"
const toYYYYMMDD = (dateStr) => dateStr.replace(/-/g, '');

// 날짜 포맷 헬퍼: "2026-11-20" → "261120" (스카이스캐너 형식 YYMMDD)
const toYYMMDD = (dateStr) => {
  const parts = dateStr.split('-');
  return parts[0].slice(2) + parts[1] + parts[2];
};

// IATA 코드 → 스카이스캐너 소문자 코드 변환
const toLower = (code) => code.toLowerCase();

/**
 * 플랫폼별 딥링크 URL 생성 함수
 * @param {object} params - { origin, destination, departDate, returnDate, passengers, cabinClass, tripType }
 * @returns {object} - 각 플랫폼의 URL { naver, skyscanner, tripdotcom, google }
 */
export function generateDeepLinks({ origin, destination, departDate, returnDate, passengers, cabinClass, tripType }) {
  const depYYYYMMDD = toYYYYMMDD(departDate);
  const retYYYYMMDD = toYYYYMMDD(returnDate);
  const depYYMMDD   = toYYMMDD(departDate);
  const retYYMMDD   = toYYMMDD(returnDate);
  const isRound     = tripType === 'round';
  const cabin       = cabinClass === 'business' ? 'C' : 'Y'; // Y=이코노미, C=비즈니스
  const adult       = passengers;

  // ----------------------------------------------------------------
  // 1. 네이버 항공권
  //    왕복: https://flight.naver.com/flights/international/ICN-NRT-20261120/NRT-ICN-20261123?adult=1&fareType=Y
  //    편도: https://flight.naver.com/flights/international/ICN-NRT-20261120?adult=1&fareType=Y
  // ----------------------------------------------------------------
  const naverBase = 'https://flight.naver.com/flights/international';
  const naverRoute = isRound
    ? `${origin}-${destination}-${depYYYYMMDD}/${destination}-${origin}-${retYYYYMMDD}`
    : `${origin}-${destination}-${depYYYYMMDD}`;
  const naver = `${naverBase}/${naverRoute}?adult=${adult}&fareType=${cabin}`;

  // ----------------------------------------------------------------
  // 2. 스카이스캐너
  //    왕복: https://www.skyscanner.co.kr/transport/flights/icn/nrt/261120/261123/?adults=1&cabinclass=economy
  //    편도: https://www.skyscanner.co.kr/transport/flights/icn/nrt/261120/?adults=1
  // ----------------------------------------------------------------
  const skcBase = 'https://www.skyscanner.co.kr/transport/flights';
  const skcCabin = cabinClass === 'business' ? 'business' : 'economy';
  const skyscanner = isRound
    ? `${skcBase}/${toLower(origin)}/${toLower(destination)}/${depYYMMDD}/${retYYMMDD}/?adults=${adult}&cabinclass=${skcCabin}&currency=KRW`
    : `${skcBase}/${toLower(origin)}/${toLower(destination)}/${depYYMMDD}/?adults=${adult}&cabinclass=${skcCabin}&currency=KRW`;

  // ----------------------------------------------------------------
  // 3. 트립닷컴 (kr.trip.com)
  //    https://kr.trip.com/flights/seoul-icn-to-tokyo-nrt/tickets-icn-nrt?dcity=ICN&acity=NRT&ddate=2026-11-20&rdate=2026-11-23&flightWay=OW&class=Y&adult=1
  //    flightWay: RT=왕복, OW=편도
  // ----------------------------------------------------------------
  const tripBase = 'https://kr.trip.com/flights';
  const originCityMap = { ICN: 'seoul', GMP: 'seoul', PUS: 'busan', TAE: 'daegu', CJJ: 'cheongju', CJU: 'jeju' };
  const destCityMap   = { NRT: 'tokyo', HND: 'tokyo', KIX: 'osaka', FUK: 'fukuoka', CTS: 'sapporo', OKA: 'okinawa', NGO: 'nagoya' };
  const oCity = originCityMap[origin] || origin.toLowerCase();
  const dCity = destCityMap[destination] || destination.toLowerCase();
  const tripWay = isRound ? 'RT' : 'OW';
  const tripCabin = cabinClass === 'business' ? 'C' : 'Y';
  let tripdotcom = `${tripBase}/${oCity}-${origin.toLowerCase()}-to-${dCity}-${destination.toLowerCase()}/tickets-${origin.toLowerCase()}-${destination.toLowerCase()}?dcity=${origin}&acity=${destination}&ddate=${departDate}&flightWay=${tripWay}&class=${tripCabin}&adult=${adult}&curr=KRW`;
  if (isRound) tripdotcom += `&rdate=${returnDate}`;

  // ----------------------------------------------------------------
  // 4. 구글 플라이트
  //    https://www.google.com/travel/flights/search?tfs=...
  //    구글은 URL이 복잡하므로 검색 쿼리로 대신 연결 (가장 안정적인 방법)
  //    https://www.google.com/travel/flights?q=Flights+from+ICN+to+NRT+on+2026-11-20
  // ----------------------------------------------------------------
  const originAirportName = { ICN: 'Incheon', GMP: 'Gimpo', PUS: 'Gimhae', TAE: 'Daegu', CJJ: 'Cheongju', CJU: 'Jeju' };
  const destAirportName   = { NRT: 'Narita', HND: 'Haneda', KIX: 'Kansai', FUK: 'Fukuoka', CTS: 'Chitose', OKA: 'Naha', NGO: 'Chubu' };
  const oName = originAirportName[origin] || origin;
  const dName = destAirportName[destination] || destination;
  const googleQuery = isRound
    ? `Flights from ${oName} to ${dName} on ${departDate} return ${returnDate}`
    : `Flights from ${oName} to ${dName} on ${departDate}`;
  const google = `https://www.google.com/travel/flights?q=${encodeURIComponent(googleQuery)}&curr=KRW&hl=ko`;

  return { naver, skyscanner, tripdotcom, google };
}

/**
 * 항공권 카드 1개에 대한 단일 딥링크 URL 목록 생성
 * (특정 항공사 직접 예약 페이지 연결)
 * @param {object} flight - 항공권 객체
 * @param {object} state  - 현재 검색 상태
 */
export function generateFlightCardLinks(flight, state) {
  const links = generateDeepLinks(state);

  // 항공사 공식 홈페이지 (실제 항공사 직판 홈페이지)
  const airlineOfficialMap = {
    KE:  'https://www.koreanair.com/kr/ko/flights',
    OZ:  'https://www.flyasiana.com/C/KR/KO/deal/today-deal',
    '7C':'https://www.jejuair.net/ko/main/base/main.do',
    LJ:  'https://fly.jinair.com/HM/HM001P00',
    TW:  'https://www.twayair.com/app/main',
    BX:  'https://www.airbusan.com/ab/main',
    RS:  'https://www.airseoul.com/main',
    MM:  'https://www.flypeach.com/kr/ko',
    NH:  'https://www.ana.co.jp/ko/kr/',
    JL:  'https://www.jal.co.jp/kr/ko/'
  };

  return {
    ...links,
    airline: airlineOfficialMap[flight.airline] || links.naver
  };
}
