// 参数格式：事件名称|目标日期（例：春节|2025-01-28）
let params = (args.widgetParameter || '倒计时|2025-08-22').split('|');
let [eventName, targetDate] =
  params.length >= 2 ? [params[0], params[1]] : ['未命名', params[0] || '2025-08-22'];

// 计算剩余天数（兼容错误日期）
function calculateDays(target) {
  try {
    let countDownDate = new Date(target + 'T00:00:00');
    if (isNaN(countDownDate)) return 'ERR';
    let now = new Date();
    let distance = countDownDate.getTime() - now.getTime();
    return Math.ceil(distance / 86400000);
  } catch (e) {
    return 'ERR';
  }
}

let days = calculateDays(targetDate);

// 构建小组件
if (config.runsInWidget) {
  let widget = createWidget(eventName, days, targetDate);
  Script.setWidget(widget);
  Script.complete();
}

function createWidget(name, days, date) {
  let widget = new ListWidget();
  widget.setPadding(12, 15, 12, 10);
  widget.spacing = 4;

  // 事件名称
  let title = widget.addText(name);
  title.font = Font.boldSystemFont(16);
  title.textColor = Color.dynamic(Color.white(), Color.gray());

  // 剩余天数
  let daysText = widget.addText(typeof days === 'number' ? `${days}` : days);
  daysText.font = Font.heavyMonospacedSystemFont(32);
  daysText.textColor = days === 'ERR' ? Color.red() : Color.white();

  // 目标日期
  let dateStack = widget.addStack();
  dateStack.spacing = 4;
  let icon = dateStack.addImage(SFSymbol.named('calendar').image);
  icon.tintColor = Color.gray();
  icon.imageSize = new Size(12, 12);

  let dateText = dateStack.addText(formatDate(date));
  dateText.font = Font.mediumSystemFont(12);
  dateText.textColor = Color.gray();

  // 动态渐变色背景
  let gradient = new LinearGradient();
  let colors = getBackgroundColors(days);
  gradient.colors = colors;
  gradient.locations = [0, 1];
  widget.backgroundGradient = gradient;

  return widget;
}

// 高级渐变色配置
function getBackgroundColors(days) {
  if (days === 'ERR') return [new Color('#ff4444'), new Color('#cc0000')];

  // 四梯度配色方案
  const colorSchemes = {
    urgent: {
      // 0-10天：熔岩红
      start: '#ff6b6b',
      end: '#ff3838'
    },
    critical: {
      // 11-30天：落日橙
      start: '#ff9a3d',
      end: '#ff6b3d'
    },
    normal: {
      // 31-50天：深海蓝
      start: '#4b6cb7',
      end: '#182848'
    },
    relaxed: {
      // 51-90天：森林绿
      start: '#2c9c6c',
      end: '#1d5b3e'
    },
    longterm: {
      // 90+天：星空紫
      start: '#6c5ce7',
      end: '#4b3db7'
    }
  };

  let scheme;
  if (days <= 10) scheme = colorSchemes.urgent;
  else if (days <= 30) scheme = colorSchemes.critical;
  else if (days <= 50) scheme = colorSchemes.normal;
  else if (days <= 90) scheme = colorSchemes.relaxed;
  else scheme = colorSchemes.longterm;

  return [new Color(scheme.start), new Color(scheme.end)];
}

// 日期格式化
function formatDate(str) {
  let [y, m, d] = str.split('-');
  return `${y}年${parseInt(m)}月${parseInt(d)}日`;
}
