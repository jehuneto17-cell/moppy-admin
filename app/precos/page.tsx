"use client";

import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { AdminShell } from "@/components/AdminShell";
import { useStore } from "@/contexts/StoreContext";
import { auth, db } from "@/lib/firebase";

const SIZE_LABELS = ["Studio", "1q", "2q", "3q", "4q+"];
const TYPE_LABELS: Record<string, string> = { standard: "Padrão", heavy: "Pesada", laundry: "Passar Roupa" };
const TYPE_KEYS = Object.keys(TYPE_LABELS);
const DEFAULT_PRICES = { standard: [90, 90, 120, 150, 180], heavy: [140, 140, 190, 230, 270], laundry: [60, 60, 70, 80, 100] };

type CityDoc = {
  id: string;
  city: string;
  state: string;
  active: boolean;
  prices: Record<string, number[]>;
};

type HistoryEntry = { change: string; who: string; when: any };

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function PrecosPage() {
  const [cities, setCities] = useState<CityDoc[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<{ city: string; state: string; active: boolean; prices: Record<string, number[]> } | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showToast } = useStore();

  useEffect(() => {
    return onSnapshot(collection(db, "city_pricing"), (snap) =>
      setCities(snap.docs.map((d) => ({ id: d.id, ...d.data() } as CityDoc)))
    );
  }, []);

  useEffect(() => {
    if (!activeId) return;
    const q = query(collection(db, "city_pricing", activeId, "history"), orderBy("when", "desc"));
    return onSnapshot(q, (snap) => setHistory(snap.docs.map((d) => d.data() as HistoryEntry)));
  }, [activeId]);

  const active = cities?.find((c) => c.id === activeId) ?? null;

  function openEdit(c: CityDoc) {
    setAdding(false);
    setActiveId(c.id);
    setHistoryOpen(false);
    setHistory([]);
    setDraft({ city: c.city, state: c.state, active: c.active, prices: JSON.parse(JSON.stringify(c.prices)) });
  }

  function openAdd() {
    setAdding(true);
    setActiveId(null);
    setHistoryOpen(false);
    setHistory([]);
    setDraft({ city: "", state: "", active: true, prices: JSON.parse(JSON.stringify(DEFAULT_PRICES)) });
  }

  function closePanel() {
    setAdding(false);
    setActiveId(null);
    setDraft(null);
    setHistory([]);
  }

  function setCell(type: string, idx: number, value: string) {
    setDraft((d) => {
      if (!d) return d;
      const prices = { ...d.prices, [type]: [...d.prices[type]] };
      prices[type][idx] = Number(value.replace(/[^0-9.]/g, "")) || 0;
      return { ...d, prices };
    });
  }

  function diffSummary(before: CityDoc | null, after: { city: string; prices: Record<string, number[]> }) {
    if (!before) return `Cidade ${after.city} cadastrada`;
    const changes: string[] = [];
    for (const type of TYPE_KEYS) {
      SIZE_LABELS.forEach((size, i) => {
        const oldV = before.prices[type]?.[i];
        const newV = after.prices[type][i];
        if (oldV !== newV) changes.push(`${TYPE_LABELS[type]} ${size}: R$ ${oldV ?? "—"} → R$ ${newV}`);
      });
    }
    return changes.length > 0 ? changes.join("; ") : "Sem alterações de preço";
  }

  async function handleSave() {
    if (!draft || draft.city.trim().length < 2) return;
    setSaving(true);
    try {
      const id = adding ? slugify(draft.city) : activeId!;
      const summary = diffSummary(adding ? null : active, draft);

      await setDoc(
        doc(db, "city_pricing", id),
        { city: draft.city, state: draft.state.toUpperCase(), active: draft.active, prices: draft.prices, updated_at: serverTimestamp() },
        { merge: true }
      );
      await setDoc(doc(collection(db, "city_pricing", id, "history")), {
        change: summary,
        who: auth.currentUser?.email ?? "admin",
        when: serverTimestamp(),
      });

      showToast(adding ? `${draft.city} cadastrada` : `Preços de ${draft.city} atualizados`, "success");
      closePanel();
    } finally {
      setSaving(false);
    }
  }

  async function toggleActiveInline(c: CityDoc) {
    await updateDoc(doc(db, "city_pricing", c.id), { active: !c.active, updated_at: serverTimestamp() });
  }

  return (
    <AdminShell>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-ink">Preços por cidade</h1>
        <button onClick={openAdd} className="h-10 rounded-lg bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-hover">
          + Nova cidade
        </button>
      </div>

      {cities === null && <p className="text-sm text-faint">Carregando...</p>}
      {cities !== null && cities.length === 0 && (
        <p className="mt-16 text-center text-sm text-muted">
          Nenhuma cidade cadastrada ainda. Hoje o app usa um preço fixo (mesmo valor em qualquer lugar) — cadastre a primeira cidade para começar a diferenciar por região.
        </p>
      )}

      {cities !== null && (cities.length > 0 || draft) && (
        <div className="flex gap-4">
          {cities.length > 0 && (
            <div className="flex-1 overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="grid grid-cols-[2fr_1.2fr_130px_1.2fr_100px] border-b border-border bg-surface px-4">
                {["Cidade", "Estado", "Status", "Preço base", "Ação"].map((h, i) => (
                  <span key={h} className={`flex h-10 items-center text-sm font-medium text-muted ${i === 4 ? "justify-end" : ""}`}>
                    {h}
                  </span>
                ))}
              </div>
              {cities.map((c, i) => {
                const isActive = c.id === activeId;
                return (
                  <div
                    key={c.id}
                    className={`grid min-h-[44px] grid-cols-[2fr_1.2fr_130px_1.2fr_100px] items-center gap-2 border-b border-gray-100 px-4 transition-colors ${isActive ? "bg-brand-tint" : i % 2 ? "bg-surface hover:bg-gray-100" : "bg-white hover:bg-surface"}`}
                  >
                    <span className="text-[13px] font-medium text-ink">{c.city}</span>
                    <span className="text-xs text-muted">{c.state}</span>
                    <button
                      onClick={() => toggleActiveInline(c)}
                      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${c.active ? "bg-success-bg text-success-dark" : "bg-gray-100 text-muted"}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${c.active ? "bg-success" : "bg-faint"}`} />
                      {c.active ? "Ativo" : "Inativo"}
                    </button>
                    <span className="text-xs font-medium text-ink">{`R$ ${c.prices?.standard?.[0] ?? "—"},00`}</span>
                    <button
                      onClick={() => openEdit(c)}
                      className={`h-7 justify-self-end rounded-md border border-brand px-3 text-xs font-medium transition-colors ${isActive ? "bg-brand text-white" : "bg-white text-brand hover:bg-brand-tint"}`}
                    >
                      Editar
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <AnimatePresence>
            {draft && (
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.15 }}
                className="w-[480px] self-start rounded-lg bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  {adding ? (
                    <div className="mr-3 flex flex-1 gap-2">
                      <input
                        placeholder="Cidade"
                        value={draft.city}
                        onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                        className="h-9 flex-1 rounded-md border border-border-strong px-2.5 text-sm"
                      />
                      <input
                        placeholder="UF"
                        maxLength={2}
                        value={draft.state}
                        onChange={(e) => setDraft({ ...draft, state: e.target.value })}
                        className="h-9 w-14 rounded-md border border-border-strong px-2.5 text-sm uppercase"
                      />
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-xl font-bold text-ink">{draft.city}</h2>
                      <p className="mt-1 text-xs text-faint">{draft.state} · tabela de preços</p>
                    </div>
                  )}
                  <button onClick={closePanel} className="text-faint hover:text-ink">
                    ✕
                  </button>
                </div>

                <div className="my-5 flex items-center justify-between rounded-lg border border-border bg-surface p-3.5">
                  <div>
                    <p className="text-sm font-medium text-ink">Cidade ativa</p>
                    <p className="mt-0.5 text-xs text-faint">Liga a cidade no feed dos usuários</p>
                  </div>
                  <button
                    onClick={() => setDraft({ ...draft, active: !draft.active })}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${draft.active ? "bg-brand" : "bg-border-strong"}`}
                  >
                    <motion.span
                      className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow"
                      animate={{ left: draft.active ? 22 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                <p className="mb-2.5 text-xs font-medium tracking-wide text-muted uppercase">Preços por tipo e tamanho (R$)</p>
                <div className="mb-2 grid grid-cols-[110px_repeat(5,1fr)] gap-1.5">
                  <span />
                  {SIZE_LABELS.map((sz) => (
                    <span key={sz} className="text-center text-[11px] font-medium text-faint">
                      {sz}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  {TYPE_KEYS.map((type) => (
                    <div key={type} className="grid grid-cols-[110px_repeat(5,1fr)] items-center gap-1.5">
                      <span className="text-[13px] font-medium text-ink">{TYPE_LABELS[type]}</span>
                      {draft.prices[type].map((v, idx) => (
                        <input
                          key={idx}
                          value={v}
                          onChange={(e) => setCell(type, idx, e.target.value)}
                          className="h-[34px] w-full rounded-md border border-border-strong px-2 text-center text-[13px] text-ink"
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {!adding && (
                  <div className="mt-6 overflow-hidden rounded-lg border border-border">
                    <button onClick={() => setHistoryOpen((o) => !o)} className="flex w-full items-center justify-between bg-white px-3.5 py-3">
                      <span className="text-sm font-medium text-ink">Histórico de mudanças</span>
                      <span className="text-xs text-faint">{historyOpen ? "▲" : "▼"}</span>
                    </button>
                    <AnimatePresence>
                      {historyOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="flex flex-col gap-3 overflow-hidden border-t border-border px-3.5 py-3"
                        >
                          {history.length === 0 && <p className="text-[13px] text-faint">Sem alterações registradas.</p>}
                          {history.map((h, i) => (
                            <div key={i} className="flex gap-2.5">
                              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                              <div>
                                <p className="text-[13px] text-ink-soft">{h.change}</p>
                                <p className="mt-0.5 text-[11px] text-faint">
                                  {h.who} · {toDate(h.when)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <button
                  onClick={handleSave}
                  disabled={saving || draft.city.trim().length < 2}
                  className="mt-5 h-11 w-full rounded-lg bg-brand text-sm font-bold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-[#C4B5FD]"
                >
                  {saving ? "Salvando..." : "Salvar preços"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AdminShell>
  );
}

function toDate(ts: any) {
  if (!ts) return "agora";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
