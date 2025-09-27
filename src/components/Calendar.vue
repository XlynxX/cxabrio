<template>
  <div class="flex mx-auto max-w-fit">
    <div>
      <div class="pt-28 mt-[8px]">
        <!-- Ось времени слева -->
        <div v-if="layout === 'today'" class="flex flex-col items-center h-full">
          <div v-for="hour in hours" :key="hour" class="text-center border-t py-1 w-16">
            {{ hour }}:00
          </div>
        </div>
      </div>

    </div>
    <div class="p-4 max-md:p-2 max-w-6xl bg-[#13151B]">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex gap-2">
          <button @click="prevMonth" class="btn text-white bg-zinc-800 hover:bg-zinc-700 rounded px-3 py-1">←</button>
          <h2 class="text-lg font-semibold text-white">{{ monthYear }}</h2>
          <button @click="nextMonth" class="btn text-white bg-zinc-800 hover:bg-zinc-700 rounded px-3 py-1">→</button>
        </div>
        <div class="flex gap-2">
          <button @click="today" class="btn text-white bg-zinc-800 hover:bg-zinc-700 rounded px-3 py-1">Сегодня</button>
          <button @click="layout = 'week'"
            class="btn text-white bg-zinc-800 hover:bg-zinc-700 rounded px-3 py-1">Неделя</button>
          <button @click="layout = 'month'"
            class="btn text-white bg-zinc-800 hover:bg-zinc-700 rounded px-3 py-1">Месяц</button>
        </div>
      </div>

      <div v-if="layout === 'month'">
        <!-- Days of the week -->
        <div class="grid grid-cols-7 text-center text-sm font-medium border-b pb-1">
          <div v-for="(d, i) in weekDays" :key="i" class="uppercase text-white">
            {{ getShortDayName(d) }}
          </div>
        </div>

        <!-- Grid of days -->
        <div class="grid grid-cols-7 gap-px bg-[#404147] mt-1">
          <div v-for="(day, i) in calendarDays" :key="i"
            class="min-h-[120px] md:min-w-[144px] md:max-w-[144px] bg-[#13151B] p-1 relative"
            :class="{ 'bg-zinc-800 crossed': day.isOtherMonth, 'crossed': day.isDayOff, 'border-2 border-fuchsia-600': isToday(day.date) }">
            <div :class="{
              'text-white font-semibold': isToday(day.date),
              'text-gray-300': !isToday(day.date)
            }">
              {{ day.date.getDate() }}
            </div>

            <!-- Display shifts inside the day -->
            <div class="mt-2 space-y-1">
              <div v-for="(shift, idx) in day.shifts" :key="idx" class="shift-container px-2 max-md:px-0">
                <div
                  @mouseover="dayMouseOver = true; loadDayMouseOver()" @mouseleave="dayMouseOver = false"
                  v-if="(shift.hours > 0 || shift.isDayOff == false) && (day.isFullDayAbsence == false && day.totalHours > 0)"
                  :class="shift.color + ' p-2 rounded text-white text-xs font-medium leading-tight'">
                  <div class="text-[15px] font-semibold max-md:hidden">{{ shift.label }}</div>
                  <div class="text-[15px] font-semibold md:hidden">{{ shift.shortLabel }}</div>
                  <div class="text-[13px]">{{ shift.time }}</div>
                  <div class="text-[12px]">{{ shift.hours }} h</div>
                </div>

                <div v-if="day.isFullDayAbsence == true"
                  :class="shift.absences[0].color + 'rounded text-white text-xs font-medium leading-tight'">
                  <div class="text-[15px] font-semibold max-md:hidden">{{ shift.absences[0].Name }}</div>
                  <div class="text-[15px] font-semibold md:hidden">{{ shift.absences[0].ShortName }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="layout === 'today'">
        <!-- Days of the week -->
        <div class="grid grid-cols-7 text-center text-sm font-medium border-b pb-1">
          <div v-for="(d, i) in weekDays" :key="i" class="uppercase text-white md:min-w-[144px] md:max-w-[144px]">
            {{ getShortDayName(d) }}
          </div>
        </div>

        <div class="grid grid-cols-7 gap-4 mt-8 relative">
          <!-- Ось времени слева -->
          <!-- <div class="flex flex-col items-center h-full">
            <div v-for="hour in hours" :key="hour" class="text-center border-t py-1 w-16">
              {{ hour }}:00
            </div>
          </div> -->

          <!-- Текущая линия времени -->
          <div class="absolute top-0 left-0 w-full" :style="lineStyle"></div>

          <!-- Таблица с днями недели -->
          <div v-for="(day, index) in daysOfWeek" :key="index" class="border p-2 relative h-full">
            <div class="text-center font-bold">{{ day }}</div>
            <div class="mt-2 relative">
              <!-- Почасовое расписание -->
              <!-- Раскомментировать при необходимости -->
              <!-- <div v-for="hour in hours" :key="hour" class="border-t relative">
          <div class="flex items-center justify-between">
            <div v-for="(event, idx) in getEventsForHour(hour, index)" :key="idx"
              :class="eventClass(event.type)">
              <div :style="eventStyle(event, hour)">
                {{ event.name }}
              </div>
            </div>
          </div>
        </div> -->
            </div>
          </div>
        </div>

      </div>
    </div>
    <div>
      <div class="salary-slip max-md:hidden p-4 max-md:p-2 max-w-6xl bg-[#13151B]">
        <h2 class="text-lg font-semibold text-white">Зарплатный лист</h2>
        <p>Дневных часов: {{ dayHours }}</p>
        <p>Ночных часов: {{ nightHours }}</p>
        <p class="line-through">Овертайм часов: {{ overtimeHours }}</p>
        <p>Всего часов: {{ allHours }}</p>
        <p>Ставка: {{ payRate.toPrecision(3) }}</p>

        <div class="mt-2">
          <div class="w-3/4 items-center flex">
            <label for="bonus" class="block">Бонус:</label>
            <input id="bonus" type="number" v-model.number="bonus"
              class="text-white bg-[#13151B] rounded ml-2 px-2 w-full" placeholder="Бонус" />
          </div>

          <label for="nonTaxableMinimum" class="block">Необлагаемый минимум:</label>

          <!-- Поле для необлагаемого минимума -->
          <input id="nonTaxableMinimum" type="number" v-model.number="nonTaxableMinimum"
            class="text-white text-center bg-[#13151B] rounded px-2 py-1 w-3/4 mt-0.5 border" placeholder="Необлагаемый минимум" />
        </div>

        <div
          class="py-2 w-2/3 flex items-center text-sm text-white before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-white dark:before:border-neutral-600 dark:after:border-neutral-600">
          Итого</div>
        <p>Брутто: {{ (brutto + bonus).toFixed(2) }} € ({{ brutto.toFixed(2) }} + <span class=" text-yellow-400">{{
          bonus }}</span>)</p>
        <p>Нетто: {{ netto }} €</p>

        <div class="mt-4 text-sm text-white max-w-56">
          * Калькулятор не считает овертаймы, праздничные часы, больничные, отпуска и VTO.<br><br>
        </div>
      </div>
      <div class="salary-slip max-md:hidden p-4 max-md:p-2 max-w-6xl bg-[#13151B]">
        <!-- <h2 class="text-lg font-semibold text-white">Праздники</h2> -->
        <div class="tavi-calendar" v-html="htmlStringContent" />
      </div>
    </div>
  </div>
  <div class="bg-[#13151B] text-white text-center font-extralight p-4 mt-4">
    <p>Made with <b class="text-red-500">❤</b> by XlynxX</p>
  </div>
  <!-- <div v-show="dayMouseOver" class="tooltip">Hover over me
    <span class="tooltiptext">Some tooltip text</span>
  </div>  -->
  <CursorTooltip v-show="dayMouseOver" />
</template>

<script setup>
import moment from 'moment'
import { ref, computed, onMounted } from 'vue'
import { fetchMonthData, fetchWeekData, fetchTeamsAndGroups, fetchTeamSchedule } from '@/services/teleoptiService'
import { fetchWorkingCalendarHolidays } from '@/services/calendarService'
import { calculateNettoSalary } from '@/services/salaryTaxCalculator'
import CursorTooltip from '@/components/CursorTooltip.vue'

const shifts = ref([])  // Track shifts
const htmlStringContent = ref('');
const layout = ref('month');
const salary = ref(814);
const payRate = ref(0);
const yearPayRate = ref(0);
const dayMouseOver = ref(false);

const hours = ref(Array.from({ length: 24 }, (_, i) => i)); // Hours 0-23
const daysOfWeek = ref(['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']);

const dayHours = ref(0)
const nightHours = ref(0)
const overtimeHours = ref(0)
const allHours = ref(0)
const nonTaxableMinimum = ref(510);
const bonus = ref(0);

const brutto = ref(0);
const netto = ref(0);

const current = ref(new Date())
const sl = ref([]);

const schedule = ref([
  { name: 'Training', type: 'training', hour: 0, duration: 1 }, // 1 hour
  { name: 'Training', type: 'training', hour: 1.25, duration: 1.45 }, // 1 hour
  { name: 'Lunch', type: 'lunch', hour: 3, duration: 0.5 }, // 30 minutes
  { name: 'Training', type: 'training', hour: 3.5, duration: 1 }, // 1 hour
  { name: 'Health & Safety', type: 'safety', hour: 4.5, duration: 1 }, // 1 hour
  { name: 'Ready', type: 'ready', hour: 5.5, duration: 1.5 }, // 1 hour
  { name: 'Training', type: 'training', hour: 7, duration: 1 }, // 1 hour
]);

// Function to determine event style (position and size)
function eventStyle(event, hour) {
  const height = event.duration * 60; // Convert duration from hours to minutes
  const top = (event.hour - 0) * 60; // Position from top in minutes
  return {
    position: 'absolute',
    top: `${top}px`, // Top position of the event
    height: `${height}px`, // Event height based on its duration
    width: '100%',
  };
}

async function loadDayMouseOver() {
  const data = await fetchTeamsAndGroups(current.value.getTime())
  const teams = data.teams[0].children.map(i => i.id);

  console.log(teams);
  
  
  const teamSchedule = await fetchTeamSchedule(current.value.getTime(), teams);
}

function getEventsForHour(hour, dayIndex) {
  return schedule.value.filter(event => event.hour === hour);
}

function eventClass(type) {
  switch (type) {
    case 'night': return 'bg-blue-500 text-white';
    case 'morning': return 'bg-blue-300 text-white';
    case 'evening': return 'bg-blue-400 text-white';
    case 'training': return 'bg-teal-400 text-white';
    case 'ready': return 'bg-green-400 text-white';
    case 'lunch': return 'bg-yellow-400 text-black';
    case 'safety': return 'bg-orange-400 text-white';
    default: return '';
  }
}

const lineStyle = computed(() => {
  const currentTime = new Date();
  const currentTimeInMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const position = (currentTimeInMinutes / 1440) * 100; // Position of the current time in percentage (1440 minutes in a day)
  return {
    position: 'absolute',
    top: `${position}%`,
    left: '0',
    width: '100%',
    borderTop: '2px dashed red', // Red dashed line for current time
  };
});



async function today() {
  const data = await fetchWeekData(current.value.getTime())
  console.log(data);

  current.value = new Date();
  layout.value = 'today'
}

// Function to format and update shifts after fetching the data
const updateShifts = (scheduleData) => {
  shifts.value = scheduleData.ScheduleDays.map(day => {
    const colorMapping = {
      'rgb(0,0,139)': 'bg-[#1E2B4D]',
      'rgb(0,192,0)': 'bg-green-500',
      'rgb(255,128,0)': 'bg-orange-500',
      'rgb(255,255,0)': 'bg-yellow-600',
      'rgb(173,216,230)': 'bg-[#0E3746] text-black', // Example mapping for light blue
    }

    // console.log('day', day);


    return {
      date: day.FixedDate,
      label: day.Shift.Name,
      shortLabel: day.Shift.ShortName,
      time: day.Shift.TimeSpan,
      hours: parseInt(day.Shift.WorkingHours),
      color: colorMapping[day.Shift.Color] || 'bg-gray-500',
      isDayOff: day.IsDayOff,
      overtimes: day.Overtimes,
      absences: day.Absences,
    }
  })
}

// Initial data fetching
onMounted(async () => {
  if (!localStorage.getItem('teleoptiCookie') || localStorage.getItem('teleoptiCookie') === null || localStorage.getItem('teleoptiCookie') === undefined) {

    // If no teleoptiCookie in localStorage, ask the user to set it
    let userChoice = prompt("Insert your token!");
    localStorage.setItem('teleoptiCookie', userChoice);
  }

  // Get the month from the URL or default to the current date
  const urlParams = new URLSearchParams(window.location.search);
  const storedDate = urlParams.get('month');
  if (storedDate) {
    current.value = new Date(storedDate);
  }

  // console.log('Night hours 08:00 – 16:30:', countNightHours('08:00', '16:30'));
  // console.log('Night hours 22:00 – 06:00:', countNightHours('22:00', '06:00'));
  // console.log('Night hours 20:00 – 04:00:', countNightHours('20:00', '04:00'));
  // console.log('Night hours 00:00 – 08:00:', countNightHours('00:00', '08:00'));
  // console.log('Night hours 18:00 – 02:00:', countNightHours('18:00', '02:00'));
  // console.log('Night hours 22:00 – 08:00:', countNightHours('22:00', '08:00'));

  refreshData();
})

// Weekdays for header
const weekDays = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье']

const monthYear = computed(() =>
  current.value.toLocaleString('ru', { month: 'long', year: 'numeric' })
)

const startOfMonth = computed(() => new Date(current.value.getFullYear(), current.value.getMonth(), 1))
const endOfMonth = computed(() => new Date(current.value.getFullYear(), current.value.getMonth() + 1, 0))

const calendarDays = computed(() => {
  const startDay = startOfMonth.value.getDay() || 7;
  const totalDays = endOfMonth.value.getDate();
  const currMonthHours = { day: 0, night: 0, overtime: 0, all: 0 };
  const salary = { brutto: 0, netto: 0 };
  const days = [];

  const getMatchedShifts = (date) => shifts.value.filter((s) => new Date(s.date).toLocaleDateString() === date.toLocaleDateString());
  const getAbsences = (matchedShifts) => matchedShifts.length > 0 && Array.isArray(matchedShifts[0].absences) ? matchedShifts[0].absences : [];

  const addDay = (date, isOtherMonth) => {
    const matchedShifts = getMatchedShifts(date);
    const absences = getAbsences(matchedShifts);
    let totalHours = 0;

    if (isOtherMonth && matchedShifts.length > 0) {
      let _hours = calculateHours(matchedShifts[0].date, matchedShifts[0].time);
      totalHours = _hours.totalHours;
    }

    if (!isOtherMonth && matchedShifts.length > 0) {
      const hours = matchedShifts[0].hours;
      // currMonthHours.all += hours;

      console.log('matchedShifts', matchedShifts);
      let _hours = calculateHours(matchedShifts[0].date, matchedShifts[0].time, absences);
      totalHours = _hours.totalHours;
      currMonthHours.all += _hours.totalHours;
      currMonthHours.night += _hours.nightHours;
      currMonthHours.day += (_hours.totalHours - _hours.nightHours);
      if (!matchedShifts[0].isDayOff || absences.length < 1) {
        // console.log(_hours.totalHours - 0.5, matchedShifts[0].hours, (_hours.totalHours - 0.5) - matchedShifts[0].hours);
        currMonthHours.overtime += ((_hours.totalHours) - matchedShifts[0].hours);
      }

      console.log(_hours.salary);

      salary.brutto += _hours.salary.brutto;
      salary.netto += _hours.salary.netto;
    }

    days.push({
      date,
      isOtherMonth,
      shifts: matchedShifts,
      totalHours: totalHours,
      isDayOff: matchedShifts.length > 0 ? matchedShifts[0]?.isDayOff : false,
      isFullDayAbsence: absences.length > 0 ? absences[0]?.IsFullDayAbsence : false
    });
  };

  // Process days for the start of the month
  for (let i = 1; i < startDay; i++) {
    const date = new Date(startOfMonth.value.getFullYear(), startOfMonth.value.getMonth(), i - startDay + 1);
    addDay(date, true);
  }

  // Process days for the current month
  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(current.value.getFullYear(), current.value.getMonth(), i);
    addDay(date, false);
  }

  // Fill in the remaining days of the week after the current month
  let i = 1;
  while (days.length % 7 !== 0) {
    const date = new Date(current.value.getFullYear(), current.value.getMonth() + 1, i);
    addDay(date, true);
    i++;
  }

  allHours.value = currMonthHours.all;
  dayHours.value = currMonthHours.day;
  nightHours.value = currMonthHours.night;
  overtimeHours.value = currMonthHours.overtime;

  brutto.value = salary.brutto;
  netto.value = calculateNettoSalary(salary.brutto, bonus.value, nonTaxableMinimum.value).Netto;

  console.log('salary', sl.value);

  return days;
});

function calculateHours(date, time, absences = []) {
  console.error('DATQE', date);
  if (!time && absences.length < 1) return { totalHours: 0, nightHours: 0, salary: { brutto: 0, netto: 0 } };
  console.error('DATQE', date);

  let doCalculations = true;

  const salary = {
    brutto: 0,
    netto: 0
  }

  let totalHours = 0;
  let nightHours = 0;

  if (absences.length > 0) {
    absences.forEach(absence => {
      if (absence.IsFullDayAbsence) {

        if (absence.Name === 'LVA Sick Leave Unpaid D1') {
          sl.value.push(['duration', 0, 'date:', date, 'absences:', absences]);
          doCalculations = false;
          totalHours = 0;
          nightHours = 0;
        }

        //TODO
        if (absence.Name === 'LVA Sick Leave Paid') {
          sl.value.push(['duration', 0, 'date:', date, 'absences:', absences]);
          doCalculations = false;
          totalHours = 0;
          nightHours = 0;
        }
      }
    });
  }

  let isNightShift = false;
  if (doCalculations && time) {
    // Split the time range into start and end times
    let [startTime, endTime] = time.split('+')[0].split(' – ');

    // Combine the date with the time to create full datetime strings
    const startDateTime = moment(`${date} ${startTime}`, 'YYYY-MM-DD hh:mm');
    let endDateTime = moment(`${date} ${endTime}`, 'YYYY-MM-DD hh:mm');

    // Check if endTime is on the next day (end time earlier than start time)
    if (endDateTime.isBefore(startDateTime)) {
      endDateTime = endDateTime.add(1, 'days'); // Add 1 day to the end time to adjust
    }

    // Calculate total hours
    const duration = moment.duration(endDateTime.diff(startDateTime));
    sl.value.push(['duration', duration.asHours(), 'date:', date, 'absences:', absences]);
    console.log('duration', duration.asHours(), 'date:', date);
    totalHours = duration.asHours() - 0.5; // Subtract 0.5 hours for lunch break

    // Define night working hours: 22:00 - 06:00
    const nightStart = moment(`${date} 22:00`, 'YYYY-MM-DD hh:mm');
    const nightEnd = moment(`${date} 06:00`, 'YYYY-MM-DD hh:mm').add(1, 'days'); // The 06:00 is on the next day

    // Check if the shift overlaps with night hours and calculate the overlapping duration
    if (startDateTime.isBefore(nightEnd) && endDateTime.isAfter(nightStart)) {
      // The shift overlaps with the night time range, calculate the overlap

      // Get the effective start and end of the overlap
      const effectiveStart = moment.max(startDateTime, nightStart);
      const effectiveEnd = moment.min(endDateTime, nightEnd);

      // Calculate the duration of the overlap in hours
      const duration = moment.duration(effectiveEnd.diff(effectiveStart));
      nightHours = duration.asHours();
    }

    // Handle edge case where shift starts at midnight (00:00)
    if (startDateTime.hour() === 0 && startDateTime.minute() === 0) {
      isNightShift = true;
      // If the shift starts at 00:00, consider it part of the night shift (from 22:00 of the previous day to 06:00)

      // Adjust night start to 22:00 of the previous day (nightStartAtNextDay)
      const nightStartAtNextDay = moment(`${date} 22:00`, 'YYYY-MM-DD hh:mm').subtract(1, 'days');
      const nightEndTime = moment(`${date} 06:00`, 'YYYY-MM-DD hh:mm');

      // Get the effective start and end of the overlap
      const effectiveStart = moment.max(startDateTime, nightStartAtNextDay);
      const effectiveEnd = moment.min(endDateTime, nightEndTime);

      // Calculate the duration of the overlap in hours
      const duration = moment.duration(effectiveEnd.diff(effectiveStart));
      nightHours = duration.asHours();
    }
  }

  nightHours = nightHours > 2 ? nightHours : 0; // Set night hours to 0 if less than 2 hours
  
  // If night hours are exactly 6 and the shift starts at midnight, adjust night hours to 5.5
  if (nightHours === 6 && isNightShift) {
    nightHours = 5.5; // Adjust night hours to 5.5 if exactly 6 hours
  }

  salary.brutto = (totalHours * payRate.value) + (nightHours * (yearPayRate.value * 0.5));

  console.log('Total hours:', totalHours);
  console.log('Night shift hours:', nightHours);

  return { totalHours, nightHours, salary };
}

// Function to get short names for the weekdays (only for mobile)
const getShortDayName = (day) => {
  const isMobile = window.innerWidth <= 768; // Check if the screen is mobile
  if (isMobile) {
    switch (day) {
      case 'понедельник': return 'Пн';
      case 'вторник': return 'Вт';
      case 'среда': return 'Ср';
      case 'четверг': return 'Чт';
      case 'пятница': return 'Пт';
      case 'суббота': return 'Сб';
      case 'воскресенье': return 'Вс';
      default: return day;
    }
  }
  return day; // Return full day names for larger screens
}

async function refreshData() {
  const calendar = await fetchWorkingCalendarHolidays(current.value.getFullYear());

  const monthHours = [];

  for (let i = 0; i < calendar.length; i++) {
    let html = calendar[i].innerHTML;

    // Remove the entire <ul class="monthDetails"> and its contents
    html = html.replace(/<ul class="monthDetails">.*?<\/ul>/s, '');

    // Remove the <span class="star"> and its content (the '*' symbol)
    html = html.replace(/<span class="star">\*<\/span>/g, '');

    // Use a regex to match the total working hours in the <p> tag after removing <ul class="monthDetails">
    let totalWorkingHoursPattern = /<p>.*?(\d+)\s*darba stunda.*?<\/p>/;

    // Match against the <p> element that contains total working hours (e.g., "151 darba stunda")
    let totalWorkingHours = html.match(totalWorkingHoursPattern);

    // Extract the working hours number from the match
    let numberOfWorkingHours = totalWorkingHours ? parseInt(totalWorkingHours[1], 10) : null;

    monthHours[i] = numberOfWorkingHours;
  }

  htmlStringContent.value = calendar[current.value.getMonth()].innerHTML;
  const workingHours = monthHours[current.value.getMonth()];
  const yearWorkingHours = monthHours.reduce((a, b) => a + b, 0);
  console.log("Working Hours: ", workingHours);
  console.log("Working Year Hours: ", yearWorkingHours, monthHours);

  // payRate.value = salary.value / numberOfWorkingHours;
  payRate.value = parseFloat((salary.value / workingHours));
  yearPayRate.value = parseFloat(salary.value / (yearWorkingHours / 12));

  const data = await fetchMonthData(current.value.getTime())
  updateShifts(data)
}

// Month navigation
async function nextMonth() {
  current.value = new Date(current.value.setMonth(current.value.getMonth() + 1))
  updateURL();
  refreshData();
}

async function prevMonth() {
  current.value = new Date(current.value.setMonth(current.value.getMonth() - 1))
  updateURL();
  refreshData();
}

function updateURL() {
  const url = new URL(window.location);
  url.searchParams.set('month', current.value.toISOString()); // Store the full date in ISO format
  window.history.pushState({}, '', url); // Update the URL without reloading the page
}

function MonthToUnix() {
  return current.value.getTime();
}

function isToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

</script>

<style scoped>
/* Shift color classes */
.shift-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.shift-evening-early {
  background-color: #5a4e7d;
  /* Evening Early Color */
  color: white;
}

.shift-night {
  background-color: #4c3c64;
  /* Night Color */
  color: white;
}

.shift-morning {
  background-color: #4a7e8c;
  /* Morning Color */
  color: white;
}

.shift-late-night {
  background-color: #392f5d;
  /* Late Night Color */
  color: white;
}

.crossed {
  background-size: 11px 11px;
  background-image: linear-gradient(135deg, transparent, transparent 7px, rgba(109, 109, 109, 0.3) 8px, transparent 8px, transparent);
}

.tavi-calendar :deep(table) {
  border-collapse: collapse;
  margin-bottom: 7px;
}

.tavi-calendar :deep(table) th {
  background-color: #ec9200;
  color: #fff;
  font-weight: bold;
}

.tavi-calendar {
  width: 175px;
}

.tavi-calendar :deep(table td) {
  background-color: white;
  color: #000;
}

.tavi-calendar :deep(table) .other_month {
  color: #ccc;
}

.tavi-calendar :deep(table) .information {
  background-color: #fadaa7;
}

.tavi-calendar :deep(table) .weekend {
  background-color: #ccc;
  color: #000;
}

.tavi-calendar :deep(table) .holiday {
  background-color: #f05a28;
  color: #fff;
}

.tavi-calendar :deep(h3) {
  color: #ec9200;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 7px;
}

.tavi-calendar :deep(table tbody tr td) {
  height: 20px;
  width: 25px;
  font-size: 12px;
  text-align: center;
  vertical-align: middle;
  line-height: 20px;
  border: 1px solid #000;
}

.tavi-calendar :deep(ul) {
  display: none;
}

.tavi-calendar :deep(p) {
  font-size: 12px !important;
  line-height: 15px !important;
  text-align: justify;
  color: white;
}

.tavi-calendar :deep(.calCell) {
  color: #ec9200;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 7px;
}

.tavi-calendar :deep(.calMore) {
  display: none;
  background-color: #ec9200;
  color: #fff;
  float: right;
  padding: 5px;
  border-radius: 5px;
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
}

/* Tooltip container */
.tooltip {
  position: absolute;
  display: inline-block;
  border-bottom: 1px dotted black; /* Add dots under the hoverable text */
  cursor: pointer;
}

/* Tooltip text */
.tooltiptext {
  visibility: hidden; /* Hidden by default */
  width: 130px;
  background-color: black;
  color: #ffffff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  position: absolute;
  z-index: 1; /* Ensure tooltip is displayed above content */
}

/* Show the tooltip text on hover */
.tooltip:hover .tooltiptext {
  visibility: visible;
}

/* Add mobile styles if necessary */
/* @media (max-width: 768px) {
    .grid-cols-7 {
      grid-template-columns: repeat(7, 1fr);
    }
  } */
</style>