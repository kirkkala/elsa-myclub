import { excelUtils } from "@/utils/excel"

describe("Excel utilities", () => {
  test.each([
    // [series, home, away, expected]
    ["I divisioona", "Team A", "Team B", "I div. Team A - Team B"],
    ["III divisioona", "Team C", "Team D", "III div. Team C - Team D"],
    ["harrastesarja", "Team E", "Team F", "Team E - Team F"],
  ])("formatEventName: %s → %s", (series, home, away, expected) => {
    expect(excelUtils.formatEventName(series, home, away)).toBe(expected)
  })

  test.each([
    // [input, expected]
    ["I divisioona", "I div."],
    ["III divisioona", "III div."],
    ["harrastesarja", ""],
  ])("formatSeriesName: %s → %s", (input, expected) => {
    expect(excelUtils.formatSeriesName(input)).toBe(expected)
  })

  test.each([
    // [input, expected]
    ["14,12", "14.12."],
    ["14.12", "14.12."],
    [14.12, "14.12."],
    ["4,3", "04.03."],
    [4.03, "04.03."],
  ])("normalizeDate: %s → %s", (input, expected) => {
    expect(excelUtils.normalizeDate(input)).toBe(expected)
  })

  it("normalizeDate throws on invalid format", () => {
    expect(() => excelUtils.normalizeDate("invalid")).toThrow("Odottamaton päivämäärämuoto")
  })

  test.each([
    // [date, time, year, expected]
    ["14.12.", "12:30", "2025", "14.12.2025 12:30:00"],
    ["14.12.", "12:30", 2025, "14.12.2025 12:30:00"],
  ])("formatDateTime: %s %s %s → %s", (date, time, year, expected) => {
    expect(excelUtils.formatDateTime(date, time, year)).toBe(expected)
  })

  test.each([
    // [gameTime, meetingMinutes, durationMinutes, expectedStart, expectedEnd]
    ["12:30", 0, 120, "12:30", "14:30"],
    ["12:30", 30, 120, "12:00", "14:30"],
    ["23:30", 0, 60, "23:30", "00:30"],
    ["00:30", 30, 60, "00:00", "01:30"],
  ])(
    "calculateEventTimes: %s meeting=%d duration=%d → start=%s end=%s",
    (gameTime, meeting, duration, start, end) => {
      expect(excelUtils.calculateEventTimes(gameTime, meeting, duration)).toEqual({
        startTime: start,
        endTime: end,
      })
    }
  )

  test.each([
    // [originalTime, meetingTime, expected]
    ["12:30", 0, "Peli alkaa: 12:30"],
    ["12:30", 30, "Lämppä: 12:00, Peli alkaa: 12:30"],
    ["00:15", 30, "Lämppä: 23:45, Peli alkaa: 00:15"],
  ])("createDescription: %s meeting=%d → %s", (time, meeting, expected) => {
    expect(excelUtils.createDescription(time, meeting)).toBe(expected)
  })
})
