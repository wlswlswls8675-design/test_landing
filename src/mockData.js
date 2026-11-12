// Flight Data & Mock Database for Japan Flights
export const AIRPORTS = {
  origins: [
    { code: 'ICN', name: '서울/인천', city: '인천', country: 'KR' },
    { code: 'GMP', name: '서울/김포', city: '서울', country: 'KR' },
    { code: 'PUS', name: '부산/김해', city: '부산', country: 'KR' },
    { code: 'TAE', name: '대구', city: '대구', country: 'KR' },
    { code: 'CJJ', name: '청주', city: '청주', country: 'KR' },
    { code: 'CJU', name: '제주', city: '제주', country: 'KR' }
  ],
  destinations: [
    { code: 'NRT', name: '도쿄/나리타', city: '도쿄', desc: '쇼핑과 미식의 심장부', minPrice: 195000, tag: '인기 1위', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80' },
    { code: 'HND', name: '도쿄/하네다', city: '도쿄', desc: '도심 접근성 최고', minPrice: 285000, tag: '시내 직결', image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=600&q=80' },
    { code: 'KIX', name: '오사카/간사이', city: '오사카', desc: '식도락과 USJ의 성지', minPrice: 168000, tag: '특가 多', image: 'https://images.unsplash.com/photo-1590559899731-a3f37b9d7501?auto=format&fit=crop&w=600&q=80' },
    { code: 'FUK', name: '후쿠오카', city: '후쿠오카', desc: '1시간대 부담없는 힐링', minPrice: 112000, tag: '초근거리', image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=600&q=80' },
    { code: 'CTS', name: '삿포로/신치토세', city: '삿포로', desc: '환상적인 설경 & 미식', minPrice: 245000, tag: '겨울 인기', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80' },
    { code: 'OKA', name: '오키나와/나하', city: '오키나와', desc: '동양의 하와이 휴양지', minPrice: 215000, tag: '에메랄드빛', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
    { code: 'NGO', name: '나고야/주부', city: '나고야', desc: '지브리 파크 & 레고랜드', minPrice: 189000, tag: '테마파크', image: 'https://images.unsplash.com/photo-1624896706059-a29e469c878b?auto=format&fit=crop&w=600&q=80' }
  ]
};

export const AIRLINES = {
  KE: { name: '대한항공', logo: '✈️', fullService: true, color: '#005bac' },
  OZ: { name: '아시아나항공', logo: '✈️', fullService: true, color: '#d81920' },
  '7C': { name: '제주항공', logo: '🍊', fullService: false, color: '#ff6600' },
  LJ: { name: '진에어', logo: '🦋', fullService: false, color: '#00a887' },
  TW: { name: '티웨이항공', logo: '🔴', fullService: false, color: '#d71920' },
  BX: { name: '에어부산', logo: '🌊', fullService: false, color: '#002f6c' },
  RS: { name: '에어서울', logo: '🌱', fullService: false, color: '#43b02a' },
  MM: { name: '피치항공', logo: '🍑', fullService: false, color: '#df007a' },
  NH: { name: 'ANA(전일본공수)', logo: '🇯🇵', fullService: true, color: '#103893' },
  JL: { name: '일본항공(JAL)', logo: '🇯🇵', fullService: true, color: '#cb0c24' }
};

export const OTAS = [
  { name: '트립닷컴', badge: '최저가 보장', discount: 0 },
  { name: '공식 항공사', badge: '마일리지 적립', discount: 5000 },
  { name: '아고다', badge: '즉시할인쿠폰', discount: 3000 },
  { name: '마이리얼트립', badge: '투어 5% 쿠폰팩', discount: 2000 },
  { name: '하나투어', badge: '카드사 결제할인', discount: 4000 }
];

export const MOCK_FLIGHT_TEMPLATES = [
  {
    origin: 'ICN',
    dest: 'NRT',
    airline: '7C',
    flightNum: '7C1102',
    depTime: '07:40',
    arrTime: '10:10',
    duration: '2시간 30분',
    basePrice: 198000,
    baggage: '위탁수하물 15kg 포함',
    baggageIncluded: true,
    seatsLeft: 3,
    stops: 0
  },
  {
    origin: 'ICN',
    dest: 'NRT',
    airline: 'LJ',
    flightNum: 'LJ201',
    depTime: '08:25',
    arrTime: '10:55',
    duration: '2시간 30분',
    basePrice: 205000,
    baggage: '위탁수하물 15kg 포함',
    baggageIncluded: true,
    seatsLeft: 7,
    stops: 0
  },
  {
    origin: 'ICN',
    dest: 'NRT',
    airline: 'TW',
    flightNum: 'TW201',
    depTime: '11:15',
    arrTime: '13:45',
    duration: '2시간 30분',
    basePrice: 185000,
    baggage: '기내수하물 10kg만 포함 (위탁 미포함)',
    baggageIncluded: false,
    seatsLeft: 2,
    stops: 0
  },
  {
    origin: 'ICN',
    dest: 'NRT',
    airline: 'KE',
    flightNum: 'KE703',
    depTime: '10:10',
    arrTime: '12:35',
    duration: '2시간 25분',
    basePrice: 342000,
    baggage: '위탁수하물 23kg + 기내식 제공',
    baggageIncluded: true,
    seatsLeft: 9,
    stops: 0
  },
  {
    origin: 'ICN',
    dest: 'NRT',
    airline: 'OZ',
    flightNum: 'OZ102',
    depTime: '09:00',
    arrTime: '11:20',
    duration: '2시간 20분',
    basePrice: 338000,
    baggage: '위탁수하물 23kg + 기내식 제공',
    baggageIncluded: true,
    seatsLeft: 5,
    stops: 0
  },
  {
    origin: 'GMP',
    dest: 'HND',
    airline: 'KE',
    flightNum: 'KE2101',
    depTime: '09:00',
    arrTime: '11:10',
    duration: '2시간 10분',
    basePrice: 389000,
    baggage: '위탁수하물 23kg + 기내식',
    baggageIncluded: true,
    seatsLeft: 4,
    stops: 0
  },
  {
    origin: 'GMP',
    dest: 'HND',
    airline: 'JL',
    flightNum: 'JL092',
    depTime: '12:05',
    arrTime: '14:15',
    duration: '2시간 10분',
    basePrice: 395000,
    baggage: '위탁수하물 23kg 2개 제공',
    baggageIncluded: true,
    seatsLeft: 6,
    stops: 0
  },
  {
    origin: 'ICN',
    dest: 'KIX',
    airline: '7C',
    flightNum: '7C1302',
    depTime: '07:00',
    arrTime: '08:45',
    duration: '1시간 45분',
    basePrice: 168000,
    baggage: '위탁수하물 15kg 포함',
    baggageIncluded: true,
    seatsLeft: 4,
    stops: 0
  },
  {
    origin: 'ICN',
    dest: 'KIX',
    airline: 'MM',
    flightNum: 'MM012',
    depTime: '10:30',
    arrTime: '12:15',
    duration: '1시간 45분',
    basePrice: 145000,
    baggage: '위탁수하물 미포함 (기내 7kg)',
    baggageIncluded: false,
    seatsLeft: 1,
    stops: 0
  },
  {
    origin: 'ICN',
    dest: 'KIX',
    airline: 'LJ',
    flightNum: 'LJ211',
    depTime: '13:50',
    arrTime: '15:35',
    duration: '1시간 45분',
    basePrice: 182000,
    baggage: '위탁수하물 15kg 포함',
    baggageIncluded: true,
    seatsLeft: 8,
    stops: 0
  },
  {
    origin: 'PUS',
    dest: 'FUK',
    airline: 'BX',
    flightNum: 'BX142',
    depTime: '08:00',
    arrTime: '08:55',
    duration: '55분',
    basePrice: 112000,
    baggage: '위탁수하물 15kg 포함',
    baggageIncluded: true,
    seatsLeft: 5,
    stops: 0
  },
  {
    origin: 'ICN',
    dest: 'FUK',
    airline: 'TW',
    flightNum: 'TW291',
    depTime: '09:20',
    arrTime: '10:45',
    duration: '1시간 25분',
    basePrice: 128000,
    baggage: '위탁수하물 15kg 포함',
    baggageIncluded: true,
    seatsLeft: 3,
    stops: 0
  },
  {
    origin: 'ICN',
    dest: 'CTS',
    airline: 'LJ',
    flightNum: 'LJ231',
    depTime: '08:35',
    arrTime: '11:20',
    duration: '2시간 45분',
    basePrice: 258000,
    baggage: '위탁수하물 15kg 포함',
    baggageIncluded: true,
    seatsLeft: 6,
    stops: 0
  },
  {
    origin: 'ICN',
    dest: 'CTS',
    airline: 'KE',
    flightNum: 'KE765',
    depTime: '10:05',
    arrTime: '12:45',
    duration: '2시간 40분',
    basePrice: 420000,
    baggage: '위탁수하물 23kg + 기내식',
    baggageIncluded: true,
    seatsLeft: 2,
    stops: 0
  },
  {
    origin: 'ICN',
    dest: 'OKA',
    airline: '7C',
    flightNum: '7C1802',
    depTime: '13:30',
    arrTime: '15:55',
    duration: '2시간 25분',
    basePrice: 219000,
    baggage: '위탁수하물 15kg 포함',
    baggageIncluded: true,
    seatsLeft: 4,
    stops: 0
  }
];

export const LOWEST_PRICE_CALENDAR = [
  { day: '월', date: '11/17', price: 168000, isLowest: false },
  { day: '화', date: '11/18', price: 142000, isLowest: true },
  { day: '수', date: '11/19', price: 145000, isLowest: false },
  { day: '목', date: '11/20', price: 158000, isLowest: false },
  { day: '금', date: '11/21', price: 235000, isLowest: false },
  { day: '토', date: '11/22', price: 289000, isLowest: false },
  { day: '일', date: '11/23', price: 198000, isLowest: false }
];
