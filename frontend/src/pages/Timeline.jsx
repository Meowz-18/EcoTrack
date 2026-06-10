/**
 * @file Timeline page component for EcoTrack.
 * Environmental milestones with Google Calendar sync and status indicators.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CalendarPlus, CheckCircle2, Clock, ArrowRight, ExternalLink, Leaf } from 'lucide-react';
import { TIMELINE_EVENTS } from '../constants';
import { formatGoogleCalendarDate, openGoogleCalendarEvent } from '../utils/helpers';

const statusIcons = {
  Completed: CheckCircle2,
  Ongoing: Clock,
  Upcoming: Calendar,
};

const statusColors = {
  Completed: 'text-slate-400 bg-slate-50 border-slate-200',
  Ongoing: 'text-brand-primary bg-emerald-50 border-emerald-200',
  Upcoming: 'text-blue-500 bg-blue-50 border-blue-200',
};

const Timeline = React.memo(() => {
  const handleAddToCalendar = (event) => {
    const dates = formatGoogleCalendarDate(event.date);
    openGoogleCalendarEvent(
      event.title,
      dates,
      `${event.type} environmental event tracked by EcoTrack. Stay informed and take action for our planet!`
    );
  };

  return (
    <article className="px-6 md:px-12 lg:px-20 pt-12 pb-24 relative z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-sm">
              <Calendar size={20} className="text-emerald-700" aria-hidden="true" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Green Timeline</h2>
          </div>
          <p className="text-slate-500 font-medium">
            Track key global and local environmental milestones and sync events directly with your{' '}
            <span className="font-extrabold text-emerald-800">Google Calendar</span>.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-emerald-300 to-emerald-100/10" aria-hidden="true" />

          <div className="space-y-8" role="list" aria-label="Environmental timeline">
            {TIMELINE_EVENTS.map((event, i) => {
              const StatusIcon = statusIcons[event.status];
              return (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  className="relative pl-16 md:pl-20"
                  role="listitem"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-4 md:left-6 w-5 h-5 rounded-full border-2 z-10 ${
                    event.status === 'Ongoing' ? 'bg-emerald-600 border-emerald-600 animate-pulse' :
                    event.status === 'Completed' ? 'bg-slate-350 border-slate-350' :
                    'bg-white border-emerald-400'
                  }`} aria-hidden="true" />

                  <div className="premium-card p-6 md:p-8 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                          <time className="text-xs text-slate-400 font-bold uppercase tracking-wider" dateTime={new Date(event.date).toISOString()}>
                            {event.date}
                          </time>
                          <span className={`category-badge text-[10px] font-black uppercase tracking-wider ${statusColors[event.status]} border`}>
                            <StatusIcon size={11} aria-hidden="true" />
                            {event.status}
                          </span>
                          <span className="category-badge text-[10px] font-black uppercase tracking-wider bg-white/50 text-slate-500 border-slate-200/50 border">
                            {event.type}
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-slate-800 tracking-tight">{event.title}</h4>
                      </div>

                      {event.status !== 'Completed' && (
                        <button
                          onClick={() => handleAddToCalendar(event)}
                          className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-emerald-250/20 text-emerald-800 text-xs font-black uppercase tracking-wider hover:bg-emerald-600 hover:text-white hover:border-transparent transition-all focus-ring hover:scale-[1.03]"
                          aria-label={`Add ${event.title} to Google Calendar`}
                        >
                          <CalendarPlus size={14} aria-hidden="true" />
                          <span>Add to Calendar</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Google Calendar CTA */}
        <motion.div
          className="mt-16 premium-card p-10 md:p-12 text-center bg-gradient-to-br from-emerald-900 to-teal-950 text-white relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px]" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-teal-500/10 rounded-full blur-[60px]" />
          
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6 relative z-10">
            <Leaf size={24} className="text-emerald-350 animate-float" aria-hidden="true" />
          </div>
          
          <h3 className="text-2xl font-black text-white tracking-tight mb-3 relative z-10">Sync Your Green Actions</h3>
          <p className="text-emerald-200 mb-8 max-w-lg mx-auto relative z-10 text-sm font-medium leading-relaxed">
            Integrate environmental milestones directly with your Google Calendar to stay organized and proactive.
          </p>
          <div className="relative z-10">
            <a
              href="https://calendar.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-emerald-950 rounded-2xl font-extrabold text-sm shadow-xl hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              <Calendar size={16} aria-hidden="true" />
              Open Google Calendar
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </article>
  );
});

Timeline.displayName = 'Timeline';

export default Timeline;
