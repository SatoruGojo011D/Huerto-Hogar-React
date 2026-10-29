// Página de demostración /bootstrap/ayuda: preguntas frecuentes con Accordion y Alert de react-bootstrap.
import { Accordion, Alert, Button, Col, Container, Row } from 'react-bootstrap'

export function Pag3Bootstrap() {
  return (
    <Container as="main" className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} lg={9}>
          <h1 className="serif mb-3">Ayuda para comprar</h1>
          <p className="lead">Respuestas rápidas sobre cómo comprar productos frescos en HuertoHogar.</p>
          <Accordion className="mb-4">
            <Accordion.Item eventKey="0">
              <Accordion.Header>¿Cómo encuentro un producto?</Accordion.Header>
              <Accordion.Body>Visita el catálogo y usa la búsqueda o los filtros por categoría y precio para encontrar lo que necesitas.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>¿Cómo reviso mi pedido?</Accordion.Header>
              <Accordion.Body>Después de confirmar la compra, utiliza el código del pedido en la página de seguimiento.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>¿Necesito una cuenta?</Accordion.Header>
              <Accordion.Body>Puedes crear una cuenta para administrar tus datos y revisar las opciones de la tienda.</Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Alert variant="info">
            ¿No encontraste tu respuesta? El equipo de atención puede ayudarte.
            <div className="mt-3">
              <Button variant="primary" href="/contacto">Ir a contacto</Button>
            </div>
          </Alert>
        </Col>
      </Row>
    </Container>
  )
}
