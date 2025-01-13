export const sampleExcelData = {
  input: {
    headers: ['Nro', 'Sarja', 'Pv', 'Prm', 'Klo', 'Kenttä', 'Koti', 'Vieras', 'Tulos', 'LiveStats'],
    rows: [
      ['2987', '11-vuotiaat tytöt I divisioona Eteläinen alue', 'La', '14,12', '12:30', 'Aurinkokiven koulu', 'Puhu Juniorit', 'HNMKY/Stadi', '', ''],
      ['7223', '11 - vuotiaat tytöt I divisioona Eteläinen alue', 'La', '11,01', '09:30', 'Karakallion koulu', 'LePy', 'HNMKY/Stadi', '',	''],
      ['7227', '11 - vuotiaat tytöt III divisioona Eteläinen alue', 'Su', '26,01', '12: 15', 'Malmin palloiluhalli 1', 'HNMKY/Stadi', 'Beat Basket Black', '', '']
    ]
  },
  expected: {
    headers: ['Nimi', 'Kuvaus', 'Ryhmä', 'Tapahtumatyyppi', 'Tapahtumapaikka', 'Alkaa', 'Päättyy', 'Ilmoittautuminen', 'Näkyvyys'],
    rows: [
      [
        'I div. Puhu Juniorit - HNMKY/Stadi',
        '<p><strong>Game start</strong>: 12:30</p>',
        'HNMKY Stadi 2014 Tytöt',
        'Ottelu',
        'Aurinkokiven koulu',
        '14.12.2025 12:30:00',
        '14.12.2025 14:30:00',
        'Valituille henkilöille',
        'Näkyy ryhmälle'
      ],
      [
        'I div. LePy - HNMKY/Stadi',
        '<p><strong>Game start</strong>: 09:30</p>',
        'HNMKY Stadi 2014 Tytöt',
        'Ottelu',
        'Karakallion koulu',
        '11.01.2025 09:30:00',
        '11.01.2025 11:30:00',
        'Valituille henkilöille',
        'Näkyy ryhmälle'
      ],
      [
        'III div. HNMKY/Stadi - Beat Basket Black',
        '<p><strong>Game start</strong>: 12:15</p>',
        'HNMKY Stadi 2014 Tytöt',
        'Ottelu	Malmin palloiluhalli 1',
        '26.01.2025 12:15:00',
        '26.01.2025 14:15:00',
        'Valituille henkilöille',
        'Näkyy ryhmälle'
      ]
    ]
  }
}
