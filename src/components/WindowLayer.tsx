import { useWindowStore } from "../store/windowStore";
import Window from "./Window";

export default function WindowLayer() {
  const windows = useWindowStore((s) => s.windows);

  return (
    <>
      {windows
        .filter((win) => !win.minimized)
        .map((win) => (
          <Window key={win.id} {...win} />
        ))}
    </>
  );
}
