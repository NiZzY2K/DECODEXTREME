import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ArrowRight, Shield, Users, User, Calendar, ExternalLink, RefreshCw } from 'lucide-react';

const SESSIONS = [
  { id: 'awareness', title: '12 OCT / Awareness Session', date: '12 October 2026', time: '8:00 PM - 10:00 PM', platform: 'Zoom (Open to Everyone)' },
  { id: 'fundamentals', title: '14 OCT / Programming Fundamentals', date: '14 October 2026', time: '8:00 PM - 10:00 PM', platform: 'Zoom (Open to Everyone)' },
  { id: 'strategy', title: '21 OCT / Advanced Strategy', date: '21 October 2026', time: '8:00 PM - 10:00 PM', platform: 'Zoom (Open to Everyone)' },
];

const RegistrationModal = ({ isOpen, onClose, defaultType = 'individual', defaultSession = 'awareness' }) => {
  const [regType, setRegType] = useState(defaultType); // 'individual' or 'team'
  const [step, setStep] = useState(1); // 1: details, 2: review, 3: confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refCode, setRefCode] = useState('');

  // Individual Form State
  const [indivForm, setIndivForm] = useState({
    session: defaultSession,
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    agreeConsent: false
  });

  // Team Form State (3 SLTC members)
  const [teamForm, setTeamForm] = useState({
    teamName: '',
    m1_name: '', m1_email: '', m1_phone: '', m1_id: '',
    m2_name: '', m2_email: '', m2_phone: '', m2_id: '',
    m3_name: '', m3_email: '', m3_phone: '', m3_id: '',
    agreeConsent: false
  });

  const [errors, setErrors] = useState({});

  const [prevDefaultType, setPrevDefaultType] = useState(defaultType);
  if (defaultType !== prevDefaultType) {
    setPrevDefaultType(defaultType);
    if (defaultType === 'individual' || defaultType === 'team') {
      setRegType(defaultType);
    }
  }

  const [prevDefaultSession, setPrevDefaultSession] = useState(defaultSession);
  if (defaultSession !== prevDefaultSession) {
    setPrevDefaultSession(defaultSession);
    if (defaultSession) {
      setIndivForm((prev) => ({ ...prev, session: defaultSession }));
    }
  }

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setStep(1);
        setErrors({});
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateIndividual = () => {
    const errs = {};
    if (!indivForm.fullName.trim()) errs.fullName = 'Full name is required';
    if (!indivForm.email.includes('@')) errs.email = 'Valid email is required';
    if (!indivForm.phone.trim()) errs.phone = 'WhatsApp number is required';
    if (!indivForm.institution.trim()) errs.institution = 'Institution is required';
    if (!indivForm.agreeConsent) errs.agreeConsent = 'Consent agreement is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateTeam = () => {
    const errs = {};
    if (!teamForm.teamName.trim()) errs.teamName = 'Team name is required';
    if (!teamForm.m1_name.trim()) errs.m1_name = 'Captain name is required';
    if (!teamForm.m1_email.includes('@')) errs.m1_email = 'Valid email is required';
    if (!teamForm.m1_phone.trim()) errs.m1_phone = 'WhatsApp is required';
    if (!teamForm.m1_id.trim()) errs.m1_id = 'SLTC ID is required';

    if (!teamForm.m2_name.trim()) errs.m2_name = 'Member 2 name is required';
    if (!teamForm.m2_email.includes('@')) errs.m2_email = 'Valid email is required';
    if (!teamForm.m2_phone.trim()) errs.m2_phone = 'WhatsApp is required';
    if (!teamForm.m2_id.trim()) errs.m2_id = 'SLTC ID is required';

    if (!teamForm.m3_name.trim()) errs.m3_name = 'Member 3 name is required';
    if (!teamForm.m3_email.includes('@')) errs.m3_email = 'Valid email is required';
    if (!teamForm.m3_phone.trim()) errs.m3_phone = 'WhatsApp is required';
    if (!teamForm.m3_id.trim()) errs.m3_id = 'SLTC ID is required';

    if (!teamForm.agreeConsent) errs.agreeConsent = 'Consent agreement is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (regType === 'individual') {
      if (validateIndividual()) setStep(2);
    } else {
      if (validateTeam()) setStep(2);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedCode = `DX-${regType === 'individual' ? 'IND' : 'TEAM'}-${Math.floor(100000 + Math.random() * 900000)}`;
      setRefCode(generatedCode);
      setStep(3);
    }, 900);
  };

  const resetModal = () => {
    setStep(1);
    setErrors({});
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) resetModal();
      }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl my-8 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden hud-bracket text-slate-900 max-h-[90vh] flex flex-col">
        
        {/* Modal Top Bar (Sticky) */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
            <span className="font-mono text-xs font-bold text-[var(--color-primary)] tracking-widest uppercase">
              ANIMUS PROTOCOL // REGISTRATION ENGINE
            </span>
          </div>
          <button
            onClick={resetModal}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content (Scrollable) */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          
          {/* Step 1: Form Filling */}
          {step === 1 && (
            <div>
              {/* Type Switcher Tabs */}
              <div className="grid grid-cols-2 gap-3 mb-8 p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => { setRegType('individual'); setErrors({}); }}
                  className={`py-3 px-4 rounded-lg font-display text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                    regType === 'individual'
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User size={16} /> Individual Session
                </button>
                <button
                  type="button"
                  onClick={() => { setRegType('team'); setErrors({}); }}
                  className={`py-3 px-4 rounded-lg font-display text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                    regType === 'team'
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users size={16} /> PreXtreme Team (SLTC)
                </button>
              </div>

              {regType === 'individual' ? (
                /* Individual Session Form */
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-600 mb-2">Select Session</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {SESSIONS.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => setIndivForm({ ...indivForm, session: s.id })}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            indivForm.session === s.id
                              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-slate-900 shadow-sm'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-xs font-bold text-slate-900 mb-1">{s.title}</div>
                          <div className="text-[11px] text-slate-500">{s.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-600 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        value={indivForm.fullName}
                        onChange={(e) => setIndivForm({ ...indivForm, fullName: e.target.value })}
                        placeholder="e.g. Kasun Perera"
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white text-sm"
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-600 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        value={indivForm.email}
                        onChange={(e) => setIndivForm({ ...indivForm, email: e.target.value })}
                        placeholder="e.g. kasun@gmail.com"
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white text-sm"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-600 mb-1.5">WhatsApp Mobile Number *</label>
                      <input
                        type="tel"
                        value={indivForm.phone}
                        onChange={(e) => setIndivForm({ ...indivForm, phone: e.target.value })}
                        placeholder="+94 77 123 4567"
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white text-sm"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-600 mb-1.5">University / Institution *</label>
                      <input
                        type="text"
                        value={indivForm.institution}
                        onChange={(e) => setIndivForm({ ...indivForm, institution: e.target.value })}
                        placeholder="e.g. SLTC Research University"
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white text-sm"
                      />
                      {errors.institution && <p className="text-red-500 text-xs mt-1">{errors.institution}</p>}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={indivForm.agreeConsent}
                        onChange={(e) => setIndivForm({ ...indivForm, agreeConsent: e.target.checked })}
                        className="mt-1 accent-[var(--color-primary)]"
                      />
                      <span className="text-xs text-slate-600 leading-relaxed">
                        I agree to receive event communications and WhatsApp session link updates from the DecodeXtreme organizing team. (Free entry · No IEEE membership required).
                      </span>
                    </label>
                    {errors.agreeConsent && <p className="text-red-500 text-xs mt-1">{errors.agreeConsent}</p>}
                  </div>
                </div>
              ) : (
                /* PreXtreme 3-Member Team Challenge Form */
                <div className="space-y-6">
                  <div className="p-3.5 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-xs text-slate-700 flex items-center gap-3">
                    <Shield className="text-[var(--color-primary)] shrink-0" size={18} />
                    <span>PreXtreme Challenge: Exclusively for teams of exactly 3 SLTC undergraduates on 24 October (HackerRank, 9:00 AM - 6:00 PM).</span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-600 mb-1.5">Team Name *</label>
                    <input
                      type="text"
                      value={teamForm.teamName}
                      onChange={(e) => setTeamForm({ ...teamForm, teamName: e.target.value })}
                      placeholder="e.g. NullPointers"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white text-sm"
                    />
                    {errors.teamName && <p className="text-red-500 text-xs mt-1">{errors.teamName}</p>}
                  </div>

                  {/* Member 1 / Captain */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                    <div className="text-xs font-mono text-[var(--color-primary)] uppercase font-bold tracking-wider">
                      MEMBER 1 / TEAM CAPTAIN
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={teamForm.m1_name}
                        onChange={(e) => setTeamForm({ ...teamForm, m1_name: e.target.value })}
                        className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)]"
                      />
                      <input
                        type="email"
                        placeholder="Email Address *"
                        value={teamForm.m1_email}
                        onChange={(e) => setTeamForm({ ...teamForm, m1_email: e.target.value })}
                        className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)]"
                      />
                      <input
                        type="tel"
                        placeholder="WhatsApp Number *"
                        value={teamForm.m1_phone}
                        onChange={(e) => setTeamForm({ ...teamForm, m1_phone: e.target.value })}
                        className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)]"
                      />
                      <input
                        type="text"
                        placeholder="SLTC Student ID *"
                        value={teamForm.m1_id}
                        onChange={(e) => setTeamForm({ ...teamForm, m1_id: e.target.value })}
                        className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)]"
                      />
                    </div>
                    {errors.m1_name && <p className="text-red-500 text-xs">{errors.m1_name}</p>}
                  </div>

                  {/* Member 2 */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                    <div className="text-xs font-mono text-slate-600 uppercase font-bold tracking-wider">
                      MEMBER 2
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={teamForm.m2_name}
                        onChange={(e) => setTeamForm({ ...teamForm, m2_name: e.target.value })}
                        className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)]"
                      />
                      <input
                        type="email"
                        placeholder="Email Address *"
                        value={teamForm.m2_email}
                        onChange={(e) => setTeamForm({ ...teamForm, m2_email: e.target.value })}
                        className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)]"
                      />
                      <input
                        type="tel"
                        placeholder="WhatsApp Number *"
                        value={teamForm.m2_phone}
                        onChange={(e) => setTeamForm({ ...teamForm, m2_phone: e.target.value })}
                        className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)]"
                      />
                      <input
                        type="text"
                        placeholder="SLTC Student ID *"
                        value={teamForm.m2_id}
                        onChange={(e) => setTeamForm({ ...teamForm, m2_id: e.target.value })}
                        className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)]"
                      />
                    </div>
                  </div>

                  {/* Member 3 */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                    <div className="text-xs font-mono text-slate-600 uppercase font-bold tracking-wider">
                      MEMBER 3
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={teamForm.m3_name}
                        onChange={(e) => setTeamForm({ ...teamForm, m3_name: e.target.value })}
                        className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)]"
                      />
                      <input
                        type="email"
                        placeholder="Email Address *"
                        value={teamForm.m3_email}
                        onChange={(e) => setTeamForm({ ...teamForm, m3_email: e.target.value })}
                        className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)]"
                      />
                      <input
                        type="tel"
                        placeholder="WhatsApp Number *"
                        value={teamForm.m3_phone}
                        onChange={(e) => setTeamForm({ ...teamForm, m3_phone: e.target.value })}
                        className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)]"
                      />
                      <input
                        type="text"
                        placeholder="SLTC Student ID *"
                        value={teamForm.m3_id}
                        onChange={(e) => setTeamForm({ ...teamForm, m3_id: e.target.value })}
                        className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--color-primary)]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={teamForm.agreeConsent}
                        onChange={(e) => setTeamForm({ ...teamForm, agreeConsent: e.target.checked })}
                        className="mt-1 accent-[var(--color-primary)]"
                      />
                      <span className="text-xs text-slate-600 leading-relaxed">
                        Captain confirms all 3 members are current SLTC undergraduates and agree to PreXtreme challenge rules.
                      </span>
                    </label>
                    {errors.agreeConsent && <p className="text-red-500 text-xs mt-1">{errors.agreeConsent}</p>}
                  </div>
                </div>
              )}

              {/* Action */}
              <div className="flex justify-end pt-8 border-t border-slate-200 mt-8">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3.5 bg-[var(--color-primary)] text-white rounded-full font-display font-bold uppercase tracking-wider text-xs flex items-center gap-3 hover:bg-[var(--color-electric-aqua)] transition-all shadow-sm"
                >
                  Continue to Review <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Review Screen */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-xl font-display font-bold text-slate-900">Review Registration Details</h3>
                <p className="text-xs text-slate-500 font-mono mt-1">Please verify all entered details before finalizing submission.</p>
              </div>

              {regType === 'individual' ? (
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-sm">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Selected Event:</span>
                    <span className="text-[var(--color-primary)] font-bold">{SESSIONS.find(s => s.id === indivForm.session)?.title}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Full Name:</span>
                    <span className="text-slate-900 font-medium">{indivForm.fullName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Email Address:</span>
                    <span className="text-slate-900 font-medium">{indivForm.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">WhatsApp Mobile:</span>
                    <span className="text-slate-900 font-medium">{indivForm.phone}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Institution:</span>
                    <span className="text-slate-900 font-medium">{indivForm.institution}</span>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-sm">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Event:</span>
                    <span className="text-[var(--color-primary)] font-bold">PreXtreme 9-Hour Challenge</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Team Name:</span>
                    <span className="text-slate-900 font-bold">{teamForm.teamName}</span>
                  </div>
                  <div className="py-2 border-b border-slate-200">
                    <span className="text-slate-500 block text-xs">Captain:</span>
                    <span className="text-slate-900">{teamForm.m1_name} ({teamForm.m1_id}) · {teamForm.m1_phone}</span>
                  </div>
                  <div className="py-2 border-b border-slate-200">
                    <span className="text-slate-500 block text-xs">Member 2:</span>
                    <span className="text-slate-900">{teamForm.m2_name} ({teamForm.m2_id}) · {teamForm.m2_phone}</span>
                  </div>
                  <div className="py-2">
                    <span className="text-slate-500 block text-xs">Member 3:</span>
                    <span className="text-slate-900">{teamForm.m3_name} ({teamForm.m3_id}) · {teamForm.m3_phone}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2.5 rounded-full border border-slate-300 text-xs font-mono uppercase tracking-wider text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Back &amp; Edit
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="px-8 py-3.5 bg-[var(--color-primary)] text-white rounded-full font-display font-bold uppercase tracking-wider text-xs flex items-center gap-3 hover:bg-[var(--color-electric-aqua)] transition-all shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Submitting to Roster...
                    </>
                  ) : (
                    <>
                      Confirm &amp; Submit Registration <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation Screen */}
          {step === 3 && (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/15 border border-[var(--color-primary)] flex items-center justify-center mx-auto text-[var(--color-primary)]">
                <CheckCircle size={32} />
              </div>

              <div>
                <span className="text-xs font-mono uppercase text-[var(--color-primary)] tracking-widest font-bold">[ REGISTRATION CONFIRMED ]</span>
                <h3 className="text-3xl font-display font-bold text-slate-900 mt-1">Successfully Registered!</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto mt-2">
                  Your record has been securely preserved in the DecodeXtreme participant register.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-sm mx-auto">
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Reference Code</div>
                <div className="text-2xl font-mono font-bold text-[var(--color-primary)] mt-1">{refCode}</div>
              </div>

              <p className="text-xs text-slate-500 font-mono max-w-md mx-auto">
                Delegate team will follow up via WhatsApp group with platform links (Zoom / HackerRank) and instructions prior to event day.
              </p>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={resetModal}
                  className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  Close &amp; Return to Website
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
