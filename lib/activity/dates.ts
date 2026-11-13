const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function assertCalendarDate(value: string): string {
  if (!DATE_PATTERN.test(value)) throw new RangeError(`Data inválida: ${value}`);
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new RangeError(`Data inválida: ${value}`);
  }
  return value;
}

export function enumerateDateRange(from: string, to: string): string[] {
  assertCalendarDate(from);
  assertCalendarDate(to);
  const start = Date.parse(`${from}T00:00:00.000Z`);
  const end = Date.parse(`${to}T00:00:00.000Z`);
  if (start > end) throw new RangeError("A data inicial deve ser anterior ou igual à data final.");

  const dates: string[] = [];
  for (let timestamp = start; timestamp <= end; timestamp += 86_400_000) {
    dates.push(new Date(timestamp).toISOString().slice(0, 10));
  }
  return dates;
}

export function toUtcStartOfDay(date: string): string {
  return `${assertCalendarDate(date)}T00:00:00.000Z`;
}

export function toUtcEndOfDay(date: string): string {
  return `${assertCalendarDate(date)}T23:59:59.999Z`;
}

export function addUtcDays(date: string, days: number): string {
  assertCalendarDate(date);
  const result = new Date(Date.parse(`${date}T00:00:00.000Z`) + days * 86_400_000);
  return result.toISOString().slice(0, 10);
}
