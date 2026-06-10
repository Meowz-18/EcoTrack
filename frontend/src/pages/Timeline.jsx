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
    <article className="px-6 md:px-12 lg:px-20 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Calendar size={28} className="text-brand-primary" aria-hidden="true" />
            <h2 className="text-3xl font-black text-slate-900">Green Timeline</h2>
          </div>
          <p className="text-slate-500 mb-10">
            Track environmental milestones and add them to your{' '}
            <span className="font-bold text-brand-primary">Google Calendar</span>.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-primary via-emerald-300 to-emerald-100" aria-hidden="true" />

          <div className="space-y-6" role="list" aria-label="Environmental timeline">
            {TIMELINE_EVENTS.map((event, i) => {
              const StatusIcon = statusIcons[event.status];
              return (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="relative pl-16 md:pl-20"
                  role="listitem"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-4 md:left-6 w-5 h-5 rounded-full border-2 ${
                    event.status === 'Ongoing' ? 'bg-brand-primary border-brand-primary animate-pulse-glow' :
                    event.status === 'Completed' ? 'bg-slate-300 border-slate-300' :
                    'bg-white border-emerald-300'
                  }`} aria-hidden="true" />

                  <div className={`premium-card p-6 bg-gradient-to-r ${event.gradient}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <time className="text-sm text-slate-400 font-medium" dateTime={new Date(event.date).toISOString()}>
                            {event.date}
                          </time>
                          <span className={`category-badge ${statusColors[event.status]} border`}>
                            <StatusIcon size={12} aria-hidden="true" />
                            {event.status}
                          </span>
                          <span className="category-badge bg-white/60 text-slate-500 border-slate-200 border">
                            {event.type}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">{event.title}</h4>
                      </div>

                      {event.status !== 'Completed' && (
                        <button
                          onClick={() => handleAddToCalendar(event)}
                          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-emerald-200 text-brand-primary text-sm font-bold hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all focus-ring"
                          aria-label={`Add ${event.title} to Google Calendar`}
                        >
                          <CalendarPlus size={16} aria-hidden="true" />
                          <span className="hidden sm:inline">Add to Calendar</span>
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
          className="mt-12 premium-card p-8 text-center bg-gradient-to-br from-emerald-50 to-teal-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Leaf size={32} className="mx-auto text-brand-primary mb-4" aria-hidden="true" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Stay on Track</h3>
          <p className="text-slate-500 mb-6 max-w-lg mx-auto">
            Sync environmental milestones with your Google Calendar to never miss an opportunity to make a difference.
          </p>
          <a
            href="https://calendar.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 btn-primary !px-8 !py-3"
          >
            <Calendar size={18} aria-hidden="true" />
            Open Google Calendar
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </article>
  );
});

Timeline.displayName = 'Timeline';

export default Timeline;
