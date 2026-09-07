import React, { useState } from 'react';
import { 
  HelpCircle, ChevronDown, ChevronUp, Send, CheckCircle2, 
  Phone, Mail, MessageSquare, AlertCircle, Clock
} from 'lucide-react';

export default function CitizenSupport() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [category, setCategory] = useState('Application Tracking');
  const [appId, setAppId] = useState('');
  const [message, setMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const faqs = [
    {
      q: 'How does inter-department data sharing work in GovSync Nexus?',
      a: 'GovSync Nexus connects verified government department databases via secure APIs. When you apply for a service, only the specific data fields required (such as income or academic records) are requested from the respective department after your explicit consent.'
    },
    {
      q: 'Can I revoke my consent or data permissions at any time?',
      a: 'Yes. You can navigate to "Consent & Permissions" in your citizen portal and click "Revoke" on any active permission. Once revoked, departments can no longer access your data for future checks.'
    },
    {
      q: 'What is a "Data Conflict" or discrepancy and how is it resolved?',
      a: 'A data conflict occurs when different department databases hold conflicting information about you (for example, different dates of birth or income records). An authorized officer will review both records or request a simple clarification from you to resolve the conflict.'
    },
    {
      q: 'How long does verification take across departments?',
      a: 'Automated data exchanges (such as identity or registration checks) complete within seconds. Services requiring manual officer review or board assessment typically take 1 to 3 business days.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const ticketId = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmittedTicket(ticketId);
    setMessage('');
    setAppId('');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-slate-900">Help & Support</h1>
        <p className="text-slate-600 mt-2 text-lg">
          Have questions or need assistance with your applications? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Support Channels */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Citizen Helpline</h3>
            <p className="text-xs text-slate-500 mt-1">Toll-free, Mon-Sat 9AM-6PM</p>
            <div className="text-sm font-semibold text-indigo-600 mt-2">1800-GOV-SYNC (1800-468-7962)</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Email Support</h3>
            <p className="text-xs text-slate-500 mt-1">Average response within 24h</p>
            <div className="text-sm font-semibold text-emerald-600 mt-2">support@govsync.gov.in</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Grievance Redressal</h3>
            <p className="text-xs text-slate-500 mt-1">Nexus Ombudsman & Escalations</p>
            <div className="text-sm font-semibold text-amber-600 mt-2">ombudsman@govsync.gov.in</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FAQs */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" /> Frequently Asked Questions
          </h2>

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full p-5 text-left font-bold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm sm:text-base">{faq.q}</span>
                {activeFaq === index ? (
                  <ChevronUp className="w-5 h-5 text-indigo-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              {activeFaq === index && (
                <div className="px-5 pb-5 pt-1 text-sm text-slate-600 border-t border-slate-100 leading-relaxed bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Raise a Support Ticket Form */}
        <div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" /> Raise a Support Request
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Our officer response team will review your query and reply within 1 business day.
            </p>

            {submittedTicket ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-emerald-900">Request Submitted Successfully!</h3>
                <p className="text-sm text-emerald-700 mt-1 mb-4">
                  Your ticket ID is <span className="font-mono font-bold">{submittedTicket}</span>. A confirmation has been logged.
                </p>
                <button
                  onClick={() => setSubmittedTicket(null)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Application Tracking">Application Tracking & Delays</option>
                    <option value="Data Discrepancy">Data Discrepancy / Conflict</option>
                    <option value="Consent Revocation">Consent Revocation Assistance</option>
                    <option value="Document Verification">Document Verification Issue</option>
                    <option value="Other">Other Technical Query</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Application ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GS-10821"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Describe Your Issue
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please explain the issue or question in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" /> Submit Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
