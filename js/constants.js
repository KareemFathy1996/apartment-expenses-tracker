const ROOM_TYPES = [
  { id: 'general', name: 'عام' },
  { id: 'kitchen', name: 'مطبخ' },
  { id: 'bedroom', name: 'غرفة نوم' },
  { id: 'dinning', name: 'سفرة' },
  { id: 'reception', name: 'ريسيبشن' }
];

function formatNumber(num) {
  if (num === null || isNaN(num)) return '0';
  return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// For non-module version
window.ROOM_TYPES = ROOM_TYPES;
window.formatNumber = formatNumber;