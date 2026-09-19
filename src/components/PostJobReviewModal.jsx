import React, { useState } from 'react';
import { Star, X, CheckCircle2, Award, ThumbsUp } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PostJobReviewModal({ artisan, isOpen, onClose, onSubmitReview }) {
  if (!isOpen || !artisan) return null;

  const [overallRating, setOverallRating] = useState(5);
  const [qualityRating, setQualityRating] = useState(5);
  const [profRating, setProfRating] = useState(5);
  const [commRating, setCommRating] = useState(5);
  const [valueRating, setValueRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Fire celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#f59e0b', '#059669']
    });

    setTimeout(() => {
      onSubmitReview({
        artisanId: artisan.id,
        overallRating,
        subRatings: {
          quality: qualityRating,
          professionalism: profRating,
          communication: commRating,
          value: valueRating
        },
        text: commentText || 'Fixed my issue perfectly and explained everything clearly.'
      });
      onClose();
    }, 1500);
  };

  const RenderStarSelector = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs font-semibold text-emerald-200">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={`w-4 h-4 ${
                star <= value ? 'fill-amber-300 text-amber-300' : 'text-emerald-900 fill-emerald-950'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-lg rounded-3xl border-2 border-emerald-400/40 shadow-2xl p-6 md:p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-emerald-300/60 hover:text-emerald-100 p-1.5 rounded-xl hover:bg-emerald-900/50"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={artisan.avatar} alt={artisan.name} className="w-12 h-12 rounded-xl object-cover border border-emerald-400/40" />
              <div>
                <span className="text-xs text-emerald-400 font-bold block">RATE COMPLETED JOB</span>
                <h3 className="font-heading font-bold text-lg text-emerald-50">{artisan.name}</h3>
              </div>
            </div>

            <p className="text-xs text-emerald-200/80 mb-5 leading-relaxed">
              Your feedback is verified and helps build {artisan.ownerName.split(' ')[0]}'s digital trust score on KAIRO!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Overall Star Rating */}
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-center">
                <span className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">Overall Job Rating</span>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setOverallRating(star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= overallRating ? 'fill-amber-300 text-amber-300' : 'text-emerald-900 fill-emerald-950'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="block text-xs text-amber-300 font-bold mt-2">
                  {overallRating === 5 && 'Excellent / 5 Stars'}
                  {overallRating === 4 && 'Good / 4 Stars'}
                  {overallRating === 3 && 'Average / 3 Stars'}
                  {overallRating <= 2 && 'Needs Improvement'}
                </span>
              </div>

              {/* Sub-Criteria Rating Bars */}
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/20 divide-y divide-emerald-500/10">
                <RenderStarSelector label="Quality of Work" value={qualityRating} onChange={setQualityRating} />
                <RenderStarSelector label="Professionalism" value={profRating} onChange={setProfRating} />
                <RenderStarSelector label="Communication" value={commRating} onChange={setCommRating} />
                <RenderStarSelector label="Value for Money" value={valueRating} onChange={setValueRating} />
              </div>

              {/* Written Review Text */}
              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">
                  Written Customer Review
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Fixed my generator the same day. Explained the problem clearly and arrived when promised."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full glass-input rounded-xl p-3 text-xs placeholder-emerald-400/40 resize-none"
                />
              </div>

              <button
                type="submit"
                className="emerald-button-gradient w-full py-3 rounded-xl text-sm font-bold text-emerald-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
              >
                <ThumbsUp className="w-4 h-4 fill-emerald-950" />
                <span>Submit Verified Review</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <Award className="w-8 h-8 text-amber-300" />
            </div>

            <h3 className="font-heading font-extrabold text-2xl text-emerald-100">
              Thank You!
            </h3>

            <p className="text-xs text-emerald-200 leading-relaxed">
              Your rating has been verified and added to {artisan.name}'s KAIRO trust score.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
