import { sampleExcelData } from '../mocks/test-data'
import {
  formatSeriesName,
  formatEventName,
  normalizeDate,
  formatDateTime,
  calculateEndTime,
  adjustStartTime
} from '../../pages/api/upload'

describe('Excel conversion utils', () => {
  describe('formatEventName', () => {
    it('formats game title correctly from ELSA format', () => {
      const input = {
        sarja: '11-vuotiaat tytöt I divisioona Eteläinen alue',
        koti: 'Puhu Juniorit',
        vieras: 'HNMKY/Stadi'
      }

      expect(formatEventName(input.sarja, input.koti, input.vieras))
        .toBe('I div. Puhu Juniorit - HNMKY/Stadi')
    })

    it('handles different division numbers', () => {
      const input = {
        sarja: '11-vuotiaat tytöt III divisioona Eteläinen alue',
        koti: 'HNMKY/Stadi',
        vieras: 'Beat Basket Black'
      }

      expect(formatEventName(input.sarja, input.koti, input.vieras))
        .toBe('III div. HNMKY/Stadi - Beat Basket Black')
    })

    test.each(sampleExcelData.input.rows.map((row, i) => [
      row[1], // sarja
      row[6], // koti
      row[7], // vieras
      sampleExcelData.expected.rows[i][0] // expected title
    ]))('converts "%s" game correctly', (sarja, koti, vieras, expected) => {
      expect(formatEventName(sarja, koti, vieras)).toBe(expected)
    })
  })

  describe('formatSeriesName', () => {
    it('extracts 1st division from full series name', () => {
      expect(formatSeriesName('11-vuotiaat tytöt I divisioona Eteläinen alue'))
        .toBe('I div.')
    })

    it('extracts 1st division from full series name', () => {
      expect(formatSeriesName('13-vuotiaat pojat I divisioona Eteläinen alue'))
        .toBe('I div.')
    })

    it('extracts 2nd division from full series name', () => {
      expect(formatSeriesName('13-vuotiaat pojat II divisioona Eteläinen alue'))
        .toBe('II div.')
    })

    it('extracts 3rd division from full series name', () => {
      expect(formatSeriesName('9-vuotiaat tytöt III divisioona Eteläinen alue'))
        .toBe('III div.')
    })

    it('returns empty string for series we don\'t expect', () => {
      expect(formatSeriesName('100-vuotiaat leidit harrastesarja')).toBe('')
    })
  })
})

describe('Date and time conversions', () => {
  describe('normalizeDate', () => {
    it('handles string dates with comma', () => {
      expect(normalizeDate('14,12')).toBe('14.12.')
    })

    it('handles string dates with dot', () => {
      expect(normalizeDate('14.12')).toBe('14.12.')
    })

    it('handles string dates with dot', () => {
      expect(normalizeDate('14.12')).toBe('14.12.')
    })

    it('handles numeric dates', () => {
      expect(normalizeDate(14.12)).toBe('14.12.')
    })

    it('pads single digit dates', () => {
      expect(normalizeDate('4,3')).toBe('04.03.')
      expect(normalizeDate(4.03)).toBe('04.03.')
    })

    it('throws error for invalid date format', () => {
      expect(() => normalizeDate('invalid')).toThrow('Odottamaton päivämäärämuoto')
    })
  })

  describe('formatDateTime', () => {
    it('combines date, time and year (as string)', () => {
      expect(formatDateTime('14.12.', '12:30', '2025')).toBe('14.12.2025 12:30:00')
    })

    it('works with numeric year', () => {
      expect(formatDateTime('14.12.', '12:30', 2025)).toBe('14.12.2025 12:30:00')
    })
  })

  describe('calculateEndTime', () => {
    it('calculates end time for 120 minute duration', () => {
      expect(calculateEndTime('12:30', 120)).toBe('14:30')
    })

    it('handles hour rollover', () => {
      expect(calculateEndTime('23:30', 60)).toBe('00:30')
    })

    it('handles minutes properly', () => {
      expect(calculateEndTime('12:45', 90)).toBe('14:15')
    })
  })

  describe('adjustStartTime', () => {
    it('adjusts time by given minutes', () => {
      expect(adjustStartTime('12:30', 15)).toBe('12:45')
    })

    it('handles hour rollover when adjusting', () => {
      expect(adjustStartTime('23:45', 30)).toBe('00:15')
    })

    it('handles time with spaces', () => {
      expect(adjustStartTime('12: 30', 15)).toBe('12:45')
    })

    it('returns original time when no adjustment', () => {
      expect(adjustStartTime('12:30', 0)).toBe('12:30')
    })
  })
})
