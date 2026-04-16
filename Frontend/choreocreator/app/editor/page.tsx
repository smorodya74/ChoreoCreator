'use client';

import { Button, Layout, Slider } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CaretRightOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  PauseOutlined,
  MonitorOutlined,
} from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import EditorSidebar from '@/app/components/EditorBar/EditorBar';
import Scene from '../components/Scene/Scene';
import Timeline, { MAX_TIMELINE_MS } from '../components/Timeline/Timeline';
import AuthModal from '../components/AuthModal';
import { CreateUpdateScenario } from '../components/CreateUpdateScenario';
import { useAuth } from '../context/auth-context';
import { DancerPosition, Formation, ScenarioRequest } from '../Models/Types';
import { getDraftFromLocalStorage, saveDraftToLocalStorage } from '../utils/localStorageScenario';
import { createScenario, getMyScenario, getScenarioById, updateScenario } from '../services/scenarios';
import { exportScenarioToPdf } from '../utils/exportScenarioToPdf';

const { Content } = Layout;
const MIN_SCENARIO_MS = 10_000;
const MAX_SCENARIO_MS = MAX_TIMELINE_MS;
const DEFAULT_FORMATION_MS = 10_000;
const MIN_FORMATION_MS = 1_000;
const MAX_FORMATION_MS = 180_000;

const defaultFormationName = (indexOneBased: number) => `Formation-${indexOneBased}`;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const normalizeFormations = (formations: Formation[]): Formation[] => {
  let cursorMs = 0;

  return formations
    .slice()
    .sort((a, b) => a.numberInScenario - b.numberInScenario)
    .map((formation, index) => {
      const numberInScenario = index + 1;
      const durationMs = clamp(formation.durationMs || DEFAULT_FORMATION_MS, MIN_FORMATION_MS, MAX_FORMATION_MS);
      const isFirst = index === 0;
      const autoName = formation.isAutoName ?? true;

      const normalized: Formation = {
        ...formation,
        numberInScenario,
        startTimeMs: cursorMs,
        durationMs,
        animationDurationMs: isFirst ? 0 : clamp(formation.animationDurationMs ?? Math.floor(durationMs / 2), 0, durationMs),
        name: autoName ? defaultFormationName(numberInScenario) : (formation.name?.trim() || defaultFormationName(numberInScenario)),
        description: formation.description ?? '',
        isAutoName: autoName,
      };

      cursorMs += durationMs;
      return normalized;
    });
};

const requiredScenarioDurationMs = (formations: Formation[]) => {
  if (!formations.length) return MIN_SCENARIO_MS;
  const last = formations[formations.length - 1];
  return Math.max(MIN_SCENARIO_MS, last.startTimeMs + last.durationMs);
};

const normalizeWithDuration = (formations: Formation[], baseDurationMs: number) => {
  const normalized = normalizeFormations(formations);
  const required = requiredScenarioDurationMs(normalized);
  const totalDurationMs = clamp(Math.max(baseDurationMs, required), MIN_SCENARIO_MS, MAX_SCENARIO_MS);

  if (required > totalDurationMs) {
    // hard guard for 20 min cap: trim last formations if needed
    const constrained = normalizeFormations(
      normalized.map((f) => ({ ...f })).map((f) => {
        const maxDur = Math.max(MIN_FORMATION_MS, totalDurationMs - f.startTimeMs);
        return { ...f, durationMs: Math.min(f.durationMs, maxDur), animationDurationMs: Math.min(f.animationDurationMs, maxDur) };
      }),
    );
    return { formations: constrained, totalDurationMs };
  }

  return { formations: normalized, totalDurationMs };
};

const formatTime = (ms: number) => {
  const totalSeconds = ms / 1000;
  const m = Math.floor(totalSeconds / 60);
  const s = (totalSeconds % 60).toFixed(1).padStart(4, '0');
  return `${m.toString().padStart(2, '0')}:${s}`;
};

const findFormationIndexAtTime = (formations: Formation[], timeMs: number) => {
  if (!formations.length) return -1;
  const index = formations.findIndex((f) => timeMs >= f.startTimeMs && timeMs < f.startTimeMs + f.durationMs);
  return index >= 0 ? index : formations.length - 1;
};

export default function EditorPage() {
  const [isScenarioModalVisible, setScenarioModalVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<null | 'save' | 'publish' | 'export'>(null);
  const { user } = useAuth();

  const [isModalOpen, setModalOpen] = useState(false);
  const [scenarioId, setScenarioId] = useState<string | undefined>(undefined);
  const [localScenarioId, setLocalScenarioId] = useState<string | undefined>(undefined);

  const [formations, setFormations] = useState<Formation[]>([]);
  const [selectedFormationId, setSelectedFormationId] = useState<string | null>(null);
  const [selectedDancerId, setSelectedDancerId] = useState<string | null>(null);

  const [totalDurationMs, setTotalDurationMs] = useState(MIN_SCENARIO_MS);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineZoomPercent, setTimelineZoomPercent] = useState(50);

  const playbackLastTsRef = useRef<number | null>(null);
  const formationsRef = useRef<Formation[]>([]);
  const totalDurationRef = useRef<number>(MIN_SCENARIO_MS);

  const selectedFormation = useMemo(
    () => formations.find((f) => f.id === selectedFormationId) ?? null,
    [formations, selectedFormationId],
  );

  const persistDraft = (
    nextFormations: Formation[],
    nextTotalDurationMs = totalDurationMs,
    nextSelectedFormationId = selectedFormationId,
    nextSelectedDancerId = selectedDancerId,
  ) => {
    saveDraftToLocalStorage({
      id: localScenarioId,
      isPublished: false,
      totalDurationMs: nextTotalDurationMs,
      formations: nextFormations,
      dancerCount: Math.max(1, ...nextFormations.map((f) => f.dancerPositions.length)),
      selectedFormationId: nextSelectedFormationId ?? undefined,
      selectedDancerId: nextSelectedDancerId ?? undefined,
    });
  };

  const applyFormations = (
    updater: (prev: Formation[]) => Formation[],
    opts?: { persist?: boolean; selectedFormationId?: string | null; selectedDancerId?: string | null; baseDurationMs?: number },
  ) => {
    setFormations((prev) => {
      const updated = updater(prev);
      const normalized = normalizeWithDuration(updated, opts?.baseDurationMs ?? totalDurationMs);
      setTotalDurationMs(normalized.totalDurationMs);
      if (opts?.persist) {
        persistDraft(
          normalized.formations,
          normalized.totalDurationMs,
          opts?.selectedFormationId ?? selectedFormationId,
          opts?.selectedDancerId ?? selectedDancerId,
        );
      }
      return normalized.formations;
    });
  };

  const activateFormation = (formationId: string) => {
    const formation = formations.find((f) => f.id === formationId);
    if (!formation) return;

    setSelectedFormationId(formation.id);
    setCurrentTimeMs(formation.startTimeMs);
    setSelectedDancerId(null);
  };

  useEffect(() => {
    const loadScenario = async () => {
      const draft = getDraftFromLocalStorage();

      if (user) {
        try {
          const fromServer = await getMyScenario();
          const normalized = normalizeWithDuration(fromServer.formations, fromServer.totalDurationMs || MIN_SCENARIO_MS);
          setScenarioId(fromServer.id);
          setFormations(normalized.formations);
          setTotalDurationMs(normalized.totalDurationMs);
          setSelectedFormationId(normalized.formations[0]?.id ?? null);
          setSelectedDancerId(normalized.formations[0]?.dancerPositions[0]?.id ?? null);
          return;
        } catch {
          // fallback to draft
        }
      }

      if (draft) {
        const normalized = normalizeWithDuration(draft.formations, draft.totalDurationMs || MIN_SCENARIO_MS);
        setLocalScenarioId(draft.id);
        setFormations(normalized.formations);
        setTotalDurationMs(normalized.totalDurationMs);
        setSelectedFormationId(draft.selectedFormationId ?? normalized.formations[0]?.id ?? null);
        setSelectedDancerId(draft.selectedDancerId ?? normalized.formations[0]?.dancerPositions[0]?.id ?? null);
        return;
      }

      const formationId = uuidv4();
      const dancerId = uuidv4();
      const initial: Formation[] = [{
        id: formationId,
        numberInScenario: 1,
        startTimeMs: 0,
        durationMs: DEFAULT_FORMATION_MS,
        animationDurationMs: 0,
        name: defaultFormationName(1),
        description: '',
        isAutoName: true,
        dancerPositions: [{ id: dancerId, numberInFormation: 1, position: { x: 0, y: 0 } }],
      }];

      const normalized = normalizeWithDuration(initial, MIN_SCENARIO_MS);
      setScenarioId(uuidv4());
      setFormations(normalized.formations);
      setTotalDurationMs(normalized.totalDurationMs);
      setSelectedFormationId(formationId);
      setSelectedDancerId(dancerId);
      persistDraft(normalized.formations, normalized.totalDurationMs, formationId, dancerId);
    };

    loadScenario();
  }, [user]);

  useEffect(() => {
    formationsRef.current = formations;
  }, [formations]);

  useEffect(() => {
    totalDurationRef.current = totalDurationMs;
  }, [totalDurationMs]);

  useEffect(() => {
    if (!formations.length) return;
    const idx = findFormationIndexAtTime(formations, currentTimeMs);
    const current = formations[idx];
    if (current && current.id !== selectedFormationId) {
      setSelectedFormationId(current.id);
      setSelectedDancerId(null);
    }
  }, [currentTimeMs, formations, selectedFormationId]);

  useEffect(() => {
    if (!isPlaying) {
      playbackLastTsRef.current = null;
      return;
    }

    let rafId = 0;
    const tick = (ts: number) => {
      const last = playbackLastTsRef.current;
      playbackLastTsRef.current = ts;
      if (last !== null) {
        const delta = ts - last;
        setCurrentTimeMs((prev) => {
          const next = prev + delta;
          if (next >= totalDurationMs) {
            setIsPlaying(false);
            return totalDurationMs;
          }
          return next;
        });
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, totalDurationMs]);

  const renderedDancerPositions = useMemo(() => {
    if (!formations.length) return [] as DancerPosition[];
    const activeIndex = findFormationIndexAtTime(formations, currentTimeMs);
    const active = formations[Math.max(0, activeIndex)];
    if (!active) return [] as DancerPosition[];

    if (activeIndex <= 0 || active.animationDurationMs <= 0) {
      return active.dancerPositions;
    }

    const prev = formations[activeIndex - 1];
    const elapsed = currentTimeMs - active.startTimeMs;
    const prevByNumber = new Map(prev.dancerPositions.map((d) => [d.numberInFormation, d]));
    if (elapsed <= 0) {
      return active.dancerPositions.map((target) => {
        const source = prevByNumber.get(target.numberInFormation);
        if (!source) return target;
        return { ...target, position: { ...source.position } };
      });
    }
    if (elapsed >= active.animationDurationMs) return active.dancerPositions;

    const t = clamp(elapsed / active.animationDurationMs, 0, 1);

    return active.dancerPositions.map((target) => {
      const source = prevByNumber.get(target.numberInFormation);
      if (!source) return target;
      return {
        ...target,
        position: {
          x: source.position.x + (target.position.x - source.position.x) * t,
          y: source.position.y + (target.position.y - source.position.y) * t,
        },
      };
    });
  }, [formations, currentTimeMs]);

  const handleAddDancer = () => {
    if (!selectedFormation) return;
    if (selectedFormation.dancerPositions.length >= 16) return;

    applyFormations((prev) => prev.map((f) => f.id === selectedFormation.id
      ? {
          ...f,
          dancerPositions: [...f.dancerPositions, { id: uuidv4(), numberInFormation: f.dancerPositions.length + 1, position: { x: 0, y: 0 } }],
        }
      : f));
  };

  const handleUpdateDancer = (id: string, position: { x: number; y: number }) => {
    if (!selectedFormationId) return;
    applyFormations((prev) => prev.map((f) => f.id === selectedFormationId ? {
      ...f,
      dancerPositions: f.dancerPositions.map((d) => d.id === id ? { ...d, position } : d),
    } : f));
  };

  const handleDeleteDancer = () => {
    if (!selectedFormation || !selectedDancerId || selectedFormation.dancerPositions.length <= 1) return;

    applyFormations((prev) => prev.map((f) => f.id === selectedFormation.id
      ? {
          ...f,
          dancerPositions: f.dancerPositions.filter((d) => d.id !== selectedDancerId).map((d, i) => ({ ...d, numberInFormation: i + 1 })),
        }
      : f));
    setSelectedDancerId(null);
  };

  const handleAddFormation = () => {
    if (formations.length >= 16) return;

    const last = formations[formations.length - 1];
    const start = last ? last.startTimeMs + last.durationMs : 0;
    const durationMs = DEFAULT_FORMATION_MS;
    const source = last?.dancerPositions ?? [{ id: uuidv4(), numberInFormation: 1, position: { x: 0, y: 0 } }];
    const newFormationId = uuidv4();

    const newFormation: Formation = {
      id: newFormationId,
      numberInScenario: formations.length + 1,
      startTimeMs: start,
      durationMs,
      animationDurationMs: formations.length === 0 ? 0 : Math.floor(durationMs / 2),
      name: defaultFormationName(formations.length + 1),
      description: '',
      isAutoName: true,
      dancerPositions: source.map((d, i) => ({ id: uuidv4(), numberInFormation: i + 1, position: { ...d.position } })),
    };

    const normalized = normalizeWithDuration([...formations, newFormation], totalDurationMs);
    setFormations(normalized.formations);
    setTotalDurationMs(normalized.totalDurationMs);
    setSelectedFormationId(newFormationId);
    setSelectedDancerId(null);
    setCurrentTimeMs(normalized.formations.find((f) => f.id === newFormationId)?.startTimeMs ?? currentTimeMs);
    persistDraft(normalized.formations, normalized.totalDurationMs, newFormationId, null);
  };

  const handleDeleteFormation = () => {
    if (!selectedFormationId || formations.length <= 1) return;

    const filtered = formations.filter((f) => f.id !== selectedFormationId);
    const normalized = normalizeWithDuration(filtered, totalDurationMs);
    const nextSelectedId = normalized.formations[0]?.id ?? null;

    setFormations(normalized.formations);
    setTotalDurationMs(normalized.totalDurationMs);
    setSelectedFormationId(nextSelectedId);
    setSelectedDancerId(null);
    if (nextSelectedId) {
      const nextFormation = normalized.formations.find((f) => f.id === nextSelectedId);
      setCurrentTimeMs(nextFormation?.startTimeMs ?? 0);
    }
    persistDraft(normalized.formations, normalized.totalDurationMs, nextSelectedId, null);
  };

  const jumpToRelativeFormation = (direction: 'prev' | 'next') => {
    if (!formations.length) return;
    const currentIdx = findFormationIndexAtTime(formations, currentTimeMs);
    const nextIdx = direction === 'prev' ? Math.max(0, currentIdx - 1) : Math.min(formations.length - 1, currentIdx + 1);
    const target = formations[nextIdx];
    if (!target) return;
    setCurrentTimeMs(target.startTimeMs);
    setSelectedFormationId(target.id);
    setSelectedDancerId(null);
  };

  const saveToBackend = async (isPublished: boolean) => {
    if (!user) {
      setPendingAction(isPublished ? 'publish' : 'save');
      setModalOpen(true);
      return;
    }

    if (!scenarioId) {
      setPendingAction(isPublished ? 'publish' : 'save');
      setScenarioModalVisible(true);
      return;
    }

    const existing = await getScenarioById(scenarioId);
    const request: ScenarioRequest = {
      title: existing.title,
      description: existing.description,
      formations,
      dancerCount: Math.max(...formations.map((f) => f.dancerPositions.length)),
      isPublished,
      totalDurationMs,
    };

    await updateScenario(scenarioId, request);
  };

  return (
    <>
      <Layout style={{ height: 'calc(100vh - 128px)' }}>
        <EditorSidebar
          dancerCount={selectedFormation?.dancerPositions.length ?? 0}
          dancerPositions={selectedFormation?.dancerPositions ?? []}
          selectedDancerId={selectedDancerId}
          onSelectDancer={setSelectedDancerId}
          onAddDancer={handleAddDancer}
          onDeleteDancer={handleDeleteDancer}
          formationCount={formations.length}
          formations={formations}
          selectedFormationId={selectedFormationId}
          onSelectFormation={activateFormation}
          onAddFormation={handleAddFormation}
          onDeleteFormation={handleDeleteFormation}
          onSaveScenario={() => saveToBackend(false)}
          onPublicScenario={() => saveToBackend(true)}
          onExportScenario={async () => {
            if (!scenarioId) return;
            const scenario = await getScenarioById(scenarioId);
            exportScenarioToPdf({ title: scenario.title, formations: scenario.formations });
          }}
          totalDurationMs={totalDurationMs}
          onChangeTotalDuration={(nextMs) => {
            const required = requiredScenarioDurationMs(formations);
            const clamped = clamp(Math.max(nextMs, required), MIN_SCENARIO_MS, MAX_SCENARIO_MS);
            setTotalDurationMs(clamped);
            persistDraft(formations, clamped);
          }}
          onUpdateFormationMeta={(id, name, description) => {
            const next = normalizeWithDuration(
              formations.map((f) => {
                if (f.id !== id) return f;
                const generated = defaultFormationName(f.numberInScenario);
                const trimmed = name.trim();
                const isAutoName = !trimmed || trimmed === generated;
                return { ...f, name: trimmed || generated, description, isAutoName };
              }),
              totalDurationMs,
            );
            setFormations(next.formations);
            setTotalDurationMs(next.totalDurationMs);
            persistDraft(next.formations, next.totalDurationMs);
          }}
        />

        <Layout style={{ background: 'var(--app-bg)', paddingLeft: 250 }}>
          <Content style={{ marginTop: 25, marginLeft: 25, marginRight: 25, padding: 0, background: 'var(--app-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 'min(100%, 1360px)', display: 'flex', justifyContent: 'center' }}>
              <Scene
                dancerPositions={renderedDancerPositions}
                onMove={handleUpdateDancer}
                onSelectDancer={setSelectedDancerId}
                selectedDancerId={selectedDancerId}
              />
            </div>

            <div style={{ width: 'min(100%, 1360px)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 12 }}>
              <div style={{ color: 'var(--editor-item-text)', minWidth: 140, textAlign: 'right' }}>
                {formatTime(currentTimeMs)} / {formatTime(totalDurationMs)}
              </div>
              <Button icon={<DoubleLeftOutlined />} onClick={() => jumpToRelativeFormation('prev')} />
              <Button type="primary" icon={isPlaying ? <PauseOutlined /> : <CaretRightOutlined />} onClick={() => setIsPlaying((p) => !p)}>
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button icon={<DoubleRightOutlined />} onClick={() => jumpToRelativeFormation('next')} />
              <MonitorOutlined style={{ color: 'var(--editor-item-text)' }} />
              <div style={{ width: 220, paddingLeft: 4 }}>
                <Slider min={1} max={100} step={1} value={timelineZoomPercent} onChange={(value) => setTimelineZoomPercent(Number(value))} tooltip={{ formatter: (v) => `${v}%` }} />
              </div>
            </div>

            <div style={{ width: 'min(100%, 1360px)' }}>
              <Timeline
                formations={formations}
                totalDurationMs={totalDurationMs}
                currentTimeMs={currentTimeMs}
                selectedFormationId={selectedFormationId}
                zoomPercent={timelineZoomPercent}
                onSelectFormation={activateFormation}
                onSetCurrentTime={setCurrentTimeMs}
                onResizeFormation={(id, durationMs) => {
                  applyFormations((prev) => prev.map((f) => {
                    if (f.id !== id) return f;
                    const d = clamp(durationMs, MIN_FORMATION_MS, MAX_FORMATION_MS);
                    return { ...f, durationMs: d, animationDurationMs: Math.min(f.animationDurationMs, d) };
                  }));
                }}
                onResizeFormationEnd={() => persistDraft(formationsRef.current, Math.max(totalDurationRef.current, requiredScenarioDurationMs(formationsRef.current)))}
                onChangeAnimationDuration={(id, animationDurationMs) => {
                  applyFormations((prev) => prev.map((f) => {
                    if (f.id !== id || f.numberInScenario === 1) return f;
                    return { ...f, animationDurationMs: clamp(animationDurationMs, 0, f.durationMs) };
                  }));
                }}
                onChangeAnimationDurationEnd={() => persistDraft(formationsRef.current, Math.max(totalDurationRef.current, requiredScenarioDurationMs(formationsRef.current)))}
              />
            </div>
          </Content>
        </Layout>
      </Layout>

      <AuthModal open={isModalOpen} onClose={() => setModalOpen(false)} />

      <CreateUpdateScenario
        isModalOpen={isScenarioModalVisible}
        handleCancel={() => {
          setScenarioModalVisible(false);
          setPendingAction(null);
        }}
        handleCreate={async (data) => {
          const request: ScenarioRequest = {
            ...data,
            dancerCount: Math.max(...formations.map((f) => f.dancerPositions.length)),
            isPublished: pendingAction === 'publish',
            formations,
            totalDurationMs,
          };

          const response = await createScenario(request);
          setScenarioId(response.id);
          setScenarioModalVisible(false);
          setPendingAction(null);
        }}
      />
    </>
  );
}
