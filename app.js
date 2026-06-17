const START_DATE = '2026-06-04';
const EXAM_DATE = '2026-08-17';
const STORAGE_KEY = 'ielts_study_hub_v1';

const PHASES = [
  { id: 1, start: 1, end: 21, label: '补基础 + 补诊断', target: 'L 4.5–5.0 · R 5.0', detail: '补齐 Task 2 与 Speaking 评分；建立听力、阅读错题记录。' },
  { id: 2, start: 22, end: 49, label: '上雅思主线', target: 'L 5.5 · R 5.5 · W 5.5', detail: '剑桥真题成为主线；写作、口语保持稳定输出。' },
  { id: 3, start: 50, end: 70, label: '冲 6.0，试探 6.5', target: 'L/R 6.0 · W/S 5.5', detail: '模考日与补丁日交替，只修复真实暴露的问题。' },
  { id: 4, start: 71, end: 75, label: '收口与调整', target: '稳定状态 · 不学新内容', detail: '只复盘错题、高频词、口语故事与写作错误。' }
];

const CHECKPOINTS = {
  7:  { title: '补齐四科诊断', target: 'T2 与 Speaking 完成评分；L/R 各分析一次错题。' },
  14: { title: 'Week 2 基础检查', target: 'VOA 听懂 60%；阅读词辨识率 ≥40%；基本句型写对。' },
  21: { title: '第一阶段考核', target: '听力词听写 ≥70%；阅读词辨识 ≥60%；T2 写到 180 词。' },
  28: { title: 'Week 4 考核', target: '听力词 120/150；VOA 裸听 70%；Part 1 能简单回答。' },
  42: { title: 'Week 6 考核', target: 'L S1 ≥6/10；R P1 ≥8/13；T1 限时写完 150 词。' },
  49: { title: '第二阶段考核', target: 'L 5.5 · R 5.5 · W 5.5 · S 5.0–5.5。' },
  56: { title: 'Week 8 决策点', target: 'L/R 至少 6.0；未达标则锁定主目标 6.0。' },
  70: { title: '最终策略判断', target: 'L/R ≥6.0 且 W/S ≥5.5，才继续试探 6.5。' },
  75: { title: '考试日目标', target: 'L 6.0 · R 6.5 · W 5.5 · S 5.5 → Overall 6.0。' }
};

const PHASE_SCHEDULES = {
  1: [
    ['08:30','08:50','晨读','新概念或 VOA 文本出声读 3 遍',20],
    ['08:50','09:40','听力词','50 个：听音、反应、拼写',50],
    ['09:50','10:50','语法课','英语的平行世界 + 笔记',60],
    ['11:00','12:00','阅读词','80 个：遮中文自测',60],
    ['12:00','12:30','词汇复习','昨天与前天错词',30],
    ['13:30','14:20','慢速听力','VOA 裸听、文本、再听',50],
    ['14:30','15:20','分级阅读','阅读并闭书复述',50],
    ['15:30','16:20','语法造句','使用当天语法点写 15 句',50],
    ['16:30','17:10','雅思轻真题','L Section 1 或 R Passage 1',40],
    ['19:00','19:50','写作输出','Task 2 大纲或主体段',50],
    ['20:00','20:40','口语录音','Part 1 录音、回听、重录',40],
    ['20:40','21:00','每日复盘','记录错因与明日重点',20]
  ],
  2: [
    ['08:30','08:50','晨读','剑桥听力原文朗读',20],
    ['08:50','09:50','听力词 + 语料库','错词复测 + 王陆语料库',60],
    ['10:00','11:00','听力真题','做题、精听、错题分类',60],
    ['11:10','12:10','阅读词','真经继续推进',60],
    ['13:30','14:30','阅读真题','Passage 1/2：限时 + 精读',60],
    ['14:45','15:45','Writing Task 1','图表分类训练',60],
    ['16:00','17:00','Writing Task 2','大纲、主体段、完整作文',60],
    ['19:00','19:50','Speaking','Part 1 + Part 2 录音',50],
    ['20:00','20:40','错题归档','L/R 错因与同义替换',40],
    ['20:40','21:00','复习','错词、错句、口语素材',20]
  ],
  3: [
    ['08:30','11:10','模考 / 弱项补丁','全真计时或听力阅读错题修复',160],
    ['13:30','15:00','对答案 + 分类','每道错题标注错误类型',90],
    ['15:15','16:30','精听 / 精读','只练暴露出来的弱点',75],
    ['16:45','17:45','写作重写','修复最近作文高频错误',60],
    ['19:00','20:00','口语套题','Part 2 说满 90 秒',60],
    ['20:10','20:40','错题归档','记录今日高频错因',30]
  ],
  4: [
    ['09:00','10:00','错题本','翻高频错题，不碰新题',60],
    ['10:15','11:00','听力高频词','默写与复测',45],
    ['13:30','14:30','阅读同义替换','只复盘已有内容',60],
    ['15:00','16:00','写作错误清单','看错误与重写句',60],
    ['19:00','20:00','口语故事','背熟 5 个万能故事',60],
    ['20:10','20:30','作息检查','按考试时间调整睡眠',20]
  ]
};

const SCORE_TARGETS = { L: 6.0, R: 6.5, W: 5.5, S: 5.5 };
const SCORE_NAMES = { L: 'Listening', R: 'Reading', W: 'Writing', S: 'Speaking' };

let state = loadState();
let timerInterval = null;
let timerRemaining = 20 * 60;
let timerRunning = false;
let timerEndsAt = null;
let timerFinished = false;
let audioContext = null;
let lastScheduleMinute = '';

function loadState() {
  const defaults = {
    checkins: {},
    reviews: {},
    feedbacks: {},
    checkpointResults: {},
    scores: [{ date: '2026-06-03', l: 3.5, r: 4.5, w: 5.0, s: null, overall: null, note: '初始部分模考，Task 2 与 Speaking 待补齐' }]
  };
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return data ? { ...defaults, ...data } : defaults;
  } catch (_) {
    return defaults;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function localDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDate(value) {
  const [y,m,d] = value.split('-').map(Number);
  return new Date(y, m - 1, d, 12);
}

function addDays(value, days) {
  const date = parseDate(value);
  date.setDate(date.getDate() + days);
  return localDateString(date);
}

function diffDays(a, b) {
  return Math.round((parseDate(a) - parseDate(b)) / 86400000);
}

function currentDay() {
  return Math.min(75, Math.max(1, diffDays(localDateString(), START_DATE) + 1));
}

function phaseForDay(day) {
  return PHASES.find(p => day >= p.start && day <= p.end) || PHASES[3];
}

function tasksForDay(day) {
  const tasks = PHASE_SCHEDULES[phaseForDay(day).id];
  if (phaseForDay(day).id !== 3) return tasks;
  return tasks.map((task, index) => {
    if (index !== 0) return task;
    return day % 2 === 0
      ? [task[0],task[1],'全真模考日','L + R + W 全真计时',task[4]]
      : [task[0],task[1],'弱项补丁日','听力错题精听 + 阅读错题精读',task[4]];
  });
}

function dayCompletion(date = localDateString()) {
  const day = Math.min(75, Math.max(1, diffDays(date, START_DATE) + 1));
  const checks = state.checkins[date] || {};
  const total = tasksForDay(day).length;
  const done = Object.values(checks).filter(Boolean).length;
  return { done, total, pct: total ? Math.round(done / total * 100) : 0 };
}

function calculateStreak() {
  let streak = 0;
  let cursor = localDateString();
  if (dayCompletion(cursor).pct < 80) cursor = addDays(cursor, -1);
  while (streak < 75 && dayCompletion(cursor).pct >= 80) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function formatShortDate(value) {
  const d = parseDate(value);
  return `${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

function listeningBand(n) {
  if (n >= 39) return 9; if (n >= 37) return 8.5; if (n >= 35) return 8;
  if (n >= 32) return 7.5; if (n >= 30) return 7; if (n >= 26) return 6.5;
  if (n >= 23) return 6; if (n >= 18) return 5.5; if (n >= 16) return 5;
  if (n >= 13) return 4.5; if (n >= 10) return 4; if (n >= 7) return 3.5;
  return n >= 0 ? 3 : null;
}

function readingBand(n) {
  if (n >= 39) return 9; if (n >= 37) return 8.5; if (n >= 35) return 8;
  if (n >= 33) return 7.5; if (n >= 30) return 7; if (n >= 27) return 6.5;
  if (n >= 23) return 6; if (n >= 19) return 5.5; if (n >= 15) return 5;
  return n >= 10 ? 4 : 3;
}

function overallBand(values) {
  if (values.some(v => v === null || Number.isNaN(v))) return null;
  return Math.round((values.reduce((a,b) => a + b, 0) / 4) * 2) / 2;
}

function latestScore() {
  return state.scores[state.scores.length - 1] || {};
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove('show'), 2400);
}

function renderOverview() {
  const day = currentDay();
  const phase = phaseForDay(day);
  const completion = dayCompletion();
  const latest = latestScore();
  const daysLeft = Math.max(0, diffDays(EXAM_DATE, localDateString()));
  document.getElementById('heroPhase').textContent = `PHASE ${phase.id} · ${phase.label}`;
  document.getElementById('heroDay').textContent = String(day).padStart(2,'0');
  document.getElementById('todayPercent').textContent = completion.pct;
  document.getElementById('todayProgressBar').style.width = `${completion.pct}%`;
  // Exam countdown
  document.getElementById('countdownDays').textContent = daysLeft;
}

function timeToMinutes(value) {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

function renderCurrentTaskStatus(tasks) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const currentIndex = tasks.findIndex(task => nowMinutes >= timeToMinutes(task[0]) && nowMinutes < timeToMinutes(task[1]));
  const nextIndex = tasks.findIndex(task => timeToMinutes(task[0]) > nowMinutes);
  const currentLabel = document.getElementById('currentTaskLabel');
  const nextLabel = document.getElementById('nextTaskLabel');

  if (currentIndex >= 0) {
    currentLabel.textContent = `现在 · ${tasks[currentIndex][2]}`;
    nextLabel.textContent = nextIndex >= 0 ? `下一项 ${tasks[nextIndex][0]} · ${tasks[nextIndex][2]}` : '下一项 · 完成今日复盘';
  } else if (nextIndex >= 0) {
    currentLabel.textContent = nowMinutes < timeToMinutes(tasks[0][0]) ? '现在 · 准备开始' : '现在 · 休息 / 自由安排';
    nextLabel.textContent = `下一项 ${tasks[nextIndex][0]} · ${tasks[nextIndex][2]}`;
  } else {
    currentLabel.textContent = '现在 · 今日计划已结束';
    nextLabel.textContent = '下一项 · 保存复盘，为明天收尾';
  }

  return currentIndex >= 0 ? currentIndex : nextIndex >= 0 ? nextIndex : tasks.length - 1;
}

function renderToday() {
  const date = localDateString();
  const tasks = tasksForDay(currentDay());
  const checks = state.checkins[date] || {};
  const completion = dayCompletion();
  const doneCount = Object.values(checks).filter(Boolean).length;
  const stars = '⭐'.repeat(completion.done);
  document.getElementById('checkinCount').innerHTML = `${stars} ${completion.done}/${completion.total}`;

  // Group tasks by time block
  const blocks = { morning: [], afternoon: [], evening: [] };
  tasks.forEach((task, index) => {
    const hour = parseInt(task[0].split(':')[0]);
    if (hour < 12) blocks.morning.push({ task, index });
    else if (hour < 17) blocks.afternoon.push({ task, index });
    else blocks.evening.push({ task, index });
  });

  const labels = { morning: '☀️ 上午', afternoon: '🌤 下午', evening: '🌙 晚上' };
  let html = '';
  for (const [key, items] of Object.entries(blocks)) {
    if (!items.length) continue;
    const doneCount = items.filter(it => checks[it.index]).length;
    html += `<div class="task-group"><div class="task-group-label">${labels[key]} · ${doneCount}/${items.length}</div>`;
    html += items.map(({ task, index }) => `
      <button class="checkin-item ${checks[index] ? 'done' : ''}" data-checkin="${index}">
        <span><strong>${task[2]}</strong><small>${task[0]}–${task[1]} · ${task[3]}</small></span>
      </button>`).join('');
    html += '</div>';
  }
  document.getElementById('checkinList').innerHTML = html;

  const timerSelect = document.getElementById('timerTaskSelect');
  const previousSelection = timerSelect.value;
  timerSelect.innerHTML = tasks.map((task,index) =>
    `<option value="${index}" data-minutes="${task[4]}">${task[2]} · ${task[4]} 分钟</option>`).join('');
  const recommendedIndex = renderCurrentTaskStatus(tasks);
  timerSelect.value = [...timerSelect.options].some(option => option.value === previousSelection)
    ? previousSelection
    : String(recommendedIndex);
}

function toggleCheckin(index) {
  const date = localDateString();
  state.checkins[date] = state.checkins[date] || {};
  state.checkins[date][index] = !state.checkins[date][index];
  saveState();
  renderOverview();
  renderToday();
  renderDailyProgress();
}

function renderCheckpoint() {
  const day = currentDay();
  const nextDay = Object.keys(CHECKPOINTS).map(Number).find(d => d >= day) || 75;
  const next = CHECKPOINTS[nextDay];
  document.getElementById('nextCheckpoint').innerHTML = `
    <div class="checkpoint-main">
      <strong>${next.title}</strong><p>${next.target}</p>
    </div>
    <div class="checkpoint-list">
      <div><span>距离考核</span><span class="cp-val">${Math.max(0,nextDay-day)} 天</span></div>
      <div><span>当前阶段</span><span class="cp-val">${phaseForDay(day).label}</span></div>
      <div><span>阶段目标</span><span class="cp-val">${phaseForDay(day).target}</span></div>
    </div>`;
  // Update NEXT CHECK header with date
  document.querySelector('.sticky-note > span').innerHTML = `NEXT CHECK · DAY ${nextDay} ${formatShortDate(addDays(START_DATE,nextDay-1))}`;
  renderFeedback();
}

function renderFeedback() {
  const today = localDateString();
  const current = state.feedbacks[today];
  document.querySelectorAll('#feedbackRow .feedback-btn').forEach(btn => {
    btn.classList.toggle('picked', btn.dataset.feedback === current);
  });
}

function setFeedback(value) {
  state.feedbacks[localDateString()] = value;
  // If pass/fail on a checkpoint day, record it
  const day = currentDay();
  if (CHECKPOINTS[day] && (value === 'pass' || value === 'fail')) {
    state.checkpointResults[day] = value;
  }
  saveState();
  renderFeedback();
  renderRoadmap();
  const labels = { pass: '⭐ 达标！继续加油', fail: '💪 明天再战', skip: '😴 今日休息' };
  showToast(labels[value] || '已记录');
}

function renderScoreStrip() {
  const score = latestScore();
  document.getElementById('scoreStrip').innerHTML = Object.keys(SCORE_TARGETS).map(key => {
    const current = score[key.toLowerCase()] ?? null;
    const gap = current === null ? '待评分' : current >= SCORE_TARGETS[key] ? '已达标' : `差 ${(SCORE_TARGETS[key] - current).toFixed(1)}`;
    return `<div class="score-chip"><span>${SCORE_NAMES[key]}</span><strong>${current ?? '—'} → ${SCORE_TARGETS[key]}</strong><small>${gap}</small></div>`;
  }).join('');
}

function renderRoadmap() {
  const day = currentDay();
  document.getElementById('phaseTrack').innerHTML = PHASES.map(phase => `
    <article class="phase-block ${phase.id === phaseForDay(day).id ? 'current' : ''}">
      <span>DAY ${phase.start}–${phase.end}</span><strong>${phase.label}</strong>
      <small>${phase.target}<br>${phase.detail}</small>
    </article>`).join('');
  const nextDay = Object.keys(CHECKPOINTS).map(Number).find(d => d >= day) || 75;
  document.getElementById('checkpointTrack').innerHTML = Object.entries(CHECKPOINTS).map(([number,item]) => {
    const result = state.checkpointResults[number];
    const icon = result === 'pass' ? '<span class="checkpoint-status pass">⭐</span>'
      : result === 'fail' ? '<span class="checkpoint-status fail">💪</span>' : '';
    return `
    <article class="checkpoint-card ${Number(number) === nextDay ? 'next' : ''}">
      <span>DAY ${number} · ${formatShortDate(addDays(START_DATE,Number(number)-1))}</span>
      <strong>${item.title}${icon}</strong><small>${item.target}</small>
    </article>`;
  }).join('');
  renderDailyProgress();
}

function renderDailyProgress() {
  const today = localDateString();
  const endDay = currentDay();
  const records = Array.from({ length: endDay }, (_, index) => {
    const day = index + 1;
    const date = addDays(START_DATE, day - 1);
    return { day, date, ...dayCompletion(date) };
  });
  const visibleRecords = records.slice(-7);
  const studied = records.filter(record => record.pct > 0);
  const lastSeven = records.slice(-7);
  const average = lastSeven.length ? Math.round(lastSeven.reduce((sum, record) => sum + record.pct, 0) / lastSeven.length) : 0;
  const qualified = records.filter(record => record.pct >= 80).length;
  const best = records.reduce((current, record) => record.pct > current.pct ? record : current, records[0]);
  const bestLabel = best.pct > 0 ? `<b>${best.pct}</b>% · D${best.day}` : '暂无记录';
  const todayRecord = records[records.length - 1];
  const streak = calculateStreak();
  const statusFor = pct => pct >= 100 ? '全部完成' : pct >= 80 ? '今日达标' : pct >= 50 ? '稳步推进' : pct > 0 ? '已经开始' : '等待打卡';
  const weekdays = ['周日','周一','周二','周三','周四','周五','周六'];

  document.getElementById('progressHero').innerHTML = `
    <div class="progress-hero">
      <div class="progress-ring" style="--progress:${todayRecord.pct}"><span><strong>${todayRecord.pct}%</strong><small>TODAY</small></span></div>
      <div class="progress-hero-copy"><span>DAY ${todayRecord.day} · 今日进度</span><strong>${statusFor(todayRecord.pct)}</strong><small>已完成 ${todayRecord.done} / ${todayRecord.total} 项任务</small></div>
    </div>`;

  document.getElementById('progressSummary').innerHTML = `
    <div class="progress-stat"><span>近 7 日平均</span><strong><b>${average}</b>%</strong></div>
    <div class="progress-stat"><span>连续达标</span><strong><b>${streak}</b> 天</strong></div>
    <div class="progress-stat"><span>累计达到 80%</span><strong><b>${qualified}</b> 天</strong></div>
    <div class="progress-stat"><span>最佳完成记录</span><strong>${bestLabel}</strong></div>`;

  const width = Math.max(620, visibleRecords.length * 72);
  const height = 220;
  const left = 35;
  const right = 18;
  const top = 24;
  const bottom = 34;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const pointFor = (record, index) => ({
    ...record,
    x: left + (visibleRecords.length === 1 ? plotWidth / 2 : index * plotWidth / (visibleRecords.length - 1)),
    y: top + plotHeight - record.pct / 100 * plotHeight
  });
  const points = visibleRecords.map(pointFor);
  const pointString = points.map(point => `${point.x},${point.y}`).join(' ');
  const areaPoints = `${points[0].x},${top + plotHeight} ${pointString} ${points[points.length - 1].x},${top + plotHeight}`;
  const grid = [0,25,50,75,100].map(value => {
    const y = top + plotHeight - value / 100 * plotHeight;
    return `<line class="progress-grid-line" x1="${left}" y1="${y}" x2="${width-right}" y2="${y}"/><text class="progress-axis-text" x="4" y="${y+3}">${value}%</text>`;
  }).join('');
  const targetY = top + plotHeight - .8 * plotHeight;
  const pointNodes = points.map(point => `
    <circle class="progress-point ${point.date === today ? 'today' : ''}" cx="${point.x}" cy="${point.y}" r="4"/>
    <text class="progress-value-text" x="${point.x}" y="${Math.max(12,point.y-10)}" text-anchor="middle">${point.pct}%</text>
    <text class="progress-axis-text" x="${point.x}" y="${height-10}" text-anchor="middle">D${point.day}</text>`).join('');
  document.getElementById('dailyProgressChart').innerHTML = `
    <svg class="progress-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="近 7 日每日完成率趋势图">
      <defs><linearGradient id="progressGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#e85d75" stop-opacity=".22"/><stop offset="100%" stop-color="#e85d75" stop-opacity=".02"/></linearGradient></defs>
      ${grid}<line class="progress-target-line" x1="${left}" y1="${targetY}" x2="${width-right}" y2="${targetY}"/>
      <polygon class="progress-area" points="${areaPoints}"/><polyline class="progress-line-path" points="${pointString}"/>${pointNodes}
    </svg>`;

  document.getElementById('dailyProgressLog').innerHTML = [...records].reverse().slice(0, 7).map(record => {
    const date = parseDate(record.date);
    return `<div class="progress-log-row ${record.date === today ? 'today' : ''}">
      <div class="progress-log-date"><strong>D${record.day} · ${formatShortDate(record.date)}</strong><small>${weekdays[date.getDay()]}</small></div>
      <div><div class="progress-log-meter"><i style="width:${record.pct}%"></i></div><div class="progress-log-status">${statusFor(record.pct)}</div></div>
      <div class="progress-log-score"><strong>${record.pct}%</strong><small>${record.done}/${record.total} 项</small></div>
    </div>`;
  }).join('');
}

function numberOrNull(value) {
  return value === '' ? null : Number(value);
}

function renderScores() {
  const container = document.getElementById('scoreHistory');
  if (!state.scores.length) {
    container.innerHTML = '<div class="empty-state">还没有成绩记录。</div>';
    return;
  }
  container.innerHTML = `
    <div class="score-history-row header"><span>日期</span><span>L</span><span>R</span><span>W</span><span>S</span><span>总分</span><span>备注</span><span></span></div>
    ${[...state.scores].reverse().slice(0,5).map((score,reverseIndex) => {
      const originalIndex = state.scores.length - 1 - reverseIndex;
      return `<div class="score-history-row"><span>${score.date}</span><strong>${score.l ?? '—'}</strong><strong>${score.r ?? '—'}</strong><strong>${score.w ?? '—'}</strong><strong>${score.s ?? '—'}</strong><strong>${score.overall ?? '—'}</strong><span>${score.note || ''}</span><button class="delete-button" data-delete-score="${originalIndex}">×</button></div>`;
    }).join('')}`;
}

function saveScore(event) {
  event.preventDefault();
  const lCorrect = numberOrNull(document.getElementById('listeningCorrect').value);
  const rCorrect = numberOrNull(document.getElementById('readingCorrect').value);
  const l = lCorrect === null ? null : listeningBand(lCorrect);
  const r = rCorrect === null ? null : readingBand(rCorrect);
  const w = numberOrNull(document.getElementById('writingBand').value);
  const s = numberOrNull(document.getElementById('speakingBand').value);
  const score = {
    date: document.getElementById('scoreDate').value,
    lCorrect, rCorrect, l, r, w, s,
    overall: overallBand([l,r,w,s]),
    note: document.getElementById('scoreNote').value.trim()
  };
  state.scores.push(score);
  state.scores.sort((a,b) => a.date.localeCompare(b.date));
  saveState();
  event.target.reset();
  document.getElementById('scoreDate').value = localDateString();
  renderOverview(); renderScoreStrip(); renderScores();
  showToast(score.overall ? `已保存：Overall ${score.overall}` : '已保存；四科补齐后自动计算 Overall');
}

function renderReview() {
  const today = localDateString();
  const current = state.reviews[today] || {};
  document.getElementById('reviewListening').value = current.listening || '';
  document.getElementById('reviewReading').value = current.reading || '';
  document.getElementById('reviewOutput').value = current.output || '';
}

function saveReview(event) {
  event.preventDefault();
  state.reviews[localDateString()] = {
    listening: document.getElementById('reviewListening').value.trim(),
    reading: document.getElementById('reviewReading').value.trim(),
    output: document.getElementById('reviewOutput').value.trim()
  };
  saveState();
  showToast('今日复盘已保存');
}

function renderReviewHistory() {
  const container = document.getElementById('reviewHistory');
  const entries = Object.entries(state.reviews).sort((a,b) => b[0].localeCompare(a[0])).slice(0, 7);
  if (!entries.length) {
    container.innerHTML = '<div class="empty-state">还没有复盘记录，今天开始写第一条。</div>';
    return;
  }
  container.innerHTML = entries.map(([date, review]) => `
    <div class="review-history-entry">
      <div class="rh-date">${date}</div>
      ${review.listening ? `<div class="rh-row"><strong>Listening</strong><span>${review.listening}</span></div>` : ''}
      ${review.reading ? `<div class="rh-row"><strong>Reading</strong><span>${review.reading}</span></div>` : ''}
      ${review.output ? `<div class="rh-row"><strong>Writing / Speaking</strong><span>${review.output}</span></div>` : ''}
    </div>`).join('');
}

function setTimerFromTask() {
  const option = document.getElementById('timerTaskSelect').selectedOptions[0];
  const minutes = Number(option?.dataset.minutes || 20);
  document.getElementById('timerMinutes').value = minutes;
  timerRemaining = minutes * 60;
  timerRunning = false;
  timerFinished = false;
  clearInterval(timerInterval);
  renderTimer();
}

function renderTimer() {
  const minutes = Math.floor(timerRemaining / 60);
  const seconds = timerRemaining % 60;
  document.getElementById('timerDisplay').textContent = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
  const selectedTask = document.getElementById('timerTaskSelect').selectedOptions[0]?.textContent?.split(' · ')[0] || '当前事项';
  const focusNote = document.querySelector('.focus-note');
  focusNote.classList.toggle('timer-active', timerRunning);
  focusNote.classList.toggle('timer-ended', timerFinished);
  document.getElementById('timerState').textContent = timerFinished ? '时间到' : timerRunning ? '专注中' : '准备开始';
  document.title = timerRunning ? `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')} · IELTS` : 'IELTS 75 · 雅思学习中心';
}

function startTimer() {
  if (timerRunning) return;
  if (timerRemaining <= 0) timerRemaining = Math.max(1, Number(document.getElementById('timerMinutes').value)) * 60;
  timerRunning = true;
  timerFinished = false;
  prepareAlarm();
  timerEndsAt = Date.now() + timerRemaining * 1000;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerRemaining = Math.max(0, Math.ceil((timerEndsAt - Date.now()) / 1000));
    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      timerFinished = true;
      renderTimer();
      alarm();
      // Auto-check current task
      const select = document.getElementById('timerTaskSelect');
      if (select && select.value !== '') {
        const index = parseInt(select.value);
        const date = localDateString();
        state.checkins[date] = state.checkins[date] || {};
        if (!state.checkins[date][index]) {
          state.checkins[date][index] = true;
          saveState();
          renderOverview();
          renderToday();
        }
      }
      showToast('⏰ 倒计时结束，任务已自动完成！');
    } else {
      renderTimer();
    }
  }, 250);
  renderTimer();
}

function pauseTimer() {
  if (!timerRunning) return;
  timerRemaining = Math.max(0, Math.ceil((timerEndsAt - Date.now()) / 1000));
  timerRunning = false;
  clearInterval(timerInterval);
  renderTimer();
}

function resetTimer() {
  timerRunning = false;
  timerFinished = false;
  clearInterval(timerInterval);
  timerRemaining = Math.max(1, Number(document.getElementById('timerMinutes').value) || 20) * 60;
  renderTimer();
}

function alarm() {
  const display = document.getElementById('timerDisplay');
  display.classList.add('alarm-flash');
  setTimeout(() => display.classList.remove('alarm-flash'), 2000);
  try {
    const beep = new Audio('beep.wav');
    beep.play(); setTimeout(() => beep.play(), 300); setTimeout(() => beep.play(), 600);
    setTimeout(() => beep.play(), 900); setTimeout(() => beep.play(), 1200);
  } catch (_) {}
}

function prepareAlarm() {}

function updateClock() {
  const now = new Date();
  document.getElementById('liveClock').textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  document.getElementById('todayDate').textContent = localDateString(now).replaceAll('-', '.');
  const minuteKey = `${localDateString(now)}-${now.getHours()}-${now.getMinutes()}`;
  if (minuteKey !== lastScheduleMinute) {
    lastScheduleMinute = minuteKey;
    renderCurrentTaskStatus(tasksForDay(currentDay()));
  }
}

document.addEventListener('click', event => {
  const pageTab = event.target.closest('[data-page]');
  const checkin = event.target.closest('[data-checkin]');
  const remove = event.target.closest('[data-delete-score]');
  const feedback = event.target.closest('[data-feedback]');
  if (pageTab) {
    document.querySelectorAll('.page-tab').forEach(tab => tab.classList.toggle('active', tab === pageTab));
    document.querySelectorAll('.paper-page').forEach(page => page.classList.toggle('active', page.id === `page-${pageTab.dataset.page}`));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (checkin) toggleCheckin(checkin.dataset.checkin);
  if (feedback) setFeedback(feedback.dataset.feedback);
  if (remove) {
    state.scores.splice(Number(remove.dataset.deleteScore), 1);
    saveState();
    renderOverview(); renderScoreStrip(); renderScores();
    showToast('成绩记录已删除');
  }
});

document.getElementById('timerTaskSelect').addEventListener('change', setTimerFromTask);
document.getElementById('timerMinutes').addEventListener('change', resetTimer);
document.getElementById('timerStart').addEventListener('click', startTimer);
document.getElementById('timerPause').addEventListener('click', pauseTimer);
document.getElementById('timerReset').addEventListener('click', resetTimer);
document.getElementById('scoreForm').addEventListener('submit', saveScore);
document.getElementById('reviewForm').addEventListener('submit', saveReview);
document.getElementById('openReviewHistory').addEventListener('click', () => {
  renderReviewHistory();
  document.getElementById('reviewHistoryModal').hidden = false;
});
document.getElementById('closeReviewHistory').addEventListener('click', () => {
  document.getElementById('reviewHistoryModal').hidden = true;
});
document.getElementById('reviewHistoryModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) document.getElementById('reviewHistoryModal').hidden = true;
});

document.getElementById('scoreDate').value = localDateString();
renderOverview();
renderToday();
renderCheckpoint();
renderScoreStrip();
renderRoadmap();
renderScores();
renderReview();
setTimerFromTask();
updateClock();
setInterval(updateClock, 1000);
