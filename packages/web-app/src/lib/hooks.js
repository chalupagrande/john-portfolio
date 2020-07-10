import { useState, useEffect, useCallback } from "react";

export function useContainerSize(container, delay = 300) {
  let [size, setSize] = useState({
    source: "window",
    width: 0,
    height: 0
  });

  const memoSetSize = useCallback(() => {
    if (container instanceof Window) {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    } else {
      let dim = container.getBoundingClientRect();
      setSize({ x: dim.x, y: dim.y, width: dim.width, height: dim.height });
    }
  }, [container]);

  useEffect(() => {
    container = container || window;
    // define get size function


    let interval = null;
    let prevExecTime = Date.now();
    memoSetSize();

    function handleResize(e) {
      if (Date.now() - prevExecTime > delay) {
        interval = setTimeout(() => {
          if (container instanceof Window) {
            setSize({ width: window.innerWidth, height: window.innerHeight });
          } else {
            let dim = container.getBoundingClientRect();
            setSize({
              x: dim.x,
              y: dim.y,
              width: dim.width,
              height: dim.height
            });
          }
          clearInterval(interval);
        }, delay);
        prevExecTime = Date.now();
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [container, delay]);
  return size;
}
