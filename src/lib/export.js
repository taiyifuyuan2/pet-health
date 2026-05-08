import { calcAge } from "../theme";

// CSV export helpers
function toCsv(headers, rows) {
  const escape = (v) => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const lines = [headers.map(escape).join(",")];
  for (const row of rows) lines.push(row.map(escape).join(","));
  return "\ufeff" + lines.join("\n"); // BOM for Excel
}

function downloadFile(content, filename, type = "text/csv;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportWeightsCsv(pet) {
  const headers = ["日付", "体重(kg)"];
  const rows = (pet.weights || []).map((w) => [w.date, w.value]);
  downloadFile(toCsv(headers, rows), `${pet.name}_体重記録.csv`);
}

export function exportLabsCsv(pet) {
  const headers = ["検査日", "検査種別", "項目名", "値", "単位", "基準値", "判定", "メモ"];
  const rows = [];
  for (const lab of pet.labs || []) {
    for (const r of lab.results || []) {
      rows.push([
        lab.date,
        lab.type,
        r.name,
        r.val,
        r.unit,
        r.ref,
        { ok: "正常", hi: "高値", lo: "低値" }[r.st] || r.st,
        r.note || "",
      ]);
    }
  }
  downloadFile(toCsv(headers, rows), `${pet.name}_検査結果.csv`);
}

export function exportVisitsCsv(pet) {
  const headers = ["日付", "病院名", "合計金額", "概要"];
  const rows = (pet.visits || []).map((v) => [v.date, v.clinic, v.cost, v.summary || ""]);
  downloadFile(toCsv(headers, rows), `${pet.name}_通院記録.csv`);
}

export function exportMedsCsv(pet) {
  const headers = ["薬名", "目的", "頻度", "次回投与日", "残り回数", "有効"];
  const rows = (pet.meds || []).map((m) => [
    m.name,
    m.purpose || "",
    m.freq,
    m.next || "",
    m.remaining ?? "",
    m.active ? "有効" : "停止",
  ]);
  downloadFile(toCsv(headers, rows), `${pet.name}_投薬記録.csv`);
}

// Vet report PDF (opens in print dialog)
export function exportVetReport(pet) {
  const age = calcAge(pet.birth);
  const lw = pet.weights?.length ? pet.weights[pet.weights.length - 1].value : "-";
  const activeMeds = (pet.meds || []).filter((m) => m.active);
  const recentLabs = (pet.labs || []).slice(0, 2);
  const recentVisits = (pet.visits || []).slice(0, 3);

  const html = `<!DOCTYPE html>
<html lang="ja"><head><meta charset="UTF-8">
<title>${pet.name} - 健康サマリー</title>
<style>
  *{box-sizing:border-box;margin:0}
  body{font-family:'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif;padding:24px;color:#2e1a1e;font-size:12px;line-height:1.6}
  h1{font-size:18px;font-weight:800;margin-bottom:4px;color:#d4677e}
  h2{font-size:14px;font-weight:700;margin:16px 0 8px;padding-bottom:4px;border-bottom:2px solid #f0e4e6}
  table{width:100%;border-collapse:collapse;margin:8px 0}
  th,td{text-align:left;padding:6px 8px;border:1px solid #e5d8db;font-size:11px}
  th{background:#fdf0f3;font-weight:700}
  .hi{color:#e11d48;font-weight:700} .lo{color:#2563eb;font-weight:700}
  .info{display:flex;gap:24px;margin:8px 0}
  .info div{flex:1}
  .label{color:#7a5c62;font-size:10px;font-weight:600}
  .value{font-size:14px;font-weight:800}
  .disclaimer{margin-top:20px;padding:10px;background:#fefce8;border-radius:6px;font-size:10px;color:#ca8a04}
  @media print{body{padding:16px}@page{margin:12mm}}
</style></head><body>
<h1>${pet.name} 健康サマリー</h1>
<p style="color:#7a5c62;font-size:11px;margin-bottom:12px">出力日: ${new Date().toLocaleDateString("ja-JP")}</p>

<div class="info">
  <div><span class="label">種類・品種</span><div class="value">${pet.breed || "-"}</div></div>
  <div><span class="label">年齢</span><div class="value">${age}歳</div></div>
  <div><span class="label">性別</span><div class="value">${pet.sex}</div></div>
  <div><span class="label">体重</span><div class="value">${lw}kg</div></div>
</div>

${activeMeds.length > 0 ? `
<h2>現在の投薬</h2>
<table>
  <tr><th>薬名</th><th>目的</th><th>頻度</th><th>次回投与</th></tr>
  ${activeMeds.map((m) => `<tr><td>${m.name}</td><td>${m.purpose || ""}</td><td>${m.freq}</td><td>${m.next || "-"}</td></tr>`).join("")}
</table>` : ""}

${recentLabs.length > 0 ? recentLabs.map((lab) => `
<h2>検査結果 (${lab.date} ${lab.type})</h2>
<table>
  <tr><th>項目</th><th>値</th><th>単位</th><th>基準値</th><th>判定</th></tr>
  ${(lab.results || []).map((r) => `<tr><td>${r.name}</td><td class="${r.st}">${r.val}</td><td>${r.unit}</td><td>${r.ref || "-"}</td><td class="${r.st}">${{ ok: "正常", hi: "高値", lo: "低値" }[r.st] || "-"}</td></tr>`).join("")}
</table>`).join("") : ""}

${recentVisits.length > 0 ? `
<h2>直近の通院記録</h2>
<table>
  <tr><th>日付</th><th>病院</th><th>金額</th><th>概要</th></tr>
  ${recentVisits.map((v) => `<tr><td>${v.date}</td><td>${v.clinic}</td><td>${v.cost ? v.cost.toLocaleString() + "円" : "-"}</td><td>${v.summary || ""}</td></tr>`).join("")}
</table>` : ""}

${pet.weights?.length >= 2 ? `
<h2>体重推移</h2>
<table>
  <tr><th>日付</th><th>体重(kg)</th></tr>
  ${pet.weights.slice(-10).map((w) => `<tr><td>${w.date}</td><td>${w.value}</td></tr>`).join("")}
</table>` : ""}

<div class="disclaimer">
  ※ 本レポートはPetHealthアプリにより自動生成されたものであり、医療アドバイスではありません。
  検査基準値は一般的な参考情報です。診断・治療は獣医師の判断に従ってください。
</div>
</body></html>`;

  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
  w.print();
}
