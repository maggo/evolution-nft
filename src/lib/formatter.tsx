export function formatFlow(value?: number) {
  if (typeof value === "undefined") return "";
  return (
    <>
      <span className="text-lg font-semibold">{value?.toLocaleString()}</span>{" "}
      <small>FLOW</small>
    </>
  );
}
