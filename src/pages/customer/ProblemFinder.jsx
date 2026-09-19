import React, { useState, useRef } from 'react';
import { Sparkles, Mic, Camera, ArrowRight, CheckCircle2, Edit2, ChevronLeft, Square, Briefcase } from 'lucide-react';
import { generateAIDiagnosis } from '../../data/mockData';

// ── Step 1: Free-Form Problem Input Screen ───────────────────────────────────
function InitialInputStep({ initialText = '', onSubmitInput, onCancel }) {
  const [text, setText] = useState(initialText || '');
  const [isRecording, setIsRecording] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileRef = useRef(null);

  const handleVoiceToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate live voice transcription
      setTimeout(() => {
        setText("I want to repair my clothes. There is a large tear around the pocket and I also want the waist made slightly smaller.");
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
          <span>KAIRO DYNAMIC PROBLEM CONCIERGE</span>
        </div>
        <h1 className="hero-heading" style={{ color: 'var(--deep-evergreen)', fontSize: '36px', marginBottom: 8 }}>
          What’s going wrong?
        </h1>
        <p className="supporting-text" style={{ fontSize: '17px' }}>
          Describe your problem in your own words. KAIRO will figure out what kind of artisan you need.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card card-lg" style={{ boxShadow: 'var(--shadow-lg)' }}>
        
        {/* Free-form Input Textarea */}
        <div style={{ marginBottom: 20 }}>
          <label className="label" style={{ fontSize: '15px' }}>Describe what you need help with</label>
          <textarea
            className="input"
            rows={5}
            placeholder="Tell KAIRO what's wrong in your own words. (e.g. 'I want to repair my clothes. There is a large tear around the pocket and I also want the waist made slightly smaller.')"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ fontSize: '16.5px', borderRadius: 14, lineHeight: '1.5' }}
          />
        </div>

        {/* Voice Input Animation */}
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

        {/* Photo Preview */}
        {photoPreview && (
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14, background: 'var(--warm-cream)', padding: 12, borderRadius: 12, border: '1px solid var(--border-color)' }}>
            <img src={photoPreview} alt="Preview" style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--main-text)' }}>Photo attached</div>
              <div style={{ fontSize: '12px', color: 'var(--secondary-text)' }}>Will be shared with matched artisans</div>
            </div>
            <button type="button" onClick={() => setPhotoPreview(null)} style={{ background: 'none', border: 'none', color: 'var(--error)', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
              Remove
            </button>
          </div>
        )}

        {/* Toolbar & Submit Button */}
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

// ── Step 2: AI Interpretation & Instant Handoff Screen ───────────────────────
function UnderstandingStep({ problem, onConfirmMatching, onEditProblem }) {
  const diagnosis = generateAIDiagnosis(problem.text);

  return (
    <div className="animate-scale-in" style={{ maxWidth: 660, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div className="badge badge-green" style={{ marginBottom: 12 }}>
          <CheckCircle2 size={15} color="var(--kairo-green)" />
          <span>KAIRO AI INTERPRETATION</span>
        </div>
        <h1 className="hero-heading" style={{ color: 'var(--deep-evergreen)', fontSize: '32px' }}>
          KAIRO analyzed your request
        </h1>
        <p className="supporting-text" style={{ fontSize: '16px' }}>
          We identified what kind of artisan you need directly from your text.
        </p>
      </div>

      <div className="card card-lg" style={{ marginBottom: 24, boxShadow: 'var(--shadow-lg)' }}>
        
        {/* Customer's Exact Original Description */}
        <div style={{ background: 'var(--warm-cream)', padding: 18, borderRadius: 14, border: '1px solid var(--border-color)', marginBottom: 24 }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase', marginBottom: 6 }}>
            Your Original Request:
          </div>
          <div style={{ fontSize: '17px', color: 'var(--main-text)', fontWeight: 600, fontStyle: 'italic', lineHeight: '1.5' }}>
            "{problem.text}"
          </div>
        </div>

        {/* Detected Service & Required Artisan Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
          
          <div style={{ background: 'var(--mint-mist)', border: '1px solid var(--soft-sage)', padding: 16, borderRadius: 14 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>
              Detected Service
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--deep-evergreen)', marginTop: 4 }}>
              {diagnosis.categoryLabel}
            </div>
          </div>

          <div style={{ background: 'var(--gold-bg)', border: '1px solid var(--gold-border)', padding: 16, borderRadius: 14 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>
              Required Artisan
            </div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--deep-evergreen)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Briefcase size={16} color="var(--kairo-green)" />
              {diagnosis.requiredArtisan}
            </div>
          </div>

        </div>

        {/* AI Analysis Explanation */}
        <div style={{ marginBottom: 28, background: 'var(--white)', padding: 16, borderRadius: 14, border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase', marginBottom: 4 }}>
            AI Problem Analysis:
          </div>
          <p className="body-text" style={{ fontSize: '15.5px', color: 'var(--main-text)', margin: 0, lineHeight: '1.5' }}>
            {diagnosis.understanding} {diagnosis.likelyFault}
          </p>
        </div>

        {/* Direct Action Buttons */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 20 }}>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button
              onClick={() => onConfirmMatching(diagnosis)}
              className="btn btn-primary btn-lg"
              style={{ flex: 1, minWidth: 220, fontSize: '17px' }}
            >
              Find Artisans Who Can Solve This
              <ArrowRight size={18} />
            </button>

            <button
              onClick={onEditProblem}
              className="btn btn-ghost btn-lg"
            >
              <Edit2 size={16} /> Edit Problem
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Main Controller Component ────────────────────────────────────────────────
export default function ProblemFinder({ initialProblem, onComplete, onCancel }) {
  const [stage, setStage] = useState(initialProblem ? 'understanding' : 'input');
  const [problemData, setProblemData] = useState(initialProblem || { text: '' });

  const handleInputSubmit = (pData) => {
    setProblemData(pData);
    setStage('understanding');
  };

  const handleConfirmMatching = (diagnosis) => {
    onComplete({
      problem: problemData,
      diagnosis: diagnosis || generateAIDiagnosis(problemData.text),
      clarification: { location: 'Yaba, Lagos' }
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
            onConfirmMatching={handleConfirmMatching}
            onEditProblem={() => setStage('input')}
          />
        )}
      </div>
    </div>
  );
}
