import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "./lib/supabase";
import { fetchPets, seedInitialData, uploadPhoto } from "./lib/data";
import Auth from "./components/Auth";
import { T, css, todayStr, calcAge, daysTo } from "./theme";
import { Btn, Toast, Skeleton } from "./components/ui";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import Modals from "./components/Modals";
import Dashboard from "./components/tabs/Dashboard";
import Meds from "./components/tabs/Meds";
import Labs from "./components/tabs/Labs";
import CalendarTab from "./components/tabs/CalendarTab";
import Food from "./components/tabs/Food";
import Weight from "./components/tabs/Weight";
import Cost from "./components/tabs/Cost";
import Settings from "./components/tabs/Settings";

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [pid, setPid] = useState(null);
  const [tab, setTab] = useState("dash");
  const [modal, setModal] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const pet = pets.find((p) => p.id === pid) || pets[0];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setPets([]);
      setLoaded(false);
      return;
    }
    const loadData = async () => {
      try {
        let data = await fetchPets(user.id);
        if (data.length === 0) {
          await seedInitialData(user.id);
          data = await fetchPets(user.id);
        }
        setPets(data);
        if (data.length > 0) setPid(data[0].id);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoaded(true);
      }
    };
    loadData();
  }, [user]);

  const reload = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    try {
      const data = await fetchPets(user.id);
      setPets(data);
    } catch (err) {
      console.error("Failed to reload:", err);
    } finally {
      setSaving(false);
    }
  }, [user]);

  // Computed
  const age = pet ? calcAge(pet.birth) : 0;
  const lw = pet?.weights?.length ? pet.weights[pet.weights.length - 1].value : 0;
  const tgt = 5.0;
  const abnC = pet?.labs?.reduce((s, l) => s + l.results.filter((r) => r.st !== "ok").length, 0) || 0;
  const totCost = pet?.visits?.reduce((s, v) => s + v.cost, 0) || 0;
  const nextMed = pet?.meds?.filter((m) => m.active).sort((a, b) => a.next?.localeCompare(b.next))[0];
  const nextDays = nextMed ? daysTo(nextMed.next) : null;

  // ─── Handlers ───
  const handlePhoto = async (e) => {
    const f = e.target.files?.[0];
    if (!f || !pet || !user) return;
    setSaving(true);
    try {
      await uploadPhoto(user.id, pet.id, f);
      await reload();
    } catch (err) {
      console.error("Photo upload failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const addTodo = async (text) => {
    if (!text.trim() || !pet) return;
    setSaving(true);
    try {
      await supabase.from("todos").insert({ pet_id: pet.id, text, done: false });
      await reload();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const togTodo = async (todo) => {
    setSaving(true);
    try {
      await supabase.from("todos").update({ done: !todo.done }).eq("id", todo.id);
      await reload();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const delTodo = async (id) => {
    setSaving(true);
    try {
      await supabase.from("todos").delete().eq("id", id);
      await reload();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const addWeight = async (v) => {
    const n = parseFloat(v);
    if (isNaN(n) || n <= 0 || !pet) return;
    setSaving(true);
    try {
      await supabase.from("weights").insert({ pet_id: pet.id, date: todayStr(), value: n });
      await reload();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const delWeight = async (id) => {
    setSaving(true);
    try {
      await supabase.from("weights").delete().eq("id", id);
      await reload();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const addFood = async (d) => {
    if (!pet) return;
    setSaving(true);
    try {
      await supabase.from("foods").insert({
        pet_id: pet.id, date: todayStr(), time: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
        name: d.name, amount: d.amount, type: d.type,
      });
      await reload();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const delFood = async (id) => {
    setSaving(true);
    try {
      await supabase.from("foods").delete().eq("id", id);
      await reload();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const addMed = async (d) => {
    if (!pet) return;
    setSaving(true);
    try {
      await supabase.from("meds").insert({
        pet_id: pet.id,
        name: d.name,
        purpose: d.purpose,
        freq: d.freq,
        interval_days: d.interval,
        next_dose: d.next,
        remaining: d.remaining,
        active: true,
      });
      await reload();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const delMed = async (id) => {
    setSaving(true);
    try {
      await supabase.from("meds").delete().eq("id", id);
      await reload();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const recordDose = async (id) => {
    const med = pet?.meds?.find((m) => m.id === id);
    if (!med) return;
    setSaving(true);
    try {
      const nd = new Date(todayStr());
      nd.setDate(nd.getDate() + (med.interval || 30));
      await supabase
        .from("meds")
        .update({
          next_dose: nd.toISOString().slice(0, 10),
          remaining: Math.max(0, (med.remaining || 1) - 1),
        })
        .eq("id", id);
      await reload();
    } catch (err) { console.error(err); }
    setSaving(false);
    setModal(null);
  };

  const addCondition = async (d) => {
    if (!pet) return;
    setSaving(true);
    try {
      await supabase.from("conditions").insert({ pet_id: pet.id, name: d.name, severity: d.sev, note: d.note });
      await reload();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const delCondition = async (id) => {
    setSaving(true);
    try {
      await supabase.from("conditions").delete().eq("id", id);
      await reload();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const addVisit = async (d) => {
    if (!pet) return;
    setSaving(true);
    try {
      await supabase.from("visits").insert({ pet_id: pet.id, date: d.date, clinic: d.clinic, cost: d.cost, summary: d.summary });
      await reload();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const delVisit = async (id) => {
    setSaving(true);
    try {
      await supabase.from("visits").delete().eq("id", id);
      await reload();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const addSchedule = async (d) => {
    if (!pet) return;
    setSaving(true);
    try {
      await supabase.from("schedule").insert({ pet_id: pet.id, date: d.date, label: d.label });
      await reload();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const delSchedule = async (id) => {
    setSaving(true);
    try {
      await supabase.from("schedule").delete().eq("id", id);
      await reload();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const addLab = async (d) => {
    if (!pet) return;
    setSaving(true);
    try {
      const { data: lab } = await supabase.from("labs").insert({ pet_id: pet.id, date: d.date, type: d.type }).select().single();
      if (lab && d.results.length > 0) {
        await supabase.from("lab_results").insert(
          d.results.map((r) => ({
            lab_id: lab.id,
            name: r.name,
            val: r.val,
            unit: r.unit,
            ref_range: r.ref,
            status: r.st,
            note: r.note,
          }))
        );
      }
      await reload();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const delLab = async (id) => {
    setSaving(true);
    try {
      await supabase.from("labs").delete().eq("id", id);
      await reload();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const addPet = async (d) => {
    if (!user) return;
    setSaving(true);
    try {
      const { data: np } = await supabase
        .from("pets")
        .insert({
          user_id: user.id,
          name: d.name,
          emoji: d.emoji,
          birth: d.birth,
          breed: d.breed,
          sex: d.sex,
        })
        .select()
        .single();
      await reload();
      if (np) setPid(np.id);
    } catch (err) { console.error(err); }
    setSaving(false);
    setModal(null);
  };

  const delPet = async (id) => {
    if (pets.length <= 1) return;
    setSaving(true);
    try {
      await supabase.from("pets").delete().eq("id", id);
      await reload();
      if (pid === id && pets.length > 1) {
        const remaining = pets.find((p) => p.id !== id);
        if (remaining) setPid(remaining.id);
      }
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const updatePet = async (d) => {
    if (!pet) return;
    setSaving(true);
    try {
      await supabase
        .from("pets")
        .update({
          name: d.name,
          emoji: d.emoji,
          birth: d.birth,
          breed: d.breed,
          sex: d.sex,
        })
        .eq("id", pet.id);
      await reload();
    } catch (err) { console.error(err); }
    setSaving(false);
    setModal(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Loading states
  if (authLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: T.bg }}>
        <style>{css}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 44, animation: "pulse 1.5s infinite" }}>🐾</div>
          <p style={{ color: T.tx2, fontSize: 13, marginTop: 12, fontWeight: 600 }}>読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Auth />;

  if (!loaded) {
    return (
      <div style={{ background: T.bg, minHeight: "100vh", padding: 18, maxWidth: 520, margin: "0 auto" }}>
        <style>{css}</style>
        <Skeleton h={90} />
        <Skeleton h={70} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <Skeleton h={100} />
          <Skeleton h={100} />
          <Skeleton h={100} />
        </div>
        <Skeleton h={120} />
      </div>
    );
  }

  if (!pet) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: T.bg }}>
        <style>{css}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 10 }}>🐾</div>
          <p style={{ color: T.tx2, fontSize: 14, marginBottom: 16, fontWeight: 600 }}>ペットを追加してください</p>
          <Btn onClick={() => setModal({ type: "addPet" })}>ペット追加</Btn>
        </div>
        <Modals
          modal={modal}
          setModal={setModal}
          pet={pet}
          recordDose={recordDose}
          addTodo={addTodo}
          addCondition={addCondition}
          addMed={addMed}
          addFood={addFood}
          addWeight={addWeight}
          addVisit={addVisit}
          addSchedule={addSchedule}
          addLab={addLab}
          addPet={addPet}
          updatePet={updatePet}
        />
      </div>
    );
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.tx, paddingBottom: 88 }}>
      <style>{css}</style>
      <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />

      <div style={{ maxWidth: 520, margin: "0 auto", position: "relative" }}>
        <Header
          pet={pet}
          pets={pets}
          setPid={setPid}
          onAddPet={() => setModal({ type: "addPet" })}
          onPhotoClick={() => fileRef.current?.click()}
          lw={lw}
        />

        <div className="fade" key={`${pid}-${tab}`} style={{ padding: "16px 18px 24px" }}>
          {tab === "dash" && (
            <Dashboard
              pet={pet}
              abnC={abnC}
              totCost={totCost}
              lw={lw}
              tgt={tgt}
              nextMed={nextMed}
              nextDays={nextDays}
              setModal={setModal}
              togTodo={togTodo}
              delTodo={delTodo}
              delCondition={delCondition}
            />
          )}
          {tab === "meds" && <Meds pet={pet} setModal={setModal} delMed={delMed} delSchedule={delSchedule} />}
          {tab === "labs" && <Labs pet={pet} setModal={setModal} delLab={delLab} />}
          {tab === "cal" && <CalendarTab pet={pet} setModal={setModal} delVisit={delVisit} />}
          {tab === "food" && <Food pet={pet} setModal={setModal} delFood={delFood} />}
          {tab === "wt" && <Weight pet={pet} lw={lw} tgt={tgt} setModal={setModal} delWeight={delWeight} />}
          {tab === "cost" && <Cost pet={pet} totCost={totCost} />}
          {tab === "cfg" && (
            <Settings
              pet={pet}
              pets={pets}
              user={user}
              age={age}
              fileRef={fileRef}
              setModal={setModal}
              handleLogout={handleLogout}
              delPet={delPet}
            />
          )}
        </div>
      </div>

      <BottomNav tab={tab} setTab={setTab} />
      <Toast show={saving} text="保存中..." />

      <Modals
        modal={modal}
        setModal={setModal}
        pet={pet}
        recordDose={recordDose}
        addTodo={addTodo}
        addCondition={addCondition}
        addMed={addMed}
        addFood={addFood}
        addWeight={addWeight}
        addVisit={addVisit}
        addSchedule={addSchedule}
        addLab={addLab}
        addPet={addPet}
        updatePet={updatePet}
      />
    </div>
  );
}
