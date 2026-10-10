import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap'
import { products } from '../js/products.js'
import { formatPrice } from '../js/format.js'

export function Pag2Bootstrap() {
  const featuredProducts = products.slice(0, 3)

  return (
    <Container as="main" className="py-5">
      <div className="text-center mb-4">
        <Badge bg="success" className="mb-2">Ejemplo responsivo</Badge>
        <h1 className="serif">Productos destacados</h1>
        <p className="text-body-secondary">Cada tarjeta usa el mismo diseño y recibe los datos de un producto distinto.</p>
      </div>
      <Row xs={1} sm={2} lg={3} className="g-4">
        {featuredProducts.map((product) => (
          <Col key={product.id}>
            <Card className="h-100 shadow-sm">
              <Card.Img variant="top" src={product.image} alt={product.name} className="object-fit-cover" style={{ height: '220px' }} />
              <Card.Body className="d-flex flex-column">
                <Card.Subtitle className="mb-2 text-body-secondary">{product.categoryLabel}</Card.Subtitle>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <div className="mt-auto">
                  <p className="fw-bold mb-3">{formatPrice(product.price)} / {product.unit}</p>
                  <Button variant="success" href={`/producto?id=${encodeURIComponent(product.id)}`}>Ver producto</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
