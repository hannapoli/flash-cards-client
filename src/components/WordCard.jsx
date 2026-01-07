export const WordCard = ({ word, definition, transcription, example, image_url, category_id}) => {
  if (!word) {
    return <p>Cargando datos de la palabra...</p>;
  }

  return (
    <>
      <article className="word-card">
        <div className="word-card-content">
          <h1 className="word-card-word">{word}</h1>
            <p className="word-card-transcription">{transcription}</p>
          <div className="word-card-image">
            {image_url && (
              <img
                src={image_url}
                alt={definition}
                //scss
                width={300}
              />
            )}
          </div>
          <h2 className="word-card-definition">{definition}</h2>
          <p className="word-card-example">{example}</p>
        </div>
      </article>
    </>
  )
}
