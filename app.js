/* ==========================================================================
   Celestial Hijri - Calendar Logic and Engine
   ========================================================================== */

// --- Translation Dictionary for Multi-locale Support ---
const locales = {
  en: {
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    hijriMonths: ['Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Akhir', 'Jumada al-Awwal', 'Jumada al-Akhirah', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu al-Qa\'dah', 'Dhu al-Hijjah'],
    gregorianMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    gregorianWeekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    calMethods: {
      'islamic-umalqura': 'Umm al-Qura (Saudi Arabia)',
      'islamic-civil': 'Tabular Civil (Standard Epoch)',
      'islamic-tbla': 'Tabular Astronomical',
      'islamic': 'Standard Astronomical'
    },
    offsets: {
      '-2': '-2 Days',
      '-1': '-1 Day',
      '0': 'None (0)',
      '1': '+1 Day',
      '2': '+2 Days'
    },
    ui: {
      appTitle: 'Hijri Calendar',
      appSubtitle: 'Premium Islamic Calendar Browser',
      convTitle: 'Calendar Converter',
      settingsTitle: 'Preferences',
      calMethod: 'Calculation Method',
      offset: 'Hijri Correction',
      language: 'Language',
      btnToday: 'Today',
      prevYear: 'Previous Year',
      prevMonth: 'Previous Month',
      nextMonth: 'Next Month',
      nextYear: 'Next Year',
      legendToday: 'Today',
      legendHoliday: 'Holiday',
      eventsTitle: 'Significant Islamic Dates',
      hijriMonthInput: 'Month',
      hijriDayInput: 'Day',
      hijriYearInput: 'Year',
      btnConvertG2H: 'Convert to Hijri',
      btnConvertH2G: 'Convert to Gregorian',
      credits: 'Powered by <span class="brand-credit">WazrahJR</span>',
      invalidDate: 'Invalid date for the selected calendar calculation method.',
      showOnCalendar: 'Show on Calendar',
      gregToHijriTab: 'G ➔ H',
      hijriToGregTab: 'H ➔ G',
      hijriDateResult: 'Hijri Date:',
      gregorianDateResult: 'Gregorian Date:'
    },
    holidays: {
      newYear: 'Islamic New Year',
      ashura: 'Ashura',
      mawlid: 'Mawlid al-Nabi (Prophet\'s Birthday)',
      isra: 'Isra\' and Mi\'raj (Night Journey)',
      midShaban: 'Nisf Sha\'ban (Mid-Sha\'ban)',
      ramadanStart: 'Ramadan Starts',
      laylatQadr: 'Laylat al-Qadr (Night of Power)',
      eidFitr: 'Eid al-Fitr',
      arafah: 'Day of Arafah',
      eidAdha: 'Eid al-Adha'
    }
  },
  ar: {
    weekdays: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    hijriMonths: ['المحرّم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'],
    gregorianMonths: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    gregorianWeekdays: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    calMethods: {
      'islamic-umalqura': 'أم القرى (المملكة العربية السعودية)',
      'islamic-civil': 'المدني الاصطلاحي (حقبة قياسية)',
      'islamic-tbla': 'الاصطلاحي الفلكي',
      'islamic': 'الفلكي القياسي'
    },
    offsets: {
      '-2': '-٢ يوم',
      '-1': '-١ يوم',
      '0': 'لا يوجد (٠)',
      '1': '+١ يوم',
      '2': '+٢ يوم'
    },
    ui: {
      appTitle: 'التقويم الهجري',
      appSubtitle: 'متصفح التقويم الهجري المميز',
      convTitle: 'محول التقويم',
      settingsTitle: 'التفضيلات',
      calMethod: 'طريقة الحساب',
      offset: 'تعديل التاريخ الهجري',
      language: 'اللغة',
      btnToday: 'اليوم',
      prevYear: 'السنة السابقة',
      prevMonth: 'الشهر السابق',
      nextMonth: 'الشهر التالي',
      nextYear: 'السنة التالية',
      legendToday: 'اليوم',
      legendHoliday: 'مناسبة',
      eventsTitle: 'المناسبات الإسلامية الهامة',
      hijriMonthInput: 'الشهر',
      hijriDayInput: 'اليوم',
      hijriYearInput: 'السنة',
      btnConvertG2H: 'تحويل إلى هجري',
      btnConvertH2G: 'تحويل إلى ميلادي',
      credits: 'بدعم من <span class="brand-credit">WazrahJR</span>',
      invalidDate: 'تاريخ غير صالح لطريقة حساب التقويم المحددة.',
      showOnCalendar: 'عرض على التقويم',
      gregToHijriTab: 'ميلادي ← هجري',
      hijriToGregTab: 'هجري ← ميلادي',
      hijriDateResult: 'التاريخ الهجري:',
      gregorianDateResult: 'التاريخ الميلادي:'
    },
    holidays: {
      newYear: 'رأس السنة الهجرية',
      ashura: 'يوم عاشوراء',
      mawlid: 'المولد النبوي الشريف',
      isra: 'ليلة الإسراء والمعراج',
      midShaban: 'ليلة النصف من شعبان',
      ramadanStart: 'بداية شهر رمضان',
      laylatQadr: 'ليلة القدر',
      eidFitr: 'عيد الفطر المبارك',
      arafah: 'يوم عرفة',
      eidAdha: 'عيد الأضحى المبارك'
    }
  }
};

// --- App State ---
let state = {
  currentHijriYear: 1447,
  currentHijriMonth: 9,
  currentHijriDay: 1,
  
  selectedHijriYear: 1447,
  selectedHijriMonth: 9,
  selectedHijriDay: 1,
  
  calendarSystem: 'islamic-umalqura',
  offsetCorrection: 0,
  currentLanguage: 'ar',
  
  conversionTab: 'g2h'
};

// --- Core Conversion Logic ---

// Intl.DateTimeFormat is expensive to construct, and a single calendar render
// performs hundreds of conversions (binary search × 30+ day cells). Memoize
// one formatter per calendar system so we build each at most once.
const _hijriFormatters = {};
function getHijriFormatter(calendar) {
  if (!_hijriFormatters[calendar]) {
    _hijriFormatters[calendar] = new Intl.DateTimeFormat(`en-u-ca-${calendar}-nu-latn`, {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  }
  return _hijriFormatters[calendar];
}

/**
 * Converts a Gregorian Date object to Hijri date parts
 * using browser's Intl API under state customization.
 * @param {Date} date - Gregorian date object
 * @param {string} calendar - Calendar name (e.g. 'islamic-umalqura')
 * @param {number} offset - Hijri correction in days
 * @returns {Object} {year, month, day}
 */
function gregorianToHijri(date, calendar = state.calendarSystem, offset = state.offsetCorrection) {
  // Apply the offset in days (86,400,000 milliseconds per day)
  const adjustedDate = new Date(date.getTime() + offset * 86400000);

  // Format using the specified calendar and UTC to avoid local timezone drift
  const parts = getHijriFormatter(calendar).formatToParts(adjustedDate);
  let year, month, day;
  
  for (const part of parts) {
    if (part.type === 'year') year = parseInt(part.value, 10);
    if (part.type === 'month') month = parseInt(part.value, 10);
    if (part.type === 'day') day = parseInt(part.value, 10);
  }
  
  return { year, month, day };
}

/**
 * Converts a Hijri date back to Gregorian Date
 * using a fast binary search on Gregorian days.
 * @param {number} year - Hijri Year
 * @param {number} month - Hijri Month (1-12)
 * @param {number} day - Hijri Day (1-30)
 * @param {string} calendar - Calendar name
 * @param {number} offset - Hijri correction
 * @returns {Date|null} Gregorian Date object (in UTC midnight) or null if invalid
 */
function hijriToGregorian(year, month, day, calendar = state.calendarSystem, offset = state.offsetCorrection) {
  // 1. Rough estimate of Gregorian year corresponding to Hijri year
  // Hijri calendar starts at ~622 CE. Average Hijri year is ~354.36 days.
  const estGregYear = Math.floor(year * 0.970229) + 622;
  
  // 2. Set search range (2 years buffer around estimated year)
  const minDate = new Date(Date.UTC(estGregYear - 2, 0, 1));
  const maxDate = new Date(Date.UTC(estGregYear + 2, 11, 31));
  
  let lowDays = 0;
  let highDays = Math.round((maxDate.getTime() - minDate.getTime()) / 86400000);
  
  let matchedDate = null;
  
  // 3. Binary Search over days
  while (lowDays <= highDays) {
    const midDays = Math.floor((lowDays + highDays) / 2);
    const testDate = new Date(minDate.getTime() + midDays * 86400000);
    const hParts = gregorianToHijri(testDate, calendar, offset);
    
    if (hParts.year < year || 
       (hParts.year === year && hParts.month < month) ||
       (hParts.year === year && hParts.month === month && hParts.day < day)) {
      lowDays = midDays + 1;
    } else if (hParts.year > year || 
              (hParts.year === year && hParts.month > month) ||
              (hParts.year === year && hParts.month === month && hParts.day > day)) {
      highDays = midDays - 1;
    } else {
      // Found the matching Hijri date! Keep searching backward to find the very first
      // matching Gregorian date (in case of overlaps due to offset shifts or date adjustments).
      matchedDate = testDate;
      highDays = midDays - 1; 
    }
  }
  
  // If matched, verify it formats back precisely. If not, it means this date doesn't exist
  // in the selected calendar system (e.g. asking for 30th in a 29-day month).
  if (matchedDate) {
    const doubleCheck = gregorianToHijri(matchedDate, calendar, offset);
    if (doubleCheck.year === year && doubleCheck.month === month && doubleCheck.day === day) {
      return matchedDate;
    }
  }
  
  return null;
}

// --- Holiday Calculation Logic ---

// Holiday lists are recomputed by several render passes for the same year.
// Each entry is 8 binary searches, so cache per (year, calendar, offset, lang).
const _holidayCache = {};

/**
 * Calculates Gregorian dates for all major holidays in a Hijri year
 * @param {number} hYear - Hijri Year
 * @returns {Array} List of holiday objects
 */
function getHolidaysForYear(hYear) {
  const cacheKey = `${hYear}|${state.calendarSystem}|${state.offsetCorrection}|${state.currentLanguage}`;
  if (_holidayCache[cacheKey]) return _holidayCache[cacheKey];

  const list = [
    { key: 'newYear', month: 1, day: 1 },
    { key: 'mawlid', month: 3, day: 12 },
    { key: 'isra', month: 7, day: 27 },
    { key: 'midShaban', month: 8, day: 15 },
    { key: 'ramadanStart', month: 9, day: 1 },
    { key: 'eidFitr', month: 10, day: 1 },
    { key: 'arafah', month: 12, day: 9 },
    { key: 'eidAdha', month: 12, day: 10 }
  ];
  
  const results = [];
  const lang = locales[state.currentLanguage];
  
  for (const item of list) {
    const gregDate = hijriToGregorian(hYear, item.month, item.day);
    results.push({
      key: item.key,
      month: item.month,
      day: item.day,
      name: lang.holidays[item.key],
      gregorianDate: gregDate
    });
  }
  
  // Sort chronologically by Gregorian date (handling potential nulls gracefully)
  results.sort((a, b) => {
    if (!a.gregorianDate) return 1;
    if (!b.gregorianDate) return -1;
    return a.gregorianDate.getTime() - b.gregorianDate.getTime();
  });

  _holidayCache[cacheKey] = results;
  return results;
}

// --- Live Time Badge ---

function updateTodayBadge() {
  const badge = document.getElementById('current-time-badge');
  if (!badge) return;

  const now = new Date();
  const hToday = gregorianToHijri(now);
  const lang = locales[state.currentLanguage];

  let dateText = '';
  if (state.currentLanguage === 'ar') {
    dateText = `اليوم: ${toArabicDigits(hToday.day)} ${lang.hijriMonths[hToday.month - 1]} ${toArabicDigits(hToday.year)} هـ`;
  } else {
    dateText = `Today: ${hToday.day} ${lang.hijriMonths[hToday.month - 1]} ${hToday.year} AH`;
  }

  // Hijri date only changes at midnight; skip identical 60s re-renders.
  if (badge.dataset.text === dateText) return;
  badge.dataset.text = dateText;

  badge.innerHTML = `
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    <span>${dateText}</span>
  `;
}

// --- UI Rendering Engines ---

/**
 * Renders the full monthly calendar grid
 */
function renderCalendarGrid() {
  const y = state.currentHijriYear;
  const m = state.currentHijriMonth;
  const lang = locales[state.currentLanguage];
  
  // 1. Set titles
  document.getElementById('lbl-cal-month-title').innerText = lang.hijriMonths[m - 1];

  document.getElementById('lbl-cal-year-title').innerText = `${formatNumber(y)} ${state.currentLanguage === 'ar' ? 'هـ' : 'AH'}`;
  
  // 2. Find Gregorian start date and number of days
  const startGreg = hijriToGregorian(y, m, 1);
  if (!startGreg) return; // Guard clause
  
  const is30Days = (hijriToGregorian(y, m, 30) !== null);
  const daysInMonth = is30Days ? 30 : 29;
  
  // Find end date
  const endGreg = hijriToGregorian(y, m, daysInMonth);
  
  // Update Gregorian range in header
  if (startGreg && endGreg) {
    const startM = lang.gregorianMonths[startGreg.getUTCMonth()];
    const startY = formatNumber(startGreg.getUTCFullYear());
    const endM = lang.gregorianMonths[endGreg.getUTCMonth()];
    const endY = formatNumber(endGreg.getUTCFullYear());
    
    if (startY === endY) {
      if (startM === endM) {
        document.getElementById('lbl-cal-gregorian-range').innerText = `${startM} ${startY}`;
      } else {
        document.getElementById('lbl-cal-gregorian-range').innerText = `${startM} - ${endM} ${startY}`;
      }
    } else {
      document.getElementById('lbl-cal-gregorian-range').innerText = `${startM} ${startY} - ${endM} ${endY}`;
    }
  }

  // 3. Render Weekday headers
  const weekdayRow = document.getElementById('weekday-row');
  weekdayRow.innerHTML = '';
  // Sunday to Saturday order
  for (let i = 0; i < 7; i++) {
    const daySpan = document.createElement('span');
    daySpan.innerText = lang.weekdays[i];
    weekdayRow.appendChild(daySpan);
  }
  
  // 4. Prepare cells array
  const daysGrid = document.getElementById('days-grid');
  daysGrid.innerHTML = '';
  
  // Get weekday index of the 1st Hijri day
  const startDayOfWeek = startGreg.getUTCDay(); // 0 is Sunday, 1 is Monday...
  
  // Calculate previous month padding
  const prevM = m === 1 ? 12 : m - 1;
  const prevY = m === 1 ? y - 1 : y;
  const prevDaysInMonth = (hijriToGregorian(prevY, prevM, 30) !== null) ? 30 : 29;
  
  // Fill previous month cells (disabled/muted)
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDayNum = prevDaysInMonth - i;
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell other-month';
    cell.setAttribute('aria-hidden', 'true');
    cell.innerHTML = `<span class="day-cell-num">${formatNumber(prevDayNum)}</span>`;
    daysGrid.appendChild(cell);
  }
  
  // Today's exact Hijri date to highlight
  const now = new Date();
  const todayHijri = gregorianToHijri(now);
  
  // Holidays in the current month
  const holidays = getHolidaysForYear(y).filter(h => h.month === m);
  
  // Render active month cells
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('button');
    cell.className = 'calendar-day-cell';
    cell.setAttribute('type', 'button');

    // Get matching Gregorian day
    const gDate = hijriToGregorian(y, m, d);
    const gDayStr = gDate ? `${lang.gregorianMonths[gDate.getUTCMonth()]} ${formatNumber(gDate.getUTCDate())}` : '';
    
    let cellClasses = [];
    let indicatorsHtml = '';
    
    // Is Selected
    if (y === state.selectedHijriYear && m === state.selectedHijriMonth && d === state.selectedHijriDay) {
      cellClasses.push('is-selected');
      cell.setAttribute('aria-pressed', 'true');
    } else {
      cell.setAttribute('aria-pressed', 'false');
    }

    // Is Today
    if (todayHijri.year === y && todayHijri.month === m && todayHijri.day === d) {
      cellClasses.push('is-today');
      cell.setAttribute('aria-current', 'date');
      indicatorsHtml += '<span class="dot today-dot"></span>';
    }
    
    // Has Holiday
    const dayHoliday = holidays.find(h => h.day === d);
    if (dayHoliday) {
      cellClasses.push('has-holiday');
      indicatorsHtml += '<span class="dot holiday-dot"></span>';
      cell.setAttribute('title', dayHoliday.name);
    }
    
    if (cellClasses.length > 0) {
      cell.className += ' ' + cellClasses.join(' ');
    }

    // Accessible name for screen readers (visible cell text stays terse)
    const srParts = [`${formatNumber(d)} ${lang.hijriMonths[m - 1]} ${formatNumber(y)}`];
    if (gDate) {
      srParts.push(`${lang.gregorianWeekdays[gDate.getUTCDay()]} ${formatNumber(gDate.getUTCDate())} ${lang.gregorianMonths[gDate.getUTCMonth()]} ${formatNumber(gDate.getUTCFullYear())}`);
    }
    if (cellClasses.includes('is-today')) srParts.push(lang.ui.btnToday);
    if (dayHoliday) srParts.push(dayHoliday.name);
    cell.setAttribute('aria-label', srParts.join(', '));

    cell.innerHTML = `
      <span class="day-cell-num">${formatNumber(d)}</span>
      <span class="day-cell-greg">${gDayStr}</span>
      <div class="day-indicators">${indicatorsHtml}</div>
    `;
    
    // Click Event to select day
    cell.onclick = () => {
      state.selectedHijriYear = y;
      state.selectedHijriMonth = m;
      state.selectedHijriDay = d;
      
      // Update cell visual states manually for speed/animation
      const selectedCells = daysGrid.querySelectorAll('.calendar-day-cell.is-selected');
      selectedCells.forEach(c => {
        c.classList.remove('is-selected');
        c.setAttribute('aria-pressed', 'false');
      });
      cell.classList.add('is-selected');
      cell.setAttribute('aria-pressed', 'true');
    };
    
    daysGrid.appendChild(cell);
  }
  
  // Fill next month padding cells to complete a 7-column layout grid
  const totalCells = startDayOfWeek + daysInMonth;
  const nextMonthPadding = (7 - (totalCells % 7)) % 7;
  
  for (let d = 1; d <= nextMonthPadding; d++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell other-month';
    cell.setAttribute('aria-hidden', 'true');
    cell.innerHTML = `<span class="day-cell-num">${formatNumber(d)}</span>`;
    daysGrid.appendChild(cell);
  }
}

/**
 * Renders the yearly holidays list card
 */
function renderHolidaysList() {
  const y = state.currentHijriYear;
  const holidays = getHolidaysForYear(y);
  const lang = locales[state.currentLanguage];
  
  document.getElementById('lbl-holiday-active-year').innerText = `${formatNumber(y)} ${state.currentLanguage === 'ar' ? 'هـ' : 'AH'}`;
  
  const container = document.getElementById('holidays-list-container');
  container.innerHTML = '';
  
  for (const h of holidays) {
    const item = document.createElement('button');
    item.className = 'holiday-item-card';
    item.setAttribute('aria-label', `${h.name} — ${formatNumber(h.day)} ${lang.hijriMonths[h.month - 1]}`);
    
    // Formatting Gregorian Date
    let gregDateStr = lang.ui.invalidDate;
    if (h.gregorianDate) {
      const monthName = lang.gregorianMonths[h.gregorianDate.getUTCMonth()];
      const dayNum = formatNumber(h.gregorianDate.getUTCDate());
      gregDateStr = `${monthName} ${dayNum}`;
    }
    
    item.innerHTML = `
      <div class="holiday-meta">
        <span class="holiday-name">${h.name}</span>
        <span class="holiday-hijri-date">${formatNumber(h.day)} ${lang.hijriMonths[h.month - 1]}</span>
      </div>
      <div class="holiday-gregorian-date">${gregDateStr}</div>
    `;
    
    // Click event to jump calendar to that holiday
    item.onclick = () => {
      state.currentHijriYear = y;
      state.currentHijriMonth = h.month;
      state.currentHijriDay = h.day;
      
      state.selectedHijriYear = y;
      state.selectedHijriMonth = h.month;
      state.selectedHijriDay = h.day;
      
      renderCalendarGrid();      
      // Add a visual flash effect to the selected day cell
      setTimeout(() => {
        const activeCell = document.querySelector('.calendar-day-cell.is-selected');
        if (activeCell) {
          activeCell.style.animation = 'pulseGlow 1.5s ease-in-out';
          setTimeout(() => { activeCell.style.animation = ''; }, 1500);
        }
      }, 50);
    };
    
    container.appendChild(item);
  }
}

// --- Conversions Tab Handling ---

function switchTab(tab) {
  state.conversionTab = tab;
  
  const btnG2H = document.getElementById('btn-tab-g2h');
  const btnH2G = document.getElementById('btn-tab-h2g');
  const formG2H = document.getElementById('form-g2h');
  const formH2G = document.getElementById('form-h2g');
  
  if (tab === 'g2h') {
    btnG2H.classList.add('active');
    btnH2G.classList.remove('active');
    formG2H.classList.add('active-form');
    formH2G.classList.remove('active-form');
  } else {
    btnG2H.classList.remove('active');
    btnH2G.classList.add('active');
    formG2H.classList.remove('active-form');
    formH2G.classList.add('active-form');
    // Ensure month selector is populated
    populateHijriMonthDropdown();
  }

  btnG2H.setAttribute('aria-selected', String(tab === 'g2h'));
  btnH2G.setAttribute('aria-selected', String(tab === 'h2g'));
}

function populateHijriMonthDropdown() {
  const select = document.getElementById('input-hijri-month');
  if (!select) return;

  const lang = locales[state.currentLanguage];
  const prev = select.value;
  select.innerHTML = '';

  for (let i = 0; i < 12; i++) {
    const opt = document.createElement('option');
    opt.value = i + 1;
    opt.innerText = `${formatNumber(i + 1)} - ${lang.hijriMonths[i]}`;
    select.appendChild(opt);
  }
  if (prev) select.value = prev;
}

function populateGregorianMonthDropdown() {
  const select = document.getElementById('input-greg-month');
  if (!select) return;

  const lang = locales[state.currentLanguage];
  const prev = select.value;
  select.innerHTML = '';

  for (let i = 0; i < 12; i++) {
    const opt = document.createElement('option');
    opt.value = i + 1;
    opt.innerText = `${formatNumber(i + 1)} - ${lang.gregorianMonths[i]}`;
    select.appendChild(opt);
  }
  if (prev) select.value = prev;
}

function handleG2HConvert() {
  const resultDiv = document.getElementById('result-g2h');
  const lang = locales[state.currentLanguage];

  // Read Day / Month / Year fields
  const gDay = parseInt(document.getElementById('input-greg-day').value, 10);
  const gMonth = parseInt(document.getElementById('input-greg-month').value, 10);
  const gYear = parseInt(document.getElementById('input-greg-year').value, 10);

  if (!gDay || !gMonth || !gYear) {
    resultDiv.classList.add('hidden');
    return;
  }

  // Build a UTC date and reject impossible dates (e.g. 31 February)
  const dateObj = new Date(Date.UTC(gYear, gMonth - 1, gDay));
  if (dateObj.getUTCDate() !== gDay || (dateObj.getUTCMonth() + 1) !== gMonth) {
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = `<span style="color: var(--red-accent);">${lang.ui.invalidDate}</span>`;
    return;
  }

  const hijri = gregorianToHijri(dateObj);
  resultDiv.classList.remove('hidden');

  // Check for special date: June 4, 1992
  const isSpecialDate = (gYear === 1992 && gMonth === 6 && gDay === 4);

  if (hijri.year && hijri.month && hijri.day) {
    let dateText = '';
    if (state.currentLanguage === 'ar') {
      dateText = `${toArabicDigits(hijri.day)} ${locales['ar'].hijriMonths[hijri.month - 1]} ${toArabicDigits(hijri.year)} هـ`;
    } else {
      dateText = `${hijri.day} ${lang.hijriMonths[hijri.month - 1]} ${hijri.year} AH`;
    }

    resultDiv.innerHTML = `
      ${lang.ui.hijriDateResult} <strong>${dateText}</strong>
      <button class="btn-secondary" style="margin-top: 10px; width: 100%; justify-content: center;" onclick="jumpToHijriDate(${hijri.year}, ${hijri.month}, ${hijri.day})">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
        <span>${lang.ui.showOnCalendar}</span>
      </button>
    `;

    // 💖 Easter egg: Mom's birthday
    if (isSpecialDate) {
      launchBirthdayCelebration();
    }
  } else {
    resultDiv.innerHTML = `<span style="color: var(--red-accent);">${lang.ui.invalidDate}</span>`;
  }
}

function handleH2GConvert() {
  const m = parseInt(document.getElementById('input-hijri-month').value, 10);
  const d = parseInt(document.getElementById('input-hijri-day').value, 10);
  const y = parseInt(document.getElementById('input-hijri-year').value, 10);
  const resultDiv = document.getElementById('result-h2g');
  const lang = locales[state.currentLanguage];

  if (!m || !d || !y) {
    resultDiv.classList.add('hidden');
    return;
  }

  const gregDate = hijriToGregorian(y, m, d);
  resultDiv.classList.remove('hidden');
  
  if (gregDate) {
    const weekday = lang.gregorianWeekdays[gregDate.getUTCDay()];
    const month = lang.gregorianMonths[gregDate.getUTCMonth()];
    const day = gregDate.getUTCDate();
    const year = gregDate.getUTCFullYear();
    
    let dateText = '';
    if (state.currentLanguage === 'ar') {
      dateText = `${weekday}، ${toArabicDigits(day)} ${month} ${toArabicDigits(year)}`;
    } else {
      dateText = `${weekday}, ${month} ${day}, ${year}`;
    }
    
    resultDiv.innerHTML = `
      ${lang.ui.gregorianDateResult} <strong>${dateText}</strong>
      <button class="btn-secondary" style="margin-top: 10px; width: 100%; justify-content: center;" onclick="jumpToHijriDate(${y}, ${m}, ${d})">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
        <span>${lang.ui.showOnCalendar}</span>
      </button>
    `;
  } else {
    resultDiv.innerHTML = `<span style="color: var(--red-accent);">${lang.ui.invalidDate}</span>`;
  }
}

function jumpToHijriDate(y, m, d) {
  state.currentHijriYear = y;
  state.currentHijriMonth = m;
  state.currentHijriDay = d;
  
  state.selectedHijriYear = y;
  state.selectedHijriMonth = m;
  state.selectedHijriDay = d;
  
  renderCalendarGrid();  renderHolidaysList();
}

// --- Preference Changes ---

function handlePreferenceChange() {
  state.calendarSystem = document.getElementById('select-cal-method').value;
  state.offsetCorrection = parseInt(document.getElementById('select-offset').value, 10);
  savePreferences();

  // Refresh views
  renderCalendarGrid();  renderHolidaysList();

  // Refresh today's badge to reflect the new calendar/offset
  updateTodayBadge();
}

/**
 * Updates the language toggle button to show the language it will switch TO
 * (Arabic active → "EN"; English active → "عربي").
 */
function updateLangToggleLabel() {
  const lbl = document.getElementById('lbl-lang-toggle');
  if (lbl) lbl.innerText = state.currentLanguage === 'ar' ? 'EN' : 'عربي';
}

/**
 * Toggles between Arabic and English on a single click.
 */
function toggleLanguage() {
  state.currentLanguage = state.currentLanguage === 'ar' ? 'en' : 'ar';
  applyLanguageChange();
}

/**
 * Applies the current language across the UI and re-renders.
 */
function applyLanguageChange() {
  savePreferences();

  // Document language + RTL/LTR direction
  document.documentElement.lang = state.currentLanguage;
  document.documentElement.dir = state.currentLanguage === 'ar' ? 'rtl' : 'ltr';
  document.body.dir = state.currentLanguage === 'ar' ? 'rtl' : 'ltr';

  // Translate static labels + refresh views
  updateLangToggleLabel();
  translateUI();
  renderCalendarGrid();  renderHolidaysList();
  updateTodayBadge();

  // Re-populate month dropdown in converter if it's open
  if (state.conversionTab === 'h2g') {
    populateHijriMonthDropdown();
  }
}

function translateUI() {
  const lang = locales[state.currentLanguage];
  
  // Elements translation
  document.getElementById('txt-app-title').innerText = lang.ui.appTitle;
  document.getElementById('txt-app-subtitle').innerText = lang.ui.appSubtitle;
  document.title = `${lang.ui.appTitle} — ${lang.ui.appSubtitle}`;
  document.getElementById('txt-conv-title').innerText = lang.ui.convTitle;
  document.getElementById('txt-settings-title').innerText = lang.ui.settingsTitle;
  document.getElementById('lbl-cal-method').innerText = lang.ui.calMethod;
  document.getElementById('lbl-offset').innerText = lang.ui.offset;
  // The language control is an icon-only <select> with no text label in the
  // DOM; guard the lookup so translateUI never throws and aborts init.
  const langLabel = document.getElementById('lbl-language');
  if (langLabel) langLabel.innerText = lang.ui.language;
  document.getElementById('txt-btn-today').innerText = lang.ui.btnToday;
  document.getElementById('txt-legend-today').innerText = lang.ui.legendToday;
  document.getElementById('txt-legend-holiday').innerText = lang.ui.legendHoliday;
  document.getElementById('txt-events-title').innerText = lang.ui.eventsTitle;
  document.getElementById('txt-footer-credits').innerHTML = `&copy; 2026 ${lang.ui.appTitle}. ${lang.ui.credits}`;
  
  // Form Labels
  document.getElementById('lbl-greg-day-input').innerText = lang.ui.hijriDayInput;
  document.getElementById('lbl-greg-month-input').innerText = lang.ui.hijriMonthInput;
  document.getElementById('lbl-greg-year-input').innerText = lang.ui.hijriYearInput;
  populateGregorianMonthDropdown();
  document.getElementById('btn-convert-g2h').innerText = lang.ui.btnConvertG2H;
  document.getElementById('btn-convert-h2g').innerText = lang.ui.btnConvertH2G;
  
  document.getElementById('lbl-hijri-month-input').innerText = lang.ui.hijriMonthInput;
  document.getElementById('lbl-hijri-day-input').innerText = lang.ui.hijriDayInput;
  document.getElementById('lbl-hijri-year-input').innerText = lang.ui.hijriYearInput;
  
  // Tab buttons
  document.getElementById('btn-tab-g2h').innerText = lang.ui.gregToHijriTab;
  document.getElementById('btn-tab-h2g').innerText = lang.ui.hijriToGregTab;

  // Localize calendar navigation buttons (title + aria-label)
  const navMap = {
    'btn-prev-year': lang.ui.prevYear,
    'btn-prev-month': lang.ui.prevMonth,
    'btn-next-month': lang.ui.nextMonth,
    'btn-next-year': lang.ui.nextYear,
  };
  for (const [id, text] of Object.entries(navMap)) {
    const el = document.getElementById(id);
    if (el) { el.setAttribute('aria-label', text); el.setAttribute('title', text); }
  }

  // Localize Calculation Method Options dynamically
  const selectCal = document.getElementById('select-cal-method');
  if (selectCal) {
    const currentVal = selectCal.value;
    selectCal.innerHTML = `
      <option value="islamic-umalqura">${lang.calMethods['islamic-umalqura']}</option>
      <option value="islamic-civil">${lang.calMethods['islamic-civil']}</option>
      <option value="islamic-tbla">${lang.calMethods['islamic-tbla']}</option>
      <option value="islamic">${lang.calMethods['islamic']}</option>
    `;
    selectCal.value = currentVal;
  }
  
  // Localize Offset Options dynamically
  const selectOffset = document.getElementById('select-offset');
  if (selectOffset) {
    const currentVal = selectOffset.value;
    selectOffset.innerHTML = `
      <option value="-2">${lang.offsets['-2']}</option>
      <option value="-1">${lang.offsets['-1']}</option>
      <option value="0">${lang.offsets['0']}</option>
      <option value="1">${lang.offsets['1']}</option>
      <option value="2">${lang.offsets['2']}</option>
    `;
    selectOffset.value = currentVal;
  }
}

// --- Navigation ---

function adjustMonth(amount) {
  let m = state.currentHijriMonth + amount;
  let y = state.currentHijriYear;
  
  if (m > 12) {
    m = 1;
    y += 1;
  } else if (m < 1) {
    m = 12;
    y -= 1;
  }
  
  state.currentHijriMonth = m;
  state.currentHijriYear = y;
  
  renderCalendarGrid();
  renderHolidaysList();
}

function adjustYear(amount) {
  state.currentHijriYear += amount;
  renderCalendarGrid();
  renderHolidaysList();
}

function jumpToToday() {
  const now = new Date();
  const todayH = gregorianToHijri(now);
  
  jumpToHijriDate(todayH.year, todayH.month, todayH.day);
}

// --- Helper Functions ---

/**
 * Formats a number to Arabic-Indic digits if Arabic/Urdu language is active.
 */
function formatNumber(num) {
  if (state.currentLanguage === 'ar') {
    return toArabicDigits(num);
  }
  return num.toString();
}

function toArabicDigits(num) {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/[0-9]/g, (w) => arabicDigits[+w]);
}

// --- Birthday Celebration (Easter Egg) ---

let _fireworksRAF = null;
let _celebrationTimeout = null;

/**
 * Full-screen fireworks + confetti celebration for Mom's birthday.
 * Triggered when 4 June 1992 is converted in the Gregorian → Hijri tool.
 */
function launchBirthdayCelebration() {
  if (document.getElementById('celebration-overlay')) return; // already running

  const ar = state.currentLanguage === 'ar';
  const title = ar ? 'كل عام وأنتِ بخير يا أمي 💖' : 'Happy Birthday, Mom 💖';
  const sub = ar
    ? '٤ يونيو ١٩٩٢ — يوم ميلاد أغلى أم في الكون 👑💎'
    : 'June 4, 1992 — the birthday of the most precious mom in the world 👑💎';
  const closeLabel = ar ? 'إغلاق ✨' : 'Close ✨';

  // Drifting emoji confetti
  const emojis = ['💖', '🎉', '🎂', '👑', '💎', '✨', '🌹', '💝', '🥳', '💫'];
  let confetti = '';
  for (let i = 0; i < 18; i++) {
    const e = emojis[Math.floor(Math.random() * emojis.length)];
    const left = Math.random() * 100;
    const delay = (Math.random() * 6).toFixed(2);
    const dur = (5 + Math.random() * 7).toFixed(2);
    const size = (18 + Math.random() * 28).toFixed(0);
    confetti += `<span class="floating-emoji" style="left:${left}%;animation-delay:${delay}s;animation-duration:${dur}s;font-size:${size}px;">${e}</span>`;
  }

  const overlay = document.createElement('div');
  overlay.id = 'celebration-overlay';
  overlay.className = 'celebration-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'celebration-title');
  overlay.setAttribute('aria-describedby', 'celebration-sub');
  overlay._opener = document.activeElement;
  overlay.innerHTML = `
    <canvas id="fireworks-canvas" class="fireworks-canvas"></canvas>
    <div class="floating-emojis">${confetti}</div>
    <div class="celebration-content">
      <div class="celebration-emoji">🎂💖</div>
      <h2 id="celebration-title" class="celebration-title">${title}</h2>
      <p id="celebration-sub" class="celebration-sub">${sub}</p>
      <button class="celebration-close" type="button" onclick="closeBirthdayCelebration()">${closeLabel}</button>
    </div>
  `;
  document.body.appendChild(overlay);

  // Dismiss on background click (but not when interacting with the message)
  overlay.addEventListener('click', (ev) => {
    if (ev.target === overlay) closeBirthdayCelebration();
  });

  // Modal focus management: move focus in, trap Tab on the single button, Escape to close
  const closeBtn = overlay.querySelector('.celebration-close');
  if (closeBtn) closeBtn.focus();
  overlay.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      ev.preventDefault();
      closeBirthdayCelebration();
    } else if (ev.key === 'Tab') {
      ev.preventDefault();
      if (closeBtn) closeBtn.focus();
    }
  });

  startFireworks(overlay.querySelector('#fireworks-canvas'));
  _celebrationTimeout = setTimeout(closeBirthdayCelebration, 20000);
}

function closeBirthdayCelebration() {
  if (_fireworksRAF) {
    cancelAnimationFrame(_fireworksRAF);
    _fireworksRAF = null;
  }
  if (_celebrationTimeout) {
    clearTimeout(_celebrationTimeout);
    _celebrationTimeout = null;
  }
  const overlay = document.getElementById('celebration-overlay');
  if (!overlay) return;
  const canvas = overlay.querySelector('#fireworks-canvas');
  if (canvas && canvas._resizeHandler) {
    window.removeEventListener('resize', canvas._resizeHandler);
  }
  const opener = overlay._opener;
  overlay.classList.add('closing');
  setTimeout(() => overlay.remove(), 400);
  if (opener && typeof opener.focus === 'function') opener.focus();
}

/**
 * Canvas particle fireworks. Rockets rise, explode into colored sparks that
 * fall under gravity, leaving glowing trails.
 */
function startFireworks(canvas) {
  // Respect prefers-reduced-motion: keep the greeting/dialog/close, skip particles.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  const ctx = canvas.getContext('2d');
  const rand = (a, b) => a + Math.random() * (b - a);
  const colors = ['#fbbf24', '#f59e0b', '#ec4899', '#a855f7', '#06b6d4', '#22d3ee', '#ef4444', '#fde68a', '#34d399'];
  const DT = 0.5; // slow-motion factor — lower = slower fireworks

  let W, H;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  canvas._resizeHandler = resize;
  window.addEventListener('resize', resize);

  const rockets = [];
  const sparks = [];

  function launchRocket() {
    const tx = rand(W * 0.15, W * 0.85);
    rockets.push({ x: tx, y: H + 10, tx, ty: rand(H * 0.12, H * 0.45), vy: rand(-8.5, -6), color: colors[Math.floor(Math.random() * colors.length)] });
  }

  function explode(x, y, color) {
    const count = 60 + Math.floor(Math.random() * 50);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2) * (i / count);
      const speed = rand(0.6, 3.6);
      sparks.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, decay: rand(0.004, 0.01), color: Math.random() < 0.25 ? '#ffffff' : color, size: rand(1.5, 3.5) });
    }
  }

  let frame = 0;
  function tick() {
    frame++;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(3, 7, 18, 0.16)';
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    if (frame % 80 === 0) launchRocket();

    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.x += (r.tx - r.x) * 0.04 * DT;
      r.y += r.vy * DT;
      r.vy += 0.045 * DT;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = r.color;
      ctx.fill();
      if (r.vy >= 0 || r.y <= r.ty) {
        explode(r.x, r.y, r.color);
        rockets.splice(i, 1);
      }
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      const p = sparks[i];
      p.x += p.vx * DT;
      p.y += p.vy * DT;
      p.vy += 0.022 * DT;
      p.vx *= 0.995;
      p.vy *= 0.995;
      p.life -= p.decay * DT;
      if (p.life <= 0) { sparks.splice(i, 1); continue; }
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    _fireworksRAF = requestAnimationFrame(tick);
  }

  // Opening volley
  for (let k = 0; k < 6; k++) {
    setTimeout(() => explode(rand(W * 0.2, W * 0.8), rand(H * 0.2, H * 0.45), colors[Math.floor(Math.random() * colors.length)]), k * 760);
  }
  tick();
}

// --- Preference Persistence ---

const PREFS_KEY = 'hijri-cal-prefs';

function savePreferences() {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify({
      calendarSystem: state.calendarSystem,
      offsetCorrection: state.offsetCorrection,
      currentLanguage: state.currentLanguage
    }));
  } catch (e) {
    // Storage may be unavailable (private mode / quota); preferences just
    // won't persist, which is non-fatal.
  }
}

function loadPreferences() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return;
    const p = JSON.parse(raw);
    if (p.calendarSystem && locales.en.calMethods[p.calendarSystem]) {
      state.calendarSystem = p.calendarSystem;
    }
    if (typeof p.offsetCorrection === 'number') {
      state.offsetCorrection = p.offsetCorrection;
    }
    if (p.currentLanguage && locales[p.currentLanguage]) {
      state.currentLanguage = p.currentLanguage;
    }
  } catch (e) {
    // Ignore corrupt stored value.
  }
}

// --- Service Worker Registration ---

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('[Service Worker] Registered successfully:', reg.scope))
      .catch((err) => console.error('[Service Worker] Registration failed:', err));
  }
}

// --- Initialization ---

window.addEventListener('DOMContentLoaded', () => {
  // Register the service worker FIRST, so an unexpected render error can never
  // prevent the app from being installable / working offline.
  registerServiceWorker();

  // Restore saved preferences before any conversion runs (calendar system and
  // offset both affect the computed Hijri date).
  loadPreferences();

  // Reflect restored preferences in the controls.
  const calSelect = document.getElementById('select-cal-method');
  const offsetSelect = document.getElementById('select-offset');
  if (calSelect) calSelect.value = state.calendarSystem;
  if (offsetSelect) offsetSelect.value = String(state.offsetCorrection);
  updateLangToggleLabel();

  // Sync state to today's date
  const now = new Date();
  const todayHijri = gregorianToHijri(now);

  state.currentHijriYear = todayHijri.year;
  state.currentHijriMonth = todayHijri.month;
  state.currentHijriDay = todayHijri.day;

  state.selectedHijriYear = todayHijri.year;
  state.selectedHijriMonth = todayHijri.month;
  state.selectedHijriDay = todayHijri.day;

  // Set default Gregorian date (today) in converter — Day / Month / Year
  populateGregorianMonthDropdown();
  const gDayEl = document.getElementById('input-greg-day');
  const gMonthEl = document.getElementById('input-greg-month');
  const gYearEl = document.getElementById('input-greg-year');
  if (gDayEl) gDayEl.value = now.getDate();
  if (gMonthEl) gMonthEl.value = now.getMonth() + 1;
  if (gYearEl) gYearEl.value = now.getFullYear();

  // Set form defaults in Hijri converter
  document.getElementById('input-hijri-year').value = todayHijri.year;
  populateHijriMonthDropdown();
  document.getElementById('input-hijri-month').value = todayHijri.month;
  document.getElementById('input-hijri-day').value = todayHijri.day;

  // Apply initial RTL direction and language attributes
  document.documentElement.lang = state.currentLanguage;
  document.documentElement.dir = state.currentLanguage === 'ar' ? 'rtl' : 'ltr';
  document.body.dir = state.currentLanguage === 'ar' ? 'rtl' : 'ltr';

  // Run render engines
  translateUI();
  renderCalendarGrid();  renderHolidaysList();

  // Today badge (date only — refresh occasionally so it rolls over at midnight)
  updateTodayBadge();
  setInterval(updateTodayBadge, 60000);
});
