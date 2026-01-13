import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import './ProgressComponent.scss';
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
