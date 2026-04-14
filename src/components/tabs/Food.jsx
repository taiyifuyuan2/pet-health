import { UtensilsCrossed, Bone, Pill } from "lucide-react";
import { T } from "../../theme";
import { Card, Btn, Sec, Empty, DelBtn, IconCircle, AddBtn } from "../ui";

export default function Food({ pet, setModal, delFood }) {
  return (
    <>
      <Sec icon={<UtensilsCrossed size={14} color={T.ac} />} action={<AddBtn onClick={() => setModal({ type: "addFood" })} />}>食事記録</Sec>
      {!pet.foods?.length ? (
        <Empty text="食事記録はまだありません" />
      ) : (
        pet.foods.map((f) => {
          const Ic = f.type === "おやつ" ? Bone : f.type === "サプリ" ? Pill : UtensilsCrossed;
          const color = f.type === "おやつ" ? T.am : f.type === "サプリ" ? T.ac : T.gn;
          return (
            <Card key={f.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <IconCircle color={color} size={42}>
                <Ic size={20} color={color} />
              </IconCircle>
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
