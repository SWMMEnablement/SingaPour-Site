import type { 
  RainfallData, 
  SubcatchmentData, 
  RunoffResults,
  NodeData, 
  ConduitData, 
  DischargeResults 
} from "@shared/schema";

export function parseSwmmFile(content: string): { sections: Record<string, string[]> } {
  const lines = content.split('\n');
  const sections: Record<string, string[]> = {};
  let currentSection = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      currentSection = trimmed.slice(1, -1).toUpperCase();
      sections[currentSection] = [];
    } else if (currentSection && trimmed && !trimmed.startsWith(';')) {
      sections[currentSection].push(trimmed);
    }
  }
  
  return { sections };
}

export function analyzeRainfall(content: string): RainfallData {
  const { sections } = parseSwmmFile(content);
  const raingages = sections['RAINGAGES'] || [];
  const timeseries = sections['TIMESERIES'] || [];
  
  const timeseriesData: { time: string; value: number }[] = [];
  let currentSeriesName = '';
  
  for (const line of timeseries) {
    const parts = line.split(/\s+/).filter(p => p);
    if (parts.length >= 3) {
      const name = parts[0];
      if (name !== currentSeriesName) {
        currentSeriesName = name;
      }
      const time = parts[1];
      const value = parseFloat(parts[2]) || 0;
      timeseriesData.push({ time, value });
    } else if (parts.length === 2) {
      const time = parts[0];
      const value = parseFloat(parts[1]) || 0;
      timeseriesData.push({ time, value });
    }
  }
  
  const values = timeseriesData.map(d => d.value);
  const times = timeseriesData.map(d => d.time);
  
  const totalDepth = values.reduce((sum, v) => sum + v, 0);
  const peakIntensity = Math.max(...values, 0);
  
  const gaps: { start: string; end: string }[] = [];
  let inGap = false;
  let gapStart = '';
  
  for (let i = 0; i < values.length; i++) {
    if (values[i] === 0 && !inGap) {
      inGap = true;
      gapStart = times[i];
    } else if (values[i] > 0 && inGap) {
      inGap = false;
      if (i > 1) {
        gaps.push({ start: gapStart, end: times[i - 1] });
      }
    }
  }
  
  const stormEvents: { start: string; end: string; depth: number }[] = [];
  let inStorm = false;
  let stormStart = '';
  let stormDepth = 0;
  
  for (let i = 0; i < values.length; i++) {
    if (values[i] > 0 && !inStorm) {
      inStorm = true;
      stormStart = times[i];
      stormDepth = values[i];
    } else if (values[i] > 0 && inStorm) {
      stormDepth += values[i];
    } else if (values[i] === 0 && inStorm) {
      inStorm = false;
      stormEvents.push({ start: stormStart, end: times[i - 1], depth: stormDepth });
      stormDepth = 0;
    }
  }
  
  if (inStorm && times.length > 0) {
    stormEvents.push({ start: stormStart, end: times[times.length - 1], depth: stormDepth });
  }
  
  let unit = 'in';
  if (raingages.length > 0) {
    const parts = raingages[0].split(/\s+/);
    if (parts.length >= 3) {
      unit = parts[2] || 'in';
    }
  }
  
  return {
    timeseries: times,
    values,
    unit,
    totalDepth,
    peakIntensity,
    duration: times.length,
    gaps,
    stormEvents,
  };
}

export function analyzeRunoff(content: string): RunoffResults {
  const { sections } = parseSwmmFile(content);
  const subcatchmentLines = sections['SUBCATCHMENTS'] || [];
  const subareaLines = sections['SUBAREAS'] || [];
  const infiltrationLines = sections['INFILTRATION'] || [];
  const optionsLines = sections['OPTIONS'] || [];
  
  const subcatchments: SubcatchmentData[] = [];
  
  const subareas: Record<string, Partial<SubcatchmentData>> = {};
  for (const line of subareaLines) {
    const parts = line.split(/\s+/).filter(p => p);
    if (parts.length >= 5) {
      subareas[parts[0]] = {
        nImperv: parseFloat(parts[1]) || 0.01,
        nPerv: parseFloat(parts[2]) || 0.1,
        sImperv: parseFloat(parts[3]) || 0.05,
        sPerv: parseFloat(parts[4]) || 0.05,
        pctZero: parseFloat(parts[5]) || 25,
      };
    }
  }
  
  for (const line of subcatchmentLines) {
    const parts = line.split(/\s+/).filter(p => p);
    if (parts.length >= 5) {
      const name = parts[0];
      const subarea = subareas[name] || {};
      
      subcatchments.push({
        name,
        area: parseFloat(parts[2]) || 0,
        imperv: parseFloat(parts[3]) || 0,
        width: parseFloat(parts[4]) || 0,
        slope: parseFloat(parts[5]) || 0.5,
        nImperv: subarea.nImperv || 0.01,
        nPerv: subarea.nPerv || 0.1,
        sImperv: subarea.sImperv || 0.05,
        sPerv: subarea.sPerv || 0.05,
        pctZero: subarea.pctZero || 25,
      });
    }
  }
  
  const totalArea = subcatchments.reduce((sum, s) => sum + s.area, 0);
  const avgImperv = subcatchments.length > 0 
    ? subcatchments.reduce((sum, s) => sum + s.imperv, 0) / subcatchments.length 
    : 0;
  
  let infiltrationMethod = 'HORTON';
  for (const line of optionsLines) {
    const parts = line.split(/\s+/).filter(p => p);
    if (parts[0]?.toUpperCase() === 'INFILTRATION') {
      infiltrationMethod = parts[1]?.toUpperCase() || 'HORTON';
    }
  }
  
  return {
    subcatchments,
    totalArea,
    avgImperv,
    infiltrationMethod,
  };
}

export function analyzeDischarge(content: string): DischargeResults {
  const { sections } = parseSwmmFile(content);
  const junctionLines = sections['JUNCTIONS'] || [];
  const outfallLines = sections['OUTFALLS'] || [];
  const storageLines = sections['STORAGE'] || [];
  const conduitLines = sections['CONDUITS'] || [];
  const xsectionLines = sections['XSECTIONS'] || [];
  
  const nodes: NodeData[] = [];
  
  for (const line of junctionLines) {
    const parts = line.split(/\s+/).filter(p => p);
    if (parts.length >= 2) {
      nodes.push({
        name: parts[0],
        type: 'JUNCTION',
        invertElev: parseFloat(parts[1]) || 0,
        maxDepth: parseFloat(parts[2]) || 0,
        initDepth: parseFloat(parts[3]) || 0,
        surchargeDepth: parseFloat(parts[4]) || 0,
        pondedArea: parseFloat(parts[5]) || 0,
      });
    }
  }
  
  for (const line of outfallLines) {
    const parts = line.split(/\s+/).filter(p => p);
    if (parts.length >= 2) {
      nodes.push({
        name: parts[0],
        type: 'OUTFALL',
        invertElev: parseFloat(parts[1]) || 0,
        maxDepth: 0,
        initDepth: 0,
        surchargeDepth: 0,
        pondedArea: 0,
      });
    }
  }
  
  for (const line of storageLines) {
    const parts = line.split(/\s+/).filter(p => p);
    if (parts.length >= 2) {
      nodes.push({
        name: parts[0],
        type: 'STORAGE',
        invertElev: parseFloat(parts[1]) || 0,
        maxDepth: parseFloat(parts[2]) || 0,
        initDepth: parseFloat(parts[3]) || 0,
        surchargeDepth: 0,
        pondedArea: 0,
      });
    }
  }
  
  const xsections: Record<string, { shape: string; geom1: number; geom2: number }> = {};
  for (const line of xsectionLines) {
    const parts = line.split(/\s+/).filter(p => p);
    if (parts.length >= 3) {
      xsections[parts[0]] = {
        shape: parts[1],
        geom1: parseFloat(parts[2]) || 0,
        geom2: parseFloat(parts[3]) || 0,
      };
    }
  }
  
  const conduits: ConduitData[] = [];
  
  for (const line of conduitLines) {
    const parts = line.split(/\s+/).filter(p => p);
    if (parts.length >= 5) {
      const name = parts[0];
      const xs = xsections[name] || { shape: 'CIRCULAR', geom1: 1, geom2: 0 };
      
      let capacity = 0;
      if (xs.shape === 'CIRCULAR') {
        const radius = xs.geom1 / 2;
        capacity = Math.PI * radius * radius;
      } else if (xs.shape === 'RECT_CLOSED' || xs.shape === 'RECT_OPEN') {
        capacity = xs.geom1 * xs.geom2;
      } else {
        capacity = xs.geom1;
      }
      
      conduits.push({
        name,
        fromNode: parts[1],
        toNode: parts[2],
        length: parseFloat(parts[3]) || 0,
        roughness: parseFloat(parts[4]) || 0.01,
        inOffset: parseFloat(parts[5]) || 0,
        outOffset: parseFloat(parts[6]) || 0,
        shape: xs.shape,
        geom1: xs.geom1,
        geom2: xs.geom2,
        capacity,
      });
    }
  }
  
  const surchargingNodes = nodes
    .filter(n => n.surchargeDepth > 0)
    .map(n => n.name);
  
  const potentialFloodNodes = nodes
    .filter(n => n.maxDepth > 0 && n.maxDepth < 2)
    .map(n => n.name);
  
  return {
    nodes,
    conduits,
    totalNodes: nodes.length,
    totalConduits: conduits.length,
    surchargingNodes,
    potentialFloodNodes,
  };
}
