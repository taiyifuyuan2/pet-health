import { supabase } from './supabase'

// Fetch all pets with their related data
export async function fetchPets(userId) {
  const { data: pets, error } = await supabase
    .from('pets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at');

  if (error) throw error;
  if (!pets || pets.length === 0) return [];

  // Fetch related data for each pet in parallel
  for (const pet of pets) {
    const [conditions, meds, labs, visits, weights, foods, todos, schedule] = await Promise.all([
      supabase.from('conditions').select('*').eq('pet_id', pet.id),
      supabase.from('meds').select('*').eq('pet_id', pet.id),
      supabase.from('labs').select('*, lab_results(*)').eq('pet_id', pet.id).order('date', { ascending: false }),
      supabase.from('visits').select('*, visit_items(*)').eq('pet_id', pet.id).order('date', { ascending: false }),
      supabase.from('weights').select('*').eq('pet_id', pet.id).order('date'),
      supabase.from('foods').select('*').eq('pet_id', pet.id).order('created_at', { ascending: false }),
      supabase.from('todos').select('*').eq('pet_id', pet.id).order('created_at'),
      supabase.from('schedule').select('*').eq('pet_id', pet.id).order('date'),
    ]);

    pet.conditions = (conditions.data || []).map(c => ({
      id: c.id,
      name: c.name,
      sev: c.severity,
      note: c.note,
    }));
    pet.meds = (meds.data || []).map(m => ({
      id: m.id,
      name: m.name,
      purpose: m.purpose,
      freq: m.freq,
      interval: m.interval_days,
      next: m.next_dose,
      remaining: m.remaining,
      active: m.active,
    }));
    pet.labs = (labs.data || []).map(l => ({
      id: l.id,
      date: l.date,
      type: l.type,
      results: (l.lab_results || []).map(r => ({
        name: r.name,
        val: parseFloat(r.val),
        unit: r.unit,
        ref: r.ref_range,
        st: r.status,
        note: r.note,
      })),
    }));
    pet.visits = (visits.data || []).map(v => ({
      id: v.id,
      date: v.date,
      clinic: v.clinic,
      cost: v.cost,
      summary: v.summary,
      items: (v.visit_items || []).map(i => ({
        n: i.name,
        a: i.amount,
      })),
    }));
    pet.weights = (weights.data || []).map(w => ({
      id: w.id,
      date: w.date,
      value: parseFloat(w.value),
    }));
    pet.foods = (foods.data || []).map(f => ({
      id: f.id,
      date: f.date,
      time: f.time,
      name: f.name,
      amount: f.amount,
      type: f.type,
    }));
    pet.todos = (todos.data || []).map(t => ({
      id: t.id,
      text: t.text,
      done: t.done,
      due: t.due_date || null,
    }));
    pet.schedule = (schedule.data || []).map(s => ({
      id: s.id,
      date: s.date,
      label: s.label,
    }));

    // Map DB fields to app fields
    pet.photo = pet.photo_url;
    pet.birth = pet.birth;
    pet.emoji = pet.emoji || '🐾';
    pet.target_weight = pet.target_weight != null ? parseFloat(pet.target_weight) : 5.0;
  }

  return pets;
}

// Initial data for first-time users
const INIT_PETS = [
  {
    name: "ラムちゃん", emoji: "🐕", birth: "2021-08-07", breed: "ミニチュアダックスフンド", sex: "♂ 去勢済",
    conditions: [
      { name: "心肥大", sev: "要経過観察", note: "レントゲンで確認。エコー未実施。" },
      { name: "高脂血症", sev: "軽度", note: "CPK 226。食事管理必要。" },
      { name: "椎間板ヘルニア", sev: "Gr.1", note: "背骨湾曲。安静指示。" },
      { name: "電解質異常", sev: "要確認", note: "Na/K/Cl低値。腎臓正常。" },
      { name: "血小板低値", sev: "要観察", note: "PLT 8.5（基準20-50）。" },
      { name: "肥満", sev: "要改善", note: "7.4kg。適正4.5-5kg。" },
    ],
    meds: [
      { name: "アンチノール30", purpose: "抗炎症（心臓・関節）", freq: "毎日1粒", interval: 1, next: "2026-04-15", remaining: 28, active: true },
      { name: "イベルメックM", purpose: "フィラリア予防", freq: "月1回", interval: 30, next: "2026-05-01", remaining: 3, active: true },
      { name: "ブラベクト250", purpose: "ノミ・マダニ予防", freq: "3ヶ月に1回", interval: 90, next: "2026-04-14", remaining: 2, active: true },
    ],
    labs: [{
      date: "2026-04-13", type: "総合血液検査+腎臓パネル",
      results: [
        { name: "GLU", val: 120, unit: "mg/dL", ref: "75-128", st: "ok" },
        { name: "TCHO", val: 166, unit: "mg/dL", ref: "111-312", st: "ok" },
        { name: "TG", val: 78, unit: "mg/dL", ref: "30-133", st: "ok" },
        { name: "CPK", val: 226, unit: "U/L", ref: "49-166", st: "hi", note: "心筋損傷指標" },
        { name: "GOT", val: 34, unit: "U/L", ref: "17-44", st: "ok" },
        { name: "GPT", val: 69, unit: "U/L", ref: "17-78", st: "ok" },
        { name: "Na", val: 133, unit: "mEq/L", ref: "141-152", st: "lo", note: "電解質低下" },
        { name: "K", val: 2.8, unit: "mEq/L", ref: "3.8-5.0", st: "lo", note: "電解質低下" },
        { name: "Cl", val: 95, unit: "mEq/L", ref: "102-117", st: "lo", note: "電解質低下" },
        { name: "RBC", val: 942, unit: "×10⁴/μL", ref: "550-850", st: "hi", note: "脱水or心臓代償" },
        { name: "HGB", val: 18.4, unit: "g/dL", ref: "12.0-18.0", st: "hi" },
        { name: "HCT", val: 57.1, unit: "%", ref: "37.0-55.0", st: "hi" },
        { name: "PLT", val: 8.5, unit: "×10⁴/μL", ref: "20.0-50.0", st: "lo", note: "血小板低値" },
        { name: "SDMA", val: 10, unit: "μg/dL", ref: "0-14", st: "ok" },
        { name: "CRE", val: 0.8, unit: "mg/dL", ref: "0.5-1.8", st: "ok" },
        { name: "BUN", val: 16, unit: "mg/dL", ref: "7-27", st: "ok" },
      ],
    }],
    visits: [{
      date: "2026-04-13", clinic: "みなみ動物クリニック", cost: 44869,
      summary: "初診。心肥大・高脂血症・椎間板ヘルニア確認。皮下点滴。安静指示。",
      items: [
        { n: "初診料", a: 1000 }, { n: "レントゲン×2", a: 7000 }, { n: "血液血球", a: 2500 },
        { n: "血液生化SDMA", a: 8950 }, { n: "犬スナップ", a: 2000 }, { n: "皮下点滴", a: 1000 },
        { n: "ビタミン剤・強肝剤", a: 1500 }, { n: "トリミング", a: 1500 },
        { n: "アンチノール30", a: 3300 }, { n: "イベルメックM×3", a: 2580 }, { n: "ブラベクト250×2", a: 9460 },
      ],
    }],
    weights: [{ date: "2026-04-13", value: 7.4 }],
    foods: [],
    todos: [
      { text: "心臓エコー検査", done: false },
      { text: "低脂肪フードへ切り替え", done: false },
      { text: "歯科チェック", done: false },
      { text: "減量：まず6.5kgへ", done: false },
    ],
    schedule: [
      { date: "2026-05-01", label: "イベルメック投与開始" },
      { date: "2026-07-13", label: "ブラベクト次回" },
      { date: "2026-10-13", label: "半年検診" },
      { date: "2026-11-25", label: "6種混合ワクチン" },
    ],
  },
  {
    name: "モカちゃん", emoji: "🐶", birth: "2023-06-06", breed: "ミニチュアダックスフンド", sex: "♂ 去勢済",
    conditions: [{ name: "肥満気味", sev: "要注意", note: "7.1kg。適正4.5-5kg。" }],
    meds: [], labs: [], visits: [],
    weights: [{ date: "2026-04-14", value: 7.1 }],
    foods: [],
    todos: [
      { text: "フィラリア検査・予防薬", done: false },
      { text: "ノミ・マダニ予防", done: false },
      { text: "狂犬病ワクチン確認", done: false },
    ],
    schedule: [{ date: "2026-11-25", label: "6種混合ワクチン" }],
  },
];

// Seed initial data for new users
export async function seedInitialData(userId) {
  for (const petData of INIT_PETS) {
    // Insert pet
    const { data: pet, error: petError } = await supabase
      .from('pets')
      .insert({
        user_id: userId,
        name: petData.name,
        emoji: petData.emoji,
        birth: petData.birth,
        breed: petData.breed,
        sex: petData.sex,
      })
      .select()
      .single();

    if (petError) throw petError;

    // Insert conditions
    if (petData.conditions.length > 0) {
      await supabase.from('conditions').insert(
        petData.conditions.map(c => ({
          pet_id: pet.id,
          name: c.name,
          severity: c.sev,
          note: c.note,
        }))
      );
    }

    // Insert meds
    if (petData.meds.length > 0) {
      await supabase.from('meds').insert(
        petData.meds.map(m => ({
          pet_id: pet.id,
          name: m.name,
          purpose: m.purpose,
          freq: m.freq,
          interval_days: m.interval,
          next_dose: m.next,
          remaining: m.remaining,
          active: m.active,
        }))
      );
    }

    // Insert labs and lab_results
    for (const lab of petData.labs) {
      const { data: labRow, error: labError } = await supabase
        .from('labs')
        .insert({
          pet_id: pet.id,
          date: lab.date,
          type: lab.type,
        })
        .select()
        .single();

      if (labError) throw labError;

      if (lab.results.length > 0) {
        await supabase.from('lab_results').insert(
          lab.results.map(r => ({
            lab_id: labRow.id,
            name: r.name,
            val: r.val,
            unit: r.unit,
            ref_range: r.ref,
            status: r.st,
            note: r.note,
          }))
        );
      }
    }

    // Insert visits and visit_items
    for (const visit of petData.visits) {
      const { data: visitRow, error: visitError } = await supabase
        .from('visits')
        .insert({
          pet_id: pet.id,
          date: visit.date,
          clinic: visit.clinic,
          cost: visit.cost,
          summary: visit.summary,
        })
        .select()
        .single();

      if (visitError) throw visitError;

      if (visit.items.length > 0) {
        await supabase.from('visit_items').insert(
          visit.items.map(i => ({
            visit_id: visitRow.id,
            name: i.n,
            amount: i.a,
          }))
        );
      }
    }

    // Insert weights
    if (petData.weights.length > 0) {
      await supabase.from('weights').insert(
        petData.weights.map(w => ({
          pet_id: pet.id,
          date: w.date,
          value: w.value,
        }))
      );
    }

    // Insert todos
    if (petData.todos.length > 0) {
      await supabase.from('todos').insert(
        petData.todos.map(t => ({
          pet_id: pet.id,
          text: t.text,
          done: t.done,
        }))
      );
    }

    // Insert schedule
    if (petData.schedule.length > 0) {
      await supabase.from('schedule').insert(
        petData.schedule.map(s => ({
          pet_id: pet.id,
          date: s.date,
          label: s.label,
        }))
      );
    }
  }
}

// Upload photo to storage
export async function uploadPhoto(userId, petId, file) {
  const ext = file.name.split('.').pop();
  const filePath = `${userId}/${petId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('pet-photos')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('pet-photos')
    .getPublicUrl(filePath);

  await supabase
    .from('pets')
    .update({ photo_url: publicUrl })
    .eq('id', petId);

  return publicUrl;
}
