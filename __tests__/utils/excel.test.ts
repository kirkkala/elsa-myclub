import { excelUtils } from "@/utils/excel"

describe("Excel conversion utils", () => {
  describe("formatEventName", () => {
    it("formats game title correctly from ELSA format", () => {
      const input = {
        sarja: "13-vuotiaat pojat I divisioona Eteläinen alue",
        koti: "Puhu Juniorit",
        vieras: "HNMKY/Stadi",
      }

      expect(excelUtils.formatEventName(input.sarja, input.koti, input.vieras)).toBe(
        "I div. Puhu Juniorit - HNMKY/Stadi"
      )
    })

    it("handles different division numbers", () => {
      const input = {
        sarja: "13-vuotiaat pojat III divisioona Eteläinen alue",
        koti: "HNMKY/Stadi",
        vieras: "Beat Basket Black",
      }

      expect(excelUtils.formatEventName(input.sarja, input.koti, input.vieras)).toBe(
        "III div. HNMKY/Stadi - Beat Basket Black"
      )
    })

    test.each([
      [
        "11-vuotiaat tytöt I divisioona Eteläinen alue",
        "Puhu Juniorit",
        "HNMKY/Stadi",
        "I div. Puhu Juniorit - HNMKY/Stadi",
      ],
      [
        "11-vuotiaat tytöt III divisioona Eteläinen alue",
        "HNMKY/Stadi",
        "Beat Basket Black",
        "III div. HNMKY/Stadi - Beat Basket Black",
      ],
    ])('converts "%s" game correctly', (sarja, koti, vieras, expected) => {
      expect(excelUtils.formatEventName(sarja, koti, vieras)).toBe(expected)
    })
  })

  describe("formatSeriesName", () => {
    it("extracts 1st division from full series name", () => {
      expect(excelUtils.formatSeriesName("11-vuotiaat tytöt I divisioona Eteläinen alue")).toBe("I div.")
    })

    it("extracts 1st division from full series name", () => {
      expect(excelUtils.formatSeriesName("13-vuotiaat pojat I divisioona Eteläinen alue")).toBe("I div.")
    })

    it("extracts 2nd division from full series name", () => {
      expect(excelUtils.formatSeriesName("13-vuotiaat pojat II divisioona Eteläinen alue")).toBe("II div.")
    })

    it("extracts 3rd division from full series name", () => {
      expect(excelUtils.formatSeriesName("9-vuotiaat tytöt III divisioona Eteläinen alue")).toBe("III div.")
    })

    it("returns empty string for series we don't expect", () => {
      expect(excelUtils.formatSeriesName("100-vuotiaat leidit harrastesarja")).toBe("")
    })
  })
})

describe("Date and time conversions", () => {
  describe("normalizeDate", () => {
    it("handles string dates with comma", () => {
      expect(excelUtils.normalizeDate("14,12")).toBe("14.12.")
    })

    it("handles string dates with dot", () => {
      expect(excelUtils.normalizeDate("14.12")).toBe("14.12.")
    })

    it("handles string dates with dot", () => {
      expect(excelUtils.normalizeDate("14.12")).toBe("14.12.")
    })

    it("handles numeric dates", () => {
      expect(excelUtils.normalizeDate(14.12)).toBe("14.12.")
    })

    it("pads single digit dates", () => {
      expect(excelUtils.normalizeDate("4,3")).toBe("04.03.")
      expect(excelUtils.normalizeDate(4.03)).toBe("04.03.")
    })

    it("throws error for invalid date format", () => {
      expect(() => excelUtils.normalizeDate("invalid")).toThrow("Odottamaton päivämäärämuoto")
    })
  })

  describe("formatDateTime", () => {
    it("combines date, time and year (as string)", () => {
      expect(excelUtils.formatDateTime("14.12.", "12:30", "2025")).toBe("14.12.2025 12:30:00")
    })

    it("works with numeric year", () => {
      expect(excelUtils.formatDateTime("14.12.", "12:30", 2025)).toBe("14.12.2025 12:30:00")
    })
  })

  describe("calculateEventTimes", () => {
    it("calculates start and end times with no adjustments", () => {
      expect(excelUtils.calculateEventTimes("12:30", 0, 0, 120)).toEqual({
        startTime: "12:30",
        endTime: "14:30",
      })
    })

    it("handles meeting time adjustment", () => {
      expect(excelUtils.calculateEventTimes("12:30", 30, 0, 120)).toEqual({
        startTime: "12:00",
        endTime: "14:30",
      })
    })

    it("handles warm-up time adjustment", () => {
      expect(excelUtils.calculateEventTimes("12:30", 0, 15, 120)).toEqual({
        startTime: "12:45",
        endTime: "14:30",
      })
    })

    it("handles both meeting and warm-up adjustments", () => {
      expect(excelUtils.calculateEventTimes("12:30", 30, 15, 75)).toEqual({
        startTime: "12:15",
        endTime: "13:45",
      })
    })

    it("handles hour rollover", () => {
      expect(excelUtils.calculateEventTimes("23:30", 30, 15, 60)).toEqual({
        startTime: "23:15",
        endTime: "00:30",
      })
    })
  })

  describe("adjustStartTime", () => {
    it("adjusts time by given minutes", () => {
      expect(excelUtils.adjustStartTime("12:30", 15)).toBe("12:45")
    })

    it("handles hour rollover when adjusting", () => {
      expect(excelUtils.adjustStartTime("23:45", 30)).toBe("00:15")
    })

    it("handles time with spaces", () => {
      expect(excelUtils.adjustStartTime("12: 30", 15)).toBe("12:45")
    })

    it("returns original time when no adjustment", () => {
      expect(excelUtils.adjustStartTime("12:30", 0)).toBe("12:30")
    })
  })
})
