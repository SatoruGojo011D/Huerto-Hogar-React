import { products } from '../js/products.js'

const articles = [
  { title: 'Cómo mantener tus verduras frescas por más tiempo', category: 'Guía práctica', text: 'Separa frutas que emiten etileno, como manzanas y plátanos, de las hojas verdes. Lava las hojas con agua fría, sécalas muy bien y guárdalas en un recipiente con papel absorbente.' },
  { title: 'Compostaje urbano paso a paso', category: 'Sustentabilidad', text: 'Transforma los restos orgánicos de tu cocina en abono para tus plantas. Alterna materiales húmedos y secos, airea la mezcla y mantén una humedad similar a una esponja escurrida.' },
  { title: '¿Por qué consumir productos de estación?', category: 'Temporada', text: 'Elegir alimentos de estación ayuda a aprovechar su sabor y frescura, apoya a productores locales y reduce la necesidad de almacenamiento y transporte prolongado.' },
]

export function BlogPage() {
  const articleImages = [products[3].image, products[5].image, products[0].image]
  return (
    <main className="container blog-page py-5">
      <div className="blog-heading">
        <span className="section-kicker">Blog & guías sustentables</span>
        <h2 className="serif">El arte de cultivar en casa</h2>
        <p>Técnicas orgánicas, conservación de alimentos y consejos de nuestros agricultores.</p>
      </div>
      <div className="row g-4 mt-2">
        {articles.map((article, index) => (
          <div className="col-12 col-md-6 col-lg-4 d-flex" key={article.title}>
            <article className="card-blog w-100">
              <div className={`img-blog blog-image-${index}`}><img src={articleImages[index]} alt={article.category} /></div>
              <div className="contenido-blog"><span className="fecha-blog">{article.category}</span><h3 className="serif">{article.title}</h3><p>{article.text}</p></div>
            </article>
          </div>
        ))}
      </div>
    </main>
  )
}
