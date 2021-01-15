import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";

var originalStart;
var originalEnd;
var originalTimeDiff;

var pinchLocation;
var pinchLocationPercent;
var pinchTime;

var zoomPercent;

export function calcOriginalTimeDiff(start, end){
    originalStart = start;
    originalEnd = end;
    console.log(originalStart,originalEnd)
    return(
        null
    )
}
export default calcOriginalTimeDiff;
