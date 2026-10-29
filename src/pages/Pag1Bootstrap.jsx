// Página de demostración /bootstrap/alertas con componentes de react-bootstrap (Alert, Button, Card) y columnas que se adaptan al ancho.
import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap'

export function Pag1Bootstrap() {
  return (
    <Container as="main" className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} lg={10}>
          <Alert variant="success">
            <Alert.Heading>Bootstrap integrado en HuertoHogar</Alert.Heading>
            <p className="mb-0">Esta página demuestra alertas, botones y columnas que se adaptan al tamaño de pantalla.</p>
          </Alert>
          <div className="mb-4">
            <Button variant="success" href="/catalogo" className="me-2 mb-2">Explorar catálogo</Button>
            <Button variant="outline-success" href="/bootstrap/productos" className="mb-2">Ver productos destacados</Button>
          </div>
          <Row xs={1} md={2} className="g-4">
            <Col>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Diseño adaptable</Card.Title>
                  <Card.Text>En pantallas pequeñas, estas tarjetas se muestran en una columna; en pantallas medianas aparecen lado a lado.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Componentes de React Bootstrap</Card.Title>
                  <Card.Text>Alert, Button, Card, Container, Row y Col son componentes React que aplican los estilos de Bootstrap.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}
