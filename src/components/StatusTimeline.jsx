const steps = ['Confirmado', 'En preparación', 'En camino', 'Entregado']

export default function StatusTimeline({ status = 0 }) {
  const activeStatus = Math.max(0, Math.min(steps.length, Math.floor(Number(status) || 0)))
  return (
    <div className={`timeline${activeStatus ? ' timeline-active' : ''}`} aria-label="Estado del pedido">
      {steps.map((step, index) => <div className={`paso${index < activeStatus ? ' activo' : ''}`} key={step} aria-current={index === activeStatus - 1 ? 'step' : undefined}>
        <div className="circulo">{index + 1}</div><p>{step}</p>
      </div>)}
    </div>
  )
}