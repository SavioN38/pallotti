import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  GraduationCap,
  Bus,
  CreditCard,
  ExternalLink,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  chips?: string[];
  actionLink?: {
    label: string;
    href: string;
    isExternal?: boolean;
  };
}

interface KnowledgeItem {
  keywords: string[];
  response: string;
  actionLink?: {
    label: string;
    href: string;
    isExternal?: boolean;
  };
}

const KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    keywords: ['admission', 'admissions', 'apply', 'enroll', 'seat', 'register', 'entry', 'criteria', 'age', 'kg', 'lkg', 'ukg', 'class 1', 'standard'],
    response: `**Admissions at Pallotti Hill Public School:**\n\n• **Classes Offered:** Kindergarten (LKG & UKG) through Grade 10 (CBSE).\n• **Procedure:** Fill out the registration form available at the school office or contact the administration directly.\n• **Documents Needed:** Birth Certificate, Transfer Certificate (for Grade 2+), recent passport-size photos, and previous academic records.\n• **Inquiries:** We recommend visiting the campus during office hours (8:30 AM - 4:00 PM) for personalized counseling.`,
    actionLink: {
      label: 'Call Office for Admissions: 0495 229 66 77',
      href: 'tel:04952296677',
      isExternal: true,
    },
  },
  {
    keywords: ['fee', 'fees', 'cost', 'tuition', 'payment', 'installment', 'structure', 'charges', 'pay'],
    response: `**School Fee Structure:**\n\n• Fees are structured transparently and competitively as per CBSE norms in Kerala.\n• Payments can be made term-wise or annually directly at the school office or via online bank transfer.\n• For the exact grade-specific fee breakdown (tuition, lab, computer, and activity fees), please reach out directly to our accounts office.`,
    actionLink: {
      label: 'Call Accounts Office: 9447848489',
      href: 'tel:9447848489',
      isExternal: true,
    },
  },
  {
    keywords: ['time', 'timings', 'timing', 'hours', 'hour', 'schedule', 'working hours', 'office hours'],
    response: `**School & Office Timings:**\n\n• **School Working Hours:** Monday to Friday: 8:45 AM – 3:30 PM\n• **Kindergarten Hours:** 9:00 AM – 2:30 PM\n• **Administrative Office:** Monday to Saturday: 8:30 AM – 4:00 PM (Closed on second Saturdays & public holidays).`,
  },
  {
    keywords: ['contact', 'phone', 'call', 'email', 'number', 'mobile', 'address', 'reach', 'location', 'where', 'map', 'mukkam'],
    response: `**Contact & Location Details:**\n\n📍 **Address:** Pallotti Hill Public School, Agastianmuzhi, Mukkam, Kozhikode, Kerala 673602\n📞 **Phone:** 0495 229 66 77 / 0495 229 77 99\n📱 **Mobile:** +91 9447848489\n✉️ **Email:** pallottihillpublicschool@gmail.com`,
    actionLink: {
      label: 'Open Google Maps',
      href: 'https://maps.google.com/?q=Pallotti+Hill+Public+School+Mukkam',
      isExternal: true,
    },
  },
  {
    keywords: ['syllabus', 'cbse', 'curriculum', 'affiliation', 'board', 'academics', 'exam'],
    response: `**Curriculum & Affiliation:**\n\n• **Affiliation:** Affiliated to the Central Board of Secondary Education (CBSE), New Delhi.\n• **Medium of Instruction:** English, with Malayalam and Hindi offered as languages.\n• **Pedagogy:** NEP-aligned holistic learning with strong focus on science, mathematics, computer education, arts, sports, and moral values.`,
  },
  {
    keywords: ['bus', 'transport', 'route', 'van', 'conveyance', 'pickup', 'commute', 'travel'],
    response: `**School Transport Facility:**\n\n• Pallotti Hill operates a dedicated fleet of GPS-tracked school buses covering Mukkam, Agastianmuzhi, Karassery, Thiruvambady, Omassery, and surrounding areas.\n• Experienced drivers and dedicated attendants ensure student safety.\n• Contact the transport manager via the school office for specific route stops.`,
    actionLink: {
      label: 'Inquire Transport: 0495 229 66 77',
      href: 'tel:04952296677',
      isExternal: true,
    },
  },
  {
    keywords: ['facility', 'facilities', 'lab', 'labs', 'library', 'sports', 'ground', 'playground', 'smart class', 'activities'],
    response: `**Campus Facilities:**\n\n• 🔬 Modern Science & Computer Laboratories\n• 📚 Extensive Library & Reading Room\n• ⚽ Sprawling Sports Grounds & Play Area for KG\n• 🎨 Music, Dance, Yoga, and Karate Coaching\n• 🖥️ Interactive Smart Classrooms\n• 🛡️ 24x7 CCTV Surveillance and safe campus.`,
  },
  {
    keywords: ['management', 'pallotti', 'pallottine', 'father', 'principal', 'founder', 'vincent', 'trust', 'marian'],
    response: `**Management & Legacy:**\n\n• **Management:** Pallotti Hill Public School is founded and managed by the **Malabar Marian Trust** of the Pallottine Fathers.\n• Inspired by **St. Vincent Pallotti**, our motto is to nurture disciplined, compassionate, and intellectually enlightened global citizens.`,
  },
  {
    keywords: ['hi', 'hello', 'hey', 'greetings', 'morning', 'afternoon', 'evening', 'help'],
    response: `Hello! 👋 Welcome to Pallotti Hill Public School Assistant. How can I help you today? You can ask me about admissions, fees, timings, syllabus, transport, or contact details!`,
  },
];

const QUICK_PROMPTS = [
  'Admission procedure?',
  'Fee structure details?',
  'School & office timings?',
  'Bus / transport routes?',
  'How to contact the school?',
  'Facilities & campus?',
];

function getBotAnswer(query: string): { response: string; actionLink?: KnowledgeItem['actionLink'] } {
  const clean = query.toLowerCase().trim();

  // Score match against keywords
  let bestMatch: KnowledgeItem | null = null;
  let maxMatches = 0;

  for (const item of KNOWLEDGE_BASE) {
    let matches = 0;
    for (const kw of item.keywords) {
      if (clean.includes(kw)) {
        matches++;
      }
    }
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = item;
    }
  }

  if (bestMatch && maxMatches > 0) {
    return {
      response: bestMatch.response,
      actionLink: bestMatch.actionLink,
    };
  }

  // Fallback if no direct keyword found
  return {
    response: `Thank you for your question! For specific inquiries regarding "${query.slice(0, 40)}", our administrative office team would be delighted to assist you directly.`,
    actionLink: {
      label: 'Call Office: 0495 229 66 77',
      href: 'tel:04952296677',
      isExternal: true,
    },
  };
}

export function SchoolChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello! 👋 Welcome to **Pallotti Hill Public School**. How can I assist you today?`,
      chips: QUICK_PROMPTS.slice(0, 4),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (textToSend?: string) => {
    const q = (textToSend ?? input).trim();
    if (!q) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Simulate realistic instant assistant response delay (400-600ms)
    setTimeout(() => {
      const { response, actionLink } = getBotAnswer(q);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response,
        actionLink,
        chips: QUICK_PROMPTS.filter((p) => p.toLowerCase() !== q.toLowerCase()).slice(0, 3),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON (BOTTOM LEFT) */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2 rounded-full border border-[#d7b76d]/40 bg-[#173c46] p-2.5 sm:px-4 sm:py-3 text-white shadow-xl shadow-[#173c46]/30 transition-all duration-300 hover:scale-105 hover:bg-[#0d242b] hover:shadow-2xl hover:shadow-[#d7b76d]/20 active:scale-95"
            aria-label="Open School Assistant"
          >
            <div className="relative flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#d7b76d] text-[#173c46]">
              <MessageSquare size={16} />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#86c67a] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#86c67a]" />
              </span>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#f2d48e]">
                Quick Help
              </span>
              <span className="text-[9.5px] text-white/70 font-medium">
                Ask about Admissions & Fees
              </span>
            </div>
          </button>
        )}
      </div>

      {/* CHAT WINDOW MODAL */}
      {isOpen && (
        <div
          className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 w-[calc(100vw-32px)] sm:w-[380px] md:w-[420px] h-[560px] max-h-[85vh] rounded-2xl border border-[#b8c9c5]/60 bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/25 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
          style={{ animation: 'fadeSlideUp 300ms cubic-bezier(0.16, 1, 0.3, 1) both' }}
        >
          {/* HEADER */}
          <div className="relative bg-[#173c46] p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#d7b76d] to-[#af8742] text-[#173c46] shadow-md">
                  <Bot size={22} />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#173c46] bg-[#86c67a]" />
                </div>
                <div>
                  <h3 className="font-serif text-[16px] leading-tight text-white flex items-center gap-1.5">
                    Pallotti Assistant
                    <span className="rounded bg-[#d7b76d]/20 px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.1em] text-[#f2d48e]">
                      Online
                    </span>
                  </h3>
                  <p className="text-[10px] text-white/70">
                    Instant Answers • Admissions, Fees & Info
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* MESSAGES LIST */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8faf9]/90 text-[13px] leading-relaxed">
            {messages.map((m) => {
              const isBot = m.sender === 'bot';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                >
                  <div className={`flex gap-2 max-w-[88%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] ${
                        isBot
                          ? 'bg-[#173c46] text-[#d7b76d]'
                          : 'bg-[#d7b76d] text-[#173c46]'
                      }`}
                    >
                      {isBot ? <Bot size={13} /> : <User size={13} />}
                    </div>

                    <div
                      className={`rounded-2xl px-3.5 py-2.5 ${
                        isBot
                          ? 'bg-white text-[#173c46] border border-[#cad5d2]/70 shadow-sm rounded-tl-sm'
                          : 'bg-[#173c46] text-white rounded-tr-sm'
                      }`}
                    >
                      {/* Formatted Markdown-like text */}
                      <div className="space-y-1.5 whitespace-pre-line text-[12.5px]">
                        {m.text.split('\n').map((line, idx) => {
                          // Simple bold parsing **text**
                          const parts = line.split(/(\*\*.*?\*\*)/g);
                          return (
                            <p key={idx}>
                              {parts.map((p, pIdx) => {
                                if (p.startsWith('**') && p.endsWith('**')) {
                                  return (
                                    <strong key={pIdx} className={isBot ? 'text-[#173c46] font-semibold' : 'text-[#f2d48e] font-semibold'}>
                                      {p.slice(2, -2)}
                                    </strong>
                                  );
                                }
                                return p;
                              })}
                            </p>
                          );
                        })}
                      </div>

                      {/* ACTION LINK BUTTON */}
                      {m.actionLink && (
                        <div className="mt-3 pt-2 border-t border-black/5">
                          <a
                            href={m.actionLink.href}
                            target={m.actionLink.isExternal ? '_blank' : undefined}
                            rel={m.actionLink.isExternal ? 'noreferrer' : undefined}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#173c46] px-3 py-1.5 text-[11px] font-semibold text-[#f2d48e] transition-colors hover:bg-[#0d242b]"
                          >
                            <span>{m.actionLink.label}</span>
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* QUICK CHIPS UNDER BOT MESSAGE */}
                  {isBot && m.chips && m.chips.length > 0 && (
                    <div className="mt-2.5 ml-8 flex flex-wrap gap-1.5">
                      {m.chips.map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => handleSend(chip)}
                          className="rounded-full border border-[#b8c9c5] bg-white px-2.5 py-1 text-[10.5px] font-medium text-[#426069] transition-all hover:border-[#af8742] hover:bg-[#f2d48e]/20 hover:text-[#173c46]"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* TYPING INDICATOR */}
            {isTyping && (
              <div className="flex items-center gap-2 text-white/60">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#173c46] text-[#d7b76d]">
                  <Bot size={13} />
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white border border-[#cad5d2]/70 px-3.5 py-2.5 shadow-sm">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#af8742]" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#af8742]" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#af8742]" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* FOOTER INPUT */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-t border-[#cad5d2] bg-white p-3"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about admissions, fees, timings..."
                className="flex-1 rounded-full border border-[#cad5d2] bg-[#f8faf9] px-4 py-2.5 text-[12.5px] text-[#173c46] outline-none transition-all placeholder:text-[#426069]/60 focus:border-[#af8742] focus:bg-white"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#173c46] text-[#d7b76d] transition-all hover:bg-[#0d242b] hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>
            <div className="mt-1.5 text-center text-[9px] text-[#8da0a0]">
              Official Pallotti Hill Public School Knowledge Engine
            </div>
          </form>
        </div>
      )}
    </>
  );
}
