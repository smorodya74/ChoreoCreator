'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Formation } from '@/app/Models/Types';

export const MAX_TIMELINE_MS = 1_200_000;
export const MIN_ZOOM_VIEW_MS = 20_000;
export const MAX_ZOOM_VIEW_MS = 600_000;
export const TIMELINE_SNAP_MS = 500;

type TimelineProps = {
  formations: Formation[];
  totalDurationMs: number;
  currentTimeMs: number;
  selectedFormationId: string | null;
  zoomPercent: number;
  onSelectFormation: (id: string) => void;
  onSetCurrentTime: (ms: number) => void;
  onResizeFormation: (id: string, durationMs: number) => void;
  onResizeFormationEnd: () => void;
  onChangeAnimationDuration: (id: string, animationDurationMs: number) => void;
  onChangeAnimationDurationEnd: () => void;
};

const snap = (value: number) => Math.round(value / TIMELINE_SNAP_MS) * TIMELINE_SNAP_MS;
const clipRange = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const formatLabel = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const zoomToVisibleDuration = (zoomPercent: number) => {
  const z = clipRange(zoomPercent, 1, 100);
  const t = (z - 1) / 99;
  return Math.round(MAX_ZOOM_VIEW_MS - t * (MAX_ZOOM_VIEW_MS - MIN_ZOOM_VIEW_MS));
};

const tickStepForVisibleDuration = (visibleDurationMs: number) => {
  if (visibleDurationMs <= 20_000) return 1_000;      // 100% => каждая секунда
  if (visibleDurationMs <= 40_000) return 2_000;
  if (visibleDurationMs <= 60_000) return 5_000;
  if (visibleDurationMs <= 120_000) return 10_000;
  if (visibleDurationMs <= 300_000) return 15_000;
  return 30_000; // 1% => каждые 30 секунд
};

const minorStepForMajor = (majorStep: number) => {
  if (majorStep <= 2_000) return 1_000;
  if (majorStep <= 10_000) return 2_000;
  if (majorStep <= 30_000) return 5_000;
  return 10_000;
};

export default function Timeline({
  formations,
  totalDurationMs,
  currentTimeMs,
  selectedFormationId,
  zoomPercent,
  onSelectFormation,
  onSetCurrentTime,
  onResizeFormation,
  onResizeFormationEnd,
  onChangeAnimationDuration,
  onChangeAnimationDurationEnd,
}: TimelineProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [viewportWidth, setViewportWidth] = useState(900);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      setViewportWidth(Math.max(640, entry.contentRect.width));
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const visibleDurationMs = useMemo(() => zoomToVisibleDuration(zoomPercent), [zoomPercent]);
  const pxPerMs = viewportWidth / visibleDurationMs;
  const trackWidth = Math.max(viewportWidth, Math.round(MAX_TIMELINE_MS * pxPerMs));

  const majorStep = tickStepForVisibleDuration(visibleDurationMs);
  const minorStep = minorStepForMajor(majorStep);

  const majorTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let t = 0; t <= MAX_TIMELINE_MS; t += majorStep) ticks.push(t);
    return ticks;
  }, [majorStep]);

  const minorTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let t = 0; t <= MAX_TIMELINE_MS; t += minorStep) {
      if (t % majorStep !== 0) ticks.push(t);
    }
    return ticks;
  }, [minorStep, majorStep]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const playheadX = currentTimeMs * pxPerMs;
    const leftBound = viewport.scrollLeft;
    const rightBound = viewport.scrollLeft + viewport.clientWidth;

    if (playheadX < leftBound || playheadX > rightBound) {
      viewport.scrollLeft = Math.max(0, playheadX - viewport.clientWidth / 2);
    }
  }, [currentTimeMs, pxPerMs]);

  const eventClientXToTime = (clientX: number) => {
    const viewport = viewportRef.current;
    const rect = viewport?.getBoundingClientRect();
    if (!viewport || !rect) return 0;

    const xInViewport = clipRange(clientX - rect.left, 0, viewport.clientWidth);
    const xOnTrack = xInViewport + viewport.scrollLeft;
    return clipRange(snap(xOnTrack / pxPerMs), 0, totalDurationMs);
  };

  return (
    <div style={{ marginTop: 12, border: '1px solid var(--editor-sidebar-border)', borderRadius: 8, padding: 10, width: '100%' }}>
      <div ref={viewportRef} style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden' }}>
        <div
          ref={trackRef}
          onClick={(e) => onSetCurrentTime(eventClientXToTime(e.clientX))}
          style={{ position: 'relative', width: trackWidth, minHeight: 120, cursor: 'pointer' }}
        >
          <div style={{ position: 'relative', height: 28, borderBottom: '1px solid var(--editor-sidebar-border)' }}>
            {minorTicks.map((t) => (
              <div
                key={`minor-${t}`}
                style={{ position: 'absolute', left: t * pxPerMs, top: 8, width: 1, height: 10, background: 'rgba(255,255,255,0.25)' }}
              />
            ))}
            {majorTicks.map((t) => (
              <div
                key={`major-${t}`}
                style={{ position: 'absolute', left: t * pxPerMs, top: 2, width: 1, height: 18, background: 'rgba(255,255,255,0.65)' }}
              >
                <div style={{ position: 'absolute', top: -2, left: 4, fontSize: 12, color: 'var(--editor-item-text)' }}>{formatLabel(t)}</div>
              </div>
            ))}
          </div>

          <div style={{ position: 'relative', height: 74, marginTop: 6, border: '1px solid var(--editor-sidebar-border)' }}>
            <div style={{ position: 'absolute', left: currentTimeMs * pxPerMs, top: -6, bottom: -6, width: 2, background: '#ff2f92', zIndex: 6 }} />

            {formations.map((formation) => {
              const left = formation.startTimeMs * pxPerMs;
              const clipWidth = Math.max(12, formation.durationMs * pxPerMs);
              const hasAnimationSegment = formation.numberInScenario > 1 && formation.animationDurationMs > 0;
              const animationWidth = hasAnimationSegment ? Math.max(0, formation.animationDurationMs * pxPerMs) : 0;
              const isSelected = formation.id === selectedFormationId;

              return (
                <div
                  key={formation.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectFormation(formation.id);
                  }}
                  style={{
                    position: 'absolute',
                    left,
                    top: 14,
                    width: clipWidth,
                    height: 42,
                    border: isSelected ? '2px solid #ff2f92' : '1px solid #3f9bff',
                    background: isSelected ? 'rgba(255, 47, 146, 0.2)' : 'rgba(63, 155, 255, 0.2)',
                    color: 'var(--editor-item-text)',
                    borderRadius: 6,
                    overflow: 'hidden',
                    userSelect: 'none',
                  }}
                >
                  {hasAnimationSegment && animationWidth > 0 && (
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: animationWidth, background: 'rgba(255, 47, 146, 0.35)' }} />
                  )}

                  <div style={{ position: 'relative', padding: '4px 6px', fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {formation.name}
                  </div>

                  <div
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      const startX = e.clientX;
                      const startDuration = formation.durationMs;

                      const onMove = (ev: PointerEvent) => {
                        const deltaMs = snap((ev.clientX - startX) / pxPerMs);
                        onResizeFormation(formation.id, startDuration + deltaMs);
                      };

                      const onUp = () => {
                        window.removeEventListener('pointermove', onMove);
                        window.removeEventListener('pointerup', onUp);
                        onResizeFormationEnd();
                      };

                      window.addEventListener('pointermove', onMove);
                      window.addEventListener('pointerup', onUp);
                    }}
                    style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 8, background: '#3f9bff', cursor: 'ew-resize' }}
                  />

                  {formation.numberInScenario > 1 && (
                    <div
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        const startX = e.clientX;
                        const startAnimation = formation.animationDurationMs;

                        const onMove = (ev: PointerEvent) => {
                          const deltaMs = snap((ev.clientX - startX) / pxPerMs);
                          onChangeAnimationDuration(formation.id, startAnimation + deltaMs);
                        };

                        const onUp = () => {
                          window.removeEventListener('pointermove', onMove);
                          window.removeEventListener('pointerup', onUp);
                          onChangeAnimationDurationEnd();
                        };

                        window.addEventListener('pointermove', onMove);
                        window.addEventListener('pointerup', onUp);
                      }}
                      style={{ position: 'absolute', left: Math.max(0, animationWidth - 4), top: 0, bottom: 0, width: 6, background: '#ff2f92', cursor: 'ew-resize' }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
