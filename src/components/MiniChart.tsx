import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useApp } from "@/context/provider";
import Svg, {
  Path,
  Line,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";

const MiniChart = ({
  dataValue,
  maxVal = 100,
  color = "#38BDF8",
  height = 40,
  width = 80,
  isTemp = false,
  maxFontSize = 15,
}: {
  dataValue: number;
  maxVal?: number;
  color?: string;
  height?: number;
  width?: number;
  isTemp?: boolean;
  maxFontSize: number;
}) => {
  const [history, setHistory] = useState<number[]>([]);
  const [allTimeMax, setAllTimeMax] = useState<number>(0);
  const { data } = useApp();

  useEffect(() => {
    if (dataValue === undefined || dataValue === null) return;
    setHistory((prev) => {
      const newHistory = [...prev, dataValue];
      // Keep last 20 points for a smoother line graph
      if (newHistory.length > 20) {
        newHistory.shift();
      }
      return newHistory;
    });
    setAllTimeMax((prev) => Math.max(prev, dataValue));
  }, [data]);

  const getPathData = () => {
    if (history.length === 0) return { linePath: "", areaPath: "" };
    const stepX = width / Math.max(1, history.length - 1);

    let linePath = "";
    history.forEach((val, index) => {
      const x = index * stepX;
      // y is inverted (0 is at top)
      const y = height - (Math.max(0, Math.min(val, maxVal)) / maxVal) * height;
      if (index === 0) {
        linePath += `M ${x},${y}`;
      } else {
        linePath += ` L ${x},${y}`;
      }
    });

    // Close the path for the filled area
    const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

    return { linePath, areaPath };
  };

  const { linePath, areaPath } = getPathData();
  const maxLineColor = isTemp ? "#F87171" : color;
  const maxYCoord =
    height - (Math.max(0, Math.min(allTimeMax, maxVal)) / maxVal) * height;

  return (
    <View style={[styles.container, { height, width }]}>
      <Svg height={height} width={width}>
        <Defs>
          {/* Line Gradient for Temperature */}
          <LinearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#F87171" stopOpacity="1" />
            <Stop offset="0.4" stopColor="#FB923C" stopOpacity="1" />
            <Stop offset="0.7" stopColor="#4ADE80" stopOpacity="1" />
          </LinearGradient>

          {/* Area Gradient for Temperature */}
          <LinearGradient id="tempAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#F87171" stopOpacity="0.4" />
            <Stop offset="0.4" stopColor="#FB923C" stopOpacity="0.2" />
            <Stop offset="1" stopColor="#4ADE80" stopOpacity="0" />
          </LinearGradient>

          {/* Area Gradient for Standard Color */}
          <LinearGradient id="colorAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.4" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Minimal Grid - Just a subtle dashed center line */}
        <Line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="#374151"
          strokeWidth="1"
          strokeDasharray="4,4"
          opacity="0.5"
        />

        {/* Max Value Line & Text */}
        {allTimeMax > 0 && (
          <>
            <Line
              x1="0"
              y1={maxYCoord}
              x2={width}
              y2={maxYCoord}
              stroke={maxLineColor}
              strokeWidth="1"
              strokeDasharray="2,2"
              opacity="0.8"
            />
            <SvgText
              x={width - 2}
              y={Math.max(10, maxYCoord - 4)}
              fill={maxLineColor}
              fontSize={maxFontSize}
              fontWeight="bold"
              textAnchor="end"
              opacity="0.9"
            >
              {allTimeMax}
              {isTemp ? "°" : "%"}
            </SvgText>
          </>
        )}

        {/* Filled Area */}
        {areaPath ? (
          <Path
            d={areaPath}
            fill={isTemp ? "url(#tempAreaGrad)" : "url(#colorAreaGrad)"}
          />
        ) : null}

        {/* Line itself */}
        {linePath ? (
          <Path
            d={linePath}
            fill="none"
            stroke={isTemp ? "url(#tempGrad)" : color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
  },
});

export default MiniChart;
