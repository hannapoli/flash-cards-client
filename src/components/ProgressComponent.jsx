import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import './ProgressComponent.scss';

/**
 * Componente para mostrar el progreso de aprendizaje
 * Muestra una barra circular de progreso o un trofeo si está completado al 100%
 * @module components/ProgressComponent
 * @param {Object} props - Props del componente
 * @param {number} props.percentage - Porcentaje de progreso (0-100)
 * @param {boolean} [props.wordPage=false] - Si es true, muestra una versión más grande
 * @param {string} [props.pathColor='var(--color-secondary)'] - Color de la barra de progreso
 * @param {string} [props.trailColor='var(--color-accent)'] - Color del fondo de la barra
 * @param {string} [props.textColor='var(--color-darker)'] - Color del texto del porcentaje
 * @param {string} [props.textSize='1.9rem'] - Tamaño del texto del porcentaje
 * @returns {JSX.Element} Componente de progreso
 * 
 * @example
 * <ProgressComponent 
 *   percentage={75} 
 *   pathColor="blue"
 *   trailColor="lightblue"
 * />
 * 
 * @example
 * // Para mostrar en página de palabras con tamaño grande
 * <ProgressComponent 
 *   percentage={100} 
 *   wordPage={true}
 * />
 */
export const ProgressComponent = ({
    percentage,
    wordPage = 'false',
    pathColor = 'var(--color-secondary)',
    trailColor = 'var(--color-accent)',
    textColor = 'var(--color-darker)',
    textSize = '1.9rem'
}) => {
    const isCompleted = percentage === 100;
  return (
    <>
    <div className={`flexContainer centeredContent ${wordPage ? 'progressContainerBig marginBottom' : 'progressContainer'}`}>
        {isCompleted ?(
        <div className={`${wordPage ? 'completedBig' : 'completed'}`}>
            🏆
        </div>
        ) : (
        <CircularProgressbar 
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
                pathColor,
                trailColor,
                textColor,
                textSize
            })}
        />
        )}
    </div>
    </>
  )
}
