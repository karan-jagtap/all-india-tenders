import React, { useState } from 'react';
import { Mail, Send, MessageSquare, User, Phone, CheckCircle2, AlertCircle, Clock, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FeedbackSubject } from '../../../types';

export const HomeFeedbackContactSection: React.FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState<FeedbackSubject>(FeedbackSubject.FEEDBACK);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage(t('home.feedback.errorMessage'));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          subject: subject.trim(),
          message: message.trim()
        })
      });

      const data = await response.json();
      if (!response.ok) {
        let errorMsg = 'Failed to submit feedback.';
        if (typeof data.detail === 'string') {
          errorMsg = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMsg = data.detail.map((item: any) => item.msg || JSON.stringify(item)).join(', ');
        } else if (typeof data.message === 'string') {
          errorMsg = data.message;
        }
        throw new Error(errorMsg);
      }

      setSuccessMessage(data.message || t('home.feedback.successMessage'));
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setSubject(FeedbackSubject.FEEDBACK);
    } catch (err: any) {
      console.error('Feedback submission error:', err);
      setErrorMessage(err.message || 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="feedback-contact-section" className="bg-white dark:bg-[#0E1422] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm transition-colors">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Direct Ingestion & Trust Assurances */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-orange-100 dark:bg-orange-950/60 text-orange-900 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
              <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span>{t('home.feedback.badge')}</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('home.feedback.title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('home.feedback.subtitle')}
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            {/* Direct Email Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131A2B] border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  {t('home.feedback.directResponse')}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                  {t('home.feedback.immediateNotification')}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  {t('home.feedback.notificationDesc')}
                </span>
              </div>
            </div>

            {/* Quick Response */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131A2B] border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  {t('home.feedback.responseSla')}
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  {t('home.feedback.usuallyReplies')}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  {t('home.feedback.techSupport')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Feedback Interactive Form */}
        <div className="lg:col-span-7 bg-slate-50/70 dark:bg-[#131A2B]/70 border border-slate-200/80 dark:border-slate-800/90 rounded-xl p-5 sm:p-7 shadow-xs">
          {successMessage ? (
            <div className="py-8 text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t('home.feedback.submissionReceived')}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {successMessage}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  {t('home.feedback.notificationDesc')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMessage(null)}
                className="mt-4 px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              >
                {t('home.feedback.sendAnother')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="feedback-name" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('home.feedback.yourFullName')} <span className="text-orange-500">*</span></span>
                  </label>
                  <input
                    id="feedback-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('home.feedback.fullNamePlaceholder')}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0E1422] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="feedback-email" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('home.feedback.emailAddress')} <span className="text-orange-500">*</span></span>
                  </label>
                  <input
                    id="feedback-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('home.feedback.emailPlaceholder')}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0E1422] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Phone & Subject Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="feedback-phone" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('home.feedback.mobileWhatsApp')}</span>
                  </label>
                  <input
                    id="feedback-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('home.feedback.phoneOptional')}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0E1422] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="feedback-subject" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('home.feedback.feedbackSubject')}
                  </label>
                  <select
                    id="feedback-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as FeedbackSubject)}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0E1422] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value={FeedbackSubject.FEEDBACK}>{FeedbackSubject.FEEDBACK}</option>
                    <option value={FeedbackSubject.CONTACT_US}>{FeedbackSubject.CONTACT_US}</option>
                  </select>
                </div>
              </div>

              {/* Message Field */}
              <div className="space-y-1.5">
                <label htmlFor="feedback-message" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('home.feedback.messageDetails')} <span className="text-orange-500">*</span></span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {t('home.feedback.charactersCount',  { count: message.length })}
                  </span>
                </label>
                <textarea
                  id="feedback-message"
                  required
                  rows={4}
                  maxLength={5000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    subject === 'Contact Us'
                      ? t('home.feedback.contactUsPlaceholder')
                      : t('home.feedback.feedbackPlaceholder')
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0E1422] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t('home.feedback.submitting')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>
                        {subject === 'Contact Us'
                          ? t('home.feedback.submitContactRequest')
                          : t('home.feedback.submitFeedback')}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
