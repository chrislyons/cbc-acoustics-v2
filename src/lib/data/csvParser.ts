// src/lib/data/csvParser.ts

export interface FrequencyResponseData {
  position: string;
  frequency: number;
  magnitude: number; // Magnitude_dB
  color: string;
  phase: number; // Phase_deg
  sti: number;
  stiDegradation: number; // STI_Degradation_%
}

export function parseFrequencyResponseCsv(csvString: string): FrequencyResponseData[] {
  const lines = csvString.trim().split('\n');
  if (lines.length === 0) {
    return [];
  }

  const headers = lines[0].split(',').map(header => header.trim());
  const dataLines = lines.slice(1);

  return dataLines.map(line => {
    const values = line.split(',').map(value => value.trim());
    const row: Record<string, string | number> = {};

    headers.forEach((header, index) => {
      const value = values[index];
      switch (header) {
        case 'Frequency_Hz':
          row.frequency = parseFloat(value);
          break;
        case 'Magnitude_dB':
          row.magnitude = parseFloat(value);
          break;
        case 'Phase_deg':
          row.phase = parseFloat(value);
          break;
        case 'STI':
          row.sti = parseFloat(value);
          break;
        case 'STI_Degradation_%':
          row.stiDegradation = parseFloat(value);
          break;
        case 'position':
          row.position = value;
          break;
        case 'Color':
          row.color = value;
          break;
        default:
          // Optionally handle unknown headers or ignore
          break;
      }
    });
    return row as FrequencyResponseData;
  });
}
