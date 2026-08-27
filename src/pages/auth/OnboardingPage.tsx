import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAccount } from '../../features/account/AccountContext';
import { useToast } from '../../features/toast/ToastContext';

const options = [
  { title: 'Quiet structure', desc: 'Precise, clean lines with tailored architectural silhouettes.' },
  { title: 'Fluid ease', desc: 'Softly considered, bias-cut silk and drape-heavy knitwear.' },
  { title: 'Avant-garde edge', desc: 'Expressive geometry, asymmetric cuts, and unexpected proportions.' },
];

export function OnboardingPage() {
  const [selected, setSelected] = useState(options[0].title);
  const { updateProfile } = useAccount();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleContinue = () => {
    updateProfile({ aesthetic: selected });
    showToast(`Aesthetic preferences saved: "${selected}"`, 'success');
    navigate('/atelier');
  };

  return (
    <main className="onboarding-page" aria-labelledby="onboarding-title">
      <div className="onboarding-header">
        <Link className="auth-wordmark" to="/">Falcon</Link>
        <div className="onboarding-progress">
          <span className="active" />
          <span />
          <span />
        </div>
        <p className="eyebrow">Step 1 / 3</p>
      </div>

      <section className="onboarding-content">
        <p className="eyebrow">Your visual language</p>
        <h1 id="onboarding-title">Define your aesthetic.</h1>
        <p>Select the style direction that resonates most. Falcon will use it to shape your digital atelier.</p>

        <div className="selection-grid" role="radiogroup" aria-label="Aesthetic preferences" style={{ marginBlock: '2rem' }}>
          {options.map((option, index) => (
            <button
              className={selected === option.title ? 'selection-card selection-card--selected' : 'selection-card'}
              key={option.title}
              type="button"
              role="radio"
              aria-checked={selected === option.title}
              onClick={() => setSelected(option.title)}
            >
              <span>0{index + 1}</span>
              <strong>{option.title}</strong>
              <small>{option.desc}</small>
            </button>
          ))}
        </div>

        <Button onClick={handleContinue} style={{ width: '100%', marginTop: '1rem' }}>
          Confirm & Enter Atelier &rarr;
        </Button>
      </section>
    </main>
  );
}