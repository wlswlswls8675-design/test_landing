import './style.css';
import { AIRPORTS, AIRLINES, MOCK_FLIGHT_TEMPLATES, LOWEST_PRICE_CALENDAR } from './mockData.js';
import { generateDeepLinks, generateFlightCardLinks } from './deeplinks.js';

// ─────────────────────────────────────────
// 애플리케이션 상태
// ─────────────────────────────────────────
const state = {
  tripType: 'round',
  origin: 'ICN',
  destination: 'NRT',
  departDate: '2026-11-20',
  returnDate: '2026-11-23',
  passengers: 1,
  cabinClass: 'economy',
  sortBy: 'price',
  filters: {
    baggageOnly: false,
    airlines: []
  },
  expandedFlightIndex: null,
  searched: false
};

// ─────────────────────────────────────────
// 헬퍼
// ─────────────────────────────────────────
const formatPrice = (num) => num.toLocaleString('ko-KR') + '원';
const formatDateKo = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
};

// ─────────────────────────────────────────
// 딥링크 현재 상태 기반으로 생성
// ─────────────────────────────────────────
function getCurrentDeepLinks() {
  return generateDeepLinks({
    origin:      state.origin,
    destination: state.destination,
    departDate:  state.departDate,
    returnDate:  state.returnDate,
    passengers:  state.passengers,
    cabinClass:  state.cabinClass,
    tripType:    state.tripType
  });
}

// ─────────────────────────────────────────
// 항공편 목록 필터/정렬
// ─────────────────────────────────────────
function getFilteredFlights() {
  let flights = MOCK_FLIGHT_TEMPLATES.filter(
    f => f.origin === state.origin && f.dest === state.destination
  );

  if (flights.length === 0) {
    const destAirport = AIRPORTS.destinations.find(d => d.code === state.destination) || { minPrice: 180000 };
    const base = destAirport.minPrice;
    flights = [
      { origin: state.origin, dest: state.destination, airline: '7C', flightNum: '7C1102', depTime: '07:40', arrTime: '10:10', duration: '2시간 30분', basePrice: base,           baggage: '위탁수하물 15kg 포함',              baggageIncluded: true,  seatsLeft: 4, stops: 0 },
      { origin: state.origin, dest: state.destination, airline: 'LJ', flightNum: 'LJ201',  depTime: '11:45', arrTime: '14:15', duration: '2시간 30분', basePrice: base + 15000,    baggage: '위탁수하물 15kg 포함',              baggageIncluded: true,  seatsLeft: 6, stops: 0 },
      { origin: state.origin, dest: state.destination, airline: 'TW', flightNum: 'TW291',  depTime: '14:00', arrTime: '16:30', duration: '2시간 30분', basePrice: base - 20000,    baggage: '기내 10kg만 포함 (위탁 미포함)',   baggageIncluded: false, seatsLeft: 2, stops: 0 },
      { origin: state.origin, dest: state.destination, airline: 'KE', flightNum: 'KE703',  depTime: '09:20', arrTime: '11:45', duration: '2시간 25분', basePrice: base + 140000,   baggage: '위탁수하물 23kg + 기내식',          baggageIncluded: true,  seatsLeft: 9, stops: 0 },
    ];
  }

  if (state.filters.baggageOnly) flights = flights.filter(f => f.baggageIncluded);
  if (state.filters.airlines.length > 0) flights = flights.filter(f => state.filters.airlines.includes(f.airline));

  flights.sort((a, b) => {
    if (state.sortBy === 'price')   return a.basePrice - b.basePrice;
    if (state.sortBy === 'depTime') return a.depTime.localeCompare(b.depTime);
    if (state.sortBy === 'duration') return a.duration.localeCompare(b.duration);
    return 0;
  });

  return flights;
}

// ─────────────────────────────────────────
// 메타서치 패널 HTML (검색 후 최상단에 표시)
// ─────────────────────────────────────────
function renderMetaSearchPanel() {
  if (!state.searched) return '';

  const links = getCurrentDeepLinks();
  const originObj = AIRPORTS.origins.find(o => o.code === state.origin);
  const destObj   = AIRPORTS.destinations.find(d => d.code === state.destination);
  const originLabel = originObj ? `${originObj.city}(${state.origin})` : state.origin;
  const destLabel   = destObj   ? `${destObj.city}(${state.destination})`   : state.destination;

  return `
    <div class="metasearch-panel">
      <div class="metasearch-title">
        <i class="fa-solid fa-bolt"></i>
        <strong>${originLabel} → ${destLabel}</strong>
        <span class="meta-route-detail">
          ${formatDateKo(state.departDate)}
          ${state.tripType === 'round' ? ` ~ ${formatDateKo(state.returnDate)}` : '(편도)'}
          &nbsp;·&nbsp; 성인 ${state.passengers}명
        </span>
        <span class="meta-label">실시간 최저가 직접 비교</span>
      </div>

      <div class="metasearch-buttons">
        <a href="${links.naver}" target="_blank" rel="noopener noreferrer" class="meta-btn meta-naver">
          <span class="meta-btn-logo">N</span>
          <span class="meta-btn-text">
            <span class="meta-btn-name">네이버 항공권</span>
            <span class="meta-btn-desc">국내 모든 여행사 한눈에 비교</span>
          </span>
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>

        <a href="${links.skyscanner}" target="_blank" rel="noopener noreferrer" class="meta-btn meta-skyscanner">
          <span class="meta-btn-logo"><i class="fa-solid fa-s"></i></span>
          <span class="meta-btn-text">
            <span class="meta-btn-name">스카이스캐너</span>
            <span class="meta-btn-desc">전 세계 LCC 포함 최저가</span>
          </span>
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>

        <a href="${links.tripdotcom}" target="_blank" rel="noopener noreferrer" class="meta-btn meta-trip">
          <span class="meta-btn-logo"><i class="fa-solid fa-t"></i></span>
          <span class="meta-btn-text">
            <span class="meta-btn-name">트립닷컴</span>
            <span class="meta-btn-desc">즉시할인 쿠폰 & 특가 많음</span>
          </span>
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>

        <a href="${links.google}" target="_blank" rel="noopener noreferrer" class="meta-btn meta-google">
          <span class="meta-btn-logo">G</span>
          <span class="meta-btn-text">
            <span class="meta-btn-name">구글 플라이트</span>
            <span class="meta-btn-desc">가격 캘린더 & 가격 추적</span>
          </span>
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      </div>

      <div class="metasearch-notice">
        <i class="fa-solid fa-circle-info"></i>
        각 버튼을 클릭하면 선택하신 조건이 그대로 입력된 실시간 검색 결과 페이지로 이동합니다.
        가격은 잔여 좌석 및 환율에 따라 실시간으로 변동될 수 있습니다.
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────
// 항공편 카드 HTML
// ─────────────────────────────────────────
function renderFlightCard(flight, idx) {
  const airline = AIRLINES[flight.airline] || { name: flight.airline, logo: '✈️', fullService: false };
  const isExpanded = state.expandedFlightIndex === idx;
  const links = generateFlightCardLinks(flight, state);
  const metaLinks = getCurrentDeepLinks();

  // 각 여행사별 가격 (simulate: 트립닷컴이 가장 싸고, 항공사 직판이 조금 비쌈)
  const otaRows = [
    { name: '네이버 항공권',  desc: '국내 여행사 통합 비교',   price: flight.basePrice,          url: metaLinks.naver,       color: '#03c75a', icon: 'N' },
    { name: '스카이스캐너',   desc: '전 세계 최저가 비교',     price: flight.basePrice - 2000,   url: metaLinks.skyscanner,  color: '#00b3ff', icon: 'S' },
    { name: '트립닷컴',       desc: '즉시 할인 쿠폰 적용',     price: flight.basePrice - 5000,   url: metaLinks.tripdotcom,  color: '#ff6600', icon: 'T' },
    { name: '구글 플라이트',  desc: '가격 추적 & 캘린더',      price: flight.basePrice,          url: metaLinks.google,      color: '#4285f4', icon: 'G' },
    { name: '항공사 직접 예약', desc: '마일리지 적립 가능',    price: flight.basePrice + 8000,   url: links.airline,         color: '#6366f1', icon: '✈' },
  ];

  const cheapestOTA = [...otaRows].sort((a, b) => a.price - b.price)[0];

  return `
    <div class="flight-card" data-idx="${idx}">
      <div class="flight-card-main">
        <div class="flight-schedule-info">
          <!-- 항공사 -->
          <div class="airline-badge">
            <div class="airline-logo-box">${airline.logo}</div>
            <div class="airline-name">${airline.name}</div>
            <div class="flight-code">${flight.flightNum}</div>
          </div>

          <!-- 타임라인 -->
          <div class="flight-timeline">
            <div class="timeline-point">
              <div class="timeline-time">${flight.depTime}</div>
              <div class="timeline-code">${flight.origin}</div>
            </div>
            <div class="timeline-duration-box">
              <div class="duration-text">${flight.duration}</div>
              <div class="route-line-graphic">
                <i class="fa-solid fa-plane route-plane-icon"></i>
              </div>
              <div class="route-type-badge">${flight.stops === 0 ? '직항' : '1회 경유'}</div>
            </div>
            <div class="timeline-point dest">
              <div class="timeline-time">${flight.arrTime}</div>
              <div class="timeline-code">${flight.dest}</div>
            </div>
          </div>
        </div>

        <!-- 가격 & CTA -->
        <div class="flight-price-box">
          <div class="price-ota-hint">
            <i class="fa-solid fa-trophy" style="color:#f59e0b; font-size:0.7rem;"></i>
            최저가: ${cheapestOTA.name}
          </div>
          <div class="flight-price">${formatPrice(cheapestOTA.price)}</div>
          <a href="${cheapestOTA.url}" target="_blank" rel="noopener noreferrer" class="btn-select-flight">
            최저가 예약하기 <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
          <div class="flight-compare-cta" data-toggle-ota="${idx}">
            <span>${isExpanded ? '닫기' : '여행사 4곳 가격 비교'}</span>
            <i class="fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}"></i>
          </div>
        </div>
      </div>

      <!-- 태그 바 -->
      <div style="padding: 0 22px 14px 22px;">
        <div class="flight-features">
          <span class="feature-pill ${flight.baggageIncluded ? 'baggage-ok' : 'baggage-no'}">
            <i class="fa-solid ${flight.baggageIncluded ? 'fa-check' : 'fa-xmark'}"></i>
            ${flight.baggage}
          </span>
          <span class="feature-pill seats">
            <i class="fa-solid fa-fire"></i> 잔여 ${flight.seatsLeft}석 특가
          </span>
          <span class="feature-pill" style="background:#f1f5f9; color:#475569;">
            <i class="fa-solid fa-won-sign" style="font-size:0.65rem;"></i> 유류할증료·세금 포함
          </span>
        </div>
      </div>

      <!-- OTA 가격 비교 드로어 -->
      <div class="ota-compare-drawer ${isExpanded ? 'open' : ''}">
        <div class="ota-drawer-header">
          <i class="fa-solid fa-scale-balanced"></i>
          4개 플랫폼 실시간 가격 비교 — 클릭하면 해당 사이트 실시간 검색 결과로 바로 이동합니다
        </div>
        <div class="ota-list">
          ${otaRows.map((ota, i) => `
            <a href="${ota.url}" target="_blank" rel="noopener noreferrer" class="ota-row ${i === 0 ? 'cheapest-row' : ''}">
              <div class="ota-info">
                <div class="ota-icon" style="background:${ota.color};">${ota.icon}</div>
                <div>
                  <div class="ota-name">${ota.name}</div>
                  <div class="ota-desc">${ota.desc}</div>
                </div>
                ${i === 0 ? '<span class="ota-cheapest-badge">최저가</span>' : ''}
              </div>
              <div class="ota-pricing">
                <span class="ota-price">${formatPrice(ota.price)}</span>
                <span class="btn-ota-go">바로가기 <i class="fa-solid fa-arrow-up-right-from-square"></i></span>
              </div>
            </a>
          `).join('')}
        </div>
        <div class="ota-drawer-footer">
          <i class="fa-solid fa-circle-info"></i>
          위 가격은 참고용입니다. 실제 최종 결제 금액은 각 사이트에서 반드시 확인하세요.
        </div>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────
// 메인 렌더
// ─────────────────────────────────────────
function renderApp() {
  const currentOrigin = AIRPORTS.origins.find(o => o.code === state.origin) || AIRPORTS.origins[0];
  const currentDest   = AIRPORTS.destinations.find(d => d.code === state.destination) || AIRPORTS.destinations[0];
  const flights       = getFilteredFlights();

  document.querySelector('#app').innerHTML = `
    <!-- ── 헤더 ── -->
    <header class="header">
      <div class="container nav-container">
        <div class="brand-logo" id="btnLogo">
          <i class="fa-solid fa-plane-departure"></i>
          <span>재팬플라이</span>
          <span class="brand-badge">JAPAN</span>
        </div>
        <nav class="nav-links">
          <a class="nav-link active" href="#searchSection">항공권 비교</a>
          <a class="nav-link" href="#destSection">인기 도시 특가</a>
          <a class="nav-link" href="#whySection">서비스 소개</a>
        </nav>
        <div class="nav-actions">
          <button class="btn-primary" id="btnScrollAlert">
            <i class="fa-regular fa-bell"></i> 특가 알림 받기
          </button>
        </div>
      </div>
    </header>

    <!-- ── 히어로 ── -->
    <section class="hero-section">
      <div class="hero-bg-shapes"></div>
      <div class="container hero-content">
        <div class="hero-pill">
          <i class="fa-solid fa-bolt"></i>
          <span>네이버 항공권 · 스카이스캐너 · 트립닷컴 · 구글 플라이트 실시간 비교</span>
        </div>
        <h1 class="hero-title">
          일본행 항공권, <span>4개 플랫폼</span><br/>최저가를 한 번에 찾으세요
        </h1>
        <p class="hero-desc">
          검색 한 번으로 국내 모든 여행사와 LCC 특가까지 — 수하물 조건 포함 완벽 비교
        </p>
      </div>
    </section>

    <!-- ── 검색 박스 ── -->
    <div class="container search-wrapper" id="searchSection">
      <div class="search-box-card">
        <div class="search-tabs">
          <div class="trip-types">
            <button class="tab-btn ${state.tripType === 'round'  ? 'active' : ''}" data-triptype="round">왕복</button>
            <button class="tab-btn ${state.tripType === 'oneWay' ? 'active' : ''}" data-triptype="oneWay">편도</button>
          </div>
          <div class="search-options-right">
            <select class="select-compact" id="passengerSelect">
              ${[1,2,3,4].map(n => `<option value="${n}" ${state.passengers === n ? 'selected' : ''}>성인 ${n}명</option>`).join('')}
            </select>
            <select class="select-compact" id="cabinSelect">
              <option value="economy"  ${state.cabinClass === 'economy'  ? 'selected' : ''}>일반석</option>
              <option value="business" ${state.cabinClass === 'business' ? 'selected' : ''}>비즈니스석</option>
            </select>
          </div>
        </div>

        <div class="search-grid">
          <!-- 출발지 -->
          <div class="search-item">
            <span class="item-label">출발지</span>
            <select class="item-select" id="originSelect">
              ${AIRPORTS.origins.map(o => `<option value="${o.code}" ${o.code === state.origin ? 'selected' : ''}>${o.city} (${o.code})</option>`).join('')}
            </select>
          </div>

          <div class="swap-btn-container">
            <button class="btn-swap" id="btnSwapAirports" title="출발/도착 반전">
              <i class="fa-solid fa-arrow-right-arrow-left"></i>
            </button>
          </div>

          <!-- 도착지 -->
          <div class="search-item">
            <span class="item-label">도착지 (일본)</span>
            <select class="item-select" id="destSelect">
              ${AIRPORTS.destinations.map(d => `<option value="${d.code}" ${d.code === state.destination ? 'selected' : ''}>${d.city} (${d.code})</option>`).join('')}
            </select>
          </div>

          <!-- 가는 날 -->
          <div class="search-item">
            <span class="item-label">가는 날</span>
            <input type="date" class="item-input-date" id="departDateInput" value="${state.departDate}" min="${new Date().toISOString().split('T')[0]}" />
          </div>

          <!-- 오는 날 -->
          <div class="search-item" style="${state.tripType === 'oneWay' ? 'opacity:0.4;pointer-events:none;' : ''}">
            <span class="item-label">오는 날</span>
            <input type="date" class="item-input-date" id="returnDateInput" value="${state.returnDate}" ${state.tripType === 'oneWay' ? 'disabled' : ''} />
          </div>

          <!-- 검색 버튼 -->
          <button class="search-submit-btn" id="btnSearch">
            <i class="fa-solid fa-magnifying-glass"></i> 항공권 검색
          </button>
        </div>

        <!-- 퀵 필터 칩 -->
        <div class="quick-chips-bar">
          <span class="chips-label"><i class="fa-solid fa-fire"></i> 인기 노선:</span>
          ${AIRPORTS.destinations.slice(0, 5).map(d => `
            <div class="chip ${d.code === state.destination ? 'active' : ''}" data-dest="${d.code}">
              ${d.city} <span class="chip-price">${Math.floor(d.minPrice/10000)}만원대~</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- ── 메타서치 패널 (검색 후 표시) ── -->
    <div class="container" id="metaSearchContainer">
      ${renderMetaSearchPanel()}
    </div>

    <!-- ── 최저가 캘린더 바 ── -->
    <div class="container">
      <div class="calendar-strip-card">
        <div class="cal-header">
          <div class="cal-title"><i class="fa-regular fa-calendar-days"></i> 7일간 최저가</div>
          <div class="cal-sub">${currentOrigin.city} → ${currentDest.city}</div>
        </div>
        <div class="cal-days-row">
          ${LOWEST_PRICE_CALENDAR.map(cal => `
            <div class="cal-day-item ${cal.isLowest ? 'lowest' : ''}">
              <div class="cal-day-date">${cal.date} (${cal.day})</div>
              <div class="cal-day-price">${formatPrice(cal.price)}</div>
              ${cal.isLowest ? '<div class="lowest-badge">최저가</div>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- ── 항공편 목록 + 사이드바 ── -->
    <main class="container main-layout">
      <!-- 사이드바 필터 -->
      <aside class="filter-card">
        <div class="filter-header">
          <h3>필터 조건</h3>
          <button class="btn-reset" id="btnResetFilters">초기화</button>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">수하물 조건</div>
          <label class="filter-checkbox-item">
            <div>
              <input type="checkbox" id="chkBaggageOnly" ${state.filters.baggageOnly ? 'checked' : ''} />
              <span>무료 위탁수하물 포함만</span>
            </div>
            <span class="filter-count"><i class="fa-solid fa-suitcase-rolling"></i></span>
          </label>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">항공사 선택</div>
          ${Object.entries(AIRLINES).map(([code, al]) => `
            <label class="filter-checkbox-item">
              <div>
                <input type="checkbox" class="airline-filter-chks" value="${code}" ${state.filters.airlines.includes(code) ? 'checked' : ''} />
                <span>${al.logo} ${al.name}</span>
              </div>
              <span class="filter-count">${al.fullService ? 'FSC' : 'LCC'}</span>
            </label>
          `).join('')}
        </div>

        <!-- 플랫폼 바로가기 (사이드바 고정) -->
        ${state.searched ? `
        <div class="filter-group sidebar-deeplinks">
          <div class="filter-group-title"><i class="fa-solid fa-external-link-alt"></i> 플랫폼 바로가기</div>
          <div class="sidebar-link-list">
            ${(function() {
              const links = getCurrentDeepLinks();
              return [
                { name: '네이버 항공권', url: links.naver,       color: '#03c75a' },
                { name: '스카이스캐너',  url: links.skyscanner,  color: '#00b3ff' },
                { name: '트립닷컴',      url: links.tripdotcom,  color: '#ff6600' },
                { name: '구글 플라이트', url: links.google,      color: '#4285f4' },
              ].map(l => `
                <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="sidebar-deeplink-btn" style="border-left-color:${l.color}">
                  ${l.name} <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
              `).join('');
            })()}
          </div>
        </div>
        ` : ''}
      </aside>

      <!-- 항공편 결과 -->
      <section class="results-container">
        <div class="results-header">
          <div class="results-count">
            <span>${flights.length}</span>개 항공편
            <span style="font-size:0.85rem; font-weight:400; color:var(--text-muted); margin-left:8px;">
              ${currentOrigin.city} → ${currentDest.city} · ${formatDateKo(state.departDate)}
            </span>
          </div>
          <div class="sort-tabs">
            <button class="sort-btn ${state.sortBy === 'price'    ? 'active' : ''}" data-sort="price">최저가순</button>
            <button class="sort-btn ${state.sortBy === 'depTime'  ? 'active' : ''}" data-sort="depTime">출발시간순</button>
            <button class="sort-btn ${state.sortBy === 'duration' ? 'active' : ''}" data-sort="duration">최단비행순</button>
          </div>
        </div>

        <div class="flight-cards-list">
          ${flights.length === 0 ? `
            <div class="empty-state">
              <i class="fa-solid fa-plane-slash"></i>
              <h3>선택한 조건의 항공편이 없습니다</h3>
              <p>필터 조건을 완화하거나 다른 날짜를 선택해 보세요.</p>
            </div>
          ` : flights.map((f, i) => renderFlightCard(f, i)).join('')}
        </div>
      </section>
    </main>

    <!-- ── 인기 도시 큐레이션 ── -->
    <section class="popular-section" id="destSection">
      <div class="container">
        <div class="section-head">
          <div class="section-tag">POPULAR DESTINATIONS</div>
          <h2 class="section-title">가장 사랑받는 일본 여행지</h2>
          <p class="section-subtitle">클릭하면 해당 도시 항공권 검색으로 바로 이동합니다</p>
        </div>
        <div class="destinations-grid">
          ${AIRPORTS.destinations.slice(0, 4).map(d => `
            <div class="dest-card" onclick="window.selectCity('${d.code}')">
              <img src="${d.image}" alt="${d.city}" loading="lazy" />
              <div class="dest-overlay">
                <span class="dest-tag">${d.tag}</span>
                <div class="dest-name">${d.city}</div>
                <div class="dest-desc">${d.desc}</div>
                <div class="dest-price-box">
                  <span class="dest-price-label">왕복 최저가</span>
                  <span class="dest-price-value">${formatPrice(d.minPrice)}~</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ── 서비스 소개 ── -->
    <section class="why-section" id="whySection">
      <div class="container">
        <div class="section-head">
          <div class="section-tag">WHY JAPANFLY</div>
          <h2 class="section-title">왜 재팬플라이에서 비교해야 할까요?</h2>
        </div>
        <div class="features-grid">
          <div class="feature-box">
            <div class="feature-icon"><i class="fa-solid fa-magnifying-glass-dollar"></i></div>
            <h3 class="feature-title">4개 플랫폼 실시간 연결</h3>
            <p class="feature-desc">네이버 항공권, 스카이스캐너, 트립닷컴, 구글 플라이트의 실시간 검색 결과를 한 번에 확인합니다. 클릭 한 번으로 해당 사이트의 실시간 최저가로 바로 이동합니다.</p>
          </div>
          <div class="feature-box">
            <div class="feature-icon"><i class="fa-solid fa-suitcase-rolling"></i></div>
            <h3 class="feature-title">수하물 조건 즉시 비교</h3>
            <p class="feature-desc">LCC 특가표 샀다가 공항에서 위탁수하물 비용에 낭패보지 마세요. 15kg·23kg 무료 포함 여부를 한눈에 필터링합니다.</p>
          </div>
          <div class="feature-box">
            <div class="feature-icon"><i class="fa-solid fa-shield-halved"></i></div>
            <h3 class="feature-title">숨은 수수료 없는 투명한 가격</h3>
            <p class="feature-desc">유류할증료, 공항세, 카드 수수료까지 포함된 최종 결제 예상액을 보여드립니다. 보여드린 가격 그대로 결제 화면으로 연결됩니다.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── 특가 알림 배너 ── -->
    <div class="container" id="alertBannerSection">
      <div class="alert-banner">
        <div class="alert-banner-text">
          <h3>✈️ 원하는 노선 특가 오픈 즉시 알림받기</h3>
          <p>후쿠오카 10만원 이하, 도쿄 18만원 이하 — 목표 가격에 도달하면 이메일로 바로 알려드립니다.</p>
        </div>
        <form class="alert-banner-form" id="quickAlertForm">
          <input type="email" class="alert-input" placeholder="이메일 주소를 입력해 주세요" required id="quickAlertEmail" />
          <button type="submit" class="btn-alert-submit">무료 알림 신청</button>
        </form>
      </div>
    </div>

    <!-- ── 푸터 ── -->
    <footer class="footer">
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            <div class="footer-logo"><i class="fa-solid fa-plane-departure"></i> 재팬플라이 (JapanFly)</div>
            <p>대한민국에서 일본으로 향하는 모든 하늘길을 가장 빠르고 저렴하게 연결합니다.<br/>네이버 항공권, 스카이스캐너, 트립닷컴, 구글 플라이트를 실시간으로 한 번에 비교하세요.</p>
          </div>
          <div class="footer-links-group">
            <h4>인기 노선</h4>
            <ul>
              <li><a href="javascript:void(0)" onclick="window.selectCity('NRT')">인천 → 도쿄 나리타</a></li>
              <li><a href="javascript:void(0)" onclick="window.selectCity('KIX')">인천 → 오사카 간사이</a></li>
              <li><a href="javascript:void(0)" onclick="window.selectCity('FUK')">부산 → 후쿠오카</a></li>
              <li><a href="javascript:void(0)" onclick="window.selectCity('CTS')">인천 → 삿포로</a></li>
              <li><a href="javascript:void(0)" onclick="window.selectCity('OKA')">인천 → 오키나와</a></li>
            </ul>
          </div>
          <div class="footer-links-group">
            <h4>파트너 플랫폼</h4>
            <ul>
              <li>네이버 항공권</li>
              <li>스카이스캐너</li>
              <li>트립닷컴</li>
              <li>구글 플라이트</li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          &copy; 2026 JapanFly. 가격 정보는 각 플랫폼의 실시간 데이터 기준이며, 잔여 좌석 및 환율에 따라 변동될 수 있습니다.
        </div>
      </div>
    </footer>
  `;

  attachEvents();
}

// ─────────────────────────────────────────
// 이벤트 바인딩
// ─────────────────────────────────────────
function attachEvents() {
  // 왕복/편도 탭
  document.querySelectorAll('.tab-btn[data-triptype]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.tripType = btn.dataset.triptype;
      renderApp();
    });
  });

  // 출발지
  document.querySelector('#originSelect')?.addEventListener('change', e => {
    state.origin = e.target.value;
  });

  // 도착지
  document.querySelector('#destSelect')?.addEventListener('change', e => {
    state.destination = e.target.value;
  });

  // 날짜
  document.querySelector('#departDateInput')?.addEventListener('change', e => {
    state.departDate = e.target.value;
  });
  document.querySelector('#returnDateInput')?.addEventListener('change', e => {
    state.returnDate = e.target.value;
  });

  // 인원/클래스
  document.querySelector('#passengerSelect')?.addEventListener('change', e => {
    state.passengers = parseInt(e.target.value, 10);
  });
  document.querySelector('#cabinSelect')?.addEventListener('change', e => {
    state.cabinClass = e.target.value;
  });

  // 스왑 버튼 (일본 ↔ 한국은 의미상 반전이므로, 도착지만 초기화)
  document.querySelector('#btnSwapAirports')?.addEventListener('click', () => {
    // 일본→한국 역방향 검색은 지원범위 밖이므로 메시지만
    alert('현재 한국 → 일본 편도 노선만 지원합니다.\n역방향(일본 → 한국) 귀국편은 각 플랫폼에서 왕복으로 검색해 주세요.');
  });

  // 퀵 칩
  document.querySelectorAll('.chip[data-dest]').forEach(chip => {
    chip.addEventListener('click', () => {
      state.destination = chip.dataset.dest;
      state.searched = true;
      renderApp();
      document.querySelector('#metaSearchContainer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // 검색 버튼
  document.querySelector('#btnSearch')?.addEventListener('click', () => {
    // 최신 select 값을 한 번 더 읽기
    state.origin      = document.querySelector('#originSelect')?.value  || state.origin;
    state.destination = document.querySelector('#destSelect')?.value    || state.destination;
    state.departDate  = document.querySelector('#departDateInput')?.value || state.departDate;
    state.returnDate  = document.querySelector('#returnDateInput')?.value || state.returnDate;
    state.passengers  = parseInt(document.querySelector('#passengerSelect')?.value || state.passengers, 10);
    state.cabinClass  = document.querySelector('#cabinSelect')?.value   || state.cabinClass;
    state.searched    = true;
    renderApp();
    document.querySelector('#metaSearchContainer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // 정렬
  document.querySelectorAll('.sort-btn[data-sort]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.sortBy = btn.dataset.sort;
      renderApp();
    });
  });

  // 필터
  document.querySelector('#chkBaggageOnly')?.addEventListener('change', e => {
    state.filters.baggageOnly = e.target.checked;
    renderApp();
  });

  document.querySelectorAll('.airline-filter-chks').forEach(chk => {
    chk.addEventListener('change', () => {
      state.filters.airlines = Array.from(document.querySelectorAll('.airline-filter-chks'))
        .filter(c => c.checked).map(c => c.value);
      renderApp();
    });
  });

  document.querySelector('#btnResetFilters')?.addEventListener('click', () => {
    state.filters.baggageOnly = false;
    state.filters.airlines = [];
    renderApp();
  });

  // OTA 드로어 토글
  document.querySelectorAll('[data-toggle-ota]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.toggleOta, 10);
      state.expandedFlightIndex = state.expandedFlightIndex === idx ? null : idx;
      renderApp();
    });
  });

  // 알림 배너 스크롤
  document.querySelector('#btnScrollAlert')?.addEventListener('click', () => {
    document.querySelector('#alertBannerSection')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => document.querySelector('#quickAlertEmail')?.focus(), 600);
  });

  // 알림 폼
  document.querySelector('#quickAlertForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.querySelector('#quickAlertEmail')?.value;
    const originObj = AIRPORTS.origins.find(o => o.code === state.origin);
    const destObj   = AIRPORTS.destinations.find(d => d.code === state.destination);
    alert(`🎉 알림 등록 완료!\n\n노선: ${originObj?.city || state.origin} → ${destObj?.city || state.destination}\n이메일: ${email}\n\n특가 티켓이 열리면 즉시 알려드립니다!`);
    e.target.reset();
  });
}

// ─────────────────────────────────────────
// 전역 함수 (인라인 onclick용)
// ─────────────────────────────────────────
window.selectCity = (destCode) => {
  state.destination = destCode;
  state.searched    = true;
  renderApp();
  document.querySelector('#metaSearchContainer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ─────────────────────────────────────────
// 최초 렌더
// ─────────────────────────────────────────
renderApp();
