import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Mic, Camera, ArrowRight, CheckCircle2, MapPin, Clock, Edit2, ChevronLeft, Volume2, Square } from 'lucide-react';
import { generateAIDiagnosis } from '../../data/mockData';

// ── Step 1: Focused Problem Input Modal/Screen ───────────────────────────────
function InitialInputStep({ initialText = '', onSubmitInput, onCancel }) {
  const [text, setText] = useState(initialText || '');
  const [isRecording, setIsRecording] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileRef = useRef(null);

  const handleVoiceToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate live transcription
      setTimeout(() => {
        setText("My generator starts but goes off after a few minutes.");
        setIsRecording(false);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() && !photoPreview) return;
    onSubmitInput({ text: text.trim() || 'Photo uploaded', photo: photoPreview });
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: 680, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <button
          onClick={onCancel}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, fontSize: '14px', marginBottom: 12 }}
        >
          <ChevronLeft size={16} /> Back to home
        </button>
        <div className="ai-chip" style={{ marginBottom: 12 }}>
          <Sparkles size={14} color="var(--deep-evergreen)" />
          <span>KAIRO PROBLEM SOLVING INTERFACE</span>
        </div>
        <h1 className="hero-heading" style={{ color: 'var(--deep-evergreen)', fontSize: '36px', marginBottom: 8 }}>
          What’s going wrong?
        </h1>
        <p className="supporting-text" style={{ fontSize: '17px' }}>
          Describe the problem in your own words. You can type, speak, or add a photo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card card-lg" style={{ boxShadow: 'var(--shadow-lg)' }}>
        
        {/* Input options: Type, Voice, Photo */}
        <div style={{ marginBottom: 20 }}>
          <label className="label" style={{ fontSize: '15px' }}>Describe the issue</label>
          <textarea
            className="input"
            rows={4}
            placeholder="e.g. My generator starts but goes off after a few minutes."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ fontSize: '17px', borderRadius: 14 }}
          />
        </div>

        {/* Polished Voice Input State */}
        {isRecording && (
          <div className="ai-surface animate-fade-in" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--error-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mic size={20} color="var(--error)" />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--error)' }}>
                  Listening...
                </div>
                <div style={{ fontSize: '13px', color: 'var(--secondary-text)' }}>
                  Speak clearly into your microphone
                </div>
              </div>
            </div>

            {/* Soundwave animation */}
            <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 24 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`wave-bar wave-bar-${i}`} style={{ width: 4, height: 24, background: 'var(--error)' }} />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsRecording(false)}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--error)', borderColor: '#FCA5A5' }}
            >
              <Square size={14} /> Stop / Cancel
            </button>
          </div>
        )}

        {/* Photo Preview if attached */}
        {photoPreview && (
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14, background: 'var(--warm-cream)', padding: 12, borderRadius: 12, border: '1px solid var(--border-color)' }}>
            <img src={photoPreview} alt="Preview" style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--main-text)' }}>Photo attached</div>
              <div style={{ fontSize: '12px', color: 'var(--secondary-text)' }}>Will be shared with matched artisan</div>
            </div>
            <button type="button" onClick={() => setPhotoPreview(null)} style={{ background: 'none', border: 'none', color: 'var(--error)', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
              Remove
            </button>
          </div>
        )}

        {/* Toolbar & Submit */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderTop: '1px solid var(--border-color)', paddingTop: 20 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={handleVoiceToggle}
              className="btn btn-ghost btn-sm"
              style={{ background: isRecording ? 'var(--error-bg)' : 'var(--warm-cream)' }}
            >
              <Mic size={16} color={isRecording ? 'var(--error)' : 'var(--kairo-green)'} />
              <span>{isRecording ? 'Listening...' : 'Voice Input'}</span>
            </button>

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="btn btn-ghost btn-sm"
              style={{ background: 'var(--warm-cream)' }}
            >
              <Camera size={16} color="var(--kairo-green)" />
              <span>Add Photo</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
          </div>

          <button
            type="submit"
            disabled={!text.trim() && !photoPreview}
            className="btn btn-primary btn-lg"
          >
            Tell KAIRO
            <ArrowRight size={18} />
          </button>
        </div>

      </form>
    </div>
  );
}

// ── Step 2: AI Understanding Screen ──────────────────────────────────────────
function UnderstandingStep({ problem, onConfirmUnderstanding, onEditProblem }) {
  const diagnosis = generateAIDiagnosis(problem.text);

  return (
    <div className="animate-scale-in" style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div className="badge badge-green" style={{ marginBottom: 12 }}>
          <CheckCircle2 size={15} color="var(--kairo-green)" />
          <span>KAIRO AI UNDERSTANDING</span>
        </div>
        <h1 className="hero-heading" style={{ color: 'var(--deep-evergreen)', fontSize: '32px' }}>
          KAIRO understood your problem
        </h1>
      </div>

      <div className="card card-lg" style={{ marginBottom: 24 }}>
        
        {/* Your Problem Description */}
        <div style={{ background: 'var(--warm-cream)', padding: 18, borderRadius: 14, border: '1px solid var(--border-color)', marginBottom: 24 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase', marginBottom: 6 }}>
            Your description:
          </div>
          <div style={{ fontSize: '17px', color: 'var(--main-text)', fontWeight: 600, fontStyle: 'italic' }}>
            "{problem.text}"
          </div>
        </div>

        {/* Likely Service */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase', marginBottom: 6 }}>
            Likely Service:
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'var(--mint-mist)', border: '1px solid var(--soft-sage)', padding: '8px 18px', borderRadius: 100 }}>
            <Sparkles size={16} color="var(--kairo-green)" />
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--deep-evergreen)' }}>
              {diagnosis.categoryLabel}
            </span>
          </div>
        </div>

        {/* Supporting Explanation */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase', marginBottom: 6 }}>
            Supporting explanation:
          </div>
          <p className="body-text" style={{ fontSize: '16px', color: 'var(--main-text)' }}>
            "{diagnosis.understanding} {diagnosis.likelyFault}"
          </p>
          <div className="small-metadata" style={{ marginTop: 8, fontStyle: 'italic' }}>
            Note: KAIRO identifies relevant service categories — matched artisans confirm exact technical details.
          </div>
        </div>

        {/* Confirmation Question */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 20 }}>
          <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--deep-evergreen)', marginBottom: 16 }}>
            Is this what you need help with?
          </div>
          
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button
              onClick={() => onConfirmUnderstanding(diagnosis)}
              className="btn btn-primary btn-lg"
              style={{ flex: 1, minWidth: 200 }}
            >
              Yes, continue
              <ArrowRight size={18} />
            </button>

            <button
              onClick={onEditProblem}
              className="btn btn-ghost btn-lg"
            >
              <Edit2 size={16} /> Edit problem
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Step 3: Clarification Questions (One Step at a Time with Progress) ───────
function ClarificationStep({ diagnosis, onCompleteClarification }) {
  const questions = [
    { id: 'brand', label: 'What brand is your generator / device / item?', options: ['Honda', 'Sumec Firman', 'Tiger', 'Elemax', 'iPhone', 'Samsung', 'Ankara Dress', 'Other'] },
    { id: 'symptom', label: 'What happens when it goes off or fails?', options: ['Shuts off after 5 mins', 'Won\'t turn on at all', 'Unusual noise', 'Overheating', 'Fitting issue'] },
    { id: 'when_started', label: 'When did the problem start?', options: ['Today', 'Yesterday', 'This week', 'Over a month ago'] },
    { id: 'location', label: 'Where do you need the service?', options: ['Yaba, Lagos', 'Surulere, Lagos', 'Ikeja, Lagos', 'Victoria Island, Lagos', 'Lekki, Lagos'] },
  ];

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({ brand: 'Honda', symptom: 'Shuts off after 5 mins', when_started: 'Today', location: 'Yaba, Lagos' });

  const currentQ = questions[currentQIndex];

  const handleSelectOption = (opt) => {
    const updated = { ...answers, [currentQ.id]: opt };
    setAnswers(updated);
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      onCompleteClarification(updated);
    }
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: 600, margin: '0 auto' }}>
      
      {/* Step Progress Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--deep-evergreen)' }}>
          Step {currentQIndex + 2} of 4
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2, 3].map(idx => (
            <div
              key={idx}
              style={{
                width: idx === currentQIndex ? 24 : 8,
                height: 8,
                borderRadius: 100,
                background: idx <= currentQIndex ? 'var(--kairo-green)' : 'var(--border-color)',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
      </div>

      <div className="card card-lg" style={{ boxShadow: 'var(--shadow-md)' }}>
        <div className="ai-chip" style={{ marginBottom: 16 }}>
          <Sparkles size={14} color="var(--deep-evergreen)" />
          <span>CLARIFICATION QUESTIONS</span>
        </div>

        <h2 className="section-heading" style={{ color: 'var(--deep-evergreen)', marginBottom: 24 }}>
          {currentQ.label}
        </h2>

        {/* Options Chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {currentQ.options.map(opt => {
            const isSelected = answers[currentQ.id] === opt;
            return (
              <button
                key={opt}
                onClick={() => handleSelectOption(opt)}
                className={`card-interactive ${isSelected ? 'card-selected' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '16px 20px',
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: '16px',
                  color: isSelected ? 'var(--deep-evergreen)' : 'var(--main-text)'
                }}
              >
                <span>{opt}</span>
                {isSelected && <CheckCircle2 size={18} color="var(--kairo-green)" />}
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: 18 }}>
          {currentQIndex > 0 ? (
            <button
              onClick={() => setCurrentQIndex(currentQIndex - 1)}
              className="btn btn-ghost btn-sm"
            >
              Previous Question
            </button>
          ) : <div />}

          <button
            onClick={() => {
              if (currentQIndex < questions.length - 1) {
                setCurrentQIndex(currentQIndex + 1);
              } else {
                onCompleteClarification(answers);
              }
            }}
            className="btn btn-primary btn-sm"
          >
            Next <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Step 4: Request Review ───────────────────────────────────────────────────
function RequestReviewStep({ problem, diagnosis, clarification, onFinalSearch, onEditField }) {
  return (
    <div className="animate-scale-in" style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div className="badge badge-green" style={{ marginBottom: 10 }}>
          <CheckCircle2 size={14} color="var(--kairo-green)" />
          <span>CONFIDENT HANDOFF</span>
        </div>
        <h1 className="hero-heading" style={{ color: 'var(--deep-evergreen)', fontSize: '32px' }}>
          Here's what we have
        </h1>
        <p className="supporting-text" style={{ fontSize: '16px' }}>
          KAIRO will use this structured request to match relevant local artisans.
        </p>
      </div>

      <div className="card card-lg" style={{ marginBottom: 24, boxShadow: 'var(--shadow-lg)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          <ReviewItem
            label="Service"
            value={diagnosis.categoryLabel}
            onEdit={onEditField}
          />

          <ReviewItem
            label="Problem"
            value={problem.text}
            onEdit={onEditField}
          />

          <ReviewItem
            label="Brand"
            value={clarification.brand || 'Honda'}
            onEdit={onEditField}
          />

          <ReviewItem
            label="Location"
            value={clarification.location || 'Yaba, Lagos'}
            onEdit={onEditField}
          />

          <ReviewItem
            label="Preferred timing"
            value="Today"
            onEdit={onEditField}
          />

        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', marginTop: 28, paddingTop: 24 }}>
          <button
            onClick={onFinalSearch}
            className="btn btn-primary btn-lg btn-block"
            style={{ fontSize: '18px', padding: '16px' }}
          >
            Find someone who can help
            <ArrowRight size={20} />
          </button>
        </div>

      </div>
    </div>
  );
}

function ReviewItem({ label, value, onEdit }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      padding: '14px 18px',
      background: 'var(--warm-cream)',
      border: '1px solid var(--border-color)',
      borderRadius: 12
    }}>
      <div>
        <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase', marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--main-text)' }}>
          {value}
        </div>
      </div>
      <button
        onClick={onEdit}
        style={{ background: 'none', border: 'none', color: 'var(--kairo-green)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, fontSize: '13.5px' }}
      >
        <Edit2 size={14} /> Edit
      </button>
    </div>
  );
}

// ── Main Problem Finder Controller ───────────────────────────────────────────
export default function ProblemFinder({ initialProblem, onComplete, onCancel }) {
  // flow: 'input' -> 'understanding' -> 'clarification' -> 'review'
  const [stage, setStage] = useState(initialProblem ? 'understanding' : 'input');
  const [problemData, setProblemData] = useState(initialProblem || { text: '' });
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [clarificationData, setClarificationData] = useState(null);

  const handleInputSubmit = (pData) => {
    setProblemData(pData);
    setStage('understanding');
  };

  const handleConfirmUnderstanding = (diag) => {
    setDiagnosisData(diag);
    setStage('clarification');
  };

  const handleCompleteClarification = (clarAnswers) => {
    setClarificationData(clarAnswers);
    setStage('review');
  };

  const handleFinalSearch = () => {
    onComplete({
      problem: problemData,
      diagnosis: diagnosisData || generateAIDiagnosis(problemData.text),
      clarification: clarificationData || { brand: 'Honda', location: 'Yaba, Lagos' }
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', padding: '40px 24px' }}>
      <div className="page-wrapper">
        {stage === 'input' && (
          <InitialInputStep
            initialText={problemData.text}
            onSubmitInput={handleInputSubmit}
            onCancel={onCancel}
          />
        )}

        {stage === 'understanding' && (
          <UnderstandingStep
            problem={problemData}
            onConfirmUnderstanding={handleConfirmUnderstanding}
            onEditProblem={() => setStage('input')}
          />
        )}

        {stage === 'clarification' && diagnosisData && (
          <ClarificationStep
            diagnosis={diagnosisData}
            onCompleteClarification={handleCompleteClarification}
          />
        )}

        {stage === 'review' && (
          <RequestReviewStep
            problem={problemData}
            diagnosis={diagnosisData || generateAIDiagnosis(problemData.text)}
            clarification={clarificationData || {}}
            onFinalSearch={handleFinalSearch}
            onEditField={() => setStage('clarification')}
          />
        )}
      </div>
    </div>
  );
}
