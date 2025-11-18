import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react'
import type { PanelThickness } from '../lib/acoustics/absorption'
import { STUDIO_8 } from '../lib/utils/constants'
import {
  calculateRT60WithPanels,
  calculateAverageRT60,
  calculatePanelAbsorption,
  calculateDrapeAbsorption,
  calculatePanelCost,
  calculateTotalPanels,
  calculateSTIImprovement,
} from '../lib/acoustics'
import { CONVERSIONS } from '../lib/utils/conversions'
import { parseFrequencyResponseCsv, FrequencyResponseData } from '../lib/data/csvParser';
import { parseSmaartLog, SmaartData } from '../lib/data/smaartLogParser';

export interface PanelConfig {
  '2_inch': number
  '3_inch': number
  '5_5_inch': number
  '11_inch': number
}

interface AcousticsState {
  // Room selection
  selectedRoom: 'Studio 8' | 'The Hub'

  // Measurement position
  selectedPosition: string

  // Panel configuration
  panelConfig: PanelConfig
  drapeRemoval: boolean

  // Raw and processed data from CSV
  rawFrequencyData: FrequencyResponseData[];
  smaartData: SmaartData | null;
  isLoading: boolean;
  error: string | null;

  // Calculated metrics (derived from panel config)
  currentRT60: Record<number, number>
  predictedRT60: Record<number, number>
  currentSTI: number
  predictedSTI: number
  totalCost: number
  totalPanels: number

  // UI state
  viewMode: '2D' | '3D'
  showModalAnalysis: boolean
  comparisonMode: boolean
}

interface AcousticsActions {
  setSelectedRoom: (room: 'Studio 8' | 'The Hub') => void
  setSelectedPosition: (position: string) => void
  updatePanelCount: (thickness: PanelThickness, count: number) => void
  setDrapeRemoval: (remove: boolean) => void
  toggleViewMode: () => void
  toggleModalAnalysis: () => void
  toggleComparisonMode: () => void
  resetPanelConfig: () => void
}

type AcousticsContextType = AcousticsState & AcousticsActions

const AcousticsContext = createContext<AcousticsContextType | undefined>(undefined)

const defaultPanelConfig: PanelConfig = {
  '2_inch': 3,
  '3_inch': 6,
  '5_5_inch': 12,
  '11_inch': 4,
}

// Helper function to map selectedPosition to Smaart log file name
const getSmaartLogFileName = (room: 'Studio 8' | 'The Hub', position: string): string => {
  if (room === 'Studio 8') {
    switch (position) {
      case 'Host A (Reference)': return 'Std8-HostA-128k-Sweep.txt';
      case 'Host C (Talent)': return 'Std8-HostC-128k-Sweep.txt';
      case 'Mid Room': return 'Std8-MidRoom-128k-Sweep.txt';
      case 'Ceiling': return 'Std8-Ceiling-128k-Sweep.txt';
      case 'NE Corner': return 'Std8-NECorner-High-128k-Sweep.txt'; // Assuming High for now
      case 'SE Corner': return 'Std8-SECorner-128k-Sweep.txt';
      case 'SW Corner': return 'Std8-SWCorner-128k-Sweep.txt';
      default: return 'Std8-HostA-128k-Sweep.txt'; // Fallback
    }
  } else if (room === 'The Hub') {
    switch (position) {
      case 'Chair 1': return 'TheHub-Chair1-64k.txt';
      case 'Chair 2': return 'TheHub-Chair2-64k.txt';
      case 'Mid Room': return 'TheHub-MidRoom-64k.txt';
      case 'Back Corner': return 'TheHub-BackCorner-64k.txt';
      case 'Ceiling Corner': return 'TheHub-CeilingCorner-64k.txt';
      default: return 'TheHub-Chair1-64k.txt'; // Fallback
    }
  }
  return ''; // Should not happen
};


export function AcousticsProvider({ children }: { children: ReactNode }) {
  const [selectedRoom, setSelectedRoom] = useState<'Studio 8' | 'The Hub'>('Studio 8')
  const [selectedPosition, setSelectedPosition] = useState('Host C (Talent)')
  const [panelConfig, setPanelConfig] = useState<PanelConfig>(defaultPanelConfig)
  const [drapeRemoval, setDrapeRemoval] = useState(true)
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('3D')
  const [showModalAnalysis, setShowModalAnalysis] = useState(false)
  const [comparisonMode, setComparisonMode] = useState(false)

  const [rawFrequencyData, setRawFrequencyData] = useState<FrequencyResponseData[]>([]);
  const [smaartData, setSmaartData] = useState<SmaartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndParseAllData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch and parse CSV data (Frequency Response)
        const csvFileName = selectedRoom === 'Studio 8'
          ? '250728-Studio8-Complete_Frequency_Response.csv'
          : '250731-TheHub-Complete_Frequency_Response.csv'; // Using the latest for The Hub
        const csvFilePath = `/data/measurements/${csvFileName}`;
        const csvResponse = await fetch(csvFilePath);
        if (!csvResponse.ok) {
          throw new Error(`HTTP error! status: ${csvResponse.status} for ${csvFilePath}`);
        }
        const csvText = await csvResponse.text();
        const parsedCsvData = parseFrequencyResponseCsv(csvText);
        setRawFrequencyData(parsedCsvData);

        // Fetch and parse Smaart Log data (RT60, STI)
        const smaartLogFileName = getSmaartLogFileName(selectedRoom, selectedPosition);
        const smaartLogFilePath = `/data/250715-smaartLogs/${selectedRoom === 'Studio 8' ? 'Std8' : 'TheHub'}/${smaartLogFileName}`;
        const smaartLogResponse = await fetch(smaartLogFilePath);
        if (!smaartLogResponse.ok) {
          throw new Error(`HTTP error! status: ${smaartLogResponse.status} for ${smaartLogFilePath}`);
        }
        const smaartLogText = await smaartLogResponse.text();
        const parsedSmaartData = parseSmaartLog(smaartLogText);
        setSmaartData(parsedSmaartData);

      } catch (err) {
        console.error("Failed to fetch or parse data:", err);
        setError("Failed to load acoustic data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndParseAllData();
  }, [selectedRoom, selectedPosition]); // Re-run when selectedRoom or selectedPosition changes

  // Calculate metrics from current configuration
  const roomData = STUDIO_8 // Could expand to support The Hub later

  // Derive currentSTI from loaded Smaart data
  const currentSTI = useMemo(() => {
    return smaartData?.averageSTI || roomData.measured.averageSTI; // Fallback
  }, [smaartData, roomData.measured.averageSTI]);

  // Derive currentRT60 from loaded Smaart data
  const currentRT60 = useMemo(() => {
    return smaartData?.rt60ByFreq || roomData.rt60ByFreq; // Fallback
  }, [smaartData, roomData.rt60ByFreq]);

  // Convert room dimensions to metric for calculations
  const volume = roomData.volume * CONVERSIONS.cubicFeetToMeters
  const surfaceArea = roomData.surfaceArea * CONVERSIONS.squareFeetToMeters

  // Calculate panel absorption
  const addedAbsorption = calculatePanelAbsorption(panelConfig, roomData.surfaceArea)

  // Calculate drape absorption if removing
  const drapeAbsorption = drapeRemoval
    ? calculateDrapeAbsorption(roomData.surfaceArea)
    : {}

  // Calculate predicted RT60
  const predictedRT60 = calculateRT60WithPanels(
    currentRT60,
    volume,
    surfaceArea,
    addedAbsorption,
    drapeAbsorption
  )

  // Calculate RT60 improvement for STI prediction
  const avgCurrentRT60 = calculateAverageRT60(currentRT60)
  const avgPredictedRT60 = calculateAverageRT60(predictedRT60)
  const rt60Improvement = avgCurrentRT60 - avgPredictedRT60

  // Calculate predicted STI
  const predictedSTI = calculateSTIImprovement(
    currentSTI,
    roomData.measured.targetSTI,
    rt60Improvement
  )

  // Calculate costs
  const totalCost = calculatePanelCost(panelConfig)
  const totalPanels = calculateTotalPanels(panelConfig)

  const updatePanelCount = (thickness: PanelThickness, count: number) => {
    setPanelConfig(prev => ({
      ...prev,
      [thickness]: Math.max(0, count),
    }))
  }

  const resetPanelConfig = () => {
    setPanelConfig(defaultPanelConfig)
  }

  const toggleViewMode = () => {
    setViewMode(prev => (prev === '2D' ? '3D' : '2D'))
  }

  const toggleModalAnalysis = () => {
    setShowModalAnalysis(prev => !prev)
  }

  const toggleComparisonMode = () => {
    setComparisonMode(prev => !prev)
  }

  const value: AcousticsContextType = {
    // State
    selectedRoom,
    selectedPosition,
    panelConfig,
    drapeRemoval,
    rawFrequencyData,
    smaartData,
    isLoading,
    error,
    currentRT60,
    predictedRT60,
    currentSTI,
    predictedSTI,
    totalCost,
    totalPanels,
    viewMode,
    showModalAnalysis,
    comparisonMode,

    // Actions
    setSelectedRoom,
    setSelectedPosition,
    updatePanelCount,
    setDrapeRemoval,
    toggleViewMode,
    toggleModalAnalysis,
    toggleComparisonMode,
    resetPanelConfig,
  }

  return <AcousticsContext.Provider value={value}>{children}</AcousticsContext.Provider>
}

export function useAcoustics() {
  const context = useContext(AcousticsContext)
  if (!context) {
    throw new Error('useAcoustics must be used within AcousticsProvider')
  }
  return context
}
