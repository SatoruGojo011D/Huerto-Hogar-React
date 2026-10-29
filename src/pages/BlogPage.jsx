// Página /blog: listado de artículos y lectura del artículo seleccionado.
import { products } from '../js/products.js'

const articles = [
  {
    slug: 'conservar-verduras',
    title: 'Cómo conservar verduras frescas por más tiempo',
    category: 'Guía práctica',
    summary: 'Orden, frío y humedad controlada ayudan a cuidar las hojas y reducir el desperdicio en casa.',
    image: products[4].image,
    sections: [
      {
        heading: 'Al llegar a casa',
        paragraphs: [
          'Revisa las hojas y retira las que estén dañadas. Guarda las verduras refrigeradas en cuanto puedas y evita que queden húmedas dentro de un recipiente cerrado: el exceso de agua acelera su deterioro.',
          'Lava las frutas y verduras bajo agua potable corriente justo antes de prepararlas. No uses jabón ni detergente para limpiarlas.',
        ],
      },
      {
        heading: 'Organiza el refrigerador',
        paragraphs: [
          'Mantén el refrigerador a 4 °C o menos y deja circular el aire entre los alimentos. Guarda las hojas limpias y bien secas en un recipiente o bolsa reutilizable con una toalla de papel para absorber la humedad.',
          'Las necesidades cambian según el producto. Consulta una guía de conservación para estimar cuánto dura cada alimento y prioriza consumir primero lo que compraste antes.',
        ],
      },
    ],
    sources: [
      { name: 'FoodSafety.gov — FoodKeeper', url: 'https://www.foodsafety.gov/keep-food-safe/foodkeeper-app' },
      { name: 'FoodSafety.gov — Frío y seguridad alimentaria', url: 'https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts' },
    ],
  },
  {
    slug: 'compostaje-en-casa',
    title: 'Compostaje en casa: una guía sencilla para empezar',
    category: 'Sustentabilidad',
    summary: 'Convierte restos vegetales en compost con una mezcla equilibrada, aire y humedad moderada.',
    image: products[5].image,
    sections: [
      {
        heading: 'Combina materiales verdes y secos',
        paragraphs: [
          'En un compost doméstico puedes aprovechar restos de frutas y verduras, café y hojas secas. Alterna estos materiales húmedos, ricos en nitrógeno, con materiales secos como hojas, cartón sin plastificar o ramitas, que aportan carbono y estructura.',
          'Para evitar olores y plagas en un compostaje sencillo, no incorpores carne, lácteos ni aceites. Si tienes un sistema especializado, sigue las instrucciones de ese método.',
        ],
      },
      {
        heading: 'Cuida la humedad y la ventilación',
        paragraphs: [
          'La mezcla debe sentirse húmeda, pero no empapada. Si está muy mojada, agrega material seco; si está demasiado seca, humedécela un poco. Voltear o mezclar el contenido ayuda a que entre aire y el proceso avance.',
          'El compost está listo cuando tiene aspecto oscuro y textura suelta, sin que se reconozcan fácilmente los restos originales. El tiempo depende de la mezcla, el clima y el manejo.',
        ],
      },
    ],
    sources: [
      { name: 'U.S. Environmental Protection Agency — Composting at home', url: 'https://www.epa.gov/recycle/composting-home' },
    ],
  },
  {
    slug: 'compras-de-temporada',
    title: 'Compra de temporada: planifica y aprovecha mejor tus alimentos',
    category: 'Temporada',
    summary: 'Conoce la cosecha local disponible, planifica porciones y aprovecha cada compra para desperdiciar menos.',
    image: products[0].image,
    sections: [
      {
        heading: 'Pregunta qué está cosechado ahora',
        paragraphs: [
          'La temporada depende de la zona, el clima y las condiciones de cultivo; no hay un calendario único que sirva para todo Chile. Pregunta a tus productores qué cosecharon recientemente y qué alimentos conviene consumir pronto.',
          'Elegir productos locales disponibles puede acercarte a la historia de su cultivo y apoyar a quienes producen en tu región. La disponibilidad y el origen deben confirmarse con el vendedor.',
        ],
      },
      {
        heading: 'Planifica para aprovecharlo todo',
        paragraphs: [
          'Antes de comprar, revisa lo que ya tienes y arma algunas comidas con esos ingredientes. Compra cantidades que puedas consumir, rota los productos más antiguos al frente y congela porciones aptas si no las usarás a tiempo.',
          'Reducir pérdidas y desperdicio requiere acciones a lo largo de toda la cadena alimentaria, desde la producción hasta el hogar. En casa, planificar, almacenar correctamente y aprovechar sobras son pasos concretos.',
        ],
      },
    ],
    sources: [
      { name: 'FAO — Plataforma técnica sobre pérdidas y desperdicio de alimentos', url: 'https://www.fao.org/platform-food-loss-waste/en/' },
    ],
  },
]

function ArticleDetail({ article }) {
  return (
    <main className="container blog-page blog-detail py-5">
      <a className="blog-back-link" href="/blog">← Volver al blog</a>
      <article>
        <div className="blog-heading">
          <span className="section-kicker">{article.category}</span>
          <h2 className="serif">{article.title}</h2>
          <p>{article.summary}</p>
        </div>
        <img className="blog-detail-image" src={article.image} alt="" />
        <div className="blog-detail-content">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h3 className="serif">{section.heading}</h3>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
          <aside className="blog-sources">
            <h3>Fuentes para profundizar</h3>
            <ul>{article.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.name}</a></li>)}</ul>
          </aside>
        </div>
      </article>
    </main>
  )
}

export function BlogPage() {
  const slug = new URLSearchParams(window.location.search).get('articulo')
  const selectedArticle = articles.find((article) => article.slug === slug)
  if (selectedArticle) return <ArticleDetail article={selectedArticle} />

  return (
    <main className="container blog-page py-5">
      <div className="blog-heading">
        <span className="section-kicker">Blog & guías sustentables</span>
        <h2 className="serif">Consejos para el hogar y el huerto</h2>
        <p>Guías prácticas de conservación, compostaje y aprovechamiento de alimentos, con fuentes para seguir aprendiendo.</p>
      </div>
      <div className="row g-4 mt-2">
        {articles.map((article) => (
          <div className="col-12 col-md-6 col-lg-4 d-flex" key={article.slug}>
            <article className="card-blog w-100">
              <div className="img-blog"><img src={article.image} alt="" /></div>
              <div className="contenido-blog">
                <span className="fecha-blog">{article.category}</span>
                <h3 className="serif">{article.title}</h3>
                <p>{article.summary}</p>
                <a className="blog-read-link" href={`/blog?articulo=${article.slug}`}>Leer artículo completo <span aria-hidden="true">→</span></a>
              </div>
            </article>
          </div>
        ))}
      </div>
    </main>
  )
}
