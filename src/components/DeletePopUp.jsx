export const DeletePopUp = ({
    type,
    item,
    onConfirm,
    onCancel,
    loading,
    error
}) => {
  return (
    <article className="popupCard">
          <div className="popupContent">
            <h3>¿Estás seguro que quieres eliminar {type}?</h3>
            <p>{item}</p>
            {error && <p className="errorMessage">{error}</p>}
            <div>
              <button onClick={onConfirm} disabled={loading} className="confirmBtn">
                {loading ? 'Eliminando...' : 'Sí'}
              </button>
              <button onClick={onCancel} className="cancelBtn">No</button>
            </div>
          </div>
        </article>
  )
}
