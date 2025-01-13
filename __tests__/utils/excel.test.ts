import { sampleExcelData } from '../mocks/test-data'
import { formatSeriesName, formatEventName } from '../../pages/api/upload'

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
    it('extracts division from full series name', () => {
      expect(formatSeriesName('11-vuotiaat tytöt I divisioona Eteläinen alue'))
        .toBe('I div.')
    })

    it('handles multi-character division numbers', () => {
      expect(formatSeriesName('11-vuotiaat tytöt III divisioona Eteläinen alue'))
        .toBe('III div.')
    })

    it('returns empty string for invalid series', () => {
      expect(formatSeriesName('Invalid series name')).toBe('')
    })
  })
})
