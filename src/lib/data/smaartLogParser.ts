// src/lib/data/smaartLogParser.ts

export interface SmaartData {
  rt60ByFreq: Record<number, number>;
  stiByFreq: Record<number, number>;
  averageSTI: number; // Assuming an average STI can be derived or is present
  // Add other relevant data if needed
}

export function parseSmaartLog(logContent: string): SmaartData {
  const rt60ByFreq: Record<number, number> = {};
  const stiByFreq: Record<number, number> = {};
  let averageSTI: number = 0; // Placeholder, need to derive or find

  const lines = logContent.split('\n');
  let inRT60Section = false;
  let inSTISection = false;
  let stiFrequencies: number[] = [];

  for (const line of lines) {
    if (line.includes('Filter') && line.includes('Band') && line.includes('RT60')) {
      inRT60Section = true;
      inSTISection = false;
      continue;
    }
    if (line.trim().startsWith('STI')) {
      inSTISection = true;
      inRT60Section = false;
      const parts = line.trim().split('\t').filter(s => s.trim() !== '');
      // The STI line itself contains the frequencies and values
      // Example: STI\t0.94\t0.99\t0.97\t0.98\t0.86\t0.91\t1.00\t1.00
      // Frequencies are in the line above STI, but for simplicity, hardcode or derive from context
      // For now, hardcode based on the example provided
      stiFrequencies = [125, 250, 500, 1000, 2000, 4000, 8000];

      const stiValues = parts.slice(1).map(parseFloat); // Skip "STI" label
      stiFrequencies.forEach((freq, index) => {
          if (stiValues[index] !== undefined && !isNaN(stiValues[index])) {
              stiByFreq[freq] = stiValues[index];
          }
      });
      // Assuming the first value after "STI" is the overall average STI if present
      if (stiValues.length > 0 && !isNaN(stiValues[0])) {
        averageSTI = stiValues[0];
      }
      inSTISection = false; // Only process the first STI line
      continue;
    }

    if (inRT60Section && line.trim().startsWith('Oct')) {
      const parts = line.trim().split('\t').filter(s => s.trim() !== '');
      if (parts.length >= 3) { // Ensure there are enough parts for Freq and RT60
        const freqStr = parts[1].replace('Hz', '').replace('kHz', '000').trim();
        const freq = parseFloat(freqStr);
        const rt60 = parseFloat(parts[2]);
        if (!isNaN(freq) && !isNaN(rt60) && freq > 0) {
          rt60ByFreq[freq] = rt60;
        }
      }
    }
  }

  // If averageSTI wasn't found directly, calculate from stiByFreq
  if (averageSTI === 0 && Object.keys(stiByFreq).length > 0) {
    const sum = Object.values(stiByFreq).reduce((acc, val) => acc + val, 0);
    averageSTI = sum / Object.keys(stiByFreq).length;
  }


  return { rt60ByFreq, stiByFreq, averageSTI };
}
