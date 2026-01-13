import './WordCard.scss'

export const WordCard = ({ word, definition, transcription, example, image_url, category_id, status, isRevealed, onToggleReveal }) => {
  if (!word) {
    return <p>Cargando datos de la palabra...</p>;
  }

  // Si no hay función onToggleReveal, siempre mostrar todo el contenido
  const shouldShowFull = !onToggleReveal || isRevealed;

  return (
    <>
      <article className='wordCard' onClick={onToggleReveal} style={{ cursor: onToggleReveal ? 'pointer' : 'default' }}>
        {!shouldShowFull ? (
          <div className='wordCardHidden flexColumn'>
            <div className='wordCardImage'>
              {image_url
                ? (
                  <img src={image_url} alt={word} />
                ) : (
                  <div className='wordCardImage'>
                    <h2>{word}</h2>
                  </div>
                )}
            </div>
            <p>Haz clic para ver la palabra</p>
          </div>
        ) : (
          <div className='wordCardContent flexColumn'>
            <h1 className='wordCardWord'>{word}</h1>
            <p className='wordCardTranscription'>{transcription}</p>
            <div className='wordCardImage'>
              {image_url && (
                <img src={image_url} alt={definition} />
              )}
            </div>
            <h2 className='wordCardDefinition'>{definition}</h2>
            <p className='wordCardExample'>{example}</p>
          </div>
        )}
      </article>
    </>
  )
}
