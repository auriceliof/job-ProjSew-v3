import './styles.css';

type Step = {
  icon: JSX.Element;
  title: string;
  component: JSX.Element;
  enable?: boolean;
};

type Props = {
  steps: Step[];
  currentStep: number;
};

export function Steps({ steps, currentStep = 0 }: Props) {
  
  const stepsFiltered = steps.filter(Boolean).filter(({ enable = true }) => enable);

  return (
    <>
      <div className="proj-steps-container">
        {stepsFiltered.map((item, index) => (
          <div 
            key={index} 
            className={`proj-steps-contents ${index === currentStep ? 'active' : ''}`}
          >
            {item.icon}
            <p>{item.title}</p>
          </div>
        ))}
      </div>

      {stepsFiltered[currentStep] ? stepsFiltered[currentStep].component : null}
    </>
  );
}

