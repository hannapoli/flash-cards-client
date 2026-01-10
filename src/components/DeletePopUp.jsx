import './DeletePopUp.scss';

export const DeletePopUp = ({
  type,
  item,
  onConfirm,
  onCancel,
  loading,
  error
}) => {
  return (
    <div className='popupOverlay flexContainer'>
      <article className='popupCard'>
        <div className='popupContent flexColumn'>
          <h3>¿Estás seguro que quieres eliminar {type}?</h3>
          <p className='popupItem'>{item}</p>
          {error && <p className='errorMessage'>{error}</p>}
          <div className='popupActions flexContainer'>
            <button onClick={onConfirm} disabled={loading} className='confirmBtn'>
              {loading ? 'Eliminando...' : 'Sí'}
            </button>
            <button onClick={onCancel} className='cancelBtn'>No</button>
          </div>
        </div>
      </article>
    </div>
  )
}
