import { useAppStore } from "../store/useAppStore";

function TenantSidebar() {
  const { activeTenantId, setActiveTenant } = useAppStore();

  return (
    <div className="sidebar">
      <h2>Companies</h2>

      <div
        className={`tenant-item ${activeTenantId === 1 ? "active" : ""}`}
        onClick={() => setActiveTenant(1)}
      >
        Company 1
      </div>

      <div
        className={`tenant-item ${activeTenantId === 2 ? "active" : ""}`}
        onClick={() => setActiveTenant(2)}
      >
        Company 2
      </div>
    </div>
  );
}

export default TenantSidebar;
