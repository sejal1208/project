import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { MessageCircle, Send, BookOpen, Sparkles, User, Bot, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function GitaChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Namaste! 🙏 I am your Bhagavad Gita guide. Ask me anything about the teachings of Lord Krishna, dharma, karma, or spiritual wisdom from the Gita. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isLoading]);

  // Bhagavad Gita knowledge base for responses
  const getGitaResponse = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Keywords and responses based on Bhagavad Gita teachings
    if (message.includes('dharma') || message.includes('duty')) {
      return `🌟 **Dharma** is one of the central teachings in the Gita. Lord Krishna teaches Arjuna:

"Better is one's own dharma, though imperfectly performed, than the dharma of another well performed. Death in one's own dharma is better; the dharma of another is fraught with danger." (3.35)

Your dharma is your righteous duty based on your nature and circumstances. It's about doing what is right according to your role in life, without attachment to results.

Would you like to know more about how to discover your personal dharma?`;
    }
    
    if (message.includes('karma') || message.includes('action')) {
      return `⚡ **Karma Yoga** is the path of selfless action. Krishna teaches:

"You have a right to perform your prescribed duty, but not to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty." (2.47)

This means:
• Perform your duties without attachment to results
• Act with dedication but without ego
• Offer all actions to the Divine
• Focus on the process, not the outcome

The key is **Nishkama Karma** - desireless action. How can I help you apply this in your daily life?`;
    }
    
    if (message.includes('detachment') || message.includes('attachment')) {
      return `🧘 **Detachment** (Vairagya) is freedom from attachment, not indifference:

"One who is not disturbed by the incessant flow of desires—that enter like rivers into the ocean, which is ever being filled but is always still—can alone achieve peace, and not the man who strives to satisfy such desires." (2.70)

True detachment means:
• Acting without being bound by outcomes
• Maintaining inner peace regardless of external circumstances
• Loving without possessiveness
• Working without ego-involvement

It's about being fully engaged while remaining internally free. What specific attachment would you like guidance on releasing?`;
    }
    
    if (message.includes('meditation') || message.includes('yoga')) {
      return `🧘‍♀️ **Yoga** in the Gita means union with the Divine. Krishna describes several paths:

**Dhyana Yoga (Meditation):**
"When the mind, restrained through the practice of yoga, becomes still, and when, seeing the Self by the self, one is satisfied in the Self alone..." (6.20)

**Key practices:**
• Regular meditation to still the mind
• Pranayama (breath control)
• Concentration on the Divine
• Cultivating inner stillness

"A person is said to be established in self-realization and is called a yogi when he is fully satisfied by virtue of acquired knowledge and realization." (6.8)

Would you like specific meditation techniques from the Gita?`;
    }
    
    if (message.includes('surrender') || message.includes('devotion') || message.includes('bhakti')) {
      return `🙏 **Surrender** (Sharanagati) is the ultimate teaching:

"Abandon all varieties of dharmas and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear." (18.66)

This doesn't mean inaction, but rather:
• Offering all actions to Krishna
• Accepting whatever comes as Divine will
• Acting with love and devotion
• Trusting in Divine providence

**Bhakti Yoga** (Path of Devotion) includes:
• Constant remembrance of the Divine
• Loving service without expectation
• Seeing God in all beings
• Complete self-surrender

How would you like to cultivate more devotion in your spiritual practice?`;
    }
    
    if (message.includes('fear') || message.includes('anxiety') || message.includes('worry')) {
      return `💪 The Gita offers profound wisdom for overcoming fear:

"The person who is not disturbed by happiness and distress and is steady in both is certainly eligible for liberation." (2.15)

**For conquering fear:**
• Remember your eternal nature - you are the soul, not just the body
• Practice surrendering outcomes to the Divine
• Focus on your duty without attachment to results
• Cultivate equanimity in success and failure

"When a man thinks of objects, attachment for them arises; from attachment desire is born; from desire anger arises." (2.62)

The root of fear is often attachment. By practicing detachment and trust in Divine will, fear naturally dissolves.

What specific fears would you like guidance on overcoming?`;
    }
    
    if (message.includes('purpose') || message.includes('meaning') || message.includes('life')) {
      return `🎯 The Gita reveals the **ultimate purpose of life**:

"The Supreme Lord is situated in everyone's heart, O Arjuna, and is directing the wanderings of all living entities..." (18.61)

**Your life's purpose involves:**
• Self-realization - knowing your true nature as the eternal soul
• Serving the Divine through your unique talents and circumstances
• Purifying your consciousness through righteous action
• Ultimately returning to your spiritual home

"Whatever you do, whatever you eat, whatever you offer in sacrifice, whatever you give away, whatever austerities you practice—do that as an offering to the Supreme." (9.27)

Every action can become a spiritual practice when done with the right consciousness. What aspect of your life's purpose would you like to explore?`;
    }
    
    if (message.includes('suffering') || message.includes('pain') || message.includes('difficulty')) {
      return `🌅 The Gita teaches that suffering comes from attachment and ignorance:

"Now I am confused about my duty and have lost all composure because of miserly weakness. In this condition I am asking You to tell me for certain what is best for me." (2.7)

**Understanding suffering:**
• It arises from attachment to temporary things
• It's often a teacher, guiding us toward wisdom
• The eternal soul cannot actually be harmed
• Difficulties test and strengthen our spiritual resolve

"The material miseries derive from the senses. O son of Kunti, such pleasures have a beginning and an end, and so the wise man does not delight in them." (5.22)

True happiness comes from within, not from external circumstances. How can I help you find peace amidst your current challenges?`;
    }
    
    if (message.includes('work') || message.includes('job') || message.includes('career')) {
      return `💼 The Gita transforms ordinary work into spiritual practice:

"It is better to engage in one's own occupation, even though one may perform it imperfectly, than to accept another's occupation and perform it perfectly." (18.47)

**Spiritual approach to work:**
• See your work as service to the Divine
• Perform duties without attachment to salary or recognition
• Maintain integrity and compassion in all dealings
• Use your skills to serve others

"Whatever action is performed by a great man, common men follow. And whatever standards he sets by exemplary acts, all the world pursues." (3.21)

Your work becomes a form of worship when done with the right consciousness. How can I help you find more spiritual meaning in your career?`;
    }
    
    if (message.includes('relationships') || message.includes('family') || message.includes('love')) {
      return `💕 The Gita teaches **divine love** through human relationships:

"I am in everyone's heart as the Supersoul. As soon as one desires to worship the demigods, I make his faith steady so that he can devote himself to that particular deity." (7.21)

**Spiritual relationships involve:**
• Seeing the Divine in every person
• Loving without possessiveness or control
• Supporting others' spiritual growth
• Practicing forgiveness and compassion

"One who sees Me everywhere and sees everything in Me never becomes lost to Me, nor do I become lost to him." (6.30)

True love is seeing God in your beloved and helping each other grow spiritually. What relationship challenge would you like guidance on?`;
    }
    
    if (message.includes('death') || message.includes('afterlife') || message.includes('rebirth')) {
      return `🔄 The Gita reveals the eternal nature of the soul:

"For the soul there is neither birth nor death nor, having once been, does he ever cease to be. He is unborn, eternal, permanent and primeval. He is not slain when the body is slain." (2.20)

**Understanding death:**
• Only the body dies; the soul is eternal
• Death is like changing clothes - the soul takes a new body
• Your consciousness at death determines your next life
• Regular spiritual practice prepares you for a peaceful transition

"And whoever, at the end of his life, quits his body, remembering Me alone, at once attains My nature. Of this there is no doubt." (8.5)

Death is not the end but a doorway. The key is to live consciously and remember the Divine. Would you like to know more about preparing for a spiritual death?`;
    }
    
    // Default responses for general queries
    const generalResponses = [
      `🙏 That's a beautiful question! The Bhagavad Gita teaches us that all spiritual inquiry leads to wisdom. Could you be more specific about what aspect of Krishna's teachings you'd like to explore?

Some popular topics include:
• Dharma and righteous living
• Karma Yoga and selfless action  
• Meditation and spiritual practice
• Overcoming fear and anxiety
• Finding life's purpose
• Dealing with relationships and work

What calls to your heart today?`,

      `📖 The Gita contains 700 verses of timeless wisdom! Your question touches on the vast ocean of Krishna's teachings. 

Here are some key principles that might help:
• Everything happens for our spiritual growth
• We are eternal souls having a temporary human experience  
• True happiness comes from within, not from external circumstances
• Every action can be a form of worship when done with love

Could you share more about what you're seeking guidance on?`,

      `✨ Krishna teaches that sincere inquiry itself is a form of spiritual practice. Your question shows a seeking heart!

The Gita's main message is that we can find peace and purpose by:
• Understanding our true spiritual nature
• Acting without attachment to results
• Cultivating love and devotion
• Seeing the Divine in all beings

What specific area of your spiritual journey would you like to explore deeper?`
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const botResponse = await getGitaResponse(inputMessage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I\'m having trouble accessing the sacred texts right now. Please try again in a moment. Om Shanti! 🙏',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full w-14 h-14 shadow-lg"
        >
          <BookOpen className="w-6 h-6" />
        </Button>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] z-50">
      <Card className="h-full flex flex-col shadow-2xl border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-lg">Gita Guide</CardTitle>
                <p className="text-xs text-orange-100">Bhagavad Gita Q&A</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-none">
                <Sparkles className="w-3 h-3 mr-1" />
                AI
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/10 h-6 w-6 p-0"
              >
                ✕
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-orange-600" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.text}
                    </div>
                    <div className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-orange-100' : 'text-slate-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {message.sender === 'user' && (
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="bg-slate-100 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Consulting the sacred texts...</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t p-4 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about dharma, karma, meditation..."
                className="flex-1 border-orange-200 focus:border-orange-400"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Powered by Bhagavad Gita wisdom • Ask about spiritual teachings
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}