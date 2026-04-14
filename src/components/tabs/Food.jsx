import { T } from "../../theme";
import { Card, Btn, Sec, Empty, DelBtn, IconCircle } from "../ui";

export default function Food({ pet, setModal, delFood }) {
  return (
    <>
      <Sec icon="🍽" action={<Btn small v="gh" onClick={() => setModal({ type: "addFood" })}>＋追加</Btn>}>食事記録</Sec>
      {!pet.foods?.length ? (
        <Empty icon="🍽" text="食事記録はまだありません" />
      ) : (
        pet.foods.map((f) => {
          const ic = f.type === "おやつ" ? "🦴" : f.type === "サプリ" ? "💊" : f.type === "ウェットフード" ? "🥫" : "🍖";
          const color = f.type === "おやつ" ? T.am : f.type === "サプリ" ? T.ac : T.gn;
          return (
            <Card key={f.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <IconCircle color={color} size={42}>{ic}</IconCircle>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{f.name}</div>
                <div style={{ fontSize: 10, color: T.tx2, marginTop: 2 }}>
                  {f.date} ・ {f.time} ・ {f.type}
                  {f.amount && ` ・ ${f.amount}`}
                </div>
              </div>
              <DelBtn onClick={() => delFood(f.id)} />
            </Card>
          );
        })
      )}
    </>
  );
}
