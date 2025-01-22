import React from "react";
import ContentLoader, { Rect } from "react-content-loader/native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type SkeletonProps = {
    width:number;
    height:number;
}

const Skeleton = ({ width, height }:SkeletonProps) => {
    const backgroundColor = useThemeColor({light:"#B2B2B2",dark:"#282828"},'tint')
    return (
        <ContentLoader
          speed={1}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          backgroundColor={backgroundColor}
          foregroundColor="#ecebeb"
        >
          <Rect x="0" y="0" rx="0" ry="0" width="100%" height="100%" />
        </ContentLoader>
    );
};

export default Skeleton;