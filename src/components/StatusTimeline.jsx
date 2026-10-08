const steps = ['Confirmado', 'En preparación', 'En camino', 'Entregado']

export default function StatusTimeline({ status = 0 }) {
  return (
    <div className={`timeline${status ? ' timeline-active' : ''}`} aria-label="Estado del pedido">
      {steps.map((step, index) => <div className={`paso${index < status ? ' activo' : ''}`} key={step} aria-current={index === status - 1 ? 'step' : undefined}>
        <div className="circulo">{index + 1}</div><p>{step}</p>
      </div>)}
    </div>
  )
}