import Containertype from "./Containertype"
import "./Typeandtype.css"

const Typeandtype = ({ props, children }) => {
  const { title, subtitle, type, img, link, textcolor } = props

  return (
    <div className="typeandtype">
      <h2>Categorías</h2>
      <div className="types">
        <Containertype
          limit={12}
          slider={children}
          textcolor={textcolor}
          // products={allproducts.filter((x) => x.type === type1)}
          link={`shop/${link}`}
          img={img}
          title={type}
          subtitle="Productos"
        />
      </div>
      {children}
    </div>
  )
}
export default Typeandtype
