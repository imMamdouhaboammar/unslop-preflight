export function Dropdown() {
  return (
    <div className="relative overflow-hidden">
      <button>Open menu</button>
      <div className="absolute z-[9999] top-full">
        Menu
      </div>
    </div>
  );
}
