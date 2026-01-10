import './WordCard.scss'

export const WordCard = ({ word, definition, transcription, example, image_url, category_id}) => {
  if (!word) {
    return <p>Cargando datos de la palabra...</p>;
  }

  return (
    <>
      <article className='wordCard'>
        <div className='wordCardContent flexColumn'>
          <h1 className='wordCardWord'>{word}</h1>
            <p className='wordCardTranscription'>{transcription}</p>
          <div className='wordCardImage'>
            {image_url && (
              <img
                src={image_url}
                alt={definition}
              />
            )}
          </div>
          <h2 className='wordCardDefinition'>{definition}</h2>
          <p className='wordCardExample'>{example}</p>
        </div>
      </article>
    </>
  )
}
