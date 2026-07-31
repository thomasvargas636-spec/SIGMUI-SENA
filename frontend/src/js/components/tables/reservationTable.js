    // Simulación de datos (Mock Data) aislada del árbol del DOM principal
const mockReservations = [
  { id: "RES-001", zone: "Zona A - Nivel 1", vehicle: "AAA-123", date: "2026-07-20", duration: "2h", amount: "$15.000", status: "pagada" },
  { id: "RES-002", zone: "Zona B - Nivel 2", vehicle: "BBB-456", date: "2026-07-21", duration: "1h", amount: "$8.000", status: "pendiente" },
  { id: "RES-003", zone: "Zona A - Nivel 1", vehicle: "CCC-789", date: "2026-07-22", duration: "3h", amount: "$22.500", status: "cancelado" }
];

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("reservationTableBody");
  const filterButtons = document.querySelectorAll(".filtro-btn");

  function calculateSummary(data) {
    document.getElementById("totalReservas").textContent = data.length;
    document.getElementById("totalPagadas").textContent = data.filter(r => r.status === "pagada").length;
    document.getElementById("totalPendientes").textContent = data.filter(r => r.status === "pendiente").length;
    document.getElementById("totalCanceladas").textContent = data.filter(r => r.status === "cancelado").length;
  }

  function renderTable(data) {
    tableBody.innerHTML = "";
    
    if (data.length === 0) {
      tableBody.innerHTML = `<div class="empty-state">No se encontraron reservaciones en este historial.</div>`;
      return;
    }

    data.forEach(res => {
      const row = document.createElement("div");
      row.className = "fila";
      row.innerHTML = `
        <div><span class="codigo">${res.id}</span></div>
        <div>${res.zone}</div>
        <div>${res.vehicle}</div>
        <div>${res.date}</div>
        <div>${res.duration}</div>
        <div class="monto ${res.status}">${res.amount}</div>
        <div><span class="estado estado-${res.status}">${res.status.toUpperCase()}</span></div>
      `;
      tableBody.appendChild(row);
    });
  }

  // Inicializar manejadores de eventos para los filtros
  filterButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      filterButtons.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");

      const filterType = e.target.getAttribute("data-filter");
      const filteredData = filterType === "todas" 
        ? mockReservations 
        : mockReservations.filter(r => r.status === filterType);
      
      renderTable(filteredData);
    });
  });

  // Carga inicial
  calculateSummary(mockReservations);
  renderTable(mockReservations);
});